namespace Chronozoom.Entities
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ToursDescription : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Tours", "Description", c => c.String(maxLength: 4000));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Tours", "Description");
        }
    }
}
