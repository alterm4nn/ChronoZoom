CREATE VIEW [dbo].[ExhibitContentItemInfoView]
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
		Exhibit.UniqueID,
		ExhibitContentItem.[Order],
		1 HasBibliography,
		ContentItem.CurrVersion,
		CASE 
			WHEN (Timeline.IsDeleted = 1) OR
				(Timeline.IsVisible = 0) OR
				(TimelineExhibit.IsDeleted = 1) OR
				(Exhibit.IsDeleted = 1) OR
				(Exhibit.IsVisible = 0) OR
				(ExhibitContentItem.IsDeleted = 1) OR
				(ContentItem.IsDeleted = 1) OR
				(ContentItem.IsVisible = 0) OR
				(MediaType.IsDeleted = 1) OR
				(Regime.IsDeleted = 1) OR
				(Threshold.IsDeleted = 1) OR
				(TimeUnit.IsDeleted = 1) THEN 0
			ELSE 1 END AS [IncludeInVersion]
FROM Version_ContentItem as ContentItem 
INNER JOIN Version_MediaType as MediaType ON MediaType.ID = ContentItem.MediaTypeID
			AND	MediaType.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM MediaType 
											WHERE MediaType.CurrVersion <= ContentItem.CurrVersion
											AND MediaType.ID = ContentItem.MediaTypeID)
INNER JOIN Version_ExhibitContentItem as ExhibitContentItem ON ExhibitContentItem.ContentItemID = ContentItem.ID
			AND	ExhibitContentItem.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_ExhibitContentItem 
											WHERE 
											--Version_ExhibitContentItem.CurrVersion <= ContentItem.CurrVersion
											--AND 
											Version_ExhibitContentItem.ContentItemID = ContentItem.ID)
INNER JOIN Version_Exhibit as Exhibit ON Exhibit.ID = ExhibitContentItem.ExhibitID
			AND	Exhibit.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Exhibit 
											WHERE Version_Exhibit.CurrVersion <= ExhibitContentItem.CurrVersion
											AND Version_Exhibit.ID = ExhibitContentItem.ExhibitID)
INNER JOIN Version_TimelineExhibit as TimelineExhibit ON TimelineExhibit.ExhibitID = Exhibit.ID
			AND	TimelineExhibit.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TimelineExhibit 
											WHERE Version_TimelineExhibit.CurrVersion <= Exhibit.CurrVersion
											AND Version_TimelineExhibit.ExhibitID = Exhibit.ID)
INNER JOIN Version_Timeline as Timeline on Timeline.ID = TimelineExhibit.TimelineID
			AND	Timeline.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Timeline 
											WHERE Version_Timeline.CurrVersion <= TimelineExhibit.CurrVersion
											AND Version_Timeline.ID = TimelineExhibit.TimelineID)
INNER JOIN Version_Regime as Regime ON Regime.ID = ContentItem.RegimeID
			AND	Regime.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Regime 
											WHERE Version_Regime.CurrVersion <= ContentItem.CurrVersion
											AND Version_Regime.ID = ContentItem.RegimeID)
INNER JOIN Version_Threshold as Threshold ON Threshold.ID = ContentItem.ThresholdID
			AND	Threshold.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Threshold 
											WHERE Version_Threshold.CurrVersion <= ContentItem.CurrVersion
											AND Version_Threshold.ID = ContentItem.ThresholdID)
INNER JOIN Version_TimeUnit as TimeUnit ON TimeUnit.ID = ContentItem.TimeUnitID
			AND	TimeUnit.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TimeUnit 
											WHERE Version_TimeUnit.CurrVersion <= ContentItem.CurrVersion
											AND Version_TimeUnit.ID = ContentItem.TimeUnitID)