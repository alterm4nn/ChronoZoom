CREATE TABLE [dbo].[TimeUnit] (
    [ID]          UNIQUEIDENTIFIER CONSTRAINT [DF_TimeUnit_ID] DEFAULT (newid()) NOT NULL,
    [TimeUnit]    NVARCHAR (100)   NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER NULL,
    [ModifiedBy]  UNIQUEIDENTIFIER NULL,
    [CreatedOn]   SMALLDATETIME    CONSTRAINT [DF_TimeUnit_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedOn]  SMALLDATETIME    CONSTRAINT [DF_TimeUnit_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [IsDeleted]   BIT              NULL,
    [CurrVersion] INT              NULL,
    CONSTRAINT [PK_TimeUnit] PRIMARY KEY CLUSTERED ([ID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_TimeUnit_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_TimeUnit_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

