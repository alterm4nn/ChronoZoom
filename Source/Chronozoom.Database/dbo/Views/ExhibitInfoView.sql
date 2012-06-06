


CREATE VIEW [dbo].[ExhibitInfoView]
AS 
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
			ELSE 1 END AS [IncludeInVersion]
FROM Version_Exhibit as Exhibit
INNER JOIN Version_TimelineExhibit as TimelineExhibit ON TimelineExhibit.ExhibitID = Exhibit.ID
			AND	TimelineExhibit.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TimelineExhibit 
											WHERE Version_TimelineExhibit.CurrVersion <= Exhibit.CurrVersion
											AND Version_TimelineExhibit.ExhibitID = Exhibit.ID)
INNER JOIN Version_TimeLine as Timeline on Timeline.ID = TimelineExhibit.TimelineID
			AND	Timeline.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TimeLine 
											WHERE Version_TimeLine.CurrVersion <= TimelineExhibit.CurrVersion
											AND Version_TimeLine.ID = TimelineExhibit.TimelineID)
INNER JOIN Version_Regime as ExhibitRegime ON ExhibitRegime.ID = Exhibit.RegimeID
			AND	ExhibitRegime.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Regime 
											WHERE Version_Regime.CurrVersion <= Exhibit.CurrVersion
											AND Version_Regime.ID = Exhibit.RegimeID)
INNER JOIN Version_Threshold as ExhibitThreshold ON ExhibitThreshold.ID = Exhibit.ThresholdID
			AND	ExhibitThreshold.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Threshold 
											WHERE Version_Threshold.CurrVersion <= Exhibit.CurrVersion
											AND Version_Threshold.ID = Exhibit.ThresholdID)
INNER JOIN Version_TimeUnit as ExhibitTimeUnit ON ExhibitTimeUnit.ID = Exhibit.TimeUnitID
			AND	ExhibitTimeUnit.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TimeUnit 
											WHERE Version_TimeUnit.CurrVersion <= Exhibit.CurrVersion
											AND Version_TimeUnit.ID = Exhibit.TimeUnitID)

