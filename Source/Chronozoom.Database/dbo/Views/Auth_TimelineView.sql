CREATE VIEW [dbo].[Auth_TimelineView]
AS

SELECT	*
FROM Timeline
WHERE (Timeline.IsDeleted IS NULL OR Timeline.IsDeleted = 0)
AND (Timeline.IsVisible IS NULL OR Timeline.IsVisible = 1)
