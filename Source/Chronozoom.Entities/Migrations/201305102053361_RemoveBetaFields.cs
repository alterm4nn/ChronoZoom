using System;
using System.Data.Entity.Migrations;

//
// In order to add a data migrations, follow these steps:
//
// 1. Open "Package Manager Console" (Tools - Library Package Manager - Package Manager Console)
// 2. Add-Migration RemoveBetaFields -ProjectName Chronozoom.Entities
// 3. Update-Database -V -ProjectName Chronozoom.Entities
//
// When deploying to Azure Website:
// 
// 1. Update-Database -V -ProjectName Chronozoom.Entities -ConnectionString "<connection>" -ConnectionProviderName System.Data.SqlClient
//

namespace Chronozoom.Entities
{
    /// <summary>
    /// Migration to remove beta fields.
    /// </summary>
    public partial class RemoveBetaFields : DbMigration
    {
        /// <summary>
        /// Upgrades with RemoveBetaFields migration
        /// </summary>
        public override void Up()
        {
            DropForeignKey("dbo.References", "Exhibit_Id", "dbo.Exhibits");
            DropIndex("dbo.References", new[] { "Exhibit_Id" });
            DropColumn("dbo.Timelines", "Threshold");
            DropColumn("dbo.Timelines", "UniqueId");
            DropColumn("dbo.Timelines", "Sequence");
            DropColumn("dbo.Exhibits", "Threshold");
            DropColumn("dbo.Exhibits", "Regime");
            DropColumn("dbo.Exhibits", "UniqueId");
            DropColumn("dbo.Exhibits", "Sequence");
            DropColumn("dbo.ContentItems", "Threshold");
            DropColumn("dbo.ContentItems", "Regime");
            DropColumn("dbo.ContentItems", "TimeUnit");
            DropColumn("dbo.ContentItems", "UniqueId");
            DropColumn("dbo.ContentItems", "HasBibliography");
            DropColumn("dbo.Collections", "UserId");
            DropColumn("dbo.SuperCollections", "UserId");
            DropTable("dbo.References");
            DropTable("dbo.Thresholds");
        }

        /// <summary>
        /// Rolls-back the RemoveBetaFields migration
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity")]
        public override void Down()
        {
            CreateTable(
                "dbo.Thresholds",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(maxLength: 4000),
                        ThresholdYear = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Description = c.String(maxLength: 4000),
                        BookmarkRelativePath = c.String(maxLength: 4000),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.References",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Title = c.String(maxLength: 4000),
                        Authors = c.String(maxLength: 4000),
                        BookChapters = c.String(maxLength: 4000),
                        CitationType = c.String(maxLength: 4000),
                        PageNumbers = c.String(maxLength: 4000),
                        Publication = c.String(maxLength: 4000),
                        PublicationDates = c.String(maxLength: 4000),
                        Source = c.String(maxLength: 4000),
                        Exhibit_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.SuperCollections", "UserId", c => c.String(maxLength: 4000));
            AddColumn("dbo.Collections", "UserId", c => c.String(maxLength: 4000));
            AddColumn("dbo.ContentItems", "HasBibliography", c => c.Boolean(nullable: false));
            AddColumn("dbo.ContentItems", "UniqueId", c => c.Int(nullable: false));
            AddColumn("dbo.ContentItems", "TimeUnit", c => c.String(maxLength: 4000));
            AddColumn("dbo.ContentItems", "Regime", c => c.String(maxLength: 4000));
            AddColumn("dbo.ContentItems", "Threshold", c => c.String(maxLength: 4000));
            AddColumn("dbo.Exhibits", "Sequence", c => c.Int());
            AddColumn("dbo.Exhibits", "UniqueId", c => c.Int(nullable: false));
            AddColumn("dbo.Exhibits", "Regime", c => c.String(maxLength: 4000));
            AddColumn("dbo.Exhibits", "Threshold", c => c.String(maxLength: 4000));
            AddColumn("dbo.Timelines", "Sequence", c => c.Int());
            AddColumn("dbo.Timelines", "UniqueId", c => c.Int(nullable: false));
            AddColumn("dbo.Timelines", "Threshold", c => c.String(maxLength: 4000));
            CreateIndex("dbo.References", "Exhibit_Id");
            AddForeignKey("dbo.References", "Exhibit_Id", "dbo.Exhibits", "Id");
        }
    }
}
