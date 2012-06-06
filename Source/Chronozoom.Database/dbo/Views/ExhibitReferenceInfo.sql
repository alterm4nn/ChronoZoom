
CREATE VIEW [dbo].[ExhibitReferenceInfo]
AS
SELECT Reference.ID,
		Exhibit.ID as ExhibitID,
		Reference.Title,
		Reference.Authors,
		Reference.BookChapters,
		CitationType.CitationType,
		Reference.PageNumbers,
		Reference.Publication,
		Reference.PublicationDates,
		Reference.Source
FROM Reference
INNER JOIN CitationType ON CitationType.ID = Reference.CitationTypeID
INNER JOIN ExhibitReference ON ExhibitReference.ReferenceID = Reference.ID
INNER JOIN Exhibit as Exhibit ON Exhibit.ID = ExhibitReference.ExhibitID
INNER JOIN TimelineExhibit ON TimelineExhibit.ExhibitID = Exhibit.ID
INNER JOIN TimeLine on Timeline.ID = TimelineExhibit.TimelineID
WHERE (Timeline.IsDeleted IS NULL OR Timeline.IsDeleted = 0)
AND (Timeline.IsVisible IS NULL OR Timeline.IsVisible = 1)
AND (TimelineExhibit.IsDeleted IS NULL OR TimelineExhibit.IsDeleted = 0)
AND (Exhibit.IsDeleted IS NULL OR Exhibit.IsDeleted = 0)
AND (Exhibit.IsVisible IS NULL OR Exhibit.IsVisible = 1)
AND (ExhibitReference.IsDeleted IS NULL OR ExhibitReference.IsDeleted = 0)
AND (Reference.IsDeleted IS NULL OR Reference.IsDeleted = 0)
AND (Reference.IsVisible IS NULL OR Reference.IsVisible = 1)
