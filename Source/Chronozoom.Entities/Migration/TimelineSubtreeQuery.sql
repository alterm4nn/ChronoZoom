CREATE PROCEDURE TimelineSubtreeQuery
	@LCA UNIQUEIDENTIFIER = NULL,
	@Collection_Id UNIQUEIDENTIFIER,
	@min_span DECIMAL,
	@startTime DECIMAL,
	@endTime DECIMAL,
	@max_elem INT
AS
BEGIN
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

	IF @LCA = CAST(CAST(0 AS BINARY) AS UNIQUEIDENTIFIER)
		INSERT INTO @current_level SELECT Id FROM Timelines WHERE Depth = 0 AND Collection_ID =  @Collection_Id
	ELSE
		INSERT INTO @current_level VALUES (@LCA)
	
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
			SELECT @num_ge_min_span=COUNT(Id) FROM (SELECT TOP(1) Id FROM Timelines WHERE Timeline_ID = @current_id AND ToYear - FromYear >= @min_span) AS ChildTimelines
			IF @num_ge_min_span > 0
			BEGIN
				INSERT INTO @results VALUES(@current_id)
				SET @cnt = @cnt + 1
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
	END

	SELECT * FROM Timeline WHERE Id IN (SELECT Id FROM @results) 
END
