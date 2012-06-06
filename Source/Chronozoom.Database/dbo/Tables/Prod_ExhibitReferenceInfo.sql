CREATE TABLE [dbo].[Prod_ExhibitReferenceInfo] (
    [ID]                          UNIQUEIDENTIFIER NOT NULL,
    [ExhibitID]                   UNIQUEIDENTIFIER NOT NULL,
    [Title]                       NVARCHAR (100)   NOT NULL,
    [Authors]                     NVARCHAR (500)   NOT NULL,
    [BookChapters]                NVARCHAR (300)   NULL,
    [CitationType]                NVARCHAR (50)    NULL,
    [PageNumbers]                 NVARCHAR (100)   NULL,
    [Publication]                 NVARCHAR (300)   NULL,
    [PublicationDates]            NVARCHAR (300)   NULL,
    [Source]                      NVARCHAR (200)   NOT NULL,
    [CurrVersion]                 INT              NULL,
    [IncludeInVersion]            INT              NULL,
    [Prod_ExhibitReferenceInfoID] UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY CLUSTERED ([Prod_ExhibitReferenceInfoID] ASC)
);

