






CREATE PROCEDURE [dbo].[GenerateTimelineViewVersion]
@VersionNumber int
AS

INSERT INTO dbo.Staging_TimelineView
SELECT *
FROM (
SELECT *,
	CASE WHEN Version_Timeline.IsDeleted = 1 OR
				Version_Timeline.IsVisible = 0 THEN 0
		ELSE 1 END AS [IncludeInVersion],
	NEWID() as NEW_ID
FROM Version_Timeline
WHERE Version_Timeline.CurrVersion = (	SELECT MAX(CurrVersion) 
								FROM Version_Timeline as CurrView
								WHERE CurrView.CurrVersion <= @VersionNumber
								AND CurrView.ID = Version_Timeline.ID)
) as tab
WHERE [IncludeInVersion] = 1





