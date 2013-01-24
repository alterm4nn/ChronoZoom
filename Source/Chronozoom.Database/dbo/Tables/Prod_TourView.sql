CREATE TABLE [dbo].[Prod_TourView] (
    [ID]               UNIQUEIDENTIFIER NOT NULL,
    [Name]             NVARCHAR (100)   NOT NULL,
    [CreatedBy]        UNIQUEIDENTIFIER NULL,
    [ModifiedBy]       UNIQUEIDENTIFIER NULL,
    [CreatedOn]        SMALLDATETIME    NULL,
    [ModifiedOn]       SMALLDATETIME    NULL,
    [IsDeleted]        BIT              NULL,
    [UniqueID]         INT              NOT NULL,
    [AudioBlobUrl]     NVARCHAR (300)   NULL,
    [Category]         NVARCHAR (100)   NULL,
    [Sequence]         INT              NULL,
    [CurrVersion]      INT              NULL,
    [Version_TourID]   UNIQUEIDENTIFIER NOT NULL,
    [IncludeInVersion] INT              NULL,
    [TourViewID]       UNIQUEIDENTIFIER NOT NULL,
    [IsVisible]        BIT              NULL,
    PRIMARY KEY CLUSTERED ([TourViewID] ASC)
);

