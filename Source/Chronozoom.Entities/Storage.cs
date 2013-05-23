// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Configuration;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.Data.Entity.Migrations.Design;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    /// <summary>
    /// Storage implementation for ChronoZoom based on Entity Framework.
    /// </summary>
    public class Storage : DbContext
    {
        // Enables RI-Tree queries.
        private static Lazy<bool> _useRiTreeQuery = new Lazy<bool>(() =>
        {
            string useRiTreeQuery = ConfigurationManager.AppSettings["UseRiTreeQuery"];

            return string.IsNullOrEmpty(useRiTreeQuery) ? false : bool.Parse(useRiTreeQuery);
        });

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1810:InitializeReferenceTypeStaticFieldsInline")]
        static Storage()
        {
            Trace = new TraceSource("Storage", SourceLevels.All);
        }

        public Storage()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<Storage, StorageMigrationsConfiguration>());
            Configuration.ProxyCreationEnabled = false;
            Trace.TraceInformation("providerName: " + System.Configuration.ConfigurationManager.ConnectionStrings[0].ProviderName);
        }

        public static TraceSource Trace { get; private set; }

        public DbSet<Bitmask> Bitmasks { get; set; }

        public DbSet<Timeline> Timelines { get; set; }

        public DbSet<Exhibit> Exhibits { get; set; }

        public DbSet<ContentItem> ContentItems { get; set; }

        public DbSet<Tour> Tours { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Entities.Collection> Collections { get; set; }

        public DbSet<SuperCollection> SuperCollections { get; set; }
        
        public void CreatePostOrderIndex()
        {
            foreach (Timeline t in Timelines)
            {
                t.Successor = Guid.Empty;
                t.Predecessor = Guid.Empty;
                t.FirstNodeInSubtree = Guid.Empty;

            }
            foreach (Timeline t in Timelines)
            {
                if (t.Depth == 0)
                {
                    PostOrderTraversal(t);
                }
            }
            SaveChanges();
        }

        public void CreatePostOrderIndex(IEnumerable<Timeline> timelines)
        {
            if (timelines == null) throw new ArgumentNullException("timelines");
            foreach (Timeline t in timelines)
            {
                t.Successor = Guid.Empty;
                t.Predecessor = Guid.Empty;
                t.FirstNodeInSubtree = Guid.Empty;

            }
            foreach (Timeline t in timelines)
            {
                if (t.Depth == 0)
                {
                    PostOrderTraversal(t);
                }
            }
            SaveChanges();
        }

        private Timeline PostOrderTraversal(Timeline root)
        {
            if (root.ChildTimelines != null)
            {
                int count = root.ChildTimelines.Count;
                if (count > 0)
                {
                    Timeline rs = PostOrderTraversal(root.ChildTimelines[0]);
                    root.FirstNodeInSubtree = rs.Id;
                    for (int i = 0; i < count - 1; ++i)
                    {
                        Timeline s = PostOrderTraversal(root.ChildTimelines[i + 1]);
                        root.ChildTimelines[i].Successor = s.Id;
                        s.Predecessor = root.ChildTimelines[i].Id;
                    }
                    root.ChildTimelines[count - 1].Successor = root.Id;
                    root.Predecessor = root.ChildTimelines[count - 1].Id;
                    return rs;
                }
                else
                {
                    root.FirstNodeInSubtree = root.Id;
                    return root;
                }
            }
            else
            {
                root.FirstNodeInSubtree = root.Id;
                return root;
            }
        }

        public Collection<Timeline> TimelinesQuery(Guid collectionId, decimal startTime, decimal endTime, decimal span, Guid? commonAncestor, int maxElements)
        {
            Dictionary<Guid, Timeline> timelinesMap = new Dictionary<Guid, Timeline>();

            List<Timeline> timelines = null;
            if (_useRiTreeQuery.Value)
            {
                Trace.TraceInformation("Using RI-Tree Query");
                timelines = FillTimelinesRiTreeQuery(collectionId, timelinesMap, startTime, endTime, span, commonAncestor, ref maxElements);
            }
            else
            {
                timelines = FillTimelinesRangeQuery(collectionId, timelinesMap, startTime, endTime, span, commonAncestor, ref maxElements);
            }

            if (maxElements > 0)
            {
                FillTimelineRelations(timelinesMap, maxElements);
            }

            return new Collection<Timeline>(timelines);
        }

        public IEnumerable<TimelineRaw> TimelineSubtreeQuery(Guid collectionId, Guid? leastCommonAncestor, decimal startTime, decimal endTime, decimal minSpan, int maxElements)
        {
            IEnumerable<TimelineRaw> result;
            Dictionary<Guid?, TimelineRaw> map = new Dictionary<Guid?, TimelineRaw>();
            if (System.Configuration.ConfigurationManager.ConnectionStrings[0].ProviderName.Equals("System.Data.SqlClient"))
            {
                SqlParameter paramCollectionId = new SqlParameter
                {
                    ParameterName = "Collection_Id",
                    Value = collectionId
                };
                SqlParameter paramLCA = new SqlParameter
                {
                    ParameterName = "LCA",
                    Value = leastCommonAncestor
                };
                SqlParameter paramMinSpan = new SqlParameter
                {
                    ParameterName = "min_span",
                    Value = minSpan
                };
                SqlParameter paramStartTime = new SqlParameter
                {
                    ParameterName = "startTime",
                    Value = startTime
                };
                SqlParameter paramEndTime = new SqlParameter
                {
                    ParameterName = "endTime",
                    Value = endTime
                };
                SqlParameter paramMaxElem = new SqlParameter
                {
                    ParameterName = "max_elem",
                    Value = maxElements
                };
                result = Database.SqlQuery<TimelineRaw>("EXEC TimelineSubtreeQuery @Collection_Id, @LCA, @min_span, @startTime, @endTime, @max_elem", paramCollectionId, paramLCA, paramMinSpan, paramStartTime, paramEndTime, paramMaxElem);
            }
            else
            {
                bool return_entire_subtree = false;
                result = new Collection<TimelineRaw>();
                if (leastCommonAncestor != null)
                {
                    Timeline root = Timelines.Where(r => r.Id == leastCommonAncestor).FirstOrDefault();
                    if (root != null && root.SubtreeSize <= maxElements)
                    {
                        for (TimelineRaw c = (TimelineRaw)Timelines.Where(_c => _c.Id == root.FirstNodeInSubtree).FirstOrDefault(); c != root; c = Timelines.Where(_c => _c.Id == c.Successor).FirstOrDefault())
                        {
                            ((Collection<TimelineRaw>)result).Add(c);
                        }
                        return_entire_subtree = true;
                    }
                }
                if (!return_entire_subtree)
                {
                    Queue<TimelineRaw> q = new Queue<TimelineRaw>();
                    var init_timelines = leastCommonAncestor == null ? Database.SqlQuery<TimelineRaw>("SELECT * FROM [Timelines] WHERE [Depth] = 0 AND CollectionID = {0}", collectionId) : Database.SqlQuery<TimelineRaw>("SELECT * FROM [Timelines] WHERE [Id] = {0}", leastCommonAncestor);   // select the root element
                    foreach (TimelineRaw t in init_timelines)   //under normal circumstances this result should only contain a single timeline
                    {
                        q.Enqueue(t);
                    }
                    while (q.Count > 0 && maxElements > 0)
                    {
                        bool childGreaterThanMinspan = false;
                        TimelineRaw t = q.Dequeue();
                        var childTimelines = Database.SqlQuery<TimelineRaw>("SELECT * FROM [Timelines] WHERE [Timeline_ID] = {0}", t.Id);
                        foreach (TimelineRaw c in childTimelines)
                        {
                            if (c.ToYear - c.FromYear > minSpan)
                            {
                                childGreaterThanMinspan = true;
                                break;
                            }
                        }
                        if (childGreaterThanMinspan)
                        {
                            ((Collection<TimelineRaw>)result).Add(t);
                            --maxElements;
                            if (maxElements >= t.ChildTimelines.Count())
                            {
                                foreach (TimelineRaw c in childTimelines)
                                {
                                    --maxElements;
                                    if ((c.FromYear >= startTime && c.FromYear <= endTime) || (c.ToYear >= startTime && c.ToYear <= endTime) || (c.FromYear <= startTime && c.ToYear >= endTime) || (c.FromYear >= startTime && c.ToYear <= endTime))
                                    {   //if c overlaps with current viewport, then c may be further expanded
                                        q.Enqueue(c);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            foreach (TimelineRaw t in result)   // note: results are ordered by depth in ascending order
            {
                map.Add(t.Id, t);
                if (map.ContainsKey(t.Timeline_ID))
                {
                    map[t.Timeline_ID].ChildTimelines.Add(t);
                }
            }
            return result;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2233:OperationsShouldNotOverflow", MessageId = "FromYear+13700000001"), System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2233:OperationsShouldNotOverflow", MessageId = "ToYear+13700000001")]
        public static Int64 ForkNode(Int64 fromYear, Int64 toYear)
        {
            Int64 start = fromYear + 13700000001;  //note: this value must be a positive integer (sign bit must be 0)
            Int64 end = toYear + 13700000001;  //note: this value must be a positive integer (sign bit must be 0)
            Int64 node = ((start - 1) ^ end) >> 1;
            node = node | node >> 1;
            node = node | node >> 2;
            node = node | node >> 4;
            node = node | node >> 8;
            node = node | node >> 16;
            node = node | node >> 32;
            node = end & ~node;
            return node;
        }

        private void FillTimelineRelations(Dictionary<Guid, Timeline> timelinesMap, int maxElements)
        {
            if (!timelinesMap.Keys.Any())
                return;

            // Populate Exhibits
            string exhibitsQuery = string.Format(
                CultureInfo.InvariantCulture,
                "SELECT TOP({0}) *, Year as [Time] FROM Exhibits WHERE Timeline_Id IN ('{1}')",
                maxElements,
                string.Join("', '", timelinesMap.Keys.ToArray()));

            var exhibitsRaw = Database.SqlQuery<ExhibitRaw>(exhibitsQuery);
            Dictionary<Guid, Exhibit> exhibits = new Dictionary<Guid, Exhibit>();
            foreach (ExhibitRaw exhibitRaw in exhibitsRaw)
            {
                if (exhibitRaw.ContentItems == null)
                    exhibitRaw.ContentItems = new System.Collections.ObjectModel.Collection<ContentItem>();

                if (timelinesMap.Keys.Contains(exhibitRaw.Timeline_ID))
                {
                    timelinesMap[exhibitRaw.Timeline_ID].Exhibits.Add(exhibitRaw);
                    exhibits[exhibitRaw.Id] = exhibitRaw;
                }
            }

            if (exhibits.Keys.Any())
            {
                // Populate Content Items
                string contentItemsQuery = string.Format(
                    CultureInfo.InvariantCulture,
                    @"
                        SELECT * 
                        FROM ContentItems 
                        WHERE Exhibit_Id IN ('{0}')
                        ORDER BY [Order] ASC
                    ",
                    string.Join("', '", exhibits.Keys.ToArray()));
                var contentItemsRaw = Database.SqlQuery<ContentItemRaw>(contentItemsQuery);
                foreach (ContentItemRaw contentItemRaw in contentItemsRaw)
                {
                    if (exhibits.Keys.Contains(contentItemRaw.Exhibit_ID))
                    {
                        exhibits[contentItemRaw.Exhibit_ID].ContentItems.Add(contentItemRaw);
                    }
                }
            }
        }

        /// <summary>
        /// Keeping this commented until RI-Tree performance is validated.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        private List<Timeline> FillTimelinesRangeQuery(Guid collectionId, Dictionary<Guid, Timeline> timelinesMap, decimal startTime, decimal endTime, decimal span, Guid? commonAncestor, ref int maxElements)
        {
            string timelinesQuery = @"
                SELECT 
                    TOP({0}) *,
                    FromYear as [Start],
                    ToYear as [End]
                FROM Timelines,
                    (
                        SELECT TOP(1) Id as AncestorId
                        FROM Timelines 
                        WHERE 
                            (Timeline_Id Is NULL OR Id = {5})
                            AND Collection_Id = {4}
                        ORDER BY 
                            CASE WHEN Id = {5} THEN 1 ELSE 0 END DESC, 
                            CASE WHEN Id Is NULL THEN 1 ELSE 0 END DESC
                    ) as AncestorTimeline
                WHERE
                    Collection_Id = {4} AND
                    (
                        FromYear >= {1} AND 
                        ToYear <= {2} AND 
                        ToYear-FromYear >= {3} OR
                        Id = {5}
                    )
                 ORDER BY
                    CASE WHEN Timelines.Id = AncestorId THEN 1 ELSE 0 END DESC, 
                    CASE WHEN Timeline_Id = AncestorId THEN 1 ELSE 0 END DESC, 
                    ToYear-FromYear DESC";

            return FillTimelinesFromFlatList(
                Database.SqlQuery<TimelineRaw>(timelinesQuery, maxElements, startTime, endTime, span, collectionId, commonAncestor),
                timelinesMap,
                commonAncestor,
                ref maxElements);
        }

        /// <summary>
        /// TODO (Yitao):
        ///     1) Investigate performance from FillTimelinesRiTreeQuery vs FillTimelinesRangeQuery.
        ///     2) Based on performance results, we will consider splitting queries into RI-Queries/Simple-Queries
        ///     3) Add references to understanding RI-Trees here.
        ///     4) Send code review and approve.
        /// </summary>
        private List<Timeline> FillTimelinesRiTreeQuery(Guid collectionId, Dictionary<Guid, Timeline> timelinesMap, decimal startTime, decimal endTime, decimal span, Guid? commonAncestor, ref int maxElements)
        {
            /* There are 4 cases of a given timeline intersecting the current canvas: [<]>, <[>], [<>], and <[]> (<> denotes the timeline, and [] denotes the canvas) */

            string timelinesQuery = @"SELECT TOP({0}) * FROM (
                SELECT DISTINCT [Timelines].*, [Timelines].[FromYear] as [Start], [Timelines].[ToYear] as [End], [Timelines].[ToYear] - [Timelines].[FromYear] AS [TimeSpan] FROM [Timelines] JOIN
                (
                    SELECT ([b1] & CAST(({1} + 13700000001) AS BIGINT)) AS [node] FROM [Bitmasks] WHERE (CAST(({1} + 13700000001) AS BIGINT) & [b2]) <> 0
                ) AS [left_nodes] ON [Timelines].[ForkNode] = [left_nodes].[node] AND [Timelines].[ToYear] >= {1} AND [Timelines].[ToYear] - [Timelines].[FromYear] >= {3} AND [Timelines].[Collection_Id] = {4} OR [Timelines].[Id] = {5}
                UNION ALL
                SELECT DISTINCT [Timelines].*, [Timelines].[FromYear] as [Start], [Timelines].[ToYear] as [End], [Timelines].[ToYear] - [Timelines].[FromYear] AS [TimeSpan] FROM [Timelines] JOIN
                (
                    SELECT (([b1] & CAST(({2} + 13700000001) AS BIGINT)) | [b3]) AS [node] FROM [bitmasks] WHERE (CAST (({2} + 13700000001) AS BIGINT) & [b3]) = 0
                )
                AS [right_nodes] ON [Timelines].[ForkNode] = [right_nodes].[node] AND [Timelines].[FromYear] <= {2} AND [Timelines].[ToYear] - [Timelines].[FromYear] >= {3} AND [Timelines].[Collection_Id] = {4} OR [Timelines].[Id] = {5}
                UNION ALL
                SELECT DISTINCT [Timelines].*, [Timelines].[FromYear] as [Start], [Timelines].[ToYear] as [End], [Timelines].[ToYear] - [Timelines].[FromYear] AS [TimeSpan] FROM [Timelines] WHERE [Timelines].[ForkNode] BETWEEN ({1} + 13700000001) AND ({2} + 13700000001) AND [Timelines].[ToYear] - [Timelines].[FromYear] >= {3} AND [Timelines].[Collection_Id] = {4} OR [Timelines].[Id] = {5}
            )
            AS [CanvasTimelines] ORDER BY [CanvasTimelines].[TimeSpan] DESC 
            ";

            return FillTimelinesFromFlatList(
                Database.SqlQuery<TimelineRaw>(timelinesQuery, maxElements, startTime, endTime, span, collectionId, commonAncestor),
                timelinesMap,
                commonAncestor,
                ref maxElements);
        }

        private static List<Timeline> FillTimelinesFromFlatList(IEnumerable<TimelineRaw> timelinesRaw, Dictionary<Guid, Timeline> timelinesMap, Guid? commonAncestor, ref int maxElements)
        {
            List<Timeline> timelines = new List<Timeline>();
            Dictionary<Guid, Guid?> timelinesParents = new Dictionary<Guid, Guid?>();

            foreach (TimelineRaw timelineRaw in timelinesRaw)
            {
                if (timelineRaw.Exhibits == null)
                    timelineRaw.Exhibits = new System.Collections.ObjectModel.Collection<Exhibit>();

                timelinesParents[timelineRaw.Id] = timelineRaw.Timeline_ID;
                timelinesMap[timelineRaw.Id] = timelineRaw;

                maxElements--;
            }

            // Build the timelines tree by assigning each timeline to its parent
            foreach (Timeline timeline in timelinesMap.Values)
            {
                Guid? parentId = timelinesParents[timeline.Id];

                // If the timeline should be a root timeline
                if (timeline.Id == commonAncestor || parentId == null || !timelinesMap.Keys.Contains((Guid)parentId))
                {
                    timelines.Add(timeline);
                }
                else
                {
                    Timeline parentTimeline = timelinesMap[(Guid)parentId];
                    if (parentTimeline.ChildTimelines == null)
                        parentTimeline.ChildTimelines = new System.Collections.ObjectModel.Collection<Timeline>();

                    parentTimeline.ChildTimelines.Add(timeline);
                }
            }

            return timelines;
        }

        // Recursively deletes every child timeline and exhibit (with references and content items) form timeline with given guid. 
        public void DeleteTimeline(Guid id)
        {
            var timelineIDs = GetChildTimelinesIds(id); // list of ids of child timelines
            var exhibitIDs = GetChildExhibitsIds(id); // list of ids of exhibits

            // recursively delete timelines
            while (timelineIDs.Count != 0)
            {
                DeleteTimeline(timelineIDs.First());
                timelineIDs.RemoveAt(0);
            }

            // recursively delete exhibits
            while (exhibitIDs.Count != 0)
            {
                DeleteExhibit(exhibitIDs.First());
                exhibitIDs.RemoveAt(0);
            }

            Timeline removeTimeline = this.Timelines.Find(id);
            this.Timelines.Remove(removeTimeline);
        }

        // Deletes every content item and reference from exhibit with given guid.
        public void DeleteExhibit(Guid id)
        {
            var exhibitsIDs = GetChildContentItemsIds(id); // list of ids of content items

            // delete content items
            while (exhibitsIDs.Count != 0)
            {
                var e = this.ContentItems.Find(exhibitsIDs.First());
                this.ContentItems.Remove(e);
                exhibitsIDs.RemoveAt(0);
            }

            Exhibit deleteExhibit = this.Exhibits.Find(id);
            this.Exhibits.Remove(deleteExhibit);
        }

        /// <summary>
        /// Retrieves a path to an timeline, exhibit or content item.
        /// </summary>
        public string GetContentPath(Guid collectionId, Guid? contentId, string title)
        {
            string contentPath = string.Empty;

            ContentItemRaw contentItem = Database.SqlQuery<ContentItemRaw>("SELECT * FROM ContentItems WHERE Collection_Id = {0} AND (Id = {1} OR Title = {2})", collectionId, contentId, title).FirstOrDefault();
            if (contentItem != null)
            {
                contentPath = "/" + contentItem.Id;
                contentId = contentItem.Exhibit_ID;
            }

            ExhibitRaw exhibit = Database.SqlQuery<ExhibitRaw>("SELECT * FROM Exhibits WHERE Collection_Id = {0} AND (Id = {1} OR Title = {2})", collectionId, contentId, title).FirstOrDefault();
            if (exhibit != null)
            {
                contentPath = "/e" + exhibit.Id + contentPath;
                contentId = exhibit.Timeline_ID;
            }

            TimelineRaw timeline = Database.SqlQuery<TimelineRaw>("SELECT * FROM Timelines WHERE Collection_Id = {0} AND (Id = {1} OR Title = {2})", collectionId, contentId, title).FirstOrDefault();

            while (timeline != null)
            {
                contentPath = "/t" + timeline.Id + contentPath;
                timeline = Database.SqlQuery<TimelineRaw>("SELECT * FROM Timelines WHERE Id = {0}", timeline.Timeline_ID).FirstOrDefault();
            } 

            return contentPath.ToString();
        }

        // Returns list of ids of chilt timelines of timeline with given id.
        private List<Guid> GetChildTimelinesIds(Guid id)
        {
            var timelines = new List<Guid>();

            string timelinesQuery = string.Format(
                CultureInfo.InvariantCulture,
                "SELECT * FROM Timelines WHERE Timeline_Id IN ('{0}')",
                string.Join("', '", id));
            var timelinesRaw = Database.SqlQuery<TimelineRaw>(timelinesQuery);

            foreach (TimelineRaw timelineRaw in timelinesRaw)
                timelines.Add(timelineRaw.Id);

            return timelines;
        }

        // Returns list of ids of child exhibits of timeline with given id.
        private List<Guid> GetChildExhibitsIds(Guid id)
        {
            var exhibits = new List<Guid>();

            string exhibitsQuery = string.Format(
                CultureInfo.InvariantCulture,
                "SELECT *, Year as [Time] FROM Exhibits WHERE Timeline_Id IN ('{0}')",
                string.Join("', '", id));
            var exhibitsRaw = Database.SqlQuery<ExhibitRaw>(exhibitsQuery);

            foreach (ExhibitRaw exhibitRaw in exhibitsRaw)
                exhibits.Add(exhibitRaw.Id);

            return exhibits;
        }

        // Returns list of ids of child content items of exhibit with given id.
        private List<Guid> GetChildContentItemsIds(Guid id)
        {
            var contentItems = new List<Guid>();

            // Find child content items
            string contentItemsQuery = string.Format(
                    CultureInfo.InvariantCulture,
                    "SELECT * FROM ContentItems WHERE Exhibit_Id IN ('{0}')",
                    string.Join("', '", id));
            var contentItemsRaw = Database.SqlQuery<ContentItemRaw>(contentItemsQuery);

            foreach (ContentItemRaw contentItemRaw in contentItemsRaw)
                contentItems.Add(contentItemRaw.Id);
            return contentItems;
        }

        public TimelineRaw GetParentTimelineRaw(Guid timelineId)
        {
            var parentTimelinesRaw = Database.SqlQuery<TimelineRaw>("SELECT * FROM Timelines WHERE Id in (SELECT Timeline_Id FROM Timelines WHERE Id = {0})", timelineId);

            return parentTimelinesRaw.FirstOrDefault();
        }

    }
}
