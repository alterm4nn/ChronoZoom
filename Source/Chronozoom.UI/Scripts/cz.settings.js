czDataSource = 'db'; // possible values: db, relay, dump
// configures whether we should use Chronozoom.svc (directly accesses the database) ['db'], or ChronozoomRelay.svc (using HTTP GET) ['relay'], or saved as local file ResponseDump.txt ['dump'].

czVersion = "main"; //can be main or mobile.is needed for threshold rendering

ellipticalZoomZoomoutFactor = 0.5; //configures how high the elliptic zoom zooms out while changing visible region
ellipticalZoomDuration = 9000; //(ms) approx transition time from cosmos to humanity timline
panSpeedFactor = 3.0;   //the factor of how fast the image pursuing the mouse while panning
zoomSpeedFactor = 2.0;  //the factor of how fast the image pursuing the mouse while zooming
zoomLevelFactor = 1.4;  //the step of the zooming
allowedVisibileImprecision = 0.00001; // allowed imprecision in compare of two visibles

contentScaleMargin = 20; //setts up margin in pixels for zooming to content option

renderThreshold = 2;    // minimum size of either width or height (pixels) of an element when it is rendered

targetFps = 60; //the frames per second target value for animation and transitions
hoverAnimationSeconds = 2; //animation time between apearing of timeline color on mouse hover

fallbackImageUri = 'Images/Temp-Thumbnail2.png'; // the image that is shown when thumbnail loading fails (e.g. database is unavailable)

// Styles of timelines
timelineHeaderMargin = 1.0 / 18.0;  // size of left margins, relative to height of the timeline.
timelineHeaderSize = 1.0 / 9.0;    // header's font size, relative to height of the timeline
timelineTooltipMaxHeaderSize = 5; // timeline tooltip appears, when its title screen size less than this constant
timelineHeaderFontName = 'Arial';    // header's font size, relative to height of the timeline
timelineHeaderFontColor = 'rgb(232,232,232)';
timelineHoveredHeaderFontColor = 'white';
timelineStrokeStyle = 'rgb(232,232,232)'; // border line style
timelineLineWidth = 1;        // border line width (pixels)
timelineHoveredLineWidth = 1; // in px
timelineMinAspect = 0.2; //minimal timeline.height / timeline.width
timelineContentMargin = 0.01; //determines margin for child elements of timeline. Margin = timelineWidth * timelineContentMargin
timelineBorderColor = 'rgb(232,232,232)';
timelineHoveredBoxBorderColor = 'rgb(232,232,232)';
timelineBreadCrumbBorderOffset = 50; // maximum allowed offset of timeline from canvas edge to show breadcrumb
timelineCenterOffsetAcceptableImplicity = 0.00001; // acceptable implicity in position of center of canvas inside timeline

infodotShowContentZoomLevel = 9; // zoom level (log_2 of size in pixel) when all content is shown
infodotShowContentThumbZoomLevel = 2; // zoom level (log_2 of size in pixel) when thumbnails for all content items are shown
infoDotHoveredBorderWidth = 40.0 / 450; // in virtual coordinates 
infoDotBorderWidth = 27.0 / 450; // in virtual coordinates
infodotTitleWidth = 200.0 / 489;
infodotTitleHeight = 60.0 / 489;
infodotBibliographyHeight = 10.0 / 489;
infoDotBorderColor = 'rgb(232,232,232)'; // color of infdot's circle border
infoDotHoveredBorderColor = 'white'; // color of infdot's circle border when mouse cursor is over it
infoDotFillColor = 'rgb(92,92,92)'; // color of infdot's circle border
infoDotTinyContentImageUri = 'Images/tinyContent.png';

mediaContentElementZIndex = 100;
contentItemDescriptionNumberOfLines = 10;
contentItemShowContentZoomLevel = 9; // zoom level (log_2 of size in pixel) when all content is shown
contentItemThumbnailMinLevel = 3; // miminimal available thumbnail in the database
contentItemThumbnailMaxLevel = 7; // maximal available thumbnail in the database
contentItemThumbnailBaseUri = 'https://[Your blob name].blob.core.windows.net/images/';
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
contentItemHeaderFontName = 'Arial';    // header's font name
contentItemHeaderFontColor = 'white';    // header's font size, relative to height of the timeline
// See also contentItemDescriptionText class in the Styles/cz.css which decorates the description block in a content item


