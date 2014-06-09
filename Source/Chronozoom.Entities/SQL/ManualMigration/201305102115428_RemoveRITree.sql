DROP TABLE [Bitmasks];

INSERT INTO [MigrationHistory] (MigrationId, Model, ProductVersion)
VALUES
    ('201305102115428_RemoveRITree', CONVERT(VARBINARY(MAX), ''), 'Manual Migration');
GO