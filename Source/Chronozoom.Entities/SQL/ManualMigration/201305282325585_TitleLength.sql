ALTER TABLE [Timelines]     ALTER COLUMN [Title] NVARCHAR(200);
ALTER TABLE [Exhibits]      ALTER COLUMN [Title] NVARCHAR(200);
ALTER TABLE [ContentItems]  ALTER COLUMN [Title] NVARCHAR(200);
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201305282325585_TitleLength', 'Manual Migration');
GO