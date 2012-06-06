



CREATE VIEW [dbo].[TourBookmarkView]
AS
SELECT Version_Bookmark.Name,
		Version_Bookmark.LapseTime,
		Version_Bookmark.Description,
		Version_Bookmark.URL,
		Version_Bookmark.ID,
		Version_Bookmark.IsDeleted Bookmark_IsDeleted,
		Version_TourBookmark.IsDeleted TourBookmark_IsDeleted,
		Version_TourBookmark.TourID,
		Version_Bookmark.CurrVersion,
		CASE
			WHEN (Version_Bookmark.IsDeleted = 1) OR
				(Version_TourBookmark.IsDeleted = 1) THEN 0
		ELSE 1 END AS [IncludeInVersion]
FROM Version_Bookmark
INNER JOIN Version_TourBookmark ON Version_TourBookmark.BookmarkID = Version_Bookmark.ID
			AND	Version_TourBookmark.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TourBookmark 
											WHERE Version_TourBookmark.CurrVersion <= Version_Bookmark.CurrVersion
											AND Version_TourBookmark.BookmarkID = Version_Bookmark.ID)



