CREATE TABLE [dbo].[Version_Permission] (
    [ID]                   UNIQUEIDENTIFIER NOT NULL,
    [Permission]           NVARCHAR (50)    NOT NULL,
    [IntRepresentation]    TINYINT          NULL,
    [CreatedBy]            UNIQUEIDENTIFIER NULL,
    [ModifiedBy]           UNIQUEIDENTIFIER NULL,
    [CreatedOn]            SMALLDATETIME    NULL,
    [ModifiedOn]           SMALLDATETIME    NULL,
    [IsDeleted]            BIT              NULL,
    [CurrVersion]          INT              NULL,
    [Version_PermissionID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_PermissionID] ASC)
);

