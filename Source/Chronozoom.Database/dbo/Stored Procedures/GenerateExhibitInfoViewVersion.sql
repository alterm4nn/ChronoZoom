CREATE PROCEDURE [dbo].[GenerateExhibitInfoViewVersion]
@VersionNumber int
AS 

INSERT INTO dbo.Staging_ExhibitInfo
SELECT *
FROM (
SELECT Exhibit.ID,
		Timeline.ID as TimelineID,
		Exhibit.Title,
		ExhibitThreshold.Threshold,
		ExhibitRegime.Regime,
		ExhibitTimeUnit.TimeUnit,
		Exhibit.ContentDate,
		Exhibit.ContentYear,
		Exhibit.UniqueID,
		Exhibit.Sequence,
		Exhibit.CurrVersion,
		CASE 
			WHEN (Timeline.IsDeleted = 1) OR
					(Timeline.IsVisible = 0) OR
					(TimelineExhibit.IsDeleted = 1) OR
					(Exhibit.IsDeleted = 1) OR
					(Exhibit.IsVisible = 0) OR
					(ExhibitRegime.IsDeleted = 1) OR
					(ExhibitThreshold.IsDeleted = 1) OR
					(ExhibitTimeUnit.IsDeleted = 1) THEN 0
			ELSE 1 END AS [IncludeInVersion],
			NEWID() as NEW_ID
FROM 
Version_TimelineExhibit as TimelineExhibit
INNER JOIN 
Version_Exhibit as Exhibit 
ON Exhibit.ID = TimelineExhibit.ExhibitID
			AND Exhibit.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Exhibit 
											WHERE Version_Exhibit.CurrVersion <= @VersionNumber
											AND Version_Exhibit.ID = TimelineExhibit.ExhibitID)
--INNER JOIN Version_TimelineExhibit as TimelineExhibit ON TimelineExhibit.ExhibitID = Exhibit.ID
--			AND	TimelineExhibit.CurrVersion = (	SELECT MAX(CurrVersion) 
--											FROM Version_TimelineExhibit 
--											WHERE Version_TimelineExhibit.CurrVersion <= @VersionNumber
--											AND Version_TimelineExhibit.ExhibitID = Exhibit.ID)
INNER JOIN Version_TimeLine as Timeline on Timeline.ID = TimelineExhibit.TimelineID
			AND	Timeline.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TimeLine 
											WHERE Version_TimeLine.CurrVersion <= @VersionNumber
											AND Version_TimeLine.ID = TimelineExhibit.TimelineID)
INNER JOIN Version_Regime as ExhibitRegime ON ExhibitRegime.ID = Exhibit.RegimeID
			AND	ExhibitRegime.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Regime 
											WHERE Version_Regime.CurrVersion <= @VersionNumber
											AND Version_Regime.ID = Exhibit.RegimeID)
INNER JOIN Version_Threshold as ExhibitThreshold ON ExhibitThreshold.ID = Exhibit.ThresholdID
			AND	ExhibitThreshold.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Threshold 
											WHERE Version_Threshold.CurrVersion <= @VersionNumber
											AND Version_Threshold.ID = Exhibit.ThresholdID)
INNER JOIN Version_TimeUnit as ExhibitTimeUnit ON ExhibitTimeUnit.ID = Exhibit.TimeUnitID
			AND	ExhibitTimeUnit.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TimeUnit 
											WHERE Version_TimeUnit.CurrVersion <= @VersionNumber
											AND Version_TimeUnit.ID = Exhibit.TimeUnitID)
WHERE TimelineExhibit.CurrVersion = (	SELECT MAX(CurrVersion) 
								FROM Version_TimelineExhibit as CurrView 
								WHERE CurrView.CurrVersion <= @VersionNumber
								AND CurrView.TimelineExhibitID = TimelineExhibit.TimelineExhibitID)
) as tab
WHERE [IncludeInVersion] = 1



GO


