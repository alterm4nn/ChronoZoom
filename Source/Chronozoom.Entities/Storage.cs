// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations.Schema;
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

        public DbSet<Timeline> Timelines { get; set; }

        public DbSet<Threshold> Thresholds { get; set; }

        public DbSet<Exhibit> Exhibits { get; set; }

        public DbSet<ContentItem> ContentItems { get; set; }

        public DbSet<Reference> References { get; set; }

        public DbSet<Tour> Tours { get; set; }

        public DbSet<Entities.Collection> Collections { get; set; }

        public DbSet<SuperCollection> SuperCollections { get; set; }

        public Collection<Timeline> TimelinesQuery(Guid collectionId, decimal startTime, decimal endTime, decimal span, Guid? commonAncestor)
        {
            Dictionary<Guid, Timeline> timelinesMap = new Dictionary<Guid, Timeline>();
            List<Timeline> timelines = FillTimelines(collectionId, timelinesMap, startTime, endTime, span, commonAncestor);

            FillTimelineRelations(timelinesMap);

            return new Collection<Timeline>(timelines);
        }

        private void FillTimelineRelations(Dictionary<Guid, Timeline> timelinesMap)
        {
            if (!timelinesMap.Keys.Any())
                return;

            // Populate Exhibits
            string exhibitsQuery = string.Format(
                CultureInfo.InvariantCulture,
                "SELECT *, Year as [Time] FROM Exhibits WHERE Timeline_Id IN ('{0}')",
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

        private List<Timeline> FillTimelines(Guid collectionId, Dictionary<Guid, Timeline> timelinesMap, decimal startTime, decimal endTime, decimal span, Guid? commonAncestor)
        {
            List<Timeline> timelines = new List<Timeline>();
            Dictionary<Guid, Guid?> timelinesParents = new Dictionary<Guid, Guid?>();

            // Populate References
            string timelinesQuery = "SELECT *, FromYear as [Start], ToYear as [End] FROM Timelines WHERE FromYear >= {0} AND ToYear <= {1} AND ToYear-FromYear >= {2} AND Collection_Id = {3} OR Id = {4}";
            var timelinesRaw = Database.SqlQuery<TimelineRaw>(timelinesQuery, startTime, endTime, span, collectionId, commonAncestor);

            foreach (TimelineRaw timelineRaw in timelinesRaw)
            {
                // This is being added for backcompatibility and should be removed once Beta API gets deprecated (Beta code does not support null timelines).
                if (commonAncestor == null && timelineRaw.ChildTimelines == null)
                    timelineRaw.ChildTimelines = new System.Collections.ObjectModel.Collection<Timeline>();

                if (timelineRaw.Exhibits == null)
                    timelineRaw.Exhibits = new System.Collections.ObjectModel.Collection<Exhibit>();

                timelinesParents[timelineRaw.Id] = timelineRaw.Timeline_ID;
                timelinesMap[timelineRaw.Id] = timelineRaw;
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
    }
}