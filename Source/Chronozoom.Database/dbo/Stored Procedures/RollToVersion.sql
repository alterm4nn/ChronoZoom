CREATE PROCEDURE [dbo].[RollToVersion]
@VersionNumber int
AS
BEGIN

DECLARE @DataStatements as table(DataStatementsID int primary key identity(1,1), 
								[TableName] nvarchar(512),
								[TableObjectID] int,
								[HasIdentity] int,
								[DisableStatement] nvarchar(512),
								[DeleteStatement] nvarchar(512),
								[EnableStatement] nvarchar(512))
DECLARE @ret TABLE(TABLE_QUALIFIER sysname, TABLE_OWNER sysname,TABLE_NAME sysname,COLUMN_NAME sysname,KEY_SEQ smallint, PK_NAME sysname)

INSERT INTO @DataStatements
select t.name,
	t.object_id,
	OBJECTPROPERTY(t.object_id, 'TableHasIdentity'),
	'ALTER TABLE [' + t.name + '] NOCHECK CONSTRAINT ALL
ALTER TABLE [' + t.name + '] DISABLE TRIGGER ALL',
	'DELETE FROM [' + t.name + ']',
	'ALTER TABLE [' + t.name + '] CHECK CONSTRAINT ALL
ALTER TABLE [' + t.name + '] ENABLE TRIGGER ALL'
from sys.tables as t, sys.columns as c
where t.object_id = c.object_id
and t.object_id IN( SELECT object_id FROM sys.columns ic where ic.name like 'ModifiedOn')
and c.name like 'CurrVersion'
and t.name not like 'Version_%'
and t.name not like 'Prod_%'
and t.name not like 'Staging_%'

DECLARE @index int
DECLARE @count int

SELECT @count = COUNT(*)
FROM @DataStatements

SET @index = 1;
WHILE(@index <= @count) 
BEGIN
	DECLARE @DisableStatement nvarchar(512) 

	SELECT	@DisableStatement = DisableStatement
	FROM @DataStatements
	WHERE DataStatementsID = @index

	EXEC (@DisableStatement)

	SET @index = @index + 1
END

DECLARE @HasIdentity int
BEGIN TRY
	BEGIN TRANSACTION

	SET @index = 1;
	WHILE(@index <= @count) 
	BEGIN
		DECLARE @TableName nvarchar(512) 
		DECLARE @TableObjectID int
		DECLARE @DeleteStatement nvarchar(512) 
		DECLARE @InsertStatement nvarchar(max) 
		DECLARE @columnList nvarchar(max)
		DECLARE @primaryKeyColumnName nvarchar(max)
		SET @HasIdentity = 1;
		
		SELECT	@TableName = TableName,
				@TableObjectID = TableObjectID,
				@DeleteStatement = DeleteStatement,
				@HasIdentity = HasIdentity
		FROM @DataStatements
		WHERE DataStatementsID = @index

		EXEC CreateColumnListForTableInsert @TableObjectID, @columnList OUTPUT

		INSERT INTO @ret 
		EXEC sp_pkeys @TableName 
		SELECT @primaryKeyColumnName = COLUMN_NAME FROM @ret
		
		SET @InsertStatement = 
		CASE WHEN @HasIdentity = 1 THEN 'SET IDENTITY_INSERT [' + @TableName + '] ON;' ELSE ''END +
		'INSERT INTO [' + @TableName + '] (' + @columnList + ')
								SELECT ' + @columnList + '
								FROM [Version_' + @TableName + ']
								WHERE [Version_' + @TableName + '].CurrVersion = (	SELECT MAX(CurrVersion) 
																				FROM [Version_' + @TableName + '] as tab2
																				WHERE tab2.CurrVersion <= ' + CAST(@VersionNumber as nvarchar(32)) + '
																				AND tab2.[' + @primaryKeyColumnName+ '] = [Version_' + @TableName + '].[' + @primaryKeyColumnName+ ']);' +
		CASE WHEN @HasIdentity = 1 THEN 'SET IDENTITY_INSERT [' + @TableName + '] OFF;' ELSE ''END
		
		EXEC (@DeleteStatement)
		EXEC (@InsertStatement)

		SET @index = @index + 1
	END

	COMMIT TRANSACTION
END TRY
BEGIN CATCH
	IF(@HasIdentity = 1)
	BEGIN
		EXEC ('SET IDENTITY_INSERT [' + @TableName + '] OFF')
	END
	SELECT ERROR_MESSAGE()
	ROLLBACK TRANSACTION
END CATCH

SET @index = 1;
WHILE(@index <= @count) 
BEGIN
	DECLARE @EnableStatement nvarchar(512) 
	
	SELECT	@EnableStatement = EnableStatement
	FROM @DataStatements
	WHERE DataStatementsID = @index

	EXEC (@EnableStatement)
	
	SET @index = @index + 1
END

END



GO


