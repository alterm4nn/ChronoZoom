-- Add PubliclySearchable field to Collections table:
ALTER TABLE [Collections] ADD [PubliclySearchable] BIT NOT NULL DEFAULT (0);
GO

-- Default is that all existing collections are not publicly searchable, and
-- new collections when created will be publicly searchable, (publicly searchable set to true in code at creation.)
-- However, we need a special exception to make Cosmos' collection publicly searchable, if it already exists:
UPDATE  [Collections]
SET     PubliclySearchable = 1
WHERE   Id IN
(
    SELECT Collection_Id From [Timelines] WITH (NOLOCK) WHERE Id = '00000000-0000-0000-0000-000000000000'
);

-- Older Cosmos' collection owner may have user name of 'NotDefined'.
-- Now we're exposing user name in search results, change that to 'ChronoZoom' if possible:
IF NOT EXISTS(SELECT 1 FROM [Users] WITH (NOLOCK) WHERE DisplayName  = 'ChronoZoom')
UPDATE  [Users]
SET     DisplayName = 'ChronoZoom'
WHERE   DisplayName = 'NotDefined';

-- Older Cosmos' collection name may be 'Beta Content'. Ditto for super-collection name.
-- Change to something more appropriate if possible:
IF NOT EXISTS(SELECT 1 FROM [SuperCollections] WITH (NOLOCK) WHERE Title = 'ChronoZoom')
BEGIN
    UPDATE  [SuperCollections]
    SET     Title = 'ChronoZoom'
    WHERE   Title = 'Beta Content';
    
    UPDATE  [Collections]
    SET     Title = 'Cosmos'
    WHERE   Title = 'Beta Content' AND SuperCollection_Id =
            (SELECT Id FROM [SuperCollections] WITH (NOLOCK) WHERE Title = 'ChronoZoom');
END;

-- Note transformation completed:
INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201408040000000_PubliclySearchable', 'Manual Migration');
GO
