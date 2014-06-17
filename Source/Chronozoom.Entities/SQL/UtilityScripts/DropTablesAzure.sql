IF (SELECT OBJECT_ID(N'[dbo].[__MigrationHistory]', 'U')) IS NOT NULL DROP TABLE __MigrationHistory;
IF (SELECT OBJECT_ID(N'[dbo].[MigrationHistory]',   'U')) IS NOT NULL DROP TABLE MigrationHistory;

IF (SELECT 1 FROM sys.triggers WHERE name = 'Exhibits_InsertUpdate') = 1 DROP TRIGGER [Exhibits_InsertUpdate];

DROP TABLE Bookmarks;
DROP TABLE Tours;

DROP TABLE TripleObjects;
DROP TABLE TriplePrefixes;
DROP TABLE Triples;

DROP TABLE ContentItems;
DROP TABLE Exhibits;
DROP TABLE Timelines;
DROP TABLE Members;
DROP TABLE Collections;
DROP TABLE SuperCollections;

DROP TABLE Bitmasks;
DROP TABLE Users;
