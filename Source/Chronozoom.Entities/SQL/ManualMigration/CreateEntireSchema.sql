-- Users --

CREATE TABLE [dbo].[Users]
(
    [Id]                [uniqueidentifier]      NOT NULL,
    [DisplayName]       [nvarchar](50)          NOT NULL,
    [Email]             [varchar](100)          NULL,
    [IdentityProvider]  [varchar](25)           NULL,
    [NameIdentifier]    [varchar](150)          NULL,
    CONSTRAINT [PK_dbo.Users] PRIMARY KEY CLUSTERED
    (
        [Id] ASC
    )
)
GO


-- Bitmasks --

CREATE TABLE [dbo].[Bitmasks]
(
    [Id]                [int] IDENTITY(1,1)     NOT NULL,
    [B1]                [bigint]                NOT NULL,
    [B2]                [bigint]                NOT NULL,
    [B3]                [bigint]                NOT NULL,
    CONSTRAINT [PK_dbo.Bitmasks] PRIMARY KEY CLUSTERED 
    (
        [Id] ASC
    )
)
GO


-- SuperCollections --

CREATE TABLE [dbo].[SuperCollections]
(
    [Id]                [uniqueidentifier]      NOT NULL,
    [Title]             [varchar](50)           NOT NULL,
    [User_Id]           [uniqueidentifier]      NOT NULL,
    CONSTRAINT [PK_dbo.SuperCollections] PRIMARY KEY CLUSTERED 
    (
        [Id] ASC
    )
)
GO

ALTER TABLE [dbo].[SuperCollections] WITH CHECK
ADD
    CONSTRAINT [FK_dbo.SuperCollections_dbo.Users_User_Id] FOREIGN KEY([User_Id]) REFERENCES [dbo].[Users] ([Id])
GO


-- Collections --

CREATE TABLE [dbo].[Collections]
(
    [Id]                    [uniqueidentifier]  NOT NULL,
    [User_Id]               [uniqueidentifier]  NOT NULL,
    [SuperCollection_Id]    [uniqueidentifier]  NOT NULL,
    [Default]               [bit]               NOT NULL    DEFAULT (0),
    [MembersAllowed]        [bit]               NOT NULL    DEFAULT (0),
    [PubliclySearchable]    [bit]               NOT NULL    DEFAULT (0),
    [Title]                 [nvarchar](50)      NOT NULL,
    [Path]                  [varchar](50)       NOT NULL,
    [Theme]                 [nvarchar](max)     NULL,
    CONSTRAINT [PK_dbo.Collections] PRIMARY KEY CLUSTERED 
    (
        [Id] ASC
    ),
    CONSTRAINT [UK_dbo.Collections_Path] UNIQUE
    (
        [SuperCollection_Id]    ASC,
        [Path]                  ASC
    )
)
GO

ALTER TABLE [dbo].[Collections] WITH CHECK
ADD
    CONSTRAINT [FK_dbo.Collections_dbo.SuperCollections_SuperCollection_Id] FOREIGN KEY([SuperCollection_Id]) REFERENCES [dbo].[SuperCollections] ([Id]),
    CONSTRAINT [FK_dbo.Collections_dbo.Users_User_Id]                       FOREIGN KEY([User_Id])            REFERENCES [dbo].[Users] ([Id])
GO


-- Members --

CREATE TABLE [dbo].[Members]
(
    [Id]                [uniqueidentifier]      NOT NULL,
    [Collection_Id]     [uniqueidentifier]      NULL,
    [User_Id]           [uniqueidentifier]      NULL,
    CONSTRAINT [PK_dbo.Members] PRIMARY KEY CLUSTERED 
    (
        [Id] ASC
    )
)
GO

ALTER TABLE [dbo].[Members] WITH CHECK
ADD
    CONSTRAINT [FK_dbo.Members_dbo.Collections_Collection_Id] FOREIGN KEY([Collection_Id]) REFERENCES [dbo].[Collections] ([Id]),
    CONSTRAINT [FK_dbo.Members_dbo.Users_User_Id]             FOREIGN KEY([User_Id])       REFERENCES [dbo].[Users] ([Id])
