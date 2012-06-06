USE [Chronozoom]
GO

-- CZVersions
INSERT [dbo].[CZVersion] (
	[VersionNumber],
	[CreatedDate],
	[PublishDate],
	[UserID],
	[IsDeleted],
	[CZVersionID]
	)
VALUES (
	1,
	'03/12/2012',
	NULL,
	NULL,
	0,
	N'f25b5674-9f96-4066-8a48-12d297e2b5d3'
	)
GO

-- CZSystemVersion
INSERT [dbo].[CZSystemVersion] (
	[StagingVersion], 
	[ProdVersion], 
	[CZSystemVersionID]
	) 
VALUES (
	33, 
	33, 
	N'b8be035b-2eba-4449-807e-490bb8c9a61a'
	)
GO

-- Roles
INSERT [dbo].[Role] (
	[ID],
	[Role],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[CurrVersion]
	)
VALUES (
	N'7d26e199-ab7b-4039-ae1c-da1a404f7ff8',
	N'Admin',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	1
	)

INSERT [dbo].[Role] (
	[ID],
	[Role],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[CurrVersion]
	)
VALUES (
	N'23dfcd39-f391-4ae4-98e0-629fc3f84257',
	N'Guest',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	1
	)
GO

-- Users
INSERT [dbo].[User] (
	[ID],
	[UserName],
	[Password],
	[FirstName],
	[LastName],
	[EmailAddress],
	[RoleID],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[CurrVersion]
	)
VALUES (
	N'33fd20e1-483d-49d6-9f82-0b13a517c1ff',
	N'admin',
	N'admin$',
	N'Chronozoom',
	N'Admin',
	N'chronozoom@hotmail.com',
	N'7d26e199-ab7b-4039-ae1c-da1a404f7ff8',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	1
	)

INSERT [dbo].[User] (
	[ID],
	[UserName],
	[Password],
	[FirstName],
	[LastName],
	[EmailAddress],
	[RoleID],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[CurrVersion]
	)
VALUES (
	N'6f226a12-c66f-4050-8a01-11905c57f0d2',
	N'Guest',
	N'guest$',
	N'Chronozoom',
	N'Guest',
	N' ',
	N'23dfcd39-f391-4ae4-98e0-629fc3f84257',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	1
	)
GO

-- TimeUnits
INSERT [dbo].[TimeUnit] (
	[ID],
	[TimeUnit],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[CurrVersion]
	)
VALUES (
	N'3af91c99-c88b-4145-bf65-2a2ac77ca9b7',
	N'Ga',
	N'33fd20e1-483d-49d6-9f82-0b13a517c1ff',
	NULL,
	NULL,
	NULL,
	0,
	1
	)

INSERT [dbo].[TimeUnit] (
	[ID],
	[TimeUnit],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[CurrVersion]
	)
VALUES (
	N'4d4d707a-377a-4620-acd3-92638ea747e8',
	N'Ma',
	N'33fd20e1-483d-49d6-9f82-0b13a517c1ff',
	NULL,
	NULL,
	NULL,
	0,
	1
	)

INSERT [dbo].[TimeUnit] (
	[ID],
	[TimeUnit],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[CurrVersion]
	)
VALUES (
	N'92792be9-3ff2-4a11-9605-d634bbbb85cc',
	N'ka',
	N'33fd20e1-483d-49d6-9f82-0b13a517c1ff',
	NULL,
	NULL,
	NULL,
	0,
	1
	)

INSERT [dbo].[TimeUnit] (
	[ID],
	[TimeUnit],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[CurrVersion]
	)
VALUES (
	N'ba50c190-6c29-42fd-b54a-30ee4ad004a3',
	N'BCE',
	N'33fd20e1-483d-49d6-9f82-0b13a517c1ff',
	NULL,
	NULL,
	NULL,
	0,
	1
	)

INSERT [dbo].[TimeUnit] (
	[ID],
	[TimeUnit],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[CurrVersion]
	)
VALUES (
	N'4d0c906c-ff3b-43dd-8da3-04f13b3576e7',
	N'CE',
	N'33fd20e1-483d-49d6-9f82-0b13a517c1ff',
	NULL,
	NULL,
	NULL,
	0,
	1
	)

GO

-- Regimes
INSERT [dbo].[Regime] (
	[ID],
	[Regime],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[DoNotDisplay],
	[IsDeleted],
	[CurrVersion]
	)
VALUES (
	N'cff9c564-93f1-432c-b171-569499b26ab5',
	N'Cosmos',
	N'33fd20e1-483d-49d6-9f82-0b13a517c1ff',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	1
	)

INSERT [dbo].[Regime] (
	[ID],
	[Regime],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[DoNotDisplay],
	[IsDeleted],
	[CurrVersion]
	)
