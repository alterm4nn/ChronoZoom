CREATE TABLE [dbo].[Tour] (
    [ID]           UNIQUEIDENTIFIER CONSTRAINT [DF_Tour_ID] DEFAULT (newid()) NOT NULL,
    [Name]         NVARCHAR (100)   NOT NULL,
    [CreatedBy]    UNIQUEIDENTIFIER NULL,
    [ModifiedBy]   UNIQUEIDENTIFIER NULL,
    [CreatedOn]    SMALLDATETIME    CONSTRAINT [DF_Tour_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedOn]   SMALLDATETIME    CONSTRAINT [DF_Tour_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [IsDeleted]    BIT              NULL,
    [UniqueID]     INT              IDENTITY (1, 1) NOT NULL,
    [AudioBlobUrl] NVARCHAR (300)   NULL,
    [Category]     NVARCHAR (100)   NULL,
    [Sequence]     INT              NULL,
    [CurrVersion]  INT              NULL,
    [IsVisible]    BIT              NULL,
    CONSTRAINT [PK_Tour] PRIMARY KEY CLUSTERED ([ID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Tour_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Tour_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION
);


GO
CREATE NONCLUSTERED INDEX [IX_Tour_UniqueID]
    ON [dbo].[Tour]([UniqueID] ASC);

