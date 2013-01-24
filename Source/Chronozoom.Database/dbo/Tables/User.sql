CREATE TABLE [dbo].[User] (
    [ID]           UNIQUEIDENTIFIER CONSTRAINT [DF_Table_1_UserID] DEFAULT (newid()) NOT NULL,
    [UserName]     NVARCHAR (50)    NOT NULL,
    [Password]     NVARCHAR (200)   NOT NULL,
    [FirstName]    NVARCHAR (200)   NOT NULL,
    [LastName]     NVARCHAR (200)   NOT NULL,
    [EmailAddress] NVARCHAR (500)   NOT NULL,
    [RoleID]       UNIQUEIDENTIFIER NOT NULL,
    [CreatedBy]    UNIQUEIDENTIFIER NULL,
    [ModifiedBy]   UNIQUEIDENTIFIER NULL,
    [CreatedOn]    SMALLDATETIME    CONSTRAINT [DF_User_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedOn]   SMALLDATETIME    CONSTRAINT [DF_User_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [IsDeleted]    BIT              NULL,
    [CurrVersion]  INT              NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([ID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_User_Role] FOREIGN KEY ([RoleID]) REFERENCES [dbo].[Role] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_User_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_User_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

