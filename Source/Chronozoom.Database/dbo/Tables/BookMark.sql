CREATE TABLE [dbo].[BookMark] (
    [ID]          UNIQUEIDENTIFIER CONSTRAINT [DF_BookMark_ID] DEFAULT (newid()) NOT NULL,
    [Name]        NVARCHAR (100)   NOT NULL,
    [URL]         NVARCHAR (300)   NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER NULL,
    [ModifiedBy]  UNIQUEIDENTIFIER NULL,
    [CreatedOn]   SMALLDATETIME    CONSTRAINT [DF_BookMark_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedOn]  SMALLDATETIME    CONSTRAINT [DF_BookMark_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [IsDeleted]   BIT              NULL,
    [LapseTime]   INT              NULL,
    [Description] NVARCHAR (300)   NULL,
    [CurrVersion] INT              NULL,
    [IsVisible]   BIT              NULL,
    CONSTRAINT [PK_BookMark] PRIMARY KEY CLUSTERED ([ID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_BookMark_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_BookMark_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

