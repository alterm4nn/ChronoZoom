CREATE TABLE [dbo].[ExhibitContentItem] (
    [ExhibitContentItemID] UNIQUEIDENTIFIER NOT NULL,
    [ExhibitID]            UNIQUEIDENTIFIER NOT NULL,
    [ContentItemID]        UNIQUEIDENTIFIER NOT NULL,
    [Order]                SMALLINT         NULL,
    [CreatedOn]            SMALLDATETIME    CONSTRAINT [DF_ExhibitContentItem_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [CreatedBy]            UNIQUEIDENTIFIER NULL,
    [ModifiedOn]           SMALLDATETIME    CONSTRAINT [DF_ExhibitContentItem_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedBy]           UNIQUEIDENTIFIER NULL,
    [IsDeleted]            BIT              NULL,
    [CurrVersion]          INT              NULL,
    CONSTRAINT [PK_ExhibitContentItem] PRIMARY KEY CLUSTERED ([ExhibitContentItemID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ExhibitContentItem_ContentItem] FOREIGN KEY ([ContentItemID]) REFERENCES [dbo].[ContentItem] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ExhibitContentItem_Exhibit] FOREIGN KEY ([ExhibitID]) REFERENCES [dbo].[Exhibit] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ExhibitContentItem_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ExhibitContentItem_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

