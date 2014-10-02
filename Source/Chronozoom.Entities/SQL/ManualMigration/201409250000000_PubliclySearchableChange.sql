-- Change all existing PubliclySearchable entries to false
-- then change Cosmos and AIDS Timeline to true, and also
-- change all collections with featured timelines to true.

UPDATE [Collections] SET PubliclySearchable = 0;

UPDATE [Collections] SET PubliclySearchable = 1 WHERE Id IN
(
    SELECT      c.Id
    FROM        Collections         AS c
    LEFT JOIN   SuperCollections    AS s ON s.Id = c.SuperCollection_Id
    WHERE
    (s.Title = 'chronozoom'     AND c.[Path] = 'cosmos')         OR
    (s.Title = 'chronozoom'     AND c.[Path] = 'aidstimeline')   OR
    -- following is only valid for www.chronozoom.com production --
    (s.Title = 'chile'          AND c.[Path] = 'chile')          OR
    (s.Title = 'cern'           AND c.[Path] = 'cern')           OR
    (s.Title = 'aviation'       AND c.[Path] = 'aviation')       OR
    (s.Title = 'vertebrates'    AND c.[Path] = 'vertibrates')    OR
    (s.Title = 'bighistorylabs' AND c.[Path] = 'bighistorylabs') OR
    (s.Title = 'mars'           AND c.[Path] = 'mars')           OR
    (s.Title = 'martialarts'    AND c.[Path] = 'martialarts')
);

-- note transformation completed --
INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201409250000000_PubliclySearchableChange', 'Manual Migration');
GO
