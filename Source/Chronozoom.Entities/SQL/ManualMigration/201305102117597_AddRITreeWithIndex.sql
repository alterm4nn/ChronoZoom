CREATE TABLE [dbo].[Bitmasks]
(
	[Id]                [int] IDENTITY(1,1)     NOT NULL,
	[B1]                [bigint]                NOT NULL,
	[B2]                [bigint]                NOT NULL,
	[B3]                [bigint]                NOT NULL,
    CONSTRAINT [PK_dbo.Bitmasks] PRIMARY KEY CLUSTERED 
    (
	    [Id] ASC
    )
    ON [PRIMARY]
)
ON [PRIMARY];

INSERT INTO [__MigrationHistory] (MigrationId, Model, ProductVersion)
VALUES
    ('201305102117597_AddRITreeWithIndex', CONVERT(VARBINARY(MAX), ''), 'Manual Migration');
GO