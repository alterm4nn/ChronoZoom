CREATE TABLE [dbo].[Version_Regime] (
    [ID]               UNIQUEIDENTIFIER NOT NULL,
    [Regime]           NVARCHAR (100)   NOT NULL,
    [CreatedBy]        UNIQUEIDENTIFIER NULL,
    [ModifiedBy]       UNIQUEIDENTIFIER NULL,
    [CreatedOn]        SMALLDATETIME    NULL,
    [ModifiedOn]       SMALLDATETIME    NULL,
    [DoNotDisplay]     BIT              NULL,
    [IsDeleted]        BIT              NULL,
    [CurrVersion]      INT              NULL,
    [Version_RegimeID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_RegimeID] ASC)
);

