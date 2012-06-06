CREATE TABLE [dbo].[Version_Role] (
    [ID]             UNIQUEIDENTIFIER NOT NULL,
    [Role]           NVARCHAR (50)    NOT NULL,
    [CreatedBy]      UNIQUEIDENTIFIER NULL,
    [ModifiedBy]     UNIQUEIDENTIFIER NULL,
    [CreatedOn]      SMALLDATETIME    NULL,
    [ModifiedOn]     SMALLDATETIME    NULL,
    [IsDeleted]      BIT              NULL,
    [CurrVersion]    INT              NULL,
    [Version_RoleID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_RoleID] ASC)
);

