







CREATE VIEW [dbo].[ThresholdView]
AS
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
		ELSE 1 END AS [IncludeInVersion]
from Version_Threshold
inner join Version_Bookmark on Version_Bookmark.ID = Version_Threshold.BookmarkID
			AND	Version_Bookmark.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Bookmark 
											WHERE Version_Bookmark.CurrVersion <= Version_Threshold.CurrVersion
											AND Version_Bookmark.ID = Version_Threshold.BookmarkID)
inner join Version_TimeUnit on Version_TimeUnit.ID = Version_Threshold.ThresholdTimeUnit
			AND	Version_TimeUnit.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TimeUnit 
											WHERE Version_TimeUnit.CurrVersion <= Version_Threshold.CurrVersion
											AND Version_TimeUnit.ID = Version_Threshold.ThresholdTimeUnit)







