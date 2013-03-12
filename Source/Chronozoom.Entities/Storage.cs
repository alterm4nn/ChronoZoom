// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Data.Entity.Migrations.Design;
using System.Diagnostics;
using System.Linq;

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

        /// <summary>
        /// Describes storage migration options. Used when a schema upgrade is required.
        /// </summary>
        private class StorageMigrationsConfiguration : DbMigrationsConfiguration<Storage>
        {
            protected override void Seed(Storage context)
            {
                if (context == null)
                {
                    throw new ArgumentNullException("context");
                }

                Trace.TraceInformation("Entering storage seed stage");

                // If initial data is missing, seed initial data.
                if (context.Timelines.Where(timeline => timeline.ID == Guid.Empty).FirstOrDefault() == null)
                {
                    Trace.TraceInformation("Seeding database with data");
                    context.Timelines.Add(new Timeline { ID = Guid.Empty, UniqueID = 655, Title = "Hello world", FromYear = 711, ToYear = 1492, Height = 20, FromTimeUnit = "CE", ToTimeUnit = "CE" });
                }
            }

            public StorageMigrationsConfiguration()
            {
                AutomaticMigrationsEnabled = true;
            }
         }
    }
}