
CREATE PROCEDURE [dbo].[Publish](
@StagingVersion int,
@IsStaging int
)
AS

IF (SELECT COUNT(*) FROM CZVersion) > 0
BEGIN
	IF @IsStaging > 0
	BEGIN
		
		DECLARE @MaxStagingVersion int
		SELECT @MaxStagingVersion = MAX(VersionNumber)
		FROM CZVersion

		
		IF @StagingVersion <= 0 OR
			@StagingVersion > @MaxStagingVersion OR
			@MaxStagingVersion IS NULL
		BEGIN
			SET @StagingVersion = @MaxStagingVersion
		END
		
		PRINT CAST(@StagingVersion as nvarchar(32))
		
		IF((SELECT COUNT(*) FROM CZSystemVersion) = 1 )
		BEGIN
			UPDATE CZSystemVersion 
			SET StagingVersion = NULL
		END
		ELSE
		BEGIN
			INSERT INTO CZSystemVersion(StagingVersion, CZSystemVersionID)
			VALUES(NULL, NEWID());
		END

		TRUNCATE TABLE dbo.Staging_ExhibitContentItemInfo
		TRUNCATE TABLE dbo.Staging_ExhibitInfo
		TRUNCATE TABLE dbo.Staging_ExhibitReferenceInfo
		TRUNCATE TABLE dbo.Staging_TimelineInfo
		
		TRUNCATE TABLE dbo.Staging_BibliographyView
		TRUNCATE TABLE dbo.Staging_ExhibitView
		TRUNCATE TABLE dbo.Staging_ThresholdView
		TRUNCATE TABLE dbo.Staging_TimelineView
		TRUNCATE TABLE dbo.Staging_TourBookmarkView
		TRUNCATE TABLE dbo.Staging_TourView
		TRUNCATE TABLE dbo.Staging_ContentItemView

		EXEC GenerateExhibitContentItemInfoVersion @StagingVersion

		EXEC GenerateExhibitInfoViewVersion @StagingVersion

		EXEC GenerateExhibitReferenceInfoViewVersion @StagingVersion

		EXEC GenerateTimelineInfoViewVersion @StagingVersion

		EXEC GenerateBibliographyViewVersion @StagingVersion
		
		EXEC GenerateExhibitViewVersion @StagingVersion
										
		EXEC GenerateThresholdViewVersion @StagingVersion

		EXEC GenerateTimelineViewVersion @StagingVersion
		
		EXEC [GenerateTourBookmarkViewVersion] @StagingVersion

		EXEC [GenerateTourViewVersion] @StagingVersion

		EXEC [GenerateContentItemsViewVersion] @StagingVersion 

		UPDATE CZSystemVersion 
		SET StagingVersion = @StagingVersion
	END
	ELSE
	BEGIN
		UPDATE CZSystemVersion 
		SET ProdVersion = NULL

		TRUNCATE TABLE dbo.Prod_ExhibitContentItemInfo
		TRUNCATE TABLE dbo.Prod_ExhibitInfo
		TRUNCATE TABLE dbo.Prod_ExhibitReferenceInfo
		TRUNCATE TABLE dbo.Prod_TimelineInfo

		TRUNCATE TABLE dbo.Prod_BibliographyView
		TRUNCATE TABLE dbo.Prod_ExhibitView
		TRUNCATE TABLE dbo.Prod_ThresholdView
		TRUNCATE TABLE dbo.Prod_TimelineView
		TRUNCATE TABLE dbo.Prod_TourBookmarkView
		TRUNCATE TABLE dbo.Prod_TourView
		TRUNCATE TABLE dbo.Prod_ContentItemView

		INSERT INTO dbo.Prod_ExhibitContentItemInfo
		SELECT * FROM dbo.Staging_ExhibitContentItemInfo
		
		INSERT INTO dbo.Prod_ExhibitInfo
		SELECT * FROM dbo.Staging_ExhibitInfo

		INSERT INTO dbo.Prod_ExhibitReferenceInfo
		SELECT * FROM dbo.Staging_ExhibitReferenceInfo

		INSERT INTO dbo.Prod_TimelineInfo
		SELECT * FROM dbo.Staging_TimelineInfo

		INSERT INTO dbo.Prod_BibliographyView
		SELECT * FROM dbo.Staging_BibliographyView

		INSERT INTO dbo.Prod_ExhibitView
		SELECT * FROM dbo.Staging_ExhibitView

		INSERT INTO dbo.Prod_ThresholdView
		SELECT * FROM dbo.Staging_ThresholdView

		INSERT INTO dbo.Prod_TimelineView
		SELECT * FROM dbo.Staging_TimelineView

		INSERT INTO dbo.Prod_TourBookmarkView
		SELECT * FROM dbo.Staging_TourBookmarkView
		
		INSERT INTO dbo.Prod_TourView
		SELECT * FROM dbo.Staging_TourView
		
		INSERT INTO dbo.Prod_ContentItemView
		SELECT * FROM dbo.Staging_ContentItemView

		UPDATE CZSystemVersion 
		SET ProdVersion = StagingVersion
	END
END







GO


