CREATE TABLE [dbo].[Role] (
    [ID]          UNIQUEIDENTIFIER CONSTRAINT [DF_Role_ID] DEFAULT (newid()) NOT NULL,
    [Role]        NVARCHAR (50)    NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER NULL,
    [ModifiedBy]  UNIQUEIDENTIFIER NULL,
    [CreatedOn]   SMALLDATETIME    CONSTRAINT [DF_Role_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedOn]  SMALLDATETIME    CONSTRAINT [DF_Role_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [IsDeleted]   BIT              NULL,
    [CurrVersion] INT              NULL,
    CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED ([ID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]),
    CONSTRAINT [FK_Role_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]),
    CONSTRAINT [FK_Role_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID])
);



