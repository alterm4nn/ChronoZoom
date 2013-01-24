

CREATE VIEW [dbo].[ContentItemsView]
AS
SELECT *,
	CASE 
		WHEN (Version_ContentItem.IsDeleted = 1) OR 
			(Version_ContentItem.IsVisible = 0) THEN 0
		ELSE 1 END AS [IncludeInVersion]
FROM Version_ContentItem


