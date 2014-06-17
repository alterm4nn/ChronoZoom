ALTER TABLE [Timelines]     ALTER COLUMN [FromYear] NUMERIC(18, 7);
ALTER TABLE [Timelines]     ALTER COLUMN [ToYear]   NUMERIC(18, 7);
ALTER TABLE [ContentItems]  ALTER COLUMN [Year]     NUMERIC(18, 7);
ALTER TABLE [Exhibits]      ALTER COLUMN [Year]     NUMERIC(18, 7);
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201306210425512_IncreaseYearPrecision', 'Manual Migration');
GO
