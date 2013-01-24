CREATE TABLE [dbo].[Reference] (
    [ID]               UNIQUEIDENTIFIER NOT NULL,
    [Authors]          NVARCHAR (500)   NOT NULL,
    [BookChapters]     NVARCHAR (300)   NULL,
    [Title]            NVARCHAR (100)   NOT NULL,
    [CitationTypeID]   UNIQUEIDENTIFIER NULL,
    [PageNumbers]      NVARCHAR (100)   NULL,
    [Publication]      NVARCHAR (300)   NULL,
    [PublicationDates] NVARCHAR (300)   NULL,
    [Source]           NVARCHAR (200)   NOT NULL,
    [CreatedOn]        SMALLDATETIME    CONSTRAINT [DF_Reference_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [CreatedBy]        UNIQUEIDENTIFIER NULL,
    [ModifiedOn]       SMALLDATETIME    CONSTRAINT [DF_Reference_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedBy]       UNIQUEIDENTIFIER NULL,
    [IsVisible]        BIT              NULL,
    [IsDeleted]        BIT              NULL,
    [CurrVersion]      INT              NULL,
    CONSTRAINT [PK_Reference] PRIMARY KEY CLUSTERED ([ID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Reference_CitationType] FOREIGN KEY ([CitationTypeID]) REFERENCES [dbo].[CitationType] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Reference_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Reference_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

