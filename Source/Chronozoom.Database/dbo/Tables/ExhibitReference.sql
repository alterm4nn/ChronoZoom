CREATE TABLE [dbo].[ExhibitReference] (
    [ExhibitReferenceID] UNIQUEIDENTIFIER NOT NULL,
    [ExhibitID]          UNIQUEIDENTIFIER NOT NULL,
    [ReferenceID]        UNIQUEIDENTIFIER NOT NULL,
    [Order]              SMALLINT         NULL,
    [CreatedOn]          SMALLDATETIME    CONSTRAINT [DF_ExhibitReference_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [CreatedBy]          UNIQUEIDENTIFIER NULL,
    [ModifiedOn]         SMALLDATETIME    CONSTRAINT [DF_ExhibitReference_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedBy]         UNIQUEIDENTIFIER NULL,
    [IsDeleted]          BIT              NULL,
    [CurrVersion]        INT              NULL,
    CONSTRAINT [PK_ExhibitReference] PRIMARY KEY CLUSTERED ([ExhibitReferenceID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ExhibitReference_Exhibit] FOREIGN KEY ([ExhibitID]) REFERENCES [dbo].[Exhibit] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ExhibitReference_Reference] FOREIGN KEY ([ReferenceID]) REFERENCES [dbo].[Reference] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ExhibitReference_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_ExhibitReference_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

