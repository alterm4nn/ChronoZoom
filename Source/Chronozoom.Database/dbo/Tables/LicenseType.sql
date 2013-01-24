CREATE TABLE [dbo].[LicenseType] (
    [ID]          UNIQUEIDENTIFIER CONSTRAINT [DF_LicenseType_ID] DEFAULT (newid()) NOT NULL,
    [LicenseType] NVARCHAR (200)   NOT NULL,
    [LicenseURL]  NVARCHAR (300)   NOT NULL,
    [CreatedBy]   UNIQUEIDENTIFIER NULL,
    [ModifiedBy]  UNIQUEIDENTIFIER NULL,
    [CreatedOn]   SMALLDATETIME    CONSTRAINT [DF_LicenseType_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedOn]  SMALLDATETIME    CONSTRAINT [DF_LicenseType_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [IsDeleted]   BIT              NULL,
    [CurrVersion] INT              NULL,
    CONSTRAINT [PK_LicenseType] PRIMARY KEY CLUSTERED ([ID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_LicenseType_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_LicenseType_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