contentItemBoundingBoxBorderWidth = 13.0 / 520; // in virtual coordinates
contentItemBoundingBoxFillColor = 'rgb(36,36,36)'; // in pixels
contentItemBoundingBoxBorderColor = undefined; // in pixels
contentItemBoundingHoveredBoxBorderColor = 'white'; // in pixels

contentAppearanceAnimationStep = 0.01;

//navigation constraints
infoDotZoomConstraint = 0.005; //an zooming limit into the infodot (the fraction of infodot diameter)
infoDotAxisFreezeThreshold = 0.75; // the minimum fraction of the viewport that the infodot should take to make the axis to be freezed
maxPermitedTimeRange = { left: -13700000000, right: 0 }; //a maximum range in virtual coordinates that is permited to observed with a CZ
deeperZoomConstraints = //the array of the constraints of the deep zoom level and teir corresponding intervals
[
    { left: -14000000000, right: -1000000000, scale: 1000 }, //billions of years zoom in constraint
    {left: -1000000000, right: -1000000, scale: 1 }, //millions of years zoom in constraint
    {left: -1000000, right: -12000, scale: 0.001 }, //thousand of years zoom in constraint
    {left: -12000 /*approx 10k BC */, right: 0, scale: 0.000003} //single day zoom in constraint in human history scale
];

// axis constants
maxTickArrangeIterations = 12; // max iterations constant used in creating ticks
spaceBetweenLabels = 15; // constant to calculate when ticks count should be increased or decreased
spaceBetweenSmallTicks = 10;  // canstant to calculate when small ticks count should be increased or decreased
// array of month names to use in labels
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// array of numbers of days for each month, 28 days in february by default
daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
tickLength = 11; // length of big tick
smallTickLength = 7; // length of small tick
strokeWidth = 3; // width of ticks and lines
thresholdHeight = 10; // height of threshold when not active
thresholdWidth = 8;
thresholdColors = ['rgb(173,71,155)', 'rgb(177,121,180)', 'rgb(220,123,154)', 'rgb(71,168,168)', 'rgb(95,187,71)', 'rgb(242,103,63)', 'rgb(247,144,63)', 'rgb(251,173,45)'];
thresholdTextColors = ['rgb(36,1,56)', 'rgb(60,31,86)', 'rgb(85,33,85)', 'rgb(0,56,100)', 'rgb(0,73,48)', 'rgb(125,25,33)', 'rgb(126,51,0)', 'rgb(92,70,14)'];
thresholdsDelayTime = 1000; // Time in milliseconds for all thresholds to stay on the screen after mouse is out
thresholdsAnimationTime = 500; // Time in milliseconds for all thresholds to open or close
rectangleRadius = 3; // radius of rounded edges of rectangles
axisTextSize = 12; // size of text
axisTextFont = "Arial"; // font of text
axisStrokeColor = "rgb(221,221,221)"; // color of text
axisHeight = 47; // full height of axis
horizontalTextMargin = 20; // left and right margin for background text
verticalTextMargin = 15; // margin for text lines
gapLabelTick = 3; // gap between tick and label
activeMarkSize = 10; // length of side of active triangle

// IDs of regime timelines
cosmosTimelineID = "468a8005-36e3-4676-9f52-312d8b6eb7b7"; //"4fd1cb5e-39bf-4117-9737-d4f0f575e867";
earthTimelineID = "48fbb8a8-7c5d-49c3-83e1-98939ae2ae67";
lifeTimelineID = "d4809be4-3cf9-4ddd-9703-3ca24e4d3a26"; //"18d7204b-11a7-46fb-918c-edf603af778f";
prehistoryTimelineID = "a6b821df-2a4d-4f0e-baf5-28e47ecb720b"; //"990e6392-11a2-4379-873a-71e787eeab6e";
humanityTimelineID = "4afb5bb6-1544-4416-a949-8c8f473e544d";

//tours
toursAudioFormats =
[
    { ext: 'mp3' }, //the order of the elements affects the priority of the format to use. the first format has the higher priority
    {ext: 'wav' }
];

// seadragon
seadragonServiceURL = "http://api.zoom.it/v1/content/?url=";
seadragonImagePath = "../Images/";
seadragonMaxConnectionAttempts = 3;
seadragonRetryInterval = 2000; // ms

// breadcrumb
navigateNextMaxCount = 2; // if navNext (left or right) button was pressed rapidly this amount of times, then perfrom long navigation
longNavigationLength = 10; // length of navigation in long navigation regime
