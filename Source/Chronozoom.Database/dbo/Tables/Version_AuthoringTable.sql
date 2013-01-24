CREATE TABLE [dbo].[Version_AuthoringTable] (
    [ID]                       UNIQUEIDENTIFIER NOT NULL,
    [AuthoringTable]           NVARCHAR (100)   NOT NULL,
    [CreatedBy]                UNIQUEIDENTIFIER NULL,
    [ModifiedBy]               UNIQUEIDENTIFIER NULL,
    [CreatedOn]                SMALLDATETIME    NULL,
    [ModifiedOn]               SMALLDATETIME    NULL,
    [IsDeleted]                BIT              NULL,
    [CurrVersion]              INT              NULL,
    [Version_AuthoringTableID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_AuthoringTableID] ASC)
);

