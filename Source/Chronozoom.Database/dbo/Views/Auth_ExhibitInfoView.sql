
CREATE VIEW [dbo].[Auth_ExhibitInfoView]
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
		Exhibit.CurrVersion
FROM Exhibit as Exhibit
INNER JOIN TimelineExhibit as TimelineExhibit ON TimelineExhibit.ExhibitID = Exhibit.ID
INNER JOIN TimeLine as Timeline on Timeline.ID = TimelineExhibit.TimelineID
INNER JOIN Regime as ExhibitRegime ON ExhibitRegime.ID = Exhibit.RegimeID
INNER JOIN Threshold as ExhibitThreshold ON ExhibitThreshold.ID = Exhibit.ThresholdID
INNER JOIN TimeUnit as ExhibitTimeUnit ON ExhibitTimeUnit.ID = Exhibit.TimeUnitID
WHERE (Timeline.IsDeleted IS NULL OR Timeline.IsDeleted = 0)
AND (Timeline.IsVisible IS NULL OR Timeline.IsVisible = 1)
AND (TimelineExhibit.IsDeleted IS NULL OR TimelineExhibit.IsDeleted = 0)
AND (Exhibit.IsDeleted IS NULL OR Exhibit.IsDeleted = 0)
AND (Exhibit.IsVisible IS NULL OR Exhibit.IsVisible = 1)
AND (ExhibitRegime.IsDeleted IS NULL OR ExhibitRegime.IsDeleted = 0)
AND (ExhibitThreshold.IsDeleted IS NULL OR ExhibitThreshold.IsDeleted = 0)
AND (ExhibitTimeUnit.IsDeleted IS NULL OR ExhibitTimeUnit.IsDeleted = 0)

