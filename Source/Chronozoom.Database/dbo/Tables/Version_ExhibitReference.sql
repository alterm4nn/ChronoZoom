CREATE TABLE [dbo].[Version_ExhibitReference] (
    [ExhibitReferenceID]         UNIQUEIDENTIFIER NOT NULL,
    [ExhibitID]                  UNIQUEIDENTIFIER NOT NULL,
    [ReferenceID]                UNIQUEIDENTIFIER NOT NULL,
    [Order]                      SMALLINT         NULL,
    [CreatedOn]                  SMALLDATETIME    NULL,
    [CreatedBy]                  UNIQUEIDENTIFIER NULL,
    [ModifiedOn]                 SMALLDATETIME    NULL,
    [ModifiedBy]                 UNIQUEIDENTIFIER NULL,
    [IsDeleted]                  BIT              NULL,
    [CurrVersion]                INT              NULL,
    [Version_ExhibitReferenceID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_ExhibitReferenceID] ASC)
);