VALUES (
	N'2dc6788e-16a5-46b8-954f-a64a38bdf0f2',
	N'Earth',
	N'33fd20e1-483d-49d6-9f82-0b13a517c1ff',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	1
	)

INSERT [dbo].[Regime] (
	[ID],
	[Regime],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[DoNotDisplay],
	[IsDeleted],
	[CurrVersion]
	)
VALUES (
	N'cd20d6e8-1186-4923-a8f4-8a8a251cadef',
	N'Life',
	N'33fd20e1-483d-49d6-9f82-0b13a517c1ff',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	1
	)

INSERT [dbo].[Regime] (
	[ID],
	[Regime],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[DoNotDisplay],
	[IsDeleted],
	[CurrVersion]
	)
VALUES (
	N'b291094b-e7b0-4aa0-8e5f-1d8f782bb55b',
	N'Pre-history',
	N'33fd20e1-483d-49d6-9f82-0b13a517c1ff',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	1
	)

INSERT [dbo].[Regime] (
	[ID],
	[Regime],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[DoNotDisplay],
	[IsDeleted],
	[CurrVersion]
	)
VALUES (
	N'45462562-4af4-430a-acf8-3558aa8c29c2',
	N'Humanity',
	N'33fd20e1-483d-49d6-9f82-0b13a517c1ff',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	1
	)

GO

-- Thresholds
INSERT [dbo].[Threshold] (
	[ID],
	[Threshold],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[ShortDescription],
	[ThresholdDate],
	[ThresholdYear],
	[ThresholdTimeUnit],
	[BookmarkID],
	[CurrVersion]
	)
VALUES (
	N'2de9789d-41f0-445a-9526-3c673a599cf7',
	N'1. Origins of the Universe',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	N'The beginning of everything: What happened during the Big Bang and the early stages of the Universe. ',
	NULL,
	CAST(13.7000 AS DECIMAL(8, 4)),
	N'3af91c99-c88b-4145-bf65-2a2ac77ca9b7',
	NULL,
	1
	)

INSERT [dbo].[Threshold] (
	[ID],
	[Threshold],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[ShortDescription],
	[ThresholdDate],
	[ThresholdYear],
	[ThresholdTimeUnit],
	[BookmarkID],
	[CurrVersion]
	)
VALUES (
	N'9d6bc73f-af65-4a92-90bd-4c22c764b3bb',
	N'2. Origins of the First Stars',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	N'Threshold 2: The Stars Light Up: Stars became the first stable, complex entities to exist in the Universe. This threshold examines the conditions that led up to the first stars lighting up.',
	NULL,
	CAST(13.5000 AS DECIMAL(8, 4)),
	N'3af91c99-c88b-4145-bf65-2a2ac77ca9b7',
	NULL,
	1
	)

INSERT [dbo].[Threshold] (
	[ID],
	[Threshold],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[ShortDescription],
	[ThresholdDate],
	[ThresholdYear],
	[ThresholdTimeUnit],
	[BookmarkID],
	[CurrVersion]
	)
VALUES (
	N'90aaddae-8fea-409a-8e5c-85b30eb7f998',
	N'3. Origins of Chemical Complexity',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	N'Threshold 3: Dying stars generate temperatures high enough to create entirely new elements. Only very big stars create temperatures high enough to create the rest of the elements.',
	NULL,
	CAST(12.0000 AS DECIMAL(8, 4)),
	N'3af91c99-c88b-4145-bf65-2a2ac77ca9b7',
	NULL,
	1
	)

INSERT [dbo].[Threshold] (
	[ID],
	[Threshold],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[ShortDescription],
	[ThresholdDate],
	[ThresholdYear],
	[ThresholdTimeUnit],
	[BookmarkID],
	[CurrVersion]
	)
VALUES (
	N'49b10256-8270-4991-b3a6-c1bb9812e7bd',
	N'4. Origins of the Earth and Solar System',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	N'Threshold 4: Elements link up to form more complex molecules. These new materials were necessary for creating our solar system.  ',
	NULL,
	CAST(4.5600 AS DECIMAL(8, 4)),
	N'3af91c99-c88b-4145-bf65-2a2ac77ca9b7',
	NULL,
	1
	)

INSERT [dbo].[Threshold] (
	[ID],
	[Threshold],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[ShortDescription],
	[ThresholdDate],
	[ThresholdYear],
	[ThresholdTimeUnit],
	[BookmarkID],
	[CurrVersion]
	)
