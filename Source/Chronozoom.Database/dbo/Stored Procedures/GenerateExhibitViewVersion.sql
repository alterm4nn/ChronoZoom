



CREATE PROCEDURE [dbo].[GenerateExhibitViewVersion]
@VersionNumber int
AS

INSERT INTO dbo.Staging_ExhibitView
SELECT *
FROM (
SELECT *,
	CASE 
		WHEN (Version_Exhibit.IsDeleted = 1) OR 
			(Version_Exhibit.IsVisible = 0) THEN 0
		ELSE 1 END AS [IncludeInVersion],
	NEWID() as NEW_ID
FROM Version_Exhibit
WHERE Version_Exhibit.CurrVersion = (	SELECT MAX(CurrVersion) 
								FROM Version_Exhibit  as CurrView
								WHERE CurrView.CurrVersion <= @VersionNumber
								AND CurrView.ID = Version_Exhibit.ID)
) as tab
WHERE [IncludeInVersion] = 1

