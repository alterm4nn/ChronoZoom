CREATE Procedure [dbo].[GetPrimaryKey]
@tableName nvarchar(256)
AS
BEGIN

EXEC sp_pkeys @tableName
END