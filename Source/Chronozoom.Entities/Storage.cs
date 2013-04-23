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
        }

        public static TraceSource Trace { get; private set; }

        public DbSet<Bitmask> Bitmasks { get; set; }

        public DbSet<Timeline> Timelines { get; set; }

        public DbSet<Threshold> Thresholds { get; set; }

        public DbSet<Exhibit> Exhibits { get; set; }

        public DbSet<ContentItem> ContentItems { get; set; }

        public DbSet<Reference> References { get; set; }

        public DbSet<Tour> Tours { get; set; }

        public DbSet<Entities.Collection> Collections { get; set; }

        public DbSet<SuperCollection> SuperCollections { get; set; }

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

                if (exhibitRaw.References == null)
                    exhibitRaw.References = new System.Collections.ObjectModel.Collection<Reference>();

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
                    "SELECT * FROM ContentItems WHERE Exhibit_Id IN ('{0}')",
                    string.Join("', '", exhibits.Keys.ToArray()));
                var contentItemsRaw = Database.SqlQuery<ContentItemRaw>(contentItemsQuery);
                foreach (ContentItemRaw contentItemRaw in contentItemsRaw)
                {
                    if (exhibits.Keys.Contains(contentItemRaw.Exhibit_ID))
                    {
                        exhibits[contentItemRaw.Exhibit_ID].ContentItems.Add(contentItemRaw);
                    }
                }

                // Populate References
                string referencesQuery = string.Format(CultureInfo.InvariantCulture,
                    "SELECT * FROM [References] WHERE Exhibit_Id IN ('{0}')",
                    string.Join("', '", exhibits.Keys.ToArray()));
                var referencesRaw = Database.SqlQuery<ReferenceRaw>(referencesQuery);
                foreach (ReferenceRaw referenceRaw in referencesRaw)
                {
                    if (exhibits.Keys.Contains(referenceRaw.Exhibit_ID))
                    {
                        exhibits[referenceRaw.Exhibit_ID].References.Add(referenceRaw);
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
                FROM Timelines
                WHERE
                    Collection_Id = {4} AND
                    (
                        FromYear >= {1} AND 
                        ToYear <= {2} AND 
                        ToYear-FromYear >= {3} OR
                        Id = {5}
                    )
                ORDER BY
                    CASE WHEN Id = {5} THEN 1 ELSE 0 END DESC,
                    CASE WHEN Timeline_Id = {5} THEN 1 ELSE 0 END DESC,
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
            var referencesIDs = GetChildReferencesIds(id); // list of ids of references

            // delete references
            while (referencesIDs.Count != 0)
            {
                var r = this.References.Find(referencesIDs.First());
                this.References.Remove(r);
                referencesIDs.RemoveAt(0);
            }

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

        // Returns list of ids of child references of exhibit with given id.
        private List<Guid> GetChildReferencesIds(Guid id)
        {
            var references = new List<Guid>();

            // Find exhibit's references
            string referencesQuery = string.Format(CultureInfo.InvariantCulture,
                "SELECT * FROM [References] WHERE Exhibit_Id IN ('{0}')",
                string.Join("', '", id));
            var referencesRaw = Database.SqlQuery<ReferenceRaw>(referencesQuery);

            foreach (ReferenceRaw referenceRaw in referencesRaw)
                references.Add(referenceRaw.Id);

            return references;
        }
    }
}
