CREATE TABLE [dbo].[ReferenceKeyword] (
    [ReferenceKeywordID] UNIQUEIDENTIFIER NOT NULL,
    [ReferenceID]        UNIQUEIDENTIFIER NOT NULL,
    [KeywordID]          UNIQUEIDENTIFIER NOT NULL,
    [CreatedOn]          SMALLDATETIME    CONSTRAINT [DF_ReferenceKeyword_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [CreatedBy]          UNIQUEIDENTIFIER NULL,
    [ModifiedOn]         SMALLDATETIME    CONSTRAINT [DF_ReferenceKeyword_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedBy]         UNIQUEIDENTIFIER NULL,
    [IsDeleted]          BIT              NULL,
    [CurrVersion]        INT              NULL,
    CONSTRAINT [PK_ReferenceKeyword] PRIMARY KEY CLUSTERED ([ReferenceKeywordID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ReferenceKeyword_Keyword] FOREIGN KEY ([KeywordID]) REFERENCES [dbo].[Keyword] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ReferenceKeyword_Reference] FOREIGN KEY ([ReferenceID]) REFERENCES [dbo].[Reference] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ReferenceKeyword_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ReferenceKeyword_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

