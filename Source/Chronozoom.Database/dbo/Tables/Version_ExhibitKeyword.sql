CREATE TABLE [dbo].[Version_ExhibitKeyword] (
    [ExhibitKeywordID]         UNIQUEIDENTIFIER NOT NULL,
    [ExhibitID]                UNIQUEIDENTIFIER NOT NULL,
    [KeywordID]                UNIQUEIDENTIFIER NOT NULL,
    [CreatedOn]                SMALLDATETIME    NULL,
    [CreatedBy]                UNIQUEIDENTIFIER NULL,
    [ModifiedOn]               SMALLDATETIME    NULL,
    [ModifiedBy]               UNIQUEIDENTIFIER NULL,
    [IsDeleted]                BIT              NULL,
    [CurrVersion]              INT              NULL,
    [Version_ExhibitKeywordID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_ExhibitKeywordID] ASC)
);

