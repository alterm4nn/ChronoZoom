namespace Chronozoom.Entities
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCollectionMembers : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Users", "Collection_Id", "dbo.Collections");
            DropIndex("dbo.Users", new[] { "Collection_Id" });
            CreateTable(
                "dbo.Members",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Role = c.Int(nullable: false),
                        Collection_Id = c.Guid(),
                        User_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Collections", t => t.Collection_Id)
                .ForeignKey("dbo.Users", t => t.User_Id)
                .Index(t => t.Collection_Id)
                .Index(t => t.User_Id);
            
            DropColumn("dbo.Users", "Collection_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "Collection_Id", c => c.Guid());
            DropIndex("dbo.Members", new[] { "User_Id" });
            DropIndex("dbo.Members", new[] { "Collection_Id" });
            DropForeignKey("dbo.Members", "User_Id", "dbo.Users");
            DropForeignKey("dbo.Members", "Collection_Id", "dbo.Collections");
            DropTable("dbo.Members");
            CreateIndex("dbo.Users", "Collection_Id");
            AddForeignKey("dbo.Users", "Collection_Id", "dbo.Collections", "Id");
        }
    }
}
