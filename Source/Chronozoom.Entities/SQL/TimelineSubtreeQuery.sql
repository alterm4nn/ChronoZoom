CREATE PROCEDURE TimelineSubtreeQuery
	@collection_id UNIQUEIDENTIFIER,
	@start_time DECIMAL,
	@end_time DECIMAL,
	@min_span DECIMAL,
	@lca_id UNIQUEIDENTIFIER,
	@max_elem INT,
	@path_from_root BIT
AS
BEGIN
	DECLARE @next_year decimal
	DECLARE @cid UNIQUEIDENTIFIER -- current timeline id
	DECLARE @pid UNIQUEIDENTIFIER -- parent  timeline id
	DECLARE @path TABLE (Id UNIQUEIDENTIFIER, Depth INT) -- path from root to lca
	DECLARE @path_with_siblings TABLE (Id UNIQUEIDENTIFIER, Depth INT) -- for each timeline in path stores it children timelines
	DECLARE @path_count INT
	DECLARE @depth INT
	
	DECLARE @current_id UNIQUEIDENTIFIER
	DECLARE @current_level TABLE (Id UNIQUEIDENTIFIER)
	DECLARE @current_level_count INT
	DECLARE @next_level TABLE (Id UNIQUEIDENTIFIER)
	DECLARE @next_level_count INT
	DECLARE @valid_timelines TABLE (Id UNIQUEIDENTIFIER)
	DECLARE @invalid_timelines TABLE (Id UNIQUEIDENTIFIER)
	DECLARE @results TABLE (Id UNIQUEIDENTIFIER)
	DECLARE @results_count INT
	DECLARE @lca_start_time DECIMAL
	DECLARE @lca_end_time DECIMAL
	DECLARE @quit BIT
	DECLARE @temp INT

	SET @next_year = year(getdate());

	-- validate the supplied procedure parameters
	IF NOT(EXISTS(SELECT Id FROM Timelines WHERE Id = @lca_id AND Collection_Id = @collection_id)) RETURN
	SELECT @lca_start_time = FromYear, @lca_end_time = ToYear FROM Timelines WHERE Id = @lca_id AND Collection_Id = @collection_id
	IF (@start_time < @lca_start_time AND @end_time < @lca_start_time OR @start_time > @lca_end_time AND @end_time > @lca_end_time) RETURN
	IF (@start_time >= @end_time OR @min_span < 0 OR @max_elem <= 0) RETURN

	-- trace path from root to lca
	IF @path_from_root <> 0
	BEGIN
		SET @cid = @lca_id
		SELECT @pid = Timeline_Id, @depth = Depth FROM Timelines WHERE Id = @cid AND Collection_Id = @collection_id
		WHILE @pid IS NOT NULL
		BEGIN
			INSERT INTO @path VALUES (@cid, @depth)
			INSERT INTO @path_with_siblings SELECT Id, Depth FROM Timelines WHERE Timeline_Id = @cid AND Collection_Id = @collection_id
			SET @cid = @pid
			SELECT @pid = Timeline_Id, @depth = Depth FROM Timelines WHERE Id = @cid AND Collection_Id = @collection_id
		END
		INSERT INTO @path VALUES (@cid, @depth) -- insert the root timeline
		INSERT INTO @path_with_siblings VALUES (@cid, @depth)
		INSERT INTO @path_with_siblings SELECT Id, Depth FROM Timelines WHERE Timeline_Id = @cid AND Collection_Id = @collection_id
	
		SELECT @depth = MAX(depth) FROM @path
		DELETE FROM @path_with_siblings WHERE Depth = @depth + 1 -- remove children of lca
		SELECT @path_count = COUNT(Id) FROM @path_with_siblings
	END
	ELSE
	BEGIN
		SELECT @depth = Depth FROM Timelines WHERE Id = @lca_id AND Collection_Id = @collection_id
		INSERT INTO @path VALUES (@lca_id, @depth) -- insert the root timeline
		INSERT INTO @path_with_siblings VALUES (@lca_id, @depth)
		SET @path_count = 1
	END

	IF @path_from_root <> 0 AND @path_count > @max_elem
	BEGIN
		WHILE (@path_count > @max_elem AND @depth >= 0)
		BEGIN
			DELETE FROM @path WHERE Depth = @depth
			DELETE FROM @path_with_siblings WHERE Depth = @depth
			SELECT @path_count = COUNT(Id) FROM @path_with_siblings
			SET @depth = @depth - 1
		END
		INSERT INTO @results SELECT Id FROM @path_with_siblings
		SET @results_count = @path_count
	END
	ELSE
	BEGIN
		INSERT INTO @results SELECT Id FROM @path_with_siblings
		SET @results_count = @path_count
		INSERT INTO @current_level VALUES (@lca_id)
		SET @current_level_count = 1
		SET @quit = 0
		DECLARE cur_timeline_subtree_query CURSOR LOCAL FOR SELECT Id FROM @current_level
		WHILE (@current_level_count > 0 AND @results_count < @max_elem AND @quit <> 1)
		BEGIN
			OPEN cur_timeline_subtree_query
			FETCH NEXT FROM cur_timeline_subtree_query INTO @current_id
			WHILE (@@FETCH_STATUS = 0 AND @results_count < @max_elem AND @quit <> 1)
			BEGIN	
				SELECT @next_level_count = COUNT(Id) FROM Timelines WHERE Timeline_ID = @current_id AND Collection_Id = @collection_id
				IF @results_count + @next_level_count <= @max_elem
				BEGIN
					DELETE FROM @valid_timelines
					INSERT INTO @valid_timelines
						SELECT Id FROM Timelines
							WHERE Timeline_ID = @current_id 
							AND Collection_Id = @collection_id 
							AND dbo.Minimum(ToYear, @next_year) - FromYear >= @min_span
							AND NOT(FromYear < @start_time AND ToYear < @start_time
									OR FromYear > @end_time AND ToYear > @end_time)

					DELETE FROM @invalid_timelines
					INSERT INTO @invalid_timelines
						SELECT Id FROM Timelines 
						WHERE Timeline_ID = @current_id 
							AND Collection_Id = @collection_id 
							AND NOT(dbo.Minimum(ToYear, @next_year) - FromYear >= @min_span
							AND NOT(FromYear < @start_time AND ToYear < @start_time
									OR FromYear > @end_time AND ToYear > @end_time))
					
					INSERT INTO @next_level SELECT Id FROM @valid_timelines
					INSERT INTO @results SELECT Id FROM @valid_timelines
					INSERT INTO @results SELECT Id FROM @invalid_timelines
					SET @results_count = @results_count + @next_level_count
				END
				ELSE
				BEGIN
					SET @quit = 1
				END
				FETCH NEXT FROM cur_timeline_subtree_query INTO @current_id
			END -- end of inner while loop

			DELETE FROM @current_level
			INSERT INTO @current_level SELECT Id FROM @next_level
			SELECT @current_level_count = COUNT(Id) FROM @current_level
			DELETE FROM @next_level
			CLOSE cur_timeline_subtree_query
		END -- end of outer while loop
		DEALLOCATE cur_timeline_subtree_query
	END

	SELECT * FROM Timelines JOIN @results ON Timelines.Id = "@results".Id ORDER BY Depth, FromYear
END
