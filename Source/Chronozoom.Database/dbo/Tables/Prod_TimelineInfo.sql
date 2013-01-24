CREATE TABLE [dbo].[Prod_TimelineInfo] (
    [TimelineID]       UNIQUEIDENTIFIER   NOT NULL,
    [Title]            NVARCHAR (100)     NOT NULL,
    [Threshold]        NVARCHAR (100)     NOT NULL,
    [Regime]           NVARCHAR (100)     NOT NULL,
    [FromTimeUnit]     NVARCHAR (100)     NOT NULL,
    [FromContentDate]  DATETIMEOFFSET (7) NULL,
    [FromContentYear]  DECIMAL (8, 4)     NULL,
    [ToTimeUnit]       NVARCHAR (100)     NOT NULL,
    [ToContentDate]    DATETIMEOFFSET (7) NULL,
    [ToContentYear]    DECIMAL (8, 4)     NULL,
    [TimelineUniqueID] INT                NOT NULL,
    [TimelineSequence] INT                NULL,
    [Height]           DECIMAL (8, 4)     NULL,
    [ParentTimelineID] UNIQUEIDENTIFIER   NULL,
    [HasChildren]      INT                NULL,
    [CurrVersion]      INT                NULL,
    [IncludeInVersion] INT                NULL,
    [TimelineInfoID]   UNIQUEIDENTIFIER   NOT NULL,
    PRIMARY KEY CLUSTERED ([TimelineInfoID] ASC)
);

