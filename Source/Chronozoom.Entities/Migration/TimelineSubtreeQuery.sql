CREATE PROCEDURE TimelineSubtreeQuery
	@Collection_Id UNIQUEIDENTIFIER,
	@LCA UNIQUEIDENTIFIER,
	@min_span DECIMAL,
	@startTime DECIMAL,
	@endTime DECIMAL,
	@max_elem INT
AS
BEGIN
	DECLARE @return_entire_subtree BIT
	DECLARE @subtree_size INT
	DECLARE @current_level_cnt INT
	DECLARE @cnt INT
	DECLARE @num_ge_min_span INT
	DECLARE @current_id UNIQUEIDENTIFIER
	DECLARE @current_level TABLE (
		Id UNIQUEIDENTIFIER
	)
	DECLARE @next_level TABLE (
		Id UNIQUEIDENTIFIER
	)
	DECLARE @results TABLE (
		Id UNIQUEIDENTIFIER
	)
	DECLARE cur CURSOR FOR SELECT Id FROM @current_level
	SET @return_entire_subtree = 0
	SET @subtree_size = 0
	IF @LCA = CAST(CAST(0 AS BINARY) AS UNIQUEIDENTIFIER)
		INSERT INTO @current_level SELECT Id FROM Timelines WHERE Depth = 0 AND Collection_ID =  @Collection_Id
	ELSE
	BEGIN
		INSERT INTO @current_level VALUES (@LCA)
		SELECT @subtree_size=SubtreeSize FROM Timelines WHERE Id = @LCA
		IF @subtree_size <= @max_elem
			SET @return_entire_subtree = 1
	END
	IF @return_entire_subtree = 1
	BEGIN
		SELECT @current_id=FirstNodeInSubtree FROM Timelines WHERE Id = @lca
		INSERT INTO @results VALUES(@current_id)
		WHILE @current_id <> @lca
		BEGIN
			SELECT @current_id=Successor FROM Timelines WHERE Id = @current_id
			INSERT INTO @results VALUES(@current_id)
		END
	END
	ELSE
	BEGIN
		SET @cnt = 0
		WHILE (@cnt < @max_elem)
		BEGIN
			SELECT @current_level_cnt=COUNT(Id) FROM @current_level
			IF @current_level_cnt = 0
				BREAK
			OPEN cur
			FETCH NEXT FROM cur INTO @current_id
			WHILE @@FETCH_STATUS = 0
			BEGIN
				INSERT INTO @results VALUES(@current_id)
				SET @cnt = @cnt + 1
				SELECT @num_ge_min_span=COUNT(Id) FROM (SELECT TOP(1) Id FROM Timelines WHERE Timeline_ID = @current_id AND ToYear - FromYear >= @min_span) AS ChildTimelines
				IF @num_ge_min_span > 0
				BEGIN
					IF @cnt < @max_elem
						INSERT INTO @next_level SELECT Id FROM Timelines WHERE Timeline_ID = @current_id AND ToYear - FromYear >= @min_span AND ((FromYear >= @startTime AND FromYear <= @endTime) OR (ToYear >= @startTime AND ToYear <= @endTime) OR (FromYear <= @startTime AND ToYear >= @endTime) OR (FromYear >= @startTime AND ToYear <= @endTime))
					ELSE
						BREAK
				END 
				FETCH NEXT FROM cur INTO @current_id
			END
			DELETE FROM @current_level
			INSERT INTO @current_level SELECT Id FROM @next_level
			DELETE FROM @next_level
			CLOSE cur 
		END
		DEALLOCATE cur
	END
	SELECT * FROM Timelines WHERE Id IN (SELECT Id FROM @results) ORDER BY Depth 
END
