ALTER TABLE [Timelines]     ALTER COLUMN [FromYear] NUMERIC(18, 7);
ALTER TABLE [Timelines]     ALTER COLUMN [ToYear]   NUMERIC(18, 7);
ALTER TABLE [ContentItems]  ALTER COLUMN [Year]     NUMERIC(18, 7);
ALTER TABLE [Exhibits]      ALTER COLUMN [Year]     NUMERIC(18, 7);

INSERT INTO [MigrationHistory] (MigrationId, Model, ProductVersion)
VALUES
    ('201306210425512_IncreaseYearPrecision', CONVERT(VARBINARY(MAX), ''), 'Manual Migration');
GO