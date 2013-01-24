
CREATE VIEW [dbo].[Auth_ExhibitView]
AS

SELECT *
FROM Exhibit
WHERE (Exhibit.IsDeleted IS NULL OR Exhibit.IsDeleted = 0)
AND (Exhibit.IsVisible IS NULL OR Exhibit.IsVisible = 1)

