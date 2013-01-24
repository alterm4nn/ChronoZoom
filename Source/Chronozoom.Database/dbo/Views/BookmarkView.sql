

CREATE VIEW [dbo].[BookmarkView]
AS
SELECT Bookmark.Name,
		Bookmark.LapseTime,
		Bookmark.Description,
		Bookmark.URL,
		Bookmark.ID,
		Bookmark.IsDeleted Bookmark_IsDeleted,
		TourBookmark.IsDeleted TourBookmark_IsDeleted,
		TourBookmark.TourID,
		Bookmark.CurrVersion,
		CASE 
			WHEN (Bookmark.IsDeleted = 1) OR (TourBookmark.IsDeleted = 1) THEN 0 
			ELSE 1 END AS [IncludeInVersion]
FROM Version_Bookmark as Bookmark
INNER JOIN Version_TourBookmark as TourBookmark ON TourBookmark.BookmarkID = Bookmark.ID
			AND	TourBookmark.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM TourBookmark 
											WHERE TourBookmark.CurrVersion <= Bookmark.CurrVersion
											AND TourBookmark.BookmarkID = Bookmark.ID)



