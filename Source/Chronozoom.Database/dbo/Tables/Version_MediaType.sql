CREATE TABLE [dbo].[Version_MediaType] (
    [ID]                  UNIQUEIDENTIFIER NOT NULL,
    [MediaType]           NVARCHAR (50)    NOT NULL,
    [CreatedBy]           UNIQUEIDENTIFIER NULL,
    [ModifiedBy]          UNIQUEIDENTIFIER NULL,
    [CreatedOn]           SMALLDATETIME    NULL,
    [ModifiedOn]          SMALLDATETIME    NULL,
    [IsDeleted]           BIT              NULL,
    [CurrVersion]         INT              NULL,
    [Version_MediaTypeID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_MediaTypeID] ASC)
);

