




CREATE PROCEDURE [dbo].[GenerateExhibitContentItemInfoVersion]
@VersionNumber int
AS 

INSERT INTO dbo.Staging_ExhibitContentItemInfo
SELECT *
FROM (
SELECT DISTINCT ContentItem.ID,
		ExhibitContentItem.ExhibitID as ExhibitID,
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
		1 HasBibliography,
		ContentItem.CurrVersion,
		CASE 
			WHEN 
				( SELECT	CASE 
								WHEN	(MIN(CAST(COALESCE(Timeline.IsDeleted, 0) as int)) = 0) AND
										(MAX(CAST(COALESCE(Timeline.IsVisible, 1) as int)) = 1) AND
										(MIN(CAST(COALESCE(TimelineExhibit.IsDeleted, 0) as int)) = 0) AND
										(MIN(CAST(COALESCE(Exhibit.IsDeleted, 0) as int)) = 0) AND
										(MAX(CAST(COALESCE(Exhibit.IsVisible, 1) as int)) = 1) THEN 1
								ELSE 0 END 
					FROM  Version_TimelineExhibit as TimelineExhibit
					INNER JOIN Version_Exhibit as Exhibit ON Exhibit.ID = ExhibitContentItem.ExhibitID
							AND	Exhibit.CurrVersion = (	SELECT MAX(CurrVersion) 
													FROM Version_Exhibit 
													WHERE Version_Exhibit.CurrVersion <= @VersionNumber
													AND Version_Exhibit.ID = ExhibitContentItem.ExhibitID)
					INNER JOIN Version_Timeline as Timeline on Timeline.ID = TimelineExhibit.TimelineID
							AND	Timeline.CurrVersion = (	SELECT MAX(CurrVersion) 
													FROM Version_Timeline 
													WHERE Version_Timeline.CurrVersion <= @VersionNumber
													AND Version_Timeline.ID = TimelineExhibit.TimelineID)
					WHERE TimelineExhibit.ExhibitID = ExhibitContentItem.ExhibitID
					AND	TimelineExhibit.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TimelineExhibit 
											WHERE Version_TimelineExhibit.CurrVersion <= @VersionNumber
											AND Version_TimelineExhibit.ExhibitID = TimelineExhibit.ExhibitID
											AND Version_TimelineExhibit.TimelineID = TimelineExhibit.TimelineID)) = 0 OR
				(ExhibitContentItem.IsDeleted = 1) OR
				(ContentItem.IsDeleted = 1) OR
				(ContentItem.IsVisible = 0) OR
				(MediaType.IsDeleted = 1) OR
				(Regime.IsDeleted = 1) OR
				(Threshold.IsDeleted = 1) OR
				(TimeUnit.IsDeleted = 1) THEN 0
			ELSE 1 END AS [IncludeInVersion],
			NEWID() as NEW_ID
FROM Version_ExhibitContentItem as ExhibitContentItem  
INNER JOIN Version_ContentItem as ContentItem ON ContentItem.ID = ExhibitContentItem.ContentItemID
			AND	ContentItem.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_ContentItem 
											WHERE 
											Version_ContentItem.CurrVersion <= @VersionNumber
											AND 
											Version_ContentItem.ID = ExhibitContentItem.ContentItemID)
INNER JOIN Version_MediaType as MediaType ON MediaType.ID = ContentItem.MediaTypeID
			AND	MediaType.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM MediaType 
											WHERE MediaType.CurrVersion <= @VersionNumber
											AND MediaType.ID = ContentItem.MediaTypeID)
INNER JOIN Version_Regime as Regime ON Regime.ID = ContentItem.RegimeID
			AND	Regime.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Regime 
											WHERE Version_Regime.CurrVersion <= @VersionNumber
											AND Version_Regime.ID = ContentItem.RegimeID)
INNER JOIN Version_Threshold as Threshold ON Threshold.ID = ContentItem.ThresholdID
			AND	Threshold.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Threshold 
											WHERE Version_Threshold.CurrVersion <= @VersionNumber
											AND Version_Threshold.ID = ContentItem.ThresholdID)
INNER JOIN Version_TimeUnit as TimeUnit ON TimeUnit.ID = ContentItem.TimeUnitID
			AND	TimeUnit.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TimeUnit 
											WHERE Version_TimeUnit.CurrVersion <= @VersionNumber
											AND Version_TimeUnit.ID = ContentItem.TimeUnitID)
WHERE ExhibitContentItem.CurrVersion =  (	SELECT MAX(CurrVersion) 
										FROM Version_ExhibitContentItem as CurrView
										WHERE CurrView.CurrVersion <= @VersionNumber
										AND CurrView.ExhibitContentItemID = ExhibitContentItem.ExhibitContentItemID)
) as tab
WHERE [IncludeInVersion] = 1



GO


