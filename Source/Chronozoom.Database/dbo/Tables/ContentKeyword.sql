CREATE TABLE [dbo].[ContentKeyword] (
    [ContentKeywordID] UNIQUEIDENTIFIER NOT NULL,
    [ContentID]        UNIQUEIDENTIFIER NOT NULL,
    [KeywordID]        UNIQUEIDENTIFIER NOT NULL,
    [CreatedOn]        SMALLDATETIME    CONSTRAINT [DF_ContentKeyword_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [CreatedBy]        UNIQUEIDENTIFIER NULL,
    [ModifiedOn]       SMALLDATETIME    CONSTRAINT [DF_ContentKeyword_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedBy]       UNIQUEIDENTIFIER NULL,
    [IsDeleted]        BIT              NULL,
    [CurrVersion]      INT              NULL,
    CONSTRAINT [PK_ContentKeyword] PRIMARY KEY CLUSTERED ([ContentKeywordID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ContentKeyword_ContentItem] FOREIGN KEY ([ContentID]) REFERENCES [dbo].[ContentItem] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ContentKeyword_Keyword] FOREIGN KEY ([KeywordID]) REFERENCES [dbo].[Keyword] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ContentKeyword_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ContentKeyword_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