GO


-- Timelines --

CREATE TABLE [dbo].[Timelines]
(
    [Id]                [uniqueidentifier]      NOT NULL,
    [Depth]             [int]                   NOT NULL,
    [Title]             [nvarchar](200)         NULL,
    [Regime]            [nvarchar](4000)        NULL,
    [FromYear]          [decimal](18, 7)        NOT NULL,
    [ToYear]            [decimal](18, 7)        NOT NULL,
    [ForkNode]          [decimal](18, 2)        NOT NULL,
    [Height]            [decimal](18, 2)        NULL,
    [Timeline_Id]       [uniqueidentifier]      NULL,
    [Collection_Id]     [uniqueidentifier]      NULL,
    [SubtreeSize]       [int]                   NOT NULL        DEFAULT (0),
    [FromIsCirca]       [bit]                   NOT NULL        DEFAULT (0),
    [ToIsCirca]         [bit]                   NOT NULL        DEFAULT (0),
    [BackgroundUrl]     [nvarchar](4000)        NULL,
    [AspectRatio]       [decimal](18, 7)        NULL,
    CONSTRAINT [PK_dbo.Timelines] PRIMARY KEY CLUSTERED 
    (
        [Id] ASC
    )
)
GO

ALTER TABLE [dbo].[Timelines] WITH CHECK
ADD
    CONSTRAINT [FK_dbo.Timelines_dbo.Collections_Collection_Id] FOREIGN KEY([Collection_Id]) REFERENCES [dbo].[Collections] ([Id]),
    CONSTRAINT [FK_dbo.Timelines_dbo.Timelines_Timeline_Id]     FOREIGN KEY([Timeline_Id])   REFERENCES [dbo].[Timelines]   ([Id])
GO


-- Exhibits --

CREATE TABLE [dbo].[Exhibits]
(
    [Id]                [uniqueidentifier]      NOT NULL,
    [Depth]             [int]                   NOT NULL,
    [Title]             [nvarchar](200)         NULL,
    [Year]              [decimal](18, 7)        NOT NULL,
    [IsCirca]           [bit]                   NOT NULL        DEFAULT (0),
    [Collection_Id]     [uniqueidentifier]      NULL,
    [Timeline_Id]       [uniqueidentifier]      NULL,
    [UpdatedBy_Id]      [uniqueidentifier]      NULL,
    [UpdatedTime]       [datetime]              NULL            DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_dbo.Exhibits] PRIMARY KEY CLUSTERED 
    (
        [Id] ASC
    )
)
GO

ALTER TABLE [dbo].[Exhibits] WITH CHECK
ADD
    CONSTRAINT [FK_dbo.Exhibits_dbo.Collections_Collection_Id] FOREIGN KEY([Collection_Id]) REFERENCES [dbo].[Collections] ([Id]),
    CONSTRAINT [FK_dbo.Exhibits_dbo.Timelines_Timeline_Id]     FOREIGN KEY([Timeline_Id])   REFERENCES [dbo].[Timelines]   ([Id]),
    CONSTRAINT [FK_dbo.Exhibits_dbo.Users_UpdatedBy_Id]        FOREIGN KEY([UpdatedBy_Id])  REFERENCES [dbo].[Users]       ([Id])
GO

CREATE TRIGGER [dbo].[Exhibits_InsertUpdate] ON [dbo].[Exhibits] FOR INSERT, UPDATE
AS BEGIN
    UPDATE [dbo].[Exhibits]
    SET [UpdatedTime] = GETUTCDATE()
    FROM INSERTED WHERE INSERTED.Id = [dbo].[Exhibits].Id;
END
GO


-- ContentItems --

