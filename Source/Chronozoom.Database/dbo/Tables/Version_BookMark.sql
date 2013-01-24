CREATE TABLE [dbo].[Version_BookMark] (
    [ID]                 UNIQUEIDENTIFIER NOT NULL,
    [Name]               NVARCHAR (100)   NOT NULL,
    [URL]                NVARCHAR (300)   NOT NULL,
    [CreatedBy]          UNIQUEIDENTIFIER NULL,
    [ModifiedBy]         UNIQUEIDENTIFIER NULL,
    [CreatedOn]          SMALLDATETIME    NULL,
    [ModifiedOn]         SMALLDATETIME    NULL,
    [IsDeleted]          BIT              NULL,
    [LapseTime]          INT              NULL,
    [Description]        NVARCHAR (300)   NULL,
    [CurrVersion]        INT              NULL,
    [IsVisible]          BIT              NULL,
    [Version_BookMarkID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_BookMarkID] ASC)
);

