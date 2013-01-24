CREATE TABLE [dbo].[Permission] (
    [ID]                UNIQUEIDENTIFIER CONSTRAINT [DF_Permission_ID] DEFAULT (newid()) NOT NULL,
    [Permission]        NVARCHAR (50)    NOT NULL,
    [IntRepresentation] TINYINT          NULL,
    [CreatedBy]         UNIQUEIDENTIFIER NULL,
    [ModifiedBy]        UNIQUEIDENTIFIER NULL,
    [CreatedOn]         SMALLDATETIME    CONSTRAINT [DF_Permission_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedOn]        SMALLDATETIME    CONSTRAINT [DF_Permission_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [IsDeleted]         BIT              NULL,
    [CurrVersion]       INT              NULL,
    CONSTRAINT [PK_Permission] PRIMARY KEY CLUSTERED ([ID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Permission_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Permission_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

