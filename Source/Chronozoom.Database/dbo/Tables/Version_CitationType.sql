CREATE TABLE [dbo].[Version_CitationType] (
    [ID]                     UNIQUEIDENTIFIER NOT NULL,
    [CitationType]           NVARCHAR (50)    NOT NULL,
    [CreatedBy]              UNIQUEIDENTIFIER NULL,
    [ModifiedBy]             UNIQUEIDENTIFIER NULL,
    [CreatedOn]              SMALLDATETIME    NULL,
    [ModifiedOn]             SMALLDATETIME    NULL,
    [IsDeleted]              BIT              NULL,
    [CurrVersion]            INT              NULL,
    [Version_CitationTypeID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_CitationTypeID] ASC)
);

