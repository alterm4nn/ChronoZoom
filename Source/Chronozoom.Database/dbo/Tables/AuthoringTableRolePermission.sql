CREATE TABLE [dbo].[AuthoringTableRolePermission] (
    [AuthoringTableRolePermissionID] UNIQUEIDENTIFIER NOT NULL,
    [AuthoringTableID]               UNIQUEIDENTIFIER NOT NULL,
    [RoleID]                         UNIQUEIDENTIFIER NOT NULL,
    [Permission]                     TINYINT          NOT NULL,
    [CreatedOn]                      SMALLDATETIME    CONSTRAINT [DF_AuthoringTableRolePermission_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [CreatedBy]                      UNIQUEIDENTIFIER NULL,
    [ModifiedOn]                     SMALLDATETIME    CONSTRAINT [DF_AuthoringTableRolePermission_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedBy]                     UNIQUEIDENTIFIER NULL,
    [IsDeleted]                      BIT              NULL,
    [CurrVersion]                    INT              NULL,
    CONSTRAINT [PK_AuthoringTableRolePermission] PRIMARY KEY CLUSTERED ([AuthoringTableRolePermissionID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_AuthoringTableRolePermission_AuthoringTable] FOREIGN KEY ([AuthoringTableID]) REFERENCES [dbo].[AuthoringTable] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_AuthoringTableRolePermission_Role] FOREIGN KEY ([RoleID]) REFERENCES [dbo].[Role] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_AuthoringTableRolePermission_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_AuthoringTableRolePermission_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

