CREATE TABLE [dbo].[Prod_ThresholdView] (
    [ID]               UNIQUEIDENTIFIER   NOT NULL,
    [Threshold]        NVARCHAR (100)     NOT NULL,
    [IsDeleted]        BIT                NULL,
    [Timeunit]         NVARCHAR (100)     NOT NULL,
    [ThresholdDate]    DATETIMEOFFSET (7) NULL,
    [ThresholdYear]    DECIMAL (8, 4)     NULL,
    [ShortDescription] NVARCHAR (200)     NULL,
    [URL]              NVARCHAR (300)     NOT NULL,
    [CurrVersion]      INT                NULL,
    [IncludeInVersion] INT                NULL,
    [ThresholdViewID]  UNIQUEIDENTIFIER   NOT NULL,
    PRIMARY KEY CLUSTERED ([ThresholdViewID] ASC)
);

