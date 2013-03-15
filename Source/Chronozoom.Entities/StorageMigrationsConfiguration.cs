// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Data.Entity.Migrations;
using System.Diagnostics;
using System.Linq;

namespace Chronozoom.Entities
{
    /// <summary>
    /// Describes storage migration options. Used when a schema upgrade is required.
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1812:AvoidUninstantiatedInternalClasses")]
    class StorageMigrationsConfiguration : DbMigrationsConfiguration<Storage>
    {
        protected override void Seed(Storage context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            Trace.TraceInformation("Entering storage seed stage");

            // If initial data is missing, seed initial data.
            if (context.Timelines.Where(timeline => timeline.Id == Guid.Empty).FirstOrDefault() == null)
            {
                Trace.TraceInformation("Seeding database with data");
                context.Timelines.Add(new Timeline { Id = Guid.Empty, UniqueId = 655, Title = "Hello world", FromYear = 711, ToYear = 1492, Height = 20, FromTimeUnit = "CE", ToTimeUnit = "CE" });
            }
        }

        public StorageMigrationsConfiguration()
        {
            AutomaticMigrationsEnabled = true;
        }
    }
}
