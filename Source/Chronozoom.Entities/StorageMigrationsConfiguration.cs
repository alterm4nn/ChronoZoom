﻿// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Data.Entity.Migrations;
using System.Diagnostics;
using System.Linq;

using Chronozoom.Entities.Migration;

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

            /* fixes specific to migration of the no-delete database */
            try
            {
                context.Database.ExecuteSqlCommand("ALTER TABLE Tours DROP COLUMN Description");
                context.Database.ExecuteSqlCommand("ALTER TABLE Timelines DROP CONSTRAINT DF__Timelines__ForkN__4BAC3F29");
            }
            catch (Exception e)
            {
                Console.WriteLine(e.StackTrace);
            }

            Migrator migrator = new Migrator(context);
            migrator.Migrate();
        }

        public StorageMigrationsConfiguration()
        {
            AutomaticMigrationDataLossAllowed = true;
            AutomaticMigrationsEnabled = true;
        }
    }
}
