CREATE VIEW [dbo].[Auth_TourView]
AS
SELECT *
FROM Tour
WHERE (Tour.IsDeleted IS NULL OR Tour.IsDeleted = 0)
AND (Tour.IsVisible IS NULL OR Tour.IsVisible = 1)
