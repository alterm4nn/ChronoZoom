-- Add PubliclySearchable field to Collections table:
ALTER TABLE [Collections] ADD [PubliclySearchable] BIT NOT NULL DEFAULT (0);
GO


-- Default is that all existing collections are not publicly searchable, and
-- new collections when created will be publicly searchable, (publicly searchable set to true in code at creation.)
-- However, we need a special exception to make the Cosmos' collection publicly searchable, if it already exists:

DECLARE @CollectionId AS UNIQUEIDENTIFIER =
    (SELECT TOP 1 Collection_Id From [Timelines] WITH (NOLOCK) WHERE Id = '00000000-0000-0000-0000-000000000000');

UPDATE  [Collections]
SET     PubliclySearchable = 1
WHERE   Id = @CollectionId;


-- We'll be renaming Cosmos' curator to ChronoZoom. However, since a user called ChronoZoom already exists in the
-- www.chronozoom.com production instance, (without any content,) we'll first rename that user to CZAdmin, if can be found.
-- Ditto for that users' supercollection, so the supercollection title is matched to the users' new display name.

UPDATE  [Users]
SET     DisplayName = 'CZAdmin'
WHERE   DisplayName = 'ChronoZoom';

UPDATE  [SuperCollections]
SET     Title = 'CZAdmin'
WHERE   Title = 'ChronoZoom';


-- An existing Cosmos' super-collection name may be 'Beta Content'. Ditto for the collection name.
-- Change to something more appropriate to display: 'ChronoZoom' and 'Cosmos' respectively.
UPDATE  [SuperCollections]
SET     Title = 'ChronoZoom'
WHERE   Id = (SELECT SuperCollection_Id FROM [Collections] WITH (NOLOCK) WHERE Id = @CollectionId);

UPDATE  [Collections]
SET     Title = 'Cosmos'
WHERE   Id = @CollectionId;


-- An existing Cosmos' collection owner may have user name of 'NotDefined' or worse, a copy of the NameIdentifier.
-- Now we're exposing user name in search results, change that to 'ChronoZoom':
UPDATE  [Users]
SET     DisplayName = 'ChronoZoom'
WHERE   Id =
(
    SELECT [User_Id] FROM [Collections] WITH (NOLOCK) WHERE Id = @CollectionId
);


-- Note transformation completed:
INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201408040000000_PubliclySearchable', 'Manual Migration');
GO
