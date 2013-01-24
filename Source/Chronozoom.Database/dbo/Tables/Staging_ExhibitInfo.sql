CREATE TABLE [dbo].[Staging_ExhibitInfo] (
    [ID]               UNIQUEIDENTIFIER   NOT NULL,
    [TimelineID]       UNIQUEIDENTIFIER   NOT NULL,
    [Title]            NVARCHAR (100)     NOT NULL,
    [Threshold]        NVARCHAR (100)     NOT NULL,
    [Regime]           NVARCHAR (100)     NOT NULL,
    [TimeUnit]         NVARCHAR (100)     NOT NULL,
    [ContentDate]      DATETIMEOFFSET (7) NULL,
    [ContentYear]      DECIMAL (8, 4)     NULL,
    [UniqueID]         INT                NOT NULL,
    [Sequence]         INT                NULL,
    [CurrVersion]      INT                NULL,
    [IncludeInVersion] INT                NULL,
    [ExhibitInfoID]    UNIQUEIDENTIFIER   NOT NULL,
    PRIMARY KEY CLUSTERED ([ExhibitInfoID] ASC)
);

