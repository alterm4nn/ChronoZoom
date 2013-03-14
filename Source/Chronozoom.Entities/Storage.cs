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

        public Collection<Timeline> TimelinesQuery()
        {
            Dictionary<Guid, Timeline> timelinesMap = new Dictionary<Guid, Timeline>();
            List<Timeline> timelines = FillTimelines(timelinesMap);

            FillTimelineRelations(timelinesMap);

            return new Collection<Timeline>(timelines);
        }

        private void FillTimelineRelations(Dictionary<Guid, Timeline> timelinesMap)
        {
            // Populate Exhibits
            string exhibitsQuery = "SELECT * FROM Exhibits";
            var exhibitsRaw = Database.SqlQuery<ExhibitRaw>(exhibitsQuery);
            Dictionary<Guid, Exhibit> exhibits = new Dictionary<Guid, Exhibit>();
            foreach (ExhibitRaw exhibitRaw in exhibitsRaw)
            {
                if (exhibitRaw.ContentItems == null)
                    exhibitRaw.ContentItems = new System.Collections.ObjectModel.Collection<ContentItem>();

                if (exhibitRaw.References == null)
                    exhibitRaw.References = new System.Collections.ObjectModel.Collection<Reference>();

                timelinesMap[exhibitRaw.Timeline_ID].Exhibits.Add(exhibitRaw);
                exhibits[exhibitRaw.Id] = exhibitRaw;
            }

            // Populate Content Items
            string contentItemsQuery = "SELECT * FROM ContentItems";
            var contentItemsRaw = Database.SqlQuery<ContentItemRaw>(contentItemsQuery);
            foreach (ContentItemRaw contentItemRaw in contentItemsRaw)
                exhibits[contentItemRaw.Exhibit_ID].ContentItems.Add(contentItemRaw);

            // Populate References
            string referencesQuery = "SELECT * FROM [References]";
            var referencesRaw = Database.SqlQuery<ReferenceRaw>(referencesQuery);
            foreach (ReferenceRaw referenceRaw in referencesRaw)
                exhibits[referenceRaw.Exhibit_ID].References.Add(referenceRaw);
        }

        private List<Timeline> FillTimelines(Dictionary<Guid, Timeline> timelinesMap)
        {
            List<Timeline> timelines = new List<Timeline>();
            Dictionary<Guid, Guid?> timelinesParents = new Dictionary<Guid, Guid?>();

            // Populate References
            string timelinesQuery = "SELECT * FROM Timelines";
            var timelinesRaw = Database.SqlQuery<TimelineRaw>(timelinesQuery);
            foreach (TimelineRaw timelineRaw in timelinesRaw)
            {
                if (timelineRaw.ChildTimelines == null)
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
                if (parentId != null)
                {
                    timelinesMap[(Guid)parentId].ChildTimelines.Add(timeline);
                }
                else
                {
                    timelines.Add(timeline);
                }
            }

            return timelines;
        }
    }
}