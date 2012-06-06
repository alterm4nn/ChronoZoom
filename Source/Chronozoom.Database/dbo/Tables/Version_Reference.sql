CREATE TABLE [dbo].[Version_Reference] (
    [ID]                  UNIQUEIDENTIFIER NOT NULL,
    [Authors]             NVARCHAR (500)   NOT NULL,
    [BookChapters]        NVARCHAR (300)   NULL,
    [Title]               NVARCHAR (100)   NOT NULL,
    [CitationTypeID]      UNIQUEIDENTIFIER NULL,
    [PageNumbers]         NVARCHAR (100)   NULL,
    [Publication]         NVARCHAR (300)   NULL,
    [PublicationDates]    NVARCHAR (300)   NULL,
    [Source]              NVARCHAR (200)   NOT NULL,
    [CreatedOn]           SMALLDATETIME    NULL,
    [CreatedBy]           UNIQUEIDENTIFIER NULL,
    [ModifiedOn]          SMALLDATETIME    NULL,
    [ModifiedBy]          UNIQUEIDENTIFIER NULL,
    [IsVisible]           BIT              NULL,
    [IsDeleted]           BIT              NULL,
    [CurrVersion]         INT              NULL,
    [Version_ReferenceID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_ReferenceID] ASC)
);

