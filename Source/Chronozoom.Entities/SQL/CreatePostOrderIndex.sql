IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'PostOrderTraversal') AND type in (N'P', N'PC'))
	DROP PROCEDURE PostOrderTraversal
GO

CREATE PROCEDURE PostOrderTraversal
	@timeline_id UNIQUEIDENTIFIER,
	@first_node_in_subtree UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
	DECLARE @set_first_node_in_subtree BIT 	
	DECLARE @chld_cnt INT
	DECLARE @current_id UNIQUEIDENTIFIER
	DECLARE @previous_id UNIQUEIDENTIFIER
	DECLARE @current_first_node_in_subtree UNIQUEIDENTIFIER
	DECLARE post_order_traversal_cur CURSOR LOCAL FOR SELECT Id FROM Timelines WHERE Timeline_Id = @timeline_id
	DECLARE @chld TABLE (
		Id UNIQUEIDENTIFIER
	)
	SET @set_first_node_in_subtree = 0
	SELECT @chld_cnt = COUNT(Id) FROM Timelines WHERE Timeline_Id = @timeline_id
	IF @chld_cnt > 0
	BEGIN
		OPEN post_order_traversal_cur
		FETCH NEXT FROM post_order_traversal_cur INTO @current_id
		WHILE @@FETCH_STATUS = 0
		BEGIN
			EXEC PostOrderTraversal @timeline_id = @current_id, @first_node_in_subtree = @current_first_node_in_subtree OUTPUT			
			IF @set_first_node_in_subtree = 0
			BEGIN	
				SET @first_node_in_subtree = @current_first_node_in_subtree
				SET @set_first_node_in_subtree = 1
			END
			ELSE
			BEGIN
				UPDATE Timelines SET Predecessor = @previous_id WHERE Id = @current_first_node_in_subtree
				UPDATE Timelines SET Successor = @current_first_node_in_subtree WHERE Id = @previous_id
			END
			SET @previous_id = @current_id
			FETCH NEXT FROM post_order_traversal_cur INTO @current_id
		END
		CLOSE post_order_traversal_cur
		UPDATE Timelines SET Successor = @timeline_id WHERE Id = @previous_id
		UPDATE Timelines SET Predecessor = @previous_id WHERE Id = @timeline_id
	END
	ELSE
		SET @first_node_in_subtree = @timeline_id
	UPDATE Timelines SET FirstNodeInSubtree = @first_node_in_subtree WHERE Id = @timeline_id
	DEALLOCATE post_order_traversal_cur
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'CreatePostOrderIndex') AND type in (N'P', N'PC'))
	DROP PROCEDURE CreatePostOrderIndex
GO

CREATE PROCEDURE CreatePostOrderIndex
	@collection_id UNIQUEIDENTIFIER
AS 
BEGIN
	DECLARE @current_id UNIQUEIDENTIFIER
	DECLARE @current_first_node_in_subtree UNIQUEIDENTIFIER
	DECLARE create_post_order_index_cur CURSOR LOCAL FOR SELECT Id FROM Timelines WHERE Collection_Id = @collection_id AND (Timeline_Id = CAST(CAST (0 AS BINARY) AS UNIQUEIDENTIFIER) OR Timeline_Id IS NULL)	
	UPDATE Timelines SET Successor = CAST(CAST (0 AS BINARY) AS UNIQUEIDENTIFIER), Predecessor = CAST(CAST (0 AS BINARY) AS UNIQUEIDENTIFIER), FirstNodeInSubtree = CAST(CAST (0 AS BINARY) AS UNIQUEIDENTIFIER) WHERE Collection_Id = @collection_id 
	OPEN create_post_order_index_cur
	FETCH NEXT FROM create_post_order_index_cur INTO @current_id
	WHILE @@FETCH_STATUS = 0
	BEGIN
		EXEC PostOrderTraversal @timeline_id = @current_id, @first_node_in_subtree = @current_first_node_in_subtree OUTPUT
		FETCH NEXT FROM create_post_order_index_cur INTO @current_id	
	END
	CLOSE create_post_order_index_cur
	DEALLOCATE create_post_order_index_cur
END
GO