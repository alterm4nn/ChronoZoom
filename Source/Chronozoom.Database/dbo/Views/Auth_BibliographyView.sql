CREATE VIEW [dbo].[Auth_BibliographyView]
AS

SELECT 
	ExhibitReference.ExhibitID,
	ExhibitReference.IsDeleted,
	Reference.ID,
	Reference.Title,
    Reference.Authors,
    Reference.BookChapters,
    CitationType.CitationType,
    Reference.PageNumbers,
    Reference.Publication,
    Reference.PublicationDates,
    Reference.Source,
    ExhibitReference.CurrVersion
FROM ExhibitReference
INNER JOIN Reference ON Reference.ID = ExhibitReference.ReferenceID
INNER JOIN CitationType ON CitationType.ID = Reference.CitationTypeID
WHERE (ExhibitReference.IsDeleted IS NULL OR ExhibitReference.IsDeleted = 0)
AND (Reference.IsDeleted IS NULL OR Reference.IsDeleted = 0)
AND (Reference.IsVisible IS NULL OR Reference.IsVisible = 1)
AND (CitationType.IsDeleted IS NULL OR CitationType.IsDeleted = 0)
