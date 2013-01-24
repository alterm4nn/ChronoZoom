
CREATE PROCEDURE [dbo].[GenerateTourBookmarkViewVersion]
@VersionNumber int
AS

INSERT INTO dbo.Staging_TourBookmarkView
SELECT *
FROM (
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
			(Version_Bookmark.IsVisible = 0) OR
				(Version_TourBookmark.IsDeleted = 1) THEN 0
		ELSE 1 END AS [IncludeInVersion],
		NEWID() as NEW_ID,
		Version_TourBookmark.IsVisible
FROM Version_Bookmark
INNER JOIN Version_TourBookmark ON Version_TourBookmark.BookmarkID = Version_Bookmark.ID
			AND	Version_TourBookmark.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TourBookmark 
											WHERE Version_TourBookmark.CurrVersion <= @VersionNumber
											AND Version_TourBookmark.BookmarkID = Version_Bookmark.ID)
WHERE Version_Bookmark.CurrVersion = (	SELECT MAX(CurrVersion) 
								FROM Version_Bookmark as CurrView
								WHERE CurrView.CurrVersion <= @VersionNumber
								AND CurrView.ID = Version_Bookmark.ID)
) as tab
WHERE [IncludeInVersion] = 1

