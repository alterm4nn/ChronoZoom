


CREATE VIEW [dbo].[TimelineInfoView]
AS 
SELECT TOP 100 PERCENT Timeline.ID as TimelineID,
		Timeline.Title as Title,
		Threshold.Threshold as Threshold,
		Regime.Regime as Regime,
		FromTimeUnit.TimeUnit as FromTimeUnit,
		TimeLine.FromContentDate,
		TimeLine.FromContentYear as FromContentYear,
		ToTimeUnit.TimeUnit as ToTimeUnit,
		TimeLine.ToContentDate,
		Timeline.ToContentYear as ToContentYear,
		Timeline.UniqueID as TimelineUniqueID,
		Timeline.Sequence as TimelineSequence,
		Timeline.Height as Height,
		Timeline.ParentTimelineID as ParentTimelineID,
		(SELECT TOP 1 1 FROM Timeline as subLine WHERE subLine.ParentTimeLineID = Timeline.id) as HasChildren,
		Timeline.CurrVersion,
		CASE 
			WHEN (Timeline.IsDeleted = 1) OR
				(Timeline.IsVisible = 0) OR
				(Regime.IsDeleted = 1) OR
				(Threshold.IsDeleted = 1) OR
				(FromTimeUnit.IsDeleted = 1) OR
				(ToTimeUnit.IsDeleted = 1) THEN 0
		ELSE 1 END AS [IncludeInVersion]
FROM Version_Timeline as Timeline
INNER JOIN Version_Regime as Regime ON Regime.ID = Timeline.RegimeID
			AND	Regime.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Regime 
											WHERE Version_Regime.CurrVersion <= Timeline.CurrVersion
											AND Version_Regime.ID = Timeline.RegimeID)
INNER JOIN Version_Threshold as Threshold ON Threshold.ID = Timeline.ThresholdID
			AND	Threshold.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Threshold 
											WHERE Version_Threshold.CurrVersion <= Timeline.CurrVersion
											AND Version_Threshold.ID = Timeline.ThresholdID)
INNER JOIN Version_TimeUnit as FromTimeUnit ON FromTimeUnit.ID = Timeline.FromTimeUnit
			AND	FromTimeUnit.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TimeUnit 
											WHERE Version_TimeUnit.CurrVersion <= Timeline.CurrVersion
											AND Version_TimeUnit.ID = Timeline.FromTimeUnit)
INNER JOIN Version_TimeUnit as ToTimeUnit ON ToTimeUnit.ID = Timeline.ToTimeUnit
			AND	ToTimeUnit.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TimeUnit 
											WHERE Version_TimeUnit.CurrVersion <= Timeline.CurrVersion
											AND Version_TimeUnit.ID = Timeline.ToTimeUnit)
ORDER BY Title



