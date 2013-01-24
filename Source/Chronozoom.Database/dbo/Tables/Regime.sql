CREATE TABLE [dbo].[Regime] (
    [ID]           UNIQUEIDENTIFIER CONSTRAINT [DF_Regime_ID] DEFAULT (newid()) NOT NULL,
    [Regime]       NVARCHAR (100)   NOT NULL,
    [CreatedBy]    UNIQUEIDENTIFIER NULL,
    [ModifiedBy]   UNIQUEIDENTIFIER NULL,
    [CreatedOn]    SMALLDATETIME    CONSTRAINT [DF_Regime_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedOn]   SMALLDATETIME    CONSTRAINT [DF_Regime_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [DoNotDisplay] BIT              NULL,
    [IsDeleted]    BIT              NULL,
    [CurrVersion]  INT              NULL,
    CONSTRAINT [PK_Regime] PRIMARY KEY CLUSTERED ([ID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Regime_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Regime_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

