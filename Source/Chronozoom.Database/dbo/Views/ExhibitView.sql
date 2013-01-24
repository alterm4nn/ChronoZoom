


CREATE VIEW [dbo].[ExhibitView]
AS

SELECT *,
	CASE 
		WHEN (Version_Exhibit.IsDeleted = 1) OR 
			(Version_Exhibit.IsVisible = 0) THEN 0
		ELSE 1 END AS [IncludeInVersion]
FROM Version_Exhibit



