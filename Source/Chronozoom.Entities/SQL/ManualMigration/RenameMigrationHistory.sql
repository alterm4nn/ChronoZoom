/*
    It is important to rename the __MigrationHistory table to prevent
    Entity Framework from performing a schema version check.
    
    EXEC sp_rename '__MigrationHistory', 'MigrationHistory' does not work if table was previously
    marked as a system table using sp_MS_marksystemobject. So, we will create a new table from scratch,
    move the data from the old table to the new table, then delete the old table.
    
    Note that we don't use sp_MS_marksystemobject as this is not supported in Azure.
    It actually isn't required and was only used to hide the table, not for any other purpose.
*/

CREATE TABLE [dbo].[MigrationHistory]
(
	[MigrationId]       [nvarchar](255)         NOT NULL,
	[Model]             [varbinary](max)        NOT NULL,
	[ProductVersion]    [nvarchar](32)          NOT NULL,
    CONSTRAINT [PK_dbo.MigrationHistory] PRIMARY KEY CLUSTERED 
    (
	    [MigrationId] ASC
    )
)
GO

INSERT INTO [MigrationHistory] (MigrationId, Model, ProductVersion)
SELECT MigrationId, Model, ProductVersion FROM [__MigrationHistory] (NOLOCK);
GO

DROP TABLE __MigrationHistory;
GO
