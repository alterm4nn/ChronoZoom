IF NOT EXISTS (SELECT * FROM sys.columns  WHERE [name] = N'Subject' AND [object_id] = OBJECT_ID(N'Users'))
BEGIN
	ALTER TABLE [Users] ADD [Subject] NVARCHAR (150) NULL;
END
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201506010000000_AddUserSubject', 'Manual Migration');
GO