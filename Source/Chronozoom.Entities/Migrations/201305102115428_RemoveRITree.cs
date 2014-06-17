namespace Chronozoom.Entities
{
    using System;
    using System.Data.Entity.Migrations;

    /// <summary>
    /// Migration to remove the RI-Tree.
    /// </summary>
    public partial class RemoveRITree : DbMigration
    {
        /// <summary>
        /// Upgrades with RemoveRITree migration
        /// </summary>
        public override void Up()
        {
            DropTable("dbo.Bitmasks");
        }

        /// <summary>
        /// Rolls-back RemoveRITree migration
        /// </summary>
        public override void Down()
        {
            CreateTable(
                "dbo.Bitmasks",
                c => new
                    {
                        B1 = c.Long(nullable: false, identity: true),
                        B2 = c.Long(nullable: false),
                        B3 = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.B1);
            
        }
    }
}