CREATE TABLE [dbo].[ContentItems]
(
    [Id]                [uniqueidentifier]      NOT NULL,
    [Depth]             [int]                   NOT NULL,
    [Title]             [nvarchar](200)         NULL,
    [Caption]           [nvarchar](4000)        NULL,
    [Year]              [decimal](18, 7)        NULL,
    [MediaType]         [nvarchar](4000)        NULL,
    [Uri]               [nvarchar](4000)        NULL,
    [MediaSource]       [nvarchar](4000)        NULL,
    [Attribution]       [nvarchar](4000)        NULL,
    [Order]             [smallint]              NULL,
    [Collection_Id]     [uniqueidentifier]      NULL,
    [Exhibit_Id]        [uniqueidentifier]      NULL,
    CONSTRAINT [PK_dbo.ContentItems] PRIMARY KEY CLUSTERED 
    (
        [Id] ASC
    )
)
GO

ALTER TABLE [dbo].[ContentItems] WITH CHECK
ADD
    CONSTRAINT [FK_dbo.ContentItems_dbo.Collections_Collection_Id] FOREIGN KEY([Collection_Id]) REFERENCES [dbo].[Collections] ([Id]),
    CONSTRAINT [FK_dbo.ContentItems_dbo.Exhibits_Exhibit_Id]       FOREIGN KEY([Exhibit_Id])    REFERENCES [dbo].[Exhibits]    ([Id])
GO


-- Triples --

CREATE TABLE [dbo].[Triples]
(
    [Id]                [uniqueidentifier]      NOT NULL,
    [Subject]           [nvarchar](max)         NULL,
    [Predicate]         [nvarchar](max)         NULL,
    CONSTRAINT [PK_dbo.Triples] PRIMARY KEY CLUSTERED 
    (
        [Id] ASC
    )
)
GO


-- TriplePrefixes --

CREATE TABLE [dbo].[TriplePrefixes]
(
    [Prefix]            [nvarchar](128)         NOT NULL,
    [Namespace]         [nvarchar](max)         NULL,
    CONSTRAINT [PK_dbo.TriplePrefixes] PRIMARY KEY CLUSTERED 
    (
        [Prefix] ASC
    )
)
GO


-- TripleObjects --

CREATE TABLE [dbo].[TripleObjects]
(
    [TripleObject_Id]   [uniqueidentifier]      NOT NULL,
    [Object]            [nvarchar](max)         NULL,
    [Triple_Id]         [uniqueidentifier]      NULL,
    CONSTRAINT [PK_dbo.TripleObjects] PRIMARY KEY CLUSTERED 
    (
        [TripleObject_Id] ASC
    )
)
GO

ALTER TABLE [dbo].[TripleObjects] WITH CHECK
ADD
    CONSTRAINT [FK_dbo.TripleObjects_dbo.Triples_Triple_Id] FOREIGN KEY([Triple_Id]) REFERENCES [dbo].[Triples] ([Id])
GO


-- Tours --

CREATE TABLE [dbo].[Tours]
(
    [Id]                [uniqueidentifier]      NOT NULL,
    [Name]              [nvarchar](4000)        NULL,
    [UniqueId]          [int]                   NOT NULL,
    [AudioBlobUrl]      [nvarchar](4000)        NULL,
    [Category]          [nvarchar](4000)        NULL,
    [Sequence]          [int]                   NULL,
    [Collection_Id]     [uniqueidentifier]      NULL,
    [Description]       [nvarchar](4000)        NULL,
    CONSTRAINT [PK_dbo.Tours] PRIMARY KEY CLUSTERED 
    (
        [Id] ASC
    )
)
GO

ALTER TABLE [dbo].[Tours] WITH CHECK
ADD
    CONSTRAINT [FK_dbo.Tours_dbo.Collections_Collection_Id] FOREIGN KEY([Collection_Id]) REFERENCES [dbo].[Collections] ([Id])
GO


-- Bookmarks --

CREATE TABLE [dbo].[Bookmarks]
(
    [Id]                [uniqueidentifier]      NOT NULL,
    [Name]              [nvarchar](4000)        NULL,
    [Url]               [nvarchar](4000)        NULL,
    [ReferenceType]     [int]                   NOT NULL,
    [ReferenceId]       [uniqueidentifier]      NOT NULL,
    [LapseTime]         [int]                   NULL,
    [Description]       [nvarchar](4000)        NULL,
    [Tour_Id]           [uniqueidentifier]      NULL,
    [SequenceId]        [int]                   NOT NULL        DEFAULT (0),
    CONSTRAINT [PK_dbo.Bookmarks] PRIMARY KEY CLUSTERED 
    (
        [Id] ASC
    )
)
GO

