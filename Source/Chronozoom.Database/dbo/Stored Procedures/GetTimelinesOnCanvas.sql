CREATE PROCEDURE [dbo].[GetTimelinesOnCanvas]
@canvas_start_time int, @canvas_end_time int, @min_timespan int   --assuming arguments are specified with year as the time unit 
--min_timespan: minmum timespan (in year) of any timeline that should be visible on current canvas 
AS
BEGIN
	SELECT DISTINCT * FROM Timeline JOIN (SELECT (b1 & @canvas_start_time) AS Node FROM Bitmasks WHERE (@canvas_start_time & b2) <> 0) AS LeftNodes ON Timeline.ForkNode = LeftNodes.Node AND Timeline.ToContentYear >= @canvas_start_time AND Timeline.ToContentYear - Timeline.FromContentYear >= min_timespan UNION ALL SELECT DISTINCT * FROM Timeline JOIN (SELECT ((b1 & @canvas_end_time) | b3) AS Node FROM Bitmasks WHERE (@canvas_end_time & b3) = 0) AS RightNodes ON Timeline.ForkNode = RightNodes.Node AND Timeline.FromContentYear <= @canvas_end_time AND Timeline.ToContentYear - Timeline.FromContentYear >= min_timespan UNITON ALL SELECT DISINCT * FROM Timeline WHERE Timeline.ForkNode BETWEEN @canvas_start_time AND @canvas_end_time AND Timeline.ToContentYear - Timeline.FromContentYear >= min_timespan;
	RETURN;
END
