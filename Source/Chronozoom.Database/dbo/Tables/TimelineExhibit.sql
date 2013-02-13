﻿CREATE TABLE [dbo].[TimelineExhibit] (
    [TimelineExhibitID] UNIQUEIDENTIFIER NOT NULL,
    [TimelineID]        UNIQUEIDENTIFIER NOT NULL,
    [ExhibitID]         UNIQUEIDENTIFIER NOT NULL,
    [CreatedOn]         SMALLDATETIME    CONSTRAINT [DF_TimelineExhibit_CreatedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [CreatedBy]         UNIQUEIDENTIFIER NULL,
    [ModifiedOn]        SMALLDATETIME    CONSTRAINT [DF_TimelineExhibit_ModifiedOn] DEFAULT (CONVERT([smalldatetime],getdate(),(0))) NULL,
    [ModifiedBy]        UNIQUEIDENTIFIER NULL,
    [IsDeleted]         BIT              NULL,
    [CurrVersion]       INT              NULL,
    CONSTRAINT [PK_TimelineExhibit] PRIMARY KEY CLUSTERED ([TimelineExhibitID] ASC),
    FOREIGN KEY ([CurrVersion]) REFERENCES [dbo].[CZVersion] ([VersionNumber]),
    CONSTRAINT [FK_TimelineExhibit_Exhibit] FOREIGN KEY ([ExhibitID]) REFERENCES [dbo].[Exhibit] ([ID]),
    CONSTRAINT [FK_TimelineExhibit_Timeline] FOREIGN KEY ([TimelineID]) REFERENCES [dbo].[Timeline] ([ID]),
    CONSTRAINT [FK_TimelineExhibit_User] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User] ([ID]),
    CONSTRAINT [FK_TimelineExhibit_User1] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[User] ([ID])
);



