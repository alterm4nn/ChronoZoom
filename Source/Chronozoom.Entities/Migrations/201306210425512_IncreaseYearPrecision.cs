namespace Chronozoom.Entities
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class IncreaseYearPrecision : DbMigration
    {
        public override void Up()
        {
            this.Sql("ALTER TABLE Timelines ALTER COLUMN FromYear numeric(18,7)");
            this.Sql("ALTER TABLE Timelines ALTER COLUMN ToYear numeric(18,7)");
            this.Sql("ALTER TABLE ContentItems ALTER COLUMN Year numeric(18,7)");
            this.Sql("ALTER TABLE Exhibits ALTER COLUMN Year numeric(18,7)");
        }
        
        public override void Down()
        {
            this.Sql("ALTER TABLE Timelines ALTER COLUMN FromYear decimal(18,2)");
            this.Sql("ALTER TABLE Timelines ALTER COLUMN ToYear decimal(18,2)");
            this.Sql("ALTER TABLE ContentItems ALTER COLUMN Year decimal(18,2)");
            this.Sql("ALTER TABLE Exhibits ALTER COLUMN Year decimal(18,2)");
        }
    }
}
