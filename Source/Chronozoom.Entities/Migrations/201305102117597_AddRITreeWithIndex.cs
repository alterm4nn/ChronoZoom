namespace Chronozoom.Entities
{
    using System;
    using System.Data.Entity.Migrations;

    /// <summary>
    /// Migration to add RI-Tree with index field.
    /// </summary>
    public partial class AddRITreeWithIndex : DbMigration
    {
        /// <summary>
        /// Upgrades with AddRITreeWithIndex migration
        /// </summary>
        public override void Up()
        {
            CreateTable(
                "dbo.Bitmasks",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        B1 = c.Long(nullable: false),
                        B2 = c.Long(nullable: false),
                        B3 = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }

        /// <summary>
        /// Rolls-back AddRITreeWithIndex migration
        /// </summary>
        public override void Down()
        {
            DropTable("dbo.Bitmasks");
        }
    }
}
