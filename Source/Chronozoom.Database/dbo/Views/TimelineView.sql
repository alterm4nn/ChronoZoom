




CREATE VIEW [dbo].[TimelineView]
AS

SELECT *,
	CASE WHEN Version_Timeline.IsDeleted = 1 OR
				Version_Timeline.IsVisible = 0 THEN 0
		ELSE 1 END AS [IncludeInVersion]
FROM Version_Timeline



