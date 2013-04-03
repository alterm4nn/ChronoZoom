czDataSource = 'dump';
czVersion = "main";
ellipticalZoomZoomoutFactor = 0.5;
ellipticalZoomDuration = 9000;
panSpeedFactor = 3.0;
zoomSpeedFactor = 2.0;
zoomLevelFactor = 1.4;
allowedVisibileImprecision = 0.00001;
canvasElementAnimationTime = 1300;
canvasElementFadeInTime = 400;
contentScaleMargin = 20;
renderThreshold = 2;
targetFps = 60;
hoverAnimationSeconds = 2;
fallbackImageUri = '/Images/Temp-Thumbnail2.png';
timelineHeaderMargin = 1.0 / 18.0;
timelineHeaderSize = 1.0 / 9.0;
timelineTooltipMaxHeaderSize = 5;
timelineHeaderFontName = 'Arial';
timelineHeaderFontColor = 'rgb(232,232,232)';
timelineHoveredHeaderFontColor = 'white';
timelineStrokeStyle = 'rgb(232,232,232)';
timelineLineWidth = 1;
timelineHoveredLineWidth = 1;
timelineMinAspect = 0.2;
timelineContentMargin = 0.01;
timelineBorderColor = 'rgb(232,232,232)';
timelineHoveredBoxBorderColor = 'rgb(232,232,232)';
timelineBreadCrumbBorderOffset = 50;
timelineCenterOffsetAcceptableImplicity = 0.00001;
infodotShowContentZoomLevel = 9;
infodotShowContentThumbZoomLevel = 2;
infoDotHoveredBorderWidth = 40.0 / 450;
infoDotBorderWidth = 27.0 / 450;
infodotTitleWidth = 200.0 / 489;
infodotTitleHeight = 60.0 / 489;
infodotBibliographyHeight = 10.0 / 489;
infoDotBorderColor = 'rgb(232,232,232)';
infoDotHoveredBorderColor = 'white';
infoDotFillColor = 'rgb(92,92,92)';
infoDotTinyContentImageUri = '/images/tinyContent.png';
infodotMaxContentItemsCount = 10;
mediaContentElementZIndex = 100;
contentItemDescriptionNumberOfLines = 10;
contentItemShowContentZoomLevel = 9;
contentItemThumbnailMinLevel = 3;
contentItemThumbnailMaxLevel = 7;
contentItemThumbnailBaseUri = 'http://czbeta.blob.core.windows.net/images/';
contentItemTopTitleHeight = 47.0 / 540;
contentItemContentWidth = 480.0 / 520;
contentItemVerticalMargin = 13.0 / 540;
contentItemMediaHeight = 260.0 / 540;
contentItemSourceHeight = 10.0 / 540;
contentItemSourceFontColor = 'rgb(232,232,232)';
contentItemSourceHoveredFontColor = 'white';
contentItemAudioHeight = 40.0 / 540;
contentItemAudioTopMargin = 120.0 / 540;
contentItemFontHeight = 140.0 / 540;
contentItemHeaderFontName = 'Arial';
contentItemHeaderFontColor = 'white';
contentItemBoundingBoxBorderWidth = 13.0 / 520;
contentItemBoundingBoxFillColor = 'rgb(36,36,36)';
contentItemBoundingBoxBorderColor = undefined;
contentItemBoundingHoveredBoxBorderColor = 'white';
contentAppearanceAnimationStep = 0.01;
infoDotZoomConstraint = 0.005;
infoDotAxisFreezeThreshold = 0.75;
maxPermitedTimeRange = {
    left: -13700000000,
    right: 0
};
deeperZoomConstraints = [
    {
        left: -14000000000,
        right: -1000000000,
        scale: 1000
    }, 
    {
        left: -1000000000,
        right: -1000000,
        scale: 1
    }, 
    {
        left: -1000000,
        right: -12000,
        scale: 0.001
    }, 
    {
        left: -12000,
        right: 0,
        scale: 0.00006
    }
];
maxTickArrangeIterations = 12;
spaceBetweenLabels = 15;
spaceBetweenSmallTicks = 10;
months = [
    'January', 
    'February', 
    'March', 
    'April', 
    'May', 
    'June', 
    'July', 
    'August', 
    'September', 
    'October', 
    'November', 
    'December'
];
daysInMonth = [
    31, 
    28, 
    31, 
    30, 
    31, 
    30, 
    31, 
    31, 
    30, 
    31, 
    30, 
    31
];
tickLength = 11;
smallTickLength = 7;
strokeWidth = 3;
thresholdHeight = 10;
thresholdWidth = 8;
thresholdColors = [
    'rgb(173,71,155)', 
    'rgb(177,121,180)', 
    'rgb(220,123,154)', 
    'rgb(71,168,168)', 
    'rgb(95,187,71)', 
    'rgb(242,103,63)', 
    'rgb(247,144,63)', 
    'rgb(251,173,45)'
];
thresholdTextColors = [
    'rgb(36,1,56)', 
    'rgb(60,31,86)', 
    'rgb(85,33,85)', 
    'rgb(0,56,100)', 
    'rgb(0,73,48)', 
    'rgb(125,25,33)', 
    'rgb(126,51,0)', 
    'rgb(92,70,14)'
];
thresholdsDelayTime = 1000;
thresholdsAnimationTime = 500;
rectangleRadius = 3;
axisTextSize = 12;
axisTextFont = "Arial";
axisStrokeColor = "rgb(221,221,221)";
axisHeight = 47;
horizontalTextMargin = 20;
verticalTextMargin = 15;
gapLabelTick = 3;
activeMarkSize = 10;
cosmosTimelineID = "00000000-0000-0000-0000-000000000000";
earthTimelineID = "48fbb8a8-7c5d-49c3-83e1-98939ae2ae67";
lifeTimelineID = "d4809be4-3cf9-4ddd-9703-3ca24e4d3a26";
prehistoryTimelineID = "a6b821df-2a4d-4f0e-baf5-28e47ecb720b";
humanityTimelineID = "4afb5bb6-1544-4416-a949-8c8f473e544d";
toursAudioFormats = [
    {
        ext: 'mp3'
    }, 
    {
        ext: 'wav'
    }
];
seadragonServiceURL = "http://api.zoom.it/v1/content/?url=";
seadragonImagePath = "../Images/";
seadragonMaxConnectionAttempts = 3;
seadragonRetryInterval = 2000;
navigateNextMaxCount = 2;
longNavigationLength = 10;
serverUrlHost = location.protocol + "//" + location.host;
minTimelineWidth = 100;
