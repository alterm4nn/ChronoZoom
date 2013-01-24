CREATE TABLE [dbo].[Version_ReferenceKeyword] (
    [ReferenceKeywordID]         UNIQUEIDENTIFIER NOT NULL,
    [ReferenceID]                UNIQUEIDENTIFIER NOT NULL,
    [KeywordID]                  UNIQUEIDENTIFIER NOT NULL,
    [CreatedOn]                  SMALLDATETIME    NULL,
    [CreatedBy]                  UNIQUEIDENTIFIER NULL,
    [ModifiedOn]                 SMALLDATETIME    NULL,
    [ModifiedBy]                 UNIQUEIDENTIFIER NULL,
    [IsDeleted]                  BIT              NULL,
    [CurrVersion]                INT              NULL,
    [Version_ReferenceKeywordID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_ReferenceKeywordID] ASC)
);

