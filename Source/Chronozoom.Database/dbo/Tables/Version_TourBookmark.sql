CREATE TABLE [dbo].[Version_TourBookmark] (
    [TourBookmarkID]         UNIQUEIDENTIFIER NOT NULL,
    [TourID]                 UNIQUEIDENTIFIER NOT NULL,
    [BookmarkID]             UNIQUEIDENTIFIER NOT NULL,
    [SequenceNumber]         SMALLINT         NOT NULL,
    [CreatedOn]              SMALLDATETIME    NULL,
    [CreatedBy]              UNIQUEIDENTIFIER NULL,
    [ModifiedOn]             SMALLDATETIME    NULL,
    [ModifiedBy]             UNIQUEIDENTIFIER NULL,
    [IsDeleted]              BIT              NULL,
    [CurrVersion]            INT              NULL,
    [IsVisible]              BIT              NULL,
    [Version_TourBookmarkID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_TourBookmarkID] ASC)
);

