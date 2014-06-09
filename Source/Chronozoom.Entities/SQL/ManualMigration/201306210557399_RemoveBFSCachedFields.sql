ALTER TABLE [Timelines] DROP COLUMN [FirstNodeInSubtree], [Predecessor], [Successor];

INSERT INTO [__MigrationHistory] (MigrationId, Model, ProductVersion)
VALUES
    ('201306210557399_RemoveBFSCachedFields', CONVERT(VARBINARY(MAX), ''), 'Manual Migration');
GO
