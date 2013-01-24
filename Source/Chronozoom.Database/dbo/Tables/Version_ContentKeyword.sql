CREATE TABLE [dbo].[Version_ContentKeyword] (
    [ContentKeywordID]         UNIQUEIDENTIFIER NOT NULL,
    [ContentID]                UNIQUEIDENTIFIER NOT NULL,
    [KeywordID]                UNIQUEIDENTIFIER NOT NULL,
    [CreatedOn]                SMALLDATETIME    NULL,
    [CreatedBy]                UNIQUEIDENTIFIER NULL,
    [ModifiedOn]               SMALLDATETIME    NULL,
    [ModifiedBy]               UNIQUEIDENTIFIER NULL,
    [IsDeleted]                BIT              NULL,
    [CurrVersion]              INT              NULL,
    [Version_ContentKeywordID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_ContentKeywordID] ASC)
);

