CREATE TABLE [dbo].[Version_LicenseType] (
    [ID]                    UNIQUEIDENTIFIER NOT NULL,
    [LicenseType]           NVARCHAR (200)   NOT NULL,
    [LicenseURL]            NVARCHAR (300)   NOT NULL,
    [CreatedBy]             UNIQUEIDENTIFIER NULL,
    [ModifiedBy]            UNIQUEIDENTIFIER NULL,
    [CreatedOn]             SMALLDATETIME    NULL,
    [ModifiedOn]            SMALLDATETIME    NULL,
    [IsDeleted]             BIT              NULL,
    [CurrVersion]           INT              NULL,
    [Version_LicenseTypeID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_LicenseTypeID] ASC)
);

