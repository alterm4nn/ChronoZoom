using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
//using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
//using System.Data.Entity.Migrations;
//using System.Data.Entity.Migrations.Design;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using Chronozoom.Entities;

namespace Chronozoom.Test.RITreeTest
{
    class RITreeTestStorage : DbContext
    {
        public RITreeTestStorage()
        {
              Database.SetInitializer(new System.Data.Entity.DropCreateDatabaseIfModelChanges<RITreeTestStorage>());
              Configuration.AutoDetectChangesEnabled = false;
        }
        public DbSet<Timeline> Timelines { get; set; }
        public DbSet<Bitmask> Bitmasks { get; set; }
    }
}