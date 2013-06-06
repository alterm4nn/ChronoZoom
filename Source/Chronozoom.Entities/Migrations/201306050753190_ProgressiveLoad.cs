namespace Chronozoom.Entities
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ProgressiveLoad : DbMigration
    {
        public override void Up()
        {
            if (System.Configuration.ConfigurationManager.ConnectionStrings[0].ProviderName.Equals("System.Data.?SqlClient"))
            {
                this.Sql(Properties.Resources.TimelineSubtreeQuery);
            }
        }
        
        public override void Down()
        {
            if (System.Configuration.ConfigurationManager.ConnectionStrings[0].ProviderName.Equals("System.Data.?SqlClient"))
            {
                this.Sql("DROP PROCEDURE TimelineSubtreeQuery");
            }
        }
    }
}
