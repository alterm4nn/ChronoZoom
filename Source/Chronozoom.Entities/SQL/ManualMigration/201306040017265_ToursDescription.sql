ALTER TABLE [Tours] ALTER COLUMN [Description] NVARCHAR(4000);
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201306040017265_ToursDescription', 'Manual Migration');
GO