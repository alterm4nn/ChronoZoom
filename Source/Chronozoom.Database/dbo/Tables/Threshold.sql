CREATE TABLE [dbo].[Threshold] (
    [ID]                UNIQUEIDENTIFIER   CONSTRAINT [DF_Threshold_ID] DEFAULT (newid()) NOT NULL,
    [Threshold]         NVARCHAR (100)     NOT NULL,
    [CreatedBy]         UNIQUEIDENTIFIER   NULL,
    [ModifiedBy]        UNIQUEIDENTIFIER   NULL,
    [CreatedOn]         SMALLDATETIME      CONSTRAINT [DF_Threshold_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedOn]        SMALLDATETIME      CONSTRAINT [DF_Threshold_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [IsDeleted]         BIT                NULL,
    [ShortDescription]  NVARCHAR (200)     NULL,
    [ThresholdDate]     DATETIMEOFFSET (7) NULL,
    [ThresholdYear]     DECIMAL (8, 4)     NULL,
    [ThresholdTimeUnit] UNIQUEIDENTIFIER   NULL,
    [BookmarkID]        UNIQUEIDENTIFIER   NULL,
    [CurrVersion]       INT                NULL,
    CONSTRAINT [PK_Threshold] PRIMARY KEY CLUSTERED ([ID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Threshold_Bookmark] FOREIGN KEY ([BookmarkID]) REFERENCES [dbo].[BookMark] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Threshold_TimeUnit] FOREIGN KEY ([ThresholdTimeUnit]) REFERENCES [dbo].[TimeUnit] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Threshold_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Threshold_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

