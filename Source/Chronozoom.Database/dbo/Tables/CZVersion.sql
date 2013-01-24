CREATE TABLE [dbo].[CZVersion] (
    [VersionNumber] INT              NOT NULL,
    [CreatedDate]   DATETIME         NOT NULL,
    [PublishDate]   DATETIME         NULL,
    [UserID]        UNIQUEIDENTIFIER NULL,
    [IsDeleted]     BIT              DEFAULT ((0)) NOT NULL,
    [CZVersionID]   UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([CZVersionID] ASC),
    UNIQUE NONCLUSTERED ([VersionNumber] ASC)
);

