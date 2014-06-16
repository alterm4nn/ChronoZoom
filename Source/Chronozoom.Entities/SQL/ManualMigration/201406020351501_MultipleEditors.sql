-- remove users.collection_id (appears to be an existing entity change that previously wasn't db migrated) --

IF EXISTS
(
    SELECT (1) FROM INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE WITH (NOLOCK)
    WHERE CONSTRAINT_NAME = 'FK_dbo.Users_dbo.Collections_Collection_Id'
)
BEGIN
    ALTER TABLE [Users] DROP CONSTRAINT [FK_dbo.Users_dbo.Collections_Collection_Id];
    DROP INDEX [IX_Collection_Id] ON [dbo].[Users];
    ALTER TABLE [Users] DROP COLUMN [Collection_Id];
END
GO

-- add new schema elements for multi-user scenario --

ALTER TABLE [Collections] ADD [MembersAllowed] BIT NOT NULL DEFAULT (0);

CREATE TABLE [dbo].[Members]
(
	[Id]                [uniqueidentifier]      NOT NULL,
	[Collection_Id]     [uniqueidentifier]      NULL,
	[User_Id]           [uniqueidentifier]      NULL,
    CONSTRAINT [PK_dbo.Members] PRIMARY KEY CLUSTERED 
    (
	    [Id] ASC
    )
)

ALTER TABLE [dbo].[Exhibits] ADD
    [UpdatedBy_Id]      [uniqueidentifier]      NULL,
    [UpdatedTime]       [datetime]              NULL        DEFAULT (GETUTCDATE());
GO

ALTER TABLE [dbo].[Exhibits] WITH CHECK
ADD
    CONSTRAINT [FK_dbo.Exhibits_dbo.Users_UpdatedBy_Id]     FOREIGN KEY([UpdatedBy_Id]) REFERENCES [dbo].[Users] ([Id])
GO

UPDATE [dbo].[Exhibits] SET [UpdatedTime] = GETUTCDATE();
GO

CREATE TRIGGER [Exhibits_InsertUpdate] ON [dbo].[Exhibits]  FOR INSERT, UPDATE
AS BEGIN
    UPDATE [dbo].[Exhibits]
    SET [UpdatedTime] = GETUTCDATE()
    FROM INSERTED WHERE INSERTED.Id = [dbo].[Exhibits].Id;
END
GO

-- add new fields for circa date scenario --

ALTER TABLE [Timelines] ADD [FromIsCirca] BIT NOT NULL DEFAULT (0);
ALTER TABLE [Timelines] ADD [ToIsCirca]   BIT NOT NULL DEFAULT (0);
ALTER TABLE [Exhibits]  ADD [IsCirca]     BIT NOT NULL DEFAULT (0);
GO

-- note transformation completed --

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201406020351501_MultipleEditors', 'Manual Migration');
GO
