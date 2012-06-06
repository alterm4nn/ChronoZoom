CREATE VIEW [dbo].[Auth_ThresholdView]
AS
select	Threshold.ID,
		Threshold.Threshold,
		Threshold.IsDeleted,
		TimeUnit.Timeunit,
		Threshold.ThresholdDate,
		Threshold.ThresholdYear,
		Threshold.ShortDescription,
		Bookmark.URL,
		Threshold.CurrVersion
from Threshold
inner join Bookmark on Bookmark.ID = Threshold.BookmarkID
inner join TimeUnit on TimeUnit.ID = Threshold.ThresholdTimeUnit
WHERE (Threshold.IsDeleted IS NULL OR Threshold.IsDeleted = 0)
AND (Bookmark.IsDeleted IS NULL OR Bookmark.IsDeleted = 0)
AND (TimeUnit.IsDeleted IS NULL OR TimeUnit.IsDeleted = 0)
