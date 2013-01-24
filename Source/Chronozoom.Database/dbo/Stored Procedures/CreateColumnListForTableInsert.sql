
CREATE Procedure [dbo].[CreateColumnListForTableInsert]
@tableObjectId int,
@columnList nvarchar(max) OUTPUT
AS
BEGIN
	DECLARE @ColumnNames as table(ColumnNameID int primary key identity(1,1), 
								 [ColumnName] nvarchar(512))
	DECLARE @index int
	DECLARE @count int
	
	INSERT INTO @ColumnNames 
	SELECT c.name 
	FROM sys.columns as c
	WHERE c.object_id = @tableObjectId

	SET @index = 1;
	SELECT @count = COUNT(*)
	FROM @ColumnNames

	SET @columnList = '';
	WHILE(@index <= @count) 
	BEGIN		
		DECLARE @columnName nvarchar(512)
		
		SELECT @columnName = ColumnName
		FROM @ColumnNames
		WHERE ColumnNameID = @index
		
		SET @columnList = @columnList + (CASE WHEN @index > 1 THEN ',' ELSE '' END) + '[' + @columnName + ']'
		
		SET @index = @index + 1
	END
END

