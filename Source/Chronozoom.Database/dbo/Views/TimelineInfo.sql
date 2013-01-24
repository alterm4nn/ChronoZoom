CREATE VIEW [dbo].[TimelineInfo]
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
  Timeline.Height,
  Timeline.ParentTimelineID as ParentTimelineID,
  (SELECT TOP 1 1 FROM Timeline as subLine WHERE subLine.ParentTimeLineID = Timeline.id) as HasChildren
FROM Timeline
INNER JOIN Regime ON Regime.ID = Timeline.RegimeID
INNER JOIN Threshold ON Threshold.ID = Timeline.ThresholdID
INNER JOIN TimeUnit as FromTimeUnit ON FromTimeUnit.ID = Timeline.FromTimeUnit
INNER JOIN TimeUnit as ToTimeUnit ON ToTimeUnit.ID = Timeline.ToTimeUnit
LEFT OUTER JOIN TimelineExhibit ON TimelineExhibit.TimelineID = Timeline.ID
WHERE (Timeline.IsDeleted IS NULL OR Timeline.IsDeleted = 0)
AND (Timeline.IsVisible IS NULL OR Timeline.IsVisible = 1)
