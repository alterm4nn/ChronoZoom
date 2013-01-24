CREATE TABLE [dbo].[TourBookmark] (
    [TourBookmarkID] UNIQUEIDENTIFIER NOT NULL,
    [TourID]         UNIQUEIDENTIFIER NOT NULL,
    [BookmarkID]     UNIQUEIDENTIFIER NOT NULL,
    [SequenceNumber] SMALLINT         NOT NULL,
    [CreatedOn]      SMALLDATETIME    CONSTRAINT [DF_TourBookmark_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [CreatedBy]      UNIQUEIDENTIFIER NULL,
    [ModifiedOn]     SMALLDATETIME    CONSTRAINT [DF_TourBookmark_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedBy]     UNIQUEIDENTIFIER NULL,
    [IsDeleted]      BIT              NULL,
    [CurrVersion]    INT              NULL,
    [IsVisible]      BIT              NULL,
    CONSTRAINT [PK_TourBookmark] PRIMARY KEY CLUSTERED ([TourBookmarkID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_TourBookmark_Bookmark] FOREIGN KEY ([BookmarkID]) REFERENCES [dbo].[BookMark] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_TourBookmark_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_TourBookmark_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

