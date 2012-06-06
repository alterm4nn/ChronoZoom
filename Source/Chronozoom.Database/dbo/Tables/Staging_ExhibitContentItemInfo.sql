CREATE TABLE [dbo].[Staging_ExhibitContentItemInfo] (
    [ID]                       UNIQUEIDENTIFIER   NOT NULL,
    [ExhibitID]                UNIQUEIDENTIFIER   NOT NULL,
    [Title]                    NVARCHAR (200)     NOT NULL,
    [Caption]                  NVARCHAR (1000)    NOT NULL,
    [Threshold]                NVARCHAR (100)     NOT NULL,
    [Regime]                   NVARCHAR (100)     NOT NULL,
    [TimeUnit]                 NVARCHAR (100)     NOT NULL,
    [ContentDate]              DATETIMEOFFSET (7) NULL,
    [ContentYear]              DECIMAL (8, 4)     NULL,
    [MediaType]                NVARCHAR (50)      NOT NULL,
    [MediaBlobURL]             NVARCHAR (500)     NOT NULL,
    [MediaSource]              NVARCHAR (300)     NULL,
    [Attribution]              NVARCHAR (200)     NULL,
    [UniqueID]                 INT                NOT NULL,
    [Order]                    SMALLINT           NULL,
    [HasBibliography]          BIT                NULL,
    [CurrVersion]              INT                NULL,
    [IncludeInVersion]         INT                NULL,
    [ExhibitContentItemInfoID] UNIQUEIDENTIFIER   NOT NULL,
    PRIMARY KEY CLUSTERED ([ExhibitContentItemInfoID] ASC)
);

