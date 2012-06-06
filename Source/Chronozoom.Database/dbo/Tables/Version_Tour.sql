CREATE TABLE [dbo].[Version_Tour] (
    [ID]             UNIQUEIDENTIFIER NOT NULL,
    [Name]           NVARCHAR (100)   NOT NULL,
    [CreatedBy]      UNIQUEIDENTIFIER NULL,
    [ModifiedBy]     UNIQUEIDENTIFIER NULL,
    [CreatedOn]      SMALLDATETIME    NULL,
    [ModifiedOn]     SMALLDATETIME    NULL,
    [IsDeleted]      BIT              NULL,
    [UniqueID]       INT              NOT NULL,
    [AudioBlobUrl]   NVARCHAR (300)   NULL,
    [Category]       NVARCHAR (100)   NULL,
    [Sequence]       INT              NULL,
    [CurrVersion]    INT              NULL,
    [IsVisible]      BIT              NULL,
    [Version_TourID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_TourID] ASC)
);

