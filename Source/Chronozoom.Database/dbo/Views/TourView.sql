


CREATE VIEW [dbo].[TourView]
AS
SELECT *,
		CASE
			WHEN (Version_Tour.IsDeleted = 1) THEN 0
		ELSE 1 END AS [IncludeInVersion]
FROM Version_Tour


