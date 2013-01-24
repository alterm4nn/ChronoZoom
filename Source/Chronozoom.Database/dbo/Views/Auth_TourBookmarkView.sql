
CREATE VIEW [dbo].[Auth_TourBookmarkView]
AS
SELECT Bookmark.Name,
		Bookmark.LapseTime,
		Bookmark.Description,
		Bookmark.URL,
		Bookmark.ID,
		Bookmark.IsDeleted Bookmark_IsDeleted,
		TourBookmark.IsDeleted TourBookmark_IsDeleted,
		TourBookmark.TourID,
		Bookmark.CurrVersion
FROM Bookmark
INNER JOIN TourBookmark ON TourBookmark.BookmarkID = Bookmark.ID
WHERE (Bookmark.IsDeleted IS NULL OR Bookmark.IsDeleted = 0)
AND (Bookmark.IsVisible IS NULL OR Bookmark.IsVisible = 1)
AND (TourBookmark.IsDeleted IS NULL OR TourBookmark.IsDeleted = 0)
AND (TourBookmark.IsVisible IS NULL OR TourBookmark.IsVisible = 1)


