-- add PubliclySearchable field to Collections table

ALTER TABLE [Collections] ADD [PubliclySearchable] BIT NOT NULL DEFAULT (0);
GO


-- note transformation completed --

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201408040000000_PubliclySearchable', 'Manual Migration');
GO
