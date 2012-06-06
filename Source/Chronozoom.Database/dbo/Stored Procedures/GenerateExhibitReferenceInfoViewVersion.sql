
CREATE PROCEDURE [dbo].[GenerateExhibitReferenceInfoViewVersion]
@VersionNumber int
AS 

INSERT INTO dbo.Staging_ExhibitReferenceInfo
SELECT *
FROM (
SELECT Reference.ID,
		Exhibit.ID as ExhibitID,
		Reference.Title,
		Reference.Authors,
		Reference.BookChapters,
		CitationType.CitationType,
		Reference.PageNumbers,
		Reference.Publication,
		Reference.PublicationDates,
		Reference.Source,
		Reference.CurrVersion,
		CASE 
			WHEN (Timeline.IsDeleted = 1) OR
				(Timeline.IsVisible = 0) OR
				(TimelineExhibit.IsDeleted = 1) OR
				(Exhibit.IsDeleted = 1) OR
				(Exhibit.IsVisible = 0) OR
				(ExhibitReference.IsDeleted = 1) OR
				(Reference.IsDeleted = 1) OR
				(Reference.IsVisible = 0) THEN 0
			ELSE 1 END AS [IncludeInVersion],
			NEWID() as NEW_ID
FROM Version_Reference as Reference
INNER JOIN Version_CitationType as CitationType ON CitationType.ID = Reference.CitationTypeID
			AND	CitationType.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_CitationType 
											WHERE Version_CitationType.CurrVersion <= @VersionNumber
											AND Version_CitationType.ID = Reference.CitationTypeID)
INNER JOIN Version_ExhibitReference as ExhibitReference ON ExhibitReference.ReferenceID = Reference.ID
			AND	ExhibitReference.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_ExhibitReference 
											WHERE Version_ExhibitReference.CurrVersion <= @VersionNumber
											AND Version_ExhibitReference.ReferenceID = Reference.ID)
INNER JOIN Version_Exhibit as Exhibit ON Exhibit.ID = ExhibitReference.ExhibitID
			AND	Exhibit.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_Exhibit 
											WHERE Version_Exhibit.CurrVersion <= @VersionNumber
											AND Version_Exhibit.ID = ExhibitReference.ExhibitID)
INNER JOIN Version_TimelineExhibit as TimelineExhibit ON TimelineExhibit.ExhibitID = Exhibit.ID
			AND	TimelineExhibit.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TimelineExhibit 
											WHERE Version_TimelineExhibit.CurrVersion <= @VersionNumber
											AND Version_TimelineExhibit.ExhibitID = Exhibit.ID)
INNER JOIN Version_TimeLine as TimeLine on Timeline.ID = TimelineExhibit.TimelineID
			AND	TimeLine.CurrVersion = (	SELECT MAX(CurrVersion) 
											FROM Version_TimeLine 
											WHERE Version_TimeLine.CurrVersion <= @VersionNumber
											AND Version_TimeLine.ID = TimelineExhibit.TimelineID)
WHERE Reference.CurrVersion = (	SELECT MAX(CurrVersion) 
								FROM Version_Reference as CurrView
								WHERE CurrView.CurrVersion <= @VersionNumber
								AND CurrView.ID = Reference.ID)
) as tab
WHERE [IncludeInVersion] = 1

