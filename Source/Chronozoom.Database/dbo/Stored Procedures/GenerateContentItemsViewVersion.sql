


CREATE PROCEDURE [dbo].[GenerateContentItemsViewVersion]
@VersionNumber int
AS

INSERT INTO dbo.Staging_ContentItemView
SELECT *
FROM (
SELECT *,
	CASE 
		WHEN (Version_ContentItem.IsDeleted = 1) OR 
			(Version_ContentItem.IsVisible = 0) THEN 0
		ELSE 1 END AS [IncludeInVersion],
	NEWID() as NEW_ID
FROM Version_ContentItem
WHERE Version_ContentItem.CurrVersion = (	SELECT MAX(CurrVersion) 
								FROM Version_ContentItem as CurrView
								WHERE CurrView.CurrVersion <= @VersionNumber
								AND CurrView.ID = Version_ContentItem.ID)
) as tab
WHERE [IncludeInVersion] = 1



