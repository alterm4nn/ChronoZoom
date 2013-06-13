namespace Chronozoom.Entities
{
    using System;
    using System.Data.Entity.Migrations;

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Proc")]
    public partial class ProgressiveLoadStoredProcsMigration : DbMigration
    {
        public override void Up()
        {
            this.Sql(Properties.Resources.CreateDepthFields);
            this.Sql(Properties.Resources.CreatePostOrderIndex);
            this.Sql(Properties.Resources.CreateCollectionStats);
            this.Sql(Properties.Resources.TimelineSubtreeQuery);
        }

        public override void Down()
        {
            this.Sql("DROP PROCEDURE TimelineSubtreeQuery");
            this.Sql("DROP PROCEDURE CreateCollectionStats");
            this.Sql("DROP PROCEDURE CreatePostOrderIndex");
            this.Sql("DROP PROCEDURE CreateDepthFields");
        }
    }
}
