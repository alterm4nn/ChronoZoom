

	CREATE PROC [dbo].[spGetVisibleTimelinesForSearch]
		@environment int 
	AS
		DECLARE @timeline_table TABLE(
		table_id int IDENTITY (1,1),
		id uniqueidentifier ,
		uniqueId int Primary Key)

		INSERT @timeline_table
		SELECT	DISTINCT ID, UniqueId 
		FROM Timeline WHERE (Timeline.IsDeleted = 0) OR (Timeline.IsVisible = 0)
		
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
					if @environment = 0
					BEGIN
					INSERT @timeline_table
					SELECT DISTINCT ID, UniqueId FROM dbo.Auth_TimelineView
					WHERE ParentTimelineID = @id
					END
					ELSE IF @environment = 1
					BEGIN
					INSERT @timeline_table
					SELECT DISTINCT ID, UniqueId FROM dbo.Prod_TimelineView
					WHERE ParentTimelineID = @id
					END
					ELSE
					BEGIN
					INSERT @timeline_table
					SELECT DISTINCT ID, UniqueId FROM dbo.Staging_TimelineView
					WHERE ParentTimelineID = @id
					END
				END TRY
				BEGIN CATCH
				END CATCH
				
				-- increment counter for next timeline 
				SET @i = @i + 1
			END
		
		if @environment = 0
		BEGIN
		SELECT * FROM dbo.Auth_TimelineView WHERE UniqueID NOT IN (SELECT uniqueid from @timeline_table) ORDER BY Title
		END
		ELSE IF @environment = 1
		BEGIN
		SELECT * FROM dbo.Prod_TimelineView WHERE UniqueID NOT IN (SELECT uniqueid from @timeline_table) ORDER BY Title
		END
		ELSE
		BEGIN
		SELECT * FROM dbo.Staging_TimelineView WHERE UniqueID NOT IN (SELECT uniqueid from @timeline_table) ORDER BY Title
		END
		RETURN;


