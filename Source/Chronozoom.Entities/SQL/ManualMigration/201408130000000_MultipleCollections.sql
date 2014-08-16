-- Tighten-up schema so required fields are not null and field lengths are not crazy since they are used in URLs.
-- A recent copy of the chronozoom.com production database was examined to ensure that it fits these adjustments.

BEGIN TRY
    DROP INDEX [IX_User_Id]             ON [dbo].[SuperCollections];
    DROP INDEX [IX_User_Id]             ON [dbo].[Collections];
    DROP INDEX [IX_SuperCollection_Id]  ON [dbo].[Collections];
END TRY
BEGIN CATCH
END CATCH
GO

ALTER TABLE [Users]             ALTER COLUMN [DisplayName]          NVARCHAR(50)        NOT NULL;
ALTER TABLE [Users]             ALTER COLUMN [Email]                VARCHAR(100)        NULL;
ALTER TABLE [Users]             ALTER COLUMN [NameIdentifier]       VARCHAR(150)        NULL;
ALTER TABLE [Users]             ALTER COLUMN [IdentityProvider]     VARCHAR(25)         NULL;
ALTER TABLE [SuperCollections]  ALTER COLUMN [Title]                VARCHAR(50)         NOT NULL;
ALTER TABLE [SuperCollections]  ALTER COLUMN [User_Id]              UNIQUEIDENTIFIER    NOT NULL;
ALTER TABLE [Collections]       ALTER COLUMN [Title]                NVARCHAR(50)        NOT NULL;
ALTER TABLE [Collections]       ALTER COLUMN [User_Id]              UNIQUEIDENTIFIER    NOT NULL;
ALTER TABLE [Collections]       ALTER COLUMN [SuperCollection_Id]   UNIQUEIDENTIFIER    NOT NULL;
GO

CREATE NONCLUSTERED INDEX [IX_User_Id]              ON [dbo].[SuperCollections]
(
	[User_Id] ASC
);
CREATE NONCLUSTERED INDEX [IX_User_Id]              ON [dbo].[Collections]
(
	[User_Id] ASC
);
CREATE NONCLUSTERED INDEX [IX_SuperCollection_Id]   ON [dbo].[Collections]
(
	[SuperCollection_Id] ASC
);
GO


-- Fix "____" user display name, supercollection name and collection name (if present.)
-- This user has no exhibits/content so OK to rename as long as we inform user of new name.
-- User's email address is learn.cz.demo@gmail.com.

UPDATE [Users]              SET DisplayName = 'LearnCZ' WHERE DisplayName   = '____';
UPDATE [SuperCollections]   SET Title       = 'LearnCZ' WHERE Title         = '____';
UPDATE [Collections]        SET Title       = 'LearnCZ' WHERE Title         = '____';
GO


-- Add path field to collection, including unique constraint amongst other collections belonging to the same supercollection.
-- Will hold part of the URL used to distinguish this collection from other collections belonging to the same supercollection.
-- Additionally add default collection indicator since users can have more than one collection.

ALTER TABLE [Collections]
ADD
    [Default]   BIT         NOT NULL DEFAULT (0),
    [Path]      VARCHAR(50) NULL                    -- null for now until we set values in following update
GO

UPDATE [Collections]
    SET [Path] =
    LOWER
    (
        REPLACE                                     -- only existing URL unfriendly chars to contend with as found in production
        (
            REPLACE
            (
                REPLACE
                (
                    [Title],
                    ' ', ''
                ),
                '_', ''
            ),
            '*', ''
        )
    );
GO

ALTER TABLE [Collections]       ALTER COLUMN [Path]                 VARCHAR(50)         NOT NULL;
ALTER TABLE [Collections]       WITH CHECK
ADD
    CONSTRAINT [UK_dbo.Collections_Title] UNIQUE
    (
	    [SuperCollection_Id]    ASC,
        [Title]                 ASC
    ),
    CONSTRAINT [UK_dbo.Collections_Path]  UNIQUE
    (
	    [SuperCollection_Id]    ASC,
        [Path]                  ASC
    );
GO


-- Remove existing URL unfriendly chars from supercollection names too.
-- User display names can have unfriendly chars in them and supercollection name will be the equivalent to the path field.

UPDATE [SuperCollections]
    SET [Title] =
    LOWER
    (
        REPLACE                                     -- only existing URL unfriendly chars to contend with as found in production
        (
            REPLACE
            (
                REPLACE
                (
                    [Title],
                    ' ', ''
                ),
                '_', ''
            ),
            '*', ''
        )
    );
GO


-- enforce unique constraints for users' display name and supercollections' title --

IF NOT EXISTS(SELECT DisplayName FROM [Users]       WITH (NOLOCK) GROUP BY DisplayName  HAVING COUNT(*) > 1)
    ALTER TABLE     [dbo].[Users]                   WITH CHECK
    ADD CONSTRAINT  [UK_dbo.Users_DisplayName]      UNIQUE (DisplayName ASC);

IF NOT EXISTS(SELECT Title FROM [SuperCollections]  WITH (NOLOCK) GROUP BY Title        HAVING COUNT(*) > 1)
    ALTER TABLE     [dbo].[SuperCollections]        WITH CHECK
    ADD CONSTRAINT  [UK_dbo.SuperCollections_Title] UNIQUE (Title ASC);

GO


-- Make every collection the default collection for it's supercollection if the collection is the only collection in the supercollection.

UPDATE  [Collections]
SET     [Default] = 1
WHERE   SuperCollection_Id NOT IN
(
    SELECT SuperCollection_Id FROM [Collections] WITH (NOLOCK) GROUP BY SuperCollection_Id HAVING COUNT(*) > 1
);


-- Make 'cosmos' the default collection in the 'chronozoom' supercollection.

UPDATE  [Collections]
SET     [Default] = 1
WHERE   Id =
(
    SELECT TOP 1 Collection_Id From [Timelines] WITH (NOLOCK) WHERE Id = '00000000-0000-0000-0000-000000000000'
);


-- note transformation completed --

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201408130000000_MultipleCollections', 'Manual Migration');
GO
