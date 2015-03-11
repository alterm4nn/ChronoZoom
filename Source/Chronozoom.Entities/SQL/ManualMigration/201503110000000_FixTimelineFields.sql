-- FIX DATA TYPES OF TIMELINE STRING COLUMNS
-- TO AVOID LARGE ROW SIZE.

ALTER TABLE [dbo].[Timelines]
    ALTER COLUMN [BackgroundUrl] NVARCHAR (2000)  NULL;
GO

ALTER TABLE [dbo].[Timelines]
    ALTER COLUMN [Regime] NVARCHAR (200) NULL;
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201503110000000_FixTimelineFields', 'Manual Migration');
GO