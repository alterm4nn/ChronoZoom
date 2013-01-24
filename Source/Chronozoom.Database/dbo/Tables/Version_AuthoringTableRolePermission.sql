CREATE TABLE [dbo].[Version_AuthoringTableRolePermission] (
    [AuthoringTableRolePermissionID]         UNIQUEIDENTIFIER NOT NULL,
    [AuthoringTableID]                       UNIQUEIDENTIFIER NOT NULL,
    [RoleID]                                 UNIQUEIDENTIFIER NOT NULL,
    [Permission]                             TINYINT          NOT NULL,
    [CreatedOn]                              SMALLDATETIME    NULL,
    [CreatedBy]                              UNIQUEIDENTIFIER NULL,
    [ModifiedOn]                             SMALLDATETIME    NULL,
    [ModifiedBy]                             UNIQUEIDENTIFIER NULL,
    [IsDeleted]                              BIT              NULL,
    [CurrVersion]                            INT              NULL,
    [Version_AuthoringTableRolePermissionID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_AuthoringTableRolePermissionID] ASC)
);

