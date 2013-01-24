	CREATE PROC spGetVisibleTimelines
	AS
		DECLARE @timeline_table TABLE(
		table_id int IDENTITY (1,1),
		id uniqueidentifier ,
		uniqueId int Primary Key)

		INSERT @timeline_table
		SELECT DISTINCT ID, UniqueId FROM dbo.Timeline
		WHERE ((IsDeleted = 1 AND IsVisible = 1) OR IsVisible = 0)
		
		DECLARE @i int
		DECLARE @numrows int
		-- enumerate the table  
		SET @i = 1 
		SET @numrows = (SELECT COUNT(*) FROM @timeline_table)
 
		IF @numrows > 0 
			WHILE (@i < (SELECT MAX(table_id) FROM @timeline_table)) 
			BEGIN 
		 
				DECLARE @uniqueID int
				DECLARE @id uniqueidentifier
				-- get the next primary key 
				SELECT @id = id, @uniqueId = uniqueId FROM @timeline_table WHERE table_id = @i 
		 
				BEGIN TRY
					INSERT @timeline_table
					SELECT DISTINCT ID, UniqueID FROM dbo.Timeline
					WHERE ParentTimelineID = @id
				END TRY
				BEGIN CATCH
				END CATCH
				
				-- increment counter for next timeline 
				SET @i = @i + 1
			END
		
		SELECT * FROM dbo.Timeline WHERE UniqueID NOT IN (SELECT uniqueid from @timeline_table) ORDER BY Title
		RETURN;
