// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace UI
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;

    using Chronozoom.Entities;

    /// <summary>
    /// Storage implementation for ChronoZoom based on Entity Framework.
    /// </summary>
    public class Storage : DbContext
    {
        public Storage()
        {
            Configuration.ProxyCreationEnabled = false;
        }

        public DbSet<Timeline> Timelines { get; set; }

        public DbSet<Threshold> Thresholds { get; set; }

        public DbSet<Exhibit> Exhibits { get; set; }

        public DbSet<ContentItem> ContentItems { get; set; }

        public DbSet<Reference> References { get; set; }

        public DbSet<Tour> Tours { get; set; }

        public class StorageChangeInitializer : CreateDatabaseIfNotExists<Storage>
        {
            protected override void Seed(Storage context)
            {
                context.Timelines.Add(new Timeline { ID = Guid.NewGuid(), UniqueID = 655, Title = "Hello world", FromYear = 711, ToYear = 1492, Height = 20, FromTimeUnit = "CE", ToTimeUnit = "CE" });
            } 
        }
    }
}