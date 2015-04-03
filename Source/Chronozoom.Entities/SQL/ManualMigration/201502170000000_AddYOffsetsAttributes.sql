IF NOT EXISTS (SELECT * FROM sys.columns  WHERE [name] = N'OffsetY' AND [object_id] = OBJECT_ID(N'Exhibits'))
BEGIN
	ALTER TABLE [Timelines] ADD [OffsetY] DECIMAL (5, 2) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns  WHERE [name] = N'OffsetY' AND [object_id] = OBJECT_ID(N'Timelines'))
BEGIN
	ALTER TABLE [Timelines] ADD [OffsetY] DECIMAL (5, 2) NULL;
END
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201502170000000_AddYOffsetsAttributes', 'Manual Migration');
GO