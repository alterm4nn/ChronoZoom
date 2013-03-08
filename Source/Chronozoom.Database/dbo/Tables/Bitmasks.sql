CREATE TABLE [dbo].[Bitmasks]
    [b1]           INT NOT NULL,
    [b2]           INT NOT NULL,
    [b3]           AS b2 * 2 PERSISTED NOT NULL
);

