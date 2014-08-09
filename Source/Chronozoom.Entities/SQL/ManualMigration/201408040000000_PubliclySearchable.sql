-- add PubliclySearchable field to Collections table

ALTER TABLE [Collections] ADD [PubliclySearchable] BIT NOT NULL DEFAULT (0);
GO

-- Default is that all existing collections are not publicly searchable, and
-- new collections when created will be publicly searchable, (publicly searchable set to true in code at creation.)
-- However, we need a special exception to make Cosmos' collection publicly searchable, if it already exists:
UPDATE  [Collections]
SET     PubliclySearchable = 1
WHERE   Id IN
(
    SELECT Collection_Id From [Timelines] WITh (NOLOCK) WHERE Id = '00000000-0000-0000-0000-000000000000'
);

-- note transformation completed --

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201408040000000_PubliclySearchable', 'Manual Migration');
GO