VALUES (
	N'5cf07d09-f503-472c-a85e-cea9e64efc69',
	N'5. Origins of life',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	N'Threshold 5 introduces DNA and Charles Darwin''s work on the theory of evolution, as well as the Goldilocks Conditions necessary for life to form and prosper.',
	NULL,
	CAST(3.8000 AS DECIMAL(8, 4)),
	N'3af91c99-c88b-4145-bf65-2a2ac77ca9b7',
	NULL,
	1
	)

INSERT [dbo].[Threshold] (
	[ID],
	[Threshold],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[ShortDescription],
	[ThresholdDate],
	[ThresholdYear],
	[ThresholdTimeUnit],
	[BookmarkID],
	[CurrVersion]
	)
VALUES (
	N'8ca0fe9d-e58d-474b-a4b4-df6f515c2d92',
	N'6. Origins of human beings',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	N'Threshold 6: A mass extinction 65 million years ago was followed by an increase in biodiversity. Mammals flourished, including our ancestors. ',
	NULL,
	CAST(7.0000 AS DECIMAL(8, 4)),
	N'4d4d707a-377a-4620-acd3-92638ea747e8',
	NULL,
	1
	)

INSERT [dbo].[Threshold] (
	[ID],
	[Threshold],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[ShortDescription],
	[ThresholdDate],
	[ThresholdYear],
	[ThresholdTimeUnit],
	[BookmarkID],
	[CurrVersion]
	)
VALUES (
	N'3e46e911-d48e-4de5-b7aa-eed1e38f0cf9',
	N'7. Origins of agriculture',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	N'Threshold 7: Agriculture, the cultivation of animals, plants for products used to sustain life is a key component in the rise of sedentary human civilization. ',
	NULL,
	CAST(11.0000 AS DECIMAL(8, 4)),
	N'92792be9-3ff2-4a11-9605-d634bbbb85cc',
	NULL,
	1
	)

INSERT [dbo].[Threshold] (
	[ID],
	[Threshold],
	[CreatedBy],
	[ModifiedBy],
	[CreatedOn],
	[ModifiedOn],
	[IsDeleted],
	[ShortDescription],
	[ThresholdDate],
	[ThresholdYear],
	[ThresholdTimeUnit],
	[BookmarkID],
	[CurrVersion]
	)
VALUES (
	N'61b53277-bae0-432b-a0d3-f690132f963f',
	N'8. Origins of modern world',
	NULL,
	NULL,
	NULL,
	NULL,
	0,
	N'Threshold 8: The birth of global exchange networks, competitive markets, and increasing use of energy have accelerated the pace of change.',
	NULL,
	CAST(1000.0000 AS DECIMAL(8, 4)),
	N'4d0c906c-ff3b-43dd-8da3-04f13b3576e7',
	NULL,
	1
	)
GO

--Timelines
ALTER TABLE [dbo].[Timeline]
DROP CONSTRAINT [FK_Timeline_Timeline] 

SET IDENTITY_INSERT [dbo].[Timeline] ON

INSERT [dbo].[Timeline] (
	[ID],
	[Title],
	[ThresholdID],
	[RegimeID],
	[FromContentDate],
	[FromContentYear],
	[ToContentDate],
	[ToContentYear],
	[ParentTimelineID],
	[IsVisible],
	[IsDeleted],
	[FromTimeUnit],
	[ToTimeUnit],
	[SourceURL],
	[Attribution],
	[UniqueID],
	[Sequence],
	[Height],
	[CurrVersion]
	)
VALUES (
	N'468a8005-36e3-4676-9f52-312d8b6eb7b7',
	N'Cosmos',
	N'2de9789d-41f0-445a-9526-3c673a599cf7',
	N'cff9c564-93f1-432c-b171-569499b26ab5',
	NULL,
	CAST(13.7000 AS DECIMAL(8, 4)),
	NULL,
	CAST(0.0000 AS DECIMAL(8, 4)),
	NULL,
	1,
	0,
	N'3af91c99-c88b-4145-bf65-2a2ac77ca9b7',
	N'3af91c99-c88b-4145-bf65-2a2ac77ca9b7',
	NULL,
	NULL,
	55,
	NULL,
	CAST(90.0000 AS DECIMAL(8, 4)),
	1
	)

INSERT [dbo].[Timeline] (
	[ID],
	[Title],
	[ThresholdID],
	[RegimeID],
	[FromContentDate],
	[FromContentYear],
	[ToContentDate],
	[ToContentYear],
	[ParentTimelineID],
	[IsVisible],
	[IsDeleted],
	[FromTimeUnit],
	[ToTimeUnit],
	[SourceURL],
	[Attribution],
	[UniqueID],
	[Sequence],
	[Height],
	[CurrVersion]
	)
