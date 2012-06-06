CREATE TABLE [dbo].[CZSystemVersion] (
    [StagingVersion]    INT              NULL,
    [ProdVersion]       INT              NULL,
    [CZSystemVersionID] UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY CLUSTERED ([CZSystemVersionID] ASC)
);

