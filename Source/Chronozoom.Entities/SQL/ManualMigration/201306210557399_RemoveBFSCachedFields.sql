ALTER TABLE [Timelines] DROP COLUMN [FirstNodeInSubtree], [Predecessor], [Successor];
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201306210557399_RemoveBFSCachedFields', 'Manual Migration');
GO
