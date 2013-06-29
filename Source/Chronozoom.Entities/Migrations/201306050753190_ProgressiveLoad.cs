namespace Chronozoom.Entities
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ProgressiveLoad : DbMigration
    {
        public override void Up()
        {
            this.Sql(Properties.Resources.Minimum);
            this.Sql(Properties.Resources.TimelineSubtreeQuery);
        }
        
        public override void Down()
        {
            this.Sql("DROP PROCEDURE TimelineSubtreeQuery");
            this.Sql("DROP FUNCTION Minimum");
        }
    }
}
