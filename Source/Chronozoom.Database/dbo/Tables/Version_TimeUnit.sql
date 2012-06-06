CREATE TABLE [dbo].[Version_TimeUnit] (
    [ID]                 UNIQUEIDENTIFIER NOT NULL,
    [TimeUnit]           NVARCHAR (100)   NOT NULL,
    [CreatedBy]          UNIQUEIDENTIFIER NULL,
    [ModifiedBy]         UNIQUEIDENTIFIER NULL,
    [CreatedOn]          SMALLDATETIME    NULL,
    [ModifiedOn]         SMALLDATETIME    NULL,
    [IsDeleted]          BIT              NULL,
    [CurrVersion]        INT              NULL,
    [Version_TimeUnitID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_TimeUnitID] ASC)
);

