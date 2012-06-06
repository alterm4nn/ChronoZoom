CREATE TABLE [dbo].[Version_User] (
    [ID]             UNIQUEIDENTIFIER NOT NULL,
    [UserName]       NVARCHAR (50)    NOT NULL,
    [Password]       NVARCHAR (200)   NOT NULL,
    [FirstName]      NVARCHAR (200)   NOT NULL,
    [LastName]       NVARCHAR (200)   NOT NULL,
    [EmailAddress]   NVARCHAR (500)   NOT NULL,
    [RoleID]         UNIQUEIDENTIFIER NOT NULL,
    [CreatedBy]      UNIQUEIDENTIFIER NULL,
    [ModifiedBy]     UNIQUEIDENTIFIER NULL,
    [CreatedOn]      SMALLDATETIME    NULL,
    [ModifiedOn]     SMALLDATETIME    NULL,
    [IsDeleted]      BIT              NULL,
    [CurrVersion]    INT              NULL,
    [Version_UserID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_UserID] ASC)
);

