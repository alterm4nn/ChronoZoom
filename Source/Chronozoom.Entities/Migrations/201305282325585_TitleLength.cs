namespace Chronozoom.Entities
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TitleLength : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Timelines", "Title", c => c.String(maxLength: 200));
            AlterColumn("dbo.Exhibits", "Title", c => c.String(maxLength: 200));
            AlterColumn("dbo.ContentItems", "Title", c => c.String(maxLength: 200));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.ContentItems", "Title", c => c.String(maxLength: 4000));
            AlterColumn("dbo.Exhibits", "Title", c => c.String(maxLength: 4000));
            AlterColumn("dbo.Timelines", "Title", c => c.String(maxLength: 4000));
        }
    }
}
