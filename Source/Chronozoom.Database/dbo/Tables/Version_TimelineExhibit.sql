CREATE TABLE [dbo].[Version_TimelineExhibit] (
    [TimelineExhibitID]         UNIQUEIDENTIFIER NOT NULL,
    [TimelineID]                UNIQUEIDENTIFIER NOT NULL,
    [ExhibitID]                 UNIQUEIDENTIFIER NOT NULL,
    [CreatedOn]                 SMALLDATETIME    NULL,
    [CreatedBy]                 UNIQUEIDENTIFIER NULL,
    [ModifiedOn]                SMALLDATETIME    NULL,
    [ModifiedBy]                UNIQUEIDENTIFIER NULL,
    [IsDeleted]                 BIT              NULL,
    [CurrVersion]               INT              NULL,
    [Version_TimelineExhibitID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Version_TimelineExhibitID] ASC)
);