ALTER TABLE [dbo].[Bookmarks] WITH CHECK
ADD
    CONSTRAINT [FK_dbo.Bookmarks_dbo.Tours_Tour_Id] FOREIGN KEY([Tour_Id]) REFERENCES [dbo].[Tours] ([Id])
GO


-- MigrationHistory --

CREATE TABLE [dbo].[MigrationHistory]
(
    [MigrationId]       [nvarchar](255)         NOT NULL,
    [Model]             [varbinary](max)        NULL,
    [ProductVersion]    [nvarchar](32)          NOT NULL,
    CONSTRAINT [PK_dbo.MigrationHistory] PRIMARY KEY CLUSTERED 
    (
        [MigrationId] ASC
    )
)
GO

-- We should be able to do this but CE only seems to like a single insert per SqlCeCommand --
--
--INSERT INTO [MigrationHistory] (MigrationId, Model, ProductVersion)
--VALUES
--    ('201305102053361_RemoveBetaFields',        CONVERT(VARBINARY(MAX), ''), 'Manual Migration'),
--    ('201305102115428_RemoveRITree',            CONVERT(VARBINARY(MAX), ''), 'Manual Migration'),
--    ('201305102117597_AddRITreeWithIndex',      CONVERT(VARBINARY(MAX), ''), 'Manual Migration'),
--    ('201305240425388_ChangeTours',             CONVERT(VARBINARY(MAX), ''), 'Manual Migration'),
--    ('201305282325585_TitleLength',             CONVERT(VARBINARY(MAX), ''), 'Manual Migration'),
--    ('201306040017265_ToursDescription',        CONVERT(VARBINARY(MAX), ''), 'Manual Migration'),
--    ('201306050753190_ProgressiveLoad',         CONVERT(VARBINARY(MAX), ''), 'Manual Migration'),
--    ('201306072040327_ToursUserMissingMaxLen',  CONVERT(VARBINARY(MAX), ''), 'Manual Migration'),
--    ('201306210425512_IncreaseYearPrecision',   CONVERT(VARBINARY(MAX), ''), 'Manual Migration'),
--    ('201306210557399_RemoveBFSCachedFields',   CONVERT(VARBINARY(MAX), ''), 'Manual Migration'),
--    ('201406020351501_MultipleEditors',         CONVERT(VARBINARY(MAX), ''), 'Manual Migration');
--    ('201408040000000_PubliclySearchable',      CONVERT(VARBINARY(MAX), ''), 'Manual Migration');
--    ('201408130000000_MultipleCollections',     CONVERT(VARBINARY(MAX), ''), 'Manual Migration');

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion) VALUES ('201305102053361_RemoveBetaFields',            'Manual Migration');
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion) VALUES ('201305102115428_RemoveRITree',                'Manual Migration');
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion) VALUES ('201305102117597_AddRITreeWithIndex',          'Manual Migration');
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion) VALUES ('201305240425388_ChangeTours',                 'Manual Migration');
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion) VALUES ('201305282325585_TitleLength',                 'Manual Migration');
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion) VALUES ('201306040017265_ToursDescription',            'Manual Migration');
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion) VALUES ('201306050753190_ProgressiveLoad',             'Manual Migration');
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion) VALUES ('201306072040327_ToursUserMissingMaxLen',      'Manual Migration');
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion) VALUES ('201306210425512_IncreaseYearPrecision',       'Manual Migration');
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion) VALUES ('201306210557399_RemoveBFSCachedFields',       'Manual Migration');
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion) VALUES ('201406020351501_MultipleEditors',             'Manual Migration');
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion) VALUES ('201408040000000_PubliclySearchable',          'Manual Migration');
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion) VALUES ('201408130000000_MultipleCollections',         'Manual Migration');
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion) VALUES ('201502100000000_AddBackgroundUrlAspectRatio', 'Manual Migration');
GO