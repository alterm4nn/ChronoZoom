namespace Chronozoom.Entities
{
    using System;
    using System.Data.Entity.Migrations;

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Proc")]
    public partial class TimelineSubtreeQueryStoredProc : DbMigration
    {
        public override void Up()
        {
            this.Sql(Properties.Resources.TimelineSubtreeQuery);
        }
        
        public override void Down()
        {
        }
    }
}
