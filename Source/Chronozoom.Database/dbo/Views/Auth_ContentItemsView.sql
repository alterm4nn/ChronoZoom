CREATE VIEW [dbo].[Auth_ContentItemsView]
AS
SELECT *
FROM ContentItem
WHERE (ContentItem.IsDeleted IS NULL OR ContentItem.IsDeleted = 0)
AND (ContentItem.IsVisible IS NULL OR ContentItem.IsVisible = 1)
