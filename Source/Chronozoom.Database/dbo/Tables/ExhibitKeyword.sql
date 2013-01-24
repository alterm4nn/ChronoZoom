CREATE TABLE [dbo].[ExhibitKeyword] (
    [ExhibitKeywordID] UNIQUEIDENTIFIER NOT NULL,
    [ExhibitID]        UNIQUEIDENTIFIER NOT NULL,
    [KeywordID]        UNIQUEIDENTIFIER NOT NULL,
    [CreatedOn]        SMALLDATETIME    CONSTRAINT [DF_ExhibitKeyword_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [CreatedBy]        UNIQUEIDENTIFIER NULL,
    [ModifiedOn]       SMALLDATETIME    CONSTRAINT [DF_ExhibitKeyword_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedBy]       UNIQUEIDENTIFIER NULL,
    [IsDeleted]        BIT              NULL,
    [CurrVersion]      INT              NULL,
    CONSTRAINT [PK_ExhibitKeyword] PRIMARY KEY CLUSTERED ([ExhibitKeywordID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ExhibitKeyword_Exhibit] FOREIGN KEY ([ExhibitID]) REFERENCES [dbo].[Exhibit] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ExhibitKeyword_Keyword] FOREIGN KEY ([KeywordID]) REFERENCES [dbo].[Keyword] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ExhibitKeyword_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ExhibitKeyword_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

