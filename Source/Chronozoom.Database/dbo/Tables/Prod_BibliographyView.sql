CREATE TABLE [dbo].[Prod_BibliographyView] (
    [ExhibitID]        UNIQUEIDENTIFIER NOT NULL,
    [IsDeleted]        BIT              NULL,
    [ID]               UNIQUEIDENTIFIER NOT NULL,
    [Title]            NVARCHAR (100)   NOT NULL,
    [Authors]          NVARCHAR (500)   NOT NULL,
    [BookChapters]     NVARCHAR (300)   NOT NULL,
    [CitationType]     NVARCHAR (50)    NOT NULL,
    [PageNumbers]      NVARCHAR (100)   NOT NULL,
    [Publication]      NVARCHAR (300)   NOT NULL,
    [PublicationDates] NVARCHAR (300)   NOT NULL,
    [Source]           NVARCHAR (200)   NOT NULL,
    [CurrVersion]      INT              NULL,
    [IncludeInVersion] INT              NULL,
    [BibliographyView] UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY CLUSTERED ([BibliographyView] ASC)
);

