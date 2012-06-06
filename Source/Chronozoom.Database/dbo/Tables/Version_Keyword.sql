CREATE TABLE [dbo].[Version_Keyword] (
    [ID]                UNIQUEIDENTIFIER NOT NULL,
    [Keyword]           NVARCHAR (50)    NOT NULL,
    [CreatedBy]         UNIQUEIDENTIFIER NULL,
    [ModifiedBy]        UNIQUEIDENTIFIER NULL,
    [CreatedOn]         SMALLDATETIME    NULL,
    [ModifiedOn]        SMALLDATETIME    NULL,
    [DoNotDisplay]      BIT              NULL,
    [IsDeleted]         BIT              NULL,
    [CurrVersion]       INT              NULL,
    [Version_KeywordID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_KeywordID] ASC)
);

