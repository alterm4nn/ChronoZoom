CREATE TABLE [dbo].[Version_ExhibitContentItem] (
    [ExhibitContentItemID]         UNIQUEIDENTIFIER NOT NULL,
    [ExhibitID]                    UNIQUEIDENTIFIER NOT NULL,
    [ContentItemID]                UNIQUEIDENTIFIER NOT NULL,
    [Order]                        SMALLINT         NULL,
    [CreatedOn]                    SMALLDATETIME    NULL,
    [CreatedBy]                    UNIQUEIDENTIFIER NULL,
    [ModifiedOn]                   SMALLDATETIME    NULL,
    [ModifiedBy]                   UNIQUEIDENTIFIER NULL,
    [IsDeleted]                    BIT              NULL,
    [CurrVersion]                  INT              NULL,
    [Version_ExhibitContentItemID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_ExhibitContentItemID] ASC)
);

