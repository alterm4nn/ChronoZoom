








CREATE PROCEDURE [dbo].[GenerateThresholdViewVersion]
@VersionNumber int
AS

INSERT INTO dbo.Staging_ThresholdView
SELECT *
FROM (
select	Version_Threshold.ID,
		Version_Threshold.Threshold,
		Version_Threshold.IsDeleted,
		Version_TimeUnit.Timeunit,
		Version_Threshold.ThresholdDate,
		Version_Threshold.ThresholdYear,
		Version_Threshold.ShortDescription,
		Version_Bookmark.URL,
		Version_Threshold.CurrVersion,
		CASE
			WHEN (Version_Threshold.IsDeleted = 1) OR
				(Version_Bookmark.IsDeleted = 1) OR
				(Version_TimeUnit.IsDeleted = 1) THEN 0
		ELSE 1 END AS [IncludeInVersion],
		NEWID() as NEW_ID
from Version_Threshold
inner join Version_Bookmark on Version_Bookmark.ID = Version_Threshold.BookmarkID
			AND	Version_Bookmark.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Bookmark 
											WHERE Version_Bookmark.CurrVersion <= @VersionNumber
											AND Version_Bookmark.ID = Version_Threshold.BookmarkID)
inner join Version_TimeUnit on Version_TimeUnit.ID = Version_Threshold.ThresholdTimeUnit
			AND	Version_TimeUnit.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TimeUnit 
											WHERE Version_TimeUnit.CurrVersion <= @VersionNumber
											AND Version_TimeUnit.ID = Version_Threshold.ThresholdTimeUnit)
WHERE Version_Threshold.CurrVersion = (	SELECT MAX(CurrVersion) 
								FROM Version_Threshold as CurrView
								WHERE CurrView.CurrVersion <= @VersionNumber
								AND CurrView.ID = Version_Threshold.ID)
) as tab
WHERE [IncludeInVersion] = 1








