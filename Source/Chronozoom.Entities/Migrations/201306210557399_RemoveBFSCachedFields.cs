namespace Chronozoom.Entities
{
    using System;
    using System.Data.Entity.Migrations;

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "BFS")]
    public partial class RemoveBFSCachedFields : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Timelines", "FirstNodeInSubtree");
            DropColumn("dbo.Timelines", "Predecessor");
            DropColumn("dbo.Timelines", "Successor");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Timelines", "Successor", c => c.Guid(nullable: false));
            AddColumn("dbo.Timelines", "Predecessor", c => c.Guid(nullable: false));
            AddColumn("dbo.Timelines", "FirstNodeInSubtree", c => c.Guid(nullable: false));
        }
    }
}
