CREATE TABLE [dbo].[Keyword] (
    [ID]           UNIQUEIDENTIFIER CONSTRAINT [DF_Keyword_ID] DEFAULT (newid()) NOT NULL,
    [Keyword]      NVARCHAR (50)    NOT NULL,
    [CreatedBy]    UNIQUEIDENTIFIER NULL,
    [ModifiedBy]   UNIQUEIDENTIFIER NULL,
    [CreatedOn]    SMALLDATETIME    CONSTRAINT [DF_Keyword_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedOn]   SMALLDATETIME    CONSTRAINT [DF_Keyword_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [DoNotDisplay] BIT              NULL,
    [IsDeleted]    BIT              NULL,
    [CurrVersion]  INT              NULL,
    CONSTRAINT [PK_Keyword] PRIMARY KEY CLUSTERED ([ID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Keyword_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Keyword_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