VALUES (
	N'48fbb8a8-7c5d-49c3-83e1-98939ae2ae67',
	N'Earth & Solar System',
	N'49b10256-8270-4991-b3a6-c1bb9812e7bd',
	N'2dc6788e-16a5-46b8-954f-a64a38bdf0f2',
	NULL,
	CAST(4.5700 AS DECIMAL(8, 4)),
	NULL,
	CAST(0.0000 AS DECIMAL(8, 4)),
	N'468a8005-36e3-4676-9f52-312d8b6eb7b7',
	1,
	0,
	N'3af91c99-c88b-4145-bf65-2a2ac77ca9b7',
	N'3af91c99-c88b-4145-bf65-2a2ac77ca9b7',
	NULL,
	NULL,
	174,
	NULL,
	CAST(75.0000 AS DECIMAL(8, 4)),
	1
	)

INSERT [dbo].[Timeline] (
	[ID],
	[Title],
	[ThresholdID],
	[RegimeID],
	[FromContentDate],
	[FromContentYear],
	[ToContentDate],
	[ToContentYear],
	[ParentTimelineID],
	[IsVisible],
	[IsDeleted],
	[FromTimeUnit],
	[ToTimeUnit],
	[SourceURL],
	[Attribution],
	[UniqueID],
	[Sequence],
	[Height],
	[CurrVersion]
	)
VALUES (
	N'd4809be4-3cf9-4ddd-9703-3ca24e4d3a26',
	N'Life',
	N'5cf07d09-f503-472c-a85e-cea9e64efc69',
	N'cd20d6e8-1186-4923-a8f4-8a8a251cadef',
	NULL,
	CAST(4.0000 AS DECIMAL(8, 4)),
	NULL,
	CAST(0.0000 AS DECIMAL(8, 4)),
	N'48fbb8a8-7c5d-49c3-83e1-98939ae2ae67',
	1,
	0,
	N'3af91c99-c88b-4145-bf65-2a2ac77ca9b7',
	N'3af91c99-c88b-4145-bf65-2a2ac77ca9b7',
	NULL,
	NULL,
	66,
	NULL,
	CAST(60.0000 AS DECIMAL(8, 4)),
	1
	)

INSERT [dbo].[Timeline] (
	[ID],
	[Title],
	[ThresholdID],
	[RegimeID],
	[FromContentDate],
	[FromContentYear],
	[ToContentDate],
	[ToContentYear],
	[ParentTimelineID],
	[IsVisible],
	[IsDeleted],
	[FromTimeUnit],
	[ToTimeUnit],
	[SourceURL],
	[Attribution],
	[UniqueID],
	[Sequence],
	[Height],
	[CurrVersion]
	)
VALUES (
	N'a6b821df-2a4d-4f0e-baf5-28e47ecb720b',
	N'Human Prehistory',
	N'8ca0fe9d-e58d-474b-a4b4-df6f515c2d92',
	N'b291094b-e7b0-4aa0-8e5f-1d8f782bb55b',
	NULL,
	CAST(8.5000 AS DECIMAL(8, 4)),
	NULL,
	CAST(0.0000 AS DECIMAL(8, 4)),
	N'd4809be4-3cf9-4ddd-9703-3ca24e4d3a26',
	1,
	0,
	N'4d4d707a-377a-4620-acd3-92638ea747e8',
	N'4d4d707a-377a-4620-acd3-92638ea747e8',
	NULL,
	NULL,
	46,
	NULL,
	CAST(0.0500 AS DECIMAL(8, 4)),
	1
	)

INSERT [dbo].[Timeline] (
	[ID],
	[Title],
	[ThresholdID],
	[RegimeID],
	[FromContentDate],
	[FromContentYear],
	[ToContentDate],
	[ToContentYear],
	[ParentTimelineID],
	[IsVisible],
	[IsDeleted],
	[FromTimeUnit],
	[ToTimeUnit],
	[SourceURL],
	[Attribution],
	[UniqueID],
	[Sequence],
	[Height],
	[CurrVersion]
	)
VALUES (
	N'4afb5bb6-1544-4416-a949-8c8f473e544d',
	N'Humanity',
	N'61b53277-bae0-432b-a0d3-f690132f963f',
	N'45462562-4af4-430a-acf8-3558aa8c29c2',
	NULL,
	CAST(3000.0000 AS DECIMAL(8, 4)),
	NULL,
	CAST(0.0000 AS DECIMAL(8, 4)),
	N'a6b821df-2a4d-4f0e-baf5-28e47ecb720b',
	1,
	0,
	N'ba50c190-6c29-42fd-b54a-30ee4ad004a3',
	N'4d4d707a-377a-4620-acd3-92638ea747e8',
	NULL,
	NULL,
	161,
	NULL,
	CAST(0.0100 AS DECIMAL(8, 4)),
	1
	)

SET IDENTITY_INSERT [dbo].[Timeline] OFF
GO
