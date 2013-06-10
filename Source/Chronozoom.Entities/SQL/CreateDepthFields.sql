IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'CreateDepthFields') AND type in (N'P', N'PC'))
	DROP PROCEDURE CreateDepthFields
GO

CREATE PROCEDURE CreateDepthFields
	@collection_id UNIQUEIDENTIFIER
AS 
BEGIN
	DECLARE @current_depth INT
	DECLARE @current_level_size INT
	DECLARE @current_id UNIQUEIDENTIFIER
	DECLARE @current_level TABLE (
		Id UNIQUEIDENTIFIER
	)
	DECLARE @next_level TABLE (
		Id UNIQUEIDENTIFIER
	)
	DECLARE create_depth_field_cur CURSOR LOCAL FOR SELECT Id FROM @current_level
	SET @current_depth = 0
	INSERT INTO @current_level SELECT Id FROM Timelines WHERE Collection_Id = @collection_id AND (Timeline_Id = CAST(CAST(0 AS BINARY) AS UNIQUEIDENTIFIER) OR Timeline_Id IS NULL) 
	SELECT @current_level_size=COUNT(Id) FROM @current_level
	WHILE @current_level_size > 0
	BEGIN
		OPEN create_depth_field_cur
		FETCH NEXT FROM create_depth_field_cur INTO @current_id
		WHILE @@FETCH_STATUS = 0
		BEGIN
			UPDATE Timelines SET Depth = @current_depth WHERE Id = @current_id 
			INSERT INTO @next_level SELECT Id FROM Timelines WHERE Timeline_Id = @current_id  
			FETCH NEXT FROM create_depth_field_cur INTO @current_id
		END
		CLOSE create_depth_field_cur
		DELETE FROM @current_level
		INSERT INTO @current_level SELECT Id FROM @next_level
		DELETE FROM @next_level
		SELECT @current_level_size=COUNT(Id) FROM @current_level
		SET @current_depth = @current_depth + 1
	END
	DEALLOCATE create_depth_field_cur
END
GO