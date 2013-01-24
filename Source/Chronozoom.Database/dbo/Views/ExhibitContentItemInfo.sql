

CREATE VIEW [dbo].[ExhibitContentItemInfo]
AS
SELECT ContentItem.ID,
		Exhibit.ID as ExhibitID,
		ContentItem.Title,
		ContentItem.Caption,
		Threshold.Threshold,
		Regime.Regime,
		TimeUnit.TimeUnit,
		ContentItem.ContentDate,
		ContentItem.ContentYear,
		MediaType.MediaType,
		ContentItem.MediaBlobURL,
		ContentItem.MediaSource,
		ContentItem.Attribution,
		ExhibitContentItem.[Order],
		ContentItem.UniqueID
FROM ContentItem
INNER JOIN MediaType ON MediaType.ID = ContentItem.MediaTypeID
INNER JOIN ExhibitContentItem ON ExhibitContentItem.ContentItemID = ContentItem.ID
INNER JOIN Exhibit as Exhibit ON Exhibit.ID = ExhibitContentItem.ExhibitID
INNER JOIN TimelineExhibit ON TimelineExhibit.ExhibitID = Exhibit.ID
INNER JOIN TimeLine on Timeline.ID = TimelineExhibit.TimelineID
INNER JOIN Regime ON Regime.ID = ContentItem.RegimeID
INNER JOIN Threshold ON Threshold.ID = ContentItem.ThresholdID
INNER JOIN TimeUnit ON TimeUnit.ID = ContentItem.TimeUnitID
WHERE (Timeline.IsDeleted IS NULL OR Timeline.IsDeleted = 0)
AND (Timeline.IsVisible IS NULL OR Timeline.IsVisible = 1)
AND (TimelineExhibit.IsDeleted IS NULL OR TimelineExhibit.IsDeleted = 0)
AND (Exhibit.IsDeleted IS NULL OR Exhibit.IsDeleted = 0)
AND (Exhibit.IsVisible IS NULL OR Exhibit.IsVisible = 1)
AND (ExhibitContentItem.IsDeleted IS NULL OR ExhibitContentItem.IsDeleted = 0)
AND (ContentItem.IsDeleted IS NULL OR ContentItem.IsDeleted = 0)
AND (ContentItem.IsVisible IS NULL OR ContentItem.IsVisible = 1)

