CREATE TABLE [dbo].[MediaType] (
    [ID]          UNIQUEIDENTIFIER CONSTRAINT [DF_MediaType_ID] DEFAULT (newid()) NOT NULL,
    [MediaType]   NVARCHAR (50)    NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER NULL,
    [ModifiedBy]  UNIQUEIDENTIFIER NULL,
    [CreatedOn]   SMALLDATETIME    CONSTRAINT [DF_MediaType_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedOn]  SMALLDATETIME    CONSTRAINT [DF_MediaType_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [IsDeleted]   BIT              NULL,
    [CurrVersion] INT              NULL,
    CONSTRAINT [PK_MediaType] PRIMARY KEY CLUSTERED ([ID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_MediaType_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_MediaType_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

