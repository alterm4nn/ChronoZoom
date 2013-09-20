var CZ;
(function (CZ) {
    (function (Settings) {
        Settings.czDataSource = 'db';
        Settings.czVersion = "main";
        Settings.ellipticalZoomZoomoutFactor = 0.5;
        Settings.ellipticalZoomDuration = 9000;
        Settings.panSpeedFactor = 3.0;
        Settings.zoomSpeedFactor = 2.0;
        Settings.zoomLevelFactor = 1.4;
        Settings.allowedVisibileImprecision = 0.00001;
        Settings.allowedMathImprecision = 0.000001;
        Settings.allowedMathImprecisionDecimals = parseInt(Settings.allowedMathImprecision.toExponential().split("-")[1]);
        Settings.canvasElementAnimationTime = 1300;
        Settings.canvasElementFadeInTime = 400;
        Settings.contentScaleMargin = 20;
        Settings.renderThreshold = 2;
        Settings.targetFps = 60;
        Settings.hoverAnimationSeconds = 2;
        Settings.fallbackImageUri = '/images/Temp-Thumbnail2.png';
        Settings.timelineHeaderMargin = 1.0 / 18.0;
        Settings.timelineHeaderSize = 1.0 / 9.0;
        Settings.timelineTooltipMaxHeaderSize = 5;
        Settings.timelineHeaderFontName = 'Arial';
        Settings.timelineHeaderFontColor = 'rgb(232,232,232)';
        Settings.timelineHoveredHeaderFontColor = 'white';
        Settings.timelineStrokeStyle = 'rgb(232,232,232)';
        Settings.timelineLineWidth = 1;
        Settings.timelineHoveredLineWidth = 1;
        Settings.timelineMinAspect = 0.2;
        Settings.timelineContentMargin = 0.01;
        Settings.timelineBorderColor = 'rgb(232,232,232)';
        Settings.timelineHoveredBoxBorderColor = 'rgb(232,232,232)';
        Settings.timelineBreadCrumbBorderOffset = 50;
        Settings.timelineCenterOffsetAcceptableImplicity = 0.00001;
        Settings.timelineColor = null;
        Settings.timelineHoverAnimation = 3 / 60.0;
        Settings.timelineGradientFillStyle = null;
        Settings.infodotShowContentZoomLevel = 9;
        Settings.infodotShowContentThumbZoomLevel = 2;
        Settings.infoDotHoveredBorderWidth = 40.0 / 450;
        Settings.infoDotBorderWidth = 27.0 / 450;
        Settings.infodotTitleWidth = 200.0 / 489;
        Settings.infodotTitleHeight = 60.0 / 489;
        Settings.infodotBibliographyHeight = 10.0 / 489;
        Settings.infoDotBorderColor = 'rgb(232,232,232)';
        Settings.infoDotHoveredBorderColor = 'white';
        Settings.infoDotFillColor = 'rgb(92,92,92)';
        Settings.infoDotTinyContentImageUri = '/images/tinyContent.png';
        Settings.infodotMaxContentItemsCount = 10;
        Settings.mediaContentElementZIndex = 100;
        Settings.contentItemDescriptionNumberOfLines = 10;
        Settings.contentItemShowContentZoomLevel = 9;
        Settings.contentItemThumbnailMinLevel = 3;
        Settings.contentItemThumbnailMaxLevel = 7;
        Settings.contentItemThumbnailBaseUri = 'http://czbeta.blob.core.windows.net/images/';
        Settings.contentItemTopTitleHeight = 47.0 / 540;
        Settings.contentItemContentWidth = 480.0 / 520;
        Settings.contentItemVerticalMargin = 13.0 / 540;
        Settings.contentItemMediaHeight = 260.0 / 540;
        Settings.contentItemSourceHeight = 10.0 / 540;
        Settings.contentItemSourceFontColor = 'rgb(232,232,232)';
        Settings.contentItemSourceHoveredFontColor = 'white';
        Settings.contentItemAudioHeight = 40.0 / 540;
        Settings.contentItemAudioTopMargin = 120.0 / 540;
        Settings.contentItemFontHeight = 140.0 / 540;
        Settings.contentItemHeaderFontName = 'Arial';
        Settings.contentItemHeaderFontColor = 'white';
        Settings.contentItemBoundingBoxBorderWidth = 13.0 / 520;
        Settings.contentItemBoundingBoxFillColor = 'rgb(36,36,36)';
        Settings.contentItemBoundingBoxBorderColor = undefined;
        Settings.contentItemBoundingHoveredBoxBorderColor = 'white';
        Settings.contentAppearanceAnimationStep = 0.01;
        Settings.infoDotZoomConstraint = 0.005;
        Settings.infoDotAxisFreezeThreshold = 0.75;
        Settings.maxPermitedTimeRange = {
            left: -13700000000,
            right: 0
        };
        Settings.deeperZoomConstraints = [
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
        Settings.maxTickArrangeIterations = 3;
        Settings.spaceBetweenLabels = 15;
        Settings.spaceBetweenSmallTicks = 10;
        Settings.tickLength = 14;
        Settings.smallTickLength = 7;
        Settings.strokeWidth = 3;
        Settings.thresholdHeight = 10;
        Settings.thresholdWidth = 8;
        Settings.thresholdColors = [
            'rgb(173,71,155)', 
            'rgb(177,121,180)', 
            'rgb(220,123,154)', 
            'rgb(71,168,168)', 
            'rgb(95,187,71)', 
            'rgb(242,103,63)', 
            'rgb(247,144,63)', 
            'rgb(251,173,45)'
        ];
        Settings.thresholdTextColors = [
            'rgb(36,1,56)', 
            'rgb(60,31,86)', 
            'rgb(85,33,85)', 
            'rgb(0,56,100)', 
            'rgb(0,73,48)', 
            'rgb(125,25,33)', 
            'rgb(126,51,0)', 
            'rgb(92,70,14)'
        ];
        Settings.thresholdsDelayTime = 1000;
        Settings.thresholdsAnimationTime = 500;
        Settings.rectangleRadius = 3;
        Settings.axisTextSize = 12;
        Settings.axisTextFont = "Arial";
        Settings.axisStrokeColor = "rgb(221,221,221)";
        Settings.axisHeight = 47;
        Settings.horizontalTextMargin = 20;
        Settings.verticalTextMargin = 15;
        Settings.gapLabelTick = 3;
        Settings.activeMarkSize = 10;
        Settings.minLabelSpace = 50;
        Settings.minTickSpace = 8;
        Settings.minSmallTickSpace = 8;
        Settings.timescaleThickness = 2;
        Settings.markerWidth = 85;
        Settings.panelWidth = 185;
        Settings.cosmosTimelineID = "00000000-0000-0000-0000-000000000000";
        Settings.earthTimelineID = "48fbb8a8-7c5d-49c3-83e1-98939ae2ae67";
        Settings.lifeTimelineID = "d4809be4-3cf9-4ddd-9703-3ca24e4d3a26";
        Settings.prehistoryTimelineID = "a6b821df-2a4d-4f0e-baf5-28e47ecb720b";
        Settings.humanityTimelineID = "4afb5bb6-1544-4416-a949-8c8f473e544d";
        Settings.toursAudioFormats = [
            {
                ext: 'mp3'
            }, 
            {
                ext: 'wav'
            }
        ];
        Settings.tourDefaultTransitionTime = 10;
        Settings.seadragonServiceURL = "http://api.zoom.it/v1/content/?url=";
        Settings.seadragonImagePath = "/images/seadragonControls/";
        Settings.seadragonMaxConnectionAttempts = 3;
        Settings.seadragonRetryInterval = 2000;
        Settings.navigateNextMaxCount = 2;
        Settings.longNavigationLength = 10;
        Settings.serverUrlHost = location.protocol + "//" + location.host;
        Settings.minTimelineWidth = 100;
        Settings.signinUrlMicrosoft = "";
        Settings.signinUrlGoogle = "";
        Settings.signinUrlYahoo = "";
        Settings.sessionTime = 3600;
        Settings.guidEmpty = "00000000-0000-0000-0000-000000000000";
        Settings.ie = ((function () {
            var v = 3, div = document.createElement('div'), a = div.all || [];
            while(div.innerHTML = '<!--[if gt IE ' + (++v) + ']><br><![endif]-->' , a[0]) {
                ;
            }
            return (v > 4) ? v : undefined;
        })());
        Settings.theme;
        function applyTheme(theme) {
            if(!theme) {
                theme = "cosmos";
            }
            this.theme = theme;
            var themeData = {
                "cosmos": {
                    "background": "url('/images/background.jpg')",
                    "backgroundColor": "#232323",
                    "timelineColor": null,
                    "timelineHoverAnimation": 3 / 60.0,
                    "infoDotFillColor": 'rgb(92,92,92)',
                    "fallbackImageUri": '/images/Temp-Thumbnail2.png',
                    "timelineGradientFillStyle": null
                },
                "gray": {
                    "background": "none",
                    "backgroundColor": "#bebebe",
                    "timelineColor": null,
                    "timelineHoverAnimation": 3 / 60.0,
                    "infoDotFillColor": 'rgb(92,92,92)',
                    "fallbackImageUri": '/images/Temp-Thumbnail2.png',
                    "timelineGradientFillStyle": "#9e9e9e"
                },
                "aqua": {
                    "background": "none",
                    "backgroundColor": "rgb(238, 238, 238)",
                    "timelineColor": "rgba(52, 76, 130, 0.5)",
                    "timelineHoverAnimation": 3 / 60.0,
                    "infoDotFillColor": 'rgb(55,84,123)',
                    "fallbackImageUri": '/images/Temp-Thumbnail-Aqua.png',
                    "timelineGradientFillStyle": "rgb(80,123,175)"
                }
            };
            var themeSettings = themeData[theme];
            $('#vc').css('background-image', themeSettings.background);
            $('#vc').css('background-color', themeSettings.backgroundColor);
            CZ.Settings.timelineColor = themeSettings.timelineColor;
            CZ.Settings.timelineHoverAnimation = themeSettings.timelineHoverAnimation;
            CZ.Settings.infoDotFillColor = themeSettings.infoDotFillColor;
            CZ.Settings.fallbackImageUri = themeSettings.fallbackImageUri;
            CZ.Settings.timelineGradientFillStyle = themeSettings.timelineGradientFillStyle;
        }
        Settings.applyTheme = applyTheme;
        Settings.defaultBingSearchTop = 50;
        Settings.defaultBingSearchSkip = 0;
        Settings.mediapickerImageThumbnailMaxWidth = 240;
        Settings.mediapickerImageThumbnailMaxHeight = 155;
        Settings.mediapickerVideoThumbnailMaxWidth = 190;
        Settings.mediapickerVideoThumbnailMaxHeight = 130;
        Settings.WLAPIClientID = "0000000040101FFA";
        Settings.WLAPIRedirectUrl = "http://test.chronozoom.com/";
        Settings.errorMessageSlideDuration = 0;
    })(CZ.Settings || (CZ.Settings = {}));
    var Settings = CZ.Settings;
})(CZ || (CZ = {}));
