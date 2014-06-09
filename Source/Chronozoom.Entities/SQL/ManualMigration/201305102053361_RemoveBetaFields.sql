-- WARNING: best guess on constraint name   -- TODO: confirm name by looking at older copy of db
ALTER TABLE [References] DROP CONSTRAINT [FK_dbo.References_dbo.Exhibits_Exhibit_Id];
GO

-- WARNING: best guess on index name        -- TODO: confirm name by looking at older copy of db
DROP INDEX [IX_Exhibit_Id] ON [dbo].[References];
GO

ALTER TABLE [Timelines]         DROP COLUMN [Threshold], [UniqueId], [Sequence];
ALTER TABLE [Exhibits]          DROP COLUMN [Threshold], [Regime], [UniqueId], [Sequence];
ALTER TABLE [ContentItems]      DROP COLUMN [Threshold], [Regime], [TimeUnit], [UniqueId], [HasBibliography];
ALTER TABLE [Collections]       DROP COLUMN [UserId];
ALTER TABLE [SuperCollections]  DROP COLUMN [UserId];
GO

DROP TABLE [References];
DROP TABLE [Thresholds];

INSERT INTO [__MigrationHistory] (MigrationId, Model, ProductVersion)
VALUES
    ('201305102053361_RemoveBetaFields', CONVERT(VARBINARY(MAX), ''), 'Manual Migration');
GO