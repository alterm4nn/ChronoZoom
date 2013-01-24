CREATE TABLE [dbo].[Version_Threshold] (
    [ID]                  UNIQUEIDENTIFIER   NOT NULL,
    [Threshold]           NVARCHAR (100)     NOT NULL,
    [CreatedBy]           UNIQUEIDENTIFIER   NULL,
    [ModifiedBy]          UNIQUEIDENTIFIER   NULL,
    [CreatedOn]           SMALLDATETIME      NULL,
    [ModifiedOn]          SMALLDATETIME      NULL,
    [IsDeleted]           BIT                NULL,
    [ShortDescription]    NVARCHAR (200)     NULL,
    [ThresholdDate]       DATETIMEOFFSET (7) NULL,
    [ThresholdYear]       DECIMAL (8, 4)     NULL,
    [ThresholdTimeUnit]   UNIQUEIDENTIFIER   NULL,
    [BookmarkID]          UNIQUEIDENTIFIER   NULL,
    [CurrVersion]         INT                NULL,
    [Version_ThresholdID] UNIQUEIDENTIFIER   DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_ThresholdID] ASC)
);

