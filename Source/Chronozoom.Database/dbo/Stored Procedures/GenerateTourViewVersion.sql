CREATE PROCEDURE [dbo].[GenerateTourViewVersion]
@VersionNumber int
AS

INSERT INTO dbo.Staging_TourView
SELECT *
FROM (
SELECT ID, Name, CreatedBy, ModifiedBy, CreatedOn, ModifiedOn, IsDeleted, UniqueID, AudioBlobUrl, Category, Sequence, CurrVersion, Version_TourID,
		CASE
			WHEN (Version_Tour.IsDeleted = 1)OR 
			(Version_Tour.IsVisible = 0)  THEN 0
		ELSE 1 END AS [IncludeInVersion],
		NEWID() as NEW_ID, IsVisible
FROM Version_Tour
WHERE Version_Tour.CurrVersion = (	SELECT MAX(CurrVersion) 
								FROM Version_Tour as CurrView
								WHERE CurrView.CurrVersion <= @VersionNumber
								AND CurrView.ID = Version_Tour.ID)
) as tab
WHERE [IncludeInVersion] = 1



