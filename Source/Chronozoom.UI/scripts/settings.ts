module CZ {
    export module Settings {
        export var czDataSource = 'db'; // possible values: db, relay, dump
        // configures whether we should use Chronozoom.svc (directly accesses the database) ['db'], or ChronozoomRelay.svc (using HTTP GET) ['relay'], or saved as local file ResponseDump.txt ['dump'].

        export var czVersion = "main"; //can be main or mobile.is needed for threshold rendering

        export var ellipticalZoomZoomoutFactor = 0.5; //configures how high the elliptic zoom zooms out while changing visible region
        export var ellipticalZoomDuration = 9000; //(ms) approx transition time from cosmos to humanity timline
        export var panSpeedFactor = 3.0;   //the factor of how fast the image pursuing the mouse while panning
        export var zoomSpeedFactor = 2.0;  //the factor of how fast the image pursuing the mouse while zooming
        export var zoomLevelFactor = 1.4;  //the step of the zooming
        export var allowedVisibileImprecision = 0.00001; // allowed imprecision in compare of two visibles
        export var allowedMathImprecision = 0.0000001; // allowed imprecision in float (10^-7)
        export var canvasElementAnimationTime = 1300; //duration of animation of resize or transition of canvas element
        export var canvasElementFadeInTime = 400; // duration of fade in animation of newly added canvas element

        export var contentScaleMargin = 20; //setts up margin in pixels for zooming to content option

        export var renderThreshold = 2;    // minimum size of either width or height (pixels) of an element when it is rendered

        export var targetFps = 60; //the frames per second target value for animation and transitions
        export var hoverAnimationSeconds = 2; //animation time between apearing of timeline color on mouse hover

        export var fallbackImageUri = '/images/Temp-Thumbnail2.png'; // the image that is shown when thumbnail loading fails (e.g. database is unavailable)

        // Styles of timelines
        export var timelineHeaderMargin = 1.0 / 18.0;  // size of left margins, relative to height of the timeline.
        export var timelineHeaderSize = 1.0 / 9.0;    // header's font size, relative to height of the timeline
        export var timelineTooltipMaxHeaderSize = 5; // timeline tooltip appears, when its title screen size less than this constant
        export var timelineHeaderFontName = 'Arial';    // header's font size, relative to height of the timeline
        export var timelineHeaderFontColor = 'rgb(232,232,232)';
        export var timelineHoveredHeaderFontColor = 'white';
        export var timelineStrokeStyle = 'rgb(232,232,232)'; // border line style
        export var timelineLineWidth = 1;        // border line width (pixels)
        export var timelineHoveredLineWidth = 1; // in px
        export var timelineMinAspect = 0.2; //minimal timeline.height / timeline.width
        export var timelineContentMargin = 0.01; //determines margin for child elements of timeline. Margin = timelineWidth * timelineContentMargin
        export var timelineBorderColor = 'rgb(232,232,232)';
        export var timelineHoveredBoxBorderColor = 'rgb(232,232,232)';
        export var timelineBreadCrumbBorderOffset = 50; // maximum allowed offset of timeline from canvas edge to show breadcrumb
        export var timelineCenterOffsetAcceptableImplicity = 0.00001; // acceptable implicity in position of center of canvas inside timeline

        export var infodotShowContentZoomLevel = 9; // zoom level (log_2 of size in pixel) when all content is shown
        export var infodotShowContentThumbZoomLevel = 2; // zoom level (log_2 of size in pixel) when thumbnails for all content items are shown
        export var infoDotHoveredBorderWidth = 40.0 / 450; // in virtual coordinates
        export var infoDotBorderWidth = 27.0 / 450; // in virtual coordinates
        export var infodotTitleWidth = 200.0 / 489;
        export var infodotTitleHeight = 60.0 / 489;
        export var infodotBibliographyHeight = 10.0 / 489;
        export var infoDotBorderColor = 'rgb(232,232,232)'; // color of infdot's circle border
        export var infoDotHoveredBorderColor = 'white'; // color of infdot's circle border when mouse cursor is over it
        export var infoDotFillColor = 'rgb(92,92,92)'; // color of infdot's circle border
        export var infoDotTinyContentImageUri = '/images/tinyContent.png';
        export var infodotMaxContentItemsCount = 10;

        export var mediaContentElementZIndex = 100;
        export var contentItemDescriptionNumberOfLines = 10;
        export var contentItemShowContentZoomLevel = 9; // zoom level (log_2 of size in pixel) when all content is shown
        export var contentItemThumbnailMinLevel = 3; // miminimal available thumbnail in the database
        export var contentItemThumbnailMaxLevel = 7; // maximal available thumbnail in the database
        export var contentItemThumbnailBaseUri = 'http://czbeta.blob.core.windows.net/images/';
        export var contentItemTopTitleHeight = 47.0 / 540;
        export var contentItemContentWidth = 480.0 / 520;
        export var contentItemVerticalMargin = 13.0 / 540;
        export var contentItemMediaHeight = 260.0 / 540;
        export var contentItemSourceHeight = 10.0 / 540;
        export var contentItemSourceFontColor = 'rgb(232,232,232)';
        export var contentItemSourceHoveredFontColor = 'white';
        export var contentItemAudioHeight = 40.0 / 540;
        export var contentItemAudioTopMargin = 120.0 / 540;
        export var contentItemFontHeight = 140.0 / 540;
        export var contentItemHeaderFontName = 'Arial';    // header's font name
        export var contentItemHeaderFontColor = 'white';    // header's font size, relative to height of the timeline
        // See also contentItemDescriptionText class in the Styles/cz.css which decorates the description block in a content item


        export var contentItemBoundingBoxBorderWidth = 13.0 / 520; // in virtual coordinates
        export var contentItemBoundingBoxFillColor = 'rgb(36,36,36)'; // in pixels
        export var contentItemBoundingBoxBorderColor = undefined; // in pixels
        export var contentItemBoundingHoveredBoxBorderColor = 'white'; // in pixels

        export var contentAppearanceAnimationStep = 0.01;

        //navigation constraints
        export var infoDotZoomConstraint = 0.005; //an zooming limit into the infodot (the fraction of infodot diameter)
        export var infoDotAxisFreezeThreshold = 0.75; // the minimum fraction of the viewport that the infodot should take to make the axis to be freezed
        export var maxPermitedTimeRange = { left: -13700000000, right: 0 }; //a maximum range in virtual coordinates that is permited to observed with a CZ
        export var deeperZoomConstraints = //the array of the constraints of the deep zoom level and teir corresponding intervals
        [
            { left: -14000000000, right: -1000000000, scale: 1000 }, //billions of years zoom in constraint
            { left: -1000000000, right: -1000000, scale: 1 }, //millions of years zoom in constraint
            { left: -1000000, right: -12000, scale: 0.001 }, //thousand of years zoom in constraint
            { left: -12000 /*approx 10k BC */, right: 0, scale: 0.00006 } //single day zoom in constraint in human history scale
        ];

        // Timescale constants
        export var maxTickArrangeIterations = 3; // max iterations constant used in creating ticks
        export var spaceBetweenLabels = 15; // constant to calculate when ticks count should be increased or decreased
        export var spaceBetweenSmallTicks = 10;  // canstant to calculate when small ticks count should be increased or decreased
        export var tickLength = 14; // length of big tick
        export var smallTickLength = 7; // length of small tick
        export var strokeWidth = 3; // width of ticks and lines
        export var thresholdHeight = 10; // height of threshold when not active
        export var thresholdWidth = 8;
        export var thresholdColors = ['rgb(173,71,155)', 'rgb(177,121,180)', 'rgb(220,123,154)', 'rgb(71,168,168)', 'rgb(95,187,71)', 'rgb(242,103,63)', 'rgb(247,144,63)', 'rgb(251,173,45)'];
        export var thresholdTextColors = ['rgb(36,1,56)', 'rgb(60,31,86)', 'rgb(85,33,85)', 'rgb(0,56,100)', 'rgb(0,73,48)', 'rgb(125,25,33)', 'rgb(126,51,0)', 'rgb(92,70,14)'];
        export var thresholdsDelayTime = 1000; // Time in milliseconds for all thresholds to stay on the screen after mouse is out
        export var thresholdsAnimationTime = 500; // Time in milliseconds for all thresholds to open or close
        export var rectangleRadius = 3; // radius of rounded edges of rectangles
        export var axisTextSize = 12; // size of text
        export var axisTextFont = "Arial"; // font of text
        export var axisStrokeColor = "rgb(221,221,221)"; // color of text
        export var axisHeight = 47; // full height of axis
        export var horizontalTextMargin = 20; // left and right margin for background text
        export var verticalTextMargin = 15; // margin for text lines
        export var gapLabelTick = 3; // gap between tick and label
        export var activeMarkSize = 10; // length of side of active triangle 
        export var minLabelSpace = 50; // minimum space (in px) between 2 labels on timescale
        export var minTickSpace = 8; // minimum space (in px) between 2 ticks on timescale
        export var minSmallTickSpace = 8;
        export var timescaleThickness = 2; // thickness of timescale's baseline and ticks
        export var markerWidth = 85; //width of marker
        export var panelWidth = 185; //width of left-right panel

        // IDs of regime timelines
        export var cosmosTimelineID = "00000000-0000-0000-0000-000000000000";
        export var earthTimelineID = "48fbb8a8-7c5d-49c3-83e1-98939ae2ae67";
        export var lifeTimelineID = "d4809be4-3cf9-4ddd-9703-3ca24e4d3a26";
        export var prehistoryTimelineID = "a6b821df-2a4d-4f0e-baf5-28e47ecb720b";
        export var humanityTimelineID = "4afb5bb6-1544-4416-a949-8c8f473e544d";

        //tours
        export var toursAudioFormats =
        [
            { ext: 'mp3' }, //the order of the elements affects the priority of the format to use. the first format has the higher priority
            { ext: 'wav' }
        ];
        export var tourDefaultTransitionTime = 10; // seconds

        // seadragon
        export var seadragonServiceURL = "http://api.zoom.it/v1/content/?url=";
        export var seadragonImagePath = "/images/seadragonControls/";
        export var seadragonMaxConnectionAttempts = 3;
        export var seadragonRetryInterval = 2000; // ms

        // breadcrumb
        export var navigateNextMaxCount = 2; // if navNext (left or right) button was pressed rapidly this amount of times, then perfrom long navigation
        export var longNavigationLength = 10; // length of navigation in long navigation regime

        // progresive loading
        export var serverUrlHost = location.protocol + "//" + location.host;
        export var minTimelineWidth = 100; // px

        // Login constants
        export var signinUrlMicrosoft = "";
        export var signinUrlGoogle = "";
        export var signinUrlYahoo = "";
    }
}
