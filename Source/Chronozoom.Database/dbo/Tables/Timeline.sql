CREATE TABLE [dbo].[Timeline] (
    [ID]               UNIQUEIDENTIFIER   NOT NULL,
    [Title]            NVARCHAR (100)     NOT NULL,
    [ThresholdID]      UNIQUEIDENTIFIER   NOT NULL,
    [RegimeID]         UNIQUEIDENTIFIER   NOT NULL,
    [FromContentDate]  DATETIMEOFFSET (7) NULL,
    [FromContentYear]  DECIMAL (8, 4)     NULL,
    [ToContentDate]    DATETIMEOFFSET (7) NULL,
    [ToContentYear]    DECIMAL (8, 4)     NULL,
    [ForkNode]         INT                NULL,
    [ParentTimelineID] UNIQUEIDENTIFIER   NULL,
    [CreatedOn]        SMALLDATETIME      CONSTRAINT [DF_Timeline_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [CreatedBy]        UNIQUEIDENTIFIER   NULL,
    [ModifiedOn]       SMALLDATETIME      CONSTRAINT [DF_Timeline_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedBy]       UNIQUEIDENTIFIER   NULL,
    [IsVisible]        BIT                NULL,
    [IsDeleted]        BIT                NULL,
    [FromTimeUnit]     UNIQUEIDENTIFIER   NULL,
    [ToTimeUnit]       UNIQUEIDENTIFIER   NULL,
    [SourceURL]        NVARCHAR (500)     NULL,
    [Attribution]      NVARCHAR (500)     NULL,
    [UniqueID]         INT                IDENTITY (1, 1) NOT NULL,
    [Sequence]         INT                NULL,
    [Height]           DECIMAL (8, 4)     NULL,
    [CurrVersion]      INT                NULL,
    CONSTRAINT [PK_Timeline] PRIMARY KEY CLUSTERED ([ID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Timeline_FromTimeUnit] FOREIGN KEY ([FromTimeUnit]) REFERENCES [dbo].[TimeUnit] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Timeline_Regime] FOREIGN KEY ([RegimeID]) REFERENCES [dbo].[Regime] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Timeline_Threshold] FOREIGN KEY ([ThresholdID]) REFERENCES [dbo].[Threshold] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Timeline_Timeline] FOREIGN KEY ([ParentTimelineID]) REFERENCES [dbo].[Timeline] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Timeline_ToTimeUnit] FOREIGN KEY ([ToTimeUnit]) REFERENCES [dbo].[TimeUnit] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Timeline_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Timeline_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TRUGGER ComputeForkNode
ON [dbo].[Timeline] 
FOR INSERT, UPDATE
AS 
BEGIN
	UPDATE [dbo].[Timeline] SET i.ForkNode = ForkNode(i.StartContentYearr, i.EndContentYear) FROM INSERTED i
END
