namespace Chronozoom.Entities
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PostOrderIndexingByGuid : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Timelines", "FirstNodeInSubtree_Id", "dbo.Timelines");
            DropForeignKey("dbo.Timelines", "Predecessor_Id", "dbo.Timelines");
            DropForeignKey("dbo.Timelines", "Successor_Id", "dbo.Timelines");
            DropIndex("dbo.Timelines", new[] { "FirstNodeInSubtree_Id" });
            DropIndex("dbo.Timelines", new[] { "Predecessor_Id" });
            DropIndex("dbo.Timelines", new[] { "Successor_Id" });
            AddColumn("dbo.Timelines", "FirstNodeInSubtree", c => c.Guid(nullable: false));
            AddColumn("dbo.Timelines", "Predecessor", c => c.Guid(nullable: false));
            AddColumn("dbo.Timelines", "Successor", c => c.Guid(nullable: false));
            AlterColumn("dbo.Timelines", "ForkNode", c => c.Long(nullable: false));
            DropColumn("dbo.Timelines", "FirstNodeInSubtree_Id");
            DropColumn("dbo.Timelines", "Predecessor_Id");
            DropColumn("dbo.Timelines", "Successor_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Timelines", "Successor_Id", c => c.Guid());
            AddColumn("dbo.Timelines", "Predecessor_Id", c => c.Guid());
            AddColumn("dbo.Timelines", "FirstNodeInSubtree_Id", c => c.Guid());
            AlterColumn("dbo.Timelines", "ForkNode", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            DropColumn("dbo.Timelines", "Successor");
            DropColumn("dbo.Timelines", "Predecessor");
            DropColumn("dbo.Timelines", "FirstNodeInSubtree");
            CreateIndex("dbo.Timelines", "Successor_Id");
            CreateIndex("dbo.Timelines", "Predecessor_Id");
            CreateIndex("dbo.Timelines", "FirstNodeInSubtree_Id");
            AddForeignKey("dbo.Timelines", "Successor_Id", "dbo.Timelines", "Id");
            AddForeignKey("dbo.Timelines", "Predecessor_Id", "dbo.Timelines", "Id");
            AddForeignKey("dbo.Timelines", "FirstNodeInSubtree_Id", "dbo.Timelines", "Id");
        }
    }
}
