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
)
GO

INSERT INTO [MigrationHistory] (MigrationId, ProductVersion)
VALUES
    ('201305102117597_AddRITreeWithIndex', 'Manual Migration');
GO