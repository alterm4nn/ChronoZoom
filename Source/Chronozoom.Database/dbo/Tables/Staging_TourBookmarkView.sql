CREATE TABLE [dbo].[Staging_TourBookmarkView] (
    [Name]                   NVARCHAR (100)   NOT NULL,
    [LapseTime]              INT              NULL,
    [Description]            NVARCHAR (300)   NULL,
    [URL]                    NVARCHAR (300)   NOT NULL,
    [ID]                     UNIQUEIDENTIFIER NOT NULL,
    [Bookmark_IsDeleted]     BIT              NULL,
    [TourBookmark_IsDeleted] BIT              NULL,
    [TourID]                 UNIQUEIDENTIFIER NOT NULL,
    [CurrVersion]            INT              NULL,
    [IncludeInVersion]       INT              NULL,
    [TourBookmarkViewID]     UNIQUEIDENTIFIER NOT NULL,
    [IsVisible]              BIT              NULL,
    PRIMARY KEY CLUSTERED ([TourBookmarkViewID] ASC)
);

