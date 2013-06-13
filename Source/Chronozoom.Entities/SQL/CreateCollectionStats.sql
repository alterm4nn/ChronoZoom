IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'CreateCollectionStats') AND type in (N'P', N'PC'))
	DROP PROCEDURE CreateCollectionStats
GO

CREATE PROCEDURE CreateCollectionStats
	@Collection_Id UNIQUEIDENTIFIER
AS
BEGIN
	DECLARE @exhibit_cnt INT
	DECLARE @content_item_cnt INT
	DECLARE @chld_size INT
	DECLARE @root_id UNIQUEIDENTIFIER
	DECLARE @current_id UNIQUEIDENTIFIER
	DECLARE @successor_id UNIQUEIDENTIFIER
	DECLARE @root_level TABLE (
		Id UNIQUEIDENTIFIER
	)
	INSERT INTO @root_level SELECT Id FROM Timelines WHERE Depth = 0 AND Collection_ID =  @Collection_Id
	DECLARE create_collection_stats_cur CURSOR LOCAL FOR SELECT Id FROM @root_level
	OPEN create_collection_stats_cur
	FETCH NEXT FROM create_collection_stats_cur INTO @root_id
	WHILE @@FETCH_STATUS = 0
	BEGIN
		SELECT @current_id=FirstNodeInSubtree FROM Timelines WHERE Id = @root_id
		SELECT @exhibit_cnt=COUNT(Id) FROM Exhibits WHERE Timeline_Id = @current_id
		SELECT @content_item_cnt=COUNT(Id) FROM ContentItems WHERE Exhibit_Id IN (SELECT Id FROM Exhibits WHERE Timeline_Id = @current_id)
		UPDATE Timelines SET SubtreeSize = (@exhibit_cnt + @content_item_cnt) WHERE Id = @current_id
		WHILE @current_id <> @root_id 
		BEGIN
			SELECT @successor_id=Successor FROM Timelines WHERE Id = @current_id
			SET @current_id = @successor_id
			SELECT @exhibit_cnt=COUNT(Id) FROM Exhibits WHERE Timeline_Id = @current_id
			SELECT @content_item_cnt=COUNT(Id) FROM ContentItems WHERE Exhibit_Id IN (SELECT Id FROM Exhibits WHERE Timeline_Id = @current_id)
			SELECT @chld_size=SUM(SubtreeSize) FROM Timelines WHERE Timeline_Id = @current_id
			UPDATE Timelines SET SubtreeSize = (@chld_size + @exhibit_cnt + @content_item_cnt) WHERE Id = @current_id
		END
		FETCH NEXT FROM create_collection_stats_cur INTO @root_id
	END
	CLOSE create_collection_stats_cur
	DEALLOCATE create_collection_stats_cur 
END
GO