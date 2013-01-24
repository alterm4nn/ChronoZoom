

CREATE VIEW [dbo].[Auth_ExhibitContentItemInfoView]
AS 
SELECT DISTINCT ContentItem.ID,
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
		ContentItem.UniqueID,
		ExhibitContentItem.[Order],
		CASE 
		WHEN (SELECT COUNT(*)  FROM ExhibitReference as Reference 
		WHERE (Reference.ExhibitID = ExhibitID)) > 0 THEN 1
		ELSE 0  
		END HasBibliography,
		ContentItem.CurrVersion
FROM ContentItem as ContentItem 
INNER JOIN MediaType as MediaType ON MediaType.ID = ContentItem.MediaTypeID
INNER JOIN ExhibitContentItem as ExhibitContentItem ON ExhibitContentItem.ContentItemID = ContentItem.ID
INNER JOIN Exhibit as Exhibit ON Exhibit.ID = ExhibitContentItem.ExhibitID
INNER JOIN TimelineExhibit as TimelineExhibit ON TimelineExhibit.ExhibitID = Exhibit.ID
INNER JOIN Timeline as Timeline on Timeline.ID = TimelineExhibit.TimelineID
INNER JOIN Regime as Regime ON Regime.ID = ContentItem.RegimeID
INNER JOIN Threshold as Threshold ON Threshold.ID = ContentItem.ThresholdID
INNER JOIN TimeUnit as TimeUnit ON TimeUnit.ID = ContentItem.TimeUnitID
WHERE (Timeline.IsDeleted IS NULL OR Timeline.IsDeleted = 0)
AND (Timeline.IsVisible IS NULL OR Timeline.IsVisible = 1)
AND (TimelineExhibit.IsDeleted IS NULL OR TimelineExhibit.IsDeleted = 0)
AND (Exhibit.IsDeleted IS NULL OR Exhibit.IsDeleted = 0)
AND (Exhibit.IsVisible IS NULL OR Exhibit.IsVisible = 1)
AND (ExhibitContentItem.IsDeleted IS NULL OR ExhibitContentItem.IsDeleted = 0)
AND (ContentItem.IsDeleted IS NULL OR ContentItem.IsDeleted = 0)
AND (ContentItem.IsVisible IS NULL OR ContentItem.IsVisible = 1)
AND (MediaType.IsDeleted IS NULL OR MediaType.IsDeleted = 0)
AND (Regime.IsDeleted IS NULL OR Regime.IsDeleted = 0)
AND (Threshold.IsDeleted IS NULL OR Threshold.IsDeleted = 0)
AND (TimeUnit.IsDeleted IS NULL OR TimeUnit.IsDeleted = 0)



