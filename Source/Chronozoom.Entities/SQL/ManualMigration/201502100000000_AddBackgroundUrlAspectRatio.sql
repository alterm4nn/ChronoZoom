-- Add BackgroundUrl and AspectRatio optional columns
-- to Timelines table.

ALTER TABLE [dbo].[Timelines]
    ADD [BackgroundUrl] NVARCHAR (4000)    NULL,
        [AspectRatio]   DECIMAL (18, 7) NULL;
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201502100000000_AddBackgroundUrlAspectRatio', 'Manual Migration');
GO
