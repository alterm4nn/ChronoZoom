ALTER TABLE [Tours] ALTER COLUMN [Description] NVARCHAR(4000);

INSERT INTO [__MigrationHistory] (MigrationId, Model, ProductVersion)
VALUES
    ('201306040017265_ToursDescription', CONVERT(VARBINARY(MAX), ''), 'Manual Migration');
GO