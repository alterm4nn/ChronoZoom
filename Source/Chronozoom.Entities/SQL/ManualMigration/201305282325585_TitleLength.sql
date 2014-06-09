ALTER TABLE [Timelines]     ALTER COLUMN [Title] NVARCHAR(200);
ALTER TABLE [Exhibits]      ALTER COLUMN [Title] NVARCHAR(200);
ALTER TABLE [ContentItems]  ALTER COLUMN [Title] NVARCHAR(200);

INSERT INTO [__MigrationHistory] (MigrationId, Model, ProductVersion)
VALUES
    ('201305282325585_TitleLength', CONVERT(VARBINARY(MAX), ''), 'Manual Migration');
GO