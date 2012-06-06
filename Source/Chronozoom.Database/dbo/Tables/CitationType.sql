CREATE TABLE [dbo].[CitationType] (
    [ID]           UNIQUEIDENTIFIER CONSTRAINT [DF_CitationType_ID] DEFAULT (newid()) NOT NULL,
    [CitationType] NVARCHAR (50)    NOT NULL,
    [CreatedBy]    UNIQUEIDENTIFIER NULL,
    [ModifiedBy]   UNIQUEIDENTIFIER NULL,
    [CreatedOn]    SMALLDATETIME    CONSTRAINT [DF_CitationType_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedOn]   SMALLDATETIME    CONSTRAINT [DF_CitationType_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [IsDeleted]    BIT              NULL,
    [CurrVersion]  INT              NULL,
    CONSTRAINT [PK_CitationType] PRIMARY KEY CLUSTERED ([ID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_CitationType_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_CitationType_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

