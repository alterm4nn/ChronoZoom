/*
    It is important to rename the __MigrationHistory table to prevent
    Entity Framework from performing a schema version check.

    EXEC sp_rename '__MigrationHistory', 'MigrationHistory' does not work.
    Probably this is because table is a system table. So, we will create
    a new table from scratch, move data over then delete old table.
*/

CREATE TABLE [dbo].[MigrationHistory] -- need not be a system table - marked as a system table just to hide
(
	[MigrationId]       [nvarchar](255)         NOT NULL,
	[Model]             [varbinary](max)        NOT NULL,
	[ProductVersion]    [nvarchar](32)          NOT NULL,
    CONSTRAINT [PK_dbo.MigrationHistory] PRIMARY KEY CLUSTERED 
    (
	    [MigrationId] ASC
    )
    ON [PRIMARY]
)
ON [PRIMARY]
GO

EXEC sys.sp_MS_marksystemobject [MigrationHistory]
GO

INSERT INTO [MigrationHistory] (MigrationId, Model, ProductVersion)
SELECT MigrationId, Model, ProductVersion FROM [__MigrationHistory] (NOLOCK);
GO

DROP TABLE __MigrationHistory;
GO
