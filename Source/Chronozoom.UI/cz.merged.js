/// <reference path='typings/jquery/jquery.d.ts'/>
var CZ;
(function (CZ) {
    (function (Settings) {
        Settings.isAuthorized               = false;
        Settings.userSuperCollectionName    = "";
        Settings.userCollectionName         = "";
        Settings.userDisplayName            = "";
        Settings.collectionOwner            = ""; // owners' display name
        Settings.isCosmosCollection         = false;

        Settings.favoriteTimelines = [];

        Settings.czDataSource = 'db';

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

        // Styles of timelines
        Settings.timelineHeaderMargin = 1.0 / 12.0  // new marger is larger to allow for extra copy/paste buttons - was 1.0 / 18.0.
        Settings.timelineHeaderSize = 1.0 / 9.0;
        Settings.timelineTooltipMaxHeaderSize = 5;
        Settings.timelineHeaderFontName = 'Arial';
        Settings.timelineHeaderFontColor = 'rgb(232,232,232)';
        Settings.timelineHoveredHeaderFontColor = 'white';
        Settings.timelineStrokeStyle = 'rgb(232,232,232)';
        Settings.timelineBorderColor = 'rgb(232,232,232)';
        Settings.timelineLineWidth = 1;
        Settings.timelineHoveredLineWidth = 1;
        Settings.timelineMinAspect = 0.2;
        Settings.timelineContentMargin = 0.01;
        Settings.timelineHoveredBoxBorderColor = 'rgb(232,232,232)';
        Settings.timelineBreadCrumbBorderOffset = 50;
        Settings.timelineCenterOffsetAcceptableImplicity = 0.00001;
        Settings.timelineColor = null;
        Settings.timelineColorOverride = 'rgba(0,0,0,0.25)';
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

        // See also contentItemDescriptionText class in the Styles/cz.css which decorates the description block in a content item
        Settings.contentItemBoundingBoxBorderWidth = 13.0 / 520;
        Settings.contentItemBoundingBoxFillColor = 'rgb(36,36,36)';
        Settings.contentItemBoundingBoxBorderColor = undefined;
        Settings.contentItemBoundingHoveredBoxBorderColor = 'white';

        Settings.contentAppearanceAnimationStep = 0.01;

        //navigation constraints
        Settings.infoDotZoomConstraint = 0.005;
        Settings.infoDotAxisFreezeThreshold = 0.75;
        Settings.maxPermitedTimeRange = { left: -13700000000, right: 0 };
        Settings.deeperZoomConstraints = [
            { left: -14000000000, right: -1000000000, scale: 1000 },
            { left: -1000000000, right: -1000000, scale: 1 },
            { left: -1000000, right: -12000, scale: 0.001 },
            { left: -12000 /*approx 10k BC */ , right: 0, scale: 0.00006 }
        ];

        // Timescale constants
        Settings.maxTickArrangeIterations = 3;
        Settings.spaceBetweenLabels = 15;
        Settings.spaceBetweenSmallTicks = 10;
        Settings.tickLength = 14;
        Settings.smallTickLength = 7;
        Settings.strokeWidth = 3;
        Settings.thresholdHeight = 10;
        Settings.thresholdWidth = 8;
        Settings.thresholdColors = ['rgb(173,71,155)', 'rgb(177,121,180)', 'rgb(220,123,154)', 'rgb(71,168,168)', 'rgb(95,187,71)', 'rgb(242,103,63)', 'rgb(247,144,63)', 'rgb(251,173,45)'];
        Settings.thresholdTextColors = ['rgb(36,1,56)', 'rgb(60,31,86)', 'rgb(85,33,85)', 'rgb(0,56,100)', 'rgb(0,73,48)', 'rgb(125,25,33)', 'rgb(126,51,0)', 'rgb(92,70,14)'];
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

        // IDs of regime timelines
        Settings.cosmosTimelineID = "00000000-0000-0000-0000-000000000000";
        Settings.earthTimelineID = "48fbb8a8-7c5d-49c3-83e1-98939ae2ae67";
        Settings.lifeTimelineID = "d4809be4-3cf9-4ddd-9703-3ca24e4d3a26";
        Settings.prehistoryTimelineID = "a6b821df-2a4d-4f0e-baf5-28e47ecb720b";
        Settings.humanityTimelineID = "4afb5bb6-1544-4416-a949-8c8f473e544d";

        //tours
        Settings.toursAudioFormats = [
            { ext: 'mp3' },
            { ext: 'wav' }
        ];
        Settings.tourDefaultTransitionTime = 10;

        // seadragon
        Settings.seadragonServiceURL = "http://api.zoom.it/v1/content/?url=";
        Settings.seadragonImagePath = "/images/seadragonControls/";
        Settings.seadragonMaxConnectionAttempts = 3;
        Settings.seadragonRetryInterval = 2000;

        // breadcrumb
        Settings.navigateNextMaxCount = 2;
        Settings.longNavigationLength = 10;

        // progresive loading
        Settings.serverUrlHost = location.protocol + "//" + location.host;
        Settings.minTimelineWidth = 100;

        // Login constants
        Settings.signinUrlMicrosoft = "";
        Settings.signinUrlGoogle = "";
        Settings.signinUrlYahoo = "";
        Settings.sessionTime = 3600;

        // General constants
        Settings.guidEmpty = "00000000-0000-0000-0000-000000000000";

        // NOTE: IE version detection.
        //       https://gist.github.com/padolsey/527683
        Settings.ie = (function () {
            var v = 3, div = document.createElement('div'), a = div.all || [];
            while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><br><![endif]-->', a[0])
                ;
            return (v > 4) ? v : undefined;
        }());

        // Theme constants
        Settings.theme;
        function applyTheme(theme, delayLoad) {
            this.theme = {
                "backgroundUrl": delayLoad ? "" : "/images/background.jpg",
                "backgroundColor": "#232323",
                "timelineColor": null,
                "timelineStrokeStyle": "rgb(232,232,232)",
                "infoDotFillColor": 'rgb(92,92,92)',
                "infoDotBorderColor": 'rgb(232,232,232)',
                "kioskMode": false
            };

            if (theme && theme.backgroundUrl != null)
                this.theme.backgroundUrl = theme.backgroundUrl;
            if (theme && theme.kioskMode != null)
                this.theme.kioskMode = theme.kioskMode;
            if (theme && theme.timelineColor != null)
                this.theme.timelineColor = theme.timelineColor;
            if (theme && theme.timelineStrokeStyle != null)
                this.theme.timelineStrokeStyle = theme.timelineStrokeStyle;
            if (theme && theme.infoDotFillColor != null)
                this.theme.infoDotFillColor = theme.infoDotFillColor;
            if (theme && theme.infoDotBorderColor != null)
                this.theme.infoDotBorderColor = theme.infoDotBorderColor;

            var themeSettings = this.theme;
            $('#vc').css('background-image', "url('" + themeSettings.backgroundUrl + "')");
            $('#vc').css('background-color', themeSettings.backgroundColor);

            CZ.Settings.timelineColor = themeSettings.timelineColor;
            CZ.Settings.timelineBorderColor = themeSettings.timelineStrokeStyle;
            CZ.Settings.timelineStrokeStyle = themeSettings.timelineStrokeStyle;

            CZ.Settings.infoDotFillColor = themeSettings.infoDotFillColor;
            CZ.Settings.infoDotBorderColor = themeSettings.infoDotBorderColor;

            CZ.Menus.isHidden = (themeSettings.kioskMode == true);
            CZ.Menus.Refresh();

            if (themeSettings.kioskMode)
            {
                $(".elements-kiosk-hide").hide();
                $(".elements-kiosk-disable").on("click", function (e)
                {
                    e.preventDefault();
                });
                CZ.Settings.infodotBibliographyHeight = 0;
                CZ.Settings.contentItemSourceHeight = 0;
            }
            else
            {
                $('.elements-kiosk-hide').show();
                $(".elements-kiosk-disable").off("click");
                CZ.Settings.infodotBibliographyHeight = 10.0 / 489;
                CZ.Settings.contentItemSourceHeight = 10.0 / 540;
            }
        }
        Settings.applyTheme = applyTheme;

        function getCurrentRootURL() {
            var root = window.location.protocol + '//' + window.location.hostname;
            if (window.location.port != '' && window.location.port != '80' && window.location.port != '443')
                root += ':' + window.location.port;
            return root + '/';
        }
        Settings.getCurrentRootURL = getCurrentRootURL;

        // Bing search API constants
        Settings.defaultBingSearchTop = 50;
        Settings.defaultBingSearchSkip = 0;

        // Authoring mediapicker constants
        Settings.mediapickerImageThumbnailMaxWidth = 240;
        Settings.mediapickerImageThumbnailMaxHeight = 155;

        Settings.mediapickerVideoThumbnailMaxWidth = 190;
        Settings.mediapickerVideoThumbnailMaxHeight = 130;

        // WL API constants - Used for SkyDrive/OneDrive
        // See http://msdn.microsoft.com/en-us/library/dn659751.aspx for how to set up a clientid/url pair
        Settings.WLAPIClientID = constants.onedriveClientId;
        Settings.WLAPIRedirectUrl = getCurrentRootURL();

        Settings.errorMessageSlideDuration = 0;
    })(CZ.Settings || (CZ.Settings = {}));
    var Settings = CZ.Settings;
})(CZ || (CZ = {}));
﻿/// <reference path='settings.ts'/>
/// <reference path='tours.ts'/>
/// <reference path='breadcrumbs.ts'/>
/// <reference path='search.ts'/>
/// <reference path='urlnav.ts'/>
/// <reference path='layout.ts'/>
/// <reference path='timescale.ts'/>
/// <reference path='virtual-canvas.ts'/>
/// <reference path='authoring-ui.ts'/>
/// <reference path='data.ts'/>
/// <reference path='../ui/timeseries-graph-form.ts'/>

var CZ;
(function (CZ) {
    (function (Common) {
        Common.maxPermitedScale;
        Common.maxPermitedVerticalRange = { top: 0, bottom: 10000000 };

        Common.controller;
        Common.isAxisFreezed = true;
        Common.startHash;

        /*
        Array for logging of inners messages and exceptions
        */
        var searchString;
        Common.ax;
        Common.axis;
        Common.vc;
        var visReg;
        Common.cosmosVisible;
        Common.earthVisible;
        Common.lifeVisible;
        Common.prehistoryVisible;
        Common.humanityVisible;
        var content;
        var breadCrumbs;

        var firstTimeWelcomeChecked = true;

        var regimes = [];

        var k = 1000000000;
        Common.setNavigationStringTo;
        Common.hashHandle = true;

        Common.supercollection  = '';
        Common.collection       = '';
        Common.collectionTitle  = '';

        // Initial Content contains the identifier (e.g. ID or Title) of the content that should be loaded initially.
        Common.initialContent = null;

        // Initialize the JQuery UI Widgets
        function initialize() {
            Common.ax = $('#axis');
            Common.axis = new CZ.Timescale(Common.ax);

            CZ.VirtualCanvas.initialize();
            Common.vc = $('#vc');
            Common.vc.virtualCanvas();
        }
        Common.initialize = initialize;

        function isInCosmos(url)
        {
            if (typeof url != 'string') url = window.location.pathname;

            var path    = url.toLowerCase().split('#')[0];
            var matches = ['/', '/chronozoom', '/chronozoom/', '/chronozoom/cosmos', '/chronozoom/cosmos/'];

            return $.inArray(path, matches) > -1;
        }
        Common.isInCosmos = isInCosmos;

        /* Calculates local offset of mouse cursor in specified jQuery element.
        @param jqelement  (JQuery to Dom element) jQuery element to get local offset for.
        @param event   (Mouse event args) mouse event args describing mouse cursor.
        */
        function getXBrowserMouseOrigin(jqelement, event) {
            var offsetX;

            ///if (!event.offsetX)
            offsetX = event.pageX - jqelement[0].offsetLeft;

            //else
            //    offsetX = event.offsetX;
            var offsetY;

            //if (!event.offsetY)
            offsetY = event.pageY - jqelement[0].offsetTop;

            //else
            //    offsetY = event.offsetY;
            return {
                x: offsetX,
                y: offsetY
            };
        }
        Common.getXBrowserMouseOrigin = getXBrowserMouseOrigin;

        function sqr(d) {
            return d * d;
        }
        Common.sqr = sqr;

        // Prevents the event from bubbling.
        // In non IE browsers, use e.stopPropagation() instead.
        // To cancel event bubbling across browsers, you should check for support for e.stopPropagation(), and proceed accordingly:
        function preventbubble(e) {
            if (e && e.stopPropagation)
                e.stopPropagation();
            else
                e.cancelBubble = true;
        }
        Common.preventbubble = preventbubble;

        function toggleOffImage(elemId, ext) {
            if (!ext)
                ext = 'jpg';
            var imageSrc = $("#" + elemId).attr("src");
            var len = imageSrc.length;
            var prefix = imageSrc.substring(0, len - 7);
            if (imageSrc.substring(len - 6, len - 4) == "on") {
                var newSrc = prefix + "_off." + ext;
                $("#" + elemId).attr("src", newSrc);
            }
        }
        Common.toggleOffImage = toggleOffImage;

        function toggleOnImage(elemId, ext) {
            if (!ext)
                ext = 'jpg';
            var imageSrc = $("#" + elemId).attr("src");
            var len = imageSrc.length;
            var prefix = imageSrc.substring(0, len - 7);
            if (imageSrc.substring(len - 6, len - 4) == "ff") {
                var newSrc = prefix + "on." + ext;
                $("#" + elemId).attr("src", newSrc);
            }
        }
        Common.toggleOnImage = toggleOnImage;

        function showFooter() {
            $("#footerBack").show('clip', {}, 'slow');
        }
        Common.showFooter = showFooter;

        /*Animation tooltip parameter*/
        Common.animationTooltipRunning = null;
        Common.tooltipMode = "default";

        function stopAnimationTooltip() {
            if (Common.animationTooltipRunning != null) {
                $('.bubbleInfo').stop();
                $(".bubbleInfo").css("opacity", "0.9");
                $(".bubbleInfo").css("filter", "alpha(opacity=90)");
                $(".bubbleInfo").css("-moz-opacity", "0.9");

                Common.animationTooltipRunning = null;

                //tooltipMode = "default"; //default
                //tooltipIsShown = false;
                $(".bubbleInfo").attr("id", "defaultBox");

                $(".bubbleInfo").hide();
            }
        }
        Common.stopAnimationTooltip = stopAnimationTooltip;

        // Compares 2 visibles. Returns true if they are equal with an allowable imprecision
        function compareVisibles(vis1, vis2) {
            return vis2 != null ? (Math.abs(vis1.centerX - vis2.centerX) < CZ.Settings.allowedVisibileImprecision && Math.abs(vis1.centerY - vis2.centerY) < CZ.Settings.allowedVisibileImprecision && Math.abs(vis1.scale - vis2.scale) < CZ.Settings.allowedVisibileImprecision) : false;
        }
        Common.compareVisibles = compareVisibles;

        /*
        Is called by direct user actions like links, bread crumbs clicking, etc.
        */
        function setVisibleByUserDirectly(visible) {
            CZ.Tours.pauseTourAtAnyAnimation = false;
            if (CZ.Tours.tour != undefined && CZ.Tours.tour.state == "play")
                CZ.Tours.tourPause();
            return setVisible(visible);
        }
        Common.setVisibleByUserDirectly = setVisibleByUserDirectly;

        function setVisible(visible) {
            if (visible) {
                return Common.controller.moveToVisible(visible);
            }
        }
        Common.setVisible = setVisible;

        function updateMarker() {
            Common.axis.setTimeMarker(Common.vc.virtualCanvas("getCursorPosition"), true);
        }
        Common.updateMarker = updateMarker;

        // Retrieves the URL to download the data from
        function loadDataUrl() {
            // The following regexp extracts the pattern dataurl=url from the page hash to enable loading timelines from arbitrary sources.
            var match = /dataurl=([^\/]*)/g.exec(window.location.hash);
            if (match) {
                return unescape(match[1]);
            } else {
                switch (CZ.Settings.czDataSource) {
                    case 'db':
                        return "/api/get";
                    case 'relay':
                        return "ChronozoomRelay";
                    case 'dump':
                        return "/dumps/beta-get.json";
                    default:
                        return null;
                }
            }
        }

        // Reload the data.
        function reloadData() {
            return CZ.Data.getTimelines(null).then(function (response) {
                if (!response) {
                    return;
                }

                var root = Common.vc.virtualCanvas("getLayerContent");
                root.beginEdit();
                CZ.Layout.Merge(response, root);
                root.endEdit(true);
                Common.vc.virtualCanvas("updateViewport");
            });
        }
        Common.reloadData = reloadData;

        //loading the data from the service
        function loadData() {
            return CZ.Data.getTimelines(null).then(function (response) {
                if (!response) {
                    return;
                }

                ProcessContent(response);
                Common.vc.virtualCanvas("updateViewport");

                if (CZ.Common.initialContent) {
                    CZ.Service.getContentPath(CZ.Common.initialContent).then(function (response) {
                        window.location.hash = response;
                    }, function (error) {
                        console.log("Error connecting to service:\n" + error.responseText);
                    });
                }

                CZ.Service.getTours().then(function (response) {
                    CZ.Tours.parseTours(response);
                    CZ.Tours.initializeToursContent();
                }, function (error) {
                    console.log("Error connecting to service:\n" + error.responseText);
                });
            }, function (error) {
                console.log("Error connecting to service:\n" + error.responseText);
            });
        }
        Common.loadData = loadData;

        function ProcessContent(content) {
            var root = Common.vc.virtualCanvas("getLayerContent");
            root.beginEdit();
            CZ.Layout.Merge(content, root);
            root.endEdit(true);

            InitializeRegimes(content);

            if (Common.startHash) {
                visReg = CZ.UrlNav.navStringToVisible(Common.startHash.substring(1), Common.vc);
            }

            if (!visReg && Common.cosmosVisible) {
                window.location.hash = Common.cosmosVisible;
                visReg = CZ.UrlNav.navStringToVisible(Common.cosmosVisible, Common.vc);
            }

            if (visReg) {
                Common.controller.moveToVisible(visReg, true);
                updateAxis(Common.vc, Common.ax);
                var vp = Common.vc.virtualCanvas("getViewport");

                if (Common.startHash && window.location.hash !== Common.startHash) {
                    hashChangeFromOutside = false;
                    window.location.hash = Common.startHash; // synchronizing
                }
            }
        }

        function InitializeRegimes(content) {
            var f = function (timeline) {
                if (!timeline)
                    return null;
                var v = Common.vc.virtualCanvas("findElement", 't' + timeline.id);
                regimes.push(v);
                if (v)
                    v = CZ.UrlNav.vcelementToNavString(v);
                return v;
            };

            var cosmosTimeline = content;
            Common.cosmosVisible = f(cosmosTimeline);
            CZ.UrlNav.navigationAnchor = Common.vc.virtualCanvas("findElement", 't' + cosmosTimeline.id);
            $("#regime-link-cosmos").click(function () {
                var visible = CZ.UrlNav.navStringToVisible(Common.cosmosVisible, Common.vc);
                setVisible(visible);
            });

            var earthTimeline = CZ.Layout.FindChildTimeline(cosmosTimeline, CZ.Settings.earthTimelineID, true);
            if (typeof earthTimeline !== "undefined") {
                Common.earthVisible = f(earthTimeline);
                $("#regime-link-earth").click(function () {
                    var visible = CZ.UrlNav.navStringToVisible(Common.earthVisible, Common.vc);
                    setVisible(visible);
                });

                var lifeTimeline = CZ.Layout.FindChildTimeline(earthTimeline, CZ.Settings.lifeTimelineID, false);
                if (typeof lifeTimeline !== "undefined") {
                    Common.lifeVisible = f(lifeTimeline);
                    $("#regime-link-life").click(function () {
                        var visible = CZ.UrlNav.navStringToVisible(Common.lifeVisible, Common.vc);
                        setVisible(visible);
                    });

                    var prehistoryTimeline = CZ.Layout.FindChildTimeline(lifeTimeline, CZ.Settings.prehistoryTimelineID, false);
                    if (typeof prehistoryTimeline !== "undefined") {
                        Common.prehistoryVisible = f(prehistoryTimeline);
                        $("#regime-link-prehistory").click(function () {
                            var visible = CZ.UrlNav.navStringToVisible(Common.prehistoryVisible, Common.vc);
                            setVisible(visible);
                        });

                        var humanityTimeline = CZ.Layout.FindChildTimeline(prehistoryTimeline, CZ.Settings.humanityTimelineID, true);
                        if (typeof humanityTimeline !== "undefined") {
                            Common.humanityVisible = f(humanityTimeline);
                            $("#regime-link-humanity").click(function () {
                                var visible = CZ.UrlNav.navStringToVisible(Common.humanityVisible, Common.vc);
                                setVisible(visible);
                            });
                        }
                    }
                }
            }

            Common.maxPermitedVerticalRange = {
                top: cosmosTimeline.y,
                bottom: cosmosTimeline.y + cosmosTimeline.height
            };

            // update virtual canvas horizontal borders
            CZ.Settings.maxPermitedTimeRange = {
                left: cosmosTimeline.left,
                right: cosmosTimeline.right
            };
            Common.maxPermitedScale = CZ.UrlNav.navStringToVisible(Common.cosmosVisible, Common.vc).scale * 1.1;
        }

        function updateLayout() {
            CZ.BreadCrumbs.visibleAreaWidth = $(".breadcrumbs-container").width();
            CZ.BreadCrumbs.updateHiddenBreadCrumbs();

            Common.vc.virtualCanvas("updateViewport");

            //ax.axis("updateWidth");
            updateAxis(Common.vc, Common.ax);

            CZ.BreadCrumbs.updateBreadCrumbsLabels();
        }
        Common.updateLayout = updateLayout;

        function updateAxis(vc, ax) {
            var vp = vc.virtualCanvas("getViewport");
            var lt = vp.pointScreenToVirtual(0, 0);
            var rb = vp.pointScreenToVirtual(vp.width, vp.height);
            var newrange = { min: lt.x, max: rb.x };
            Common.axis.update(newrange);
        }
        Common.updateAxis = updateAxis;

        function setCookie(c_name, value, exdays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
            document.cookie = c_name + "=" + c_value;
        }
        Common.setCookie = setCookie;

        function getCookie(c_name) {
            var i, x, y, ARRcookies = document.cookie.split(";");
            for (i = 0; i < ARRcookies.length; i++) {
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
                x = x.replace(/^\s+|\s+$/g, "");
                if (x == c_name) {
                    return unescape(y);
                }
            }
            return null;
        }
        Common.getCookie = getCookie;

        function viewportToViewBox(vp) {
            var w = vp.widthScreenToVirtual(vp.width);
            var h = vp.heightScreenToVirtual(vp.height);
            var x = vp.visible.centerX - w / 2;
            var y = vp.visible.centerY - h / 2;
            return {
                left: x,
                right: x + w,
                top: y,
                bottom: y + h,
                width: w,
                height: h,
                centerX: vp.visible.centerX,
                centerY: vp.visible.centerY,
                scale: vp.visible.scale
            };
        }
        Common.viewportToViewBox = viewportToViewBox;
    })(CZ.Common || (CZ.Common = {}));
    var Common = CZ.Common;
})(CZ || (CZ = {}));
﻿var CZ;
(function (CZ) {
    (function (Viewport) {
        // Creates an instance of VisibleRegion.
        // @param centerX, centerY  (number)     center point of visible rectangle (in virtual coordinates)
        // @param scale             (number)     how many time units in a single screen pixel (time unit/pixel)
        function VisibleRegion2d(centerX, centerY, scale) {
            this.centerX = centerX;
            this.centerY = centerY;
            this.scale = scale;
        }
        Viewport.VisibleRegion2d = VisibleRegion2d;

        // Creates an instance of Viewport2d.
        // @param aspectRatio      (number)    how many h-units are in a single time unit
        // @param width, height    (number)    sizes of the visible region (in screen coordinates)
        // @param visible          (VisibleRegion2d) describes the visible region
        // @remarks Virtual coordinate system is R^2 space, axis X goes to the right, axis Y goes down.
        // Screen coordinate system: origin is the left-top corner of a viewport and X goes to the right, Y goes down.
        // Viewport is a physical window where we render virtual canvas,
        // (width,height) is a size of a viewport window in pixels.
        // Visible describes the same window in the virtual space.
        function Viewport2d(aspectRatio, width, height, visible) {
            this.aspectRatio = aspectRatio;
            this.visible = visible;
            this.width = width;
            this.height = height;

            // Converts pixels in h-units
            // @param wp    (number)    Amount of pixels
            // @returns amount of h-units
            this.widthScreenToVirtual = function (wp) {
                return this.visible.scale * wp;
            };

            // Converts pixels in t-units
            // @param hp    (number)    Amount of pixels
            // @returns amount of t-units
            this.heightScreenToVirtual = function (hp) {
                return this.aspectRatio * this.visible.scale * hp;
            };

            // Converts h-units into pixels
            // @param wv    (number)    Amount of h-units
            // @returns amount of pixels
            this.widthVirtualToScreen = function (wv) {
                return wv / this.visible.scale;
            };

            // Converts t-units into pixels
            // @param hv    (number)    Amount of t-units
            // @returns amount of pixels
            this.heightVirtualToScreen = function (hv) {
                return hv / (this.aspectRatio * this.visible.scale);
            };

            // Converts a vector of a virtual space into screen space.
            // @param vx    (number)    Amount of t-units
            // @param vy    (number)    Amount of h-units
            // @returns     ({x:number, y:number})  vector (in screen pixels)
            this.vectorVirtualToScreen = function (vx, vy) {
                return {
                    x: vx / this.visible.scale,
                    y: vy / (this.aspectRatio * this.visible.scale)
                };
            };

            // Converts a point of a virtual space into screen space.
            // @param px    (number)    Coordinate in t-units
            // @param py    (number)    Coordinate in h-units
            // @returns     ({x:number, y:number})  vector (in screen pixels)
            this.pointVirtualToScreen = function (px, py) {
                return {
                    x: (px - this.visible.centerX) / this.visible.scale + this.width / 2.0,
                    y: (py - this.visible.centerY) / (this.aspectRatio * this.visible.scale) + this.height / 2.0
                };
            };

            // Converts a point of a virtual space into screen space.
            // @param vx    (number)    Coordinate in t-units
            // @param vy    (number)    Coordinate in h-units
            // @returns     ({x:number, y:number})  vector (t-units,h-units)
            this.pointScreenToVirtual = function (px, py) {
                return {
                    x: (px - this.width / 2.0) * this.visible.scale + this.visible.centerX,
                    y: this.visible.centerY - (this.height / 2.0 - py) * (this.aspectRatio * this.visible.scale)
                };
            };

            // Converts a vector of a virtual space into screen space.
            // @param vx    (number)    Amount of t-units
            // @param vy    (number)    Amount of h-units
            // @returns     ({x:number, y:number})  vector (t-units,h-units)
            this.vectorScreenToVirtual = function (px, py) {
                return {
                    x: px * this.visible.scale,
                    y: this.aspectRatio * this.visible.scale * py
                };
            };
        }
        Viewport.Viewport2d = Viewport2d;
    })(CZ.Viewport || (CZ.Viewport = {}));
    var Viewport = CZ.Viewport;
})(CZ || (CZ = {}));
﻿/// <reference path='settings.ts'/>
/// <reference path='viewport.ts'/>
var CZ;
(function (CZ) {
    (function (ViewportAnimation) {
        var globalAnimationID = 1;

        /*the animation of zooming and panning where the animation speed is proportinal to the "distance" to target visible region
        to make animation work one must call setTargetViewport method before requesting any animation frames
        @param startViewport (Viewport2D) The state of the viewport at the begining of the animation
        */
        function PanZoomAnimation(startViewport) {
            this.isForciblyStoped = false;
            this.ID = globalAnimationID++;
            var startVisible = startViewport.visible;

            this.velocity = 0.001; //affects animation speed, is to be overrided by the viewportController according to settings.js file

            this.isActive = true; //are more animation frames needed
            this.type = "PanZoom";

            this.startViewport = new CZ.Viewport.Viewport2d(startViewport.aspectRatio, startViewport.width, startViewport.height, new CZ.Viewport.VisibleRegion2d(startVisible.centerX, startVisible.centerY, startVisible.scale));
            this.estimatedEndViewport; //an estimated state of the viewport at the end of the animation

            //estinmated start and end visible centers in the screen coordinate system of a start viewport
            this.endCenterInSC;
            this.startCenterInSC = this.startViewport.pointVirtualToScreen(startVisible.centerX, startVisible.centerY);

            //previous animation frame is prepared according to current viewport state
            this.previousFrameCenterInSC = this.startCenterInSC;
            this.previousFrameViewport = this.startViewport;
            this.prevFrameTime = new Date();

            //visible center moving direction in the screen coodinate of the start viewport
            this.direction;
            this.pathLeng;

            //updates the target viewport
            //the method sets the previous frame as a start animation frame and do all calculation with a respect of that
            //@param estimatedEndViewport   (Viewport2D)    a new target state of the viewport that must be achieved at the end of the animation
            this.setTargetViewport = function (estimatedEndViewport) {
                this.estimatedEndViewport = estimatedEndViewport;

                var prevVis = this.previousFrameViewport.visible;

                this.startViewport = new CZ.Viewport.Viewport2d(this.previousFrameViewport.aspectRatio, this.previousFrameViewport.width, this.previousFrameViewport.height, new CZ.Viewport.VisibleRegion2d(prevVis.centerX, prevVis.centerY, prevVis.scale)); //previous frame becomes the first one

                //updating all coordinates according to the screen coodinate system of new start Viewport
                this.startCenterInSC = this.startViewport.pointVirtualToScreen(prevVis.centerX, prevVis.centerY);
                this.previousFrameCenterInSC = {
                    x: this.startCenterInSC.x,
                    y: this.startCenterInSC.y
                };
                var estimatedVisible = this.estimatedEndViewport.visible;
                this.endCenterInSC = this.startViewport.pointVirtualToScreen(estimatedVisible.centerX, estimatedVisible.centerY);

                this.direction = {
                    X: this.endCenterInSC.x - this.startCenterInSC.x,
                    Y: this.endCenterInSC.y - this.startCenterInSC.y
                };

                var dirX = this.direction.X;
                var dirY = this.direction.Y;

                this.pathLeng = Math.sqrt(dirX * dirX + dirY * dirY);

                //if the target viewport center is close to the current one setting zero vector as a direction
                if (this.pathLeng < 1e-1) {
                    this.direction.X = this.direction.Y = 0;

                    if (estimatedVisible.scale == prevVis.scale)
                        this.isActive = false;
                } else {
                    this.direction.X /= this.pathLeng; //normalizing rhe direction vector
                    this.direction.Y /= this.pathLeng;
                }
            };

            //returns the viewport visible to be set on the next animation frame
            this.produceNextVisible = function (currentViewport) {
                //determining current state of the viewport
                var currentCenterInSC = this.startViewport.pointVirtualToScreen(currentViewport.visible.centerX, currentViewport.visible.centerY);
                var currScale = currentViewport.visible.scale;

                var startVisible = this.startViewport.visible;

                var curTime = new Date();
                var timeDiff = curTime.getTime() - this.prevFrameTime.getTime();
                var k = this.velocity * timeDiff;

                var dx = this.endCenterInSC.x - this.previousFrameCenterInSC.x;
                var dy = this.endCenterInSC.y - this.previousFrameCenterInSC.y;

                var curDist = Math.max(1.0, Math.sqrt(dx * dx + dy * dy));

                //updating previous frame info. This will be returned as the requested animation frame
                var prevFrameVisible = this.previousFrameViewport.visible;
                var updatedVisible = new CZ.Viewport.VisibleRegion2d(prevFrameVisible.centerX, prevFrameVisible.centerY, prevFrameVisible.scale);
                this.previousFrameCenterInSC.x += curDist * k * this.direction.X;
                this.previousFrameCenterInSC.y += curDist * k * this.direction.Y;
                updatedVisible.scale += (this.estimatedEndViewport.visible.scale - updatedVisible.scale) * k;
                this.prevFrameTime = curTime;

                //calculating distance to the start point of the animation
                dx = this.previousFrameCenterInSC.x - this.startCenterInSC.x;
                dy = this.previousFrameCenterInSC.y - this.startCenterInSC.y;

                var distToStart = Math.sqrt(dx * dx + dy * dy);
                var scaleDistToStart = this.estimatedEndViewport.visible.scale - startVisible.scale;
                var scaleDistCurrent = updatedVisible.scale - startVisible.scale;
                if ((distToStart >= this.pathLeng) || Math.abs(scaleDistCurrent) > Math.abs(scaleDistToStart)) {
                    //we have reach the target visible. stop
                    this.isActive = false;
                    return this.estimatedEndViewport.visible;
                }
                ;

                var virtPoint = this.startViewport.pointScreenToVirtual(this.previousFrameCenterInSC.x, this.previousFrameCenterInSC.y);

                updatedVisible.centerX = virtPoint.x;
                updatedVisible.centerY = virtPoint.y;

                this.previousFrameViewport.visible = updatedVisible;

                return updatedVisible;
            };
        }
        ViewportAnimation.PanZoomAnimation = PanZoomAnimation;

        /* Implements an "optimal" animated zoom/pan path between two view rectangles.
        Based on the paper "Smooth and efficient zooming and panning" by Jarke j. van Wijk and Wim A.A. Nuij
        @param startVisible   (visible2d) a viewport visible region from which the elliptical zoom starts
        @param endVisible     (visible2d) a viewport visible region that will be reached at the end of elliptical zoom animation
        */
        function EllipticalZoom(startVisible, endVisible) {
            this.isForciblyStoped = false;
            this.ID = globalAnimationID++;
            this.type = "EllipticalZoom";
            this.isActive = true;
            this.targetVisible = new CZ.Viewport.VisibleRegion2d(endVisible.centerX, endVisible.centerY, endVisible.scale);
            this.startTime = (new Date()).getTime();

            this.imprecision = 0.0001; // Average imprecision in pathlength when centers of startVisible and endVisible visible regions are the same.

            function cosh(x) {
                return (Math.exp(x) + Math.exp(-x)) / 2;
            }

            function sinh(x) {
                return (Math.exp(x) - Math.exp(-x)) / 2;
            }

            function tanh(x) {
                return sinh(x) / cosh(x);
            }

            //is used in the visible center point coordinates calculation according the article
            // return value changes between [0; this.pathLen]
            //@param s    (number)  changes between [0;this.S]
            this.u = function (s) {
                var val = this.startScale / (this.ro * this.ro) * (this.coshR0 * tanh(this.ro * s + this.r0) - this.sinhR0) + this.u0;

                // due to math imprecision val may not reach its max value which is pathLen
                if (this.uS < this.pathLen) {
                    val = val * this.uSRatio;
                }

                // due to math imprecision calculated value might exceed path length, which is the max value
                return Math.min(val, this.pathLen);
            };

            //calculates the scale of the visible region taking t parameter that indicates the requid position in the transition curve
            //@param t   (number)       changes between [0;1]. 0 coresponds to the beginig of the animatoin. 1 coresponds to the end of the animation
            this.scale = function (t) {
                return this.startScale * cosh(this.r0) / cosh(this.ro * (t * this.S) + this.r0);
            };

            //calculates the "x" component of the visible center point at the requested moment of the animation
            //@param t    (number)      changes between [0;1]. 0 coresponds to the beginig of the animatoin. 1 coresponds to the end of the animation
            this.x = function (t) {
                return startPoint.X + (endPoint.X - startPoint.X) / this.pathLen * this.u(t * this.S);
            };

            //calculates the "y" component of the visible center point at the requested moment of the animation
            //@param t    (number)      changes between [0;1]. 0 coresponds to the beginig of the animatoin. 1 coresponds to the end of the animation
            this.y = function (t) {
                return startPoint.Y + (endPoint.Y - startPoint.Y) / this.pathLen * this.u(t * this.S);
            };

            // Returns the visible region for the animation frame according to the current viewport state
            //param currentViewport (viewport2d) the parameter is ignored in this type of animation. the calculation is performed using only current time
            this.produceNextVisible = function (currentViewport) {
                var curTime = (new Date()).getTime();
                var t;

                if (this.duration > 0)
                    t = Math.min(1.0, (curTime - this.startTime) / this.duration); //projecting current time to the [0;1] interval of the animation parameter
                else
                    t = 1.0;

                // Change t value for accelereation and decceleration effect.
                t = animationEase(t);

                if (t == 1.0) {
                    this.isActive = false;
                }

                return new CZ.Viewport.VisibleRegion2d(this.x(t), this.y(t), this.scale(t));
            };

            var startPoint = {
                X: startVisible.centerX,
                Y: startVisible.centerY
            };

            var startScale = startVisible.scale;

            var endPoint = {
                X: endVisible.centerX,
                Y: endVisible.centerY
            };
            var endScale = endVisible.scale;

            var xDiff = startPoint.X - endPoint.X;
            var yDiff = startPoint.Y - endPoint.Y;
            this.pathLen = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

            var ro = 0.1 * CZ.Settings.ellipticalZoomZoomoutFactor;
            this.ro = ro;
            var u0 = 0;
            this.u0 = u0;
            var u1 = this.pathLen;
            this.startPoint = startPoint;
            this.startScale = startScale;
            this.endPoint = endPoint;
            this.endScale = endScale;

            //Centers of startVisible and endVisible visible regions are not equal.
            if (Math.abs(u0 - u1) > this.imprecision) {
                var uDiff = u0 - u1;
                var b0 = (endScale * endScale - startScale * startScale + Math.pow(ro, 4) * uDiff * uDiff) / (2 * startScale * ro * ro * (-uDiff));
                var b1 = (endScale * endScale - startScale * startScale - Math.pow(ro, 4) * uDiff * uDiff) / (2 * endScale * ro * ro * (-uDiff));

                //calculating parameters for further animation frames calculation
                this.r0 = Math.log(-b0 + Math.sqrt(b0 * b0 + 1));
                if (this.r0 == -Infinity) {
                    this.r0 = -Math.log(2 * b0); //instead approximating with the first element of the teylor series
                }

                this.r1 = Math.log(-b1 + Math.sqrt(b1 * b1 + 1));
                if (this.r1 == -Infinity) {
                    this.r1 = -Math.log(2 * b1);
                }

                this.S = (this.r1 - this.r0) / ro;
                this.duration = CZ.Settings.ellipticalZoomDuration / 300 * this.S; //300 is a number to make animation eye candy. Please adjust ellipticalZoomDuration in settings.js instead of 300 constant here.
            } else {
                var logScaleChange = Math.log(Math.abs(endScale - startScale)) + 10;
                if (logScaleChange < 0)
                    this.isActive = false;

                //This coefficient helps to avoid constant duration value in cases when centers of endVisible and startVisible are the same
                var scaleDiff = 0.5;

                //Avoid divide by zero situations.
                if (endScale !== 0 || startScale !== 0) {
                    //This value is almost the same in all cases, when we click to infodot and then click to main content item and vice versa.
                    scaleDiff = Math.min(endScale, startScale) / Math.max(endScale, startScale);
                }

                //no animation is required, if start and end scales are the same.
                if (scaleDiff === 1) {
                    this.isActive = false;
                }

                this.duration = CZ.Settings.ellipticalZoomDuration * scaleDiff * 0.2;

                this.x = function (s) {
                    return this.startPoint.X;
                };
                this.y = function (s) {
                    return this.startPoint.Y;
                };
                this.scale = function (s) {
                    return this.startScale + (this.endScale - this.startScale) * s;
                };
            }

            // calculate constants for optimization
            this.coshR0 = cosh(this.r0);
            this.sinhR0 = sinh(this.r0);
            this.uS = this.u(this.S); // right boundary value of this.u
            this.uSRatio = this.pathLen / this.uS; // ratio of max value of this.u to its actual right boundary value
        }
        ViewportAnimation.EllipticalZoom = EllipticalZoom;

        //function to make animation EaseInOut. [0,1] -> [0,1]
        //@param t    (number)      changes between [0;1]. 0 coresponds to the beginig of the animatoin. 1 coresponds to the end of the animation
        function animationEase(t) {
            return -2 * t * t * t + 3 * t * t;
        }
        ViewportAnimation.animationEase = animationEase;
    })(CZ.ViewportAnimation || (CZ.ViewportAnimation = {}));
    var ViewportAnimation = CZ.ViewportAnimation;
})(CZ || (CZ = {}));
﻿/// <reference path='settings.ts'/>
/// <reference path='common.ts'/>
var CZ;
(function (CZ) {
    (function (Gestures) {
        //Gesture for performing Pan operation
        //Take horizontal and vertical offset in screen coordinates
        //@param src    Source of gesture stream. ["Mouse", "Touch"]
        function PanGesture(xOffset, yOffset, src) {
            this.Type = "Pan";
            this.Source = src;
            this.xOffset = xOffset;
            this.yOffset = yOffset;
        }

        //Gesture for perfoming Zoom operation
        //Takes zoom origin point in screen coordinates and scale value
        function ZoomGesture(xOrigin, yOrigin, scaleFactor, src) {
            this.Type = "Zoom";
            this.Source = src;
            this.xOrigin = xOrigin;
            this.yOrigin = yOrigin;
            this.scaleFactor = scaleFactor;
        }

        //Gesture for performing Stop of all
        //current transitions and starting to performing new
        function PinGesture(src) {
            this.Type = "Pin";
            this.Source = src;
        }

        /*****************************************
        * Gestures for non touch based devices   *
        * mousedown, mousemove, mouseup          *
        * xbrowserwheel                          *
        ******************************************/
        //Subject that converts input mouse events into Pan gestures
        function createPanSubject(vc) {
            var _doc = $(document);

            var mouseDown = vc.toObservable("mousedown");
            var mouseMove = vc.toObservable("mousemove");
            var mouseUp = _doc.toObservable("mouseup");

            var mouseMoves = mouseMove.Skip(1).Zip(mouseMove, function (left, right) {
                return new PanGesture(left.clientX - right.clientX, left.clientY - right.clientY, "Mouse");
            });

            var stopPanning = mouseUp;

            var mouseDrags = mouseDown.SelectMany(function (md) {
                return mouseMoves.TakeUntil(stopPanning);
            });

            return mouseDrags;
        }

        //Subject that converts input mouse events into Pin gestures
        function createPinSubject(vc) {
            var mouseDown = vc.toObservable("mousedown");

            return mouseDown.Select(function (md) {
                return new PinGesture("Mouse");
            });
        }

        //Subject that converts input mouse events into Zoom gestures
        function createZoomSubject(vc) {
            vc.mousewheel(function (event, delta, deltaX, deltaY) {
                var xevent = $.Event("xbrowserwheel");
                xevent.delta = delta;
                xevent.origin = CZ.Common.getXBrowserMouseOrigin(vc, event);
                vc.trigger(xevent);
            });

            var mouseWheel = vc.toObservable("xbrowserwheel");

            var mouseWheels = mouseWheel.Zip(mouseWheel, function (arg) {
                return new ZoomGesture(arg.origin.x, arg.origin.y, arg.delta > 0 ? 1 / CZ.Settings.zoomLevelFactor : 1 * CZ.Settings.zoomLevelFactor, "Mouse");
            });

            var mousedblclick = vc.toObservable("dblclick");

            var mousedblclicks = mousedblclick.Zip(mousedblclick, function (event) {
                var origin = CZ.Common.getXBrowserMouseOrigin(vc, event);
                return new ZoomGesture(origin.x, origin.y, 1.0 / CZ.Settings.zoomLevelFactor, "Mouse");
            });

            //return mouseWheels.Merge(mousedblclicks); //disabling mouse double clicks, as it causes strange behavior in conjection with elliptical zooming on the clicked item.
            return mouseWheels;
        }

        /*********************************************************
        * Gestures for iPad (or any webkit based touch browser)  *
        * touchstart, touchmove, touchend, touchcancel           *
        * gesturestart, gesturechange, gestureend                *
        **********************************************************/
        //Subject that converts input touch events into Pan gestures
        function createTouchPanSubject(vc) {
            var _doc = $(document);

            var touchStart = vc.toObservable("touchstart");
            var touchMove = vc.toObservable("touchmove");
            var touchEnd = _doc.toObservable("touchend");
            var touchCancel = _doc.toObservable("touchcancel");

            var gestures = touchStart.SelectMany(function (o) {
                return touchMove.TakeUntil(touchEnd.Merge(touchCancel)).Skip(1).Zip(touchMove, function (left, right) {
                    return { "left": left.originalEvent, "right": right.originalEvent };
                }).Where(function (g) {
                    return g.left.scale === g.right.scale;
                }).Select(function (g) {
                    return new PanGesture(g.left.pageX - g.right.pageX, g.left.pageY - g.right.pageY, "Touch");
                });
            });

            return gestures;
        }

        //Subject that converts input touch events into Pin gestures
        function createTouchPinSubject(vc) {
            var touchStart = vc.toObservable("touchstart");

            return touchStart.Select(function (ts) {
                return new PinGesture("Touch");
            });
        }

        //Subject that converts input touch events into Zoom gestures
        function createTouchZoomSubject(vc) {
            var _doc = $(document);

            var gestureStart = vc.toObservable("gesturestart");
            var gestureChange = vc.toObservable("gesturechange");
            var gestureEnd = _doc.toObservable("gestureend");
            var touchCancel = _doc.toObservable("touchcancel");

            var gestures = gestureStart.SelectMany(function (o) {
                return gestureChange.TakeUntil(gestureEnd.Merge(touchCancel)).Skip(1).Zip(gestureChange, function (left, right) {
                    return { "left": left.originalEvent, "right": right.originalEvent };
                }).Where(function (g) {
                    return g.left.scale !== g.right.scale && g.right.scale !== 0;
                }).Select(function (g) {
                    var delta = g.left.scale / g.right.scale;
                    return new ZoomGesture(o.originalEvent.layerX, o.originalEvent.layerY, 1 / delta, "Touch");
                });
            });

            return gestures;
        }

        /**************************************************************
        * Gestures for IE on Win8                                     *
        * MSPointerUp, MSPointerDown                                  *
        * MSGestureStart, MSGestureChange, MSGestureEnd, MSGestureTap *
        ***************************************************************/
        //Subject that converts input touch events (on win8+) into Pan gestures
        function createTouchPanSubjectWin8(vc) {
            var gestureStart = vc.toObservable("MSGestureStart");
            var gestureChange = vc.toObservable("MSGestureChange");
            var gestureEnd = vc.toObservable("MSGestureEnd");

            var gestures = gestureStart.SelectMany(function (o) {
                return gestureChange.TakeUntil(gestureEnd).Skip(1).Zip(gestureChange, function (left, right) {
                    return { "left": left.originalEvent, "right": right.originalEvent };
                }).Where(function (g) {
                    return g.left.scale === g.right.scale && g.left.detail != g.left.MSGESTURE_FLAG_INERTIA && g.right.detail != g.right.MSGESTURE_FLAG_INERTIA;
                }).Select(function (g) {
                    return new PanGesture(g.left.offsetX - g.right.offsetX, g.left.offsetY - g.right.offsetY, "Touch");
                });
            });

            return gestures;
        }

        //Subject that converts input touch events (on win8+) into Pin gestures
        function createTouchPinSubjectWin8(vc) {
            var pointerDown = vc.toObservable("MSPointerDown");

            return pointerDown.Select(function (gt) {
                return new PinGesture("Touch");
            });
        }

        //Subject that converts input touch events (on win8+) into Zoom gestures
        function createTouchZoomSubjectWin8(vc) {
            var gestureStart = vc.toObservable("MSGestureStart");
            var gestureChange = vc.toObservable("MSGestureChange");
            var gestureEnd = vc.toObservable("MSGestureEnd");

            var gestures = gestureStart.SelectMany(function (o) {
                return gestureChange.TakeUntil(gestureEnd).Where(function (g) {
                    return g.originalEvent.scale !== 0 && g.originalEvent.detail != g.originalEvent.MSGESTURE_FLAG_INERTIA;
                }).Select(function (g) {
                    return new ZoomGesture(o.originalEvent.offsetX, o.originalEvent.offsetY, 1 / g.originalEvent.scale, "Touch");
                });
            });

            return gestures;
        }

        var gesturesDictionary = [];
        function addMSGestureSource(dom) {
            gesturesDictionary.forEach(function (child) {
                if (child === dom) {
                    return;
                }
            });

            gesturesDictionary.push(dom);

            dom.addEventListener("MSPointerDown", function (e) {
                if (dom.gesture === undefined) {
                    var newGesture = new MSGesture();
                    newGesture.target = dom;
                    dom.gesture = newGesture;
                }

                dom.gesture.addPointer(e.pointerId);
            }, false);
        }
        ;

        //Creates gestures stream for specified jQuery element
        function getGesturesStream(source) {
            var panController;
            var zoomController;
            var pinController;

            if (window.navigator.msPointerEnabled && window.MSGesture) {
                addMSGestureSource(source[0]);

                // win 8
                panController = createTouchPanSubjectWin8(source);
                var zoomControllerTouch = createTouchZoomSubjectWin8(source);
                var zoomControllerMouse = createZoomSubject(source);
                zoomController = zoomControllerTouch.Merge(zoomControllerMouse);
                pinController = createTouchPinSubjectWin8(source);
            } else if ('ontouchstart' in document.documentElement) {
                // webkit browser
                panController = createTouchPanSubject(source);
                zoomController = createTouchZoomSubject(source);
                pinController = createTouchPinSubject(source);
            } else {
                // no touch support, only mouse events
                panController = createPanSubject(source);
                zoomController = createZoomSubject(source);
                pinController = createPinSubject(source);
            }

            return pinController.Merge(panController.Merge(zoomController));
        }
        Gestures.getGesturesStream = getGesturesStream;

        function getPanPinGesturesStream(source) {
            var panController;
            var pinController;

            if (window.navigator.msPointerEnabled && window.MSGesture) {
                addMSGestureSource(source[0]);

                // win 8
                panController = createTouchPanSubjectWin8(source);
                var zoomControllerTouch = createTouchZoomSubjectWin8(source);
                var zoomControllerMouse = createZoomSubject(source);
                pinController = createTouchPinSubjectWin8(source);
            } else if ('ontouchstart' in document.documentElement) {
                // webkit browser
                panController = createTouchPanSubject(source);
                pinController = createTouchPinSubject(source);
            } else {
                // no touch support, only mouse events
                panController = createPanSubject(source);
                pinController = createPinSubject(source);
            }

            return pinController.Merge(panController.Select(function (el) {
                el.yOffset = 0;
                return el;
            }));
        }
        Gestures.getPanPinGesturesStream = getPanPinGesturesStream;

        //modify the gesture stream to apply the logic of gesture handling by the axis
        function applyAxisBehavior(gestureSequence) {
            return gestureSequence.Where(function (el) {
                return el.Type != "Zoom";
            }).Select(function (el) {
                if (el.Type == "Pan")
                    el.yOffset = 0;
                return el;
            });
        }
        Gestures.applyAxisBehavior = applyAxisBehavior;
    })(CZ.Gestures || (CZ.Gestures = {}));
    var Gestures = CZ.Gestures;
})(CZ || (CZ = {}));
﻿/// <reference path='typings/jqueryui/jqueryui.d.ts'/>
/// <reference path='settings.ts'/>
/// <reference path='common.ts'/>
/// <reference path='viewport.ts'/>
/// <reference path='vccontent.ts'/>
var CZ;
(function (CZ) {
    (function (VirtualCanvas) {
        /*  Defines a Virtual Canvas widget (based on jQuery ui).
        @remarks The widget renders different objects defined in a virtual space within a <div> element.
        The widget allows to update current visible region, i.e. perform panning and zooming.

        Technically, the widget uses a <canvas> element to render most types of objects; some of elements
        can be positioned using CSS on a top of the canvas.
        The widget is split into layers, each layer corresponds to a <div> within a root <div> element.
        Next <div> is rendered on the top of previous one.
        */
        function initialize() {
            $.widget("ui.virtualCanvas", {
                /* Root element of the widget content.
                Element of type CanvasItemsRoot.
                */
                _layersContent: undefined,
                /* Array of jqueries to layer div elements
                (saved to avoid building jqueries every time we need it).
                */
                _layers: [],
                /* Constructs a widget
                */
                _create: function () {
                    var self = this;
                    self.element.addClass("virtualCanvas");
                    var size = self._getClientSize();

                    this.lastEvent = null; // last mouse event

                    this.canvasWidth = null; // width of canvas
                    this.canvasHeight = null; // height of canvas

                    this.requestNewFrame = false; // indicates whether new frame is required or not

                    self.cursorPositionChangedEvent = new $.Event("cursorPositionChanged");
                    self.breadCrumbsChangedEvent = $.Event("breadCrumbsChanged");
                    self.innerZoomConstraintChangedEvent = $.Event("innerZoomConstraintChanged");
                    self.currentlyHoveredInfodot = undefined;
                    self.breadCrumbs = [];
                    self.recentBreadCrumb = { vcElement: { title: "initObject" } };

                    self.cursorPosition = 0.0;

                    // elements that cover top, right, bottom & left space between corresponding root timeline's
                    // border and corresponding canvas edge
                    this.topCloak = $(".root-cloak-top");
                    this.rightCloak = $(".root-cloak-right");
                    this.bottomCloak = $(".root-cloak-bottom");
                    this.leftCloak = $(".root-cloak-left");

                    // indicates whether cloak should be shown or not
                    this.showCloak = false;

                    var layerDivs = self.element.children("div");
                    layerDivs.each(function (index) {
                        // make a layer from (div)
                        $(this).addClass("virtualCanvasLayerDiv unselectable").zIndex(index * 3);

                        // creating canvas element
                        var layerCanvasJq = $("<canvas></canvas>").appendTo($(this)).addClass("virtualCanvasLayerCanvas").zIndex(index * 3 + 1);
                        self._layers.push($(this)); // save jquery for this layer for further use
                    });

                    // creating layers' content root element
                    this._layersContent = new CZ.VCContent.CanvasRootElement(self, undefined, "__root__", -Infinity, -Infinity, Infinity, Infinity);

                    // default visible region
                    this.options.visible = new CZ.Viewport.VisibleRegion2d(0, 0, 1); // ...in virtual coordinates: centerX, centerY, scale.
                    this.updateViewport();

                    // start up the mouse handling
                    self.element.bind('mousemove.' + this.widgetName, function (e) {
                        self.mouseMove(e);
                    });
                    self.element.bind('mousedown.' + this.widgetName, function (e) {
                        switch (e.which) {
                            case 1:
                                self._mouseDown(e); //means that only left click will be interpreted
                                break;
                        }
                    });
                    self.element.bind('mouseup.' + this.widgetName, function (e) {
                        switch (e.which) {
                            case 1:
                                self._mouseUp(e);
                        }
                    });
                    self.element.bind('mouseleave.' + this.widgetName, function (e) {
                        self._mouseLeave(e);
                    });
                },
                /* Destroys a widget
                */
                destroy: function () {
                    this._destroy();
                },
                /* Handles mouse down event within the widget
                */
                _mouseDown: function (e) {
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
                    this.lastClickPosition = {
                        x: origin.x,
                        y: origin.y
                    };

                    //Bug (176751): Infodots/video. Mouseup event handling.
                    //Chrome/Firefox solution
                    $("iframe").css("pointer-events", "none");

                    //IE solution
                    $('#iframe_layer').css("display", "block").css("z-index", "99999");
                },
                /* Handles mouse up event within the widget
                */
                _mouseUp: function (e) {
                    var viewport = this.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                    if (this.lastClickPosition && this.lastClickPosition.x == origin.x && this.lastClickPosition.y == origin.y)
                        this._mouseClick(e);

                    //Bug (176751): Infodots/video. Mouseup event handling.
                    //Chrome/Firefox solution
                    $("iframe").css("pointer-events", "auto");

                    //IE solution
                    $('#iframe_layer').css("display", "none");
                },
                /*
                Handles mouseleave event within the widget
                */
                _mouseLeave: function (e) {
                    // check if any content item or infodot or timeline are highlighted
                    if (this.currentlyHoveredContentItem != null && this.currentlyHoveredContentItem.onmouseleave != null)
                        this.currentlyHoveredContentItem.onmouseleave(e);
                    if (this.currentlyHoveredInfodot != null && this.currentlyHoveredInfodot.onmouseleave != null)
                        this.currentlyHoveredInfodot.onmouseleave(e);
                    if (this.currentlyHoveredTimeline != null && this.currentlyHoveredTimeline.onmouseunhover != null)
                        this.currentlyHoveredTimeline.onmouseunhover(null, e);

                    // hide tooltip now
                    CZ.Common.stopAnimationTooltip();

                    // remove last mouse position from canvas to prevent unexpected highlight of canvas elements
                    this.lastEvent = null;
                },
                /* Mouse click happens when mouse up happens at the same point as previous mouse down.
                Returns true, if the event was handled.
                */
                _mouseClick: function (e) {
                    var viewport = this.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                    // the function handle mouse click an a content item
                    var _mouseClickNode = function (contentItem, pv) {
                        var inside = contentItem.isInside(pv);
                        if (!inside)
                            return false;

                        for (var i = 0; i < contentItem.children.length; i++) {
                            var child = contentItem.children[i];
                            if (_mouseClickNode(child, posv))
                                return true;
                        }

                        // No one has handled the click. We try to handle it here.
                        if (contentItem.reactsOnMouse && contentItem.onmouseclick) {
                            return contentItem.onmouseclick(pv, e);
                        }
                        return false;
                    };

                    // Start handling the event from root element
                    _mouseClickNode(this._layersContent, posv);
                },
                /*
                getter of currentlyHoveredTimeline
                */
                getHoveredTimeline: function () {
                    return this.currentlyHoveredTimeline;
                },
                /*
                getter of currentlyHoveredInfodot
                */
                getHoveredInfodot: function () {
                    return this.currentlyHoveredInfodot;
                },
                /*
                Returns the time value that corresponds to the current cursor position
                */
                getCursorPosition: function () {
                    return this.cursorPosition;
                },
                /*
                Sets the constraines applied by the infordot exploration
                param e     (CanvasInfodot) an infodot that is used to calculate constraints
                */
                _setConstraintsByInfodotHover: function (e) {
                    var val;
                    if (e) {
                        var recentVp = this.getViewport();
                        val = e.outerRad * CZ.Settings.infoDotZoomConstraint / recentVp.width;
                    } else
                        val = undefined;
                    this.RaiseInnerZoomConstraintChanged(val);
                },
                /*
                Fires the event with a new inner zoom constrainted value
                */
                RaiseInnerZoomConstraintChanged: function (e) {
                    this.innerZoomConstraintChangedEvent.zoomValue = e;
                    this.element.trigger(this.innerZoomConstraintChangedEvent);
                },
                /*
                Fires the event of cursor position changed
                */
                RaiseCursorChanged: function () {
                    this.cursorPositionChangedEvent.Time = this.cursorPosition;
                    this.element.trigger(this.cursorPositionChangedEvent);
                },
                /*
                Updates tooltip position
                */
                updateTooltipPosition: function (posv) {
                    var scrPoint = this.viewport.pointVirtualToScreen(posv.x, posv.y);

                    var heigthOffset = 17;

                    var length, height;

                    var obj = null;

                    if (CZ.Common.tooltipMode == 'infodot')
                        obj = this.currentlyHoveredInfodot;
                    else if (CZ.Common.tooltipMode == 'timeline')
                        obj = this.currentlyHoveredTimeline;

                    if (obj == null)
                        return;

                    length = parseInt(scrPoint.x) + obj.panelWidth; // position of right edge of tooltip's panel
                    height = parseInt(scrPoint.y) + obj.panelHeight + heigthOffset; // position of bottom edge of tooltip's panel

                    // tooltip goes beyond right edge of canvas
                    if (length > this.canvasWidth)
                        scrPoint.x = this.canvasWidth - obj.panelWidth;

                    // tooltip goes beyond bottom edge of canvas
                    if (height > this.canvasHeight)
                        scrPoint.y = this.canvasHeight - obj.panelHeight - heigthOffset + 1;

                    // Update tooltip position.
                    $('.bubbleInfo').css({
                        position: "absolute",
                        top: scrPoint.y,
                        left: scrPoint.x
                    });
                },
                /* Handles mouse move event within the widget
                */
                mouseMove: function (e) {
                    var viewport = this.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                    // triggers an event that handles current mouse position
                    if (!this.currentlyHoveredInfodot) {
                        this.cursorPosition = posv.x;
                        this.RaiseCursorChanged();
                    }

                    if (!this.currentlyHoveredTimeline) {
                        this.cursorPosition = posv.x;
                        this.RaiseCursorChanged();
                    }

                    var mouseInStack = [];

                    // the function handle mouse move event
                    var _mouseMoveNode = function (contentItem /*an element to handle mouse move*/ , forceOutside /*if true, we know that pv is outside of the contentItem*/ , pv /*clicked point in virtual coordinates*/ ) {
                        if (forceOutside) {
                            // and if previously mouse was inside content item, we should handle mouse leave:
                            if (contentItem.reactsOnMouse && contentItem.isMouseIn && contentItem.onmouseleave) {
                                contentItem.onmouseleave(pv, e);
                                contentItem.isMouseIn = false;
                            }
                        } else {
                            var inside = contentItem.isInside(pv);
                            forceOutside = !inside; // for further handle of event in children of this content item

                            // We should invoke mousemove, mouseenter, mouseleave handlers
                            if (contentItem.reactsOnMouse) {
                                if (inside) {
                                    if (contentItem.isMouseIn) {
                                        if (contentItem.onmousemove)
                                            contentItem.onmousemove(pv, e);
                                        if (contentItem.onmousehover)
                                            mouseInStack.push(contentItem);
                                    } else {
                                        contentItem.isMouseIn = true;
                                        if (contentItem.onmouseenter)
                                            contentItem.onmouseenter(pv, e);
                                    }
                                } else {
                                    if (contentItem.isMouseIn) {
                                        contentItem.isMouseIn = false;
                                        if (contentItem.onmouseleave)
                                            contentItem.onmouseleave(pv, e);
                                    } else {
                                        if (contentItem.onmousemove)
                                            contentItem.onmousemove(pv, e);
                                    }
                                }
                            }
                            contentItem.isMouseIn = inside; // save that mouse was inside this contentItem
                        }

                        for (var i = 0; i < contentItem.children.length; i++) {
                            var child = contentItem.children[i];
                            if (!forceOutside || child.isMouseIn)
                                _mouseMoveNode(child, forceOutside, pv); // call mouseleave or do nothing within that branch of the tree.
                        }
                    };

                    // Start handling the event from root element
                    _mouseMoveNode(this._layersContent, false, posv);

                    // Notifying the deepest timeline which has mouse hover
                    if (mouseInStack.length == 0) {
                        if (this.hovered && this.hovered.onmouseunhover) {
                            this.hovered.onmouseunhover(posv, e);
                            this.hovered = null;
                        }
                    }
                    for (var n = mouseInStack.length; --n >= 0;) {
                        if (mouseInStack[n].onmousehover) {
                            mouseInStack[n].onmousehover(posv, e);
                            if (this.hovered && this.hovered != mouseInStack[n] && this.hovered.onmouseunhover)
                                // dont unhover timeline if its child infodot is hovered
                                if (!this.currentlyHoveredInfodot || (this.currentlyHoveredInfodot && this.currentlyHoveredInfodot.parent && this.currentlyHoveredInfodot.parent != this.hovered))
                                    this.hovered.onmouseunhover(posv, e);
                            if (this.currentlyHoveredContentItem)
                                this.hovered = this.currentlyHoveredContentItem;
                            else
                                this.hovered = mouseInStack[n];
                            break;
                        }
                    }

                    // update tooltip for currently tooltiped infodot|t if tooltip is enabled for this infodot|timeline
                    if ((this.currentlyHoveredInfodot != null && this.currentlyHoveredInfodot.tooltipEnabled == true) || (this.currentlyHoveredTimeline != null && this.currentlyHoveredTimeline.tooltipEnabled == true && CZ.Common.tooltipMode != "infodot")) {
                        var obj = null;

                        if (CZ.Common.tooltipMode == 'infodot')
                            obj = this.currentlyHoveredInfodot;
                        else if (CZ.Common.tooltipMode == 'timeline')
                            obj = this.currentlyHoveredTimeline;

                        if (obj != null) {
                            // show tooltip if it is not shown yet
                            if (obj.tooltipIsShown == false) {
                                obj.tooltipIsShown = true;
                                CZ.Common.animationTooltipRunning = $('.bubbleInfo').fadeIn();
                            }
                        }

                        // update position of tooltip
                        this.updateTooltipPosition(posv);
                    }

                    // last mouse move event
                    this.lastEvent = e;
                },
                // Returns last mouse move event
                getLastEvent: function () {
                    return this.lastEvent;
                },
                // Returns root of the element tree.
                getLayerContent: function () {
                    return this._layersContent;
                },
                // Recursively finds and returns an element with given id.
                // If not found, returns null.
                findElement: function (id) {
                    var rfind = function (el, id) {
                        if (el.id === id)
                            return el;
                        if (!el.children)
                            return null;
                        var n = el.children.length;
                        for (var i = 0; i < n; i++) {
                            var child = el.children[i];
                            if (child.id === id)
                                return child;
                        }
                        for (var i = 0; i < n; i++) {
                            var child = el.children[i];
                            var res = rfind(child, id);
                            if (res)
                                return res;
                        }
                        return null;
                    };

                    return rfind(this._layersContent, id);
                },
                // Recursively iterates over all elements.
                forEachElement: function (callback) {
                    var rfind = function (el, callback) {
                        callback(el);
                        if (!el.children)
                            return;
                        for (var i = 0; i < el.children.length; i++) {
                            var child = el.children[i];
                            var res = rfind(child, callback);
                        }
                    };

                    return rfind(this._layersContent, callback);
                },
                // Destroys the widget.
                _destroy: function () {
                    this.element.removeClass("virtualCanvas");
                    this.element.children(".virtualCanvasLayerDiv").each(function (index) {
                        $(this).removeClass("virtualCanvasLayerDiv").removeClass("unselectable");
                        $(this).remove(".virtualCanvasLayerCanvas");
                    });
                    this.element.unbind('.' + this.widgetName);
                    this._layers = undefined;
                    this._layersContent = undefined;
                    return this;
                },
                /* Produces {Left,Right,Top,Bottom} object which corresponds to visible region in virtual space, using current viewport.
                */
                _visibleToViewBox: function (visible) {
                    var view = this.getViewport();
                    var w = view.widthScreenToVirtual(view.width);
                    var h = view.heightScreenToVirtual(view.height);
                    var x = visible.centerX - w / 2;
                    var y = visible.centerY - h / 2;
                    return { Left: x, Right: x + w, Top: y, Bottom: y + h };
                },
                /* Updates and renders a visible region in virtual space that corresponds to a physical window.
                @param newVisible   (VisibleRegion2d) New visible region.
                @remarks Rebuilds the current viewport.
                */
                setVisible: function (newVisible, isInAnimation) {
                    delete this.viewport; // invalidating old viewport
                    this.options.visible = newVisible; // setting new visible region
                    this.isInAnimation = isInAnimation && isInAnimation.isActive;

                    //console.log("newvs",newVisible);
                    // rendering canvas (we should update the image because of new visible region)
                    var viewbox_v = this._visibleToViewBox(newVisible);

                    //console.log(viewbox_v);
                    var viewport = this.getViewport();
                    this._renderCanvas(this._layersContent, viewbox_v, viewport);
                },
                /* Update viewport's physical width and height in correspondence with the <div> element.
                @remarks The method should be called when the <div> element, which hosts the virtual canvas, resizes.
                It sets width and height attributes of layers' <div> and <canvas> to width and height of the widget's <div>, and
                then updates visible region and renders the content.
                */
                updateViewport: function () {
                    // updating width and height of layers' <canvas>-es in accordance with actual size of widget's <div>.
                    var size = this._getClientSize();
                    var n = this._layers.length;
                    for (var i = 0; i < n; i++) {
                        var layer = this._layers[i];
                        layer.width(size.width).height(size.height);
                        var canvas = layer.children(".virtualCanvasLayerCanvas").first()[0];
                        if (canvas) {
                            canvas.width = size.width;
                            canvas.height = size.height;
                        }
                    }

                    // update canvas width and height
                    this.canvasWidth = CZ.Common.vc.width();
                    this.canvasHeight = CZ.Common.vc.height();

                    this.setVisible(this.options.visible);
                },
                /* Produces {width, height} object from actual width and height of widget's <div> (in pixels).
                */
                _getClientSize: function () {
                    return {
                        width: this.element[0].clientWidth,
                        height: this.element[0].clientHeight
                    };
                },
                /* Gets current viewport.
                @remarks The widget caches viewport as this.viewport property and rebuilds it only when it is invalidated, i.e. this.viewport=undefined.
                Viewport is currently invalidated by setVisible and updateViewport methods.
                */
                getViewport: function () {
                    if (!this.viewport) {
                        var size = this._getClientSize();
                        var o = this.options;
                        this.viewport = new CZ.Viewport.Viewport2d(o.aspectRatio, size.width, size.height, o.visible);
                    }
                    return this.viewport;
                },
                /* Renders elements tree on all layers' canvases.
                @param elementsRoot     (CanvasItemsRoot) Root of widget's elements tree
                @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in virtual space
                @param viewport         (Viewport2d) current viewport
                @todo                   Possible optimization is to render only actually updated layers.
                */
                _renderCanvas: function (elementsRoot, visibleBox_v, viewport) {
                    var n = this._layers.length;
                    if (n == 0)
                        return;

                    // first we get 2d contexts for each layers' canvas:
                    var contexts = {};
                    for (var i = 0; i < n; i++) {
                        var layer = this._layers[i];
                        var canvas = layer.children(".virtualCanvasLayerCanvas").first()[0];
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, viewport.width, viewport.height);
                        var layerid = layer[0].id;
                        contexts[layerid] = ctx;
                    }

                    // rendering the tree recursively
                    elementsRoot.render(contexts, visibleBox_v, viewport);

                    // update position of cloak for space outside root timeline
                    this.updateCloakPosition(viewport);
                },
                /* Renders the virtual canvas content.
                */
                invalidate: function () {
                    var viewbox_v = this._visibleToViewBox(this.options.visible);
                    var viewport = this.getViewport();

                    this._renderCanvas(this._layersContent, viewbox_v, viewport);
                },
                /*
                Fires the trigger that currently observed (the visible region is inside this timeline) timeline is changed
                */
                breadCrumbsChanged: function () {
                    this.breadCrumbsChangedEvent.breadCrumbs = this.breadCrumbs;
                    this.element.trigger(this.breadCrumbsChangedEvent);
                },
                /* If virtual canvas is during animation now, the method does nothing;
                otherwise, it sets the timeout to invalidate the image.
                */
                requestInvalidate: function () {
                    this.requestNewFrame = false;

                    // update parameters of animating elements and require new frame if needed
                    if (CZ.Layout.animatingElements.length != 0) {
                        for (var id in CZ.Layout.animatingElements)
                            if (CZ.Layout.animatingElements[id].animation && CZ.Layout.animatingElements[id].animation.isAnimating) {
                                CZ.Layout.animatingElements[id].calculateNewFrame();
                                this.requestNewFrame = true;
                            }
                    }

                    if (this.isInAnimation)
                        return;

                    this.isInAnimation = true;
                    var self = this;
                    setTimeout(function () {
                        self.isInAnimation = false;
                        self.invalidate();

                        if (self.requestNewFrame)
                            self.requestInvalidate();
                    }, 1000.0 / CZ.Settings.targetFps); // 1/targetFps sec (targetFps is defined in a settings.js)
                },
                /*
                Finds the LCA(Lowest Common Ancestor) timeline which contains wnd
                */
                _findLca: function (tl, wnd) {
                    for (var i = 0; i < tl.children.length; i++) {
                        if (tl.children[i].type === 'timeline' && tl.children[i].contains(wnd)) {
                            return this._findLca(tl.children[i], wnd);
                        }
                    }
                    return tl;
                },
                findLca: function (wnd) {
                    var cosmosTimeline = this._layersContent.children[0];

                    var eps = 1;
                    var cosmosLeft = cosmosTimeline.x + eps;
                    var cosmosRight = cosmosTimeline.x + cosmosTimeline.width - eps;
                    var cosmosTop = cosmosTimeline.y + eps;
                    var cosmosBottom = cosmosTimeline.y + cosmosTimeline.height - eps;

                    wnd.left = Math.max(cosmosLeft, Math.min(cosmosRight, wnd.x));
                    wnd.right = Math.max(cosmosLeft, Math.min(cosmosRight, wnd.x + wnd.width));
                    wnd.top = Math.max(cosmosTop, Math.min(cosmosBottom, wnd.y));
                    wnd.bottom = Math.max(cosmosTop, Math.min(cosmosBottom, wnd.y + wnd.height));

                    wnd.x = wnd.left;
                    wnd.y = wnd.top;
                    wnd.width = Math.max(0, wnd.right - wnd.left);
                    wnd.height = Math.max(0, wnd.bottom - wnd.top);

                    return this._findLca(cosmosTimeline, wnd);
                },
                /*
                Checks if we have all the data to render wnd at scale
                */
                _inBuffer: function (tl, wnd, scale) {
                    if (tl.intersects(wnd) && tl.isVisibleOnScreen(scale)) {
                        if (!tl.isBuffered) {
                            return false;
                        } else {
                            /*
                            for (var i = 0; i < tl.children.length; i++) {
                            if (tl.children[i].type === 'infodot')
                            if (!tl.children[i].isBuffered)
                            return false;
                            }
                            */
                            var b = true;
                            for (var i = 0; i < tl.children.length; i++) {
                                if (tl.children[i].type === 'timeline')
                                    b = b && this._inBuffer(tl.children[i], wnd, scale);
                            }
                            return b;
                        }
                    }
                    return true;
                },
                inBuffer: function (wnd, scale) {
                    var cosmosTimeline = this._layersContent.children[0];

                    var cosmosLeft = cosmosTimeline.x;
                    var cosmosRight = cosmosTimeline.x + cosmosTimeline.width;
                    var cosmosTop = cosmosTimeline.y;
                    var cosmosBottom = cosmosTimeline.y + cosmosTimeline.height;

                    wnd.left = Math.max(cosmosLeft, Math.min(cosmosRight, wnd.x));
                    wnd.right = Math.max(cosmosLeft, Math.min(cosmosRight, wnd.x + wnd.width));
                    wnd.top = Math.max(cosmosTop, Math.min(cosmosBottom, wnd.y));
                    wnd.bottom = Math.max(cosmosTop, Math.min(cosmosBottom, wnd.y + wnd.height));

                    wnd.x = wnd.left;
                    wnd.y = wnd.top;
                    wnd.width = Math.max(0, wnd.right - wnd.left);
                    wnd.height = Math.max(0, wnd.bottom - wnd.top);

                    return this._inBuffer(cosmosTimeline, wnd, scale);
                },
                options: {
                    aspectRatio: 1,
                    visible: { centerX: 0, centerY: 0, scale: 1 }
                },
                /**
                * Shows top, right, bottom & left cloaks that hide empty space between root timeline's borders and
                * canvas edges.
                */
                cloakNonRootVirtualSpace: function () {
                    this.showCloak = true;
                    var viewport = this.getViewport();

                    this.updateCloakPosition(viewport);

                    this.topCloak.addClass("visible");
                    this.rightCloak.addClass("visible");
                    this.bottomCloak.addClass("visible");
                    this.leftCloak.addClass("visible");
                },
                /**
                * Hides top, right, bottom & left cloaks that hide empty space between root timeline's borders and
                * canvas edges.
                */
                showNonRootVirtualSpace: function () {
                    this.showCloak = false;

                    this.topCloak.removeClass("visible");
                    this.rightCloak.removeClass("visible");
                    this.bottomCloak.removeClass("visible");
                    this.leftCloak.removeClass("visible");
                },
                /**
                * Updates width and height of top, right, bottom & left cloaks that hide empty space between root
                * timeline's borders and canvas edges.
                */
                updateCloakPosition: function (viewport) {
                    if (!this.showCloak)
                        return;

                    var rootTimeline = this._layersContent.children[0];

                    var top = rootTimeline.y;
                    var right = rootTimeline.x + rootTimeline.width;
                    var bottom = rootTimeline.y + rootTimeline.height;
                    var left = rootTimeline.x;

                    // calculate sizes of cloaks
                    top = Math.max(0, viewport.pointVirtualToScreen(0, top).y);
                    right = Math.max(0, viewport.pointVirtualToScreen(right, 0).x);
                    bottom = Math.max(0, viewport.pointVirtualToScreen(0, bottom).y);
                    left = Math.max(0, viewport.pointVirtualToScreen(left, 0).x);

                    // set width of left and right cloaks
                    this.rightCloak.css("width", Math.max(0, viewport.width - right) + "px");
                    this.leftCloak.css("width", left + "px");

                    // set height of top and bottom cloaks
                    this.bottomCloak.css("height", Math.max(0, viewport.height - bottom) + "px");
                    this.topCloak.css("height", top + "px");

                    // prevent intersection of bottom & top cloaks with left & right cloaks
                    this.topCloak.css("left", left + "px");
                    this.topCloak.css("right", Math.max(0, viewport.width - right) + "px");
                    this.bottomCloak.css("left", left + "px");
                    this.bottomCloak.css("right", Math.max(0, viewport.width - right) + "px");
                }
            });
        }
        VirtualCanvas.initialize = initialize;
    })(CZ.VirtualCanvas || (CZ.VirtualCanvas = {}));
    var VirtualCanvas = CZ.VirtualCanvas;
})(CZ || (CZ = {}));
﻿/// <reference path='settings.ts'/>
/// <reference path='common.ts'/>
/// <reference path='bibliography.ts'/>
/// <reference path='urlnav.ts'/>
/// <reference path='cz.ts'/>
/// <reference path='extensions/extensions.ts'/>

var CZ;
(function (CZ) {
    (function (VCContent) {
        var elementclick = $.Event("elementclick");

        function getVisibleForElement(element, scale, viewport, use_margin) {
            var margin = 2 * (CZ.Settings.contentScaleMargin && use_margin ? CZ.Settings.contentScaleMargin : 0);
            var width = viewport.width - margin;
            if (width < 0)
                width = viewport.width;
            var scaleX = scale * element.width / width;

            var height = viewport.height - margin;
            if (height < 0)
                height = viewport.height;
            var scaleY = scale * element.height / height;
            var vs = {
                centerX: element.x + element.width / 2.0,
                centerY: element.y + element.height / 2.0,
                scale: Math.max(scaleX, scaleY)
            };
            return vs;
        }
        VCContent.getVisibleForElement = getVisibleForElement;

        var zoomToElementHandler = function (sender, e, scale /* n [time units] / m [pixels] */ ) {
            var vp = sender.vc.getViewport();
            var visible = getVisibleForElement(sender, scale, vp, true);
            elementclick.newvisible = visible;
            elementclick.element = sender;
            sender.vc.element.trigger(elementclick);
            return true;
        };

        /*  Represents a base element that can be added to the VirtualCanvas.
        @remarks CanvasElement has extension in virtual space, that enables to check visibility of an object and render it.
        @param vc   (jquery to virtual canvas) note that vc.element[0] is the virtual canvas object
        @param layerid   (any type) id of the layer for this object
        @param id   (any type) id of the object
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @remarks
        If element.isRendered defined and true, the element was actually rendered on a canvas.
        If element.onIsRenderedChanged defined, it is called when isRendered changes.
        */
        function CanvasElement(vc, layerid, id, vx, vy, vw, vh) {
            this.vc = vc;
            this.id = id;
            this.layerid = layerid;
            this.x = vx;
            this.y = vy;
            this.newY = vy;
            this.width = vw;
            this.height = vh;
            this.newHeight = vh;

            this.children = [];
            this.fadeIn = false; // indicates whether element has had fade in animation or not

            /* Checks whether this object is visible in the given visible box (in virtual space)
            @param visibleBox_v   ({Left,Top,Right,Bottom}) Visible region in virtual space
            @returns    True, if visible.
            */
            this.isVisible = function (visibleBox_v) {
                var objRight = this.x + this.width;
                var objBottom = this.y + this.height;
                return Math.max(this.x, visibleBox_v.Left) <= Math.min(objRight, visibleBox_v.Right) && Math.max(this.y, visibleBox_v.Top) <= Math.min(objBottom, visibleBox_v.Bottom);
            };

            /* Checks whether the given point (virtual) is inside the object
            (should take into account the shape) */
            this.isInside = function (point_v) {
                return point_v.x >= this.x && point_v.x <= this.x + this.width && point_v.y >= this.y && point_v.y <= this.y + this.height;
            };

            /* Renders a CanvasElement.
            @param ctx              (context2d) Canvas context2d to render on.
            @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
            @param viewport2d       (Viewport2d) current viewport
            @param size_p           ({x,y}) size of bounding box of this element in pixels
            @param opacity          (float in [0,1]) 0 means transparent, 1 means opaque.
            @remarks The method is implemented for each particular VirtualCanvas element.
            */
            this.render = function (ctx, visibleBox_v, viewport2d, size_p, opacity) {
            };
        }
        VCContent.CanvasElement = CanvasElement;

        /* Adds a rectangle as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param settings  ({strokeStyle,lineWidth,fillStyle}) Parameters of the rectangle appearance
        */
        VCContent.addRectangle = function (element, layerid, id, vx, vy, vw, vh, settings) {
            return VCContent.addChild(element, new CanvasRectangle(element.vc, layerid, id, vx, vy, vw, vh, settings), false);
        };

        /* Adds a circle as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id        (any type) id of an element
        @param vxc       (number) center x in virtual space
        @param vyc       (number) center y in virtual space
        @param vradius   (number) radius in virtual space
        @param settings  ({strokeStyle,lineWidth,fillStyle}) Parameters of the circle appearance
        @remarks
        The element is always rendered as a circle and ignores the aspect ratio of the viewport.
        For this, circle radius in pixels is computed from its virtual width.
        */
        VCContent.addCircle = function (element, layerid, id, vxc, vyc, vradius, settings, suppressCheck) {
            return VCContent.addChild(element, new CanvasCircle(element.vc, layerid, id, vxc, vyc, vradius, settings), suppressCheck);
        };

        /* Adds an image as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param z    (number) z-index
        @param imgSrc (string) image URI
        @param onload (optional callback function) called when image is loaded
        @param parent (CanvasElement) Parent element, whose children is to be new element.
        */
        VCContent.addImage = function (element, layerid, id, vx, vy, vw, vh, imgSrc, onload) {
            if (vw <= 0 || vh <= 0)
                throw "Image size must be positive";
            return VCContent.addChild(element, new CanvasImage(element.vc, layerid, id, imgSrc, vx, vy, vw, vh, onload), false);
        };
        VCContent.addLodImage = function (element, layerid, id, vx, vy, vw, vh, imgSources, onload) {
            if (vw <= 0 || vh <= 0)
                throw "Image size must be positive";
            return VCContent.addChild(element, new CanvasLODImage(element.vc, layerid, id, imgSources, vx, vy, vw, vh, onload), false);
        };
        VCContent.addSeadragonImage = function (element, layerid, id, vx, vy, vw, vh, z, imgSrc, onload) {
            if (vw <= 0 || vh <= 0)
                throw "Image size must be positive";
            return VCContent.addChild(element, new SeadragonImage(element.vc, element, layerid, id, imgSrc, vx, vy, vw, vh, z, onload), false);
        };

        VCContent.addExtension = function (extensionName, element, layerid, id, vx, vy, vw, vh, z, imgSrc, onload) {
            if (vw <= 0 || vh <= 0)
                throw "Extension size must be positive";
            var initializer = CZ.Extensions.getInitializer(extensionName);

            return VCContent.addChild(element, initializer(element.vc, element, layerid, id, imgSrc, vx, vy, vw, vh, z, onload), false);
        };

        /* Adds a video as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param videoSource (string) video URI
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param z (number) z-index
        */
        VCContent.addVideo = function (element, layerid, id, videoSource, vx, vy, vw, vh, z) {
            return VCContent.addChild(element, new CanvasVideoItem(element.vc, layerid, id, videoSource, vx, vy, vw, vh, z), false);
        };

        /* Adds a pdf as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param pdfSource (string) pdf URI
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param z (number) z-index
        */
        VCContent.addPdf = function (element, layerid, id, pdfSource, vx, vy, vw, vh, z) {
            return VCContent.addChild(element, new CanvasPdfItem(element.vc, layerid, id, pdfSource, vx, vy, vw, vh, z), false);
        };

        /* Adds an audio as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param audioSource (string) audio URI
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param z (number) z-index
        */
        var addAudio = function (element, layerid, id, audioSource, vx, vy, vw, vh, z) {
            return VCContent.addChild(element, new CanvasAudioItem(element.vc, layerid, id, audioSource, vx, vy, vw, vh, z), false);
        };

        /* Adds a embed skydrive document as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param embedSource (string) embed document code
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param z (number) z-index
        */
        VCContent.addSkydriveDocument = function (element, layerid, id, embededSource, vx, vy, vw, vh, z) {
            return VCContent.addChild(element, new CanvasSkydriveDocumentItem(element.vc, layerid, id, embededSource, vx, vy, vw, vh, z), false);
        };

        /* Adds a embed OneDrive image as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param embedSource (string) embed image code. pattern: {url} {width} {height}
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param z (number) z-index
        */
        VCContent.addSkydriveImage = function (element, layerid, id, embededSource, vx, vy, vw, vh, z) {
            if (embededSource.indexOf('https://onedrive.live.com/download?resid=') === 0)
            {
                // OneDrive image is not actually embedded but is a direct download link so treat as a normal image
                return VCContent.addImage(element, layerid, id, vx, vy, vw, vh, embededSource, null);
            }
            else
            {
                // OneDrive image is embedded in a OneDrive page
                return VCContent.addChild(element, new CanvasSkydriveImageItem(element.vc, layerid, id, embededSource, vx, vy, vw, vh, z), false);
            }
        };

        /*  Adds a text element as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param baseline (number) y coordinate of the baseline in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param settings     ({ fillStyle, fontName }) Parameters of the text appearance
        @param vw (number) optional width of the text; if undefined, it is automatically asigned to width of the given text line.
        @remarks
        Text width is adjusted using measureText() on first render call.
        */
        function addText(element, layerid, id, vx, vy, baseline, vh, text, settings, vw) {
            return VCContent.addChild(element, new CanvasText(element.vc, layerid, id, vx, vy, baseline, vh, text, settings, vw), false);
        }
        VCContent.addText = addText;
        ;

        function addScrollText(element, layerid, id, vx, vy, vw, vh, text, z, settings) {
            return VCContent.addChild(element, new CanvasScrollTextItem(element.vc, layerid, id, vx, vy, vw, vh, text, z), false);
        }
        VCContent.addScrollText = addScrollText;
        ;

        /*  Adds a multiline text element as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vh   (number) height of a text
        @param lineWidth (number) width of a line to text output
        @param settings     ({ fillStyle, fontName }) Parameters of the text appearance
        @remarks
        Text width is adjusted using measureText() on first render call.
        */
        function addMultiLineText(element, layerid, id, vx, vy, baseline, vh, text, lineWidth, settings) {
            return VCContent.addChild(element, new CanvasMultiLineTextItem(element.vc, layerid, id, vx, vy, vh, text, lineWidth, settings), false);
        }
        VCContent.addMultiLineText = addMultiLineText;
        ;

        function turnIsRenderedOff(element) {
            element.isRendered = false;
            if (element.onIsRenderedChanged)
                element.onIsRenderedChanged();
            var n = element.children.length;
            for (; --n >= 0;) {
                if (element.children[n].isRendered)
                    turnIsRenderedOff(element.children[n]);
            }
        }

        /* Renders a CanvasElement recursively
        @param element          (CanvasElement) element to render
        @param contexts         (map<layerid,context2d>) Contexts for layers' canvases.
        @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
        @param viewport2d       (Viewport2d) current viewport
        @param opacity          (float in [0,1]) 0 means transparent, 1 means opaque.
        */
        VCContent.render = function (element, contexts, visibleBox_v, viewport2d, opacity) {
            if (!element.isVisible(visibleBox_v)) {
                if (element.isRendered)
                    turnIsRenderedOff(element);
                return;
            }

            var sz = viewport2d.vectorVirtualToScreen(element.width, element.height);
            if (sz.y <= CZ.Settings.renderThreshold || (element.width != 0 && sz.x <= CZ.Settings.renderThreshold)) {
                if (element.isRendered)
                    turnIsRenderedOff(element);
                return;
            }

            var ctx = contexts[element.layerid];
            if (element.opacity != null) {
                opacity *= element.opacity;
            }

            // Rendering an element
            if (element.isRendered == undefined || !element.isRendered) {
                element.isRendered = true;
                if (element.onIsRenderedChanged)
                    element.onIsRenderedChanged();
            }

            element.render(ctx, visibleBox_v, viewport2d, sz, opacity);

            var children = element.children;
            var n = children.length;
            for (var i = 0; i < n; i++) {
                VCContent.render(children[i], contexts, visibleBox_v, viewport2d, opacity);
            }
        };

        /* Adds a CanvasElement instance to the children array of this element.
        @param  element     (CanvasElement) new child of this element
        @returns    the added element
        @remarks    Bounding box of element must be included in bounding box of the this element. Otherwise, throws an exception.
        The method must be called within the BeginEdit/EndEdit of the root item.
        */
        VCContent.addChild = function (parent, element, suppresCheck) {
            var isWithin = parent.width == Infinity || (element.x >= parent.x && element.x + element.width <= parent.x + parent.width) && (element.y >= parent.y && element.y + element.height <= parent.y + parent.height);

            // if (!isWithin)
            //     console.log("Child element does not belong to the parent element " + parent.id + " " + element.ID);
            //if (!suppresCheck && !isWithin) throw "Child element does not belong to the parent element";
            parent.children.push(element);
            element.parent = parent;
            return element;
        };

        /* Looks up an element with given id in the children of this element and removes it with its children.
        @param id   (any) id of an element
        @returns    true, if element found and removed; otherwise, false.
        @remarks    The method must be called within the BeginEdit/EndEdit of the root item.
        If a child has onRemove() method, it is called right after removing of the child and clearing of all its children (recursively).
        */
        VCContent.removeChild = function (parent, id) {
            var n = parent.children.length;
            for (var i = 0; i < n; i++) {
                var child = parent.children[i];
                if (child.id == id) {
                    // remove element from hash map of animating elements in dynamic layout animation
                    if (typeof CZ.Layout.animatingElements[child.id] !== 'undefined') {
                        delete CZ.Layout.animatingElements[child.id];
                        CZ.Layout.animatingElements.length--;
                    }

                    parent.children.splice(i, 1);
                    clear(child);
                    if (child.onRemove)
                        child.onRemove();
                    child.parent = null;
                    return true;
                }
            }
            return false;
        };

        var removeTimeline = function (timeline) {
            var n = timeline.children.length;
            console.log(n);
            for (var i = 0; i < n; i++) {
                var child = timeline.children[i];

                //clear(timeline);
                if (timeline.onRemove)
                    timeline.onRemove();

                //child.parent = null;
                child.parent = timeline.parent;
            }
        };

        /* Removes all children elements of this object (recursively).
        @remarks    The method must be called within the BeginEdit/EndEdit of the root item.
        For each descendant element that has onRemove() method, the method is called right after its removing and clearing of all its children (recursively).
        */
        function clear(element) {
            var n = element.children.length;
            for (var i = 0; i < n; i++) {
                var child = element.children[i];

                // remove element from hash map of animating elements in dynamic layout animation
                if (typeof CZ.Layout.animatingElements[child.id] !== 'undefined') {
                    delete CZ.Layout.animatingElements[child.id];
                    CZ.Layout.animatingElements.length--;
                }

                clear(child);
                if (child.onRemove)
                    child.onRemove();
                child.parent = null;
            }
            element.children = [];
        }
        VCContent.clear = clear;
        ;

        /* Finds and returns a child element with given id (no recursion)
        @param id   (any) id of a child element
        @returns    The children object (derived from CanvasContentItem)
        @exception  if there is no child with the id
        */
        function getChild(element, id) {
            var n = element.children.length;
            for (var i = 0; i < n; i++) {
                if (element.children[i].id == id)
                    return element.children[i];
            }
            throw "There is no child with id [" + id + "]";
        }
        VCContent.getChild = getChild;
        ;

        /*****************************************************************************************/
        /* Root element                                                                          */
        /*  A root of an element tree of a VirtualCanvas.
        @param vc   (VirtualCanvas) A virtual canvas that own this element tree.
        @param layerid   (any type) id of the layer for this object
        @param id   (any type) id of the object
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        */
        function CanvasRootElement(vc, layerid, id, vx, vy, vw, vh) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, vw, vh);
            this.opacity = 0;

            /* Overrides base function. Root element is visible when it has at least one child. */
            this.isVisible = function (visibleBox_v) {
                return this.children.length != 0;
            };

            /* Begins editing of the element tree.
            @returns This element.
            @remarks Call BeginEdit prior to modify an element tree. The EndEdit method must be called, when editing is to be completed.
            The VirtualCanvas is invalidated on EndEdit only.
            */
            this.beginEdit = function () {
                return this;
            };

            /* Ends editing of the element tree.
            @param dontRender   (number) if zero (default value), invalidates and renders the virtual canvas content.
            @returns This element.
            @remarks Call BeginEdit prior to modify an element tree. The EndEdit method must be called, when editing is to be completed.
            The VirtualCanvas is invalidated on EndEdit only, if dontRender is false.
            */
            this.endEdit = function (dontRender) {
                if (!dontRender)
                    this.vc.invalidate();
            };

            /* Checks whether the given point (virtual) is inside the object
            (should take into account the shape) */
            this.isInside = function (point_v) {
                return true;
            };

            /* Renders a CanvasElement recursively
            @param contexts         (map<layerid,context2d>) Contexts for layers' canvases.
            @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
            @param viewport2d       (Viewport2d) current viewport
            */
            this.render = function (contexts, visibleBox_v, viewport2d) {
                this.vc.breadCrumbs = [];
                if (!this.isVisible(visibleBox_v))
                    return;
                var n = this.children.length;
                for (var i = 0; i < n; i++) {
                    VCContent.render(this.children[i], contexts, visibleBox_v, viewport2d, 1.0);
                }

                if (this.vc.breadCrumbs.length > 0 && (this.vc.recentBreadCrumb == undefined || this.vc.breadCrumbs[vc.breadCrumbs.length - 1].vcElement.id != this.vc.recentBreadCrumb.vcElement.id)) {
                    this.vc.recentBreadCrumb = this.vc.breadCrumbs[vc.breadCrumbs.length - 1];
                    this.vc.breadCrumbsChanged();
                } else {
                    if (this.vc.breadCrumbs.length == 0 && this.vc.recentBreadCrumb != undefined) {
                        this.vc.recentBreadCrumb = undefined;
                        this.vc.breadCrumbsChanged();
                    }
                }
            };

            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, vw, vh);
        }
        VCContent.CanvasRootElement = CanvasRootElement;

        /*****************************************************************************************/
        /* Dynamic Level of Details element                                                      */
        /* Gets the zoom level for the given size of an element (in pixels).
        @param size_p           ({x,y}) size of bounding box of this element in pixels
        @returns (number)   zoom level which minimum natural number or zero zl so that max(size_p.x,size_p.y) <= 2^zl
        */
        function getZoomLevel(size_p) {
            var sz = Math.max(size_p.x, size_p.y);
            if (sz <= 1)
                return 0;
            var zl = (sz & 1) ? 1 : 0;
            for (var i = 1; i < 32; i++) {
                sz = sz >>> 1;
                if (sz & 1) {
                    if (zl > 0)
                        zl = i + 1;
                    else
                        zl = i;
                }
            }
            return zl;
        }

        /* A base class for elements those support different content for different zoom levels.
        @remarks
        Property "removeWhenInvisible" is optional. If set, the content is completely removed every time when isRendered changes from true to false.
        */
        function CanvasDynamicLOD(vc, layerid, id, vx, vy, vw, vh) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, vw, vh);
            this.zoomLevel = 0;
            this.prevContent = null;
            this.newContent = null;
            this.asyncContent = null;
            this.lastRenderTime = 0;

            var self = this;

            /* Returns new content elements tree for the given zoom level, if it should change, or null.
            @returns { zoomLevel: number, content: CanvasElement}, or null.
            */
            this.changeZoomLevel = function (currentZoomLevel, newZoomLevel) {
                return null;
            };

            var startTransition = function (newContent) {
                self.lastRenderTime = new Date();

                self.prevContent = self.content;
                self.content = newContent.content;
                VCContent.addChild(self, self.content, false);

                if (self.prevContent) {
                    if (!self.prevContent.opacity)
                        self.prevContent.opacity = 1.0;
                    self.content.opacity = 0.0;
                }
                self.zoomLevel = newContent.zoomLevel;
            };

            var onAsyncContentLoaded = function () {
                if (self.asyncContent) {
                    startTransition(self.asyncContent);
                    self.asyncContent = null;
                    delete this.onLoad;
                    self.vc.requestInvalidate();
                }
            };

            /* Renders a rectangle.
            @param ctx              (context2d) Canvas context2d to render on.
            @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
            @param viewport2d       (Viewport2d) current viewport
            @param size_p           ({x,y}) size of bounding box of this element in pixels
            @remarks The method is implemented for each particular VirtualCanvas element.
            */
            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                if (this.asyncContent)
                    return;
                if (!this.prevContent) {
                    var newZoomLevel = getZoomLevel(size_p);
                    if (this.zoomLevel != newZoomLevel) {
                        var newContent = this.changeZoomLevel(this.zoomLevel, newZoomLevel);
                        if (newContent) {
                            if (newContent.content.isLoading) {
                                this.asyncContent = newContent;
                                newContent.content.onLoad = onAsyncContentLoaded;
                            } else {
                                startTransition(newContent);
                            }
                        }
                    }
                }
                if (this.prevContent) {
                    var renderTime = new Date();
                    var renderTimeDiff = renderTime.getTime() - self.lastRenderTime;
                    self.lastRenderTime = renderTime.getTime();

                    // Override the default contentAppearanceAnimationStep,
                    // instead of being a constant it now depends on the time,
                    // such that each transition animation takes about 1.6 sec.
                    var contentAppearanceAnimationStep = renderTimeDiff / 1600;

                    var doInvalidate = false;
                    var lopacity = this.prevContent.opacity;
                    lopacity = Math.max(0.0, lopacity - contentAppearanceAnimationStep);
                    if (lopacity != this.prevContent.opacity)
                        doInvalidate = true;
                    if (lopacity == 0) {
                        VCContent.removeChild(this, this.prevContent.id);
                        this.prevContent = null;
                    } else {
                        this.prevContent.opacity = lopacity;
                    }

                    lopacity = this.content.opacity;
                    lopacity = Math.min(1.0, lopacity + contentAppearanceAnimationStep);
                    if (!doInvalidate && lopacity != this.content.opacity)
                        doInvalidate = true;
                    this.content.opacity = lopacity;

                    if (doInvalidate)
                        this.vc.requestInvalidate();
                }
            };

            this.onIsRenderedChanged = function () {
                if (typeof this.removeWhenInvisible === 'undefined' || !this.removeWhenInvisible)
                    return;
                if (!this.isRendered) {
                    if (this.asyncContent) {
                        this.asyncContent = null;
                    }
                    if (this.prevContent) {
                        VCContent.removeChild(this, this.prevContent.id);
                        this.prevContent = null;
                    }
                    if (this.newContent) {
                        VCContent.removeChild(this, this.newContent.id);
                        this.newContent.content.onLoad = null;
                        this.newContent = null;
                    }
                    if (this.content) {
                        VCContent.removeChild(this, this.content.id);
                        this.content = null;
                    }

                    /* Set hasContentItems to false for parent infodot.
                    if (this.parent.hasContentItems != null || this.parent.hasContentItems)
                    this.parent.hasContentItems = false; */
                    this.zoomLevel = 0;
                }
            };
            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, vw, vh);
        }

        /*****************************************************************************************/
        /* Primitive elements                                                                    */
        /*  An element which doesn't have visual representation, but can contain other elements.
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        */
        function ContainerElement(vc, layerid, id, vx, vy, vw, vh) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, vw, vh);

            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
            };

            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, vw, vh);
        }

        /*  A rectangle element that can be added to a VirtualCanvas.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param settings  ({strokeStyle,lineWidth,fillStyle,outline:boolean}) Parameters of the rectangle appearance
        */
        function CanvasRectangle(vc, layerid, id, vx, vy, vw, vh, settings) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, vw, vh);
            this.settings = settings;
            this.type = "rectangle";

            /* Renders a rectangle.
            @param ctx              (context2d) Canvas context2d to render on.
            @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
            @param viewport2d       (Viewport2d) current viewport
            @param size_p           ({x,y}) size of bounding box of this element in pixels
            @remarks The method is implemented for each particular VirtualCanvas element.
            */
            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                var p = viewport2d.pointVirtualToScreen(this.x, this.y);
                var p2 = viewport2d.pointVirtualToScreen(this.x + this.width, this.y + this.height);
                var left = Math.max(0, p.x);
                var top = Math.max(0, p.y);
                var right = Math.min(viewport2d.width, p2.x);
                var bottom = Math.min(viewport2d.height, p2.y);
                if (left < right && top < bottom) {
                    if (this.settings.fillStyle) {
                        var opacity1 = this.settings.gradientOpacity ? opacity * (1 - this.settings.gradientOpacity) : opacity;
                        ctx.globalAlpha = opacity1;
                        ctx.fillStyle = this.settings.fillStyle;
                        ctx.fillRect(left, top, right - left, bottom - top);

                        if (this.settings.gradientOpacity && this.settings.gradientFillStyle) {
                            var lineargradient = ctx.createLinearGradient(left, bottom, right, top);
                            var transparent = "rgba(0, 0, 0, 0)";
                            lineargradient.addColorStop(0, this.settings.gradientFillStyle);
                            lineargradient.addColorStop(1, transparent);

                            ctx.globalAlpha = opacity * this.settings.gradientOpacity;
                            ctx.fillStyle = lineargradient;
                            ctx.fillRect(left, top, right - left, bottom - top);
                        }
                    }

                    ctx.globalAlpha = opacity;
                    if (this.settings.strokeStyle) {
                        ctx.strokeStyle = this.settings.strokeStyle;
                        if (this.settings.lineWidth) {
                            if (this.settings.isLineWidthVirtual) {
                                ctx.lineWidth = viewport2d.widthVirtualToScreen(this.settings.lineWidth);
                            } else {
                                ctx.lineWidth = this.settings.lineWidth; // in pixels
                            }
                        } else
                            ctx.lineWidth = 1;
                        var lineWidth2 = ctx.lineWidth / 2.0;
                        if (this.settings.outline) {
                            p.x += lineWidth2;
                            p.y += lineWidth2;
                            top += lineWidth2;
                            bottom -= lineWidth2;
                            left += lineWidth2;
                            right -= lineWidth2;
                            p2.x -= lineWidth2;
                            p2.y -= lineWidth2;
                        }

                        if (p.x > 0)
                        {
                            if (this.settings.showFromCirca && ctx.setLineDash) ctx.setLineDash([6, 3]);
                            ctx.beginPath();
                            ctx.moveTo(p.x, top - lineWidth2);
                            ctx.lineTo(p.x, bottom + lineWidth2);
                            ctx.stroke();
                            if (ctx.setLineDash) ctx.setLineDash([]);
                        }
                        if (p.y > 0)
                        {
                            ctx.beginPath();
                            ctx.moveTo(left - lineWidth2, p.y);
                            ctx.lineTo(right + lineWidth2, p.y);
                            ctx.stroke();
                        }
                        if (p2.x < viewport2d.width)
                        {
                            if (this.settings.showToCirca  && ctx.setLineDash) ctx.setLineDash([6, 3]);
                            if (this.settings.showInfinite && ctx.setLineDash) ctx.setLineDash([1, 3]);
                            ctx.beginPath();
                            ctx.moveTo(p2.x, top - lineWidth2);
                            ctx.lineTo(p2.x, bottom + lineWidth2);
                            ctx.stroke();
                            if (ctx.setLineDash) ctx.setLineDash([]);
                        }
                        if (p2.y < viewport2d.height)
                        {
                            ctx.beginPath();
                            ctx.moveTo(left - lineWidth2, p2.y);
                            ctx.lineTo(right + lineWidth2, p2.y);
                            ctx.stroke();
                        }
                    }
                }
            };

            this.intersects = function (rect) {
                return !(this.x + this.width < rect.x || this.x > rect.x + rect.width || this.y + this.height < rect.y || this.y > rect.y + rect.height);
            };

            this.contains = function (rect) {
                return (rect.x > this.x && rect.x + rect.width < this.x + this.width && rect.y > this.y && rect.y + rect.height < this.y + this.height);
            };

            this.isVisibleOnScreen = function (scale) {
                return this.width / scale >= CZ.Settings.minTimelineWidth;
            };

            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, vw, vh);
        }
        VCContent.CanvasRectangle = CanvasRectangle;

        /*  A Timeline element that can be added to a VirtualCanvas (Rect + caption + bread crumbs tracing).
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param settings  ({strokeStyle,lineWidth,fillStyle}) Parameters of the rectangle appearance
        */
        function CanvasTimeline(vc, layerid, id, vx, vy, vw, vh, settings, timelineinfo) {
            var self = this;

            this.base = CanvasRectangle;
            this.base(vc, layerid, id, vx, vy, vw, vh);
            this.guid = timelineinfo.guid;
            this.type = 'timeline';

            this.isBuffered = timelineinfo.isBuffered;
            this.settings = settings;
            this.parent = undefined;
            this.currentlyObservedTimelineEvent = vc.currentlyObservedTimelineEvent;
            this.settings.outline = true;
            this.type = 'timeline';

            this.endDate = timelineinfo.endDate;

            this.FromIsCirca = timelineinfo.FromIsCirca || false;
            this.ToIsCirca   = timelineinfo.ToIsCirca   || false;
            this.backgroundUrl = timelineinfo.backgroundUrl || "";
            this.aspectRatio = timelineinfo.aspectRatio || null;

            this.settings.showFromCirca = this.FromIsCirca;
            this.settings.showToCirca   = this.ToIsCirca;
            this.settings.showInfinite = (timelineinfo.endDate == 9999);

            var width = timelineinfo.timeEnd - timelineinfo.timeStart;

            var headerSize = timelineinfo.titleRect ? timelineinfo.titleRect.height : CZ.Settings.timelineHeaderSize * timelineinfo.height;
            var headerWidth = timelineinfo.titleRect && (CZ.Authoring.isEnabled || CZ.Settings.isAuthorized) ? timelineinfo.titleRect.width : 0;
            var marginLeft = timelineinfo.titleRect ? timelineinfo.titleRect.marginLeft : CZ.Settings.timelineHeaderMargin * timelineinfo.height;
            var marginTop = timelineinfo.titleRect ? timelineinfo.titleRect.marginTop : (1 - CZ.Settings.timelineHeaderMargin) * timelineinfo.height - headerSize;
            var baseline = timelineinfo.top + marginTop + headerSize / 2.0;

            this.titleObject = addText(this, layerid, id + "__header__", CZ.Authoring.isEnabled ? timelineinfo.timeStart + marginLeft + headerSize : timelineinfo.timeStart + marginLeft, timelineinfo.top + marginTop, baseline, headerSize, timelineinfo.header, {
                fontName: CZ.Settings.timelineHeaderFontName,
                fillStyle: CZ.Settings.timelineHeaderFontColor,
                textBaseline: 'middle'
            }, headerWidth);

            this.title = this.titleObject.text;
            this.regime = timelineinfo.regime;
            this.settings.gradientOpacity = 0;

            if (CZ.Settings.timelineGradientFillStyle) {
                this.settings.gradientFillStyle = CZ.Settings.timelineGradientFillStyle;
            } else {
                this.settings.gradientFillStyle = timelineinfo.gradientFillStyle || timelineinfo.strokeStyle ? timelineinfo.strokeStyle : CZ.Settings.timelineBorderColor;
            }

            //this.opacity = timelineinfo.opacity;
            this.reactsOnMouse = true;

            this.tooltipEnabled = true; //enable tooltips to timelines
            this.tooltipIsShown = false; // indicates whether tooltip is shown or not

            // Initialize background image for the timeline.
            if (self.backgroundUrl) {
                self.backgroundImg = new BackgroundImage(self.vc, layerid, id + "__background__", self.backgroundUrl, self.x, self.y, self.width, self.height);
                self.settings.gradientOpacity = 0;
                self.settings.fillStyle = undefined;
            }

            this.onmouseclick = function (e) {
                return zoomToElementHandler(this, e, 1.0);
            };
            this.onmousehover = function (pv, e) {
                //previous timeline also hovered and mouse leave don't appear, hide it
                //if infodot is null or undefined, we should stop animation
                //if it's ok, infodot's tooltip don't wink
                if (this.vc.currentlyHoveredTimeline != null && this.vc.currentlyHoveredTimeline.id != id) {
                    try  {
                        this.vc.currentlyHoveredInfodot.id;
                    } catch (ex) {
                        CZ.Common.stopAnimationTooltip();
                        this.vc.currentlyHoveredTimeline.tooltipIsShown = false;
                    }
                }

                //make currentTimeline to this
                this.vc.currentlyHoveredTimeline = this;

                this.settings.strokeStyle = CZ.Settings.timelineHoveredBoxBorderColor;
                this.settings.lineWidth = CZ.Settings.timelineHoveredLineWidth;
                this.titleObject.settings.fillStyle = CZ.Settings.timelineHoveredHeaderFontColor;
                this.settings.hoverAnimationDelta = CZ.Settings.timelineHoverAnimation;
                this.vc.requestInvalidate();

                //if title is not in visible region, try to eval its screenFontSize using
                //formula based on height of its parent timeline
                if (this.titleObject.initialized == false) {
                    var vp = this.vc.getViewport();
                    this.titleObject.screenFontSize = CZ.Settings.timelineHeaderSize * vp.heightVirtualToScreen(this.height);
                }

                //if timeline title is small, show tooltip
                if (this.titleObject.screenFontSize <= CZ.Settings.timelineTooltipMaxHeaderSize)
                    this.tooltipEnabled = true;
                else
                    this.tooltipEnabled = false;

                if (CZ.Common.tooltipMode != "infodot") {
                    CZ.Common.tooltipMode = "timeline";

                    if (this.tooltipEnabled == false) {
                        CZ.Common.stopAnimationTooltip();
                        this.tooltipIsShown = false;
                        return;
                    }

                    // show tooltip if it is enabled and is not shown yet
                    if (this.tooltipIsShown == false) {
                        switch (this.regime) {
                            case "Cosmos":
                                $(".bubbleInfo").attr("id", "cosmosRegimeBox");
                                break;

                            case "Earth":
                                $(".bubbleInfo").attr("id", "earthRegimeBox");
                                break;

                            case "Life":
                                $(".bubbleInfo").attr("id", "lifeRegimeBox");
                                break;

                            case "Pre-history":
                                $(".bubbleInfo").attr("id", "prehistoryRegimeBox");
                                break;

                            case "Humanity":
                                $(".bubbleInfo").attr("id", "humanityRegimeBox");
                                break;
                        }

                        $(".bubbleInfo span").text(this.title);
                        this.panelWidth = $('.bubbleInfo').outerWidth(); // complete width of tooltip panel
                        this.panelHeight = $('.bubbleInfo').outerHeight(); // complete height of tooltip panel

                        this.tooltipIsShown = true;
                        CZ.Common.animationTooltipRunning = $('.bubbleInfo').fadeIn();
                    }
                }
            };
            this.onmouseunhover = function (pv, e) {
                if (this.vc.currentlyHoveredTimeline != null && this.vc.currentlyHoveredTimeline.id == id) {
                    this.vc.currentlyHoveredTimeline = null;

                    if ((this.tooltipIsShown == true) && (CZ.Common.tooltipMode == "timeline")) {
                        CZ.Common.tooltipMode = "default";
                        CZ.Common.stopAnimationTooltip();
                        $(".bubbleInfo").attr("id", "defaultBox");
                        this.tooltipIsShown = false;
                    }
                }

                this.settings.strokeStyle = timelineinfo.strokeStyle ? timelineinfo.strokeStyle : CZ.Settings.timelineBorderColor;
                this.settings.lineWidth = CZ.Settings.timelineLineWidth;
                this.titleObject.settings.fillStyle = CZ.Settings.timelineHeaderFontColor;
                this.settings.hoverAnimationDelta = -CZ.Settings.timelineHoverAnimation;
                ;
                this.vc.requestInvalidate();
            };

            //saving render call before overriding it
            this.base_render = this.render;

            /* Renders a timeline.
            @param ctx              (context2d) Canvas context2d to render on.
            @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
            @param viewport2d       (Viewport2d) current viewport
            @param size_p           ({x,y}) size of bounding box of this element in pixels
            @remarks The method is implemented for each particular VirtualCanvas element.
            */
            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                this.titleObject.initialized = false; //disable CanvasText initialized (rendered) option by default

                if (this.settings.hoverAnimationDelta) {
                    this.settings.gradientOpacity = Math.min(1, Math.max(0, this.settings.gradientOpacity + this.settings.hoverAnimationDelta));
                }

                // Rendering background.
                if (typeof self.backgroundImg !== "undefined") {
                    self.backgroundImg.render(ctx, visibleBox, viewport2d, size_p, 1.0);
                }

                //rendering itself
                self.base_render(ctx, visibleBox, viewport2d, size_p, opacity);

                // positioning of last bottom right timeline button - will render buttons moving from right to left
                var btnX = this.x + this.width - 1.0 * this.titleObject.height;
                var btnY = this.titleObject.y + 0.15 * this.titleObject.height;

                // initialize tweet button - including for anon user
                if (typeof this.tweetBtn === "undefined" && this.titleObject.width !== 0)
                {
                    this.tweetBtn = VCContent.addImage(this, layerid, id + "__tweet", btnX, btnY, 0.7 * this.titleObject.height, 0.7 * this.titleObject.height, "/images/icon_twitter_canvas.svg");
                    this.tweetBtn.reactsOnMouse = true;

                    this.tweetBtn.onmouseclick = function (event)
                    {
                        // see https://dev.twitter.com/web/tweet-button for tweet options and http://to.ly/api_info.php for URL shortener options
                        // please note window.open inside a jQuery .ajax call won't be permittd by pop-up blockers unless the call is synchronous

                        var shortURL        = null;
                        var timelineURL     = '';

                        // build timeline link url
                        iteratePath(this.parent);
                        timelineURL = window.location.origin + window.location.pathname + '#' + timelineURL;

                        // get short version of url since timelines can be very deep
                        shortURL = $.ajax
                        ({
                            async:      false,  // <--  synchronous
                            timeout:    5000,   //      with 5 sec timeout
                            type:       'GET',
                            url:        'http://to.ly/api.php?json=1&longurl=' + encodeURIComponent(timelineURL) + '&callback=?'
                        })
                        .responseText;

                        if (shortURL !== null)
                        {
                            try
                            {
                                shortURL    = JSON.parse(shortURL.slice(2, -1)).shorturl;
                                timelineURL = shortURL;
                            }
                            catch (error) {}
                        }

                        // open new window/tab with tweet info outside of the .ajax call to avoid blockers
                        window.open
                        (
                            'http://twitter.com/share?url=' + encodeURIComponent(timelineURL) +
                                '&hashtags=chronozoom&text=' + encodeURIComponent(this.parent.title + ' - ')
                        );


                        function iteratePath(timeline)
                        {
                            if (timeline.id !== '__root__')
                            {
                                timelineURL = '/' + timeline.id + timelineURL;
                                iteratePath(timeline.parent);
                            }
                        }
                    };

                    this.tweetBtn.onmousehover = function (event)
                    {
                        this.vc.element.css('cursor', 'pointer');
                        this.vc.element.attr('title', 'Share on Twitter');
                    };

                    this.tweetBtn.onmouseunhover = function (event)
                    {
                        this.vc.element.css('cursor', 'default');
                        this.vc.element.attr('title', '');
                    };

                    this.tweetBtn.onRemove = function (event)
                    {
                        this.onmousehover = undefined;
                        this.onmouseunhover = undefined;
                        this.onmouseclick = undefined;
                    };
                }

                // initialize add favorite button if user is logged in
                if (CZ.Settings.isAuthorized === true && typeof this.favoriteBtn === "undefined" && this.titleObject.width !== 0)
                {
                    btnX -= this.titleObject.height;

                    this.favoriteBtn = VCContent.addImage(this, layerid, id + "__favorite", btnX, btnY, 0.7 * this.titleObject.height, 0.7 * this.titleObject.height, "/images/star.svg");
                    this.favoriteBtn.reactsOnMouse = true;

                    this.favoriteBtn.onmouseclick = function (event)
                    {
                        var _this = this;
                        if (CZ.Settings.favoriteTimelines.indexOf(this.parent.guid) !== -1)
                        {
                            CZ.Service.deleteUserFavorite(this.parent.guid).then
                            (
                                function (success)
                                {
                                    CZ.Authoring.showMessageWindow("\"" + _this.parent.title + "\" was removed from your favorite timelines.", "Timeline removed from favorites");
                                },
                                function (error)
                                {
                                    console.log("[ERROR] /deleteUserFavorite with guid " + _this.parent.guid + " failed.");
                                }
                            );
                            CZ.Settings.favoriteTimelines.splice(CZ.Settings.favoriteTimelines.indexOf(this.parent.guid), 1);
                        }
                        else
                        {
                            CZ.Service.putUserFavorite(this.parent.guid).then
                            (
                                function (success)
                                {
                                    CZ.Settings.favoriteTimelines.push(_this.parent.guid);
                                    CZ.Authoring.showMessageWindow("\"" + _this.parent.title + "\" was added to your favorite timelines.", "Favorite timeline added");
                                },
                                function (error)
                                {
                                    console.log("[ERROR] /putUserFavorite with guid + " + _this.parent.guid + " failed.");
                                }
                            );
                        }
                        return true;
                    }

                    this.favoriteBtn.onmousehover = function (event)
                    {
                        this.vc.element.css('cursor', 'pointer');
                        this.vc.element.attr('title', 'Add to or Remove from Favorites');
                        this.parent.settings.strokeStyle = "yellow";
                    }

                    this.favoriteBtn.onmouseunhover = function (event)
                    {
                        this.vc.element.css('cursor', 'default');
                        this.vc.element.attr('title', '');
                        this.parent.settings.strokeStyle = timelineinfo.strokeStyle ? timelineinfo.strokeStyle : CZ.Settings.timelineBorderColor;
                    }

                    this.favoriteBtn.onRemove = function (event)
                    {
                        this.onmousehover   = undefined;
                        this.onmouseunhover = undefined;
                        this.onmouseclick   = undefined;
                    }
                }

                // initialize paste timeline button only if user is authorized
                if (CZ.Authoring.isEnabled === true && typeof this.pasteButton === "undefined" && this.titleObject.width !== 0)
                {
                    btnX -= this.titleObject.height;

                    this.pasteButton = VCContent.addImage(this, layerid, id + "__paste", btnX, btnY, 0.7 * this.titleObject.height, 0.7 * this.titleObject.height, "/images/paste.svg");
                    this.pasteButton.reactsOnMouse = true;

                    this.pasteButton.onmousehover = function (event)
                    {
                        this.vc.element.css('cursor', 'pointer');
                        this.vc.element.attr('title', 'Paste Timeline');
                        this.parent.settings.strokeStyle = "yellow";
                    }

                    this.pasteButton.onmouseunhover = function (event)
                    {
                        this.vc.element.css('cursor', 'default');
                        this.vc.element.attr('title', '');
                        this.parent.settings.strokeStyle = timelineinfo.strokeStyle ? timelineinfo.strokeStyle : CZ.Settings.timelineBorderColor;
                    }

                    this.pasteButton.onmouseclick = function (event)
                    {
                        var newTimeline = localStorage.getItem('ExportedTimeline');

                        if ((localStorage.getItem('ExportedSchemaVersion') == constants.schemaVersion) && newTimeline != null)
                        {
                            // timeline from same db schema version is on "clipboard" so attempt "paste"
                            CZ.Service.importTimelines(this.parent.guid, newTimeline).then(function (importMessage)
                            {
                                CZ.Authoring.showMessageWindow(importMessage);
                            });
                        }
                        else
                        {
                            // unable to paste as nothing suitable is on "clipboard" so inform user
                            CZ.Authoring.showMessageWindow
                            (
                                'Please copy a timeline to your ChronoZoom clip-board first.',
                                'Unable to Paste Timeline'
                            );
                        }
                    }

                    this.pasteButton.onRemove = function (event)
                    {
                        this.onmousehover   = undefined;
                        this.onmouseunhover = undefined;
                        this.onmouseclick   = undefined;
                    }
                }

                // initialize copy timeline button - including for anon user
                if (typeof this.copyButton === "undefined" && this.titleObject.width !== 0)
                {
                    btnX -= this.titleObject.height;

                    this.copyButton = VCContent.addImage(this, layerid, id + "__copy", btnX, btnY, 0.7 * this.titleObject.height, 0.7 * this.titleObject.height, "/images/copy.svg");
                    this.copyButton.reactsOnMouse = true;

                    this.copyButton.onmousehover = function (event)
                    {
                        this.vc.element.css('cursor', 'pointer');
                        this.vc.element.attr('title', 'Copy Timeline');
                        this.parent.settings.strokeStyle = "yellow";
                    }

                    this.copyButton.onmouseunhover = function (event)
                    {
                        this.vc.element.css('cursor', 'default');
                        this.vc.element.attr('title', '');
                        this.parent.settings.strokeStyle = timelineinfo.strokeStyle ? timelineinfo.strokeStyle : CZ.Settings.timelineBorderColor;
                    }

                    this.copyButton.onmouseclick = function (event)
                    {
                        CZ.Service.exportTimelines(this.parent.guid).then(function (exportData)
                        {
                            localStorage.setItem('ExportedSchemaVersion', constants.schemaVersion);
                            localStorage.setItem('ExportedTimeline',      JSON.stringify(exportData));
                            CZ.Authoring.showMessageWindow('"' + exportData[0].timeline.title + '" has been copied to your clip-board. You can paste this into a different timeline.');
                        });
                    }

                    this.copyButton.onRemove = function (event)
                    {
                        this.onmousehover   = undefined;
                        this.onmouseunhover = undefined;
                        this.onmouseclick   = undefined;
                    }
                }

                // initialize edit button if it isn't root collection and titleObject was already initialized
                if (CZ.Authoring.isEnabled && typeof this.editButton === "undefined" && this.titleObject.width !== 0) {
                    this.editButton = VCContent.addImage(this, layerid, id + "__edit", this.x + this.titleObject.height * 0.15, this.titleObject.y, this.titleObject.height, this.titleObject.height, "/images/edit.svg");
                    this.editButton.reactsOnMouse = true;

                    this.editButton.onmouseclick = function () {
                        if (CZ.Common.vc.virtualCanvas("getHoveredInfodot").x == undefined) {
                            CZ.Authoring.isActive = true;
                            CZ.Authoring.mode = "editTimeline";
                            CZ.Authoring.selectedTimeline = this.parent;
                        }
                        return true;
                    };

                    this.editButton.onmousehover = function ()
                    {
                        this.vc.element.css('cursor', 'pointer');
                        this.vc.element.attr('title', 'Edit Timeline');
                        this.parent.settings.strokeStyle = "yellow";
                    };

                    this.editButton.onmouseunhover = function ()
                    {
                        this.vc.element.css('cursor', 'default');
                        this.vc.element.attr('title', '');
                        this.parent.settings.strokeStyle = timelineinfo.strokeStyle ? timelineinfo.strokeStyle : CZ.Settings.timelineBorderColor;
                    };

                    // remove event handlers to prevent their stacking
                    this.editButton.onRemove = function () {
                        this.onmousehover = undefined;
                        this.onmouseunhover = undefined;
                        this.onmouseclick = undefined;
                    };
                }

                if (this.settings.hoverAnimationDelta) {
                    if (this.settings.gradientOpacity == 0 || this.settings.gradientOpacity == 1)
                        this.settings.hoverAnimationDelta = undefined;
                    else
                        this.vc.requestInvalidate();
                }

                var p = viewport2d.pointVirtualToScreen(this.x, this.y);
                var p2 = { x: p.x + size_p.x, y: p.y + size_p.y };

                // is center of canvas inside timeline
                var isCenterInside = viewport2d.visible.centerX - CZ.Settings.timelineCenterOffsetAcceptableImplicity <= this.x + this.width && viewport2d.visible.centerX + CZ.Settings.timelineCenterOffsetAcceptableImplicity >= this.x && viewport2d.visible.centerY - CZ.Settings.timelineCenterOffsetAcceptableImplicity <= this.y + this.height && viewport2d.visible.centerY + CZ.Settings.timelineCenterOffsetAcceptableImplicity >= this.y;

                // is timeline inside "breadcrumb offset box"
                var isVisibleInTheRectangle = ((p.x < CZ.Settings.timelineBreadCrumbBorderOffset && p2.x > viewport2d.width - CZ.Settings.timelineBreadCrumbBorderOffset) || (p.y < CZ.Settings.timelineBreadCrumbBorderOffset && p2.y > viewport2d.height - CZ.Settings.timelineBreadCrumbBorderOffset));

                if (isVisibleInTheRectangle && isCenterInside) {
                    var length = vc.breadCrumbs.length;
                    if (length > 1)
                        if (vc.breadCrumbs[length - 1].vcElement.parent.id == this.parent.id)
                            return;
                    vc.breadCrumbs.push({
                        vcElement: this
                    });
                }
            };

            this.prototype = new CanvasRectangle(vc, layerid, id, vx, vy, vw, vh, settings);
        }

        /*  A circle element that can be added to a VirtualCanvas.
        @param layerid   (any type) id of the layer for this element
        @param id        (any type) id of an element
        @param vxc       (number) center x in virtual space
        @param vyc       (number) center y in virtual space
        @param vradius   (number) radius in virtual space
        @param settings  ({strokeStyle,lineWidth,fillStyle}) Parameters of the circle appearance
        @remarks
        The element is always rendered as a circle and ignores the aspect ratio of the viewport.
        For this, circle radius in pixels is computed from its virtual width.
        */
        function CanvasCircle(vc, layerid, id, vxc, vyc, vradius, settings) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vxc - vradius, vyc - vradius, 2.0 * vradius, 2.0 * vradius);
            this.settings = settings;
            this.isObservedNow = false; //whether the circle is the largest circle under exploration,

            //that takes large enough rendering space according to infoDotAxisFreezeThreshold var in settings.js
            this.type = "circle";

            /* Renders a circle.
            @param ctx              (context2d) Canvas context2d to render on.
            @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
            @param viewport2d       (Viewport2d) current viewport
            @param size_p           ({x,y}) size of bounding box of this element in pixels
            @remarks The method is implemented for each particular VirtualCanvas element.
            */
            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                var rad = this.width / 2.0;
                var xc = this.x + rad;
                var yc = this.y + rad;
                var p = viewport2d.pointVirtualToScreen(xc, yc);
                var radp = viewport2d.widthVirtualToScreen(rad);

                if (this.settings.showCirca && ctx.setLineDash)
                {
                    ctx.setLineDash([6, 3]);
                }

                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, radp, 0, Math.PI * 2, true);

                if (this.settings.strokeStyle) {
                    ctx.strokeStyle = this.settings.strokeStyle;
                    if (this.settings.lineWidth) {
                        if (this.settings.isLineWidthVirtual) {
                            ctx.lineWidth = viewport2d.widthVirtualToScreen(this.settings.lineWidth);
                        } else {
                            ctx.lineWidth = this.settings.lineWidth; // in pixels
                        }
                    } else
                        ctx.lineWidth = 1;
                    ctx.stroke();
                }

                if (this.settings.fillStyle) {
                    ctx.fillStyle = this.settings.fillStyle;
                    ctx.fill();
                }

                if (ctx.setLineDash)
                {
                    ctx.setLineDash([]);
                }
            };

            /* Checks whether the given point (virtual) is inside the object
            (should take into account the shape) */
            this.isInside = function (point_v) {
                var len2 = CZ.Common.sqr(point_v.x - vxc) + CZ.Common.sqr(point_v.y - this.y - this.height / 2);
                return len2 <= vradius * vradius;
            };

            this.prototype = new CanvasElement(vc, layerid, id, vxc - vradius / 2, vyc - vradius / 2, vradius, vradius);
        }

        /*A popup window element
        */
        function addPopupWindow(url, id, width, height, scrollbars, resizable) {
            var w = width;
            var h = height;
            var s = scrollbars;
            var r = resizable;
            var features = 'width=' + w + ',height=' + h + ',scrollbars=' + s + ',resizable=' + r;
            window.open(url, id, features);
        }

        /*
        Draws text by scaling canvas to match fontsize rather than change fontsize.
        This behaviour minimizes text shaking in chrome.
        */
        function drawText(text, ctx, x, y, fontSize, fontName) {
            var br = $.browser;
            var isIe9 = br.msie && parseInt(br.version, 10) >= 9;

            if (isIe9) {
                ctx.font = fontSize + "pt " + fontName;
                ctx.fillText(text, x, y);
            } else {
                var baseFontSize = 12;
                var targetFontSize = fontSize;
                var s = targetFontSize / baseFontSize;

                ctx.scale(s, s);
                ctx.font = baseFontSize + "pt " + fontName;
                ctx.fillText(text, x / s, y / s);
                ctx.scale(1 / s, 1 / s);
            }
        }

        /*  A text element on a virtual canvas.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param baseline (number) y coordinate of the baseline in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param settings     ({ fillStyle, fontName, textAlign, textBaseLine, wrapText, numberOfLines, adjustWidth }) Parameters of the text appearance
        @param vw (number) optional width of the text; if undefined, it is automatically asigned to width of the given text line.
        @remarks
        Text width is adjusted using measureText() on first render call.
        If textAlign is center, then width must be provided.
        */
        function CanvasText(vc, layerid, id, vx, vy, baseline, vh, text, settings, wv) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, wv ? wv : 0, vh); // proper text width will be computed on first render
            this.text = text;
            this.baseline = baseline;
            this.newBaseline = baseline;
            this.settings = settings;
            this.opacity = settings.opacity || 0;
            this.type = "text";

            if (typeof this.settings.textBaseline != 'undefined' && this.settings.textBaseline === 'middle') {
                this.newBaseline = this.newY + this.newHeight / 2;
            }

            this.initialized = false;
            this.screenFontSize = 0; //not initialized

            /* Renders text.
            @param ctx              (context2d) Canvas context2d to render on.
            @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
            @param viewport2d       (Viewport2d) current viewport
            @param size_p           ({x,y}) size of bounding box of this element in pixels
            @remarks The method is implemented for each particular VirtualCanvas element.
            */
            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                var p = viewport2d.pointVirtualToScreen(this.x, this.newY);
                var bp = viewport2d.pointVirtualToScreen(this.x, this.newBaseline).y;

                ctx.globalAlpha = opacity;
                ctx.fillStyle = this.settings.fillStyle;
                var fontSize = size_p.y;
                var k = 1.5;

                if (this.screenFontSize != fontSize)
                    this.screenFontSize = fontSize;

                // initialization
                if (!this.initialized) {
                    if (this.settings.wrapText) {
                        var numberOfLines = this.settings.numberOfLines ? this.settings.numberOfLines : 1;
                        this.settings.numberOfLines = numberOfLines;
                        fontSize = size_p.y / numberOfLines / k;

                        while (true) {
                            ctx.font = fontSize + "pt " + this.settings.fontName; // assign it here to measure text in next lines

                            // Splitting the text into lines
                            var mlines = this.text.split('\n');
                            var textHeight = 0;
                            var lines = [];
                            for (var il = 0; il < mlines.length; il++) {
                                var words = mlines[il].split(' ');
                                var lineWidth = 0;
                                var currentLine = '';
                                var wsize;
                                var space = ctx.measureText(' ').width;
                                for (var iw = 0; iw < words.length; iw++) {
                                    wsize = ctx.measureText(words[iw]);
                                    var newWidth = lineWidth == 0 ? lineWidth + wsize.width : lineWidth + wsize.width + space;
                                    if (newWidth > size_p.x && lineWidth > 0) {
                                        lines.push(currentLine);
                                        lineWidth = 0;
                                        textHeight += fontSize * k;
                                        iw--;
                                        currentLine = '';
                                    } else {
                                        // we're still within the limit
                                        if (currentLine === '')
                                            currentLine = words[iw];
                                        else
                                            currentLine += ' ' + words[iw];
                                        lineWidth = newWidth;
                                    }
                                    var NewWordWidth;
                                    if ((words.length == 1) && (wsize.width > size_p.x)) {
                                        var NewWordWidth = wsize.width;
                                        while (NewWordWidth > size_p.x) {
                                            fontSize /= 1.5;
                                            NewWordWidth /= 1.5;
                                        }
                                    }
                                }
                                lines.push(currentLine);
                                textHeight += fontSize * k;
                            }

                            if (textHeight > size_p.y) {
                                fontSize /= 1.5;
                            } else {
                                this.text = lines;
                                var fontSizeVirtual = viewport2d.heightScreenToVirtual(fontSize);
                                this.settings.fontSizeVirtual = fontSizeVirtual;
                                break;
                            }
                        }

                        this.screenFontSize = fontSize; // try to save fontSize
                    } else {
                        ctx.font = fontSize + "pt " + this.settings.fontName; // assign it here to measure text in next lines

                        this.screenFontSize = fontSize; // try to save fontSize

                        if (this.width == 0) {
                            var size = ctx.measureText(this.text);
                            size_p.x = size.width;
                            this.width = viewport2d.widthScreenToVirtual(size.width);
                        } else {
                            var size = ctx.measureText(this.text);
                            if (size.width > size_p.x) {
                                this.height = this.width * size_p.y / size.width;
                                if (this.settings.textBaseline === 'middle') {
                                    this.newY = this.newBaseline - this.newHeight / 2;
                                }
                                fontSize = viewport2d.heightVirtualToScreen(this.height);

                                this.screenFontSize = fontSize; // try to save fontSize
                            } else if (typeof this.settings.adjustWidth && this.settings.adjustWidth) {
                                var nwidth = viewport2d.widthScreenToVirtual(size.width);

                                if (this.settings.textAlign === 'center') {
                                    this.x = this.x + (this.width - nwidth) / 2;
                                } else if (this.settings.textAlign === 'right') {
                                    this.x = this.x + this.width - nwidth;
                                }
                                this.width = nwidth;

                                p = viewport2d.pointVirtualToScreen(this.x, this.newY);
                                size_p.x = viewport2d.widthVirtualToScreen(this.width);
                            }
                        }
                    }
                    this.initialized = true;
                }

                // Rendering text
                if (this.settings.textAlign) {
                    ctx.textAlign = this.settings.textAlign;
                    if (this.settings.textAlign === 'center')
                        p.x = p.x + size_p.x / 2.0;
                    else if (this.settings.textAlign === 'right')
                        p.x = p.x + size_p.x;
                }

                if (!this.settings.wrapText) {
                    if (this.settings.textBaseline)
                        ctx.textBaseline = this.settings.textBaseline;

                    drawText(this.text, ctx, p.x, bp, fontSize, this.settings.fontName);
                } else {
                    fontSize = viewport2d.heightVirtualToScreen(this.settings.fontSizeVirtual);
                    this.screenFontSize = fontSize; // try to save fontSize
                    ctx.textBaseline = 'middle';

                    var bp = p.y + fontSize * k / 2;
                    for (var i = 0; i < this.text.length; i++) {
                        drawText(this.text[i], ctx, p.x, bp, fontSize, this.settings.fontName);
                        bp += fontSize * k;
                    }
                }
            };

            this.isVisible = function (visibleBox_v) {
                var objBottom = this.y + this.height;
                if (this.width > 0) {
                    var objRight = this.x + this.width;
                    return Math.max(this.x, visibleBox_v.Left) <= Math.min(objRight, visibleBox_v.Right) && Math.max(this.y, visibleBox_v.Top) <= Math.min(objBottom, visibleBox_v.Bottom);
                }
                return Math.max(this.y, visibleBox_v.Top) <= Math.min(objBottom, visibleBox_v.Bottom);
            };

            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, wv ? wv : 0, vh);
        }

        /*  A multiline text element on a virtual canvas.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vh   (number) height of a text
        @param lineWidth (number) width of a line to text output
        @param settings     ({ fillStyle, fontName }) Parameters of the text appearance
        @remarks
        Text width is adjusted using measureText() on first render call.
        */
        function CanvasMultiLineTextItem(vc, layerid, id, vx, vy, vh, text, lineWidth, settings) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, vh * 10, vh); // todo: measure properly text width
            this.settings = settings;
            this.text = text;

            this.render = function (ctx, visibleBox, viewport2d, size_p) {
                function textOutput(context, text, x, y, lineHeight, fitWidth) {
                    fitWidth = fitWidth || 0;

                    if (fitWidth <= 0) {
                        context.fillText(text, x, y);
                        return;
                    }
                    var words = text.split(' ');
                    var currentLine = 0;
                    var idx = 1;
                    while (words.length > 0 && idx <= words.length) {
                        var str = words.slice(0, idx).join(' ');
                        var w = context.measureText(str).width;
                        if (w > fitWidth) {
                            if (idx == 1) {
                                idx = 2;
                            }
                            context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineHeight * currentLine));
                            currentLine++;
                            words = words.splice(idx - 1);
                            idx = 1;
                        } else {
                            idx++;
                        }
                    }
                    if (idx > 0)
                        context.fillText(words.join(' '), x, y + (lineHeight * currentLine));
                }
                ;

                var p = viewport2d.pointVirtualToScreen(this.x, this.y);
                ctx.fillStyle = settings.fillStyle;
                ctx.font = size_p.y + "pt " + settings.fontName;
                ctx.textBaseline = 'top';
                var height = viewport2d.heightVirtualToScreen(this.height);
                textOutput(ctx, this.text, p.x, p.y, height, lineWidth * height);
                // ctx.fillText(this.text, p.x, p.y);
            };

            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, vh * 10, vh);
        }

        /*  Represents an image on a virtual canvas.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param onload (optional callback function) called when image is loaded
        @remarks
        optional property onLoad() is called if defined when the image is loaded and the element is completely initialized.
        */
        function CanvasImage(vc, layerid, id, imageSource, vx, vy, vw, vh, onload) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, vw, vh);
            this.onload = onload;

            this.isLoading = true; // I am async
            var img = new Image();
            this.img = img;
            this.img.isLoaded = false;

            var self = this;
            var onCanvasImageLoad = function (s) {
                img['isLoading'] = false;
                if (!img['isRemoved']) {
                    // adjusting aspect ratio
                    if (img.naturalHeight) {
                        var ar0 = self.width / self.height;
                        var ar1 = img.naturalWidth / img.naturalHeight;
                        if (ar0 > ar1) {
                            // vh ~ img.height, vw is to be adjusted
                            var imgWidth = ar1 * self.height;
                            var offset = (self.width - imgWidth) / 2.0;
                            self.x += offset;
                            self.width = imgWidth;
                        } else if (ar0 < ar1) {
                            // vw ~ img.width, vh is to be adjusted
                            var imgHeight = self.width / ar1;
                            var offset = (self.height - imgHeight) / 2.0;
                            self.y += offset;
                            self.height = imgHeight;
                        }
                    }

                    img['isLoaded'] = true;
                    if (self.onLoad)
                        self.onLoad();
                    self.vc.requestInvalidate();
                } else {
                    delete img['isRemoved'];
                    delete img['isLoaded'];
                }
            };
            var onCanvasImageLoadError = function (e) {
                if (!img['isFallback']) {
                    img['isFallback'] = true;
                    img.src = CZ.Settings.fallbackImageUri;
                } else {
                    throw "Cannot load an image!";
                }
            };

            this.img.addEventListener("load", onCanvasImageLoad, false);
            if (onload)
                this.img.addEventListener("load", onload, false);
            this.img.addEventListener("error", onCanvasImageLoadError, false);
            this.img.src = imageSource; // todo: stop image loading if it is not needed anymore (see http://stackoverflow.com/questions/1339901/stop-loading-of-images-with-javascript-lazyload)

            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                if (!this.img.isLoaded)
                    return;
                var p = viewport2d.pointVirtualToScreen(this.x, this.y);
                ctx.globalAlpha = opacity;
                ctx.drawImage(this.img, p.x, p.y, size_p.x, size_p.y);
            };
            this.onRemove = function () {
                this.img.removeEventListener("load", onCanvasImageLoad, false);
                this.img.removeEventListener("error", onCanvasImageLoadError, false);
                if (this.onload)
                    this.img.removeEventListener("load", this.onload, false);
                this.img.isRemoved = true;
                delete this.img;
            };

            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, vw, vh);
        }

        /*  Represents an image on a virtual canvas with support of dynamic level of detail.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param imageSources   [{ zoomLevel, imageSource }] Ordered array of image sources for different zoom levels
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param onload (optional callback function) called when image is loaded
        */
        function CanvasLODImage(vc, layerid, id, imageSources, vx, vy, vw, vh, onload) {
            this.base = CanvasDynamicLOD;
            this.base(vc, layerid, id, vx, vy, vw, vh);
            this.imageSources = imageSources;

            this.changeZoomLevel = function (currentZoomLevel, newZoomLevel) {
                var n = this.imageSources.length;
                if (n == 0)
                    return null;
                for (; --n >= 0;) {
                    if (this.imageSources[n].zoomLevel <= newZoomLevel) {
                        if (this.imageSources[n].zoomLevel === currentZoomLevel)
                            return null;
                        return {
                            zoomLevel: this.imageSources[n].zoomLevel,
                            content: new CanvasImage(vc, layerid, id + "@" + this.imageSources[n].zoomLevel, this.imageSources[n].imageSource, vx, vy, vw, vh, onload)
                        };
                    }
                }
                return null;
            };

            this.prototype = new CanvasDynamicLOD(vc, layerid, id, vx, vy, vw, vh);
        }

        /* A canvas element which can host any of HTML elements.
        @param vc        (jquery to virtual canvas) note that vc.element[0] is the virtual canvas object
        @param layerid   (any type) id of the layer for this element
        @param id        (any type) id of an element
        @param vx        (number)   x of left top corner in virtual space
        @param vy        (number)   y of left top corner in virtual space
        @param vw        (number)   width of in virtual space
        @param vh        (number)   height of in virtual space
        @param z         (number) z-index
        */
        function CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, vw, vh);

            /* Initializes content of the CanvasDomItem.
            @param content          HTML element to add to virtual canvas
            @remarks The method assigns this.content property and sets up the styles of the content. */
            this.initializeContent = function (content) {
                this.content = content; // todo: ref to DOM potentially causes memory leak.
                if (content) {
                    content.style.position = 'absolute';
                    content.style.overflow = 'hidden';
                    content.style.zIndex = z;
                }
            };

            /* This function is called when isRendered changes, i.e. when we stop or start render this element. */
            this.onIsRenderedChanged = function () {
                if (!this.content)
                    return;

                if (this.isRendered) {
                    if (!this.content.isAdded) {
                        this.vc.element[0].appendChild(this.content);
                        this.content.isAdded = true;
                    }
                    this.content.style.display = 'block';
                } else {
                    /* If we stop render it, we make it invisible */
                    this.content.style.display = 'none';
                }
            };
            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                if (!this.content)
                    return;
                var p = viewport2d.pointVirtualToScreen(this.x, this.y);

                // p.x = p.x + 8; p.y = p.y + 8; // todo: properly position relative to VC and remove this offset
                //Define screen rectangle
                var screenTop = 0;
                var screenBottom = viewport2d.height;
                var screenLeft = 0;
                var screenRight = viewport2d.width;

                //Define clip rectangle. By defautlt, video is not clipped. If video element crawls from screen rect, clip it
                var clipRectTop = 0, clipRectLeft = 0, clipRectBottom = size_p.y, clipRectRight = size_p.x;

                //Vertical intersection ([a1,a2] are screen top and bottom, [b1,b2] are iframe top and bottom)
                var a1 = screenTop;
                var a2 = screenBottom;
                var b1 = p.y;
                var b2 = p.y + size_p.y;
                var c1 = Math.max(a1, b1);
                var c2 = Math.min(a2, b2);
                if (c1 <= c2) {
                    clipRectTop = c1 - p.y;
                    clipRectBottom = c2 - p.y;
                }

                //Horizontal intersection ([a1,a2] are screen left and right, [b1,b2] are iframe left and right)
                a1 = screenLeft;
                a2 = screenRight;
                b1 = p.x;
                b2 = p.x + size_p.x;
                c1 = Math.max(a1, b1);
                c2 = Math.min(a2, b2); //[c1,c2] is intersection
                if (c1 <= c2) {
                    clipRectLeft = c1 - p.x;
                    clipRectRight = c2 - p.x;
                }

                //Finally, reset iframe style.
                this.content.style.left = p.x + 'px';
                this.content.style.top = p.y + 'px';
                this.content.style.width = size_p.x + 'px';
                this.content.style.height = size_p.y + 'px';
                this.content.style.clip = 'rect(' + clipRectTop + 'px,' + clipRectRight + 'px,' + clipRectBottom + 'px,' + clipRectLeft + 'px)';
                this.content.style.opacity = opacity;
                this.content.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
            };

            /* The functions is called when the canvas element is removed from the elements tree */
            this.onRemove = function () {
                if (!this.content)
                    return;
                try  {
                    if (this.content.isAdded) {
                        if (this.content.src)
                            this.content.src = ""; // Stop loading content
                        this.vc.element[0].removeChild(this.content);
                        this.content.isAdded = false;
                    }
                } catch (ex) {
                    alert(ex.Description);
                }
            };

            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, vw, vh);
        }
        VCContent.CanvasDomItem = CanvasDomItem;

        /*Represents Text block with scroll*/
        /*  Represents an image on a virtual canvas.
        @param videoSrc     video source
        @param vx           x of left top corner in virtual space
        @param vy           y of left top corner in virtual space
        @param vw           width of in virtual space
        @param vh           height of in virtual space
        @param z            z-index
        @param settings     Parameters of the appearance
        */
        function CanvasScrollTextItem(vc, layerid, id, vx, vy, vw, vh, text, z) {
            this.base = CanvasDomItem;
            this.base(vc, layerid, id, vx, vy, vw, vh, z);

            //Creating content element
            //Our text will be drawn on div
            //To enable overflow:auto effect in IE, we have to use position:relative
            //But in vccontent we use position:absolute
            //So, we create "wrapping" div elemWrap, with position:absolute
            //Inside elemWrap, create child div with position:relative
            var elem = $("<div></div>", {
                id: "citext_" + id,
                class: "contentItemDescription"
            }).appendTo(vc);

            elem[0].addEventListener("mousemove", CZ.Common.preventbubble, false);
            elem[0].addEventListener("mousedown", CZ.Common.preventbubble, false);
            elem[0].addEventListener("DOMMouseScroll", CZ.Common.preventbubble, false);
            elem[0].addEventListener("mousewheel", CZ.Common.preventbubble, false);
            var textElem = $("<div style='position:relative;' class='text'></div>");
            textElem.html(marked(text)).appendTo(elem);

            //Initialize content
            this.initializeContent(elem[0]);

            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                //Scale new font size
                var fontSize = size_p.y / CZ.Settings.contentItemDescriptionNumberOfLines;
                elem.css('font-size', fontSize + "px");

                this.prototype.render.call(this, ctx, visibleBox, viewport2d, size_p, opacity);
            };

            this.onRemove = function () {
                this.prototype.onRemove.call(this);
                elem[0].removeEventListener("mousemove", CZ.Common.preventbubble, false);
                elem[0].removeEventListener("mouseup", CZ.Common.preventbubble, false);
                elem[0].removeEventListener("mousedown", CZ.Common.preventbubble, false);
                elem[0].removeEventListener("DOMMouseScroll", CZ.Common.preventbubble, false);
                elem[0].removeEventListener("mousewheel", CZ.Common.preventbubble, false);
                elem = undefined;
            };

            this.prototype = new CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
        }

        /*Represents PDF element
        @param pdfSrc     pdf source
        @param vx           x of left top corner in virtual space
        @param vy           y of left top corner in virtual space
        @param vw           width of in virtual space
        @param vh           height of in virtual space
        @param z            z-index
        */
        function CanvasPdfItem(vc, layerid, id, pdfSrc, vx, vy, vw, vh, z) {
            var pdfViewer = "http://docs.google.com/viewer?url=";
            this.base = CanvasDomItem;
            this.base(vc, layerid, id, vx, vy, vw, vh, z);

            var elem = document.createElement('iframe');
            elem.setAttribute("id", id);

            if (!pdfSrc.match("/^" + pdfViewer + "/")) {
                pdfSrc = pdfViewer + pdfSrc;
            }
            if (pdfSrc.indexOf('?') == -1)
                pdfSrc += '?&embedded=true&wmode=opaque';
            else
                pdfSrc += '&embedded=true&wmode=opaque';
            elem.setAttribute("src", pdfSrc);

            elem.setAttribute("visible", 'true');
            elem.setAttribute("controls", 'true');

            this.initializeContent(elem);

            this.prototype = new CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
        }

        /*Represents video element
        @param videoSrc     video source
        @param vx           x of left top corner in virtual space
        @param vy           y of left top corner in virtual space
        @param vw           width of in virtual space
        @param vh           height of in virtual space
        @param z            z-index
        */
        function CanvasVideoItem(vc, layerid, id, videoSrc, vx, vy, vw, vh, z) {
            this.base = CanvasDomItem;
            this.base(vc, layerid, id, vx, vy, vw, vh, z);

            var elem = document.createElement('iframe');
            elem.setAttribute("id", id);
            if (videoSrc.indexOf('?') == -1)
                videoSrc += '?wmode=opaque';
            else
                videoSrc += '&wmode=opaque';
            elem.setAttribute("src", videoSrc);
            elem.setAttribute("visible", 'true');
            elem.setAttribute("controls", 'true');

            this.initializeContent(elem);

            this.prototype = new CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
        }

        /*Represents Audio element*/
        /*  Represents an image on a virtual canvas.
        @param audioSrc     audio source
        @param vx           x of left top corner in virtual space
        @param vy           y of left top corner in virtual space
        @param vw           width of in virtual space
        @param vh           height of in virtual space
        @param z            z-index
        @param settings     Parameters of the appearance
        */
        function CanvasAudioItem(vc, layerid, id, audioSrc, vx, vy, vw, vh, z) {
            this.base = CanvasDomItem;
            this.base(vc, layerid, id, vx, vy, vw, vh, z);

            var elem = document.createElement('audio');
            elem.setAttribute("id", id);
            elem.setAttribute("src", audioSrc);
            elem.setAttribute("visible", 'true');
            elem.setAttribute("controls", 'true');
            this.initializeContent(elem);

            this.prototype = new CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
        }

        /*Represents skydrive embed document
        @param embedSrc     embed document source code
        @param vx           x of left top corner in virtual space
        @param vy           y of left top corner in virtual space
        @param vw           width of in virtual space
        @param vh           height of in virtual space
        @param z            z-index
        */
        function CanvasSkydriveDocumentItem(vc, layerid, id, embededSrc, vx, vy, vw, vh, z) {
            this.base = CanvasDomItem;
            this.base(vc, layerid, id, vx, vy, vw, vh, z);

            var elem = document.createElement('iframe');
            elem.setAttribute("id", id);
            elem.setAttribute("src", embededSrc);
            this.initializeContent(elem);

            this.prototype = new CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
        }

        /*Represents skydrive embed image
        Image is scaled to fit entire container.
        @param embedSrc     embed image source code. pattern: {url} {width} {height}
        @param vx           x of left top corner in virtual space
        @param vy           y of left top corner in virtual space
        @param vw           width of in virtual space
        @param vh           height of in virtual space
        @param z            z-index
        */
        function CanvasSkydriveImageItem(vc, layerid, id, embededSrc, vx, vy, vw, vh, z) {
            this.base = CanvasDomItem;
            this.base(vc, layerid, id, vx, vy, vw, vh, z);

            // parse src params
            var srcData = embededSrc.split(" ");

            var elem = document.createElement('iframe');
            elem.setAttribute("id", id);
            elem.setAttribute("src", srcData[0]);
            elem.setAttribute("scrolling", "no");
            elem.setAttribute("frameborder", "0");
            elem.setAttribute("sandbox", "allow-forms allow-scripts");
            this.initializeContent(elem);

            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                if (!this.content)
                    return;

                var p = viewport2d.pointVirtualToScreen(this.x, this.y);

                // p.x = p.x + 8; p.y = p.y + 8; // todo: properly position relative to VC and remove this offset
                // parse base size of iframe
                var width = parseFloat(srcData[1]);
                var height = parseFloat(srcData[2]);

                // calculate scale level
                var scale = size_p.x / width;
                if (height / width > size_p.y / size_p.x) {
                    scale = size_p.y / height;
                }

                // position image in center of container
                this.content.style.left = (p.x + size_p.x / 2) + 'px';
                this.content.style.top = (p.y + size_p.y / 2) + 'px';
                this.content.style.marginLeft = (-width / 2) + 'px';
                this.content.style.marginTop = (-height / 2) + 'px';

                this.content.style.width = width + 'px';
                this.content.style.height = height + 'px';
                this.content.style.opacity = opacity;
                this.content.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';

                // scale iframe to fit entire container
                this.content.style.webkitTransform = "scale(" + scale + ")";
                this.content.style.msTransform = "scale(" + scale + ")";
                this.content.style.MozTransform = "scale(" + scale + ")";
            };

            this.prototype = new CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
        }

        /*Represents a Seadragon based image
        @param imageSource  image source
        @param vx           x of left top corner in virtual space
        @param vy           y of left top corner in virtual space
        @param vw           width of in virtual space
        @param vh           height of in virtual space
        @param z            z-index
        @param onload       (optional callback function) called when image is loaded
        @oaram parent       parent element, whose child is to be seadragon image.
        */
        function SeadragonImage(vc, parent, layerid, id, imageSource, vx, vy, vw, vh, z, onload) {
            var self = this;
            this.base = CanvasDomItem;
            this.base(vc, layerid, id, vx, vy, vw, vh, z);
            this.onload = onload;
            this.nAttempts = 0;
            this.timeoutHandles = [];

            var container = document.createElement('div');
            container.setAttribute("id", id);
            container.setAttribute("style", "color: white"); // color to use for displaying messages
            this.initializeContent(container);

            this.viewer = new Seadragon.Viewer(container);
            this.viewer.elmt.addEventListener("mousemove", CZ.Common.preventbubble, false);
            this.viewer.elmt.addEventListener("mousedown", CZ.Common.preventbubble, false);
            this.viewer.elmt.addEventListener("DOMMouseScroll", CZ.Common.preventbubble, false);
            this.viewer.elmt.addEventListener("mousewheel", CZ.Common.preventbubble, false);

            this.viewer.addEventListener("open", function (e) {
                if (self.onload)
                    self.onload();
                self.vc.requestInvalidate();
            });

            this.viewer.addEventListener("resize", function (e) {
                self.viewer.setDashboardEnabled(e.elmt.clientWidth > 250);
            });

            this.onSuccess = function (resp) {
                if (resp.error) {
                    // the URL is malformed or the service is down
                    self.showFallbackImage();
                    return;
                }

                var content = resp.content;
                if (content.ready) {
                    for (var i = 0; i < self.timeoutHandles.length; i++)
                        clearTimeout(self.timeoutHandles[i]);

                    self.viewer.openDzi(content.dzi);
                } else if (content.failed) {
                    self.showFallbackImage();
                } else {
                    if (self.nAttempts < CZ.Settings.seadragonMaxConnectionAttempts) {
                        self.viewer.showMessage("Loading " + Math.round(100 * content.progress) + "% done.");
                        self.timeoutHandles.push(setTimeout(self.requestDZI, CZ.Settings.seadragonRetryInterval)); // retry
                    } else {
                        self.showFallbackImage();
                    }
                }
            };

            this.onError = function () {
                // ajax query failed
                if (self.nAttempts < CZ.Settings.seadragonMaxConnectionAttempts) {
                    self.timeoutHandles.push(setTimeout(self.requestDZI, CZ.Settings.seadragonRetryInterval)); // retry
                } else {
                    self.showFallbackImage();
                }
            };

            this.requestDZI = function () {
                self.nAttempts++;
                $.ajax({
                    url: CZ.Settings.seadragonServiceURL + encodeURIComponent(imageSource),
                    dataType: "jsonp",
                    success: self.onSuccess,
                    error: self.onError
                });
            };

            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                if (self.viewer.isFullPage())
                    return;

                this.prototype.render.call(this, ctx, visibleBox, viewport2d, size_p, opacity);
                if (self.viewer.viewport) {
                    self.viewer.viewport.resize({ x: size_p.x, y: size_p.y });
                    self.viewer.viewport.update();
                }
            };

            this.onRemove = function () {
                self.viewer.close(); // closes any open content
                this.prototype.onRemove.call(this);
            };

            this.showFallbackImage = function () {
                for (var i = 0; i < self.timeoutHandles.length; i++)
                    clearTimeout(self.timeoutHandles[i]);

                self.onRemove(); // removes the dom element
                VCContent.removeChild(parent, self.id); // removes the cur seadragon object from the scene graph
                VCContent.addImage(parent, layerid, id, vx, vy, vw, vh, imageSource);
            };

            // run
            self.requestDZI();

            this.prototype = new CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
        }

       /**
        * Background image for a timeline.
        * @param vc      Virtual canvas.
        * @param layerid Name of rendering layer of virtual canvas.
        * @param id      ID of an element.
        * @param src     Image source.
        * @param vx      x of left top corner in virtual space.
        * @param vy      y of left top corner in virtual space.
        * @param vw      width of an image in virtual space.
        * @param vh      height of an image in virtual space.
        */
        function BackgroundImage(vc, layerid, id, src, vx, vy, vw, vh) {
            var self = this;
            self.base = CanvasElement;
            self.base(vc, layerid, id, vx, vy, vw, vh);

            var onload = function () {
                self.vc.requestInvalidate();
            };

            self.img = new Image();
            self.img.addEventListener("load", onload, false);
            self.img.src = src;

            self.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                if (!self.img.complete) return;

                var ptl = viewport2d.pointVirtualToScreen(self.x, self.y),
                    pbr = viewport2d.pointVirtualToScreen(self.x + self.width, self.y + self.height),
                    tw = pbr.x - ptl.x,
                    th = pbr.y - ptl.y,
                    iw = self.img.width,
                    ih = self.img.height,
                    vpw = viewport2d.width,
                    vph = viewport2d.height,
                    tiwr = tw / iw,
                    tihr = th / ih,
                    sxl = Math.floor(Math.max(0, -ptl.x) / tiwr),
                    syt = Math.floor(Math.max(0, -ptl.y) / tihr),
                    sxr = Math.floor(Math.max(0, pbr.x - vpw) / tiwr),
                    syb = Math.floor(Math.max(0, pbr.y - vph) / tihr),
                    sx = sxl,
                    sy = syt,
                    sw = iw - sxl - sxr,
                    sh = ih - syt - syb,
                    vx = sxl > 0 ? sxl * tiwr + ptl.x : ptl.x,
                    vy = syt > 0 ? syt * tihr + ptl.y : ptl.y,
                    vw = sw * tiwr,
                    vh = sh * tihr;

                ctx.globalAlpha = opacity;

                // NOTE: A special case when the image starts twitching.
                if (sw === 1 && sh === 1) {
                    vx = Math.max(0, ptl.x);
                    vy = Math.max(0, ptl.y);
                    vw = Math.min(vpw, pbr.x) - vx;
                    vh = Math.min(vph, pbr.y) - vy;
                }

                if (self.img.naturalWidth && self.img.naturalHeight) {
                    ctx.drawImage(self.img, sx, sy, sw, sh, vx, vy, vw, vh);
                }
            };

            self.onRemove = function () {
                self.img.removeEventListener("load", onload, false);
            };

            self.prototype = new CanvasElement(vc, layerid, id, vx, vy, vw, vh);
        }

        /*******************************************************************************************************/
        /* Timelines                                                                                           */
        /*******************************************************************************************************/
        /* Adds a timeline composite element into a virtual canvas.
        @param element   (CanvasElement) Parent element, whose children is to be new timeline.
        @param layerid   (any type) id of the layer for this element
        @param id        (any type) id of an element
        @param timelineinfo  ({ timeStart (minus number of years BP), timeEnd (minus number of years BP), top (number), height (number),
        header (string), fillStyle (color) })
        @returns         root of the timeline tree
        */
        function addTimeline(element, layerid, id, timelineinfo) {
            var width = timelineinfo.timeEnd - timelineinfo.timeStart;
            var timeline = VCContent.addChild(element, new CanvasTimeline(element.vc, layerid, id, timelineinfo.timeStart, timelineinfo.top, width, timelineinfo.height, {
                strokeStyle: timelineinfo.strokeStyle ? timelineinfo.strokeStyle : CZ.Settings.timelineStrokeStyle,
                lineWidth: CZ.Settings.timelineLineWidth,
                fillStyle: CZ.Settings.timelineColor ? CZ.Settings.timelineColor : timelineinfo.fillStyle,
                opacity: typeof timelineinfo.opacity !== 'undefined' ? timelineinfo.opacity : 1
            }, timelineinfo), true);
            return timeline;
        }
        VCContent.addTimeline = addTimeline;

        /*******************************************************************************************************/
        /* Infodots & content items                                                                            */
        /*******************************************************************************************************/
        /*  Represents an image on a virtual canvas with support of dynamic level of detail.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param contentItem ({ id, guid, date (string), title (string), description (string), mediaUrl (string), mediaType (string) }) describes content of this content item
        @remarks Supported media types (contentItem.mediaType) are:
        - image
        - video
        - audio
        - pdf
        */
        function ContentItem(vc, layerid, id, vx, vy, vw, vh, contentItem) {
            this.base = CanvasDynamicLOD;
            this.base(vc, layerid, id, vx, vy, vw, vh);
            this.guid = contentItem.id;
            this.type = 'contentItem';
            this.contentItem = contentItem;

            // Building content of the item
            var titleHeight = vh * CZ.Settings.contentItemTopTitleHeight * 0.8;
            var mediaHeight = vh * CZ.Settings.contentItemMediaHeight;
            var descrHeight = CZ.Settings.contentItemFontHeight * vh;

            var contentWidth = vw * CZ.Settings.contentItemContentWidth;
            var leftOffset = (vw - contentWidth) / 2.0;
            var verticalMargin = vh * CZ.Settings.contentItemVerticalMargin;

            var mediaTop = vy + verticalMargin;
            var sourceVertMargin = verticalMargin * 0.4;
            var sourceTop = mediaTop + mediaHeight + sourceVertMargin;
            var sourceRight = vx + vw - leftOffset;
            var sourceHeight = vh * CZ.Settings.contentItemSourceHeight * 0.8;
            var titleTop = sourceTop + verticalMargin + sourceHeight;

            // Bounding rectangle
            var rect = VCContent.addRectangle(this, layerid, id + "__rect__", vx, vy, vw, vh, {
                strokeStyle: CZ.Settings.contentItemBoundingBoxBorderColor, lineWidth: CZ.Settings.contentItemBoundingBoxBorderWidth * vw, fillStyle: CZ.Settings.contentItemBoundingBoxFillColor,
                isLineWidthVirtual: true
            });
            this.reactsOnMouse = true;

            this.onmouseenter = function (e)
            {
                rect.settings.strokeStyle = CZ.Settings.contentItemBoundingHoveredBoxBorderColor;
                this.vc.currentlyHoveredContentItem = this;
                this.vc.requestInvalidate();
            };

            this.onmouseleave = function (e)
            {
                rect.settings.strokeStyle = CZ.Settings.contentItemBoundingBoxBorderColor;
                this.vc.currentlyHoveredContentItem = null;
                this.isMouseIn = false;
                this.vc.requestInvalidate();
            };

            this.onmouseclick = function (e) {
                return zoomToElementHandler(this, e, 1.0);
            };

            var self = this;
            this.changeZoomLevel = function (curZl, newZl) {
                var vy = self.newY;
                var mediaTop = vy + verticalMargin;
                var sourceTop = mediaTop + mediaHeight + sourceVertMargin;
                var titleTop = sourceTop + verticalMargin + sourceHeight;

                if (newZl >= CZ.Settings.contentItemShowContentZoomLevel) {
                    if (curZl >= CZ.Settings.contentItemShowContentZoomLevel)
                        return null;

                    var container = new ContainerElement(vc, layerid, id + "__content", vx, vy, vw, vh);

                    // Media
                    var mediaID = id + "__media__";
                    var imageElem = null;
                    if (this.contentItem.mediaType.toLowerCase() === 'image' || this.contentItem.mediaType.toLowerCase() === 'picture') {
                        imageElem = VCContent.addImage(container, layerid, mediaID, vx + leftOffset, mediaTop, contentWidth, mediaHeight, this.contentItem.uri);
                    } else if (this.contentItem.mediaType.toLowerCase() === 'deepimage') {
                        imageElem = VCContent.addSeadragonImage(container, layerid, mediaID, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex, this.contentItem.uri);
                    } else if (this.contentItem.mediaType.toLowerCase() === 'video') {
                        VCContent.addVideo(container, layerid, mediaID, this.contentItem.uri, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex);
                    } else if (this.contentItem.mediaType.toLowerCase() === 'audio') {
                        mediaTop += CZ.Settings.contentItemAudioTopMargin * vh;
                        mediaHeight = vh * CZ.Settings.contentItemAudioHeight;
                        addAudio(container, layerid, mediaID, this.contentItem.uri, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex);
                    } else if (this.contentItem.mediaType.toLowerCase() === 'pdf') {
                        VCContent.addPdf(container, layerid, mediaID, this.contentItem.uri, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex);
                    } else if (this.contentItem.mediaType.toLowerCase() === 'skydrive-document') {
                        VCContent.addSkydriveDocument(container, layerid, mediaID, this.contentItem.uri, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex);
                    } else if (this.contentItem.mediaType.toLowerCase() === 'skydrive-image') {
                        VCContent.addSkydriveImage(container, layerid, mediaID, this.contentItem.uri, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex);
                    } else if (CZ.Extensions.mediaTypeIsExtension(contentItem.mediaType)) {
                        VCContent.addExtension(contentItem.mediaType, container, layerid, mediaID, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex, this.contentItem.uri);
                    }

                    // Title
                    var titleText = this.contentItem.title;
                    addText(container, layerid, id + "__title__", vx + leftOffset, titleTop, titleTop + titleHeight / 2.0, 0.9 * titleHeight, titleText, {
                        fontName: CZ.Settings.contentItemHeaderFontName,
                        fillStyle: CZ.Settings.contentItemHeaderFontColor,
                        textBaseline: 'middle',
                        textAlign: 'center',
                        opacity: 1,
                        wrapText: true,
                        numberOfLines: 1
                    }, contentWidth);

                    // Source
                    var sourceText = this.contentItem.attribution;
                    var mediaSource = this.contentItem.mediaSource;
                    if (sourceText) {
                        var addSourceText = function (sx, sw, sy) {
                            var sourceItem = addText(container, layerid, id + "__source__", sx, sy, sy + sourceHeight / 2.0, 0.9 * sourceHeight, sourceText, {
                                fontName: CZ.Settings.contentItemHeaderFontName,
                                fillStyle: CZ.Settings.contentItemSourceFontColor,
                                textBaseline: 'middle',
                                textAlign: 'right',
                                opacity: 1,
                                adjustWidth: true
                            }, sw);

                            if (mediaSource) {
                                sourceItem.reactsOnMouse = true;
                                sourceItem.onmouseclick = function (e) {
                                    vc.element.css('cursor', 'default');
                                    window.open(mediaSource);
                                    return true;
                                };
                                sourceItem.onmouseenter = function (pv, e) {
                                    this.settings.fillStyle = CZ.Settings.contentItemSourceHoveredFontColor;
                                    this.vc.requestInvalidate();
                                    this.vc.element.css('cursor', 'pointer');
                                };
                                sourceItem.onmouseleave = function (pv, e) {
                                    this.settings.fillStyle = CZ.Settings.contentItemSourceFontColor;
                                    this.vc.requestInvalidate();
                                    this.vc.element.css('cursor', 'default');
                                };
                            }
                        };

                        addSourceText(vx + leftOffset, contentWidth, sourceTop);
                    }

                    // Description
                    var descrTop = titleTop + titleHeight + verticalMargin;
                    var descr = addScrollText(container, layerid, id + "__description__", vx + leftOffset, descrTop, contentWidth, descrHeight, this.contentItem.description, 30, {});

                    //adding edit button
                    if (CZ.Authoring.isEnabled) {
                        var imageSize = (container.y + container.height - descr.y - descr.height) * 0.75;
                        var editButton = VCContent.addImage(container, layerid, id + "__edit", container.x + container.width - 1.25 * imageSize, descrTop + descrHeight, imageSize, imageSize, "/images/edit.svg");

                        editButton.reactsOnMouse = true;
                        editButton.onmouseclick = function () {
                            CZ.Authoring.isActive = true;
                            CZ.Authoring.mode = "editContentItem";
                            CZ.Authoring.contentItemMode = "editContentItem";
                            CZ.Authoring.selectedExhibit = self.parent.parent.parent;
                            CZ.Authoring.selectedContentItem = self.contentItem;
                            return true;
                        };

                        editButton.onmouseenter = function () {
                            this.vc.element.css('cursor', 'pointer');
                            this.vc.element.attr('title', 'Edit Artifact');
                            rect.settings.strokeStyle = "yellow";
                        };

                        editButton.onmouseleave = function () {
                            this.vc.element.css('cursor', 'default');
                            this.vc.element.attr('title', '');
                            rect.settings.strokeStyle = CZ.Settings.contentItemBoundingHoveredBoxBorderColor;
                        };
                    }

                    return {
                        zoomLevel: CZ.Settings.contentItemShowContentZoomLevel,
                        content: container
                    };
                } else {
                    var zl = newZl;
                    if (zl >= CZ.Settings.contentItemThumbnailMaxLevel) {
                        if (curZl >= CZ.Settings.contentItemThumbnailMaxLevel && curZl < CZ.Settings.contentItemShowContentZoomLevel)
                            return null;
                        zl = CZ.Settings.contentItemThumbnailMaxLevel;
                    } else if (zl <= CZ.Settings.contentItemThumbnailMinLevel) {
                        if (curZl <= CZ.Settings.contentItemThumbnailMinLevel && curZl > 0)
                            return null;
                        zl = CZ.Settings.contentItemThumbnailMinLevel;
                    }
                    var sz = 1 << zl;
                    var thumbnailUri = CZ.Settings.contentItemThumbnailBaseUri + 'x' + sz + '/' + contentItem.guid + '.png';

                    return {
                        zoomLevel: newZl,
                        content: new CanvasImage(vc, layerid, id + "@" + 1, thumbnailUri, vx, vy, vw, vh)
                    };
                }
            };

            this.prototype = new CanvasDynamicLOD(vc, layerid, id, vx, vy, vw, vh);
        }

        /*  An Infodot element that can be added to a VirtualCanvas.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param infodotDescription  ({title})
        */
        function CanvasInfodot(vc, layerid, id, time, vyc, radv, contentItems, infodotDescription)
        {
            this.base = CanvasCircle;
            this.base
            (
                vc, layerid, id, time, vyc, radv,
                {
                    strokeStyle: CZ.Settings.infoDotBorderColor,
                    lineWidth: CZ.Settings.infoDotBorderWidth * radv,
                    fillStyle: CZ.Settings.infoDotFillColor,
                    isLineWidthVirtual: true,
                    showCirca: infodotDescription.isCirca
                }
            );
            this.guid = infodotDescription.guid;
            this.type = 'infodot';

            this.isBuffered = infodotDescription.isBuffered;
            this.contentItems = contentItems;
            this.hasContentItems = false;
            this.infodotDescription = infodotDescription;
            this.title = infodotDescription.title;
            this.isCirca = infodotDescription.isCirca;
            this.opacity = typeof infodotDescription.opacity !== 'undefined' ? infodotDescription.opacity : 1;

            contentItems.sort(function (a, b) {
                if (typeof a.order !== 'undefined' && typeof b.order === 'undefined')
                    return -1;
                else if (typeof a.order === 'undefined' && typeof b.order !== 'undefined')
                    return 1;
                else if (typeof a.order === 'undefined' && typeof b.order === 'undefined')
                    return 0;
                else if (a.order < b.order)
                    return -1;
                else if (a.order > b.order)
                    return 1;
                else
                    return 0;
            });

            for (var i = 0; i < contentItems.length; i++) {
                contentItems[i].order = i;
            }

            var vyc = this.newY + radv;
            var innerRad = radv - CZ.Settings.infoDotHoveredBorderWidth * radv;
            this.outerRad = radv;

            this.reactsOnMouse = true;

            this.tooltipEnabled = true; // indicates whether tooltip is enabled for this infodot at this moment or not
            this.tooltipIsShown = false; // indicates whether tooltip is shown or not

            this.onmousehover = function (pv, e) {
                this.vc.currentlyHoveredInfodot = this;
                this.vc.requestInvalidate();
            };

            this.onmouseclick = function (e) {
                return zoomToElementHandler(this, e, 1.0);
            };

            this.onmouseenter = function (e) {
                this.settings.strokeStyle = CZ.Settings.infoDotHoveredBorderColor;
                this.settings.lineWidth = CZ.Settings.infoDotHoveredBorderWidth * radv;
                this.vc.requestInvalidate();

                // clear tooltipIsShown flag for currently hovered timeline
                // it can be null because of mouse events sequence: mouseenter for infodot -> mousehover for timeline -> mouseunhover for timeline
                if (this.vc.currentlyHoveredTimeline != null) {
                    // stop active tooltip fadein animation and hide tooltip
                    CZ.Common.stopAnimationTooltip();
                    this.vc.currentlyHoveredTimeline.tooltipIsShown = false;
                }

                $(".bubbleInfo span").text(infodotDescription.title);
                this.panelWidth = $('.bubbleInfo').outerWidth(); // complete width of tooltip panel
                this.panelHeight = $('.bubbleInfo').outerHeight(); // complete height of tooltip panel

                CZ.Common.tooltipMode = "infodot"; //set tooltip mode to infodot

                // start tooltip fadein animation for this infodot
                if ((this.tooltipEnabled == true) && (this.tooltipIsShown == false)) {
                    this.tooltipIsShown = true;
                    $(".bubbleInfo").attr("id", "defaultBox");
                    CZ.Common.animationTooltipRunning = $('.bubbleInfo').fadeIn();
                }

                this.vc.cursorPosition = time;
                this.vc.currentlyHoveredInfodot = this;
                this.vc._setConstraintsByInfodotHover(this);
                this.vc.RaiseCursorChanged();
            };

            this.onmouseleave = function (e) {
                this.isMouseIn = false;
                this.settings.strokeStyle = CZ.Settings.infoDotBorderColor;
                this.settings.lineWidth = CZ.Settings.infoDotBorderWidth * radv;
                this.vc.requestInvalidate();

                // stop active fadein animation and hide tooltip
                if (this.tooltipIsShown == true)
                    CZ.Common.stopAnimationTooltip();

                this.tooltipIsShown = false;
                CZ.Common.tooltipMode = "default";

                this.vc.currentlyHoveredInfodot = undefined;
                this.vc._setConstraintsByInfodotHover(undefined);
                this.vc.RaiseCursorChanged();
            };

            this.onmouseclick = function (e) {
                return zoomToElementHandler(this, e, 1.0);
            };

            //Bibliography flag accroding to BUG 215750
            var bibliographyFlag = true;

            // Building dynamic LOD content
            var infodot = this;
            var root = new CanvasDynamicLOD(vc, layerid, id + "_dlod", time - innerRad, vyc - innerRad, 2 * innerRad, 2 * innerRad);
            root.removeWhenInvisible = true;
            VCContent.addChild(this, root, false);

            root.firstLoad = true;
            root.changeZoomLevel = function (curZl, newZl) {
                var vyc = infodot.newY + radv;

                // Showing only thumbnails for every content item of the infodot
                if (newZl >= CZ.Settings.infodotShowContentThumbZoomLevel && newZl < CZ.Settings.infodotShowContentZoomLevel) {
                    var URL = CZ.UrlNav.getURL();
                    if (typeof URL.hash.params != 'undefined' && typeof URL.hash.params['b'] != 'undefined')
                        bibliographyFlag = false;

                    if (curZl >= CZ.Settings.infodotShowContentThumbZoomLevel && curZl < CZ.Settings.infodotShowContentZoomLevel)
                        return null;

                    // Tooltip is enabled now.
                    infodot.tooltipEnabled = true;

                    var contentItem = null;

                    if (infodot.contentItems.length > 0) {
                        contentItem = new ContainerElement(vc, layerid, id + "__contentItems", root.x, root.newY, 2 * innerRad, 2 * innerRad);
                        var items = buildVcContentItems(infodot.contentItems, time, vyc, innerRad, vc, layerid);
                        if (items)
                            for (var i = 0; i < items.length; i++)
                                VCContent.addChild(contentItem, items[i], false);
                    }

                    if (contentItem) {
                        infodot.hasContentItems = true;
                        return {
                            zoomLevel: newZl,
                            content: contentItem
                        };
                    } else
                        return null;
                } else if (newZl >= CZ.Settings.infodotShowContentZoomLevel) {
                    if (curZl >= CZ.Settings.infodotShowContentZoomLevel)
                        return null;

                    // Tooltip is disabled now.
                    infodot.tooltipEnabled = false;

                    // stop active fadein animation and hide tooltip
                    if (infodot.tooltipIsShown == true) {
                        CZ.Common.stopAnimationTooltip();
                        infodot.tooltipIsShown = false;
                    }

                    var contentItem = null;

                    if (infodot.contentItems.length > 0) {
                        contentItem = new ContainerElement(vc, layerid, id + "__contentItems", root.x, root.y, 2 * innerRad, 2 * innerRad);
                        var items = buildVcContentItems(infodot.contentItems, time, vyc, innerRad, vc, layerid);
                        if (items)
                            for (var i = 0; i < items.length; i++)
                                VCContent.addChild(contentItem, items[i], false);
                    }
                    if (contentItem == null)
                        return null;

                    var titleWidth = CZ.Settings.infodotTitleWidth * radv * 2;
                    var titleHeight = CZ.Settings.infodotTitleHeight * radv * 2;
                    var centralSquareSize = (270 / 2 + 5) / 450 * 2 * radv;
                    var titleTop = vyc - centralSquareSize - titleHeight;
                    var title = '';

                    if (infodotDescription && infodotDescription.title && infodotDescription.date) {
                        var exhibitDate = CZ.Dates.convertCoordinateToYear(infodotDescription.date);
                        if ((exhibitDate.regime == "CE") || (exhibitDate.regime == "BCE")) {
                            var date_number = Number(infodotDescription.date);
                            var exhibitDate = CZ.Dates.convertCoordinateToYear(date_number);
                            var exhibitYMD = CZ.Dates.getYMDFromCoordinate(date_number);
                            date_number = Math.abs(date_number);
                            if (date_number == Math.floor(date_number)) {
                                title = infodotDescription.title + '\n(' + parseFloat((date_number).toFixed(2)) + ' ' + exhibitDate.regime + ')';
                            } else {
                                title = infodotDescription.title + '\n(' + exhibitYMD.year + "." + (exhibitYMD.month + 1) + "." + exhibitYMD.day + ' ' + exhibitDate.regime + ')';
                            }
                        } else {
                            // Format year title with fixed precision
                            title = infodotDescription.title + '\n(' + parseFloat(exhibitDate.year.toFixed(2)) + ' ' + exhibitDate.regime + ')';
                        }
                    }

                    var infodotTitle = addText(contentItem, layerid, id + "__title", time - titleWidth / 2, titleTop, titleTop, titleHeight, title, {
                        fontName: CZ.Settings.contentItemHeaderFontName,
                        fillStyle: CZ.Settings.contentItemHeaderFontColor,
                        textBaseline: 'middle',
                        textAlign: 'center',
                        opacity: 1,
                        wrapText: true,
                        numberOfLines: 2
                    }, titleWidth);

                    //adding edit button
                    if (CZ.Authoring.isEnabled) {
                        var imageSize = (titleTop - infodot.y) * 0.75;
                        var editButton = VCContent.addImage(infodot, layerid, id + "__edit", time - imageSize / 2, infodot.y + imageSize * 0.2, imageSize, imageSize, "/images/edit.svg");

                        editButton.reactsOnMouse = true;

                        editButton.onmouseclick = function () {
                            CZ.Authoring.isActive = true;
                            CZ.Authoring.mode = "editExhibit";
                            CZ.Authoring.selectedExhibit = infodot;
                            return true;
                        };

                        editButton.onmouseenter = function ()
                        {
                            this.vc.element.css('cursor', 'pointer');
                            this.vc.element.attr('title', 'Edit Exhibit or Add Artifact');
                            infodot.settings.strokeStyle = "yellow";
                        };

                        editButton.onmouseleave = function ()
                        {
                            this.vc.element.css('cursor', 'default');
                            this.vc.element.attr('title', '');
                            infodot.settings.strokeStyle = CZ.Settings.infoDotBorderColor;
                        };
                    }

                    var biblBottom = vyc + centralSquareSize + 63.0 / 450 * 2 * radv;
                    var biblHeight = CZ.Settings.infodotBibliographyHeight * radv * 2;
                    var biblWidth = titleWidth / 3;
                    var bibl = addText(contentItem, layerid, id + "__bibliography", time - biblWidth / 2, biblBottom - biblHeight, biblBottom - biblHeight / 2, biblHeight, "Bibliography", {
                        fontName: CZ.Settings.contentItemHeaderFontName,
                        fillStyle: CZ.Settings.contentItemHeaderFontColor,
                        textBaseline: 'middle',
                        textAlign: 'center',
                        opacity: 1
                    }, biblWidth);
                    bibl.reactsOnMouse = true;
                    bibl.onmouseclick = function (e) {
                        this.vc.element.css('cursor', 'default');
                        CZ.Bibliography.showBibliography({ infodot: infodotDescription, contentItems: infodot.contentItems }, contentItem, id + "__bibliography");
                        return true;
                    };
                    bibl.onmouseenter = function (pv, e)
                    {
                        this.vc.element.css('cursor', 'pointer');
                        this.vc.element.attr('title', 'View Links, Sources and Attributions');
                        this.vc.requestInvalidate();
                        this.vc.element.css('cursor', 'pointer');
                    };
                    bibl.onmouseleave = function (pv, e)
                    {
                        this.vc.element.css('cursor', 'default');
                        this.vc.element.attr('title', '');
                        this.vc.requestInvalidate();
                        this.vc.element.css('cursor', 'default');
                    };

                    //Parse url for parameter b (bibliography).
                    var bid = window.location.hash.match("b=([a-z0-9_\-]+)");
                    if (bid && bibliographyFlag) {
                        //bid[0] - source string
                        //bid[1] - found match
                        CZ.Bibliography.showBibliography({ infodot: infodotDescription, contentItems: infodot.contentItems }, contentItem, bid[1]);
                    }

                    if (contentItem) {
                        infodot.hasContentItems = true;
                        return {
                            zoomLevel: newZl,
                            content: contentItem
                        };
                    }
                } else {
                    // Tooltip is enabled now.
                    infodot.tooltipEnabled = true;

                    infodot.hasContentItems = false;
                    if (infodot.contentItems.length == 0)
                        return null;

                    var zl = newZl;

                    if (zl <= CZ.Settings.contentItemThumbnailMinLevel) {
                        if (curZl <= CZ.Settings.contentItemThumbnailMinLevel && curZl > 0)
                            return null;
                    }
                    if (zl >= CZ.Settings.contentItemThumbnailMaxLevel) {
                        if (curZl >= CZ.Settings.contentItemThumbnailMaxLevel && curZl < CZ.Settings.infodotShowContentZoomLevel)
                            return null;
                        zl = CZ.Settings.contentItemThumbnailMaxLevel;
                    }
                    if (zl < CZ.Settings.contentItemThumbnailMinLevel) {
                        return {
                            zoomLevel: zl,
                            content: new ContainerElement(vc, layerid, id + "__empty", time, vyc, 0, 0)
                        };
                    }
                    var contentItem = infodot.contentItems[0];
                    var sz = 1 << zl;
                    var thumbnailUri = CZ.Settings.contentItemThumbnailBaseUri + 'x' + sz + '/' + contentItem.guid + '.png';
                    var l = innerRad * 260 / 225;
                    return {
                        zoomLevel: zl,
                        content: new CanvasImage(vc, layerid, id + "@" + zl, thumbnailUri, time - l / 2.0, vyc - l / 2.0, l, l)
                    };
                }
            };

            // Applying Jessica's proportions
            var _rad = 450.0 / 2.0;
            var k = 1.0 / _rad;
            var _wc = (252.0 + 0) * k;
            var _hc = (262.0 + 0) * k;
            var strokeWidth = 3 * k * radv;
            var strokeLength = 24.0 * k * radv;
            var xlt0 = -_wc / 2 * radv + time;
            var ylt0 = -_hc / 2 * radv + vyc;
            var xlt1 = _wc / 2 * radv + time;
            var ylt1 = _hc / 2 * radv + vyc;

            /* Renders an infodot.
            @param ctx              (context2d) Canvas context2d to render on.
            @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
            @param viewport2d       (Viewport2d) current viewport
            @param size_p           ({x,y}) size of bounding box of this element in pixels
            @remarks The method is implemented for each particular VirtualCanvas element.
            */
            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                this.prototype.render.call(this, ctx, visibleBox, viewport2d, size_p, opacity); // rendering the circle

                var sw = viewport2d.widthVirtualToScreen(strokeWidth);
                if (sw < 0.5)
                    return;

                var vyc = infodot.y + radv;
                var xlt0 = -_wc / 2 * radv + time;
                var ylt0 = -_hc / 2 * radv + vyc;
                var xlt1 = _wc / 2 * radv + time;
                var ylt1 = _hc / 2 * radv + vyc;

                var rad = this.width / 2.0;
                var xc = this.x + rad;
                var yc = this.y + rad;
                var radp = size_p.x / 2.0;

                var sl = viewport2d.widthVirtualToScreen(strokeLength);
                var pl0 = viewport2d.pointVirtualToScreen(xlt0, ylt0);
                var pl1 = viewport2d.pointVirtualToScreen(xlt1, ylt1);

                ctx.lineWidth = sw;
                ctx.strokeStyle = CZ.Settings.contentItemBoundingBoxFillColor;
            };

            /* Checks whether the given point (virtual) is inside the object
            (should take into account the shape) */
            this.isInside = function (point_v) {
                var len2 = CZ.Common.sqr(point_v.x - this.x - (this.width / 2)) + CZ.Common.sqr(point_v.y - this.y - (this.height / 2));
                var rad = this.width / 2.0;
                return len2 <= rad * rad;
            };

            this.prototype = new CanvasCircle(vc, layerid, id, time, vyc, radv, { strokeStyle: CZ.Settings.infoDotBorderColor, lineWidth: CZ.Settings.infoDotBorderWidth * radv, fillStyle: CZ.Settings.infoDotFillColor, isLineWidthVirtual: true });
        }

        /*
        @param infodot {CanvasElement}  Parent of the content item
        @param cid  {string}            id of the content item
        Returns {id,x,y,width,height,parent,type,vc} of a content item even if it is not presented yet in the infodot children collection.
        */
        function getContentItem(infodot, cid) {
            if (infodot.type !== 'infodot' || infodot.contentItems.length === 0)
                return null;
            var radv = infodot.width / 2;
            var innerRad = radv - CZ.Settings.infoDotHoveredBorderWidth * radv;
            var citems = buildVcContentItems(infodot.contentItems, infodot.x + infodot.width / 2, infodot.y + infodot.height / 2, innerRad, infodot.vc, infodot.layerid);
            if (!citems)
                return null;
            for (var i = 0; i < citems.length; i++) {
                if (citems[i].id == cid)
                    return {
                        id: cid,
                        x: citems[i].x, y: citems[i].y, width: citems[i].width, height: citems[i].height,
                        parent: infodot,
                        type: "contentItem",
                        vc: infodot.vc
                    };
            }
            return null;
        }
        VCContent.getContentItem = getContentItem;

        /* Adds an infodot composite element into a virtual canvas.
        @param vc        (VirtualCanvas) VirtualCanvas hosting this element
        @param element   (CanvasElement) Parent element, whose children is to be new timeline.
        @param layerid   (any type) id of the layer for this element
        @param id        (any type) id of an element
        @param contentItems (array of { id, date (string), title (string), description (string), mediaUrl (string), mediaType (string) }) content items of the infodot, first is central.
        @returns         root of the content item tree
        */
        function addInfodot(element, layerid, id, time, vyc, radv, contentItems, infodotDescription) {
            var infodot = new CanvasInfodot(element.vc, layerid, id, time, vyc, radv, contentItems, infodotDescription);
            return VCContent.addChild(element, infodot, true);
        }
        VCContent.addInfodot = addInfodot;

        function buildVcContentItems(contentItems, xc, yc, rad, vc, layerid) {
            var n = contentItems.length;
            if (n <= 0)
                return null;

            var _rad = 450.0 / 2.0;
            var k = 1.0 / _rad;
            var _wc = 260.0 * k;
            var _hc = 270.0 * k;

            var _xlc = -_wc / 2 - 38.0 * k;
            var _xrc = -_xlc;
            var _lw = 60.0 * k;
            var _lh = _lw;
            var lw = _lw * rad;
            var lh = _lh * rad;

            var _ytc = -_hc / 2 - 9.0 * k - _lh / 2;
            var _ybc = -_ytc;

            var arrangeLeft = arrangeContentItemsInField(3, _lh);
            var arrangeRight = arrangeContentItemsInField(3, _lh);
            var arrangeBottom = arrangeContentItemsInField(3, _lw);

            var xl = xc + rad * (_xlc - _lw / 2);
            var xr = xc + rad * (_xrc - _lw / 2);
            var yb = yc + rad * (_ybc - _lh / 2);

            // build content items
            var vcitems = [];

            for (var i = 0, len = Math.min(CZ.Settings.infodotMaxContentItemsCount, n); i < len; i++) {
                var ci = contentItems[i];
                if (i === 0) {
                    vcitems.push(new ContentItem(vc, layerid, ci.id, -_wc / 2 * rad + xc, -_hc / 2 * rad + yc, _wc * rad, _hc * rad, ci));
                } else if (i >= 1 && i <= 3) {
                    vcitems.push(new ContentItem(vc, layerid, ci.id, xl, yc + rad * arrangeLeft[(i - 1) % 3], lw, lh, ci));
                } else if (i >= 4 && i <= 6) {
                    vcitems.push(new ContentItem(vc, layerid, ci.id, xr, yc + rad * arrangeRight[(i - 1) % 3], lw, lh, ci));
                } else if (i >= 7 && i <= 9) {
                    vcitems.push(new ContentItem(vc, layerid, ci.id, xc + rad * arrangeBottom[(i - 1) % 3], yb, lw, lh, ci));
                }
            }

            return vcitems;
        }

        /* Arranges given number of content items in a single part of an infodot, along a single coordinate axis (either x or y).
        @param n    (number) Number of content items to arrange
        @param dx   (number) Size of content item along the axis on which we arrange content items.
        @returns null, if n is 0; array of lefts (tops) for each coordinate item. */
        function arrangeContentItemsInField(n, dx) {
            if (n == 0)
                return null;
            var margin = 0.05 * dx;
            var x1, x2, x3, x4;
            if (n % 2 == 0) {
                // 3 1 2 4
                x1 = -margin / 2 - dx;
                x2 = margin / 2;
                if (n == 4) {
                    x3 = x1 - dx - margin;
                    x4 = x2 + margin + dx;
                    return [x3, x1, x2, x4];
                }
                return [x1, x2];
            } else {
                // 3 1 2
                x1 = -dx / 2;
                if (n > 1) {
                    x2 = dx / 2 + margin;
                    x3 = x1 - dx - margin;
                    return [x3, x1, x2];
                }
                return [x1];
            }
        }
    })(CZ.VCContent || (CZ.VCContent = {}));
    var VCContent = CZ.VCContent;
})(CZ || (CZ = {}));
﻿/// <reference path='common.ts'/>
/// <reference path='viewport-animation.ts'/>
var CZ;
(function (CZ) {
    (function (ViewportController) {
        //constructs the new instance of the viewportController that handles an animations of the viewport
        //@param setVisible (void setVisible(visible))      a callback which is called when controller wants to set intermediate visible regions while animation.
        //@param getViewport (Viewport2D getViewport())     a callback which is called when controller wants to get recent state of corresponding viewport.
        //@param gestureSource (merged RX gesture stream)   an RX stream of gestures described in gestures.js
        function ViewportController2(setVisible, getViewport, gesturesSource) {
            this.activeAnimation; //currently running animation. undefined if no animation active

            //recent FPS value
            this.FPS;

            //the outer visible scale that is permitied to observe.
            //it is automaticly adjusted on each viewport resize event not to let the user observe the interval
            //greater that "maxPermitedTimeRange" interval in settings.cs
            this.maximumPermitedScale;

            //the range that are permited to navigate
            //these values are automaticly updated at each new gesture handling according to present scale of the viewport
            //to adjust an offset in virtual coords that is specified in a settings.cs in a pixels
            //through updatePermitedBounds function
            this.leftPermitedBound;
            this.rightPermitedBound;
            this.topPermitedBound;
            this.bottomPermitedBound;

            //a scale constraint value to prevent the user from zooming too deep into the infodot, contentItem, etc
            //is used in coerceVisibleInnerZoom, and overrides the timelines zooming constraints
            //is to be set by the page that join the controller and the virtual canvas
            //(number)
            this.effectiveExplorationZoomConstraint = undefined;

            // an animation frame enqueueing function. It is used to schedula a new animation frame
            if (!window.requestAnimFrame)
                window.requestAnimFrame = function (callback) {
                    window.setTimeout(callback, 1000 / CZ.Settings.targetFps); // scheduling frame rendering timer
                };

            //storing screen size to detect window resize
            this.viewportWidth;
            this.viewportHeight;

            //storing callbacks
            this.setVisible = setVisible;
            this.getViewport = getViewport;

            //the latest known state of the viewport
            var self = this;

            //an estimated viewport state that will be at the and of the ongoing pan/zoom animation
            this.estimatedViewport = undefined;

            //a recent copy of the viewport;
            this.recentViewport = undefined;

            //callbacks array. each element will be invoked when animation is completed (viewport took the required state)
            //callback has one argument - the id of complete animation
            this.onAnimationComplete = [];

            //callbacks array. each element will be invoked when the animation parameters are updated or new animation activated
            //callback has two arguments - (the id of interupted animation,the id of newly created animation)
            //if animation is interrapted and no new animation obect is created, a newly created animation id is undefined
            //if anumation is updated and no new animation object is created, a created id is the same as an interrupted id
            this.onAnimationUpdated = [];

            //callbacks array. each element will be invoked when the animation starts
            //callback has one argument - (the id of started animation)
            this.onAnimationStarted = [];

            /*Transforms the viewport correcting its visible according to pan gesture passed
            @param viewport     (Viewport2D)    The viewport to transform
            @param gesture      (PanGesture) The gesture to apply
            */
            function PanViewport(viewport, panGesture) {
                var virtualOffset = viewport.vectorScreenToVirtual(panGesture.xOffset, panGesture.yOffset);
                var oldVisible = viewport.visible;
                viewport.visible.centerX = oldVisible.centerX - virtualOffset.x;
                viewport.visible.centerY = oldVisible.centerY - virtualOffset.y;
            }

            /*Transforms the viewport correcting its visible according to zoom gesture passed
            @param viewport     (Viewport2D)    The viewport to transform
            @param gesture      (ZoomGesture) The gesture to apply
            */
            function ZoomViewport(viewport, zoomGesture) {
                var oldVisible = viewport.visible;
                var x = zoomGesture.xOrigin + (viewport.width / 2.0 - zoomGesture.xOrigin) * zoomGesture.scaleFactor;
                var y = zoomGesture.yOrigin + (viewport.height / 2.0 - zoomGesture.yOrigin) * zoomGesture.scaleFactor;
                var newCenter = viewport.pointScreenToVirtual(x, y);
                viewport.visible.centerX = newCenter.x;
                viewport.visible.centerY = newCenter.y;
                viewport.visible.scale = oldVisible.scale * zoomGesture.scaleFactor;
            }

            /*calculates a viewport that will be actual at the end of the gesture handling animation
            @param previouslyEstimatedViewport       (Viewport2D)    the state of the viewport that is expacted to be at the end of the ongoing Pan/Zoom animation. undefined if no pan/zoom animation is active
            @param gesture                  (Gesture)       the gesture to handle (only Pan and Zoom gesture)
            @param latestViewport           (Viewport2D)    the state of the viewort that is currently observed by the user
            @remarks    The is no checks for gesture type. So make shure that the gestures only of pan and zoom types would be passed to this method
            */
            function calculateTargetViewport(latestViewport, gesture, previouslyEstimatedViewport) {
                var latestVisible = latestViewport.visible;
                var initialViewport;
                if (gesture.Type == "Zoom") {
                    if (gesture.Source == "Touch") {
                        if (previouslyEstimatedViewport)
                            initialViewport = previouslyEstimatedViewport;
                        else {
                            initialViewport = new CZ.Viewport.Viewport2d(latestViewport.aspectRatio, latestViewport.width, latestViewport.height, new CZ.Viewport.VisibleRegion2d(latestVisible.centerX, latestVisible.centerY, latestVisible.scale));
                        }
                    } else {
                        initialViewport = new CZ.Viewport.Viewport2d(latestViewport.aspectRatio, latestViewport.width, latestViewport.height, new CZ.Viewport.VisibleRegion2d(latestVisible.centerX, latestVisible.centerY, latestVisible.scale));
                    }

                    //calculating changed viewport according to the gesture
                    ZoomViewport(initialViewport, gesture);
                } else {
                    if (previouslyEstimatedViewport)
                        initialViewport = previouslyEstimatedViewport;
                    else {
                        //there is no previously estimated viewport and there is no currently active Pan/Zoom animation. Cloning latest viewport (deep copy)
                        initialViewport = new CZ.Viewport.Viewport2d(latestViewport.aspectRatio, latestViewport.width, latestViewport.height, new CZ.Viewport.VisibleRegion2d(latestVisible.centerX, latestVisible.centerY, latestVisible.scale));
                    }

                    //calculating changed viewport according to the gesture
                    PanViewport(initialViewport, gesture);
                }

                self.coerceVisible(initialViewport, gesture); //applying navigaion constraints
                return initialViewport;
            }

            /*
            Saves the height and the width of the viewport in screen coordinates and recalculates rependant characteristics (e.g. maximumPermitedScale)
            @param viewport  (Viewport2D) a viewport to take parameters from
            */
            this.saveScreenParameters = function (viewport) {
                self.viewportWidth = viewport.width;
                self.viewportHeight = viewport.height;
            };

            /*
            Is used for coercing of the visible regions produced by the controller according to navigation constraints
            Navigation constraints are set in settings.js file
            @param vp (Viewport) the viewport.visible region to coerce
            @param gesture the gesture which caused the viewport to change
            we need the viewport (width, height) and the (zoom)gesture to
            undo the (zoom)gesture when it exceed the navigation constraints
            */
            this.coerceVisible = function (vp, gesture) {
                this.coerceVisibleInnerZoom(vp, gesture);
                this.coerceVisibleOuterZoom(vp, gesture);
                this.coerceVisibleHorizontalBound(vp);
                this.coerceVisibleVerticalBound(vp);
            };

            this.coerceVisibleOuterZoom = function (vp, gesture) {
                if (gesture.Type === "Zoom") {
                    var visible = vp.visible;
                    if (typeof CZ.Common.maxPermitedScale != 'undefined' && CZ.Common.maxPermitedScale) {
                        if (visible.scale > CZ.Common.maxPermitedScale) {
                            gesture.scaleFactor = CZ.Common.maxPermitedScale / visible.scale;
                            ZoomViewport(vp, gesture);
                        }
                    }
                }
            };

            /*
            Applys out of bounds constraint to the visible region (Preventing the user from observing the future time and the past before set treshold)
            The bounds are set as maxPermitedTimeRange variable in a settings.js file
            @param vp (Viewport) the viewport.visible region to coerce
            */
            this.coerceVisibleHorizontalBound = function (vp) {
                var visible = vp.visible;
                if (CZ.Settings.maxPermitedTimeRange) {
                    if (visible.centerX > CZ.Settings.maxPermitedTimeRange.right)
                        visible.centerX = CZ.Settings.maxPermitedTimeRange.right;
                    else if (visible.centerX < CZ.Settings.maxPermitedTimeRange.left)
                        visible.centerX = CZ.Settings.maxPermitedTimeRange.left;
                }
            };

            /*
            Applys out of bounds constraint to the visible region (Preventing the user from observing the future time and the past before set treshold)
            The bounds are set as maxPermitedTimeRange variable in a settings.js file
            @param vp (Viewport) the viewport.visible region to coerce
            */
            this.coerceVisibleVerticalBound = function (vp) {
                var visible = vp.visible;
                if (CZ.Common.maxPermitedVerticalRange) {
                    if (visible.centerY > CZ.Common.maxPermitedVerticalRange.bottom)
                        visible.centerY = CZ.Common.maxPermitedVerticalRange.bottom;
                    else if (visible.centerY < CZ.Common.maxPermitedVerticalRange.top)
                        visible.centerY = CZ.Common.maxPermitedVerticalRange.top;
                }
            };

            /*
            Applys a deeper zoom constraint to the visible region
            Deeper (minimum scale) zoom constraint is set as deeperZoomConstraints array in a settings.js file
            @param vp (Viewport) the viewport.visible region to coerce
            @param gesture the gesture which caused the viewport to change
            */
            this.coerceVisibleInnerZoom = function (vp, gesture) {
                var visible = vp.visible;
                var x = visible.centerX;
                var scale = visible.scale;
                var constr = undefined;
                if (this.effectiveExplorationZoomConstraint)
                    constr = this.effectiveExplorationZoomConstraint;
                else
                    for (var i = 0; i < CZ.Settings.deeperZoomConstraints.length; i++) {
                        var possibleConstr = CZ.Settings.deeperZoomConstraints[i];
                        if (possibleConstr.left <= x && possibleConstr.right > x) {
                            constr = possibleConstr.scale;
                            break;
                        }
                    }
                if (constr) {
                    if (scale < constr) {
                        visible.scale = constr;
                    }
                }
            };

            self.updateRecentViewport = function () {
                var vp = getViewport();
                var vis = vp.visible;
                self.recentViewport = new CZ.Viewport.Viewport2d(vp.aspectRatio, vp.width, vp.height, new CZ.Viewport.VisibleRegion2d(vis.centerX, vis.centerY, vis.scale));
            };

            var requestTimer = null;
            this.getMissingData = function (vbox, lca) {
                // request new data only in case if authoring is not active
                if (typeof CZ.Authoring === 'undefined' || CZ.Authoring.isActive === false) {
                    window.clearTimeout(requestTimer);
                    requestTimer = window.setTimeout(function () {
                        getMissingTimelines(vbox, lca);
                    }, 1000);
                }
            };

            function getMissingTimelines(vbox, lca) {
                CZ.Data.getTimelines({
                    lca: lca.guid,
                    start: vbox.left,
                    end: vbox.right,
                    minspan: CZ.Settings.minTimelineWidth * vbox.scale
                }).then(function (response) {
                    CZ.Layout.Merge(response, lca);
                    // NYI: Server currently does not support incremental data. Consider/Future:
                    //      var exhibitIds = extractExhibitIds(response);
                    //      getMissingExhibits(vbox, lca, exhibitIds);
                }, function (error) {
                    console.log("Error connecting to service:\n" + error.responseText);
                });
            }

            function getMissingExhibits(vbox, lca, exhibitIds) {
                CZ.Service.postData({
                    ids: exhibitIds
                }).then(function (response) {
                    MergeContentItems(lca, exhibitIds, response.exhibits);
                }, function (error) {
                    console.log("Error connecting to service:\n" + error.responseText);
                });
            }

            function extractExhibitIds(timeline) {
                var ids = [];
                if (timeline.exhibits instanceof Array) {
                    timeline.exhibits.forEach(function (childExhibit) {
                        ids.push(childExhibit.id);
                    });
                }
                if (timeline.timelines instanceof Array) {
                    timeline.timelines.forEach(function (childTimeline) {
                        ids = ids.concat(extractExhibitIds(childTimeline));
                    });
                }
                return ids;
            }

            function MergeContentItems(timeline, exhibitIds, exhibits) {
                timeline.children.forEach(function (child) {
                    if (child.type === "infodot") {
                        var idx = exhibitIds.indexOf(child.guid);
                        if (idx !== -1) {
                            child.contentItems = exhibits[idx].contentItems;
                        }
                    }
                });

                timeline.children.forEach(function (child) {
                    if (child.type === "timeline")
                        MergeContentItems(child, exhibitIds, exhibits);
                });
            }

            gesturesSource.Subscribe(function (gesture) {
                if (typeof gesture != "undefined" && !CZ.Authoring.isActive) {
                    var isAnimationActive = self.activeAnimation;
                    var oldId = isAnimationActive ? self.activeAnimation.ID : undefined;

                    self.updateRecentViewport();
                    var latestViewport = self.recentViewport;

                    if (gesture.Type == "Pin") {
                        self.stopAnimation();
                        return;
                    }

                    if (gesture.Type == "Pan" || gesture.Type == "Zoom") {
                        var newlyEstimatedViewport = calculateTargetViewport(latestViewport, gesture, self.estimatedViewport);

                        var vbox = CZ.Common.viewportToViewBox(newlyEstimatedViewport);
                        var wnd = new CZ.VCContent.CanvasRectangle(null, null, null, vbox.left, vbox.top, vbox.width, vbox.height, null);

                        //if (!CZ.Common.vc.virtualCanvas("inBuffer", wnd, newlyEstimatedViewport.visible.scale)) {
                        //    var lca = CZ.Common.vc.virtualCanvas("findLca", wnd);
                        //    self.getMissingData(vbox, lca);
                        //}
                        if (!self.estimatedViewport) {
                            self.activeAnimation = new CZ.ViewportAnimation.PanZoomAnimation(latestViewport);

                            //storing size to handle window resize
                            self.saveScreenParameters(latestViewport);
                        }

                        if (gesture.Type == "Pan")
                            self.activeAnimation.velocity = CZ.Settings.panSpeedFactor * 0.001; // is baseline coefficient for animation speed to make not very slow and not very fast. it can be altered with a panSpeedFactor value in settings.js
                        else
                            self.activeAnimation.velocity = CZ.Settings.zoomSpeedFactor * 0.0025; // is baseline coefficient for animation speed to make not very slow and not very fast. it can be altered with a zoomSpeedFactor value in settings.js

                        //set or update the target state of the viewport
                        self.activeAnimation.setTargetViewport(newlyEstimatedViewport);
                        self.estimatedViewport = newlyEstimatedViewport;
                    }

                    if (oldId != undefined)
                        animationUpdated(oldId, self.activeAnimation.ID); //notifing that the animation was updated
                    else
                        AnimationStarted(self.activeAnimation.ID);

                    if (!isAnimationActive)
                        self.animationStep(self);
                }
            });

            self.updateRecentViewport();
            this.saveScreenParameters(self.recentViewport);

            //requests to stop any ongoing animation
            this.stopAnimation = function () {
                self.estimatedViewport = undefined;
                if (self.activeAnimation) {
                    self.activeAnimation.isForciblyStoped = true;
                    self.activeAnimation.isActive = false;

                    animationUpdated(self.activeAnimation.ID, undefined);
                }
            };

            /*
            Notify all subscribers that the ongoiung animation is updated (or halted)
            */
            function animationUpdated(oldId, newId) {
                for (var i = 0; i < self.onAnimationUpdated.length; i++)
                    self.onAnimationUpdated[i](oldId, newId);
            }

            /*
            Notify all subscribers that the animation is started
            */
            function AnimationStarted(newId) {
                for (var i = 0; i < self.onAnimationStarted.length; i++)
                    self.onAnimationStarted[i](newId);
            }

            //sets visible and schedules a new call of animation step if the animation still active and needs more frames
            this.animationStep = function (self) {
                if (self.activeAnimation) {
                    if (self.activeAnimation.isActive)
                        window.requestAnimFrame(function () {
                            self.animationStep(self);
                        });
                    else {
                        var stopAnimationID = self.activeAnimation.ID;

                        self.updateRecentViewport();
                        setVisible(new CZ.Viewport.VisibleRegion2d(self.recentViewport.visible.centerX, self.recentViewport.visible.centerY, self.recentViewport.visible.scale)); //other components may suppose that it would be more frames by looking at activeAnimation property, so draw the last frame
                        if (!self.activeAnimation.isForciblyStoped)
                            for (var i = 0; i < self.onAnimationComplete.length; i++)
                                self.onAnimationComplete[i](stopAnimationID);
                        self.activeAnimation = undefined;
                        self.estimatedViewport = undefined;
                        return;
                    }

                    var vp = self.recentViewport;
                    if (self.viewportWidth != vp.width || self.viewportHeight != vp.height)
                        self.stopAnimation();

                    var vis = self.activeAnimation.produceNextVisible(vp);
                    setVisible(vis); //redrawing new visible region
                }

                this.frames++;
                this.oneSecondFrames++;

                var e = CZ.Common.vc.virtualCanvas("getLastEvent");
                if (e != null) {
                    CZ.Common.vc.virtualCanvas("mouseMove", e);
                }
            };

            //FrameRate calculation related
            this.frames = 0;
            this.oneSecondFrames = 0;
            window.setInterval(function () {
                self.FPS = self.oneSecondFrames;
                self.oneSecondFrames = 0;
            }, 1000); //one call per second

            //tests related accessors
            this.PanViewportAccessor = PanViewport;

            //preforms an elliptical zoom to the passed visible region
            //param visible (Visible2D) a visible region to zoom into
            //param noAnimation (bool) - method performs instant transition without any animation if true
            this.moveToVisible = function (visible, noAnimation) {
                var currentViewport = getViewport();
                var targetViewport = new CZ.Viewport.Viewport2d(currentViewport.aspectRatio, currentViewport.width, currentViewport.height, visible);
                var vbox = CZ.Common.viewportToViewBox(targetViewport);
                var wnd = new CZ.VCContent.CanvasRectangle(null, null, null, vbox.left, vbox.top, vbox.width, vbox.height, null);

                //if (!CZ.Common.vc.virtualCanvas("inBuffer", wnd, targetViewport.visible.scale)) {
                //    var lca = CZ.Common.vc.virtualCanvas("findLca", wnd);
                //    self.getMissingData(vbox, lca);
                //}
                if (noAnimation) {
                    self.stopAnimation();
                    self.setVisible(visible);
                    return;
                }

                var wasAnimationActive = false;
                var oldId = undefined;
                if (this.activeAnimation) {
                    wasAnimationActive = this.activeAnimation.isActive;
                    oldId = this.activeAnimation.ID;
                }

                self.updateRecentViewport();
                var vp = self.recentViewport;
                this.estimatedViewport = undefined;
                this.activeAnimation = new CZ.ViewportAnimation.EllipticalZoom(vp.visible, visible);

                //storing size to handle window resize
                self.viewportWidth = vp.width;
                self.viewportHeight = vp.height;

                if (!wasAnimationActive) {
                    if (this.activeAnimation.isActive)
                        AnimationStarted(this.activeAnimation.ID);

                    // Added by Dmitry Voytsekhovskiy, 20/06/2013
                    // I make the animation step call asynchronous to first return the active animation id, then call the step.
                    // This would fix a bug when a target viewport is very close to the current viewport and animation finishes in a single step,
                    // hence it calls the animation completed handlers which accept the animation id, but these handler couldn't yet get the id to expect
                    // if the call is synchronous.
                    setTimeout(function () {
                        return self.animationStep(self);
                    }, 0);
                } else {
                    animationUpdated(oldId, this.activeAnimation.ID);
                }

                return (this.activeAnimation) ? this.activeAnimation.ID : undefined;
            };
            //end of public fields
        }
        ViewportController.ViewportController2 = ViewportController2;
    })(CZ.ViewportController || (CZ.ViewportController = {}));
    var ViewportController = CZ.ViewportController;
})(CZ || (CZ = {}));
﻿/// <reference path='vccontent.ts'/>
var CZ;
(function (CZ) {
    (function (UrlNav) {
        // Helper routines to perform URL to/from visible conversion
        UrlNav.navigationAnchor = null;

        /* Builds a navigation string for the given typed virtual canvas element.
        @param vcelem   (CanvasElement) An element of a virtual canvas.
        @scale          (number) Optional scale (default is 1.0) that is a factor on the element size.
        
        Remarks:
        Example of the navigation string is '/t10/t24/e12/c10@w=1.5&h=1.0&x=0.33&y=0.25' which means
        timeline with id 10
        which has child timeline with id 25
        which has child infodot with id 12
        which has child contentItem with id 10
        with position (0.33,0.255) of the visible region center so left-upper corner is (0,0), right-bottom is (1,1)
        with width 1.5x size of the element width so height 1.0 shows entire element vertically.
        */
        function vcelementToNavString(vcElem, vp) {
            var nav = '';
            var el = vcElem;
            while (vcElem) {
                if (vcElem.type) {
                    nav = '/' + vcElem.id + nav;
                }
                vcElem = vcElem.parent;
            }
            if (nav && nav !== '' && vp) {
                var rx = (vp.visible.centerX - (el.x + el.width / 2)) / el.width;
                var ry = (vp.visible.centerY - (el.y + el.height / 2)) / el.height;
                var rw = vp.widthScreenToVirtual(vp.width) / el.width;
                var rh = vp.heightScreenToVirtual(vp.height) / el.height;
                var URL = getURL();

                nav += '@x=' + rx + "&y=" + ry + "&w=" + rw + "&h=" + rh;

                if (typeof URL.hash.params != 'undefined') {
                    if (typeof URL.hash.params['tour'] != 'undefined')
                        nav += "&tour=" + URL.hash.params["tour"];

                    if (typeof URL.hash.params['bookmark'] != 'undefined')
                        nav += "&bookmark=" + URL.hash.params["bookmark"];
                    //if (typeof URL.hash.params['b'] != 'undefined')
                    //    nav += "&b=" + URL.hash.params["b"];
                }
            }
            return nav;
        }
        UrlNav.vcelementToNavString = vcelementToNavString;

        /* Finds a virtual canvas element by given navigation string without scale.
        @param nav      (String) A navigation string.
        @param root     (CanvasElement) Root element for the canvas tree.
        @returns {x,y,width,height} or null.
        
        Remarks:
        Example of the navigation string is '/t10/t24/e12/c10' which means
        timeline with id 10
        which has child timeline with id 25
        which has child infodot with id 12
        which has child contentItem with id 10
        #/t55/e118
        */
        function navStringTovcElement(nav, root) {
            if (!nav)
                return null;
            try  {
                var k = nav.indexOf('@');
                if (k >= 0) {
                    nav = nav.substr(0, k);
                }
                var path = nav.split('/');
                if (path.length <= 1)
                    return null;

                var lookup = function (id, root) {
                    /* Commented !root.hasContentItems to avoid error, when root.hasContentItems not set to false in onIsRenderedChanged of CanvasDynamicLOD in vccontent.js when object
                    is not rendered. */
                    if (typeof root.type !== 'undefined' && root.type === 'infodot') {
                        // If we are looking for a content item ('c...'), it is possible that they are not loaded actually in a virtual canvas.
                        return CZ.VCContent.getContentItem(root, id);
                    }
                    if (!root.children || root.children.length == 0)
                        return null;

                    var isTyped = false;
                    for (var i = 0; i < root.children.length; i++) {
                        var child = root.children[i];
                        if (!isTyped) {
                            if (child.type)
                                isTyped = true;
                        }
                        if (isTyped) {
                            if (child.id === id)
                                return child;
                        }
                    }
                    if (isTyped)
                        return null;
                    for (var i = 0; i < root.children.length; i++) {
                        var found = lookup(id, root.children[i]);
                        if (found)
                            return found;
                    }
                    return null;
                };

                for (var n = 1; n < path.length; n++) {
                    var id = path[n];
                    root = lookup(id, root);
                    if (root == null)
                        return null;
                }
                return root;
            } catch (e) {
                return root;
            }
        }
        UrlNav.navStringTovcElement = navStringTovcElement;

        /* Builds VisibleRegion2d from the navigation string for the virtual canvas.
        @param nav      (String) A navigation string.
        @param vc       jquery's virtual canvas widget
        
        Remarks:
        Example of the navigation string is '/t10/t24/e12/c10' which means
        timeline with id 10
        which has child timeline with id 25
        which has child infodot with id 12
        which has child contentItem with id 10
        #/t55/e118
        */
        function navStringToVisible(nav, vc) {
            var k = nav.indexOf('@');
            var w = 1.05;
            var h = 1.05;
            var x = 0;
            var y = 0;
            if (k >= 0) {
                if (k == 0)
                    return null;
                var s = nav.substr(k + 1);
                nav = nav.substr(0, k);
                var parts = s.split('&');
                for (var i = 0; i < parts.length; i++) {
                    var start = parts[i].substring(0, 2);
                    if (start == "x=")
                        x = parseFloat(parts[i].substring(2));
                    else if (start == "y=")
                        y = parseFloat(parts[i].substring(2));
                    else if (start == "w=")
                        w = parseFloat(parts[i].substring(2));
                    else if (start == "h=")
                        h = parseFloat(parts[i].substring(2));
                }
            }

            var element = navStringTovcElement(nav, vc.virtualCanvas("getLayerContent"));
            if (!element)
                return null;

            var vp = vc.virtualCanvas("getViewport");

            var xc = element.x + element.width / 2 + x * element.width;
            var yc = element.y + element.height / 2 + y * element.height;
            var wc = w * element.width;
            var hc = h * element.height;

            // Adjusting the w,h to current aspect ratio:
            var ar0 = vp.width / vp.height;
            var ar1 = wc / hc;
            if (ar0 > ar1) {
                wc = ar0 * hc;
            }
            var scale = wc / vp.width;
            var vis2 = {
                centerX: xc,
                centerY: yc,
                scale: scale
            };
            return vis2;
        }
        UrlNav.navStringToVisible = navStringToVisible;

        /* Returns structure built from URL string
        Remarks:
        Example of the navigation string is 'http://localhost:4949/cz.htm?a=b&c=d#/t55/t174/t66@x=0.06665506329113924&y=-0.03591540681832514' which means
        Example of strcuture:
        URLstrcut = Object()
        {
        host = "localhost"
        port = "4949"
        protocol = "http"
        path = "cz.htm"
        params = Array()
        {
        [a] = "b"
        [c] = "d"
        }
        hash = Object()
        {
        path = "/t55/t174/t66"
        params = Array()
        {
        [x] = "0.06665506329113924"
        [y] = "-0.03591540681832514"
        }
        }
        }
        
        Usage example:
        var URL = getURL();
        URL.hash.params["a"] = "d";
        delete URL.hash.params["c"];
        setURL(URL);
        
        Note to check object fields for 'null' & 'undefined'. If URL string has no parameters, there is not array.
        */
        function getURL() {
            var url;

            var loc = document.location.toString().split("#");
            var path = loc[0];
            var hash = loc[1];
            var expr = new RegExp("^(https|http):\/\/([a-z_0-9\-.]{4,})(?:\:([0-9]{1,5}))?(?:\/*)([a-z\-_0-9\/.%]*)[?]?([a-z\-_0-9=&]*)$", "i");
            var result = path.match(expr);
            if (result != null) {
                url = {
                    protocol: result[1],
                    host: result[2],
                    port: result[3]
                };

                //If PATH parameters exist
                if (result[4] != "") {
                    url.path = result[4].split("/");

                    if (url.path.length >= 1 && url.path[0].length > 0 && url.path[0] !== "cz.html") {
                        url.superCollectionName = url.path[0];
                    }
                    if (url.path.length >= 2 && url.path[1].length > 0) {
                        url.collectionName = url.path[1];
                    }
                    if (url.path.length >= 3 && url.path[url.path.length - 1].length > 0) {
                        url.content = url.path[url.path.length - 1];
                    }
                }

                //If GET parameters exists
                if (result[5] != "") {
                    url.params = [];
                    var getParams = result[5].split("&");
                    for (var i = 0; i < getParams.length; i++) {
                        var pair = getParams[i].split("=");
                        url.params[pair[0]] = pair[1];
                    }
                }
            } else {
                window.location.href = "fallback.html";
            }

            url.hash = {
                params: [],
                path: ""
            };

            if (typeof hash != 'undefined') {
                var h = hash.split("@");
                url.hash = { path: h[0] };

                //If hash parameters exists
                if (h.length > 1 && h[1] != "") {
                    var hashParams = new String(h[1]).split("&");
                    url.hash.params = [];
                    for (var i = 0; i < hashParams.length; i++) {
                        var pair = hashParams[i].split("=");
                        url.hash.params[pair[0]] = pair[1];
                    }
                }
            }
            return url;
        }
        UrlNav.getURL = getURL;

        /* Set current URL string to address given in parameter
        @param url (Object) URL structure generated by getURL() function
        @param reload (boolean) Not required. Some kind of security. If changing hash string not page reload required. In case when we need to chenge GET parameters page reload in necessary.
        IF reload = true, full URL modifications, this may reload page if needed.
        IF reload = false, hash modification only, no page reload
        */
        function setURL(url, reload) {
            if (reload == null) {
                reload = false;
            } else {
                reload = true;
            }
            if (url == null)
                window.location.href = "fallback.html";

            var path = url.protocol + "://" + url.host + ((url.port != "") ? (":" + url.port) : ("")) + "/" + (url.path === undefined ? "" : url.path.join('/'));

            var params = new Array();
            for (var key in url.params) {
                params.push(key + "=" + url.params[key]);
            }

            path += ((url.params != null) ? ("?" + params.join("&")) : (""));

            var hash = url.hash.path;
            var hash_params = [];
            for (var key in url.hash.params) {
                hash_params.push(key + "=" + url.hash.params[key]);
            }
            hash += ("@" + hash_params.join("&"));
            var loc = path + "#" + hash;

            //hashHandle = false;
            if (reload == true) {
                window.location.href = loc;
            } else {
                window.location.hash = hash;
            }
        }
        UrlNav.setURL = setURL;
    })(CZ.UrlNav || (CZ.UrlNav = {}));
    var UrlNav = CZ.UrlNav;
})(CZ || (CZ = {}));
﻿/// <reference path='settings.ts'/>
/// <reference path='vccontent.ts'/>
/// <reference path='common.ts'/>
/// <reference path='viewport.ts'/>
/// <reference path='viewport-animation.ts'/>
var CZ;
(function (CZ) {
    (function (Layout) {
        var isLayoutAnimation = true;

        Layout.animatingElements = {
            length: 0
        };

        Layout.timelineHeightRate = 0.4;

        function Timeline(title, left, right, childTimelines, exhibits) {
            this.Title = title;
            this.left = left;
            this.right = right;
            this.ChildTimelines = childTimelines;
            this.Exhibits = exhibits;
        }

        function Infodot(x, contentItems) {
            this.x = x;
            this.ContentItems = contentItems;
        }

        function titleObject(name) {
            this.name = name;
        }

        function Prepare(timeline) {
            timeline.left = CZ.Dates.getCoordinateFromDecimalYear(timeline.start);
            timeline.right = CZ.Dates.getCoordinateFromDecimalYear(timeline.end);

            // save timeline end date in case if it is '9999'
            timeline.endDate = timeline.end;

            if (timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (exhibit) {
                    exhibit.x = CZ.Dates.getCoordinateFromDecimalYear(exhibit.time);

                    exhibit.contentItems.forEach(function (contentItem) {
                        // For content items that contain an extension, activate it.
                        CZ.Extensions.activateExtension(contentItem.mediaType);
                    });
                });
            }

            if (timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (childTimeline) {
                    childTimeline.ParentTimeline = timeline;
                    Prepare(childTimeline);
                });
            }

            GenerateAspect(timeline);
            if (timeline.Height)
                timeline.Height /= 100;
            else if (!timeline.AspectRatio && !timeline.Height)
                timeline.Height = CZ.Layout.timelineHeightRate;
        }

        function GenerateAspect(timeline) {
            timeline.AspectRatio = timeline.aspectRatio || 10;
        }

        function LayoutTimeline(timeline, parentWidth, measureContext) {
            var headerPercent = CZ.Settings.timelineHeaderSize + 2 * CZ.Settings.timelineHeaderMargin;
            var timelineWidth = timeline.right - timeline.left;
            timeline.width = timelineWidth;

            //If child timeline has fixed aspect ratio, calculate its height according to it
            if (timeline.AspectRatio && !timeline.height) {
                timeline.height = timelineWidth / timeline.AspectRatio;
            }

            if (timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    //If child timeline has fixed aspect ratio, calculate its height according to it
                    if (tl.AspectRatio) {
                        tl.height = (tl.right - tl.left) / tl.AspectRatio;
                    } else if (timeline.height && tl.Height) {
                        //If Child timeline has height in percentage of parent, calculate it before layout pass
                        tl.height = Math.min(timeline.height * tl.Height, (tl.right - tl.left) * CZ.Settings.timelineMinAspect);
                    }

                    //Calculate layout for each child timeline
                    LayoutTimeline(tl, timelineWidth, measureContext);
                });
            }

            if (!timeline.height) {
                //Searching for timeline with the biggest ratio between its height percentage and real height
                var scaleCoef = undefined;
                if (timeline.timelines instanceof Array) {
                    timeline.timelines.forEach(function (tl) {
                        if (tl.Height && !tl.AspectRatio) {
                            var localScale = tl.height / tl.Height;
                            if (!scaleCoef || scaleCoef < localScale)
                                scaleCoef = localScale;
                        }
                    });
                }

                //Scaling timelines to make their percentages corresponding to each other
                if (scaleCoef) {
                    if (timeline.timelines instanceof Array) {
                        timeline.timelines.forEach(function (tl) {
                            if (tl.Height && !tl.AspectRatio) {
                                var scaleParam = scaleCoef * tl.Height / tl.height;
                                if (scaleParam > 1) {
                                    tl.realY *= scaleParam;
                                    Scale(tl, scaleParam, measureContext);
                                }
                            }
                        });
                    }

                    //Set final timelineHeight
                    timeline.height = scaleCoef;
                }
            }

            //Now positioning child content and title
            var exhibitSize = CalcInfodotSize(timeline);

            //Layout only timelines to check that they fit into parent timeline
            var tlRes = LayoutChildTimelinesOnly(timeline);

            //First layout iteration of full content (taking Sequence in account)
            var res = LayoutContent(timeline, exhibitSize);
            if (timeline.height) {
                var titleObject = GenerateTitleObject(timeline.height, timeline, measureContext);

                if (timeline.exhibits instanceof Array) {
                    if (timeline.exhibits.length > 0 && (tlRes.max - tlRes.min) < timeline.height) {
                        while ((res.max - res.min) > (timeline.height - titleObject.bboxHeight) && exhibitSize > timelineWidth / 20.0) {
                            exhibitSize /= 1.5;
                            res = LayoutContent(timeline, exhibitSize);
                        }
                    }
                }

                if ((res.max - res.min) > (timeline.height - titleObject.bboxHeight)) {
                    //console.log("Warning: Child timelines and exhibits doesn't fit into parent. Timeline name: " + timeline.title);
                    var contentHeight = res.max - res.min;
                    var fullHeight = contentHeight / (1 - headerPercent);
                    var titleObject = GenerateTitleObject(fullHeight, timeline, measureContext);
                    timeline.height = fullHeight;
                } else {
                    //var scale = (timeline.height - titleObject.bboxHeight) / (res.max - res.min);
                    //if (scale > 1) {
                    //    timeline.timelines.forEach(function (tl) {
                    //        tl.realY *= scale;
                    //        if (!tl.AspectRatio)
                    //            Scale(tl, scale, measureContext);
                    //    });
                    //    timeline.exhibits.forEach(function (eb) {
                    //        eb.realY *= scale;
                    //    });
                    //}
                }

                timeline.titleRect = titleObject;
            } else {
                var min = res.min;
                var max = res.max;

                var minAspect = 1.0 / CZ.Settings.timelineMinAspect;
                var minHeight = timelineWidth / minAspect;

                //Measure title
                var contentHeight = Math.max((1 - headerPercent) * minHeight, max - min);
                var fullHeight = contentHeight / (1 - headerPercent);
                var titleObject = GenerateTitleObject(fullHeight, timeline, measureContext);
                timeline.titleRect = titleObject;
                timeline.height = fullHeight;
            }

            timeline.heightEps = parentWidth * CZ.Settings.timelineContentMargin;
            timeline.realHeight = timeline.height + 2 * timeline.heightEps;
            timeline.realY = 0;

            if (timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (infodot) {
                    infodot.realY -= res.min;
                });
            }

            if (timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    tl.realY -= res.min;
                });
            }
        }

        function PositionContent(contentArray, arrangedArray, intersectionFunc) {
            contentArray.forEach(function (el) {
                var usedY = new Array();

                arrangedArray.forEach(function (ael) {
                    if (intersectionFunc(el, ael)) {
                        usedY.push({ top: ael.realY + ael.realHeight, bottom: ael.realY });
                    }
                });

                var y = 0;

                if (usedY.length > 0) {
                    //Find free segments
                    var segmentPoints = new Array();
                    usedY.forEach(function (segment) {
                        segmentPoints.push({ type: "bottom", value: segment.bottom });
                        segmentPoints.push({ type: "top", value: segment.top });
                    });

                    segmentPoints.sort(function (l, r) {
                        return l.value - r.value;
                    });

                    var freeSegments = new Array();
                    var count = 0;
                    for (i = 0; i < segmentPoints.length - 1; i++) {
                        if (segmentPoints[i].type == "top")
                            count++;
                        else
                            count--;

                        if (count == 0 && segmentPoints[i + 1].type == "bottom")
                            freeSegments.push({ bottom: segmentPoints[i].value, top: segmentPoints[i + 1].value });
                    }

                    //Find suitable free segment
                    var foundPlace = false;
                    for (var i = 0; i < freeSegments.length; i++) {
                        if ((freeSegments[i].top - freeSegments[i].bottom) > el.realHeight) {
                            y = freeSegments[i].bottom;
                            foundPlace = true;
                            break;
                        }
                    }
                    ;

                    if (!foundPlace) {
                        y = segmentPoints[segmentPoints.length - 1].value;
                    }
                }

                el.realY = y;
                arrangedArray.push(el);
            });
        }

        function LayoutContent(timeline, exhibitSize) {
            //Prepare arrays for ordered and unordered content
            var sequencedContent = new Array();
            var unsequencedContent = new Array();

            if (timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    if (tl.Sequence)
                        sequencedContent.push(tl);
                    else
                        unsequencedContent.push(tl);
                });
            }

            if (timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (eb) {
                    eb.size = exhibitSize;
                    eb.left = eb.x - eb.size / 2.0;
                    eb.right = eb.x + eb.size / 2.0;
                    eb.realHeight = exhibitSize;

                    if (eb.left < timeline.left) {
                        eb.left = timeline.left;
                        eb.right = eb.left + eb.size;
                        eb.isDeposed = true;
                    } else if (eb.right > timeline.right) {
                        eb.right = timeline.right;
                        eb.left = timeline.right - eb.size;
                        eb.isDeposed = true;
                    }

                    if (eb.Sequence)
                        sequencedContent.push(eb);
                    else
                        unsequencedContent.push(eb);
                });
            }

            sequencedContent.sort(function (l, r) {
                return l.Sequence - r.Sequence;
            });

            //Prepare measure arrays
            var arrangedElements = new Array();

            PositionContent(sequencedContent, arrangedElements, function (el, ael) {
                return el.left < ael.right;
            });
            PositionContent(unsequencedContent, arrangedElements, function (el, ael) {
                return !(el.left >= ael.right || ael.left >= el.right);
            });

            var min = Number.MAX_VALUE;
            var max = Number.MIN_VALUE;

            arrangedElements.forEach(function (element) {
                if (element.realY < min)
                    min = element.realY;
                if ((element.realY + element.realHeight) > max)
                    max = element.realY + element.realHeight;
            });

            if (arrangedElements.length == 0) {
                max = 0;
                min = 0;
            }

            return { max: max, min: min };
        }

        function LayoutChildTimelinesOnly(timeline) {
            var arrangedElements = new Array();
            if (timeline.timelines instanceof Array) {
                PositionContent(timeline.timelines, arrangedElements, function (el, ael) {
                    return !(el.left >= ael.right || ael.left >= el.right);
                });
            }

            var min = Number.MAX_VALUE;
            var max = Number.MIN_VALUE;

            arrangedElements.forEach(function (element) {
                if (element.realY < min)
                    min = element.realY;
                if ((element.realY + element.realHeight) > max)
                    max = element.realY + element.realHeight;
            });

            if (arrangedElements.length == 0) {
                max = 0;
                min = 0;
            }

            return { max: max, min: min };
        }

        function Scale(timeline, scale, mctx) {
            if (scale < 1)
                throw "Only extending of content is allowed";

            timeline.height *= scale;
            timeline.realHeight = timeline.height + 2 * timeline.heightEps;
            timeline.titleRect = GenerateTitleObject(timeline.height, timeline, mctx);

            if (timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    tl.realY *= scale;
                    if (!tl.AspectRatio)
                        Scale(tl, scale, mctx);
                });
            }

            if (timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (eb) {
                    eb.realY *= scale;
                });
            }
        }

        function Arrange(timeline) {
            timeline.y = timeline.realY + timeline.heightEps;

            if (timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (infodot) {
                    infodot.y = infodot.realY + infodot.size / 2.0 + timeline.y;
                });
            }

            if (timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    tl.realY += timeline.y;
                    Arrange(tl);
                });
            }
        }

        function CalcInfodotSize(timeline) {
            return (timeline.right - timeline.left) / 20.0;
        }

        function GenerateTitleObject(tlHeight, timeline, measureContext) {
            var tlW = timeline.right - timeline.left;

            measureContext.font = "100pt " + CZ.Settings.timelineHeaderFontName;
            var size = measureContext.measureText(timeline.title);
            var height = CZ.Settings.timelineHeaderSize * tlHeight;
            var width = height * size.width / 100.0;

            var margin = Math.min(tlHeight, tlW) * CZ.Settings.timelineHeaderMargin;

            if (width + 2 * margin > tlW) {
                width = tlW - 2 * margin;
                height = width * 100.0 / size.width;
            }

            return {
                width: width - 2.1 * height,
                height: height,
                marginTop: tlHeight - height - margin,
                marginLeft: margin,
                bboxWidth: width + 2 * margin - 2.1 * height,
                bboxHeight: height + 2 * margin
            };
        }
        Layout.GenerateTitleObject = GenerateTitleObject;

        function Convert(parent, timeline) {
            //Creating timeline
            var tlColor = GetTimelineColor(timeline);
            var t1 = CZ.VCContent.addTimeline(parent, "layerTimelines", 't' + timeline.id, {
                isBuffered: timeline.timelines instanceof Array,
                guid: timeline.id,
                timeStart: timeline.left,
                timeEnd: timeline.right,
                top: timeline.y,
                height: timeline.height,
                header: timeline.title,
                fillStyle: "rgba(0,0,0,0.25)",
                titleRect: timeline.titleRect,
                strokeStyle: tlColor,
                regime: timeline.Regime,
                endDate: timeline.endDate,
                FromIsCirca: timeline.FromIsCirca || false,
                ToIsCirca: timeline.ToIsCirca || false,
                opacity: 0,
                backgroundUrl: timeline.backgroundUrl,
                aspectRatio: timeline.aspectRatio
            });

            //Creating Infodots
            if (timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (childInfodot) {
                    var contentItems = [];
                    if (typeof childInfodot.contentItems !== 'undefined') {
                        contentItems = childInfodot.contentItems;

                        for (var i = 0; i < contentItems.length; ++i) {
                            contentItems[i].guid = contentItems[i].id;
                        }
                    }

                    var infodot1 = CZ.VCContent.addInfodot(t1, "layerInfodots", 'e' + childInfodot.id, (childInfodot.left + childInfodot.right) / 2.0, childInfodot.y, 0.8 * childInfodot.size / 2.0, contentItems, {
                        isBuffered: false,
                        guid: childInfodot.id,
                        title: childInfodot.title,
                        date: childInfodot.time,
                        isCirca: childInfodot.IsCirca,
                        opacity: 1
                    });
                });
            }

            //Filling child timelines
            if (timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (childTimeLine) {
                    Convert(t1, childTimeLine);
                });
            }
        }

        function GetTimelineColor(timeline) {
            if (timeline.Regime == "Cosmos") {
                return "rgba(152, 108, 157, 1.0)";
            } else if (timeline.Regime == "Earth") {
                return "rgba(81, 127, 149, 1.0)";
            } else if (timeline.Regime == "Life") {
                return "rgba(73, 150, 73, 1.0)";
            } else if (timeline.Regime == "Pre-history") {
                return "rgba(237, 145, 50, 1.0)";
            } else if (timeline.Regime == "Humanity") {
                return "rgba(212, 92, 70, 1.0)";
            } else {
                // Return null to allow the settings configuration to choose color.
                return null;
            }
        }

        Layout.FindChildTimeline = function (timeline, id, recursive) {
            var result = undefined;

            if (timeline && timeline.timelines instanceof Array) {
                var n = timeline.timelines.length;
                for (var i = 0; i < n; i++) {
                    var childTimeline = timeline.timelines[i];
                    if (childTimeline.id == id) {
                        // timeline was found
                        result = childTimeline;
                        break;
                    } else {
                        // if recursive mode is on, then search timeline through children of current child timeline
                        if (recursive == true) {
                            result = Layout.FindChildTimeline(childTimeline, id, recursive);
                            if (result != undefined)
                                break;
                        }
                    }
                }
            }

            return result;
        };

        function GetVisibleFromTimeline(timeline, vcph) {
            if (timeline) {
                var vp = vcph.virtualCanvas("getViewport");
                var width = timeline.right - timeline.left;
                var scaleX = vp.visible.scale * width / vp.width;
                var scaleY = vp.visible.scale * timeline.height / vp.height;
                return new CZ.Viewport.VisibleRegion2d(timeline.left + (timeline.right - timeline.left) / 2.0, timeline.y + timeline.height / 2.0, Math.max(scaleX, scaleY));
            }
        }

        function LoadTimeline(root, rootTimeline) {
            root.beginEdit();
            Convert(root, rootTimeline);
            root.endEdit(true);
        }

        function Load(root, timeline) {
            if (timeline) {
                //Transform timeline start and end dates
                Prepare(timeline);

                //Measure child content for each timiline in tree
                var measureContext = document.createElement("canvas").getContext('2d');
                LayoutTimeline(timeline, 0, measureContext);

                //Calculating final placement of the data
                Arrange(timeline);

                //Load timline to Virtual Canvas
                LoadTimeline(root, timeline);
            }
        }
        Layout.Load = Load;

        /*
        ---------------------------------------------------------------------------
        DYNAMIC LAYOUT
        ---------------------------------------------------------------------------
        */
        // takes a metadata timeline (FromTimeUnit, FromYear, FromMonth, FromDay, ToTimeUnit, ToYear, ToMonth, ToDay)
        // and returns a corresponding scenegraph (x, y, width, height)
        // todo: remove dependency on virtual canvas (vc)
        function generateLayout(tmd, tsg) {
            try  {
                if (!tmd.AspectRatio)
                    tmd.height = tsg.height;
                var root = new CZ.VCContent.CanvasRootElement(tsg.vc, undefined, "__root__", -Infinity, -Infinity, Infinity, Infinity);
                Load(root, tmd);
                return root.children[0];
            } catch (msg) {
                console.log("exception in [nikita's layout]: " + msg);
            }
        }

        // converts a scenegraph element in absolute coords to relative coords
        function convertRelativeToAbsoluteCoords(el, delta) {
            if (!delta)
                return;
            if (typeof el.y !== 'undefined') {
                el.y += delta;
                el.newY += delta;
            }
            if (typeof el.baseline !== 'undefined') {
                el.baseline += delta;
                el.newBaseline += delta;
            }
            el.children.forEach(function (child) {
                convertRelativeToAbsoluteCoords(child, delta);
            });
        }

        // shifts a scenegraph element in absolute coords by delta
        function shiftAbsoluteCoords(el, delta) {
            if (!delta)
                return;
            if (typeof el.newY !== 'undefined')
                el.newY += delta;
            if (typeof el.newBaseline !== 'undefined')
                el.newBaseline += delta;
            el.children.forEach(function (child) {
                shiftAbsoluteCoords(child, delta);
            });
        }

        // calculates the net force excerted on each child timeline and infodot
        // after expansion of child timelines to fit the newly added content
        function calculateForceOnChildren(tsg) {
            var eps = tsg.height / 10;

            var v = [];
            for (var i = 0, el; i < tsg.children.length; i++) {
                el = tsg.children[i];
                if (el.type && (el.type === "timeline" || el.type === "infodot")) {
                    el.force = 0;
                    v.push(el);
                }
            }

            v.sort(function (el, ael) {
                return el.newY - ael.newY;
            }); // inc order of y

            for (var i = 0, el; i < v.length; i++) {
                el = v[i];
                if (el.type && el.type === "timeline") {
                    if (el.delta) {
                        var l = el.x;
                        var r = el.x + el.width;
                        var b = el.y + el.newHeight + eps;
                        for (var j = i + 1; j < v.length; j++) {
                            var ael = v[j];
                            if (ael.x > l && ael.x < r || ael.x + ael.width > l && ael.x + ael.width < r || ael.x + ael.width > l && ael.x + ael.width === 0 && r === 0) {
                                // ael intersects (l, r)
                                if (ael.y < b) {
                                    // ael overlaps with el
                                    ael.force += el.delta;

                                    l = Math.min(l, ael.x);
                                    r = Math.max(r, ael.x + ael.width);
                                    b = ael.y + ael.newHeight + el.delta + eps;
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        function animateElement(elem) {
            var duration = CZ.Settings.canvasElementAnimationTime;
            var args = [];

            if (elem.fadeIn == false && typeof elem.animation === 'undefined') {
                elem.height = elem.newHeight;
                elem.y = elem.newY;

                if (elem.baseline)
                    elem.baseline = elem.newBaseline;
            }

            if (elem.newY != elem.y && !elem.id.match("__header__"))
                args.push({
                    property: "y",
                    startValue: elem.y,
                    targetValue: elem.newY
                });
            if (elem.newHeight != elem.height && !elem.id.match("__header__"))
                args.push({
                    property: "height",
                    startValue: elem.height,
                    targetValue: elem.newHeight
                });

            if (elem.opacity != 1 && elem.fadeIn == false) {
                args.push({
                    property: "opacity",
                    startValue: elem.opacity,
                    targetValue: 1
                });
                duration = CZ.Settings.canvasElementFadeInTime;
            }

            if (isLayoutAnimation == false || args.length == 0)
                duration = 0;

            initializeAnimation(elem, duration, args);

            // first animate resize/transition of buffered content. skip new content
            if (elem.fadeIn == true) {
                for (var i = 0; i < elem.children.length; i++)
                    if (elem.children[i].fadeIn == true)
                        animateElement(elem.children[i]);
            } else
                for (var i = 0; i < elem.children.length; i++)
                    animateElement(elem.children[i]);
        }

        function initializeAnimation(elem, duration, args) {
            var startTime = (new Date()).getTime();

            elem.animation = {
                isAnimating: true,
                duration: duration,
                startTime: startTime,
                args: args
            };

            // add elem to hash map
            if (typeof Layout.animatingElements[elem.id] === 'undefined') {
                Layout.animatingElements[elem.id] = elem;
                Layout.animatingElements.length++;
            }

            // calculates new animation frame of element
            elem.calculateNewFrame = function () {
                var curTime = (new Date()).getTime();
                var t;

                if (elem.animation.duration > 0)
                    t = Math.min(1.0, (curTime - elem.animation.startTime) / elem.animation.duration); //projecting current time to the [0;1] interval of the animation parameter
                else
                    t = 1.0;

                t = CZ.ViewportAnimation.animationEase(t);

                for (var i = 0; i < args.length; i++) {
                    if (typeof elem[args[i].property] !== 'undefined')
                        elem[elem.animation.args[i].property] = elem.animation.args[i].startValue + t * (elem.animation.args[i].targetValue - elem.animation.args[i].startValue);
                }

                if (t == 1.0) {
                    elem.animation.isAnimating = false;
                    elem.animation.args = [];

                    delete Layout.animatingElements[elem.id];
                    Layout.animatingElements.length--;

                    if (elem.fadeIn == false)
                        elem.fadeIn = true;

                    for (var i = 0; i < elem.children.length; i++)
                        if (typeof elem.children[i].animation === 'undefined')
                            animateElement(elem.children[i]);

                    return;
                }
            };
        }

        // utiltity function for debugging
        function numberWithCommas(n) {
            var parts = n.toString().split(".");
            return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
        }

        // src = metadata tree (responsedump.txt + isBuffered)
        // dest = scenegraph tree (tree of CanvasTimelines)
        // returns void.
        // mutates scenegraph tree (dest) by appending missing data from metadata tree (src).
        // dest timelines can be in 1 of 3 states
        // 1. No Metadata.  (isBuffered == false)
        // 2. All Metadata. (isBuffered == false)
        // 3. All Content.  (isBuffered == true)
        function merge(src, dest) {
            if (src.id === dest.guid) {
                var srcChildTimelines = (src.timelines instanceof Array) ? src.timelines : [];
                var destChildTimelines = [];
                for (var i = 0; i < dest.children.length; i++)
                    if (dest.children[i].type && dest.children[i].type === "timeline")
                        destChildTimelines.push(dest.children[i]);

                if (srcChildTimelines.length === destChildTimelines.length) {
                    dest.isBuffered = dest.isBuffered || (src.timelines instanceof Array);

                    // cal bbox (top, bottom) for child timelines and infodots
                    var origTop = Number.MAX_VALUE;
                    var origBottom = Number.MIN_VALUE;
                    for (var i = 0; i < dest.children.length; i++) {
                        if (dest.children[i].type && (dest.children[i].type === "timeline" || dest.children[i].type === "infodot")) {
                            if (dest.children[i].newY < origTop)
                                origTop = dest.children[i].newY;
                            if (dest.children[i].newY + dest.children[i].newHeight > origBottom)
                                origBottom = dest.children[i].newY + dest.children[i].newHeight;
                        }
                    }

                    // merge child timelines
                    dest.delta = 0;
                    for (var i = 0; i < srcChildTimelines.length; i++)
                        merge(srcChildTimelines[i], destChildTimelines[i]);

                    // check if child timelines have expanded
                    var haveChildTimelineExpanded = false;
                    for (var i = 0; i < destChildTimelines.length; i++)
                        if (destChildTimelines[i].delta)
                            haveChildTimelineExpanded = true;

                    if (haveChildTimelineExpanded) {
                        for (var i = 0; i < destChildTimelines.length; i++)
                            if (destChildTimelines[i].delta)
                                destChildTimelines[i].newHeight += destChildTimelines[i].delta;

                        // shift all timelines and infodots above and below a expanding timeline
                        calculateForceOnChildren(dest);
                        for (var i = 0; i < dest.children.length; i++)
                            if (dest.children[i].force)
                                shiftAbsoluteCoords(dest.children[i], dest.children[i].force);

                        // cal bbox (top, bottom) for child timelines and infodots after expansion
                        var top = Number.MAX_VALUE;
                        var bottom = Number.MIN_VALUE;
                        var bottomElementName = "";
                        for (var i = 0; i < dest.children.length; i++) {
                            if (dest.children[i].type && (dest.children[i].type === "timeline" || dest.children[i].type === "infodot")) {
                                if (dest.children[i].newY < top)
                                    top = dest.children[i].newY;
                                if (dest.children[i].newY + dest.children[i].newHeight > bottom) {
                                    bottom = dest.children[i].newY + dest.children[i].newHeight;
                                    bottomElementName = dest.children[i].title;
                                }
                            }
                        }

                        // update title pos after expansion
                        dest.delta = Math.max(0, (bottom - top) - (origBottom - origTop));

                        // hide animating text
                        // TODO: find the better way to fix text shacking bug if possible
                        dest.titleObject.newY += dest.delta;
                        dest.titleObject.newBaseline += dest.delta;
                        dest.titleObject.opacity = 0;
                        dest.titleObject.fadeIn = false;
                        delete dest.titleObject.animation;

                        // assert: child content cannot exceed parent
                        if (bottom > dest.titleObject.newY) {
                            var msg = bottomElementName + " EXCEEDS " + dest.title + ".\n" + "bottom: " + numberWithCommas(bottom) + "\n" + "   top: " + numberWithCommas(dest.titleObject.newY) + "\n";
                            console.log(msg);
                        }

                        for (var i = 1; i < dest.children.length; i++) {
                            var el = dest.children[i];
                            for (var j = 1; j < dest.children.length; j++) {
                                var ael = dest.children[j];
                                if (el.id !== ael.id) {
                                    if (!(ael.x <= el.x && ael.x + ael.width <= el.x || ael.x >= el.x + el.width && ael.x + ael.width >= el.x + el.width || ael.newY <= el.newY && ael.newY + ael.newHeight <= el.newY || ael.newY >= el.newY + el.newHeight && ael.newY + ael.newHeight >= el.newY + el.newHeight)) {
                                        var msg = el.title + " OVERLAPS " + ael.title + ".\n";
                                        console.log(msg);
                                    }
                                }
                            }
                        }
                    }
                } else if (srcChildTimelines.length > 0 && destChildTimelines.length === 0) {
                    var t = generateLayout(src, dest);
                    var margin = Math.min(t.width, t.newHeight) * CZ.Settings.timelineHeaderMargin;
                    dest.delta = Math.max(0, t.newHeight - dest.newHeight); // timelines can only grow, never shrink

                    // replace dest.children (timelines, infodots, titleObject) with matching t.children
                    dest.children.splice(0);
                    for (var i = 0; i < t.children.length; i++)
                        dest.children.push(t.children[i]);
                    dest.titleObject = dest.children[0];

                    dest.isBuffered = dest.isBuffered || (src.timelines instanceof Array);

                    for (var i = 0; i < dest.children.length; i++)
                        convertRelativeToAbsoluteCoords(dest.children[i], dest.newY);
                } else {
                    dest.delta = 0;
                }
            } else {
                throw "error: Cannot merge timelines. Src and dest node ids differ.";
            }
        }

        function Merge(src, dest) {
            // skip dynamic layout during active authoring session
            if (typeof CZ.Authoring !== 'undefined' && CZ.Authoring.isActive)
                return;

            if (src && dest) {
                if (dest.id === "__root__") {
                    src.AspectRatio = src.aspectRatio || 10;
                    var t = generateLayout(src, dest);
                    convertRelativeToAbsoluteCoords(t, 0);
                    dest.children.push(t);
                    animateElement(dest);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                } else {
                    merge(src, dest);
                    dest.newHeight += dest.delta;
                    animateElement(dest);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                }
            }
        }
        Layout.Merge = Merge;
    })(CZ.Layout || (CZ.Layout = {}));
    var Layout = CZ.Layout;
})(CZ || (CZ = {}));
﻿/// <reference path='typings/jqueryui/jqueryui.d.ts'/>
/// <reference path='../ui/tourslist-form.ts' />
/// <reference path='../ui/tour-caption-form.ts' />
/// <reference path='urlnav.ts'/>
/// <reference path='common.ts'/>
var CZ;
(function (CZ) {
    (function (Tours) {
        Tours.isTourWindowVisible = false;
        var isBookmarksWindowVisible = false;
        var isBookmarksWindowExpanded = true;
        var isBookmarksTextShown = true;
        Tours.isNarrationOn = true;

        Tours.tours;
        Tours.tour;
        Tours.autoTourGUID;
        Tours.tourBookmarkTransitionCompleted;
        Tours.tourBookmarkTransitionInterrupted;

        Tours.pauseTourAtAnyAnimation = false;

        var bookmarkAnimation;

        var isToursDebugEnabled = false;

        Tours.TourEndMessage = "Thank you for watching this tour!";

        Tours.tourCaptionFormContainer;
        Tours.tourCaptionForm;

        // If an automatic tour is specified in the URL, it will be the only parameter after @.
        // Function returns empty string if there is no automatic tour specified.
        // Function also populate Tours.autoTourGUID if an automatic tour has been specified.
        function getAutoTourGUID()
        {
            var urlBits = window.location.hash.split('@');

            if (urlBits.length > 1)
            {
                urlBits = urlBits[1].split('&')[0].split('=');

                if (urlBits.length === 2 && urlBits[0].toLowerCase() === 'auto-tour')
                {
                    Tours.autoTourGUID = urlBits[1];
                    return urlBits[1];
                }
            }

            return '';
        }
        Tours.getAutoTourGUID = getAutoTourGUID;

        /* TourBookmark represents a place in the virtual space with associated audio.
        @param url  (string) Url that contains a state of the virtual canvas
        @param caption (string) text describing the bookmark
        @param lapseTime (number) a position in the audiotreck of the bookmark in seconds
        */
        var TourBookmark = (function () {
            function TourBookmark(url, caption, lapseTime, text) {
                this.url = url;
                this.caption = caption;
                this.lapseTime = lapseTime;
                this.text = text;
                this.duration = undefined;
                this.elapsed = 0;
                if (this.text === null) {
                    this.text = "";
                }
            }
            return TourBookmark;
        })();
        Tours.TourBookmark = TourBookmark;

        /*
        @returns VisibleRegion2d for the bookmark
        */
        function getBookmarkVisible(bookmark) {
            return CZ.UrlNav.navStringToVisible(bookmark.url, CZ.Common.vc);
        }
        Tours.getBookmarkVisible = getBookmarkVisible;

        function hasActiveTour() {
            return Tours.tour != undefined;
        }
        Tours.hasActiveTour = hasActiveTour;

        function bookmarkUrlToElement(bookmarkUrl) {
            var element = CZ.UrlNav.navStringTovcElement(bookmarkUrl, CZ.Common.vc.virtualCanvas("getLayerContent"));
            if (!element)
                return null;
            return element;
        }
        Tours.bookmarkUrlToElement = bookmarkUrlToElement;

        var Tour = (function () {
            /* Tour represents a sequence of bookmarks.
            @param title        (string)    Title of the tour.
            @param bookmarks    (non empty array of TourBookmark) A sequence of bookmarks
            @param zoomTo       (func (VisibleRegion2d, onSuccess, onFailure, bookmark) : number) Allows the tour to zoom into required places, returns a unique animation id, which is then passed to callbacks.
            @param vc           (jquery)    VirtualCanvas
            @param category (String) category of the tour
            @param sequenceNum (number) an ordering number
            @callback tour_BookmarkStarted      Array of (func(tour, bookmark)) The function is called when new bookmark starts playing
            @callback tour_BookmarkFinished     Array of (func(tour, bookmark)) The function is called when new bookmark is finished
            @callback tour_TourFinished     Array of (func(tour)) The function is called when the tour is finished
            @callback tour_TourStarted      Array of (func(tour)) The function is called when the tour is finished
            */
            function Tour(id, title, bookmarks, zoomTo, vc, category, audio, sequenceNum, description) {
                this.id = id;
                this.title = title;
                this.bookmarks = bookmarks;
                this.zoomTo = zoomTo;
                this.vc = vc;
                this.category = category;
                this.audio = audio;
                this.sequenceNum = sequenceNum;
                this.description = description;
                this.tour_BookmarkStarted = [];
                this.tour_BookmarkFinished = [];
                this.tour_TourStarted = [];
                this.tour_TourFinished = [];
                this.state = 'pause';
                this.currentPlace = { type: 'goto', bookmark: 0, startTime: null, animationId: null };
                this.isTourPlayRequested = false;
                this.isAudioLoaded = false;
                this.isAudioEnabled = false;
                if (!bookmarks || bookmarks.length == 0) {
                    throw "Tour has no bookmarks";
                }

                var self = this;
                this.thumbnailUrl = CZ.Settings.contentItemThumbnailBaseUri + id + '.jpg';

                //ordering the bookmarks by the lapsetime
                bookmarks.sort(function (b1, b2) {
                    return b1.lapseTime - b2.lapseTime;
                });

                for (var i = 1; i < bookmarks.length; i++) {
                    bookmarks[i - 1].number = i;
                    bookmarks[i - 1].duration = bookmarks[i].lapseTime - bookmarks[i - 1].lapseTime;
                }
                bookmarks[bookmarks.length - 1].duration = 10; //this will be overrided when the audio will be downloaded
                bookmarks[bookmarks.length - 1].number = bookmarks.length;

                /*
                Enables or disables an audio playback of the tour.
                @param isOn (Boolean) whether the audio is enabled
                */
                self.toggleAudio = function toggleAudio(isOn) {
                    if (isOn && self.audio)
                        self.isAudioEnabled = true;
                    else
                        self.isAudioEnabled = false;
                };

                self.ReinitializeAudio = function ReinitializeAudio() {
                    if (!self.audio)
                        return;

                    // stop audio playback and clear audio element
                    if (self.audioElement) {
                        self.audioElement.pause();
                    }

                    self.audioElement = undefined;

                    self.isAudioLoaded = false;

                    // reinitialize audio element
                    self.audioElement = document.createElement('audio');

                    self.audioElement.addEventListener("loadedmetadata", function () {
                        if (self.audioElement.duration != Infinity)
                            self.bookmarks[self.bookmarks.length - 1].duration = self.audioElement.duration - self.bookmarks[self.bookmarks.length - 1].lapseTime; //overriding the last bookmark duration
                        if (isToursDebugEnabled && window.console && console.log("Tour " + self.title + " metadata loaded (readystate 1)"))
                            ;
                    });
                    self.audioElement.addEventListener("canplaythrough", function () {
                        // audio track is fully loaded
                        self.isAudioLoaded = true;

                        if (isToursDebugEnabled && window.console && console.log("Tour " + self.title + " readystate 4"))
                            ;
                    });
                    self.audioElement.addEventListener("progress", function () {
                        if (self.audioElement && self.audioElement.buffered.length > 0)
                            if (isToursDebugEnabled && window.console && console.log("Tour " + self.title + " downloaded " + (self.audioElement.buffered.end(self.audioElement.buffered.length - 1) / self.audioElement.duration)))
                                ;
                    });

                    self.audioElement.controls = false;
                    self.audioElement.autoplay = false;
                    self.audioElement.loop = false;
                    self.audioElement.volume = 1;

                    self.audioElement.preload = "none";

                    // add audio sources of different audio file extensions for audio element
                    var blobPrefix = self.audio.substring(0, self.audio.length - 3);
                    for (var i = 0; i < CZ.Settings.toursAudioFormats.length; i++) {
                        var audioSource = document.createElement("Source");
                        audioSource.setAttribute("src", blobPrefix + CZ.Settings.toursAudioFormats[i].ext);
                        self.audioElement.appendChild(audioSource);
                    }

                    self.audioElement.load();
                    if (isToursDebugEnabled && window.console && console.log("Loading of tour " + self.title + " is queued"))
                        ;
                };

                /*
                Raises that bookmark playback is over. Called only if state is "play" and currentPlace is bookmark
                @param goBack (boolen) specifies the direction to move (prev - true, next - false)
                */
                self.onBookmarkIsOver = function onBookmarkIsOver(goBack) {
                    self.bookmarks[self.currentPlace.bookmark].elapsed = 0; // reset bookmark's playback progress

                    // Going to the next bookmark if we are not at the end
                    if ((self.currentPlace.bookmark == self.bookmarks.length - 1) && !goBack) {
                        // reset tour state
                        self.state = 'pause';
                        self.currentPlace = { type: 'goto', bookmark: 0 };
                        self.RaiseTourFinished();
                    } else {
                        self.goToTheNextBookmark(goBack);
                    }
                };

                /*
                Moves the tour to the next or to the prev bookmark activating elliptical zoom
                @param goBack(boolen) specifies the direction to move(prev - true, next - false)
                */
                self.goToTheNextBookmark = function goToTheNextBookmark(goBack) {
                    var newBookmark = self.currentPlace.bookmark;
                    var oldBookmark = newBookmark;

                    // calculate index of new bookmark in array of bookmarks
                    if (goBack) {
                        newBookmark = Math.max(0, newBookmark - 1);
                    } else {
                        newBookmark = Math.min(self.bookmarks.length - 1, newBookmark + 1);
                    }

                    // raise bookmark finished callback functions
                    self.RaiseBookmarkFinished(oldBookmark);

                    // change current position in tour and start EllipticalZoom animation
                    self.currentPlace = { type: 'goto', bookmark: newBookmark };

                    var bookmark = self.bookmarks[self.currentPlace.bookmark];

                    // activate bookmark & audio naration if required
                    if (newBookmark != 0) {
                        self.RaiseBookmarkStarted(bookmark);

                        // start audio narration
                        if (self.isAudioEnabled && self.state === 'play' && self.isAudioLoaded == true)
                            self.startBookmarkAudio(bookmark);
                    }

                    // initialize bookmark's timer
                    if (self.state != 'pause' && self.isAudioLoaded == true)
                        self.setTimer(bookmark);

                    if (isToursDebugEnabled && window.console && console.log("Transitioning to the bm index " + newBookmark))
                        ;

                    var targetVisible = getBookmarkVisible(bookmark);

                    // bookmark was removed from canvas
                    if (!targetVisible) {
                        if (isToursDebugEnabled && window.console && console.log("bookmark index " + newBookmark + " references to nonexistent item"))
                            ;

                        // skip nonexistent bookmark
                        goBack ? self.prev() : self.next();
                        return;
                        //self.goToTheNextBookmark(goBack);
                    }

                    // start new EllipticalZoom animation if needed
                    self.currentPlace.animationId = self.zoomTo(getBookmarkVisible(bookmark), self.onGoToSuccess, self.onGoToFailure, bookmark.url);
                };

                /*
                Resumes/starts audio narration for bookmark.
                @param bookmark         (bookmark) bookmark which audio narration part should be played.
                */
                self.startBookmarkAudio = function startBookmarkAudio(bookmark) {
                    if (!self.audio)
                        return;
                    if (isToursDebugEnabled && window.console && console.log("playing source: " + self.audioElement.currentSrc))
                        ;

                    self.audioElement.pause();

                    try  {
                        self.audioElement.currentTime = bookmark.lapseTime + bookmark.elapsed;
                        if (isToursDebugEnabled && window.console && console.log("audio currentTime is set to " + (bookmark.lapseTime + bookmark.elapsed)))
                            ;
                    } catch (ex) {
                        if (window.console && console.error("currentTime assignment: " + ex))
                            ;
                    }

                    if (isToursDebugEnabled && window.console && console.log("audio element is forced to play"))
                        ;

                    self.audioElement.play();
                };

                /*
                Sets up the transition to the next bookmark timer. Resets the currently active one.
                */
                self.setTimer = function setTimer(bookmark) {
                    // clear active timer
                    if (self.timerOnBookmarkIsOver) {
                        clearTimeout(self.timerOnBookmarkIsOver);
                    }

                    // calculate time to the end of active bookmark
                    var duration = bookmark.duration;
                    if (bookmark.elapsed != 0) {
                        duration = Math.max(duration - bookmark.elapsed, 0);
                    }

                    // save start time
                    self.currentPlace.startTime = new Date().getTime();

                    if (isToursDebugEnabled && window.console && console.log("transition to next bookmark will be in " + duration + " seconds"))
                        ;

                    // activate new timer
                    self.timerOnBookmarkIsOver = setTimeout(self.onBookmarkIsOver, duration * 1000);
                };

                // Zoom animation callbacks:
                self.onGoToSuccess = function onGoToSuccess(animationId) {
                    // the function is called only when state is play and currentPlace is goto, otherwise we are paused
                    if (!self.currentPlace || self.currentPlace.animationId == undefined || self.currentPlace.animationId != animationId)
                        return;

                    var curURL = CZ.UrlNav.getURL();
                    if (typeof curURL.hash.params == 'undefined')
                        curURL.hash.params = [];
                    curURL.hash.params["tour"] = Tours.tour.sequenceNum;

                    //curURL.hash.params["bookmark"] = self.currentPlace.bookmark+1;
                    //This flag is used to overcome hashchange event handler
                    CZ.Common.hashHandle = false;
                    CZ.UrlNav.setURL(curURL);

                    if (isToursDebugEnabled && window.console && console.log("reached the bookmark index " + self.currentPlace.bookmark))
                        ;

                    self.currentPlace = { type: 'bookmark', bookmark: self.currentPlace.bookmark };

                    //start the audio after the transition to the first bookmark if not paused
                    if (self.currentPlace.bookmark == 0) {
                        // raise bookmark started callback functions
                        var bookmark = self.bookmarks[self.currentPlace.bookmark];
                        self.RaiseBookmarkStarted(bookmark);

                        if (self.state != 'pause') {
                            if (self.isAudioLoaded != true) {
                                tourPause();
                            } else {
                                self.setTimer(bookmark);
                                if (self.isAudioEnabled) {
                                    self.startBookmarkAudio(bookmark);
                                }
                            }
                        }
                    }
                };

                self.onGoToFailure = function onGoToFailure(animationId) {
                    // the function is called only when state is play and currentPlace is goto, otherwise we are paused
                    if (!self.currentPlace || self.currentPlace.animationId == undefined || self.currentPlace.animationId != animationId)
                        return;

                    // pause tour
                    self.pause();

                    if (isToursDebugEnabled && window.console && console.log("tour interrupted by user during transition"))
                        ;
                };

                self.play = function play() {
                    if (self.state !== 'pause') {
                        return;
                    }

                    // first we go to the bookmark and then continue play it
                    if (isToursDebugEnabled && window.console && console.log("tour playback activated"))
                        ;
                    self.state = 'play';

                    var visible = self.vc.virtualCanvas("getViewport").visible;
                    var bookmarkVisible = getBookmarkVisible(self.bookmarks[self.currentPlace.bookmark]);

                    // skip bookmark if it references to nonexistent element
                    if (bookmarkVisible === null) {
                        self.next();
                        return;
                    }

                    if (self.currentPlace != null && self.currentPlace.bookmark != null && CZ.Common.compareVisibles(visible, bookmarkVisible)) {
                        // current visible is equal to visible of bookmark
                        self.currentPlace = { type: 'bookmark', bookmark: self.currentPlace.bookmark };
                    } else {
                        // current visible is not equal to visible of bookmark, animation is required
                        self.currentPlace = { type: 'goto', bookmark: self.currentPlace.bookmark };
                    }

                    var bookmark = self.bookmarks[self.currentPlace.bookmark];

                    showBookmark(Tours.tour, bookmark);

                    // indicates if animation to first bookmark is required
                    var isInTransitionToFirstBookmark = (self.currentPlace.bookmark == 0 && self.currentPlace.type == 'goto');

                    // transition to bookmark is over OR not in process of transition to first bookmark => start bookmark
                    if (self.currentPlace.type == 'bookmark' || self.currentPlace.bookmark != 0) {
                        self.RaiseBookmarkStarted(bookmark);

                        // start bookmark' timer & audio narration if audio is ready
                        if (self.isAudioLoaded == true) {
                            self.setTimer(bookmark);
                            if (self.isAudioEnabled) {
                                self.startBookmarkAudio(bookmark);
                            }
                        }
                    }

                    self.currentPlace.animationId = self.zoomTo(getBookmarkVisible(bookmark), self.onGoToSuccess, self.onGoToFailure, bookmark.url);

                    // raise tourStarted callback functions
                    if (self.currentPlace.bookmark === 0 && isInTransitionToFirstBookmark) {
                        self.RaiseTourStarted();
                    }

                    var curURL = CZ.UrlNav.getURL();
                    if (typeof curURL.hash.params == 'undefined') {
                        curURL.hash.params = new Array();
                    }

                    if (typeof curURL.hash.params["tour"] == 'undefined') {
                        curURL.hash.params["tour"] = Tours.tour.sequenceNum;

                        //This flag is used to overcome hashchange event handler
                        CZ.Common.hashHandle = false;
                        CZ.UrlNav.setURL(curURL);
                    }
                };

                self.pause = function pause() {
                    if (self.state !== 'play')
                        return;

                    if (isToursDebugEnabled && window.console && console.log("tour playback paused"))
                        ;
                    if (self.isAudioEnabled && self.isTourPlayRequested)
                        self.isTourPlayRequested = false;

                    // clear active bookmark timer
                    if (self.timerOnBookmarkIsOver) {
                        clearTimeout(self.timerOnBookmarkIsOver);
                        self.timerOnBookmarkIsOver = undefined;
                    }

                    self.state = 'pause';
                    if (self.isAudioEnabled) {
                        self.audioElement.pause();
                        if (isToursDebugEnabled && window.console && console.log("audio element is forced to pause"))
                            ;
                    }

                    var bookmark = self.bookmarks[self.currentPlace.bookmark];

                    // save the time when bookmark was paused
                    if (self.currentPlace.startTime)
                        bookmark.elapsed += (new Date().getTime() - self.currentPlace.startTime) / 1000; // sec
                };

                self.next = function next() {
                    if (self.state === 'play') {
                        // clear active bookmark timer
                        if (self.timerOnBookmarkIsOver)
                            clearTimeout(self.timerOnBookmarkIsOver);
                        self.timerOnBookmarkIsOver = undefined;
                    }

                    self.onBookmarkIsOver(false); // goes to the next bookmark
                };

                self.prev = function prev() {
                    // ignore if first bookmark
                    if (self.currentPlace.bookmark == 0) {
                        //self.currentPlace = <Place>{ type: 'bookmark', bookmark: self.currentPlace.bookmark };
                        return;
                    }
                    if (self.state === 'play') {
                        // clear active bookmark timer
                        if (self.timerOnBookmarkIsOver)
                            clearTimeout(self.timerOnBookmarkIsOver);
                        self.timerOnBookmarkIsOver = undefined;
                    }

                    self.onBookmarkIsOver(true); // goes to the prev bookmark
                };

                // calls every bookmarkStarted callback function
                self.RaiseBookmarkStarted = function RaiseBookmarkStarted(bookmark) {
                    if (self.tour_BookmarkStarted.length > 0) {
                        for (var i = 0; i < self.tour_BookmarkStarted.length; i++)
                            self.tour_BookmarkStarted[i](self, bookmark);
                    }
                    showBookmark(this, bookmark);
                };

                // calls every bookmarkFinished callback function
                self.RaiseBookmarkFinished = function RaiseBookmarkFinished(bookmark) {
                    if (self.tour_BookmarkFinished.length > 0) {
                        for (var i = 0; i < self.tour_BookmarkFinished.length; i++)
                            self.tour_BookmarkFinished[i](self, bookmark);
                    }
                    hideBookmark(this);
                };

                // calls every tourStarted callback function
                self.RaiseTourStarted = function RaiseTourStarted() {
                    if (self.tour_TourStarted.length > 0) {
                        for (var i = 0; i < self.tour_TourStarted.length; i++)
                            self.tour_TourStarted[i](self);
                    }
                };

                // calls every tourFinished callback function
                self.RaiseTourFinished = function RaiseTourFinished() {
                    if (self.tour_TourFinished.length > 0) {
                        for (var i = 0; i < self.tour_TourFinished.length; i++)
                            self.tour_TourFinished[i](self);
                    }
                };
            }
            return Tour;
        })();
        Tours.Tour = Tour;

        /*
        Activates tour contol UI.
        @param    tour (Tour). A tour to play.
        @param    isAudioEnabled (Boolean) Whether to play audio during the tour or not
        */
        function activateTour(newTour, isAudioEnabled) {
            if (isAudioEnabled == undefined)
                isAudioEnabled = Tours.isNarrationOn;

            if (newTour != undefined) {
                Tours.tour = newTour;

                // add new tourFinished callback function
                Tours.tour.tour_TourFinished.push(function (tour) {
                    showTourEndMessage();
                    tourPause();
                    hideBookmarks();
                });

                Tours.tour.toggleAudio(isAudioEnabled);

                for (var i = 0; i < Tours.tour.bookmarks.length; i++)
                    Tours.tour.bookmarks[i].elapsed = 0;

                // reset active tour' bookmark
                Tours.tour.currentPlace.bookmark = 0;

                // don't need to load audio if audio narration is off
                if (isAudioEnabled == true) {
                    Tours.tour.ReinitializeAudio();
                    Tours.tour.isAudioLoaded = true;
                }

                // start a tour
                tourResume();
            }
        }
        Tours.activateTour = activateTour;

        /*
        Deactivates a tour. Removes all tour controls.
        */
        function removeActiveTour() {
            // stop active tour
            if (Tours.tour) {
                tourPause();
                Tours.tour.isTourPlayRequested = false;
            }

            // hide tour' UI
            if (Tours.tour) {
                hideBookmarks();
                $("#bookmarks .header").text("");

                // remove audio track
                if (Tours.tour.audioElement)
                    Tours.tour.audioElement = undefined;
            }

            // reset active tour
            Tours.tour = undefined;
        }
        Tours.removeActiveTour = removeActiveTour;

        /*
        Handling of prev button click in UI
        */
        function tourPrev() {
            if (Tours.tour != undefined) {
                Tours.tour.prev();
            }
        }
        Tours.tourPrev = tourPrev;

        /*
        Handling of next button click in UI
        */
        function tourNext() {
            if (Tours.tour != undefined) {
                Tours.tour.next();
            }
        }
        Tours.tourNext = tourNext;

        /*
        switch the tour in the paused state
        */
        function tourPause() {
            Tours.tourCaptionForm.setPlayPauseButtonState("play");
            if (Tours.tour != undefined) {
                $("#tour_playpause").attr("src", "/images/tour_play_off.jpg");

                // pause tour
                Tours.tour.pause();

                // stop active animation
                CZ.Common.controller.stopAnimation();

                // remove animation callbacks
                Tours.tour.tourBookmarkTransitionInterrupted = undefined;
                Tours.tour.tourBookmarkTransitionCompleted = undefined;
            }
        }
        Tours.tourPause = tourPause;

        /*
        switch the tour in the running state
        */
        function tourResume() {
            Tours.tourCaptionForm.setPlayPauseButtonState("pause");
            $("#tour_playpause").attr("src", "/images/tour_pause_off.jpg");
            Tours.tour.play();
        }
        Tours.tourResume = tourResume;

        /*
        Handling of play/pause button click in UI
        */
        function tourPlayPause() {
            if (Tours.tour != undefined) {
                if (Tours.tour.state == "pause") {
                    tourResume();
                } else if (Tours.tour.state == "play") {
                    tourPause();
                }
                //        var curURL = getURL();
                //        if (typeof curURL.hash.params == 'undefined')
                //            curURL.hash.params = new Array();
                //        curURL.hash.params["tour"] = tour.sequenceNum;
                //        curURL.hash.params["bookmark"] = tour.currentPlace.bookmark + 1;
                //        setURL(curURL);
            }
        }
        Tours.tourPlayPause = tourPlayPause;

        /*
        Handling of close button click in UI.
        */
        function tourAbort() {
            // close tour and hide all tour' UI elements
            removeActiveTour();
            $("#bookmarks").hide();
            isBookmarksWindowVisible = false;

            var curURL = CZ.UrlNav.getURL();
            if (curURL.hash.params["tour"]) {
                delete curURL.hash.params["tour"];
            }
            CZ.UrlNav.setURL(curURL);
        }
        Tours.tourAbort = tourAbort;

        function initializeToursUI() {
            $("#tours").hide();
            hideBookmarks();
        }
        Tours.initializeToursUI = initializeToursUI;

        function initializeToursContent() {
            Tours.tours.sort(function (u, v) {
                return u.sequenceNum - v.sequenceNum;
            });
        }
        Tours.initializeToursContent = initializeToursContent;

        /*
        Hides bookmark description text.
        */
        function hideBookmark(tour) {
            Tours.tourCaptionForm.hideBookmark();
        }

        function showTourEndMessage() {
            Tours.tourCaptionForm.showTourEndMessage();
        }

        /*
        Shows bookmark description text.
        */
        function showBookmark(tour, bookmark) {
            Tours.tourCaptionForm.showBookmark(bookmark);
        }

        /*
        Closes bookmark description window.
        */
        function hideBookmarks() {
            $("#bookmarks").hide();
            isBookmarksWindowVisible = false;
        }

        /*
        Tours button handler.
        */
        function onTourClicked() {
            if (CZ.Search.isSearchWindowVisible)
                CZ.Search.onSearchClicked();

            if (Tours.isTourWindowVisible) {
                $("#tours").hide('slide', {}, 'slow');
            } else {
                $("#tours").show('slide', {}, 'slow');
            }
            Tours.isTourWindowVisible = !Tours.isTourWindowVisible;
        }
        Tours.onTourClicked = onTourClicked;

        /*
        Collapses bookmark description window.
        */
        function collapseBookmarks() {
            if (!isBookmarksWindowExpanded)
                return;
            isBookmarksWindowExpanded = false;
            $("#bookmarks .header").hide('slide', {}, 'fast');
            $("#bookmarks .slideHeader").hide('slide', {}, 'fast');
            $("#bookmarks .slideText").hide('slide', {}, 'fast');
            $("#bookmarks .slideFooter").hide('slide', {}, 'fast');
            $("#bookmarks").effect('size', { to: { width: '30px' } }, 'fast', function () {
                $("#bookmarks").css('width', '30px');
            });
            $("#bookmarksCollapse").attr("src", "/images/expand-right.png");
        }

        /*
        Expands bookmark description window.
        */
        function expandBookmarks() {
            if (isBookmarksWindowExpanded)
                return;
            isBookmarksWindowExpanded = true;

            //$("#bookmarks").switchClass('bookmarksWindow', 'bookmarksWindowCollapsed', 'slow',
            $("#bookmarks").effect('size', { to: { width: '200px', height: 'auto' } }, 'slow', function () {
                $("#bookmarks").css('width', '200px');
                $("#bookmarks").css('height', 'auto');
                $("#bookmarks .header").show('slide', {}, 'fast');
                $("#bookmarks .slideHeader").show('slide', {}, 'fast');
                $("#bookmarks .slideText").show('slide', {}, 'fast');
                $("#bookmarks .slideFooter").show('slide', {}, 'fast');
            });
            $("#bookmarksCollapse").attr("src", "/images/collapse-left.png");
        }

        /*
        Collapses/expands bookmark description window.
        */
        function onBookmarksCollapse() {
            if (!isBookmarksWindowExpanded) {
                expandBookmarks();
            } else {
                collapseBookmarks();
            }
        }
        Tours.onBookmarksCollapse = onBookmarksCollapse;

        /*
        Handles click in tour narration window.
        */
        function onNarrationClick() {
            if (Tours.isNarrationOn) {
                $("#tours-narration-on").removeClass("narration-selected", "slow");
                $("#tours-narration-off").addClass("narration-selected", "slow");
            } else {
                $("#tours-narration-on").addClass("narration-selected", "slow");
                $("#tours-narration-off").removeClass("narration-selected", "slow");
            }
            Tours.isNarrationOn = !Tours.isNarrationOn;
        }
        Tours.onNarrationClick = onNarrationClick;

        /*
        Called after successful response from tours request.
        @param content      (array) an array of tours that were returned by request
        */
        function parseTours(content) {
            Tours.tours = new Array();

            for (var i = 0; i < content.d.length; i++) {
                var areBookmarksValid = true;
                var tourString = content.d[i];

                // skip tours with invalid parameters
                if ((typeof tourString.bookmarks == 'undefined') || (typeof tourString.name == 'undefined') || (typeof tourString.sequence == 'undefined') || (tourString.bookmarks.length == 0))
                    continue;

                // build array of bookmarks of current tour
                var tourBookmarks = new Array();

                for (var j = 0; j < tourString.bookmarks.length; j++) {
                    var bmString = tourString.bookmarks[j];

                    // break if at least one bookmarks has invalid parameters
                    if ((typeof bmString.description == 'undefined') || (typeof bmString.lapseTime == 'undefined') || (typeof bmString.name == 'undefined') || (typeof bmString.url == 'undefined')) {
                        areBookmarksValid = false;
                        break;
                    }

                    tourBookmarks.push(new TourBookmark(bmString.url, bmString.name, bmString.lapseTime, bmString.description));
                }

                // skip tour with broken bookmarks
                if (!areBookmarksValid)
                    continue;

                // tour is correct and can be played
                var tour = new Tour(tourString.id, tourString.name, tourBookmarks, bookmarkTransition, CZ.Common.vc, tourString.category, tourString.audio, tourString.sequence, tourString.description);
                Tours.tours.push(tour);
            }

            $("body").trigger("toursInitialized");

            // if a GUID has been provided for a tour to start automatically
            if (typeof Tours.autoTourGUID !== 'undefined')
            {
                // try to find the tour for the specified GUID
                var tour = Tours.tours.filter(function (item)
                {
                    return item.id === Tours.autoTourGUID;
                });

                // if tour was found then render it
                if (tour.length === 1)
                {
                    Tours.takeTour(tour[0]);
                }
            }

        }
        Tours.parseTours = parseTours;

        /*
        Bookmark' transition handler function to be passed to tours.
        */
        function bookmarkTransition(visible, onCompleted, onInterrupted, bookmark) {
            Tours.tourBookmarkTransitionCompleted = onCompleted; // reinitialize animation completed handler for bookmark' transition
            Tours.tourBookmarkTransitionInterrupted = onInterrupted; // reinitialize animation interrupted handler for bookmark' transition

            Tours.pauseTourAtAnyAnimation = false;

            // id of this bookmark' transition animation
            var animId = CZ.Common.setVisible(visible);

            if (animId && bookmark) {
                CZ.Common.setNavigationStringTo = { bookmark: bookmark, id: animId };
            }
            return animId;
        }
        Tours.bookmarkTransition = bookmarkTransition;

        function loadTourFromURL() {
            var curURL = CZ.UrlNav.getURL();
            if ((typeof curURL.hash.params !== 'undefined') && (curURL.hash.params["tour"] > Tours.tours.length))
                return;

            if (typeof curURL.hash.params !== 'undefined' && typeof curURL.hash.params["tour"] !== 'undefined') {
                if (Tours.tours == null)
                    initializeToursContent();

                if (Tours.isTourWindowVisible) {
                    onTourClicked();
                }

                //var mytour = tours[curURL.hash.params["tour"] - 1];
                Tours.tour = Tours.tours[curURL.hash.params["tour"] - 1];

                $(".touritem-selected").removeClass("touritem-selected", "slow");

                activateTour(Tours.tour, true);

                if (Tours.tour.audio) {
                    // pause unwanted audio playback
                    Tours.tour.audio.pause();

                    // prohibit unwated audio playback after loading of audio
                    Tours.tour.audio.preload = "none";
                }
                tourPause();
                //        var tourControlDiv = document.getElementById("tour_control");
                //        tourControlDiv.style.display = "block";
                //        tour.tour_TourFinished.push(function (tour) {
                //            hideBookmark(tour);
                //            tourPause();
                //            hideBookmarks();
                //        });
                //tour.toggleAudio(true);
                //tour.currentPlace = { type: 'goto', bookmark: 0 };
                //showBookmark(tour, 0);
                //$("#tour_playpause").attr("src", "images/tour_play_off.jpg");
            }
        }
        Tours.loadTourFromURL = loadTourFromURL;

        // will use current collection's URL rather than looking up in db for remaining fn

        function showAutoTourURL(context)
        {
            var url         = getAutoTourURL(context);
            var $copyarea   = $('#message-window').find('textarea');

            CZ.Authoring.showMessageWindow
            (
                'You can use the following web address to directly link to this tour. ' +
                'Try pressing Ctrl + C to copy it to your clipboard.',
                context.title + ' URL'
            );

            $copyarea
                .text(url)
                .show()
                .focus()
                .select()
            ;
            
            setTimeout(function () { $copyarea.select(); }, 1000); // IE fix for select()

        }
        Tours.showAutoTourURL = showAutoTourURL;

        function getAutoTourURL(context)
        {
            return window.location.href.toLowerCase().split('#')[0] + '#@auto-tour=' + context.id;
        }
        Tours.getAutoTourURL = getAutoTourURL;

        function getFacebookURL(context)
        {
            return "http://www.facebook.com/sharer.php?u="  + encodeURIComponent(getAutoTourURL(context));
        }
        Tours.getFacebookURL = getFacebookURL;

        function getTwitterURL(context)
        {
            // see https://dev.twitter.com/web/tweet-button
            return "http://twitter.com/share?url="          + encodeURIComponent(getAutoTourURL(context)) +
                   "&hashtags=chronozoom&text="             + encodeURIComponent(context.title + ' - '  );
        }
        Tours.getTwitterURL = getTwitterURL;

    })(CZ.Tours || (CZ.Tours = {}));
    var Tours = CZ.Tours;
})(CZ || (CZ = {}));
﻿/// <reference path='urlnav.ts'/>
/// <reference path='settings.ts'/>
/// <reference path='common.ts'/>
/// <reference path='vccontent.ts'/>
/// <reference path='service.ts'/>
/* This file contains code to perform search over the CZ database and show the results in UI.
The page design must correspond to the schema and naming conventions presented here.
*/
var CZ;
(function (CZ) {
    (function (Search) {
        Search.isSearchWindowVisible = false;
        var delayedSearchRequest = null;

        // The method is called when the search button is clicked
        function onSearchClicked() {
            if (CZ.Tours.isTourWindowVisible && CZ.Tours.onTourClicked)
                CZ.Tours.onTourClicked();

            if (Search.isSearchWindowVisible) {
                $("#search").hide('slide', {}, 'slow');
            } else {
                $("#search").show('slide', {}, 'slow', function () {
                    $("#searchTextBox").focus();
                });
            }
            Search.isSearchWindowVisible = !Search.isSearchWindowVisible;
        }
        Search.onSearchClicked = onSearchClicked;

        function initializeSearch() {
            $("#searchTextBox").focus(function () {
                if ($(this).hasClass('emptyTextBox')) {
                    this.value = '';
                    $(this).removeClass('emptyTextBox');
                }
            }).blur(function () {
                if ($(this).hasClass('emptyTextBox')) {
                    if (this.value != '') {
                        $(this).removeClass('emptyTextBox');
                    }
                } else {
                    if (this.value == '') {
                        this.value = 'type here...';
                        $(this).addClass('emptyTextBox');
                    }
                }
            }).keyup(function () {
                if (delayedSearchRequest) {
                    clearTimeout(delayedSearchRequest);
                    delayedSearchRequest = null;
                }

                delayedSearchRequest = setTimeout(function () {
                    if ($('#searchTextBox').val() != "") {
                        $("#loadingImage").fadeIn('slow');
                    }
                    search(escapeSearchString($("#searchTextBox")[0].value.substr(0, 700))); // limit the search to the first 700 characters
                }, 300);
            });

            $("#search").hide();
        }
        Search.initializeSearch = initializeSearch;

        function navigateToElement(e) {
            if (!CZ.Authoring.isActive) {
                var animId = CZ.Common.setVisibleByUserDirectly(e.newvisible);
                if (animId) {
                    CZ.Common.setNavigationStringTo = { element: e.element, id: animId };
                }
            }
        }
        Search.navigateToElement = navigateToElement;

        function navigateToBookmark(bookmark) {
            if (bookmark && !CZ.Authoring.isActive) {
                var visible = CZ.UrlNav.navStringToVisible(bookmark, CZ.Common.vc);
                if (visible) {
                    var animId = CZ.Common.setVisibleByUserDirectly(visible);
                    if (animId) {
                        CZ.Common.setNavigationStringTo = { bookmark: bookmark, id: animId };
                    }
                }
            }
        }
        Search.navigateToBookmark = navigateToBookmark;

        function goToSearchResult(resultId, elementType) {
            var element = findVCElement(CZ.Common.vc.virtualCanvas("getLayerContent"), resultId, elementType);
            var navStringElement = CZ.UrlNav.vcelementToNavString(element);
            CZ.Overlay.Hide();
            var visible = CZ.UrlNav.navStringToVisible(navStringElement, CZ.Common.vc);
            CZ.Common.controller.moveToVisible(visible);
        }
        Search.goToSearchResult = goToSearchResult;

        // Recursively finds and returns an element with given id.
        // If not found, returns null.
        function findVCElement(root, id, elementType) {
            var lookingForCI = elementType === "contentItem";

            var rfind = function (el, id) {
                if (el.id === id)
                    return el;
                if (!el.children)
                    return null;
                var n = el.children.length;
                for (var i = 0; i < n; i++) {
                    var child = el.children[i];
                    if (child.id === id)
                        return child;
                }
                for (var i = 0; i < n; i++) {
                    var child = el.children[i];
                    var res = rfind(child, id);
                    if (res)
                        return res;
                }
                if (lookingForCI && el.type === 'infodot') {
                    var ci = CZ.VCContent.getContentItem(el, id);
                    if (ci != null) {
                        return ci;
                    }
                }

                return null;
            };

            return rfind(root, id);
        }

        function onSearchResults(searchString, results) {
            if (escapeSearchString($("#searchTextBox")[0].value).indexOf(searchString) === 0 || searchString === '') {
                var height;
                var output = $("#search .searchResults").empty();
                if (results == null) {
                } else if (results.length == 0) {
                    $("<div></div>", {
                        class: "searchNoResult",
                        text: "No results"
                    }).appendTo(output);
                } else {
                    var addResults = function (objectType, sectionTitle) {
                        var first = true;
                        for (var i = 0; i < results.length; i++) {
                            var item = results[i];
                            if (item.objectType != objectType)
                                continue;
                            var resultId;
                            var elementType;

                            switch (item.objectType) {
                                case 0:
                                    resultId = 'e' + item.id;
                                    elementType = "exhibit";
                                    break;
                                case 1:
                                    resultId = 't' + item.id;
                                    elementType = "timeline";
                                    break;
                                case 2:
                                    resultId = item.id;
                                    elementType = "contentItem";
                                    break;
                                default:
                                    continue;
                            }
                            if (first) {
                                $("<div></div>", {
                                    class: "searchResultSection",
                                    text: sectionTitle
                                }).appendTo(output);

                                first = false;
                            }
                            $("<div></div>", {
                                class: "searchResult",
                                resultId: resultId,
                                text: results[i].title,
                                click: function () {
                                    goToSearchResult(this.getAttribute("resultId"), this.getAttribute("data-element-type"));
                                }
                            }).attr("data-element-type", elementType).appendTo(output);
                        }
                    };
                    addResults(1, "Timelines");
                    addResults(0, "Exhibits");
                    addResults(2, "Artifacts");
                }
            }

            if (isSearching) {
                isSearching = false;
            }
            if (pendingSearch != null) {
                var q = pendingSearch;
                pendingSearch = null;
                search(q);
            }

            $("#loadingImage").fadeOut('slow');
        }

        var pendingSearch = null;
        var isSearching = false;
        function search(searchString) {
            if (isSearching) {
                pendingSearch = searchString;
                return;
            }

            // isSearching is false
            isSearching = true;

            if (!searchString || searchString === '') {
                setTimeout(function () {
                    onSearchResults(searchString);
                }, 1);
                return;
            }

            var url;
            switch (CZ.Settings.czDataSource) {
                case 'db':
                    url = "/api/Search";
                    break;
                default:
                    url = "/api/Search";
                    break;
            }
            $.ajax({
                cache: false,
                type: "GET",
                async: true,
                dataType: "json",
                data: { searchTerm: searchString, supercollection: CZ.Service.superCollectionName, collection: CZ.Service.collectionName },
                url: url,
                success: function (result) {
                    onSearchResults(searchString, result.d);
                },
                error: function (xhr) {
                    console.log("Error connecting to service: " + xhr.responseText);
                }
            });
        }

        function escapeSearchString(searchString) {
            if (searchString === null)
                return '';
            if (searchString) {
                searchString = searchString.replace(new RegExp('"', "g"), '');
            }
            return searchString;
        }
    })(CZ.Search || (CZ.Search = {}));
    var Search = CZ.Search;
})(CZ || (CZ = {}));
﻿/// <reference path='urlnav.ts'/>
/// <reference path='vccontent.ts'/>
/// <reference path='settings.ts'/>
/// <reference path='typings/jquery/jquery.d.ts'/>
var CZ;
(function (CZ) {
    (function (Bibliography) {
        function initializeBibliography() {
            $("#bibliographyBack").hide();
            $("#biblCloseButton").mouseup(function () {
                pendingBibliographyForExhibitID = null;
                $("#bibliographyBack").hide('clip', {}, 'slow');
                window.location.hash = window.location.hash.replace(new RegExp("&b=[a-z0-9_\-]+$", "gi"), "");
            });
        }
        Bibliography.initializeBibliography = initializeBibliography;

        var pendingBibliographyForExhibitID = null;

        function showBibliography(descr, element, id) {
            // Bibliography link that raised showBibliohraphy.
            var sender;

            try  {
                sender = CZ.VCContent.getChild(element, id);
            } catch (ex) {
                return;
            }

            var vp = CZ.Common.vc.virtualCanvas("getViewport");
            var nav = CZ.UrlNav.vcelementToNavString(element, vp);

            if (window.location.hash.match("b=([a-z0-9_\-]+)") == null) {
                var bibl = "&b=" + id;
                if (window.location.hash.indexOf('@') == -1)
                    bibl = "@" + bibl;
                nav = nav + bibl;
            }

            window.location.hash = nav;

            // Remove 'onmouseclick' handler from current bibliography link to prevent multiple opening animation of bibliography window.
            sender.onmouseclick = null;
            var a = $("#bibliographyBack").css("display");
            if ($("#bibliographyBack").css("display") == "none") {
                $("#bibliographyBack").show('clip', {}, 'slow', function () {
                    // After bibliography window was fully opened, reset 'onmouseclick' handler for sender of bibliography link.
                    sender.onmouseclick = function (e) {
                        CZ.Common.vc.css('cursor', 'default');
                        showBibliography({ infodot: descr.infodot, contentItems: descr.contentItems }, element, id);

                        return true;
                    };
                });
            } else {
                // After bibliography window was fully opened, reset 'onmouseclick' handler for sender of bibliography link.
                sender.onmouseclick = function (e) {
                    CZ.Common.vc.css('cursor', 'default');
                    showBibliography({ infodot: descr.infodot, contentItems: descr.contentItems }, element, id);

                    return true;
                };
            }

            // clearing all fields
            $("#bibliography .sources").empty();

            // Filling with new information
            if (descr) {
                if (descr.infodot) {
                    $("#bibliography .title").text(descr.infodot.title + " > Bibliography");
                    getBibliography(descr.infodot.guid, descr.contentItems);
                } else {
                    $("#bibliography .title").text("> Bibliography");
                }
            }
        }
        Bibliography.showBibliography = showBibliography;

        function getBibliography(exhibitID, contentItems) {
            if (contentItems.length != 0) {
                var sources = $("#bibliography .sources");
                sources.empty();

                $("<div></div>", {
                    id: "biblAdditionalResources",
                    class: "sectionTitle",
                    text: "Current Resources"
                }).appendTo(sources);

                for (var i = 0; i < contentItems.length; i++) {
                    var r = contentItems[i];
                    var source = $("<div></div>", {
                        class: "source"
                    }).appendTo(sources);

                    if (r.mediaSource) {
                        $("<div></div>", {
                            class: "sourceName"
                        }).append($("<a></a>", {
                            href: r.mediaSource,
                            target: "_blank",
                            text: r.mediaSource
                        })).appendTo(source);
                    } else {
                        $('<br/>').appendTo(source);
                    }

                    var sourceDescr = $("<div></div>", {
                        class: "sourceDescr"
                    });

                    if (r.title) {
                        $("<i></i>", {
                            text: r.title,
                            class: "truncateText"
                        }).appendTo(sourceDescr);
                    }
                    if (r.attribution) {
                        if (r.title !== '') {
                            $("<br></br>", {}).appendTo(sourceDescr);
                        }
                        $("<div></div>", {
                            text: r.attribution,
                            class: "truncateText"
                        }).appendTo(sourceDescr);
                    }

                    sourceDescr.appendTo(source);
                }
            }
        }
    })(CZ.Bibliography || (CZ.Bibliography = {}));
    var Bibliography = CZ.Bibliography;
})(CZ || (CZ = {}));
;
﻿/// <reference path='settings.ts'/>
/// <reference path='search.ts'/>
var CZ;
(function (CZ) {
    (function (BreadCrumbs) {
        var hiddenFromLeft = [];
        var hiddenFromRight = [];
        BreadCrumbs.visibleAreaWidth = 0;

        var breadCrumbs;

        // Updates current breadcrumbs path, raised when breadcrumbs path has changed.
        // @param  newBreadCrumbs       (array) new breadcrumbs path.
        function updateBreadCrumbsLabels(newBreadCrumbs) {
            if (newBreadCrumbs) {
                if (breadCrumbs == null) {
                    breadCrumbs = newBreadCrumbs;
                    for (var i = 0; i < breadCrumbs.length; i++)
                        addBreadCrumb(breadCrumbs[i].vcElement);

                    moveToRightEdge();

                    return;
                }

                for (var i = 0; i < breadCrumbs.length; i++) {
                    // length of new path is lower than length of current path, remove excess breadcrumb links
                    if (newBreadCrumbs[i] == null)
                        removeBreadCrumb();
                    else if (newBreadCrumbs[i].vcElement.id != breadCrumbs[i].vcElement.id) {
                        for (var j = i; j < breadCrumbs.length; j++)
                            removeBreadCrumb();
                        for (var j = i; j < newBreadCrumbs.length; j++)
                            addBreadCrumb(newBreadCrumbs[j].vcElement);
                        breadCrumbs = newBreadCrumbs;
                        return;
                    }
                }

                moveToRightEdge();

                for (var i = breadCrumbs.length; i < newBreadCrumbs.length; i++)
                    addBreadCrumb(newBreadCrumbs[i].vcElement);

                moveToRightEdge();

                breadCrumbs = newBreadCrumbs;
            }
        }
        BreadCrumbs.updateBreadCrumbsLabels = updateBreadCrumbsLabels;

        // Update hidden breadcrumb links arrays. Breadcrumb is hidden, if more than 1/3 of its width
        // is not visible and this breadcrumb is not animating.
        function updateHiddenBreadCrumbs() {
            hiddenFromLeft = [];
            hiddenFromRight = [];

            var tableOffset = $("#breadcrumbs-table tr").position().left;

            $("#breadcrumbs-table tr td").each(function (index) {
                // element is not hidden if it is moving to be shown already
                if ($(this).attr("moving") != "left" && $(this).attr("moving") != "right") {
                    var elementOffset = $(this).position().left + tableOffset;
                    var elementWidth = $(this).width();

                    // if at least 1 px of first breadcrumb link is hidden, then this breadcrumb is hidden
                    if (index == 0) {
                        if (elementOffset < 0)
                            hiddenFromLeft.push(index);
                    } else if (index == $("#breadcrumbs-table tr td").length - 1) {
                        if (elementOffset + elementWidth > BreadCrumbs.visibleAreaWidth)
                            hiddenFromRight.push(index);
                    } else {
                        if (elementOffset + elementWidth / 3 < 0)
                            hiddenFromLeft.push(index);
                        else if (elementOffset + elementWidth * 2 / 3 > BreadCrumbs.visibleAreaWidth)
                            hiddenFromRight.push(index);
                    }
                }
            });

            hiddenFromRight.reverse();

            // hide (show) left nav button if no hidden (at least 1 hidden) breadcrumb from left
            if (hiddenFromLeft.length != 0)
                $("#breadcrumbs-nav-left").stop(true, true).fadeIn('fast');
            else
                $("#breadcrumbs-nav-left").stop(true, true).fadeOut('fast');

            // hide (show) right nav button if no hidden (at least 1 hidden) breadcrumb from right
            if (hiddenFromRight.length != 0)
                $("#breadcrumbs-nav-right").stop(true, true).fadeIn('fast');
            else
                $("#breadcrumbs-nav-right").stop(true, true).fadeOut('fast');
        }
        BreadCrumbs.updateHiddenBreadCrumbs = updateHiddenBreadCrumbs;

        // Moves hidden from left (right) breadcrumb to left (right) side of breadcrumb panel.
        // @param direction     (string) direction of navigation.
        // @param index         (number) index of breadcrumb to show, shows first hidden element if param is null.
        function showHiddenBreadCrumb(direction, index) {
            // finds index of breadcrumb that should be shown if index is undefined
            if (index == null) {
                updateHiddenBreadCrumbs();
                switch (direction) {
                    case "left":
                        if (hiddenFromLeft.length != 0)
                            index = hiddenFromLeft.pop();
                        else
                            return;
                        break;
                    case "right":
                        if (hiddenFromRight.length != 0)
                            index = hiddenFromRight.pop();
                        else
                            return;
                        break;
                }
            }

            $("#breadcrumbs-table tr").stop();

            var element = $("#bc_" + index);
            var tableOffset = $("#breadcrumbs-table tr").position().left;
            var elementOffset = element.position().left + tableOffset;
            var offset = 0;

            switch (direction) {
                case "left":
                    offset = -elementOffset;
                    break;
                case "right":
                    var elementWidth = element.width();
                    offset = BreadCrumbs.visibleAreaWidth - elementOffset - elementWidth - 1;
                    break;
            }

            if (offset != 0) {
                var str = "+=" + offset + "px";
                element.attr("moving", direction); // apply "moving" attribute to this breadcrumb element

                $("#breadcrumbs-table tr").animate({ "left": str }, "slow", function () {
                    $("#breadcrumbs-table tr td").each(function () {
                        // clear "moving" attributes for each breadcrumb
                        $(this).attr("moving", "false");
                    });
                    updateHiddenBreadCrumbs();
                });
            }
        }

        // Moves breadcrumbs path to the right edge of visible area of breadcrumbs if it is allowed.
        // @param   callback            (function) callback function at the end of animation.
        function moveToRightEdge(callback) {
            var tableOffset = $("#breadcrumbs-table tr").position().left;
            var tableWidth = $("#breadcrumbs-table tr").width();

            if (tableOffset <= 0) {
                // some breadcrumbs are hidden
                // var hidden = tableOffset; // width in px of hidden from the left side part of breadcrumbs
                var tableVisible = tableWidth + tableOffset;

                var difference = 0;

                if (tableWidth >= BreadCrumbs.visibleAreaWidth)
                    if (tableVisible > BreadCrumbs.visibleAreaWidth)
                        difference = BreadCrumbs.visibleAreaWidth - tableVisible - 1;
                    else
                        // move to the right edge of visible area
                        difference = BreadCrumbs.visibleAreaWidth - tableVisible - 1;
                else
                    // width of hidden part is not enought to fill whole visible area
                    difference = -tableOffset;

                $("#breadcrumbs-table tr").stop();

                if (difference != 0) {
                    var str = "+=" + difference + "px";

                    $("#breadcrumbs-table tr").animate({ "left": str }, "fast", function () {
                        $("#breadcrumbs-table tr td").each(function () {
                            // clear "moving" attributes for each breadcrumb
                            $(this).attr("moving", "false");
                        });

                        updateHiddenBreadCrumbs();
                        if (callback != null)
                            callback();
                    });
                }
            }
        }

        // Removes last breadcrumb link.
        function removeBreadCrumb() {
            var length = $("#breadcrumbs-table tr td").length;

            if (length > 0) {
                var selector = "#bc_" + (length - 1);
                $(selector).remove();

                if (length > 1) {
                    selector = "#bc_" + (length - 2);
                    $(selector + " .breadcrumb-separator").hide();
                }
            }
        }

        // Adds new breadcrumb link.
        // @param  element      (object) breadcrumb to be added.
        function addBreadCrumb(element) {
            var length = $("#breadcrumbs-table tr td").length;

            // add breadcrumb to table
            $("#breadcrumbs-table tr").append($("<td></td>", {
                id: "bc_" + length
            }).append($("<div></div>", {
                id: "bc_link_" + element.id,
                class: "breadcrumb-link",
                text: element.title,
                click: function () {
                    clickOverBreadCrumb(element.id, length);
                }
            })).append($("<span></span>", {
                id: "bc_",
                class: "breadcrumb-separator",
                text: "›"
            })));

            switch (element.regime) {
                case "Cosmos":
                    $("#bc_link_" + element.id).addClass("breadcrumb-cosmos");
                    break;
                case "Earth":
                    $("#bc_link_" + element.id).addClass("breadcrumb-earth");
                    break;
                case "Life":
                    $("#bc_link_" + element.id).addClass("breadcrumb-life");
                    break;
                case "Pre-history":
                    $("#bc_link_" + element.id).addClass("breadcrumb-prehistory");
                    break;
                case "Humanity":
                    $("#bc_link_" + element.id).addClass("breadcrumb-humanity");
                    break;
            }

            // hide context search button for new breadcrumb element
            $("#bc_" + length + " .breadcrumb-separator").hide();

            if (length > 0)
                $("#bc_" + (length - 1) + " .breadcrumb-separator").show();

            $("#bc_link_" + element.id).mouseover(function () {
                breadCrumbMouseOver(this);
            });

            $("#bc_link_" + element.id).mouseout(function () {
                breadCrumbMouseOut(this);
            });
        }

        // Handles click over navigate to left button.
        function breadCrumbNavLeft() {
            var movingLeftBreadCrumbs = 0;
            var num = 0;

            $("#breadcrumbs-table tr td").each(function (index) {
                if ($(this).attr("moving") == "left") {
                    movingLeftBreadCrumbs++;
                    if (num == 0)
                        num = index;
                }
            });

            // perform long navigation if enough breadcrumbs are moving at one time
            if (movingLeftBreadCrumbs == CZ.Settings.navigateNextMaxCount) {
                var index = num - CZ.Settings.longNavigationLength;
                if (index < 0)
                    index = 0;

                showHiddenBreadCrumb("left", index);
            } else if (movingLeftBreadCrumbs < CZ.Settings.navigateNextMaxCount)
                showHiddenBreadCrumb("left");
        }
        BreadCrumbs.breadCrumbNavLeft = breadCrumbNavLeft;

        // Handles click over navigate to right button.
        function breadCrumbNavRight() {
            var movingRightBreadCrumbs = 0;
            var num = 0;

            $("#breadcrumbs-table tr td").each(function (index) {
                if ($(this).attr("moving") == "right") {
                    movingRightBreadCrumbs++;
                    num = index;
                }
            });

            // perform long navigation if enough breadcrumbs are moving at one time
            if (movingRightBreadCrumbs == CZ.Settings.navigateNextMaxCount) {
                var index = num + CZ.Settings.longNavigationLength;
                if (index >= $("#breadcrumbs-table tr td").length)
                    index = $("#breadcrumbs-table tr td").length - 1;

                showHiddenBreadCrumb("right", index);
            } else if (movingRightBreadCrumbs < CZ.Settings.navigateNextMaxCount)
                showHiddenBreadCrumb("right");
        }
        BreadCrumbs.breadCrumbNavRight = breadCrumbNavRight;

        // Handles click over breadcrumb link.
        // @param   timelineID          (string) id of timeline to navigate.
        // @param   breadCrumbLinkID    (string) id of table element which breadcrumb link was cliked.
        function clickOverBreadCrumb(timelineID, breadCrumbLinkID)
        {
            if (!timelineID) return;

            CZ.Search.goToSearchResult(timelineID); // start EllipticalZoom to element

            var selector = "#bc_" + breadCrumbLinkID;

            var tableOffset = $("#breadcrumbs-table tr").position().left;
            var elementOffset = $(selector).position().left + tableOffset;
            var elementWidth = $(selector).width();

            // make breadcrumb link fully visible, if part of it was hidden.
            if (elementOffset < 0)
                showHiddenBreadCrumb("left", breadCrumbLinkID);
            else if (elementOffset + elementWidth > BreadCrumbs.visibleAreaWidth)
                showHiddenBreadCrumb("right", breadCrumbLinkID);
        }
        BreadCrumbs.clickOverBreadCrumb = clickOverBreadCrumb;

        // Functions to change breadcrumb's link color, to avoid bug when <class:hover> doesn't work in IE when mouse enter breadcrumb link
        // through image that is right to it.
        function breadCrumbMouseOut(element) {
            $(element).removeClass("breadcrumb-hover");
        }

        function breadCrumbMouseOver(element) {
            $(element).addClass("breadcrumb-hover");
        }

        // Changes image from <off> state to <on> state
        function changeToOff(element) {
            var src = element.getAttribute("src");
            element.setAttribute("src", src.replace("_on", "_off"));
        }

        // Changes image from <on> state to <off> state
        function changeToOn(element) {
            var src = element.getAttribute("src");
            element.setAttribute("src", src.replace("_off", "_on"));
        }
    })(CZ.BreadCrumbs || (CZ.BreadCrumbs = {}));
    var BreadCrumbs = CZ.BreadCrumbs;
})(CZ || (CZ = {}));
﻿/// <reference path='settings.ts'/>
/// <reference path='common.ts'/>
/// <reference path='vccontent.ts'/>
/// <reference path='service.ts'/>
/// <reference path='dates.ts' />
/**
* The CZ submodule for Authoring Tool functionality.
* Use initialize() method to bind UI with Authoring Tool.
*/
var CZ;
(function (CZ) {
    (function (Authoring) {
        // Virtual canvas widget.
        var _vcwidget;

        // Mouse position.
        var _dragStart = {};
        var _dragPrev = {};
        var _dragCur = {};

        // Current hovered object in virtual canvas.
        var _hovered = {};

        // New timeline rectangle.
        var _rectPrev = { type: "rectangle" };
        var _rectCur = { type: "rectangle" };

        // New exhibit circle.
        var _circlePrev = { type: "circle" };
        var _circleCur = { type: "circle" };

        // Selected objects for editing.
        Authoring.selectedTimeline = {};
        Authoring.selectedExhibit = {};
        Authoring.selectedContentItem = {};

        // Authoring Tool state.
        Authoring.isActive = false;
        Authoring.isEnabled = false;
        Authoring.isDragging = false;

        //TODO: use enum for authoring modes when new authoring forms will be completly integrated
        Authoring.mode = null;
        Authoring.contentItemMode = null;

        // Forms' handlers.
        Authoring.showCreateTimelineForm = null;
        Authoring.showCreateRootTimelineForm = null;
        Authoring.showEditTimelineForm = null;
        Authoring.showCreateExhibitForm = null;
        Authoring.showEditExhibitForm = null;
        Authoring.showEditContentItemForm = null;
        Authoring.showEditTourForm = null;
        Authoring.showMessageWindow = null;
        Authoring.hideMessageWindow = null;

        // Generic callback function set by the form when waits user's input (e.g. mouse click) to continue.
        Authoring.callback = null;

        Authoring.timer;

        /**
        * Tests a timeline/exhibit on intersection with another virtual canvas object.
        * @param  {Object}  te   A timeline/exhibit to test.
        * @param  {Object}  obj  Virtual canvas object.
        * @return {Boolean}      True in case of intersection, False otherwise.
        */
        function isIntersecting(te, obj) {
            switch (obj.type) {
                case "timeline":
                case "infodot":
                    return (te.x + te.width > obj.x && te.x < obj.x + obj.width && te.y + te.height > obj.y && te.y < obj.y + obj.height);
                default:
                    return false;
            }
        }

        /**
        * Tests a virtual canvas object on inclusion in a timeline.
        * @param  {Object}  tp  An estimated parent timeline.
        * @param  {Object}  obj An estimated child virtual canvas object.
        * @return {Boolean}     True in case of inclusion, False otherwise.
        */
        function isIncluded(tp, obj) {
            switch (obj.type) {
                case "infodot":
                    return (tp.x <= obj.infodotDescription.date && tp.x + tp.width >= obj.infodotDescription.date && tp.y + tp.height >= obj.y + obj.height);
                    break;
                case "timeline":
                case "rectangle":
                case "circle":
                    return (tp.x <= obj.x + CZ.Settings.allowedMathImprecision && tp.x + tp.width >= obj.x + obj.width - CZ.Settings.allowedMathImprecision && tp.y + tp.height >= obj.y + obj.height - CZ.Settings.allowedMathImprecision);
                default:
                    return true;
            }
        }

        /**
        * The main function to test a timeline on intersections.
        * First of all it tests on inclusion in parent timeline.
        * Then it tests a timeline on intersection with each parent's child.
        * Also tests on inclusion all timeline's children if it has some.
        * @param  {Object} tp       An estimated parent timeline.
        * @param  {Object} tc       An estimated child timeline. This one will be tested.
        * @param  {Boolean} editmode If true, it doesn't take into account edited timeline.
        * @return {Boolean}          True if test is passed, False otherwise.
        */
        function checkTimelineIntersections(tp, tc, editmode) {
            var i = 0;
            var len = 0;
            var selfIntersection = false;

            // If creating root timeline, skip intersection validations
            if (!tp || tp.guid === null) {
                return true;
            }

            // Test on inclusion in parent.
            if (!isIncluded(tp, tc) && tp.id !== "__root__") {
                return false;
            }

            for (i = 0, len = tp.children.length; i < len; ++i) {
                selfIntersection = editmode ? (tp.children[i] === Authoring.selectedTimeline) : (tp.children[i] === tc);
                if (!selfIntersection && isIntersecting(tc, tp.children[i])) {
                    return false;
                }
            }

            // Test on children's inclusion (only possible in editmode).
            if (editmode && Authoring.selectedTimeline.children && Authoring.selectedTimeline.children.length > 0) {
                for (i = 0, len = Authoring.selectedTimeline.children.length; i < len; ++i) {
                    if (!isIncluded(tc, Authoring.selectedTimeline.children[i])) {
                        return false;
                    }
                }
            }

            return true;
        }

        /**
        * The main function to test an exhibit on intersections.
        * First of all it tests on inclusion in parent timeline.
        * Then it tests a timeline on intersection with each parent's child.
        * @param  {Object} tp       An estimated parent timeline.
        * @param  {Object} ec       An estimated child exhibit. This one will be tested.
        * @param  {Boolean} editmode If true, it doesn't take into account edited exhibit.
        * @return {Boolean}          True if test is passed, False otherwise.
        */
        function checkExhibitIntersections(tp, ec, editmode) {
            var i = 0;
            var len = 0;
            var selfIntersection = false;

            // Test on inclusion in parent.
            if (!isIncluded(tp, ec)) {
                return false;
            }

            return true;
        }
        Authoring.checkExhibitIntersections = checkExhibitIntersections;

        /**
        * Updates rectangle of new timeline during creation.
        */
        function updateNewRectangle() {
            // Update rectangle's size and position.
            _rectCur.x = Math.min(_dragStart.x, _dragCur.x);
            _rectCur.y = Math.min(_dragStart.y, _dragCur.y);
            _rectCur.width = Math.abs(_dragStart.x - _dragCur.x);
            _rectCur.height = Math.abs(_dragStart.y - _dragCur.y);

            // Test on intersections and update timeline's rectangle if it passes the test.
            if (checkTimelineIntersections(_hovered, _rectCur, false)) {
                // Set border's color of timeline's rectangle.
                var settings = $.extend({}, _hovered.settings);
                settings.strokeStyle = "yellow";

                $.extend(_rectPrev, _rectCur);

                CZ.VCContent.removeChild(_hovered, "newTimelineRectangle");
                CZ.VCContent.addRectangle(_hovered, _hovered.layerid, "newTimelineRectangle", _rectCur.x, _rectCur.y, _rectCur.width, _rectCur.height, settings);
            } else {
                $.extend(_rectCur, _rectPrev);
            }
        }

        /**
        * Updates circle of new exhibit during creation.
        */
        function updateNewCircle() {
            // Update circle's position and radius.
            // NOTE: These values are heuristic.
            _circleCur.r = (_hovered.width > _hovered.height) ? _hovered.height / 27.7 : _hovered.width / 10.0;

            _circleCur.x = _dragCur.x - _circleCur.r;
            _circleCur.y = _dragCur.y - _circleCur.r;
            _circleCur.width = _circleCur.height = 2 * _circleCur.r;

            // Test on intersections and update exhibits's circle if it passes the test.
            if (checkExhibitIntersections(_hovered, _circleCur, false)) {
                $.extend(_circlePrev, _circleCur);

                CZ.VCContent.removeChild(_hovered, "newExhibitCircle");
                CZ.VCContent.addCircle(_hovered, "layerInfodots", "newExhibitCircle", _circleCur.x + _circleCur.r, _circleCur.y + _circleCur.r, _circleCur.r, {
                    strokeStyle: "yellow"
                }, false);
            } else {
                $.extend(_circleCur, _circlePrev);
            }
        }

        /**
        * Removes and then adds exhibit and all of its nested content from canvas. Used to simplify
        * update of exhibit's info.
        * Use it in when you need to update exhibit's or some of its content item's info.
        * @param  {Object} e    An exhibit to renew.
        */
        function renewExhibit(e) {
            var vyc = e.y + e.height / 2;
            var time = e.x + e.width / 2;
            var id = e.id;
            var cis = e.contentItems;
            var descr = e.infodotDescription;
            descr.opacity = 1;
            descr.title = e.title;
            descr.guid = e.guid;
            var parent = e.parent;
            var radv = e.outerRad;

            // remove and then adding infodot to position content items properly
            CZ.VCContent.removeChild(parent, id);
            return CZ.VCContent.addInfodot(parent, "layerInfodots", id, time, vyc, radv, cis, descr);
        }
        Authoring.renewExhibit = renewExhibit;

        /**
        * Creates new timeline and adds it to virtual canvas.
        * @return {Object} Created timeline.
        */
        function createNewTimeline() {
            return CZ.VCContent.addTimeline(_hovered, _hovered.layerid, undefined, {
                timeStart: _rectCur.x,
                timeEnd: _rectCur.x + _rectCur.width,
                header: "Timeline Title",
                top: _rectCur.y,
                height: _rectCur.height,
                fillStyle: _hovered.settings.fillStyle,
                regime: _hovered.regime,
                gradientFillStyle: _hovered.settings.gradientFillStyle,
                lineWidth: _hovered.settings.lineWidth,
                strokeStyle: _hovered.settings.gradientFillStyle
            });
        }
        Authoring.createNewTimeline = createNewTimeline;

        /**
        * Creates new exhibit and adds it to virtual canvas.
        * @return {Object} Created exhibit.
        */
        function createNewExhibit() {
            CZ.VCContent.removeChild(_hovered, "newExhibitCircle");
            return CZ.VCContent.addInfodot(_hovered, "layerInfodots", undefined, _circleCur.x + _circleCur.r, _circleCur.y + _circleCur.r, _circleCur.r, [], {
                title: "Exhibit Title",
                date: _circleCur.x + _circleCur.r,
                guid: undefined
            });
        }

        /**
        * Updates title of edited timeline. It creates new CanvasText
        * object for title for recalculation of title's size.
        * @param  {Object} t Edited timeline, whose title to update.
        */
        function updateTimelineTitle(t) {
            // computing titleBorderBox - margins, width, height of canvas text based on algorithm in layout.ts
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            t.left = t.x;
            t.right = t.x + t.width;
            var titleBorderBox = CZ.Layout.GenerateTitleObject(t.height, t, ctx);

            // remove old timeline header
            CZ.VCContent.removeChild(t, t.id + "__header__");

            // add new timeline's header
            var baseline = t.y + titleBorderBox.marginTop + titleBorderBox.height / 2.0;
            t.titleObject = CZ.VCContent.addText(t, t.layerid, t.id + "__header__", t.x + titleBorderBox.marginLeft, t.y + titleBorderBox.marginTop, baseline, titleBorderBox.height, t.title, {
                fontName: CZ.Settings.timelineHeaderFontName,
                fillStyle: CZ.Settings.timelineHeaderFontColor,
                textBaseline: 'middle',
                opacity: 1
            }, titleBorderBox.width);
        }

        /**
        * Represents a collection of mouse events' handlers for each mode.
        * Example of using: CZ.Authoring.modeMouseHandlers[CZ.Authoring.mode]["mouseup"]();
        *                   (calls mouseup event handler for current mode)
        */
        Authoring.modeMouseHandlers = {
            createTimeline: {
                mousemove: function () {
                    if (CZ.Authoring.isDragging && _hovered.type === "timeline") {
                        updateNewRectangle();
                    }
                },
                mouseup: function () {
                    if (_dragCur.x === _dragStart.x && _dragCur.y === _dragStart.y) {
                        return;
                    }

                    if (_hovered.type === "timeline") {
                        CZ.VCContent.removeChild(_hovered, "newTimelineRectangle");
                        Authoring.selectedTimeline = createNewTimeline();
                        Authoring.showCreateTimelineForm(Authoring.selectedTimeline);
                    }
                }
            },
            editTour: {},
            "editTour-selectTarget": {
                mouseup: function () {
                    if (Authoring.callback != null && _hovered != undefined && _hovered != null && typeof _hovered.type != "undefined")
                        Authoring.callback(_hovered);
                },
                mousemove: function () {
                }
            },
            editTimeline: {
                mouseup: function () {
                    Authoring.showEditTimelineForm(Authoring.selectedTimeline);
                }
            },
            createExhibit: {
                mousemove: function () {
                    if (CZ.Authoring.isDragging && _hovered.type === "timeline") {
                        updateNewCircle();
                    }
                },
                mouseup: function () {
                    if (_hovered.type === "timeline") {
                        updateNewCircle();

                        Authoring.selectedExhibit = createNewExhibit();
                        Authoring.showCreateExhibitForm(Authoring.selectedExhibit);
                    }
                }
            },
            editExhibit: {
                mouseup: function () {
                    Authoring.showEditExhibitForm(Authoring.selectedExhibit);
                }
            },
            editContentItem: {
                mouseup: function () {
                    Authoring.showEditContentItemForm(Authoring.selectedContentItem, Authoring.selectedExhibit);
                }
            }
        };

        /**
        * The main function for binding UI and Authoring Tool.
        * It assigns additional handlers for virtual canvas mouse
        * events and forms' handlers.
        * @param  {Object} vc           jQuery instance of virtual canvas.
        * @param  {Object} formHandlers An object with the same "show..." methods as Authoring object.
        */
        function initialize(vc, formHandlers) {
            _vcwidget = vc.data("ui-virtualCanvas");

            _vcwidget.element.on("mousedown", function (event) {
                if (CZ.Authoring.isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                    CZ.Authoring.isDragging = true;
                    _dragStart = posv;
                    _dragPrev = {};
                    _dragCur = posv;
                    _hovered = _vcwidget.hovered || {};
                }
            });

            _vcwidget.element.on("mouseup", function (event) {
                if (CZ.Authoring.isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                    CZ.Authoring.isDragging = false;
                    _dragPrev = _dragCur;
                    _dragCur = posv;

                    // NOTE: Using global variable to disable animation on click!
                    CZ.Common.controller.stopAnimation();

                    CZ.Authoring.modeMouseHandlers[CZ.Authoring.mode]["mouseup"]();
                }
            });

            _vcwidget.element.on("mousemove", function (event) {
                if (CZ.Authoring.isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                    _dragPrev = _dragCur;
                    _dragCur = posv;

                    CZ.Authoring.modeMouseHandlers[CZ.Authoring.mode]["mousemove"]();
                }
            });

            // Assign forms' handlers.
            Authoring.showCreateTimelineForm = formHandlers && formHandlers.showCreateTimelineForm || function () {
            };
            Authoring.showCreateRootTimelineForm = formHandlers && formHandlers.showCreateRootTimelineForm || function () {
            };
            Authoring.showEditTimelineForm = formHandlers && formHandlers.showEditTimelineForm || function () {
            };
            Authoring.showCreateExhibitForm = formHandlers && formHandlers.showCreateExhibitForm || function () {
            };
            Authoring.showEditExhibitForm = formHandlers && formHandlers.showEditExhibitForm || function () {
            };
            Authoring.showEditContentItemForm = formHandlers && formHandlers.showEditContentItemForm || function () {
            };
            Authoring.showEditTourForm = formHandlers && formHandlers.showEditTourForm || function () {
            };
            Authoring.showMessageWindow = formHandlers && formHandlers.showMessageWindow || function (mess, title) {
            };
            Authoring.hideMessageWindow = formHandlers && formHandlers.hideMessageWindow || function () {
            };
        }
        Authoring.initialize = initialize;

        /**
        * Updates timeline's properties.
        * Use it externally from forms' handlers.
        * @param  {Object} t    A timeline to update.
        * @param  {Object} prop An object with properties' values.
        * @param  {Widget} form A dialog form for editing timeline.
        */
        function updateTimeline(t, prop) {
            var deffered = jQuery.Deferred();

            var temp = {
                x: Number(prop.start),
                y: t.y,
                width: prop.end === 9999 ? Number(CZ.Dates.getCoordinateFromDecimalYear(prop.end) - prop.start) : Number(prop.end - prop.start),
                height: t.height,
                type: "rectangle"
            };

            if (checkTimelineIntersections(t.parent, temp, true)) {
                t.x = temp.x;
                t.width = temp.width;
                t.endDate = prop.end;

                // Decrease height if possible to make better aspect ratio.
                // Source: layout.js, LayoutTimeline method.
                // NOTE: it won't cause intersection errors since height decreases
                //       and the timeline has no any children (except CanvasImage
                //       and CanvasText for edit button and title).
                if (t.children.length < 3) {
                    t.height = Math.min.apply(Math, [
                        t.parent.height * CZ.Layout.timelineHeightRate,
                        t.width * CZ.Settings.timelineMinAspect,
                        t.height
                    ]);
                }

                // Update title.
                t.title = prop.title;
                updateTimelineTitle(t);

                // Update background URL and aspect ratio.
                t.backgroundUrl = prop.backgroundUrl;
                t.aspectRatio = prop.aspectRatio;

                CZ.Service.putTimeline(t).then(function (success) {
                    // update ids if existing elements with returned from server
                    t.id = "t" + success;
                    t.guid = success;
                    t.titleObject.id = "t" + success + "__header__";

                    if (!t.parent.guid) {
                        // Root timeline, refresh page
                        document.location.reload(true);
                    } else {
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                    }
                    deffered.resolve(t);
                }, function (error) {
                    deffered.reject(error);
                });
            } else {
                deffered.reject('Timeline intersects with parent timeline or other siblings');
            }

            return deffered.promise();
        }
        Authoring.updateTimeline = updateTimeline;
        ;

        /**
        * Removes a timeline from virtual canvas.
        * Use it externally from form's handlers.
        * @param  {Object} t A timeline to remove.
        */
        function removeTimeline(t) {
            var deferred = $.Deferred();

            CZ.Service.deleteTimeline(t).then(function (updateCanvas) {
                CZ.Common.vc.virtualCanvas("requestInvalidate");
                deferred.resolve();
            });
            var isRoot = !t.parent.guid;
            CZ.VCContent.removeChild(t.parent, t.id);

            if (isRoot) {
                // Root timeline, refresh page
                document.location.reload(true);
            }
        }
        Authoring.removeTimeline = removeTimeline;

        /**
        * Updates exhibit's properties.
        * Use it externally from forms' handlers.
        * @param  {Object} e    An exhibit to update.
        * @param  {Object} args An object with properties' values.
        */
        function updateExhibit(oldExhibit, args) {
            var deferred = $.Deferred();

            if (oldExhibit && oldExhibit.contentItems && args) {
                var newExhibit = $.extend({}, oldExhibit, { children: null });
                newExhibit = $.extend(true, {}, newExhibit); // deep copy exhibit
                delete newExhibit.children;
                delete newExhibit.contentItems;
                $.extend(true, newExhibit, args); // overwrite and append properties

                // pass cloned objects to CZ.Service calls to avoid any side effects
                CZ.Service.putExhibit(newExhibit).then(function (response) {
                    newExhibit.guid = response.ExhibitId;
                    for (var i = 0; i < newExhibit.contentItems.length; i++) {
                        newExhibit.contentItems[i].ParentExhibitId = newExhibit.guid;
                    }

                    $(response.ContentItemId).each(function (contentItemIdIndex, contentItemId) {
                        newExhibit.contentItems[contentItemIdIndex].id = contentItemId;
                        newExhibit.contentItems[contentItemIdIndex].guid = contentItemId;
                    });

                    newExhibit = renewExhibit(newExhibit);
                    newExhibit.id = "e" + response.ExhibitId;

                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                    deferred.resolve(newExhibit);
                }, function (error) {
                    console.log("Error connecting to service: update exhibit.\n" + error.responseText);
                    deferred.reject(error);
                });
            } else {
                deferred.reject();
            }

            return deferred.promise();
        }
        Authoring.updateExhibit = updateExhibit;

        /**
        * Removes an exhibit from virtual canvas.
        * Use it externally from form's handlers.
        * @param  {Object} e An exhibit to remove.
        */
        function removeExhibit(e) {
            var deferred = $.Deferred();

            if (e && e.id && e.parent) {
                var clone = $.extend({}, e, { children: null });
                clone = $.extend(true, {}, clone);

                CZ.Service.deleteExhibit(clone).then(function (response) {
                    CZ.VCContent.removeChild(e.parent, e.id);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                    deferred.resolve();
                }, function (error) {
                    console.log("Error connecting to service: remove exhibit.\n" + error.responseText);
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }

            return deferred.promise();
        }
        Authoring.removeExhibit = removeExhibit;

        /**
        * Updates content item's properties in selected exhibit.
        * Use it externally from forms' handlers.
        * @param  {CanvasInfodot} e A selected exhibit.
        * @param  {ContentItemMetadata} c A content item in selected exhibit.
        * @param  {Object} args An object with updated property values.
        */
        function updateContentItem(e, c, args) {
            var deferred = $.Deferred();

            if (e && e.contentItems && e.contentItems.length && c && args) {
                var clone = $.extend(true, {}, c, args);

                CZ.Service.putContentItem(clone).then(function (response) {
                    $.extend(c, clone);
                    c.id = c.guid = response;
                    e = renewExhibit(e);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                    deferred.resolve();
                }, function (error) {
                    console.log("Error connecting to service: update content item.\n" + error.responseText);
                    deferred.reject(error);
                });
            } else {
                deferred.reject();
            }

            return deferred.promise();
        }
        Authoring.updateContentItem = updateContentItem;

        /**
        * Removes content item from selected exhibit.
        * Use it externally from form's handlers.
        * @param  {CanvasInfodot} e A selected exhibit.
        * @param  {ContentItemMetadata} c A content item in selected exhibit.
        */
        function removeContentItem(e, c) {
            var deferred = $.Deferred();

            if (e && e.contentItems && e.contentItems.length && c && c.index) {
                var clone = $.extend(true, {}, c);

                CZ.Service.deleteContentItem(clone).then(function (response) {
                    e.contentItems.splice(c.index, 1);
                    e = renewExhibit(e);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                    deferred.resolve();
                }, function (error) {
                    console.log("Error connecting to service: remove content item.\n" + error.responseText);
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }

            return deferred.promise();
        }
        Authoring.removeContentItem = removeContentItem;

        /**
        * Validates possible input errors for timelines.
        */
        function validateTimelineData(start, end, title) {
            var isValid = (start !== false) && (end !== false);
            isValid = isValid && CZ.Authoring.isNotEmpty(title);
            isValid = isValid && CZ.Authoring.isIntervalPositive(start, end);
            return isValid;
        }
        Authoring.validateTimelineData = validateTimelineData;

        /**
        * Validates possible input errors for exhibits.
        */
        function validateExhibitData(date, title, contentItems) {
            var isValid = date !== false;
            isValid = isValid && CZ.Authoring.isNotEmpty(title);
            isValid = isValid && CZ.Authoring.validateContentItems(contentItems, null);
            return isValid;
        }
        Authoring.validateExhibitData = validateExhibitData;

        /**
        * Validates,if number is valid.
        */
        function validateNumber(number) {
            return !isNaN(Number(number) && parseFloat(number)) && isNotEmpty(number) && (number !== false);
        }
        Authoring.validateNumber = validateNumber;

        /**
        * Validates,if field is empty.
        */
        function isNotEmpty(obj) {
            return (obj !== '' && obj !== null);
        }
        Authoring.isNotEmpty = isNotEmpty;

        /**
        * Validates,if url is adequate
        */
        function isValidURL(url) {
            var objRE = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            return objRE.test(url);
        }
        Authoring.isValidURL = isValidURL;

        /**
        * Validates,if timeline size is not negative or null
        */
        function isIntervalPositive(start, end) {
            return (parseFloat(start) + 1 / 366 <= parseFloat(end));
        }
        Authoring.isIntervalPositive = isIntervalPositive;

        /**
        * Validates,if content item data is correct.
        */
        function validateContentItems(contentItems, mediaInput) {
            var isValid = true;
            if (contentItems.length == 0) {
                return false;
            }
            var i = 0;
            while (contentItems[i] != null) {
                var ci = contentItems[i];
                isValid = isValid && CZ.Authoring.isNotEmpty(ci.title) && CZ.Authoring.isNotEmpty(ci.uri) && CZ.Authoring.isNotEmpty(ci.mediaType);

                var mime;
                if (ci.mediaType.toLowerCase() !== "video") {
                    mime = CZ.Service.getMimeTypeByUrl(ci.uri);
                }

                if (ci.mediaType.toLowerCase() === "image") {
                    var imageReg = /\.(jpg|jpeg|png|gif)$/i;
                    if (!imageReg.test(ci.uri)) {
                        if (mime != "image/jpg" && mime != "image/jpeg" && mime != "image/gif" && mime != "image/png") {
                            if (mediaInput) {
                                mediaInput.showError("Sorry, only JPG/PNG/GIF images are supported.");
                            }

                            isValid = false;
                        }
                    }
                } else if (ci.mediaType.toLowerCase() === "video") {
                    // Youtube
                    var youtube = /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|[\S\?\&]+&v=|\/user\/\S+))([^\/&#]{10,12})/;

                    // Vimeo
                    var vimeo = /vimeo\.com\/([0-9]+)/i;
                    var vimeoEmbed = /player.vimeo.com\/video\/([0-9]+)/i;

                    if (youtube.test(ci.uri)) {
                        var youtubeVideoId  = ci.uri.match(youtube)[1];
                        var youtubeAutoPlay = ci.uri.indexOf('autoplay=1') > 0 ? '?autoplay=1' : '';
                        ci.uri = "http://www.youtube.com/embed/" + youtubeVideoId + youtubeAutoPlay;
                    } else if (vimeo.test(ci.uri)) {
                        var vimeoVideoId = ci.uri.match(vimeo)[1];
                        ci.uri = "http://player.vimeo.com/video/" + vimeoVideoId;
                    } else if (vimeoEmbed.test(ci.uri)) {
                        //Embedded link provided
                    } else {
                        if (mediaInput) {
                            mediaInput.showError("Sorry, only YouTube or Vimeo videos are supported.");
                        }

                        isValid = false;
                    }
                } else if (ci.mediaType.toLowerCase() === "pdf") {
                    //Google PDF viewer
                    //Example: http://docs.google.com/viewer?url=http%3A%2F%2Fwww.selab.isti.cnr.it%2Fws-mate%2Fexample.pdf&embedded=true
                    var pdf = /\.(pdf)$|\.(pdf)\?/i;

                    if (!pdf.test(ci.uri)) {
                        if (mime != "application/pdf") {
                            if (mediaInput) {
                                mediaInput.showError("Sorry, only PDF extension is supported.");
                            }

                            isValid = false;
                        }
                    }
                }
                else if (ci.mediaType.toLowerCase() === "skydrive-document")
                {
                    var onedriveDownload = /(onedrive|skydrive)\.live\.com\/download/;
                    var onedriveEmbed    = /(onedrive|skydrive)\.live\.com\/embed/;

                    if (!onedriveDownload.test(ci.uri) && !onedriveEmbed.test(ci.uri))
                    {
                        alert("This is not a valid OneDrive link.");
                        isValid = false;
                    }
                }
                else if (ci.mediaType.toLowerCase() === "skydrive-image")
                {
                    // OneDrive embed image uri pattern is - {url} {width} {height}
                    var split = ci.uri.split(' ');

                    if (split.length > 1)
                    {
                        // OneDrive embed link
                        var onedrive = /(onedrive|skydrive)\.live\.com\/embed/;
                        var width    = /[0-9]/;
                        var height   = /[0-9]/;

                        if (!onedrive.test(split[0]) || !width.test(split[1]) || !height.test(split[2]))
                        {
                            if (mediaInput) mediaInput.showError("This is not a valid OneDrive embed link.");
                            isValid = false;
                        }
                    }
                    else
                    {
                        // OneDrive download link
                        var onedrive = /(onedrive|skydrive)\.live\.com\/download/;
                        if (!onedrive.test(ci.uri))
                        {
                            alert("This is not a valid OneDrive download link.");
                            isValid = false;
                        }
                    }
                }

                if (!isValid)
                    return false;
                i++;
            }
            return isValid;
        }
        Authoring.validateContentItems = validateContentItems;

        /**
        * Returns list of erroneous content items
        */
        function erroneousContentItemsList(errorMassage) {
            var pos;
            var errCI = [];
            if (errorMassage.indexOf("ErroneousContentItemIndex") + 1) {
                pos = errorMassage.indexOf("ErroneousContentItemIndex") + 27;
                while (errorMassage[pos] != ']') {
                    if ((errorMassage[pos] == ",") || (errorMassage[pos] == "[")) {
                        var str1 = "";
                        pos++;
                        while ((errorMassage[pos] != ",") && (errorMassage[pos] != "]")) {
                            str1 += errorMassage[pos];
                            pos++;
                        }
                        errCI.push(parseInt(str1));
                    }
                }
            }
            return errCI;
        }
        Authoring.erroneousContentItemsList = erroneousContentItemsList;

        /**
        * Opens "session ends" form
        */
        function showSessionForm() {
            CZ.HomePageViewModel.sessionForm.show();
        }
        Authoring.showSessionForm = showSessionForm;

        /**
        * Resets timer to default
        */
        function resetSessionTimer() {
            if (CZ.Authoring.timer != null) {
                clearTimeout(CZ.Authoring.timer);
                CZ.Authoring.timer = setTimeout(function () {
                    showSessionForm();
                }, (CZ.Settings.sessionTime - 60) * 1000);
            }
        }
        Authoring.resetSessionTimer = resetSessionTimer;
    })(CZ.Authoring || (CZ.Authoring = {}));
    var Authoring = CZ.Authoring;
})(CZ || (CZ = {}));
﻿/// <reference path='authoring.ts'/>
/// <reference path='settings.ts'/>
/// <reference path='layout.ts'/>
/// <reference path='../ui/controls/datepicker.ts'/>
/// <reference path='typings/jqueryui/jqueryui.d.ts'/>
/// <reference path='typings/jquery/jquery.d.ts'/>
var CZ;
(function (CZ) {
    (function (Authoring) {
        (function (UI) {
            // Mouseup handlers.
            // Opens a window for creating new tour.
            function createTour() {
                // skip authoring during ongoing dynamic layout animation
                if (CZ.Layout.animatingElements.length != 0) {
                    return;
                }

                CZ.Authoring.isActive = false; // for now we do not watch for mouse moves
                CZ.Authoring.mode = "editTour";

                Authoring.showEditTourForm(null);
            }
            UI.createTour = createTour;

            function createTimeline() {
                // skip authoring during ongoing dynamic layout animation
                if (CZ.Layout.animatingElements.length != 0) {
                    return;
                }

                CZ.Authoring.showMessageWindow("Click and drag to set the approximate length of the timeline.", "Create Timeline");

                var prevIsActive = CZ.Authoring.isActive;
                var prevMode = CZ.Authoring.mode;
                var messageForm = CZ.HomePageViewModel.getFormById("#message-window");

                messageForm.closeButton.click(function (event) {
                    CZ.Authoring.isActive = prevIsActive;
                    CZ.Authoring.mode = prevMode;
                    CZ.Common.vc.virtualCanvas("showNonRootVirtualSpace");
                });

                CZ.Authoring.isActive = true;
                CZ.Authoring.mode = "createTimeline";

                CZ.Common.vc.virtualCanvas("cloakNonRootVirtualSpace");
            }
            UI.createTimeline = createTimeline;

            function editTimeline() {
                // skip authoring during ongoing dynamic layout animation
                if (CZ.Layout.animatingElements.length != 0) {
                    return;
                }

                CZ.Authoring.isActive = (CZ.Authoring.mode !== "editTimeline") || !CZ.Authoring.isActive;
                CZ.Authoring.mode = "editTimeline";
            }
            UI.editTimeline = editTimeline;

            function createExhibit() {
                // skip authoring during ongoing dynamic layout animation
                if (CZ.Layout.animatingElements.length != 0) {
                    return;
                }

                CZ.Authoring.showMessageWindow("Click inside a timeline to set the approximate date of the exhibit.", "Create Exhibit");

                var prevIsActive = CZ.Authoring.isActive;
                var prevMode = CZ.Authoring.mode;
                var messageForm = CZ.HomePageViewModel.getFormById("#message-window");

                messageForm.closeButton.click(function (event) {
                    CZ.Authoring.isActive = prevIsActive;
                    CZ.Authoring.mode = prevMode;
                    CZ.Common.vc.virtualCanvas("showNonRootVirtualSpace");
                });

                CZ.Authoring.isActive = true;
                CZ.Authoring.mode = "createExhibit";

                CZ.Common.vc.virtualCanvas("cloakNonRootVirtualSpace");
            }
            UI.createExhibit = createExhibit;

            function editExhibit() {
                // skip authoring during ongoing dynamic layout animation
                if (CZ.Layout.animatingElements.length != 0) {
                    return;
                }

                CZ.Authoring.isActive = (CZ.Authoring.mode !== "editExhibit") || !CZ.Authoring.isActive;
                CZ.Authoring.mode = "editExhibit";
            }
            UI.editExhibit = editExhibit;
        })(Authoring.UI || (Authoring.UI = {}));
        var UI = Authoring.UI;
    })(CZ.Authoring || (CZ.Authoring = {}));
    var Authoring = CZ.Authoring;
})(CZ || (CZ = {}));
﻿/// <reference path='settings.ts'/>
/// <reference path='typings/jquery/jquery.d.ts'/>
/// <reference path='../ui/auth-edit-tour-form.ts'/>
var CZ;
(function (CZ) {
    (function (Service) {
        var Map;
        (function (Map) {
            function bookmark(ts) {
                return {
                    name: ts.Title,
                    url: ts.NavigationUrl,
                    lapseTime: ts.LapseTime,
                    description: ts.Description
                };
            }

            function tour(t) {
                var bookmarks = new Array(t.Stops.length);
                for (var i = 0, n = t.Stops.length; i < n; i++) {
                    bookmarks[i] = bookmark(t.Stops[i]);
                }

                var tourRequest = {
                    id: t.Id,
                    name: t.Title,
                    description: t.Description,
                    audio: t.Audio,
                    category: t.Category,
                    sequence: t.Sequence,
                    bookmarks: bookmarks
                };

                return tourRequest;
            }
            Map.tour = tour;

            function timeline(t) {
                return {
                    id: t.guid,
                    ParentTimelineId: t.parent.guid,
                    start: CZ.Dates.getDecimalYearFromCoordinate(t.x),
                    FromIsCirca: t.FromIsCirca,
                    end: typeof t.endDate !== 'undefined' ? t.endDate : CZ.Dates.getDecimalYearFromCoordinate(t.x + t.width),
                    ToIsCirca: typeof t.endDate !== 'undefined' ? t.ToIsCirca: false,
                    title: t.title,
                    Regime: t.regime,
                    backgroundUrl: t.backgroundUrl,
                    aspectRatio: t.aspectRatio
                };
            }
            Map.timeline = timeline;

            function exhibit(e) {
                return {
                    id: e.guid,
                    ParentTimelineId: e.parent.guid,
                    time: e.infodotDescription.date,
                    IsCirca: e.infodotDescription.isCirca,
                    title: e.title,
                    description: undefined,
                    contentItems: undefined
                };
            }
            Map.exhibit = exhibit;

            function exhibitWithContentItems(e) {
                var mappedContentItems = [];
                $(e.contentItems).each(function (contentItemIndex, contentItem) {
                    mappedContentItems.push(Map.contentItem(contentItem));
                });

                return {
                    id: e.guid,
                    ParentTimelineId: e.parent.guid,
                    time: e.infodotDescription.date,
                    IsCirca: e.infodotDescription.isCirca,
                    title: e.title,
                    description: undefined,
                    contentItems: mappedContentItems
                };
            }
            Map.exhibitWithContentItems = exhibitWithContentItems;

            function contentItem(ci) {
                return {
                    id: ci.guid,
                    ParentExhibitId: ci.contentItem ? ci.contentItem.ParentExhibitId : ci.ParentExhibitId,
                    title: ci.contentItem ? ci.contentItem.title : ci.title,
                    description: ci.contentItem ? ci.contentItem.description : ci.description,
                    uri: ci.contentItem ? ci.contentItem.uri : ci.uri,
                    mediaType: ci.contentItem ? ci.contentItem.mediaType : ci.mediaType,
                    attribution: ci.contentItem ? ci.contentItem.attribution : ci.attribution,
                    mediaSource: ci.contentItem ? ci.contentItem.mediaSource : ci.mediaSource,
                    order: ci.contentItem ? ci.contentItem.order : ci.order
                };
            }
            Map.contentItem = contentItem;
        })(Map || (Map = {}));

        var _serviceUrl = CZ.Settings.serverUrlHost + "/api/";

        // Testing options.
        var _isLocalHost = constants.environment === "Localhost";
        var _dumpTimelinesUrl = "/dumps/home/timelines.json";
        var _testLogin = false;

        function Request(urlBase) {
            var _url = urlBase;
            var _hasParameters = false;

            Object.defineProperty(this, "url", {
                configurable: false,
                get: function () {
                    return _url;
                }
            });

            this.addToPath = function (item) {
                if (item) {
                    _url += _url.match(/\/$/) ? item : "/" + item;
                }
            };

            this.addParameter = function (name, value) {
                if (value !== undefined && value !== null) {
                    _url += _hasParameters ? "&" : "?";
                    _url += name + "=" + value;
                    _hasParameters = true;
                }
            };

            this.addParameters = function (params) {
                for (var p in params) {
                    if (params.hasOwnProperty(p)) {
                        this.addParameter(p, params[p]);
                    }
                }
            };
        }
        Service.Request = Request;
        ;

        // NOTE: Clear collections to let the server decide what to load.
        Service.superCollectionName = "";
        Service.collectionName = "";
        Service.canEdit = false;

        // .../export/timeline/{topmostTimelineId}
        function exportTimelines(topmostTimelineId)
        {
            if (typeof topmostTimelineId === 'undefined')
            {
                throw 'exportTimelines(topmostTimelineId) requires a parameter.';
            }
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(topmostTimelineId) == false)
            {
                if (topmostTimelineId != "00000000-0000-0000-0000-000000000000")
                throw 'exportTimelines(topmostTimelineId) has an invalid parameter. The provided parameter must be a GUID.';
            }
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath('export');
            request.addToPath('timeline');
            request.addToPath(topmostTimelineId);
            return $.ajax
            ({
                type:       'GET',
                cache:      false,
                url:        request.url,
                dataType:   'json'
            });
        }
        Service.exportTimelines = exportTimelines;

        // .../import/timeline/{intoTimelineId}
        function importTimelines(intoTimelineId, newTimelineTree)
        {
            if (typeof intoTimelineId === 'undefined' || typeof newTimelineTree === 'undefined')
            {
                throw 'importTimelines(intoTimelineId, newTimelineTree) is missing a parameter.';
            }
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(intoTimelineId) == false)
            {
                if (intoTimelineId != "00000000-0000-0000-0000-000000000000")
                throw 'importTimelines(intoTimelineId, newTimelineTree) has an invalid intoTimelineId parameter. This must be a GUID.';
            }
            if (typeof newTimelineTree !== 'string')
            {
                throw 'importTimelines(intoTimelineId, newTimelineTree) has an invalid newTimelineTree parameter. This must be a JSON.stringify string.';
            }
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath('import');
            request.addToPath('timeline');
            request.addToPath(intoTimelineId);
            return $.ajax
            ({
                type:           'PUT',
                cache:          false,
                url:            request.url,
                contentType:    'application/json',
                dataType:       'json',
                data:           newTimelineTree     // should already be JSON.stringified
            });
        }
        Service.importTimelines = importTimelines;

        // .../import/collection
        function importCollection(collectionTree)
        {
            if (typeof collectionTree !== 'string')
            {
                throw 'importCollection(collectionTree) missing the collectionTree parameter.';
            }
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath('import');
            request.addToPath('collection');
            return $.ajax
            ({
                type:           'PUT',
                cache:          false,
                url:            request.url,
                contentType:    'application/json',
                dataType:       'json',
                data:           collectionTree      // should already be JSON.stringified
            });
        }
        Service.importCollection = importCollection;

        // .../getroot?supercollection=&collection=
        function getRootTimelineId(sc, c)
        {
            if (typeof sc === "undefined") sc = Service.superCollectionName;
            if (typeof  c === "undefined") c  = Service.collectionName;
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath("getroot");
            request.addParameter("supercollection", sc);
            request.addParameter("collection", c);
            return $.ajax
            ({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getRootTimelineId = getRootTimelineId;

        // .../gettimelines?supercollection=&collection=&start=&end=&minspan=&lca=
        function getTimelines(r, sc, c) {
            if (typeof sc === "undefined") sc = Service.superCollectionName;
            if (typeof  c === "undefined")  c = Service.collectionName;
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath("gettimelines");
            request.addParameter("supercollection", sc);
            request.addParameter("collection", c);
            request.addParameters(r);
            return $.ajax
            ({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getTimelines = getTimelines;

        /**
        * Information Retrieval.
        */

        // .../supercollections
        function getSuperCollections()
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath("supercollections");
            return $.ajax
            ({
                type:       "GET",
                cache:      false,
                dataType:   "json",
                url:        request.url
            });
        }
        Service.getSuperCollections = getSuperCollections;

        // .../{superCollectionName}/collections
        function getCollections(superCollectionName) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath("collections");

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getCollections = getCollections;

        // .../{supercollection}/data
        // .../{supercollection}/{collection}/data
        function getCollection()
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("data");
            return $.ajax
            ({
                type:       "GET",
                cache:      false,
                dataType:   "json",
                url:        request.url
            });
        }
        Service.getCollection = getCollection;

        // .../isuniquecollectionname?new={proposedCollectionName}
        // .../{supercollection}/isuniquecollectionname?new={proposedCollectionName}
        // .../{supercollection}/{existingCollectionPath}/isuniquecollectionname?new={proposedCollectionName}
        function isUniqueCollectionName(proposedCollectionName)
        {
            if (typeof proposedCollectionName === 'undefined') return false;

            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            if (typeof Service.superCollectionName  !== 'undefined') request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName       !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath('isuniquecollectionname');
            request.addParameter('new', encodeURIComponent(proposedCollectionName));
            return $.ajax
            ({
                type:       "GET",
                cache:      false,
                dataType:   "json",
                url:        request.url
            });
        }
        Service.isUniqueCollectionName = isUniqueCollectionName;

        // .../exhibit/{exhibitId}/lastupdate
        function getExhibitLastUpdate(exhibitId) {
            CZ.Authoring.resetSessionTimer();

            var request = new Request(_serviceUrl);
            request.addToPath("exhibit");
            request.addToPath(exhibitId);
            request.addToPath("lastupdate");

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getExhibitLastUpdate = getExhibitLastUpdate;

        // .../find/users?partial={partialName}
        function findUsers(partialName) {
            CZ.Authoring.resetSessionTimer();

            var request = new Request(_serviceUrl);
            request.addToPath("find");
            request.addToPath("users?partial=" + partialName);

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.findUsers = findUsers;

        // .../{supercollection}/{collection}/canedit or
        // .../{supercollection}/canedit for default collection beneath supercollection
        function getCanEdit()
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("canedit");
            return $.ajax
            ({
                type:       "GET",
                cache:      false,
                dataType:   "json",
                url:        request.url
            });
        }
        Service.getCanEdit = getCanEdit;

        // .../{supercollection}/members
        // .../{supercollection}/{collection}/members
        function getMembers()
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("members");
            return $.ajax
            ({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getMembers = getMembers;

        // .../{supercollection}/members
        // .../{supercollection}/{collection}/members
        function putMembers(superCollectionName, collectionName, userIds)
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(collectionName);
            request.addToPath("members");
            return $.ajax
            ({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(userIds)
            });
        }
        Service.putMembers = putMembers;

        // .../{supercollection}/{collection}/structure?start=&end=&minspan=&lca=
        // NOTE: Not implemented in current API.
        function getStructure(r) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("structure");
            request.addParameters(r);

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getStructure = getStructure;

        // .../{supercollection}/{collection}/data
        // NOTE: Not implemented in current API.
        function postData(r) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("data");

            return $.ajax({
                type: "POST",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(r)
            });
        }
        Service.postData = postData;

        // .../{superCollectionPath}/{newCollectionPath}
        function postCollection(newCollectionPath, newCollectionData)
        {
            if (typeof newCollectionPath === 'undefined') return false;
            if (typeof newCollectionData === 'undefined') return false;

            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(newCollectionPath);

            return $.ajax
            ({
                type:           'POST',
                cache:          false,
                contentType:    'application/json',
                dataType:       'json',
                url:            request.url,
                data:           JSON.stringify(newCollectionData)
            });
        }
        Service.postCollection = postCollection;

        // .../{supercollection}/
        // .../{supercollection}/{collection}
        function putCollection(superCollectionName, collectionName, c)
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(collectionName);

            return $.ajax
            ({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(c)
            });
        }
        Service.putCollection = putCollection;

        // .../{supercollection}/{collection}
        function deleteCollection()
        {
            if (typeof Service.collectionName === 'undefined') return false;

            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            return $.ajax
            ({
                type:           "DELETE",
                cache:          false,
                contentType:    "application/json",
                url: request.url
            });
        }
        Service.deleteCollection = deleteCollection

        // .../{supercollection}/{collection}/timeline or
        // .../{supercollection}/timeline for default collection
        function putTimeline(t) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("timeline");
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.timeline(t))
            });
        }
        Service.putTimeline = putTimeline;

        // .../{supercollection}/timeline
        // .../{supercollection}/{collection}/timeline
        function deleteTimeline(t) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("timeline");
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(Map.timeline(t))
            });
        }
        Service.deleteTimeline = deleteTimeline;

        // .../{supercollection}/exhibit
        // .../{supercollection}/{collection}/exhibit
        function putExhibit(e)
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("exhibit");
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.exhibitWithContentItems(e))
            });
        }
        Service.putExhibit = putExhibit;

        // .../{supercollection}/exhibit
        // .../{supercollection}/{collection}/exhibit
        function deleteExhibit(e) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("exhibit");
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(Map.exhibit(e))
            });
        }
        Service.deleteExhibit = deleteExhibit;

        // .../{supercollection}/contentitem
        // .../{supercollection}/{collection}/contentitem
        function putContentItem(ci) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("contentitem");
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.contentItem(ci))
            });
        }
        Service.putContentItem = putContentItem;

        // .../{supercollection}/{collection}/contentitem
        function deleteContentItem(ci) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("contentitem");
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(Map.contentItem(ci))
            });
        }
        Service.deleteContentItem = deleteContentItem;

        // .../{supercollection}/tour
        // .../{supercollection}/{collection}/tour
        function putTour2(t)
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("tour2");
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.tour(t))
            });
        }
        Service.putTour2 = putTour2;

        // .../{supercollection}/tour
        // .../{supercollection}/{collection}/tour
        function deleteTour(tourId) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("tour");
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify({ id: tourId })
            });
        }
        Service.deleteTour = deleteTour;

        // .../{supercollection}/{collection}/tour or
        // .../{supercollection}/tour for default collection
        function getTour(tourGUID)
        {
            if (typeof tourGUID === 'undefined')
            {
                throw 'getTour(tourGUID) requires a parameter.';
            }
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(tourGUID) == false)
            {
                throw 'getTour(tourGUID) has an invalid parameter. The provided parameter must be a GUID.';
            }
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName); // || 'chronozoom');
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath('tour');
            request.addParameter('guid', tourGUID);
            return $.ajax
            ({
                type:       'GET',
                cache:      false,
                url:        request.url,
                dataType:   'json'
            });
        }
        Service.getTour = getTour;

        // .../{supercollection}/{collection}/tours or
        // .../{supercollection}/tours for default collection
        function getTours()
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("tours");
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getTours = getTours;

        // .../search/scope/options
        function getSearchScopeOptions()
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("search");
            request.addToPath("scope");
            request.addToPath("options");
            return $.ajax
            ({
                type:       "GET",
                cache:      true,
                dataType:   "json",
                url:        request.url
            });
        }
        Service.getSearchScopeOptions = getSearchScopeOptions;

        // .../search?superCollection={superCollection}&collection={collection}&searchTerm={searchTerm}&searchScope={searchScope}
        function getSearch(query, scope)
        {
            if (scope !== parseInt(scope))  scope = 1;
            if (scope < 1)                  scope = 1;

            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("Search");

            var data =
            {
                supercollection:    CZ.Service.superCollectionName,
                collection:         CZ.Service.collectionName,
                searchTerm:         query,
                searchScope:        scope
            };
            return $.ajax
            ({
                type:           "GET",
                cache:          false,
                contentType:    "application/json",
                dataType:       "json",
                url:            request.url,
                data:           data
            });
        }
        Service.getSearch = getSearch;

        // .../bing/getImages
        function getBingImages(query, top, skip) {
            if (typeof top === "undefined") { top = CZ.Settings.defaultBingSearchTop; }
            if (typeof skip === "undefined") { skip = CZ.Settings.defaultBingSearchSkip; }
            var request = new Service.Request(_serviceUrl);
            request.addToPath("bing/getImages");

            var data = {
                query: query,
                top: top,
                skip: skip
            };
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: data,
                success: function (response) {
                }
            });
        }
        Service.getBingImages = getBingImages;

        // .../bing/getVideos
        function getBingVideos(query, top, skip) {
            if (typeof top === "undefined") { top = CZ.Settings.defaultBingSearchTop; }
            if (typeof skip === "undefined") { skip = CZ.Settings.defaultBingSearchSkip; }
            var request = new Service.Request(_serviceUrl);
            request.addToPath("bing/getVideos");

            var data = {
                query: query,
                top: top,
                skip: skip
            };
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: data,
                success: function (response) {
                }
            });
        }
        Service.getBingVideos = getBingVideos;

        // .../bing/getDocuments
        // set doctype to undefined if you want it to be omited
        function getBingDocuments(query, doctype, top, skip) {
            if (typeof doctype === "undefined") { doctype = undefined; }
            if (typeof top === "undefined") { top = CZ.Settings.defaultBingSearchTop; }
            if (typeof skip === "undefined") { skip = CZ.Settings.defaultBingSearchSkip; }
            var request = new Service.Request(_serviceUrl);
            request.addToPath("bing/getDocuments");

            var data = {
                query: query,
                doctype: doctype,
                top: top,
                skip: skip
            };
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: data,
                success: function (response) {
                }
            });
        }
        Service.getBingDocuments = getBingDocuments;

        // .../{supercollection}/{collection}/structure?start=&end=&minspan=&lca=
        function getServiceInformation() {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath("info");

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getServiceInformation = getServiceInformation;

        // .../{supercollection}/{collection}/{reference}/contentpath
        function getContentPath(reference) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath(reference);
            request.addToPath("contentpath");

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getContentPath = getContentPath;

        /**
        * Auxiliary Methods.
        */
        function putExhibitContent(e, oldContentItems) {
            CZ.Authoring.resetSessionTimer();
            var newGuids = e.contentItems.map(function (ci) {
                return ci.guid;
            });

            // Send PUT request for all exhibit's content items.
            var promises = e.contentItems.map(function (ci) {
                return putContentItem(ci).then(function (response) {
                    ci.id = ci.guid = response;
                });
            }).concat(oldContentItems.filter(function (ci) {
                return (ci.guid && newGuids.indexOf(ci.guid) === -1);
            }).map(function (ci) {
                return deleteContentItem(ci);
            }));

            return $.when.apply($, promises);
        }
        Service.putExhibitContent = putExhibitContent;

        /**
        * Update user profile.
        * @param  {Object} username .
        * @param  {Object} email .
        */
        function putProfile(displayName, email) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("user");
            var user = {
                "DisplayName": displayName,
                "Email": email
            };
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(user)
            });
        }
        Service.putProfile = putProfile;

        /**
        * Delete user profile.
        * @param  {Object} username .
        */
        function deleteProfile(displayName) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("user");
            var user = {
                "DisplayName": displayName
            };
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(user)
            });
        }
        Service.deleteProfile = deleteProfile;

        function getProfile(displayName) {
            if (typeof displayName === "undefined") { displayName = _testLogin ? "anonymous" : ""; }
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("user");
            if (displayName != "") {
                request.addParameter("name", displayName);
            }
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            }).done(function (profile) {
                if (!profile.id)
                    return null;

                return profile;
            });
        }
        Service.getProfile = getProfile;

        function getMimeTypeByUrl(url) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("mimetypebyurl");
            if (url == "")
                return result;
            request.addParameter("url", url);
            $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url,
                async: false
            }).done(function (mime) {
                if (mime)
                    result = mime;
            });
            return result;
        }
        Service.getMimeTypeByUrl = getMimeTypeByUrl;

        function getUserTimelines(sc, c) {
            if (typeof sc === "undefined") { sc = Service.superCollectionName; }
            if (typeof c === "undefined") { c = Service.collectionName; }
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("usertimelines");
            request.addParameter("superCollection", sc);
            request.addParameter("Collection", c);
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: _isLocalHost ? _dumpTimelinesUrl : request.url
            });
        }
        Service.getUserTimelines = getUserTimelines;

        function getEditableTimelines(includeMine)
        {
            if (typeof includeMine !== 'boolean') { includeMine = false; }
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath('editabletimelines');
            request.addParameter('includeMine', includeMine);
            return $.ajax({
                type: 'GET',
                cache: false,
                dataType: 'json',
                url: request.url
            });
        }
        Service.getEditableTimelines = getEditableTimelines;

        function getEditableCollections(includeMine)
        {
            if (typeof includeMine !== 'boolean') { includeMine = false; }
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath('editablecollections');
            request.addParameter('includeMine',             includeMine);
            request.addParameter('currentSuperCollection',  Service.superCollectionName);
            request.addParameter('currentCollection',       Service.collectionName);
            return $.ajax
            ({
                type:       'GET',
                cache:      false,
                dataType:   'json',
                url:        request.url
            });
        }
        Service.getEditableCollections = getEditableCollections;

        function getRecentlyUpdatedExhibits(quantity)
        {
            if (!$.isNumeric(quantity)) quantity = 6;
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath('recentlyupdatedexhibits');
            request.addParameter('quantity', quantity);
            return $.ajax
            ({
                type:       'GET',
                cache:      false,
                dataType:   'json',
                url:        request.url
            });
        }
        Service.getRecentlyUpdatedExhibits = getRecentlyUpdatedExhibits;

        function getUserFavorites()
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfavorites");
            request.addParameter('currentSuperCollection',  Service.superCollectionName);
            request.addParameter('currentCollection',       Service.collectionName);
            return $.ajax
            ({
                type:       'GET',
                cache:      false,
                dataType:   'json',
                url:        request.url
            });
        }
        Service.getUserFavorites = getUserFavorites;

        function deleteUserFavorite(guid)
        {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfavorites");
            if (guid == "")
                return null;
            request.addToPath(guid);
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.deleteUserFavorite = deleteUserFavorite;

        function putUserFavorite(guid) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfavorites");
            if (guid == "")
                return null;
            request.addToPath(guid);
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.putUserFavorite = putUserFavorite;

        //Triples
        function putTriplet(subject, predicate, object) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("triples");
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify({
                    Subject: subject,
                    Predicate: predicate,
                    Object: object
                })
            });
        }
        Service.putTriplet = putTriplet;

        function getTriplets(subject, predicate, object) {
            if (typeof predicate === "undefined") { predicate = null; }
            if (typeof object === "undefined") { object = null; }
            if (subject == null && predicate == null && object == null)
                throw "Arguments error: all three criteria cannot be null at the same time";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("triples");
            if (subject != null)
                request.addParameter("subject", encodeURIComponent(subject));
            if (predicate != null)
                request.addParameter("predicate", encodeURIComponent(predicate));
            if (object != null)
                request.addParameter("object", encodeURIComponent(object));
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.getTriplets = getTriplets;

        function deleteTriplet(subject, predicate, object) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("triples");
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify({
                    Subject: subject,
                    Predicate: predicate,
                    Object: object
                })
            });
        }
        Service.deleteTriplet = deleteTriplet;

        function getPrefixes() {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("triples");
            request.addToPath("prefixes");
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.getPrefixes = getPrefixes;
    })(CZ.Service || (CZ.Service = {}));
    var Service = CZ.Service;
})(CZ || (CZ = {}));
/// <reference path='settings.ts'/>
/// <reference path='service.ts'/>
var CZ;
(function (CZ) {
    /// CZ.Data provides an abstraction to CZ.Service to optimize client-server interations with the CZ service.
    (function (Data) {
        function getTimelines(r) {
            if (r === undefined || r === null) {
                r = {
                    start: -50000000000,
                    end: 9999,
                    // Until progressive loading gets refined, allow server to retrieve as much data as appropriate.
                    maxElements: null,
                    // Can't specify minspan on first load since the timeline span will vary significantly.
                    minspan: null
                };
            }

            return CZ.Service.getTimelines(r).then(function (response) {
            }, function (error) {
            });
        }
        Data.getTimelines = getTimelines;

        var DataSet = (function () {
            function DataSet() {
            }
            DataSet.prototype.getVerticalPadding = function () {
                var padding = 0;
                this.series.forEach(function (seria) {
                    if (seria.appearanceSettings && seria.appearanceSettings.thickness && seria.appearanceSettings.thickness > padding) {
                        padding = seria.appearanceSettings.thickness;
                    }
                });
                return padding;
            };
            return DataSet;
        })();
        Data.DataSet = DataSet;

        var Series = (function () {
            function Series() {
                this.values = new Array();
            }
            return Series;
        })();
        Data.Series = Series;

        function generateSampleData() {
            var rolandData;
            $.ajax({
                cache: false,
                type: "GET",
                async: false,
                dataType: "text",
                url: '/dumps/beta-timeseries.csv',
                success: function (result) {
                    rolandData = result;
                },
                error: function (xhr) {
                    alert("Error fetching time series data: " + xhr.responseText);
                }
            });

            return csvToDataSet(rolandData, ",", "sampleData");
        }
        Data.generateSampleData = generateSampleData;

        function csvToDataSet(csvText, delimiter, name) {
            var dataText = csvText;

            var csvArr = dataText.csvToArray({ trim: true, fSep: delimiter, quot: "'" });

            if (csvArr === undefined)
                throw "Error parsing input file: file has incorrect format";

            var dataLength = csvArr.length - 1;

            if (dataLength < 2)
                throw "Error parsing input file: Input should be csv/text file with header and at least one data row";

            var seriesLength = csvArr[0].length - 1;

            if (seriesLength < 1)
                throw "Error parsing input file: table should contain one column with X-axis data and at least one column for Y-axis data";

            var result = new DataSet();
            result.name = name;
            result.time = new Array();
            result.series = new Array();

            for (var i = 1; i <= seriesLength; i++) {
                var seria = new Series();
                seria.values = new Array();
                seria.appearanceSettings = { thickness: 1, stroke: 'blue' };

                var seriaHeader = csvArr[0][i];
                var appearanceRegex = new RegExp("{(.*)}");
                var loadedAppearence = appearanceRegex.exec(seriaHeader);
                if (loadedAppearence !== null) {
                    loadedAppearence = parseStyleString(loadedAppearence[1]);
                    for (var prop in loadedAppearence) {
                        seria.appearanceSettings[prop] = loadedAppearence[prop];
                    }
                }
                var headerRegex = new RegExp("(.*){");
                var header = headerRegex.exec(seriaHeader);
                if (header !== null) {
                    seria.appearanceSettings.name = header[1];
                } else {
                    seria.appearanceSettings.name = seriaHeader;
                }

                seria.appearanceSettings.yMin = parseFloat(csvArr[1][i]);
                seria.appearanceSettings.yMax = parseFloat(csvArr[1][i]);

                result.series.push(seria);
            }

            for (var i = 0; i < dataLength; i++) {
                if (csvArr[i + 1].length !== (seriesLength + 1))
                    throw "Error parsing input file: incompatible data row " + (i + 1);

                result.time.push(parseFloat(csvArr[i + 1][0]));
                for (var j = 1; j <= seriesLength; j++) {
                    var value = parseFloat(csvArr[i + 1][j]);
                    var seria = result.series[j - 1];
                    if (seria.appearanceSettings.yMin > value)
                        seria.appearanceSettings.yMin = value;
                    if (seria.appearanceSettings.yMax < value)
                        seria.appearanceSettings.yMax = value;
                    seria.values.push(value);
                }
            }

            return result;
        }
        Data.csvToDataSet = csvToDataSet;

        function parseStyleString(styleString) {
            var result = {};
            var items = styleString.split(";");
            var n = items.length;
            for (var i = 0; i < n; i++) {
                var pair = items[i].split(':', 2);
                if (pair && pair.length === 2) {
                    var name = pair[0].trim();
                    var val = pair[1].trim();
                    if (/^\d+$/.test(val)) {
                        val = parseFloat(val);
                    }
                    result[name] = val;
                }
            }
            return result;
        }
        Data.parseStyleString = parseStyleString;

        // public domain regex check for valid URL format. e.g. Start with http:// or https://. Does not check if URL exists.
        function validURL(url) {
            // returns true/false
            return /^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
        }
        Data.validURL = validURL;
    })(CZ.Data || (CZ.Data = {}));
    var Data = CZ.Data;
})(CZ || (CZ = {}));
﻿/// <reference path='settings.ts'/>
/// <reference path='common.ts'/>
/// <reference path='dates.ts'/>
/// <reference path='viewport-controller.ts'/>
var CZ;
(function (CZ) {
    function Timescale(container) {
        /**
        * Input parameter must be jQuery object, DIV element or ID. Convert it to jQuery object.
        */
        if (!container) {
            throw "Container parameter is undefined!";
        }
        if (container.tagName !== undefined && container.tagName.toLowerCase() === "div") {
            container = $(container);
        } else if (typeof (container) === "string") {
            container = $("#" + container);
            if (container.length === 0 || !container.is("div")) {
                throw "There is no DIV element with such ID.";
            }
        } else if (!(container instanceof jQuery && container.is("div"))) {
            throw "Container parameter is invalid! It should be DIV, or ID of DIV, or jQuery instance of DIV.";
        }

        var mouse_clicked = false;
        var mouse_hovered = false;

        container.mouseup(function (e) {
            mouse_clicked = false;
        });
        container.mousedown(function (e) {
            mouse_clicked = true;
        });
        container.mousemove(function (e) {
            mouse_hovered = true;
            mouseMove(e);
        });
        container.mouseleave(function (e) {
            mouse_hovered = false;
            mouse_clicked = false;
        });

        /**
        * Private variables of timescale.
        */
        var that = this;
        var _container = container;
        var _range = { min: 0, max: 1 };
        var _ticks = [];
        var _ticksInfo = [];
        var _mode = "cosmos";
        var _position = "top";
        var _deltaRange;
        var _size;
        var _width;
        var _height;
        var _canvasHeight;
        var _markerPosition;

        var _tickSources = {
            "cosmos": new CZ.CosmosTickSource(),
            "calendar": new CZ.CalendarTickSource(),
            "date": new CZ.DateTickSource()
        };

        var isHorizontal = (_position === "bottom" || _position === "top");
        var canvas = $("<canvas></canvas>");
        var labelsDiv = $("<div></div>");

        var marker = $("<div id='timescale_marker' class='cz-timescale-marker'></div>");
        var markerText = $("<div id='marker-text'></div>");
        var markertriangle = $("<div id='marker-triangle'></div>");

        var canvasSize = CZ.Settings.tickLength + CZ.Settings.timescaleThickness;
        var text_size;
        var fontSize;
        var strokeStyle;
        var ctx;

        init();

        /*
        * Properties of timescale.
        */
        Object.defineProperties(this, {
            position: {
                configurable: false,
                get: function () {
                    return _position;
                },
                set: function (value) {
                    _position = value;
                    isHorizontal = (_position === "bottom" || _position === "top");
                }
            },
            mode: {
                configurable: false,
                get: function () {
                    return _mode;
                },
                set: function (value) {
                    _tickSources[_mode].hideDivs();
                    _mode = value;
                }
            },
            container: {
                configurable: false,
                get: function () {
                    return _container;
                }
            },
            range: {
                configurable: false,
                get: function () {
                    return _range;
                }
            },
            ticks: {
                configurable: false,
                get: function () {
                    return _ticks;
                }
            },
            ticksInfo: {
                configurable: false,
                get: function () {
                    return _ticksInfo;
                }
            },
            tickSource: {
                configurable: false,
                get: function () {
                    return _tickSources[_mode];
                }
            },
            markerPosition: {
                configurable: false,
                get: function () {
                    return _markerPosition;
                }
            }
        });

        /**
        * Initializes timescale.
        */
        function init() {
            _container.addClass("cz-timescale");
            _container.addClass("unselectable");
            marker.addClass("cz-timescale-marker");
            markertriangle.addClass("cz-timescale-marker-triangle");
            labelsDiv.addClass("cz-timescale-labels-container");

            marker[0].appendChild(markerText[0]);
            marker[0].appendChild(markertriangle[0]);
            _container[0].appendChild(labelsDiv[0]);
            _container[0].appendChild(canvas[0]);
            _container[0].appendChild(marker[0]);
            canvas[0].height = canvasSize;

            text_size = -1;
            strokeStyle = _container ? _container.css("color") : "Black";
            ctx = canvas[0].getContext("2d");
            fontSize = 45;
            if (_container.currentStyle) {
                fontSize = _container.currentStyle["font-size"];
                ctx.font = fontSize + _container.currentStyle["font-family"];
            } else if (document.defaultView && document.defaultView.getComputedStyle) {
                fontSize = document.defaultView.getComputedStyle(_container[0], null).getPropertyValue("font-size");
                ctx.font = fontSize + document.defaultView.getComputedStyle(_container[0], null).getPropertyValue("font-family");
            } else if (_container.style) {
                fontSize = _container.style["font-size"];
                ctx.font = fontSize + _container.style["font-family"];
            }
        }

        /**
        * Updates timescale size or its embedded elements' sizes.
        */
        function updateSize() {
            // Updates container's children sizes if container's size is changed.
            var prevSize = _size;

            _width = _container.outerWidth(true);
            _height = _container.outerHeight(true);
            if (isHorizontal) {
                _size = _width;
                if (_size != prevSize) {
                    canvas[0].width = _size;
                    labelsDiv.css("width", _size);
                }
            } else {
                _size = _height;
                if (_size != prevSize) {
                    canvas[0].height = _size;
                    labelsDiv.css("height", _size);
                }
            }
            _deltaRange = (_size - 1) / (_range.max - _range.min);
            _canvasHeight = canvas[0].height;

            // Updates container's size according to text size in labels.
            if (isHorizontal) {
                // NOTE: No need to calculate max text size of all labels.
                text_size = (_ticksInfo[0] && _ticksInfo[0].height !== text_size) ? _ticksInfo[0].height : 0;
                if (text_size !== 0) {
                    labelsDiv.css("height", text_size);
                    canvas[0].height = canvasSize;
                    //_height = text_size + canvasSize;
                    //_container.css("height", _height);
                }
            } else {
                // NOTE: No need to calculate max text size of all labels.
                text_size = (_ticksInfo[0] && _ticksInfo[0].width !== text_size) ? _ticksInfo[0].width : 0;

                //if (text_size !== old_text_size && text_size !== 0) {
                if (text_size !== 0) {
                    labelsDiv.css("width", text_size);
                    canvas[0].width = canvasSize;
                    var textOffset = 0;
                    _width = text_size + canvasSize + textOffset;
                    _container.css("width", _width);
                }
            }
        }

        /**
        * Sets mode of timescale according to zoom level.
        * In different zoom levels it allows to use different
        * ticksources.
        */
        function setMode() {
            var beta;

            if (_range.min <= -10000) {
                that.mode = "cosmos";
            } else {
                beta = Math.floor(Math.log(_range.max - _range.min) * (1 / Math.log(10)));

                // BCE or CE years
                if (beta < 0) {
                    that.mode = "date";
                } else {
                    that.mode = "calendar";
                }
            }
        }

        /**
        * Calculates and caches positions of ticks and labels' size.
        */
        function getTicksInfo() {
            var len = _ticks.length;
            var size;
            var width;
            var height;
            var h = isHorizontal ? _canvasHeight : 0;
            var tick;

            _ticksInfo = new Array(len);

            for (var i = 0; i < len; i++) {
                tick = _ticks[i];

                if (tick.label) {
                    size = tick.label._size;
                    width = size.width;
                    height = size.height;
                    if (!width) {
                        width = ctx.measureText(tick.position).width * 1.5;
                    }
                    if (!height) {
                        height = (isHorizontal ? h : parseFloat(fontSize)) + 8;
                    }
                    _ticksInfo[i] = {
                        position: that.getCoordinateFromTick(tick.position),
                        width: width,
                        height: height,
                        hasLabel: true
                    };
                } else {
                    _ticksInfo[i] = {
                        position: that.getCoordinateFromTick(tick.position),
                        width: 0,
                        height: 0,
                        hasLabel: false
                    };
                }
            }
        }

        /**
        * Adds new labels to container and apply styles to them.
        */
        function addNewLabels() {
            var label;
            var labelDiv;

            for (var i = 0, len = _ticks.length; i < len; i++) {
                label = _ticks[i].label;
                if (label && !label.hasClass('cz-timescale-label')) {
                    labelDiv = label[0];
                    labelsDiv[0].appendChild(labelDiv);
                    label.addClass('cz-timescale-label');
                    label._size = {
                        width: labelDiv.offsetWidth,
                        height: labelDiv.offsetHeight
                    };
                }
            }
        }

        /**
        * Checks whether labels are overlayed or not.
        * @return {[type]}       [description]
        */
        function checkLabelsArrangement() {
            var delta;
            var deltaSize;
            var len = _ticks.length - 1;

            if (len == -1) {
                return false;
            }

            for (var i1 = 0, i2 = 1; i2 < len; i1 = i2, i2++) {
                while (i2 < len + 1 && !_ticksInfo[i2].hasLabel) {
                    i2++;
                }
                if (i2 > len) {
                    break;
                }
                if (_ticksInfo[i1].hasLabel) {
                    delta = Math.abs(_ticksInfo[i2].position - _ticksInfo[i1].position);
                    if (delta < CZ.Settings.minTickSpace)
                        return true;
                    if (isHorizontal) {
                        deltaSize = (_ticksInfo[i1].width + _ticksInfo[i2].width) / 2;
                        if (i1 === 0 && (_ticksInfo[i1].position - _ticksInfo[i1].width / 2 < 0)) {
                            deltaSize -= _ticksInfo[i1].width / 2;
                        } else if (i2 == len - 1 && (_ticksInfo[i2].position - _ticksInfo[i2].width / 2 > _size)) {
                            deltaSize -= _ticksInfo[i2].width / 2;
                        }
                    } else {
                        deltaSize = (_ticksInfo[i1].height + _ticksInfo[i2].height) / 2;
                        if (i1 === 0 && (_ticksInfo[i1].position - _ticksInfo[i1].height / 2 < 0)) {
                            deltaSize -= _ticksInfo[i1].height / 2;
                        } else if (i2 == len - 1 && (_ticksInfo[i2].position - _ticksInfo[i2].height / 2 > _size)) {
                            deltaSize -= _ticksInfo[i2].height / 2;
                        }
                    }
                    if (delta - deltaSize < CZ.Settings.minLabelSpace) {
                        return true;
                    }
                }
            }

            return false;
        }

        /**
        * Updates collection of major ticks.
        * Iteratively insert new ticks and stops when ticks are overlayed.
        * Or decrease number of ticks until ticks are not overlayed.
        */
        function updateMajorTicks() {
            var i;

            // Get ticks from current ticksource.
            _ticks = _tickSources[_mode].getTicks(_range);

            // Adjust number of labels and ticks in timescale.
            addNewLabels();
            getTicksInfo();

            if (checkLabelsArrangement()) {
                for (i = 0; i < CZ.Settings.maxTickArrangeIterations; ++i) {
                    _ticks = _tickSources[_mode].decreaseTickCount();
                    addNewLabels();
                    getTicksInfo();
                    if (!checkLabelsArrangement()) {
                        break;
                    }
                }
            } else {
                for (i = 0; i < CZ.Settings.maxTickArrangeIterations; ++i) {
                    _ticks = _tickSources[_mode].increaseTickCount();
                    addNewLabels();
                    getTicksInfo();

                    // There is no more space to insert new ticks. Decrease number of ticks.
                    if (checkLabelsArrangement()) {
                        _ticks = _tickSources[_mode].decreaseTickCount();
                        getTicksInfo();
                        addNewLabels();
                        break;
                    }
                }
            }
        }

        /**
        * Render base line of timescale.
        */
        function renderBaseLine() {
            if (isHorizontal) {
                if (_position == "bottom") {
                    ctx.fillRect(0, 0, _size, CZ.Settings.timescaleThickness);
                } else {
                    ctx.fillRect(0, CZ.Settings.tickLength, _size, CZ.Settings.timescaleThickness);
                }
            } else {
                if (_position == "right") {
                    ctx.fillRect(0, 0, CZ.Settings.timescaleThickness, _size);
                } else {
                    ctx.fillRect(CZ.Settings.tickLength, 0, CZ.Settings.timescaleThickness, _size);
                }
            }
        }

        /**
        * Renders ticks and labels. If range is a single point then renders
        * only label in the middle of timescale.
        */
        function renderMajorTicks() {
            var x;
            var shift;

            ctx.beginPath();

            for (var i = 0, len = _ticks.length; i < len; i++) {
                x = _ticksInfo[i].position;
                if (isHorizontal) {
                    shift = _ticksInfo[i].width / 2;
                    if (i === 0 && x < shift) {
                        shift = 0;
                    } else if (i == len - 1 && x + shift > _size) {
                        shift *= 2;
                    }

                    ctx.moveTo(x, 1);
                    ctx.lineTo(x, 1 + CZ.Settings.tickLength);

                    if (_ticks[i].label) {
                        _ticks[i].label.css("left", x - shift);
                    }
                } else {
                    x = (_size - 1) - x;
                    shift = _ticksInfo[i].height / 2;
                    if (i === 0 && x + shift > _size) {
                        shift *= 2;
                    } else if (i == len - 1 && x < shift) {
                        shift = 0;
                    }

                    ctx.moveTo(1, x);
                    ctx.lineTo(1 + CZ.Settings.tickLength, x);

                    if (_ticks[i].label) {
                        _ticks[i].label.css("top", x - shift);
                        if (_position == "left") {
                            _ticks[i].label.css("left", text_size - (this.rotateLabels ? _ticksInfo[i].height : _ticksInfo[i].width));
                        }
                    }
                }
            }

            ctx.stroke();
            ctx.closePath();
        }

        /**
        * Gets and renders small ticks between major ticks.
        */
        function renderSmallTicks() {
            var minDelta;
            var i;
            var len;
            var smallTicks = _tickSources[_mode].getSmallTicks(_ticks);
            var x;
            ctx.beginPath();

            if (smallTicks && smallTicks.length > 0) {
                // check for enough space
                minDelta = Math.abs(that.getCoordinateFromTick(smallTicks[1]) - that.getCoordinateFromTick(smallTicks[0]));
                len = smallTicks.length;

                for (i = 1; i < len - 1; i++) {
                    minDelta = Math.min(minDelta, Math.abs(that.getCoordinateFromTick(smallTicks[i + 1]) - that.getCoordinateFromTick(smallTicks[i])));
                }

                if (minDelta >= CZ.Settings.minSmallTickSpace) {
                    switch (_position) {
                        case "bottom":
                            for (i = 0; i < len; i++) {
                                x = that.getCoordinateFromTick(smallTicks[i]);
                                ctx.moveTo(x, 1);
                                ctx.lineTo(x, 1 + CZ.Settings.smallTickLength);
                            }
                            break;
                        case "top":
                            for (i = 0; i < len; i++) {
                                x = that.getCoordinateFromTick(smallTicks[i]);
                                ctx.moveTo(x, CZ.Settings.tickLength - CZ.Settings.smallTickLength);
                                ctx.lineTo(x, 1 + CZ.Settings.tickLength);
                            }
                            break;
                        case "left":
                            for (i = 0; i < len; i++) {
                                x = that.getCoordinateFromTick(smallTicks[i]);
                                ctx.moveTo(CZ.Settings.tickLength - CZ.Settings.smallTickLength, _size - x - 1);
                                ctx.lineTo(CZ.Settings.tickLength, _size - x - 1);
                            }
                            break;
                        case "right":
                            for (i = 0; i < len; i++) {
                                x = that.getCoordinateFromTick(smallTicks[i]);
                                ctx.moveTo(1, _size - x - 1);
                                ctx.lineTo(1 + CZ.Settings.smallTickLength, _size - x - 1);
                            }
                            break;
                    }
                }
            }

            ctx.stroke();
            ctx.closePath();
        }

        function mouseMove(e) {
            var point = CZ.Common.getXBrowserMouseOrigin(container, e);
            var k = (_range.max - _range.min) / _width;
            var time = _range.max - k * (_width - point.x);
            that.setTimeMarker(time);
        }

        /**
        * Renders marker.
        */
        this.setTimeMarker = function (time, vcGesture) {
            if (typeof vcGesture === "undefined") { vcGesture = false; }
            if ((!mouse_clicked) && (((!vcGesture) || ((vcGesture) && (!mouse_hovered))))) {
                if (time > CZ.Settings.maxPermitedTimeRange.right)
                    time = CZ.Settings.maxPermitedTimeRange.right;
                if (time < CZ.Settings.maxPermitedTimeRange.left)
                    time = CZ.Settings.maxPermitedTimeRange.left;
                var k = (_range.max - _range.min) / _width;
                var point = (time - _range.max) / k + _width;
                var text = _tickSources[_mode].getMarkerLabel(_range, time);
                _markerPosition = point;
                markerText.text(text);
                marker.css("left", point - marker.width() / 2);
            }
        };

        /**
        * Main function for timescale rendering.
        * Updates timescale's visual state.
        */
        function render() {
            // Set mode of timescale. Enabled mode depends on zoom level.
            setMode();

            // Update major ticks collection.
            updateMajorTicks();

            // Update size of timescale and its embedded elements.
            updateSize();

            // Setup canvas' context before rendering.
            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;
            ctx.lineWidth = CZ.Settings.timescaleThickness;
            if (isHorizontal) {
                ctx.clearRect(0, 0, _size, canvasSize);
            } else {
                ctx.clearRect(0, 0, canvasSize, _size);
            }

            // Render timescale.
            // NOTE: http://jsperf.com/fill-vs-fillrect-vs-stroke
            renderBaseLine();
            renderMajorTicks();
            renderSmallTicks();
        }

        /**
        * Get screen coordinates of tick.
        * @param  {number} x [description]
        * @return {[type]}   [description]
        */
        this.getCoordinateFromTick = function (x) {
            var delta = _deltaRange;
            var k = _size / (_range.max - _range.min);
            var log10 = 1 / Math.log(10);
            var x1 = k * (x - _range.min);
            var beta;
            var firstYear;

            if (_range.min >= -10000) {
                beta = Math.log(_range.max - _range.min) * log10; //Math.floor(Math.log(_range.max - _range.min) * log10);
                firstYear = CZ.Dates.getCoordinateFromYMD(0, 0, 1);
                if (beta >= 0) {
                    x1 += k * firstYear;
                }
                /*if (beta < 0) {
                x1 -= k * firstYear;
                }*/
            }

            if (isFinite(delta)) {
                return x1;
            } else {
                return _size / 2;
            }
        };

        /**
        * Rerender timescale with new ticks.
        * @param  {object} range { min, max } values of new range.
        */
        this.update = function (range) {
            _range = range;
            render();
        };

        /**
        * Clears container DIV.
        */
        this.destroy = function () {
            _container[0].innerHTML = "";
            _container.removeClass("cz-timescale");
            _container.removeClass("unselectable");
        };

        /**
        * Destroys timescale and removes it from parend node.
        */
        this.remove = function () {
            var parent = _container[0].parentElement;
            if (parent) {
                parent.removeChild(_container[0]);
            }
            this.destroy();
        };
    }
    CZ.Timescale = Timescale;
    ;

    //this is the class for creating ticks
    function TickSource() {
        this.delta, this.beta;
        this.range = { min: -1, max: 0 };
        this.log10 = 1 / Math.log(10);
        this.startDate = null, this.endDate = null, this.firstYear = null;
        this.regime = ""; // "Ga", "Ma", "ka" for 'cosmos' mode, "BCE/CE" for 'calendar' mode, "Date" for 'date' mode
        this.level = 1; // divider for each regime
        this.present;

        var divPool = [];
        var isUsedPool = [];
        var inners = [];
        var styles = [];
        var len = 0;

        this.start;
        this.finish;
        this.width = 900;

        // gets first available div (not used) or creates new one
        this.getDiv = function (x) {
            var inner = this.getLabel(x);
            var i = inners.indexOf(inner);
            if (i != -1) {
                isUsedPool[i] = true;
                styles[i].display = "block";
                return divPool[i];
            } else {
                var i = isUsedPool.indexOf(false);
                if (i != -1) {
                    isUsedPool[i] = true;
                    styles[i].display = "block";
                    inners[i] = inner;
                    var div = divPool[i][0];
                    div.innerHTML = inner;
                    divPool[i]._size = { width: div.offsetWidth, height: div.offsetHeight };
                    return divPool[i];
                } else {
                    var div = $("<div>" + inner + "</div>");
                    isUsedPool[len] = true;
                    divPool[len] = div;
                    inners[len] = inner;
                    styles[len] = div[0].style;
                    div._size = undefined;
                    len++;
                    return div;
                }
            }
        };

        // make all not used divs invisible (final step)
        this.refreshDivs = function () {
            for (var i = 0; i < len; i++) {
                if (isUsedPool[i])
                    isUsedPool[i] = false;
                else
                    styles[i].display = "none";
            }
        };

        this.hideDivs = function () {
            for (var i = 0; i < len; i++) {
                styles[i].display = "none";
            }
        };

        this.getTicks = function (range) {
            this.getRegime(range.min, range.max);
            return this.createTicks(range);
        };

        /*    this.getMinTicks = function () {
        this.getRegime(this.range.min, this.range.max);
        return this.createTicks(this.range);
        };*/
        this.getLabel = function (x) {
            return x;
        };

        this.getRegime = function (l, r) {
        };

        this.createTicks = function (range) {
        };

        this.getSmallTicks = function (ticks) {
            if (ticks.length !== 0) {
                return this.createSmallTicks(ticks);
            }
        };

        this.createSmallTicks = function (ticks) {
        };

        this.decreaseTickCount = function () {
            if (this.delta == 1) {
                this.delta = 2;
            } else if (this.delta == 2) {
                this.delta = 5;
            } else if (this.delta == 5) {
                this.delta = 1;
                this.beta++;
            }
            return this.createTicks(this.range);
        };

        this.increaseTickCount = function () {
            if (this.delta == 1) {
                this.delta = 5;
                this.beta--;
            } else if (this.delta == 2) {
                this.delta = 1;
            } else if (this.delta == 5) {
                this.delta = 2;
            }
            return this.createTicks(this.range);
        };

        this.round = function (x, n) {
            var pow = 1;
            var i;
            if (n <= 0) {
                n = Math.max(0, Math.min(-n, 15));
                pow = 1;
                for (i = 0; i > n; i--) {
                    pow /= 10;
                }
                return Math.round(x * pow) / pow;
            } else {
                pow = 1;
                for (i = 0; i < n; i++) {
                    pow *= 10;
                }
                var val = pow * Math.round(x / pow);
                return val;
            }
        };

        //returns text for marker label
        this.getMarkerLabel = function (range, time) {
            return time;
        };
    }
    CZ.TickSource = TickSource;
    ;

    function CosmosTickSource() {
        this.base = CZ.TickSource;
        this.base();
        var that = this;

        this.getLabel = function (x) {
            var text;

            // maximum number of decimal digits
            var n = Math.max(Math.floor(Math.log(this.delta * Math.pow(10, this.beta) / this.level) * this.log10), -4);

            // divide tick coordinate by level of cosmos zoom
            text = Math.abs(x) / this.level;

            if (n < 0) {
                text = (new Number(text)).toFixed(-n);
            }

            text += " " + (x < 0 ? this.regime : String(this.regime).charAt(0));
            return text;
        };

        this.getRegime = function (l, r) {
            if (l < r) {
                this.range.min = l;
                this.range.max = r;
            } else {
                // default range
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;
            }
            if (this.range.min < CZ.Settings.maxPermitedTimeRange.left)
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
            if (this.range.max > CZ.Settings.maxPermitedTimeRange.right)
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;

            // set present date
            var localPresent = CZ.Dates.getPresent();
            this.present = { year: localPresent.getUTCFullYear(), month: localPresent.getUTCMonth(), day: localPresent.getUTCDate() };

            // set default constant for arranging ticks
            this.delta = 1;
            this.beta = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);

            if (this.range.min <= -10000000000) {
                // billions of years ago
                this.regime = "Ga";
                this.level = 1000000000;
                if (this.beta < 7) {
                    this.regime = "Ma";
                    this.level = 1000000;
                }
            } else if (this.range.min <= -10000000) {
                // millions of years ago
                this.regime = "Ma";
                this.level = 1000000;
            } else if (this.range.min <= -10000) {
                // thousands of years ago
                this.regime = "ka";
                this.level = 1000;
            }
        };

        this.createTicks = function (range) {
            var ticks = new Array();

            // prevent zooming deeper than 4 decimal digits
            if (this.regime == "Ga" && this.beta < 7)
                this.beta = 7;
            else if (this.regime == "Ma" && this.beta < 2)
                this.beta = 2;
            else if (this.regime == "ka" && this.beta < -1)
                this.beta = -1;

            var dx = this.delta * Math.pow(10, this.beta);

            // calculate count of ticks to create
            var min = Math.floor(this.range.min / dx);
            var max = Math.floor(this.range.max / dx);
            var count = max - min + 1;

            // calculate rounded ticks values
            // they are in virtual coordinates (years from present date)
            var num = 0;
            var x0 = min * dx;
            if (dx == 2)
                count++;
            for (var i = 0; i < count + 1; i++) {
                var tick_position = this.round(x0 + i * dx, this.beta);
                if (tick_position >= this.range.min && tick_position <= this.range.max && tick_position != ticks[ticks.length - 1]) {
                    ticks[num] = { position: tick_position, label: this.getDiv(tick_position) };
                    num++;
                }
            }

            this.refreshDivs();
            return ticks;
        };

        this.createSmallTicks = function (ticks) {
            // function to create minor ticks
            var minors = new Array();

            //       var start = Math.max(this.range.left, maxPermitedTimeRange.left);
            //       var end = Math.min(this.range.right, maxPermitedTimeRange.right);
            //the amount of small ticks
            var n = 4;
            var k = this.width / (this.range.max - this.range.min);
            var nextStep = true;
            var l = ticks.length > 1 ? ticks[1].position - ticks[0].position : 0;
            var step = l / (n + 1);

            if (k * step < CZ.Settings.minSmallTickSpace)
                return null;
            var tick = ticks[0].position - step;

            while (tick > this.range.min) {
                minors.push(tick);
                tick -= step;
            }

            for (var i = 0; i < ticks.length - 1; i++) {
                var t = ticks[i].position;
                for (var k = 1; k <= n; k++) {
                    tick = t + step * k;
                    minors.push(tick);
                }
            }

            // create little ticks after last big tick
            tick = ticks[ticks.length - 1].position + step;
            while (tick < this.range.max) {
                minors.push(tick);
                tick += step;
            }
            return minors;
        };

        this.getMarkerLabel = function (range, time) {
            var labelText;
            this.getRegime(range.min, range.max);
            var numOfDigits = Math.max(Math.floor(Math.log(this.delta * Math.pow(10, this.beta) / this.level) * this.log10), -4) - 1;
            labelText = (Math.abs(time / this.level)).toFixed(Math.abs(numOfDigits));

            var localPresent = CZ.Dates.getPresent();
            var presentDate = CZ.Dates.getCoordinateFromYMD(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);

            if (time == presentDate) {
                if (this.regime !== "ka")
                    labelText = 0;
                else
                    labelText = 2;
            }
            labelText += " " + (time < 0 ? this.regime : String(this.regime).charAt(0));
            return labelText;
        };

        this.getVisibleForElement = function (element, scale, viewport, use_margin) {
            var margin = 2 * (CZ.Settings.contentScaleMargin && use_margin ? CZ.Settings.contentScaleMargin : 0);
            var width = viewport.width - margin;
            if (width < 0)
                width = viewport.width;
            var scaleX = scale * element.width / width;

            var height = viewport.height - margin;
            if (height < 0)
                height = viewport.height;
            var scaleY = scale * element.height / height;
            var vs = {
                centerX: element.x + element.width / 2.0,
                centerY: element.y + element.height / 2.0,
                scale: Math.max(scaleX, scaleY)
            };
            return vs;
        };
    }
    CZ.CosmosTickSource = CosmosTickSource;
    ;
    CZ.CosmosTickSource.prototype = new CZ.TickSource;

    function CalendarTickSource() {
        this.base = CZ.TickSource;
        this.base();

        this.getLabel = function (x) {
            var text;
            var DMY = CZ.Dates.getYMDFromCoordinate(x);
            var year = DMY.year;
            if (year <= 0)
                text = -year + " BCE";
            else
                text = year + " CE";
            return text;
        };

        this.getRegime = function (l, r) {
            if (l < r) {
                this.range.min = l;
                this.range.max = r;
            } else {
                // default range
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;
            }

            if (this.range.min < CZ.Settings.maxPermitedTimeRange.left)
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
            if (this.range.max > CZ.Settings.maxPermitedTimeRange.right)
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;

            // set present date
            var localPresent = CZ.Dates.getPresent();
            this.present = { year: localPresent.getUTCFullYear(), month: localPresent.getUTCMonth(), day: localPresent.getUTCDate() };

            // remember value in virtual coordinates when 1CE starts
            this.firstYear = CZ.Dates.getCoordinateFromYMD(0, 0, 1);
            this.range.max -= this.firstYear;
            this.range.min -= this.firstYear;

            this.startDate = this.present;
            this.endDate = this.present;
            if (this.range.min < 0) {
                this.startDate = CZ.Dates.getYMDFromCoordinate(this.range.min);
            }
            if (this.range.max < 0) {
                this.endDate = CZ.Dates.getYMDFromCoordinate(this.range.max);
            }

            // set default constant for arranging ticks
            this.delta = 1;
            this.beta = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);

            this.regime = "BCE/CE";
            this.level = 1;
        };

        this.createTicks = function (range) {
            var ticks = new Array();

            // shift range limits as in calendar mode we count from present year
            // prevent zooming deeper than 1 year span
            if (this.beta < 0)
                this.beta = 0;

            var dx = this.delta * Math.pow(10, this.beta);

            // calculate count of ticks to create
            var min = Math.floor(this.range.min / dx);
            var max = Math.floor(this.range.max / dx);
            var count = max - min + 1;

            // calculate rounded ticks values
            // they are in virtual coordinates (years from present date)
            var num = 0;
            var x0 = min * dx;
            if (dx == 2)
                count++;
            for (var i = 0; i < count + 1; i++) {
                var tick_position = CZ.Dates.getCoordinateFromYMD(x0 + i * dx, 0, 1);
                if (tick_position === 0 && dx > 1)
                    tick_position += 1; // Move tick from 1BCE to 1CE
                if (tick_position >= this.range.min && tick_position <= this.range.max && tick_position != ticks[ticks.length - 1]) {
                    ticks[num] = { position: tick_position, label: this.getDiv(tick_position) };
                    num++;
                }
            }
            this.refreshDivs();
            return ticks;
        };

        this.createSmallTicks = function (ticks) {
            // function to create minor ticks
            var minors = new Array();

            //the amount of small ticks
            var n = 4;

            var beta1 = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);
            if (beta1 <= 0.3)
                n = 3;

            var k = this.width / (this.range.max - this.range.min);
            var nextStep = true;
            var l = ticks.length > 1 ? ticks[1].position - ticks[0].position : 0;
            var step = l / (n + 1);

            if (k * step < CZ.Settings.minSmallTickSpace)
                return null;
            var tick = ticks[0].position - step;

            while (tick > this.range.min) {
                minors.push(tick);
                tick -= step;
            }

            for (var i = 0; i < ticks.length - 1; i++) {
                var t = ticks[i].position;

                // Count minor ticks from 1BCE, not from 1CE if step between large ticks greater than 1
                if (step > 1e-10 + 1 / (n + 1) && Math.abs(t - 1.0) < 1e-10)
                    t = 0;
                for (var k = 1; k <= n; k++) {
                    tick = t + step * k;

                    //if (tick < 0) tick += 1;
                    minors.push(tick);
                }
            }

            // create little ticks after last big tick
            tick = ticks[ticks.length - 1].position + step;
            while (tick < this.range.max) {
                minors.push(tick);
                tick += step;
            }
            return minors;
        };

        this.getMarkerLabel = function (range, time) {
            var labelText = "";

            this.getRegime(range.min, range.max);
            var currentDate = parseFloat(new Number(time - this.firstYear).toFixed(2));
            currentDate += currentDate > 0 ? -0.5 : -1.5;
            currentDate = Math.round(currentDate);
            if (currentDate < 0) {
                currentDate = -currentDate;
            } else if (currentDate == 0) {
                currentDate = 1;
            }

            labelText = currentDate.toString();

            if (time < this.firstYear + 1) {
                labelText += " " + "BCE";
            } else {
                labelText += " " + "CE";
            }

            return labelText;
        };

        this.getVisibleForElement = function (element, scale, viewport, use_margin) {
            var margin = 2 * (CZ.Settings.contentScaleMargin && use_margin ? CZ.Settings.contentScaleMargin : 0);
            var width = viewport.width - margin;
            if (width < 0)
                width = viewport.width;
            var scaleX = scale * element.width / width;

            var height = viewport.height - margin;
            if (height < 0)
                height = viewport.height;
            var scaleY = scale * element.height / height;
            var vs = {
                centerX: element.x + element.width / 2.0,
                centerY: element.y + element.height / 2.0,
                scale: scaleX
            };
            return vs;
        };
    }
    CZ.CalendarTickSource = CalendarTickSource;
    ;
    CZ.CalendarTickSource.prototype = new CZ.TickSource;

    function DateTickSource() {
        this.base = CZ.TickSource;
        this.base();

        var year, month, day;

        // span between two rendering neighboring days
        var tempDays = 0;

        this.getRegime = function (l, r) {
            if (l < r) {
                this.range.min = l;
                this.range.max = r;
            } else {
                // default range
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;
            }

            if (this.range.min < CZ.Settings.maxPermitedTimeRange.left)
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
            if (this.range.max > CZ.Settings.maxPermitedTimeRange.right)
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;

            // set present date
            var localPresent = CZ.Dates.getPresent();
            this.present = { year: localPresent.getUTCFullYear(), month: localPresent.getUTCMonth(), day: localPresent.getUTCDate() };

            // remember value in virtual coordinates when 1CE starts
            this.firstYear = CZ.Dates.getCoordinateFromYMD(0, 0, 1);

            this.startDate = CZ.Dates.getYMDFromCoordinate(this.range.min);
            this.endDate = CZ.Dates.getYMDFromCoordinate(this.range.max);

            // set default constant for arranging ticks
            this.delta = 1;
            this.beta = Math.log(this.range.max - this.range.min) * this.log10;

            if (this.beta >= -0.2)
                this.regime = "Quarters_Month";
            if (this.beta <= -0.2 && this.beta >= -0.8)
                this.regime = "Month_Weeks";
            if (this.beta <= -0.8 && this.beta >= -1.4)
                this.regime = "Weeks_Days";
            if (this.beta <= -1.4)
                this.regime = "Days_Quarters";

            this.level = 1;
        };

        this.getLabel = function (x) {
            var text = CZ.Dates.months[month];
            var year_temp = year;
            if (year == 0)
                year_temp--;
            if (text == "January")
                text += " " + year_temp;
            if (tempDays == 1)
                text = day + " " + CZ.Dates.months[month];
            if ((this.regime == "Weeks_Days") && (day == 3))
                text += ", " + year_temp;
            if ((this.regime == "Days_Quarters") && (day == 1))
                text += ", " + year_temp;
            return text;
        };

        this.getMinTicks = function () {
            this.getRegime(this.range.min, this.range.max);
            return this.createTicks(this.range);
        };

        this.createTicks = function (range) {
            tempDays = 0;
            var ticks = new Array();
            var num = 0;

            // count number of months to render
            var countMonths = 0;

            // count number of days to render
            var countDays = 0;

            //current year and month to start counting
            var tempYear = this.startDate.year;
            var tempMonth = this.startDate.month;
            while (tempYear < this.endDate.year || (tempYear == this.endDate.year && tempMonth <= this.endDate.month)) {
                countMonths++;
                tempMonth++;
                if (tempMonth >= 12) {
                    tempMonth = 0;
                    tempYear++;
                }
            }

            // calculate ticks values
            // they are in virtual coordinates (years from present date)
            year = this.startDate.year;

            // create month ticks
            month = this.startDate.month - 1;
            var month_step = 1;
            var date_step = 1;
            for (var j = 0; j <= countMonths + 2; j += month_step) {
                month += month_step;
                if (month >= 12) {
                    month = 0;
                    year++;
                }

                if ((this.regime == "Quarters_Month") || (this.regime == "Month_Weeks")) {
                    var tick = CZ.Dates.getCoordinateFromYMD(year, month, 1);
                    if (tick >= this.range.min && tick <= this.range.max) {
                        if (tempDays != 1) {
                            if ((month % 3 == 0) || (this.regime == "Month_Weeks")) {
                                ticks[num] = { position: tick, label: this.getDiv(tick) };
                                num++;
                            }
                        }
                    }
                }

                // create days ticks for this month
                if ((this.regime == "Weeks_Days") || (this.regime == "Days_Quarters")) {
                    countDays = Math.floor(CZ.Dates.daysInMonth[month]);
                    if ((month === 1) && (CZ.Dates.isLeapYear(year)))
                        countDays++;
                    tempDays = 1;
                    for (var k = 1; k <= countDays; k += date_step) {
                        day = k;
                        tick = CZ.Dates.getCoordinateFromYMD(year, month, day);
                        if (tick >= this.range.min && tick <= this.range.max) {
                            if (this.regime == "Weeks_Days") {
                                if ((k == 3) || (k == 10) || (k == 17) || (k == 24) || (k == 28)) {
                                    ticks[num] = { position: tick, label: this.getDiv(tick) };
                                    num++;
                                }
                            } else {
                                ticks[num] = { position: tick, label: this.getDiv(tick) };
                                num++;
                            }
                        }
                    }
                }
            }
            this.refreshDivs();
            return ticks;
        };

        this.createSmallTicks = function (ticks) {
            // function to create minor ticks
            var minors = new Array();

            var k = this.width / (this.range.max - this.range.min);
            var nextStep = true;

            var step;

            var n;
            var tick = ticks[0].position;
            var date = CZ.Dates.getYMDFromCoordinate(tick);

            if (this.regime == "Quarters_Month")
                n = 2;
            else if (this.regime == "Month_Weeks")
                n = CZ.Dates.daysInMonth[date.month]; //step = 5 / daysInMonth[date.month];
            else if (this.regime == "Weeks_Days")
                n = 7; //step = 5 / 7;
            else if (this.regime == "Days_Quarters")
                n = 4; //step = 5 / 4;

            if (this.regime == "Quarters_Month")
                step = Math.floor(2 * CZ.Dates.daysInMonth[date.month] / n);
            else if (this.regime == "Month_Weeks")
                step = 1;
            else if (this.regime == "Weeks_Days")
                step = 1;
            else if (this.regime == "Days_Quarters")
                step = 0.25;

            if (k * step < CZ.Settings.minSmallTickSpace)
                return null;

            date.day -= step;
            tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);

            if (this.regime != "Month_Weeks") {
                while (tick > this.range.min) {
                    minors.push(tick);
                    date.day -= step;
                    tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
                }
            } else {
                var j = CZ.Dates.daysInMonth[date.month];
                while (tick > this.range.min) {
                    if ((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 27)) {
                        minors.push(tick);
                    }
                    date.day -= step;
                    tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
                    j--;
                }
            }

            for (var i = 0; i < ticks.length - 1; i++) {
                var tick = ticks[i].position;
                var date = CZ.Dates.getYMDFromCoordinate(tick);
                var j_step = 1;
                for (var j = 1; j <= n; j += j_step) {
                    date.day += step;
                    tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
                    if (this.regime != "Month_Weeks") {
                        if (minors.length == 0 || k * (ticks[i + 1].position - tick) > CZ.Settings.minSmallTickSpace)
                            minors.push(tick);
                    } else {
                        if ((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 28)) {
                            if (minors.length == 0 || k * (ticks[i + 1].position - tick) > CZ.Settings.minSmallTickSpace)
                                minors.push(tick);
                        }
                    }
                }
            }
            var tick = ticks[ticks.length - 1].position;
            var date = CZ.Dates.getYMDFromCoordinate(tick);
            date.day += step;
            tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);

            if (this.regime != "Month_Weeks") {
                while (tick < this.range.max) {
                    minors.push(tick);
                    date.day += step;
                    tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
                }
            } else {
                var j = 0;
                while (tick < this.range.max) {
                    if ((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 28)) {
                        minors.push(tick);
                    }
                    date.day += step;
                    tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
                    j++;
                }
            }
            return minors;
        };

        this.getMarkerLabel = function (range, time) {
            this.getRegime(range.min, range.max);
            var date = CZ.Dates.getYMDFromCoordinate(time, true);
            var labelText = date.year + "." + (date.month + 1) + "." + date.day;
            return labelText;
        };

        this.getVisibleForElement = function (element, scale, viewport, use_margin) {
            var margin = 2 * (CZ.Settings.contentScaleMargin && use_margin ? CZ.Settings.contentScaleMargin : 0);
            var width = viewport.width - margin;
            if (width < 0)
                width = viewport.width;
            var scaleX = scale * element.width / width;

            var height = viewport.height - margin;
            if (height < 0)
                height = viewport.height;
            var scaleY = scale * element.height / height;
            var vs = {
                centerX: element.x + element.width / 2.0,
                centerY: element.y + element.height / 2.0,
                scale: Math.min(scaleX, scaleY)
            };
            return vs;
        };
    }
    CZ.DateTickSource = DateTickSource;
    ;
    CZ.DateTickSource.prototype = new CZ.TickSource;
})(CZ || (CZ = {}));
/// <reference path='typings/jquery/jquery.d.ts'/>
var CZ;
(function (CZ) {
    (function (UILoader) {
        function loadHtml(selector, filepath) {
            var container = $(selector);
            var promise = $.Deferred();

            // NOTE: Allow undefined filepath. The method will return initial container.
            if (!filepath) {
                promise.resolve(container);
                return promise;
            }

            if (!selector || !container.length) {
                throw "Unable to load " + filepath + " " + selector;
            }

            container.load(filepath, function () {
                promise.resolve(container);
            });

            return promise;
        }
        UILoader.loadHtml = loadHtml;

        function loadAll(uiMap) {
            var promises = [];

            for (var selector in uiMap) {
                if (uiMap.hasOwnProperty(selector)) {
                    promises.push(loadHtml(selector, uiMap[selector]));
                }
            }

            return $.when.apply($, promises);
        }
        UILoader.loadAll = loadAll;
    })(CZ.UILoader || (CZ.UILoader = {}));
    var UILoader = CZ.UILoader;
})(CZ || (CZ = {}));
/// <reference path='settings.ts'/>
var CZ;
(function (CZ) {
    (function (Dates) {
        // array of month names to use in labels
        Dates.months = [
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
            'December'];

        // array of numbers of days for each month, 28 days in february by default
        Dates.daysInMonth = [
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
            31];

        // by give date gives coordinate in virtual coordinates
        function getCoordinateFromYMD(year, month, day) {
            var sign = (year === -1) ? 1 : year / Math.abs(year), isLeap = isLeapYear(year), daysInYear = isLeap ? 366 : 365, coord = (year > -1) ? year : year + 1;

            // Get the number of day in the year.
            var sumDaysOfMonths = function (s, d, i) {
                return s + +(i < month) * d;
            };
            var days = Dates.daysInMonth.reduce(sumDaysOfMonths, +(isLeap && month > 1)) + day;

            coord += (days - 1) / daysInYear;

            coord = roundDecimal(coord, CZ.Settings.allowedMathImprecisionDecimals);

            return coord;
        }
        Dates.getCoordinateFromYMD = getCoordinateFromYMD;

        function getYMDFromCoordinate(coord, MarkerCorrection) {
            if (typeof MarkerCorrection === "undefined") { MarkerCorrection = false; }
            var absCoord = Math.abs(coord), floorCoord = Math.floor(coord), sign = (coord === 0) ? 1 : coord / absCoord, day = 0, month = 0, year = (coord >= 1) ? floorCoord : floorCoord - 1, isLeap = isLeapYear(year), daysInYear = isLeap ? 366 : 365, daysFraction = sign * (absCoord - Math.abs(floorCoord));

            // NOTE: Using Math.round() here causes day to be rounded to 365(366)
            //       in case of the last day in a year. Do not increment day in
            //       in this case.
            day = Math.round(daysFraction * daysInYear);
            if (MarkerCorrection)
                day = Math.floor(daysFraction * daysInYear);
            day += +(day < daysInYear);

            while (day > Dates.daysInMonth[month] + (+(isLeap && month === 1))) {
                day -= Dates.daysInMonth[month];
                if (isLeap && month === 1) {
                    day--;
                }
                month++;
            }

            return {
                year: year,
                month: month,
                day: day
            };
        }
        Dates.getYMDFromCoordinate = getYMDFromCoordinate;

        // convert decimal year to virtual coordinate
        // 9999 -> present day
        // TODO: currently in database 1 BCE = -1 in virtual coords, but on client side 1 BCE = 0 in virtual coords
        // decimalYear in database has to be equal to virtual coordinate?
        function getCoordinateFromDecimalYear(decimalYear) {
            // get virtual coordinate of present day
            var localPresent = getPresent();
            var presentDate = getCoordinateFromYMD(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);

            return decimalYear === 9999 ? presentDate : (decimalYear < 0 ? decimalYear + 1 : decimalYear);
        }
        Dates.getCoordinateFromDecimalYear = getCoordinateFromDecimalYear;

        // convert virtual coordinate to decimal year
        function getDecimalYearFromCoordinate(coordinate) {
            // in database 1 BCE = -1, on client side 1 BCE = 0
            return coordinate < 1 ? --coordinate : coordinate;
        }
        Dates.getDecimalYearFromCoordinate = getDecimalYearFromCoordinate;

        function convertCoordinateToYear(coordinate) {
            var year = {
                year: coordinate,
                regime: "CE"
            };
            var eps_const = 100000;
            if (coordinate <= -999999999) {
                year.year = (year.year - 1) / (-1000000000);
                year.year = Math.round(year.year * eps_const) / eps_const;
                year.regime = 'Ga';
            } else if (coordinate <= -999999) {
                year.year = (year.year - 1) / (-1000000);
                year.year = Math.round(year.year * eps_const) / eps_const;
                year.regime = 'Ma';
            } else if (coordinate <= -9999) {
                year.year = (year.year - 1) / (-1000);
                year.year = Math.round(year.year * eps_const) / eps_const;
                year.regime = 'Ka';
            } else if (coordinate < 1) {
                year.year = (year.year - 1) / (-1);

                // remove fraction part of year
                year.year = Math.ceil(year.year);
                year.regime = 'BCE';
            } else {
                // remove fraction part of year
                year.year = Math.floor(year.year);
            }

            //if (year.regime === 'BCE') {
            //    year.year += 2;
            //   }
            //if ((year.regime === 'CE') && (year.year === 0)) {
            //    year.regime = 'BCE';
            //    year.year = 1;
            //   }
            return year;
        }
        Dates.convertCoordinateToYear = convertCoordinateToYear;

        function convertYearToCoordinate(year, regime) {
            var coordinate = year;

            switch (regime.toLowerCase()) {
                case "ga":
                    coordinate = year * (-1000000000) + 1;
                    break;
                case "ma":
                    coordinate = year * (-1000000) + 1;
                    break;
                case "ka":
                    coordinate = year * (-1000) + 1;
                    break;
                case "bce":
                    coordinate = year * (-1) + 1;

                    break;
            }

            return coordinate;
        }
        Dates.convertYearToCoordinate = convertYearToCoordinate;

        var present = undefined;
        function getPresent() {
            if (!present) {
                present = new Date();

                present.presentDay = present.getUTCDate();
                present.presentMonth = present.getUTCMonth();
                present.presentYear = present.getUTCFullYear();
            }
            return present;
        }
        Dates.getPresent = getPresent;

        function isLeapYear(year) {
            return (year >= 1582 && (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)));
        }
        Dates.isLeapYear = isLeapYear;

        function numberofLeap(year) {
            var startLeap = 1582;
            if (year < startLeap)
                return 0;
            var years1 = Math.floor(year / 4) - Math.floor(startLeap / 4);
            years1 -= Math.floor(year / 100) - Math.floor(startLeap / 100);
            years1 += Math.floor(year / 400) - Math.floor(startLeap / 400);
            if (isLeapYear(year))
                years1--;
            return years1;
        }
        Dates.numberofLeap = numberofLeap;

        function roundDecimal(decimal, precision) {
            return Math.round(decimal * Math.pow(10, precision)) / Math.pow(10, precision);
        }
    })(CZ.Dates || (CZ.Dates = {}));
    var Dates = CZ.Dates;
})(CZ || (CZ = {}));
/// <reference path='uiloader.ts'/>
/// <reference path='../ui/media/bing-mediapicker.ts'/>
/// <reference path='../ui/media/skydrive-mediapicker.ts'/>
/// <reference path='typings/jquery/jquery.d.ts'/>
var CZ;
(function (CZ) {
    (function (Media) {
        var _mediaPickers = {};
        var _mediaPickersViews = {};

        Object.defineProperties(CZ.Media, {
            mediaPickers: {
                get: function () {
                    return _mediaPickers;
                }
            },
            mediaPickersViews: {
                get: function () {
                    return _mediaPickersViews;
                }
            }
        });

        function initialize() {
            // TODO: Register media pickers. The order is essential for MediaList.
            registerMediaPicker("bing", "/images/media/bing-import-50x150.png", CZ.Media.BingMediaPicker, "/ui/media/bing-mediapicker.html");

            if (CZ.Media.SkyDriveMediaPicker.isEnabled) {
                registerMediaPicker("skydrive", "/images/media/skydrive-import-50x150.png", CZ.Media.SkyDriveMediaPicker).done(function () {
                    WL.init({
                        client_id: CZ.Settings.WLAPIClientID,
                        redirect_uri: CZ.Settings.WLAPIRedirectUrl,
                        response_type: "token",
                        scope: "wl.signin,wl.photos,wl.skydrive,wl.skydrive_update"
                    });
                });
            }
        }
        Media.initialize = initialize;

        function registerMediaPicker(title, iconUrl, type, viewUrl, selector) {
            var order = Object.keys(_mediaPickers).length;
            var setup = type.setup;
            selector = selector || "$('<div></div>')";
            _mediaPickers[title] = {};

            return CZ.UILoader.loadHtml(selector, viewUrl).always(function (view) {
                _mediaPickersViews[title] = view;
                _mediaPickers[title] = {
                    title: title,
                    iconUrl: iconUrl,
                    order: order,
                    setup: setup
                };
            });
        }
        Media.registerMediaPicker = registerMediaPicker;
    })(CZ.Media || (CZ.Media = {}));
    var Media = CZ.Media;
})(CZ || (CZ = {}));
﻿// The following jQuery extension is used by menus to stop click ghosting on touch-screen devices.
// This can occur when looking for either click or touchstart events (both can fire on some touch
// devices) without wanting to preventPropagation. Use $(elements).clicktouch(... instead of
// .on('click touchstart' or similar. See https://patrickhlauke.github.io/touch/tests/results/.
jQuery.fn.extend
({
    clicktouch: function (handler)
    {
        return this.each(function ()
        {
            // touchstart       = standard touch screen event (not supported by IE.)
            // pointerdown      = IE11+ mouse or touch screen event, other browsers adopting.
            // mspointerdown    = IE10  mouse or touch screen event, other browsers adopting.
            // click            = standard mouse event (not supported by some touch screens.)

            var event;

            if      ('ontouchstart'     in window)  event = 'touchstart'
            else if ('onpointerdown'    in window)  event = 'pointerdown'
            else if ('onmspointerdown'  in window)  event = 'mspointerdown'
            else                                    event = 'click';

            // if Chrome under Windows then always override with click event.
            // See https://trello.com/c/3QjK5OlK/226-chrome-on-w8-1-touchscreen-bug.
            if (Boolean(window.chrome) && navigator.platform.indexOf('Win32') > -1)
            {
                event = 'click';
            }

            $(this).on(event, handler);
        });
    }
});



/*********
 * Menus *
 *********/

var CZ;
(function (CZ) {
    /*
    
    Menus contains logic to decide which (if any) top menus and their menu items to display, based on Menus public properties, and to render the top menus in the header.
    After changing one or more public properties, a call to the CZ.Menus.Refresh() function should be made in order for the menu display to be updated based on the latest property settings.
    It's OK to call Refresh() several times since this function has no db lookups, and just contains some very light DOM manipulation.

    The code to render a side panel or overlay, which is called from a menu item, is still mostly in /scripts/cz.js, (where it was originally coded.)
    This is partly due to the side panel code requiring various values embedded in cz.js, but mostly because the side panels can also be displayed from elsewhere.
    However the code to display side panels has been alterered so as not to directly hook menus or have display logic, and has been moved into public methods.

    See https://trello.com/c/fSZbqEFU/148-collection-view-header-ribbon-bar-title-bar for general logic regarding Menus display choices.

    */
    (function (Menus) {

        /*********************
         * Public Properties *      // Set to initial state of false for default anon user menus
         *********************/
        Menus.isSignedIn = false;   // Set to true while user is logged in
        Menus.isEditor   = false;   // Set to true if user has edit rights to the current collection - Note that isEditor should not be true unless isSignedIn is true
        Menus.isDisabled = false;   // Set to true while displaying a panel that is pseudo-modal
        Menus.isHidden   = false;   // Set to true for "Kiosk Mode"



        /******************
         * Public Methods *
         ******************/
        function Refresh()          // Call after any properties changed
        {
            $('#btnToggleSignedIn').attr('data-active', Menus.isSignedIn);
            $('#btnToggleEditor'  ).attr('data-active', Menus.isEditor);
            $('#btnToggleDisable' ).attr('data-active', Menus.isDisabled);
            $('#btnToggleHide'    ).attr('data-active', Menus.isHidden);

            if (Menus.isHidden)
            {
                $('#mnu').hide();
            }
            else
            {
                $('#mnu').show();
            }

            if (Menus.isDisabled)
            {
                $('#mnu').removeClass('disabled').addClass('disabled');
            }
            else
            {
                $('#mnu').removeClass('disabled');
            }

            if (Menus.isSignedIn)
            {
                $('#mnuProfile')
                    .attr('title', 'My Profile / Sign Out')
                    .find('img').attr('src', '/images/profile-icon-green.png');
            }
            else
            {
                $('#mnuProfile')
                    .attr('title', 'Register / Sign In')
                    .find('img').attr('src', '/images/profile-icon.png');
            }

            if (Menus.isEditor)
            {
                $('#mnuCurate').show();                                     // if Curate can be hidden
              //$('#mnuCurate').removeClass('active').addClass('active');   // if keeping Curate visible
            }
            else
            {
                $('#mnuCurate').hide();                                     // if Curate can be hidden
              //$('#mnuCurate').removeClass('active');                      // if keeping Curate visible
            }
        }
        Menus.Refresh = Refresh;



        /*******************
         * Private Methods *
         *******************/
        $(document).ready(function ()
        {


            /***********
             * Menu UI *
             ***********/

            var slideDownSpeed = 250;
            var slideUpSpeed = 'fast';


            // *** primary menu ***

            $('#mnu').children('li')

                .mouseenter(function (event)
                {
                    // show
                    if ($(this).hasClass('active') && !$('#mnu').hasClass('disabled'))
                    {
                        $(this).children('ul').slideDown(slideDownSpeed);
                    }
                })
                .mouseleave(function (event)
                {
                    // hide
                    $(this).children('ul').slideUp(slideUpSpeed);
                })
                .on('touchstart', function (event)
                {
                    // if has secondary menu then sticky toggle for touch events
                    if ($(this).children('ul').length === 1)
                    {
                        if ($(this).children('ul').is(':visible'))
                        {
                            $(this).trigger('mouseleave');
                        }
                        else
                        {
                            $(this).trigger('mouseenter');
                        }
                    }
                })


                // *** secondary menu ***

                .children('ul').children('li').clicktouch(function (event)
                {
                    event.stopPropagation();

                    if ($(this).children().hasClass('chevron'))
                    {
                        // has tertiary menu - sticky expand/hide
                        if ($(this).hasClass('active'))
                        {
                            // hide
                            $(this).children('.chevron').html('&#9654;'); // right chevron
                            $(this).removeClass('active').children('ul').slideUp(slideUpSpeed);
                        }
                        else
                        {
                            // show
                            $(this).children('.chevron').html('&#9698;'); // down chevron
                            $(this).addClass('active').children('ul').slideDown(slideDownSpeed);
                        }
                    }
                    else
                    {
                        // has no sub-menu - immediately hide drop-down
                        $(this).parent().slideUp(slideUpSpeed);
                    }
                })


                // *** tertiary menu ***

                .children('ul').children('li').clicktouch(function (event)
                {
                    event.stopPropagation();

                    // has no sub-menu - immediately hide drop-down
                    $(this).parent().parent().parent().slideUp(slideUpSpeed);
                });



            /*******************
             * Menu Item Hooks *
             *******************/

            $('#mnuViewTours').clicktouch(function (event)
            {
                event.stopPropagation();
                // show tours list pane (hide edit options)
                CZ.HomePageViewModel.panelShowToursList(false);
            });

            $('#mnuViewSeries').clicktouch(function (event)
            {
                event.stopPropagation();
                // toggle display of time series pane
                CZ.HomePageViewModel.panelToggleTimeSeries();
            });

            $('#mnuCurate').hide().clicktouch(function (event)
            {
                if (Menus.isDisabled) return;
                if (!Menus.isSignedIn)
                {
                    // toggle display of register / log in pane
                    CZ.HomePageViewModel.panelToggleLogin();
                }
                else
                {
                    if (!Menus.isEditor)
                    {
                        CZ.Authoring.showMessageWindow
                        (
                            'Sorry, you do not have edit rights to this collection.',
                            'Unable to Curate'
                        );
                    }
                }
            });

            $('#mnuCreateCollection').clicktouch(function (event)
            {
                event.stopPropagation();
                // show create collection dialog
                CZ.HomePageViewModel.closeAllForms();
                AddCollection();
            });

            $('#mnuCreateTimeline').clicktouch(function (event)
            {
                event.stopPropagation();
                // show create timeline dialog
                CZ.HomePageViewModel.closeAllForms();
                CZ.Overlay.Hide();
                CZ.Authoring.UI.createTimeline();
            });

            $('#mnuCreateExhibit').clicktouch(function (event)
            {
                event.stopPropagation();
                // show create exhibit dialog
                CZ.HomePageViewModel.closeAllForms();
                CZ.Overlay.Hide();
                CZ.Authoring.UI.createExhibit();
            });

            $('#mnuCreateTour').clicktouch(function (event)
            {
                event.stopPropagation();
                // show create tour dialog
                CZ.HomePageViewModel.closeAllForms();
                CZ.Overlay.Hide();
                CZ.Authoring.UI.createTour();
            });

            $('#mnuExportAbout').clicktouch(function (event)
            {
                event.stopPropagation();
                // show quick information regarding exports
                ExportInformation();
            });

            $('#mnuEditTours').clicktouch(function (event)
            {
                event.stopPropagation();
                // show tours list pane (with edit options)
                CZ.HomePageViewModel.panelShowToursList(true);
            });

            $('#mnuExportCollection').clicktouch(function (event)
            {
                event.stopPropagation();
                // initiate export and inform user when complete
                CZ.HomePageViewModel.closeAllForms();
                ExportCollection();
            });

            $('#mnuImportCollection').clicktouch(function (event)
            {
                event.stopPropagation();
                // prompt user to pick file then import
                CZ.HomePageViewModel.closeAllForms();
                $('#mnuFileJSON')
                    .data('mnuItem', '#mnuImportCollection')
                    .val('')
                    .trigger('click');
            });

            $('#mnuMine').clicktouch(function (event)
            {
                if (Menus.isDisabled) return;
                if (!Menus.isSignedIn)
                {
                    // note that we want to show my collections after a successful log in
                    sessionStorage.setItem('showMyCollections', 'requested');

                    // toggle display of register / log in pane
                    CZ.HomePageViewModel.panelToggleLogin();
                }
                else
                {
                    // show my collections overlay (with preference for display of My Collections if viewing Cosmos)
                    CZ.Overlay.Show(true);
                }
            });

            $('#mnuSearch').clicktouch(function (event)
            {
                if (Menus.isDisabled) return;
                // toggle display of search pane
                CZ.HomePageViewModel.panelToggleSearch();
            });

            $('#mnuProfile').clicktouch(function (event)
            {
                if (Menus.isDisabled) return;
                if (Menus.isSignedIn)
                {
                    // toggle display of profile pane (contains log out option)
                    CZ.HomePageViewModel.panelToggleProfile();
                }
                else
                {
                    // toggle display of register / log in pane
                    CZ.HomePageViewModel.panelToggleLogin();
                }
            });

            $('#mnuFileJSON').on('input, change', function (event)
            {
                // mnuFileJSON is used for picking which file to upload
                // and can be shared over several menu items if desired

                if (this.value === '' || this.files.length < 1) return;

                var json;

                // setup to catch when file has finished loading OK
                var file    = new FileReader();
                file.onload = function (event)
                {
                    // tell user if invalid JSON (faster to parse client-side)
                    try
                    {
                        json = $.parseJSON(file.result);
                    }
                    catch(error)
                    {
                        CZ.Authoring.showMessageWindow
                        (
                            "This file is not a valid .json file.",
                            "Invalid File Format"
                        );
                        return;
                    }

                    // hand data off to appropriate menu item's fn
                    switch ($('#mnuFileJSON').data('mnuItem'))
                    {
                        case '#mnuImportCollection':
                            ImportCollection(file.result);
                            break;
                    }
                };

                // initiate the file load
                file.readAsText(this.files[0], 'utf8');
            });

        });


        /***********
         * Helpers *
         ***********/

        this.AddCollection =
        function AddCollection()
        {
            CZ.Authoring.hideMessageWindow();

            var newName = prompt("What name would you like for your new collection?\nNote: The name must be unique among your collections.", '') || '';
            newName     = $.trim(newName);

            var newPath = newName.replace(/[^a-zA-Z0-9\-]/g, '');
            if (newPath === '') return;

            if (newPath.length > 50)
            {
                CZ.Authoring.showMessageWindow
                (
                    "The name of your new collection must be no more than 50 characters in length.",
                    "Unable to Create Collection"
                );
                return;
            }

            CZ.Service.getCollection().done(function (currentCollection)
            {
                CZ.Service.isUniqueCollectionName(newName).done(function (isUniqueCollectionName)
                {
                    if (!isUniqueCollectionName || newPath === currentCollection.Path)
                    {
                        CZ.Authoring.showMessageWindow
                        (
                            "Sorry your new collection name is not unique enough. Please try a different name.",
                            "Unable to Create Collection"
                        );
                        return;
                    }

                    CZ.Service.postCollection(newPath, { Title: newName }).done(function (success)
                    {
                        if (success)
                        {
                            window.location =
                            (
                                window.location.protocol + '//' + window.location.host + '/' + CZ.Service.superCollectionName + '/' + newPath
                            )
                            .toLowerCase();
                        }
                        else
                        {
                            CZ.Authoring.showMessageWindow
                            (
                                "An unexpected error occured.",
                                "Unable to Create Collection"
                            );
                        }
                    });

                });
            });

        };


        this.ExportInformation =
        function ExportInformation()
        {
            CZ.Authoring.showMessageWindow
            (
                "Exporting a collection lets you save an entire collection to a file on your PC, which you can keep as a backup or share with others. " +
                "The collection's name, background, colors, timelines, exhibits, content items and tours are all included. If you've granted edit rights " +
                "to other people, please note that the list of editors is not included. When you import a previously exported collection, " +
                "it will always be imported as a new unpublished collection, which you can then edit and publish when you are ready.",
                "Exporting & Importing Collections"
            );
        };


        this.ExportCollection =
        function ExportCollection()
        {
            var promiseRootId       = CZ.Service.getRootTimelineId();
            var promiseCollection   = CZ.Service.getCollection();
            var promiseTours        = CZ.Service.getTours();

            $.when
            (
                promiseRootId,
                promiseCollection,
                promiseTours
            )
            .done(function(rootId, collection, tours)
            {

                CZ.Service.exportTimelines(rootId[0])
                .done(function (timelines)
                {
                    var exportData =
                    {
                        date:       new Date().toUTCString(),
                        schema:     constants.schemaVersion,
                        collection:
                        {
                            Title:  collection[0].Title,
                            theme:  collection[0].theme
                        },
                        timelines:  timelines,
                        tours:      tours[0].d
                    };

                    var fileBLOB = new Blob([JSON.stringify(exportData)], { type: 'application/json;charset=utf-8' });
                    var fileName = 'cz.' + collection[0].Path + '.json';

                    saveAs(fileBLOB, fileName);

                    CZ.Authoring.showMessageWindow
                    (
                        'The current collection has been provided to you as a file, which you can retain as a back-up, or share with others. ' +
                        'If you are not prompted to pick a file name, please check your downloads for a file called: "' + fileName + '".',
                        'Collection Successfully Exported'
                    );
                })
                .fail(function ()
                {
                    CZ.Authoring.showMessageWindow
                    (
                        'Sorry, we were unable to export this collection.',
                        'Unable to Export Collection'
                    );
                });

            })
            .fail(function()
            {
                CZ.Authoring.showMessageWindow
                (
                    'An unexpected error occured. Please feel free to try again.',
                    'Unable to Export Collection'
                );
            });

        };


        this.ImportCollection =
        function ImportCollection(stringifiedJSON)
        {
            CZ.Service.importCollection(stringifiedJSON).then(function (importMessage)
            {
                CZ.Authoring.showMessageWindow(importMessage);
            });
        };


    })(CZ.Menus || (CZ.Menus = {}));
    var Menus = CZ.Menus;
})(CZ || (CZ = {}));/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../settings.ts'/>
(function ($) {
    // jQuery plugin. Shows error message under field.
    $.fn.showError = function (msg, className, props) {
        className = className || "error";
        props = props || {};

        $.extend(true, props, {
            class: className,
            text: msg
        });

        var $errorTemplate = $("<div></div>", props).attr("error", true);
        var $allErrors = $();
        var $errorElems = $();

        var result = this.each(function () {
            var $this = $(this);
            var isDiv;
            var $div;
            var $error;

            if (!$this.data("error")) {
                isDiv = $this.is("div");
                $div = isDiv ? $this : $this.closest("div");
                $error = $errorTemplate.clone();

                $allErrors = $allErrors.add($error);

                $errorElems = $errorElems.add($this);
                $errorElems = $errorElems.add($div);
                $errorElems = $errorElems.add($div.children());
                $this.data("error", $error);

                if (isDiv) {
                    $div.append($error);
                } else {
                    $this.after($error);
                }
            }
        });

        if ($allErrors.length > 0) {
            $errorElems.addClass(className);
            $allErrors.slideDown(CZ.Settings.errorMessageSlideDuration);
        }

        return result;
    };

    // jQuery plugin. Hides error message under field.
    $.fn.hideError = function () {
        var $allErrors = $();
        var $errorElems = $();
        var classes = "";

        var result = this.each(function () {
            var $this = $(this);
            var $error = $this.data("error");
            var $div;
            var className;

            if ($error) {
                $div = $this.is("div") ? $this : $this.closest("div");
                className = $error.attr("class");

                if (classes.split(" ").indexOf(className) === -1) {
                    classes += " " + className;
                }

                $allErrors = $allErrors.add($error);

                $errorElems = $errorElems.add($this);
                $errorElems = $errorElems.add($div);
                $errorElems = $errorElems.add($div.children());
            }
        });

        if ($allErrors.length > 0) {
            $allErrors.slideUp(CZ.Settings.errorMessageSlideDuration).promise().done(function () {
                $allErrors.remove();
                $errorElems.removeData("error");
                $errorElems.removeClass(classes);
            });
        }

        return result;
    };
})(jQuery);
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>
(function ($) {
    /**
    * Make the element fully visible using opacity and visibility CSS rules.
    * @param  {bool} noTransition If true then CSS transition won't be used.
    */
    $.fn.visible = function (noTransition) {
        return this.each(function () {
            var $this = $(this);
            if (noTransition) {
                $this.addClass("no-transition");
            } else {
                $this.removeClass("no-transition");
            }
            $this.css({
                opacity: 1,
                visibility: "visible"
            });
        });
    };

    /**
    * Make the element fully invisible using opacity and visibility CSS rules.
    * @param  {bool} noTransition If true then CSS transition won't be used.
    */
    $.fn.invisible = function (noTransition) {
        return this.each(function () {
            var $this = $(this);
            if (noTransition) {
                $this.addClass("no-transition");
            } else {
                $this.removeClass("no-transition");
            }
            $this.css({
                opacity: 0,
                visibility: "hidden"
            });
        });
    };
})(jQuery);
/// <reference path='rinplayer.ts'/>
var CZ;
(function (CZ) {
    (function (Extensions) {
        var extensions = [];

        function mediaTypeIsExtension(mediaType) {
            return mediaType.toLowerCase().indexOf('extension-') === 0;
        }
        Extensions.mediaTypeIsExtension = mediaTypeIsExtension;

        function registerExtensions() {
            registerExtension("RIN", CZ.Extensions.RIN.getExtension, [
                "/scripts/extensions/rin-scripts/tagInk.js",
                "/scripts/extensions/rin-scripts/raphael.js",
                "/scripts/extensions/rin-scripts/rin-core-1.0.js"
            ]);
        }
        Extensions.registerExtensions = registerExtensions;

        function registerExtension(name, initializer, scripts) {
            extensions[name.toLowerCase()] = {
                "initializer": initializer,
                "scripts": scripts
            };
        }

        function activateExtension(mediaType) {
            if (!mediaTypeIsExtension(mediaType))
                return;

            var extensionName = extensionNameFromMediaType(mediaType);
            var scripts = getScriptsFromExtensionName(extensionName);
            scripts.forEach(function (script, index) {
                addScript(extensionName, script, index);
            });
        }
        Extensions.activateExtension = activateExtension;

        function getInitializer(mediaType) {
            var extensionName = extensionNameFromMediaType(mediaType);
            return extensions[extensionName.toLowerCase()].initializer;
        }
        Extensions.getInitializer = getInitializer;

        function extensionNameFromMediaType(mediaType) {
            var extensionIndex = 'extension-'.length;
            return mediaType.substring(extensionIndex, mediaType.length);
        }

        function addScript(extensionName, scriptPath, index) {
            var scriptId = "extension-" + extensionName + index;
            if (document.getElementById(scriptId))
                return;

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = scriptPath;
            script.id = scriptId;
            document.getElementsByTagName("head")[0].appendChild(script);
        }

        function getScriptsFromExtensionName(name) {
            return extensions[name.toLowerCase()].scripts;
        }
    })(CZ.Extensions || (CZ.Extensions = {}));
    var Extensions = CZ.Extensions;
})(CZ || (CZ = {}));
/// <reference path='../settings.ts'/>
/// <reference path='../common.ts'/>

var CZ;
(function (CZ) {
    (function (Extensions) {
        (function (RIN) {
            function getScript() {
                return "http://553d4a03eb844efaaf7915517c979ef4.cloudapp.net/rinjsTag/lib/rin-core-1.0.js";
            }
            RIN.getScript = getScript;

            function getExtension(vc, parent, layerid, id, contentSource, vx, vy, vw, vh, z, onload) {
                var rinDiv;
                if (!rinDiv) {
                    rinDiv = document.createElement('div');
                    rinDiv.setAttribute("id", id);
                    rinDiv.setAttribute("class", "rinPlayer");
                    rinDiv.addEventListener("mousemove", CZ.Common.preventbubble, false);
                    rinDiv.addEventListener("mousedown", CZ.Common.preventbubble, false);
                    rinDiv.addEventListener("DOMMouseScroll", CZ.Common.preventbubble, false);
                    rinDiv.addEventListener("mousewheel", CZ.Common.preventbubble, false);

                    rin.processAll(null, 'http://553d4a03eb844efaaf7915517c979ef4.cloudapp.net/rinjsTag/').then(function () {
                        var playerElement = document.getElementById(id);
                        var playerControl = rin.getPlayerControl(rinDiv);
                        if (playerControl) {
                            var deepstateUrl = playerControl.resolveDeepstateUrlFromAbsoluteUrl(window.location.href);
                            playerControl.load(contentSource);
                        }
                    });
                } else {
                    rinDiv.isAdded = false;
                }
                return new RINPlayer(vc, parent, layerid, id, contentSource, vx, vy, vw, vh, z, onload, rinDiv);
            }
            RIN.getExtension = getExtension;

            function RINPlayer(vc, parent, layerid, id, contentSource, vx, vy, vw, vh, z, onload, rinDiv) {
                this.base = CZ.VCContent.CanvasDomItem;
                this.base(vc, layerid, id, vx, vy, vw, vh, z);
                this.initializeContent(rinDiv);

                this.onRemove = function () {
                    //Handle the remove of RIN resources if any
                    var rinplayerControl = rin.getPlayerControl(rinDiv);
                    if (rinplayerControl) {
                        rinplayerControl.pause();
                        if (rinplayerControl.unload) {
                            rinplayerControl.unload();
                        }
                        rinplayerControl = null;
                    }
                    this.prototype.onRemove.call(this);
                };

                this.prototype = new CZ.VCContent.CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
            }
        })(Extensions.RIN || (Extensions.RIN = {}));
        var RIN = Extensions.RIN;
    })(CZ.Extensions || (CZ.Extensions = {}));
    var Extensions = CZ.Extensions;
})(CZ || (CZ = {}));
/// <reference path='../../scripts/dates.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>
/* TODO: implement public get/set functions for edit mode
*/
var CZ;
(function (CZ) {
    (function (UI) {
        var DatePicker = (function () {
            function DatePicker(datePicker) {
                this.datePicker = datePicker;
                // Value that represents infinity date
                this.INFINITY_VALUE = 9999;
                // Error messages
                this.WRONG_YEAR_INPUT = "Year should be a number.";
                if (!(datePicker instanceof jQuery && datePicker.is("div")))
                    throw "DatePicker parameter is invalid! It should be jQuery instance of DIV.";

                this.coordinate = 0;

                this.initialize();
            }
            /**
            * Creates datepicker based on given JQuery instance of div
            */
            DatePicker.prototype.initialize = function () {
                var _this = this;
                this.datePicker.addClass("cz-datepicker");

                this.modeSelector = $("<select class='cz-datepicker-mode cz-input'></select>");

                var optionYear = $("<option value='year'>Year</option>");
                var optionDate = $("<option value='date'>Date</option>");

                this.modeSelector.change(function (event) {
                    var mode = _this.modeSelector.find(":selected").val();
                    _this.errorMsg.text("");
                    switch (mode) {
                        case "year":
                            _this.editModeYear();
                            _this.setDate_YearMode(_this.coordinate, false);
                            break;
                        case "date":
                            _this.editModeDate();
                            _this.setDate_DateMode(_this.coordinate);
                            break;

                        case "infinite":
                            _this.editModeInfinite();
                            break;
                    }
                });

                this.modeSelector.append(optionYear);
                this.modeSelector.append(optionDate);

                this.dateContainer = $("<div class='cz-datepicker-container'></div>");
                this.errorMsg = $("<div class='cz-datepicker-errormsg'></div>");
                this.datePicker.append(this.modeSelector);
                this.datePicker.append(this.dateContainer);
                this.datePicker.append(this.errorMsg);

                // set "year" mode by default
                this.editModeYear();
                this.setDate(this.coordinate, true);
            };

            /**
            * Removes datepicker object
            */
            DatePicker.prototype.remove = function () {
                this.datePicker.empty();
                this.datePicker.removeClass("cz-datepicker");
            };

            /**
            * Adds edit mode "infinite"
            */
            DatePicker.prototype.addEditMode_Infinite = function () {
                var optionIntinite = $("<option value='infinite'>Infinite</option>");
                this.modeSelector.append(optionIntinite);
            };

            DatePicker.prototype.setCirca = function (circa)
            {
                $(this.circaSelector).find('input').prop('checked', circa);
            };

            /**
            * Sets date corresponding to given virtual coordinate
            */
            DatePicker.prototype.setDate = function (coordinate, ZeroYearConversation) {
                if (typeof ZeroYearConversation === "undefined") { ZeroYearConversation = false; }
                // invalid input
                if (!this.validateNumber(coordinate)) {
                    return false;
                }

                coordinate = Number(coordinate);
                this.coordinate = coordinate;
                var regime = CZ.Dates.convertCoordinateToYear(this.coordinate).regime;

                // set edit mode to infinite in case if coordinate is infinity
                if (this.coordinate === this.INFINITY_VALUE) {
                    this.modeSelector.find(":selected").attr("selected", "false");
                    this.modeSelector.find("option").each(function () {
                        if ($(this).val() === "infinite") {
                            $(this).attr("selected", "selected");
                            return;
                        }
                    });
                    this.editModeInfinite();
                    return;
                }

                switch (regime.toLowerCase()) {
                    case "ga":
                    case "ma":
                    case "ka":
                        this.modeSelector.find(":selected").attr("selected", "false");
                        this.modeSelector.find("option").each(function () {
                            if ($(this).val() === "year") {
                                $(this).attr("selected", "selected");
                                return;
                            }
                        });
                        this.editModeYear();
                        this.setDate_YearMode(coordinate, ZeroYearConversation);
                        break;
                    case "bce":
                    case "ce":
                        this.modeSelector.find(":selected").attr("selected", "false");
                        this.modeSelector.find("option").each(function () {
                            if ($(this).val() === "date") {
                                $(this).attr("selected", "selected");
                                return;
                            }
                        });
                        this.editModeDate();
                        this.setDate_DateMode(coordinate);
                        break;
                }
            };

            DatePicker.prototype.getCirca = function ()
            {
                var mode = this.modeSelector.find(":selected").val();
                switch (mode)
                {
                    case "year":
                    case "date":
                        return $(this.circaSelector).find('input').prop('checked');
                        break;
                    default:
                        return false;
                        break;
                }
            };

            /**
            * Returns date converted to virtual coordinate if date is valid, otherwise returns false.
            */
            DatePicker.prototype.getDate = function () {
                var mode = this.modeSelector.find(":selected").val();
                switch (mode) {
                    case "year":
                        return this.getDate_YearMode();
                        break;
                    case "date":
                        return this.getDate_DateMode();
                        break;

                    case "infinite":
                        return this.INFINITY_VALUE;
                        break;
                }
            };

            /**
            * Modify date container to match "year" edit mode
            */
            DatePicker.prototype.editModeYear = function () {
                var _this = this;
                this.dateContainer.empty();

                this.yearSelector = $("<input type='text' class='cz-datepicker-year-year cz-input'></input>");
                this.regimeSelector = $("<select class='cz-datepicker-regime cz-input'></select>");
                this.circaSelector = $('<div class="cz-datepicker-circa">Circa / Approximate: <input type="checkbox" /></label>');

                this.yearSelector.focus(function (event) {
                    _this.errorMsg.text("");
                });

                this.regimeSelector.change(function (event) {
                    _this.checkAndRemoveNonIntegerPart();
                });

                this.yearSelector.blur(function (event) {
                    if (!_this.validateNumber(_this.yearSelector.val())) {
                        _this.errorMsg.text(_this.WRONG_YEAR_INPUT);
                    }

                    _this.checkAndRemoveNonIntegerPart();
                });
                var optionGa = $("<option value='ga'>Ga</option>");
                var optionMa = $("<option value='ma'>Ma</option>");
                var optionKa = $("<option value='ka'>Ka</option>");
                var optionBCE = $("<option value='bce'>BCE</option>");
                var optionCE = $("<option value='ce'>CE</option>");

                this.regimeSelector.append(optionGa).append(optionMa).append(optionKa).append(optionBCE).append(optionCE);

                this.dateContainer.append(this.yearSelector);
                this.dateContainer.append(this.regimeSelector);
                this.dateContainer.append('<br />');
                this.dateContainer.append(this.circaSelector);
            };

            /**
            * Modify date container to match "date" edit mode
            */
            DatePicker.prototype.editModeDate = function () {
                var _this = this;
                this.dateContainer.empty();

                this.daySelector = $("<select class='cz-datepicker-day-selector cz-input'></select>");
                this.monthSelector = $("<select class='cz-datepicker-month-selector cz-input'></select>");
                this.yearSelector = $("<input type='text' class='cz-datepicker-year-date cz-input'></input>");
                this.circaSelector = $('<div class="cz-datepicker-circa">Circa / Approximate: <input type="checkbox" /></label>');

                this.yearSelector.focus(function (event) {
                    _this.errorMsg.text("");
                });

                this.yearSelector.blur(function (event) {
                    if (!_this.validateNumber(_this.yearSelector.val()))
                        _this.errorMsg.text(_this.WRONG_YEAR_INPUT);

                    _this.checkAndRemoveNonIntegerPart();
                });

                var self = this;
                this.monthSelector.change(function (event) {
                    self.daySelector.empty();

                    // update days in days select to match current month
                    var selectedIndex = self.monthSelector[0].selectedIndex;
                    for (var i = 0; i < CZ.Dates.daysInMonth[selectedIndex]; i++) {
                        var dayOption = $("<option value='" + (i + 1) + "'>" + (i + 1) + "</option>");
                        self.daySelector.append(dayOption);
                    }
                });

                for (var i = 0; i < CZ.Dates.months.length; i++) {
                    var monthOption = $("<option value='" + CZ.Dates.months[i] + "'>" + CZ.Dates.months[i] + "</option>");
                    this.monthSelector.append(monthOption);
                }

                // raise change event to initialize days select element
                self.monthSelector.trigger("change");

                this.dateContainer.append(this.monthSelector);
                this.dateContainer.append(this.daySelector);
                this.dateContainer.append(this.yearSelector);
                this.dateContainer.append('<br />');
                this.dateContainer.append(this.circaSelector);
            };

            /**
            * Modify date container to match "infinite" edit mode
            */
            DatePicker.prototype.editModeInfinite = function () {
                this.dateContainer.empty();
            };

            /**
            * If year in CE and BCE mode is not integer - remove non integral part in the box
            */
            DatePicker.prototype.checkAndRemoveNonIntegerPart = function () {
                var regime = this.regimeSelector.find(":selected").val().toLowerCase();
                var mode = this.modeSelector.find(":selected").val().toLowerCase();

                if (regime === 'ce' || regime === 'bce' || mode === 'date') {
                    this.yearSelector.val(parseFloat(this.yearSelector.val()).toFixed());
                }
            };

            /**
            * Sets year corresponding to given virtual coordinate
            */
            DatePicker.prototype.setDate_YearMode = function (coordinate, ZeroYearConversation) {
                var date = CZ.Dates.convertCoordinateToYear(coordinate);
                if ((date.regime.toLowerCase() == "bce") && (ZeroYearConversation))
                    date.year--;
                this.yearSelector.val(date.year.toString());

                // reset selected regime
                this.regimeSelector.find(":selected").attr("selected", "false");

                // select appropriate regime
                this.regimeSelector.find("option").each(function () {
                    if (this.value === date.regime.toLowerCase()) {
                        $(this).attr("selected", "selected");
                    }
                });
            };

            /**
            * Sets date corresponding to given virtual coordinate
            */
            DatePicker.prototype.setDate_DateMode = function (coordinate) {
                var date = CZ.Dates.getYMDFromCoordinate(coordinate);

                this.yearSelector.val(date.year.toString());
                var self = this;

                // set corresponding month in month select element
                this.monthSelector.find("option").each(function (index) {
                    if (this.value === CZ.Dates.months[date.month]) {
                        $(this).attr("selected", "selected");

                        // event handler of "month changed" is async. using $.promise to update days selection element as callback
                        $.when(self.monthSelector.trigger("change")).done(function () {
                            // month was set, now set corresponding day
                            self.daySelector.find("option").each(function () {
                                if (parseInt(this.value) === date.day) {
                                    $(this).attr("selected", "selected");
                                }
                            });
                        });
                    }
                });
            };

            /**
            * Returns year converted to virtual coordinate if input is valid, otherwise returns false
            */
            DatePicker.prototype.getDate_YearMode = function () {
                var year = this.yearSelector.val();
                if (!this.validateNumber(year))
                    return false;
                var regime = this.regimeSelector.find(":selected").val();

                return CZ.Dates.convertYearToCoordinate(year, regime);
            };

            /**
            * Returns date converted to virtual coordinate if input is valid, otherwise returns false
            */
            DatePicker.prototype.getDate_DateMode = function () {
                var year = this.yearSelector.val();
                if (!this.validateNumber(year))
                    return false;
                year = parseInt(year);

                var month = this.monthSelector.find(":selected").val();
                month = CZ.Dates.months.indexOf(month);
                var day = parseInt(this.daySelector.find(":selected").val());

                return CZ.Dates.getCoordinateFromYMD(year, month, day);
            };

            /**
            * Validates that given string is a non infinite number, returns false if not
            */
            DatePicker.prototype.validateNumber = function (year) {
                return !isNaN(Number(year)) && isFinite(Number(year)) && !isNaN(parseFloat(year));
            };
            return DatePicker;
        })();
        UI.DatePicker = DatePicker;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path="../../scripts/typings/jqueryui/jqueryui.d.ts" />
var CZ;
(function (CZ) {
    (function (UI) {
        

        

        

        /**
        * Base class for a listbox.
        * - container: a jQuery object with listbox's container.
        * - listBoxInfo: information about listbox's data and settings.
        * - listItemInfo: information about types of listitems.
        * - getType: a function to define type of listitems depending on their data.
        */
        var ListBoxBase = (function () {
            function ListBoxBase(container, listBoxInfo, listItemsInfo, getType) {
                if (typeof getType === "undefined") { getType = function (context) {
                    return "default";
                }; }
                if (!(container instanceof jQuery)) {
                    throw "Container parameter is invalid! It should be jQuery instance.";
                }

                this.container = container;
                this.listItemsInfo = listItemsInfo;
                this.getType = getType;
                this.items = [];

                // Set default constructor.
                if (this.listItemsInfo.default) {
                    this.listItemsInfo.default.ctor = this.listItemsInfo.default.ctor || ListItemBase;
                }

                for (var i = 0, context = listBoxInfo.context, len = context.length; i < len; ++i) {
                    this.add(context[i]);
                }

                // Setup default handlers
                this.itemDblClickHandler = function (item, idx) {
                };
                this.itemRemoveHandler = function (item, idx) {
                };
                this.itemMoveHandler = function (item, idx1, idx2) {
                };

                // Apply jQueryUI sortable widget.
                var self = this;
                if (listBoxInfo.sortableSettings) {
                    var origStart = listBoxInfo.sortableSettings.start;
                    var origStop = listBoxInfo.sortableSettings.stop;
                    $.extend(listBoxInfo.sortableSettings, {
                        start: function (event, ui) {
                            ui.item.startPos = ui.item.index();
                            if (origStart)
                                origStart(event, ui);
                        },
                        stop: function (event, ui) {
                            ui.item.stopPos = ui.item.index();
                            var item = self.items.splice(ui.item.startPos, 1)[0];
                            self.items.splice(ui.item.stopPos, 0, item);
                            self.itemMoveHandler(ui.item, ui.item.startPos, ui.item.stopPos);
                            if (origStop)
                                origStop(event, ui);
                        }
                    });
                    this.container.sortable(listBoxInfo.sortableSettings);
                }
            }
            /**
            * Produces listitem from data and add it to a listbox.
            * - context: a data to display in a listitem.
            */
            ListBoxBase.prototype.add = function (context) {
                var type = this.getType(context);
                var typeInfo = this.listItemsInfo[type];

                var container = typeInfo.container.clone();
                var uiMap = typeInfo.uiMap;
                var ctor = typeInfo.ctor;

                var item = new ctor(this, container, uiMap, context);
                this.items.push(item);

                return item;
            };

            /**
            * Removes listitem from a listbox.
            */
            ListBoxBase.prototype.remove = function (item) {
                var i = this.items.indexOf(item);

                if (i !== -1) {
                    item.container.remove();
                    this.items.splice(i, 1);
                    this.itemRemoveHandler(item, i);
                }
            };

            /**
            * Clears all listitems from a listbox.
            */
            ListBoxBase.prototype.clear = function () {
                for (var i = 0, len = this.items.length; i < len; ++i) {
                    var item = this.items[i];
                    item.container.remove();
                }
                this.items.length = 0;
            };

            /**
            * Selects an element of the listbox
            */
            ListBoxBase.prototype.selectItem = function (item) {
                var i = this.items.indexOf(item);

                if (i !== -1) {
                    this.itemDblClickHandler(item, i);
                }
            };

            /**
            * Setup listitem clicked handler
            */
            ListBoxBase.prototype.itemDblClick = function (handler) {
                this.itemDblClickHandler = handler;
            };

            /**
            * Setup listitem removed handler
            */
            ListBoxBase.prototype.itemRemove = function (handler) {
                this.itemRemoveHandler = handler;
            };

            /**
            * Setup listitem move handler
            */
            ListBoxBase.prototype.itemMove = function (handler) {
                this.itemMoveHandler = handler;
            };
            return ListBoxBase;
        })();
        UI.ListBoxBase = ListBoxBase;

        /**
        * Base class for a listitem.
        * - parent: parent listbox.
        * - container: a jQuery object with listitem's container.
        * - uiMap: uiMap: a set of CSS selectors for elements in HTML code of listitem's container.
        * - context: a data to display in a listitem.
        */
        var ListItemBase = (function () {
            function ListItemBase(parent, container, uiMap, context) {
                var _this = this;
                if (!(container instanceof jQuery)) {
                    throw "Container parameter is invalid! It should be jQuery instance.";
                }

                this.parent = parent;
                this.container = container;
                this.data = context;

                // Setup click on a listitem
                this.container.dblclick(function (_) {
                    return _this.parent.selectItem(_this);
                });

                // Setup close button of a listitem.
                this.closeButton = this.container.find(uiMap.closeButton);

                /*if (!this.closeButton.length) {
                throw "Close button is not found in a given UI map.";
                }*/
                // Commented by Dmitry Voytsekhovskiy - The close button is not a mandatory for an item.
                if (this.closeButton.length) {
                    this.closeButton.click(function (event) {
                        return _this.close();
                    });
                }

                // Append listitems container to a listbox.
                this.parent.container.append(this.container);
            }
            /**
            * Closes an item and removes it from a listbox.
            */
            ListItemBase.prototype.close = function () {
                this.parent.remove(this);
            };
            return ListItemBase;
        })();
        UI.ListItemBase = ListItemBase;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormBase = (function () {
            function FormBase(container, formInfo) {
                var _this = this;
                if (!(container instanceof jQuery && container.is("div"))) {
                    throw "Container parameter is invalid! It should be jQuery instance of DIV.";
                }
                this.isFormVisible = false;
                this.container = container;
                this.prevForm = formInfo.prevForm;
                this.activationSource = formInfo.activationSource;
                this.navButton = this.container.find(formInfo.navButton);
                this.closeButton = this.container.find(formInfo.closeButton);
                this.titleTextblock = this.container.find(formInfo.titleTextblock);
                this.contentContainer = this.container.find(formInfo.contentContainer);

                this.container.data("form", this);

                if (this.prevForm) {
                    this.navButton.show();
                } else {
                    this.navButton.hide();
                }

                this.navButton.off();
                this.closeButton.off();

                this.navButton.click(function (event) {
                    _this.back();
                });

                this.closeButton.click(function (event) {
                    _this.close();
                });
            }
            FormBase.prototype.show = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                this.isFormVisible = true;
                this.container.show.apply(this.container, args);
            };

            FormBase.prototype.close = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                this.isFormVisible = false;
                this.container.data("form", undefined);
                this.container.hide.apply(this.container, args);
                this.container.trigger("close");
            };

            FormBase.prototype.back = function () {
                this.close();
                this.prevForm.show();
            };
            return FormBase;
        })();
        UI.FormBase = FormBase;

        var FormUpdateEntity = (function (_super) {
            __extends(FormUpdateEntity, _super);
            function FormUpdateEntity(container, formInfo) {
                var _this = this;
                _super.call(this, container, formInfo);

                this.saveButton = this.container.find(formInfo.saveButton);

                this.container.keypress(function (event) {
                    // trigger click on save button if ENTER was pressed
                    if (event.keyCode === 13) {
                        _this.saveButton.trigger("click");
                    }
                });
            }
            return FormUpdateEntity;
        })(FormBase);
        UI.FormUpdateEntity = FormUpdateEntity;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='../../scripts/media.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>
var CZ;
(function (CZ) {
    (function (UI) {
        var MediaList = (function () {
            function MediaList(container, mediaPickers, context, form) {
                this.container = container;
                this.mediaPickers = mediaPickers;
                this.context = context;
                this.form = form;

                this.container.addClass("cz-medialist");
                this.fillListOfLinks();
            }
            MediaList.prototype.fillListOfLinks = function () {
                var _this = this;
                // Sort mediaPickers keys by 'order' property.
                var sortedMediaPickersKeys = Object.keys(this.mediaPickers).sort(function (key1, key2) {
                    return _this.mediaPickers[key1].order - _this.mediaPickers[key2].order;
                });

                // Construct list of links dynamically.
                sortedMediaPickersKeys.forEach(function (key) {
                    if (_this.mediaPickers.hasOwnProperty(key)) {
                        var mp = _this.mediaPickers[key];
                        var link = _this.createMediaPickerLink(mp);
                        _this.container.append(link);
                    }
                });
            };

            MediaList.prototype.createMediaPickerLink = function (mp) {
                var _this = this;
                var container = $("<div></div>", {
                    class: "cz-medialist-item",
                    title: mp.title,
                    "media-picker": mp.title
                });

                var icon = $("<img></img>", {
                    class: "cz-medialist-item-icon",
                    src: mp.iconUrl
                });

                container.click(function (event) {
                    mp.setup(_this.context, _this.form);
                });

                container.append(icon);
                return container;
            };

            MediaList.prototype.remove = function () {
                this.container.empty();
                this.container.removeClass("cz-medialist");
            };
            return MediaList;
        })();
        UI.MediaList = MediaList;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='../../scripts/cz.ts'/>
/// <reference path='../../scripts/media.ts'/>
/// <reference path='../../ui/controls/formbase.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>
var CZ;
(function (CZ) {
    (function (Media) {
        var BingMediaPicker = (function () {
            function BingMediaPicker(container, context, formHost) {
                this.container = container;
                this.contentItem = context;

                this.editContentItemForm = formHost ? formHost : CZ.HomePageViewModel.getFormById("#auth-edit-contentitem-form");
                this.searchTextbox = this.container.find(".cz-bing-search-input");
                this.mediaTypeRadioButtons = this.container.find(":radio");
                this.progressBar = this.container.find(".cz-form-progress-bar");
                this.searchResultsBox = this.container.find(".cz-bing-search-results");
                this.searchButton = this.container.find(".cz-bing-search-button");

                this.initialize();
            }
            BingMediaPicker.setup = function (context, formHost) {
                var mediaPickerContainer = CZ.Media.mediaPickersViews["bing"];
                var mediaPicker = new BingMediaPicker(mediaPickerContainer, context, formHost);
                var formContainer = $(".cz-form-bing-mediapicker");

                // Create container for Media Picker's form if it doesn't exist.
                if (formContainer.length === 0) {
                    formContainer = $("#mediapicker-form").clone().removeAttr("id").addClass("cz-form-bing-mediapicker").appendTo($("#content"));
                }

                // Create form for Media Picker and append Media Picker to it.
                var form = new CZ.UI.FormMediaPicker(formContainer, mediaPickerContainer, "Import from Bing", {
                    activationSource: $(),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    contentContainer: ".cz-form-content"
                });

                $(form).on("showcompleted", function (event) {
                    mediaPicker.searchTextbox.focus();
                });

                $(mediaPicker).on("resultclick", function (event) {
                    form.close();
                });

                // Align search results on window resize.
                var onWindowResize = function () {
                    return mediaPicker.onWindowResize();
                };

                $(window).on("resize", onWindowResize);

                $(form).on("closecompleted", function (event) {
                    $(window).off("resize", onWindowResize);
                });

                form.show();
            };

            BingMediaPicker.prototype.initialize = function () {
                var _this = this;
                this.progressBar.css("opacity", 0);
                this.searchTextbox.off();
                this.searchButton.off();
                $(this).off();

                this.searchTextbox.keypress(function (event) {
                    var code = event.which || event.keyCode;

                    // If Enter button is pressed.
                    if (code === 13) {
                        event.preventDefault();
                        _this.search();
                    }
                });

                this.searchButton.click(function (event) {
                    _this.search();
                });

                $(this).on("resultclick", function (event, mediaInfo) {
                    _this.onSearchResultClick(mediaInfo);
                });
            };

            BingMediaPicker.prototype.onSearchResultClick = function (mediaInfo) {
                $.extend(this.contentItem, mediaInfo);
                this.editContentItemForm.updateMediaInfo();
            };

            BingMediaPicker.prototype.getMediaType = function () {
                return this.mediaTypeRadioButtons.filter(":checked").val();
            };

            BingMediaPicker.prototype.convertResultToMediaInfo = function (result, mediaType) {
                var mediaInfoMap = {
                    image: {
                        uri: result.MediaUrl,
                        mediaType: mediaType,
                        mediaSource: result.SourceUrl,
                        attribution: result.SourceUrl
                    },
                    video: {
                        uri: result.MediaUrl,
                        mediaType: mediaType,
                        mediaSource: result.MediaUrl,
                        attribution: result.MediaUrl
                    },
                    pdf: {
                        uri: result.Url,
                        mediaType: mediaType,
                        mediaSource: result.Url,
                        attribution: result.Url
                    }
                };

                return mediaInfoMap[mediaType];
            };

            BingMediaPicker.prototype.search = function () {
                var query = this.searchTextbox.val();
                var mediaType = this.getMediaType();

                if (query.trim() === "") {
                    return;
                }

                _gaq.push
                ([
                    '_trackEvent',
                    'Search',
                    'Bing Search',
                    mediaType
                ]);
                this.searchResultsBox.empty();
                this.showProgressBar();

                switch (mediaType) {
                    case "image":
                        this.searchImages(query);
                        break;
                    case "video":
                        this.searchVideos(query);
                        break;
                    case "document":
                        this.searchDocuments(query);
                        break;
                }
            };

            BingMediaPicker.prototype.searchImages = function (query) {
                var _this = this;
                CZ.Service.getBingImages(query).done(function (response) {
                    _this.hideProgressBar();

                    if (response.d.length === 0) {
                        _this.showNoResults();
                        return;
                    }

                    for (var i = 0, len = response.d.length; i < len; ++i) {
                        var result = response.d[i];
                        var resultContainer = _this.createImageResult(result);
                        _this.searchResultsBox.append(resultContainer);
                        _this.alignThumbnails();
                    }
                }).fail(function (error) {
                    _this.hideProgressBar();
                    _this.showErrorMessage(error);
                });
            };

            BingMediaPicker.prototype.searchVideos = function (query) {
                var _this = this;
                // NOTE: Only YouTube and Vimeo videos are supported.
                query += " (+site:youtube.com OR +site:vimeo.com)";
                CZ.Service.getBingVideos(query).done(function (response) {
                    _this.hideProgressBar();

                    if (response.d.length === 0) {
                        _this.showNoResults();
                        return;
                    }

                    for (var i = 0, len = response.d.length; i < len; ++i) {
                        var result = response.d[i];
                        var resultContainer = _this.createVideoResult(result);
                        _this.searchResultsBox.append(resultContainer);
                        _this.alignThumbnails();
                    }
                }).fail(function (error) {
                    _this.hideProgressBar();
                    _this.showErrorMessage(error);
                });
            };

            BingMediaPicker.prototype.searchDocuments = function (query) {
                var _this = this;
                // NOTE: Currently only PDF is supported.
                CZ.Service.getBingDocuments(query, "pdf").done(function (response) {
                    _this.hideProgressBar();

                    if (response.d.length === 0) {
                        _this.showNoResults();
                        return;
                    }

                    for (var i = 0, len = response.d.length; i < len; ++i) {
                        var result = response.d[i];
                        var resultContainer = _this.createDocumentResult(result);
                        _this.searchResultsBox.append(resultContainer);
                    }
                }).fail(function (error) {
                    _this.hideProgressBar();
                    _this.showErrorMessage(error);
                });
            };

            BingMediaPicker.prototype.createImageResult = function (result) {
                var _this = this;
                // thumbnail size
                var rectangle = this.fitThumbnailToContainer(result.Thumbnail.Width / result.Thumbnail.Height, CZ.Settings.mediapickerImageThumbnailMaxWidth, CZ.Settings.mediapickerImageThumbnailMaxHeight);

                // vertical offset to align image vertically
                var imageOffset = (CZ.Settings.mediapickerImageThumbnailMaxHeight - rectangle.height) / 2;

                var container = $("<div></div>", {
                    class: "cz-bing-result-container",
                    width: rectangle.width,
                    "data-actual-width": rectangle.width
                });

                var title = $("<div></div>", {
                    class: "cz-bing-result-title cz-darkgray",
                    text: result.Title,
                    title: result.Title
                });

                var size = $("<div></div>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.Width + "x" + result.Height + " - " + Math.round(result.FileSize / 8 / 1024) + " KB"
                });

                var url = $("<a></a>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.DisplayUrl,
                    href: result.MediaUrl,
                    title: result.DisplayUrl,
                    "media-source": result.SourceUrl,
                    target: "_blank"
                });

                var thumbnailContainer = $("<div></div>", {
                    width: "100%",
                    height: CZ.Settings.mediapickerImageThumbnailMaxHeight
                });

                var thumbnail = $("<img></img>", {
                    class: "cz-bing-result-thumbnail",
                    src: result.Thumbnail.MediaUrl,
                    height: rectangle.height,
                    width: "100%"
                });
                thumbnail.css("padding-top", imageOffset + "px");

                thumbnailContainer.add(title).add(size).click(function (event) {
                    $(_this).trigger("resultclick", _this.convertResultToMediaInfo(result, "image"));
                });

                thumbnailContainer.append(thumbnail);

                return container.append(thumbnailContainer).append(title).append(size).append(url);
            };

            BingMediaPicker.prototype.createVideoResult = function (result) {
                var _this = this;
                // Set default thumbnail if there is no any.
                result.Thumbnail = result.Thumbnail || this.createDefaultThumbnail();

                // thumbnail size
                var rectangle = this.fitThumbnailToContainer(result.Thumbnail.Width / result.Thumbnail.Height, CZ.Settings.mediapickerVideoThumbnailMaxWidth, CZ.Settings.mediapickerVideoThumbnailMaxHeight);

                // vertical offset to align image vertically
                var imageOffset = (CZ.Settings.mediapickerVideoThumbnailMaxHeight - rectangle.height) / 2;

                var container = $("<div></div>", {
                    class: "cz-bing-result-container",
                    width: rectangle.width,
                    "data-actual-width": rectangle.width
                });

                var title = $("<div></div>", {
                    class: "cz-bing-result-title cz-darkgray",
                    text: result.Title,
                    title: result.Title
                });

                var size = $("<div></div>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: "Duration - " + (result.RunTime / 1000) + " seconds"
                });

                var url = $("<a></a>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.MediaUrl,
                    href: result.MediaUrl,
                    title: result.MediaUrl,
                    target: "_blank"
                });

                var thumbnailContainer = $("<div></div>", {
                    width: "100%",
                    height: CZ.Settings.mediapickerVideoThumbnailMaxHeight
                });

                var thumbnail = $("<img></img>", {
                    class: "cz-bing-result-thumbnail",
                    src: result.Thumbnail.MediaUrl,
                    height: rectangle.height,
                    width: "100%"
                });
                thumbnail.css("padding-top", imageOffset + "px");

                thumbnailContainer.add(title).add(size).click(function (event) {
                    $(_this).trigger("resultclick", _this.convertResultToMediaInfo(result, "video"));
                });

                thumbnailContainer.append(thumbnail);

                return container.append(thumbnailContainer).append(title).append(size).append(url);
            };

            BingMediaPicker.prototype.createDocumentResult = function (result) {
                var _this = this;
                var container = $("<div></div>", {
                    class: "cz-bing-result-container",
                    width: 300
                });

                var title = $("<div></div>", {
                    class: "cz-bing-result-title cz-darkgray",
                    text: result.Title,
                    title: result.Title
                });

                var descr = $("<div></div>", {
                    class: "cz-bing-result-doc-description cz-lightgray",
                    height: 100,
                    text: result.Description
                });

                var url = $("<a></a>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.DisplayUrl,
                    href: result.Url,
                    title: result.DisplayUrl,
                    target: "_blank"
                });

                // NOTE: Currently only PDF is supported.
                title.add(descr).click(function (event) {
                    $(_this).trigger("resultclick", _this.convertResultToMediaInfo(result, "pdf"));
                });

                return container.append(title).append(descr).append(url);
            };

            BingMediaPicker.prototype.showProgressBar = function () {
                this.progressBar.animate({
                    opacity: 1
                });
            };

            BingMediaPicker.prototype.hideProgressBar = function () {
                this.progressBar.animate({
                    opacity: 0
                });
            };

            BingMediaPicker.prototype.showNoResults = function () {
                this.searchResultsBox.text("No results.");
            };

            BingMediaPicker.prototype.createDefaultThumbnail = function () {
                return {
                    ContentType: "image/png",
                    FileSize: 4638,
                    Width: 500,
                    Height: 500,
                    MediaUrl: "/images/Temp-Thumbnail2.png"
                };
            };

            BingMediaPicker.prototype.showErrorMessage = function (error) {
                var errorMessagesByStatus = {
                    "400": "The search request is formed badly. Please contact developers about the error.",
                    "403": "Please sign in to ChronoZoom to use Bing search.",
                    "500": "We are sorry, but something went wrong. Please try again later."
                };

                var errorMessage = $("<span></span>", {
                    class: "cz-red",
                    text: errorMessagesByStatus[error.status]
                });

                this.searchResultsBox.append(errorMessage);
            };

            BingMediaPicker.prototype.onWindowResize = function () {
                this.alignThumbnails();
            };

            BingMediaPicker.prototype.alignThumbnails = function () {
                var container = this.searchResultsBox;
                var elements = container.children();

                if (elements.length === 0) {
                    return;
                }

                var rowWidth = container.width();
                var currentRow = {
                    elements: [],
                    width: 0
                };

                for (var i = 0, len = elements.length; i < len; i++) {
                    var curElement = $(elements[i]);
                    var curElementActualWidth = +curElement.attr("data-actual-width");
                    var curElementOuterWidth = curElement.outerWidth(true);
                    var curElementInnerWidth = curElement.innerWidth();

                    // next thumbnail exceed row width
                    if (rowWidth < currentRow.width + curElementActualWidth) {
                        var delta = rowWidth - currentRow.width;
                        for (var j = 0, rowLen = currentRow.elements.length; j < rowLen; j++) {
                            var rowElement = currentRow.elements[j];
                            var rowElementActualWidth = +rowElement.attr("data-actual-width");
                            rowElement.width(rowElementActualWidth + delta / rowLen);
                        }
                        currentRow.elements = [];
                        currentRow.elements.push(curElement);

                        // content width + margin + padding + border width
                        currentRow.width = Math.ceil(curElementActualWidth + curElementOuterWidth - curElementInnerWidth);
                    } else {
                        currentRow.elements.push(curElement);

                        // content width + margin + padding + border width
                        currentRow.width += Math.ceil(curElementActualWidth + curElementOuterWidth - curElementInnerWidth);
                    }
                }
            };

            BingMediaPicker.prototype.fitThumbnailToContainer = function (aspectRatio, maxWidth, maxHeight) {
                var maxAspectRatio = maxWidth / maxHeight;
                var output = {
                    width: maxHeight * aspectRatio,
                    height: maxHeight
                };

                // doesn't fit in default rectangle
                if (aspectRatio > maxAspectRatio) {
                    output.width = maxWidth;
                    output.height = maxWidth / aspectRatio;
                }

                return output;
            };
            return BingMediaPicker;
        })();
        Media.BingMediaPicker = BingMediaPicker;
    })(CZ.Media || (CZ.Media = {}));
    var Media = CZ.Media;
})(CZ || (CZ = {}));
﻿/// <reference path='../../scripts/cz.ts'/>
/// <reference path='../../scripts/media.ts'/>
/// <reference path='../../ui/controls/formbase.ts'/>
/// <reference path='../../scripts/settings.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>
var CZ;
(function (CZ) {
    (function (Media) {
        (function (SkyDriveMediaPicker) {
            var editContentItemForm;
            var contentItem;
            SkyDriveMediaPicker.filePicker;
            SkyDriveMediaPicker.filePickerIframe;
            SkyDriveMediaPicker.logoutButton;
            SkyDriveMediaPicker.isEnabled;
            SkyDriveMediaPicker.helperText;
            var mediaType;
            var tempSource;

            function setup(context, formHost) {
                contentItem = context;
                editContentItemForm = formHost ? formHost : CZ.HomePageViewModel.getFormById("#auth-edit-contentitem-form");

                SkyDriveMediaPicker.logoutButton = $("<button></button>", {
                    text: "Logout",
                    class: "cz-skydrive-logout-button",
                    click: onLogout
                });

                SkyDriveMediaPicker.helperText = $("<label></label>", {
                    text: "Selected items will be automatically shared",
                    class: "cz-skydrive-help-text"
                });

                SkyDriveMediaPicker.filePicker = showFilePicker().then(onFilePick, onError);
            }
            SkyDriveMediaPicker.setup = setup;

            /**
            * Shows file picker's dialog.
            * @return {Promise} File picker's promise.
            */
            function showFilePicker() {
                watchFilePicker(onFilePickerLoad);
                return WL.fileDialog({
                    mode: "open",
                    select: "single"
                });
            }

            /**
            * Gets embedded HTML code of picked file and removes logout button.
            * @param  {Object} response SkyDrive's response.
            */
            function onFilePick(response) {
                onFilePickerClose();
                getEmbed(response).then(onContentReceive, onError);
            }

            /**
            * Gets embedded HTML code of picked file.
            * @param  {Object}  response SkyDrive's response.
            * @return {Promise}          Request's promise.
            */
            function getEmbed(response) {
                switch (response.data.files[0].type) {
                    case "photo":
                        mediaType = "skydrive-image";
                        break;
                    default:
                        mediaType = "skydrive-document";
                        break;
                }

                tempSource = response.data.files[0].source;
                return WL.api({
                    path: response.data.files[0].id + "/embed",
                    method: "GET"
                });
            }

            /**
            * Extracts URL of file from response and updates content item.
            * @param  {Object} response SkyDrive's response.
            */
            function onContentReceive(response) {
                var src = response.embed_html.match(/src=\"(.*?)\"/i)[1];

                var uri = src;

                if (mediaType === "skydrive-image") {
                    //var width = parseFloat(response.embed_html.match(/width="[0-9]+"/)[0].match(/[0-9]+/)[0]);
                    //var height = parseFloat(response.embed_html.match(/height="[0-9]+"/)[0].match(/[0-9]+/)[0]);
                    //uri += ' ' + width + ' ' + height;

                    // convert embed uri into download uri
                    var qs = uri.split('?')[1].split('&');
                    var pair, resid, authkey;

                    qs.forEach(function (item)
                    {
                        pair = item.split('=');
                        if (pair.length === 2 && pair[0] === 'resid'  ) resid   = pair[1];
                        if (pair.length === 2 && pair[0] === 'authkey') authkey = pair[1];
                    });
                    uri = 'https://onedrive.live.com/download?resid=' + resid + '&authkey=' + authkey;
                }

                var mediaInfo = {
                    uri: uri,
                    mediaType: mediaType,
                    mediaSource: src,
                    attribution: src,
                    tempSource: tempSource
                };

                $.extend(contentItem, mediaInfo);
                editContentItemForm.updateMediaInfo();
            }

            /**
            * Shows error of SkyDrive in console.
            * If a user cancelled file picker or clicked on logout button then remove logout button.
            */
            function onError(response) {
                var error = response.error;
                if (error.code === "user_canceled" || error.code === "request_canceled") {
                    onFilePickerClose();
                } else {
                    console.log(error.message);
                }
            }

            /**
            * Logout and closes file picker and opens login dialog.
            */
            function onLogout() {
                if (window.confirm("Are you sure want to logout from Skydrive? All your unsaved changes will be lost.")) {
                    SkyDriveMediaPicker.logoutButton.hide();
                    SkyDriveMediaPicker.helperText.hide();
                    SkyDriveMediaPicker.filePicker.cancel();
                    WL.logout();

                    // send response to login.live.com/oatuh20_logout.srf to logout from Skydrive
                    // More info: http://social.msdn.microsoft.com/Forums/live/en-US/4fd9a484-54d7-4c59-91c4-081f4deee2c7/how-to-sign-out-by-rest-api
                    window.location.assign("https://login.live.com/oauth20_logout.srf?client_id=" + CZ.Settings.WLAPIClientID + "&redirect_uri=" + window.location.toString());
                }
            }

            /**
            * Waits file picker to appear in DOM and fires a callback.
            * @param  {function} callback A callback to fire after file picker appears in DOM.
            */
            function watchFilePicker(callback) {
                SkyDriveMediaPicker.filePickerIframe = $("iframe[sutra=picker]");
                if (SkyDriveMediaPicker.filePickerIframe.length > 0) {
                    callback();
                } else {
                    setTimeout(watchFilePicker, 50, callback);
                }
            }

            /**
            * Initializes and shows file picker with fade-in animation on load.
            */
            function onFilePickerLoad() {
                // Append logout button to file picker.
                SkyDriveMediaPicker.logoutButton.appendTo("body");

                SkyDriveMediaPicker.helperText.appendTo("body");

                $(window).on("resize", onWindowResize);

                SkyDriveMediaPicker.filePickerIframe.load(function () {
                    onWindowResize();
                    SkyDriveMediaPicker.filePickerIframe.animate({
                        opacity: 1
                    });
                    SkyDriveMediaPicker.logoutButton.animate({
                        opacity: 1
                    });
                    SkyDriveMediaPicker.helperText.animate({
                        opacity: 1
                    });
                });
            }

            /**
            * Finalizes file picker.
            */
            function onFilePickerClose() {
                SkyDriveMediaPicker.logoutButton.remove();
                SkyDriveMediaPicker.helperText.remove();
                $(window).off("resize", onWindowResize);
            }

            /**
            * Adjusts position of logout button according to file picker's position.
            */
            function onWindowResize() {
                // Source: CSS from SkyDrive.
                var skyDriveFooterHeight = 56;
                var iframeOffset = SkyDriveMediaPicker.filePickerIframe.offset();
                var iframeHeight = SkyDriveMediaPicker.filePickerIframe.outerHeight(true);
                var buttonLeftMargin = parseInt(SkyDriveMediaPicker.logoutButton.css("margin-left"), 10);
                var buttonTopMargin = parseInt(SkyDriveMediaPicker.logoutButton.css("margin-top"), 10);

                SkyDriveMediaPicker.logoutButton.offset({
                    top: iframeOffset.top + iframeHeight - skyDriveFooterHeight + buttonTopMargin,
                    left: iframeOffset.left + buttonLeftMargin
                });
                SkyDriveMediaPicker.helperText.offset({
                    top: iframeOffset.top + iframeHeight - skyDriveFooterHeight + buttonTopMargin + 1,
                    left: iframeOffset.left + buttonLeftMargin + 90
                });
            }
        })(Media.SkyDriveMediaPicker || (Media.SkyDriveMediaPicker = {}));
        var SkyDriveMediaPicker = Media.SkyDriveMediaPicker;
    })(CZ.Media || (CZ.Media = {}));
    var Media = CZ.Media;
})(CZ || (CZ = {}));
/// <reference path="../scripts/authoring.ts" />
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../ui/controls/listboxbase.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var ContentItemListBox = (function (_super) {
            __extends(ContentItemListBox, _super);
            function ContentItemListBox(container, listItemContainer, contentItems) {
                var self = this;
                var listBoxInfo = {
                    context: contentItems,
                    sortableSettings: {
                        forcePlaceholderSize: true,
                        cursor: "move",
                        placeholder: "cz-listbox-placeholder",
                        revert: 100,
                        opacity: 0.75,
                        tolerance: "pointer",
                        scroll: false,
                        start: function (event, ui) {
                            ui.placeholder.height(ui.item.height());
                        },
                        stop: function (event, ui) {
                            for (var i = 0; i < self.items.length; i++)
                                if (self.items[i].data)
                                    self.items[i].data.order = i;
                        }
                    }
                };

                var listItemsInfo = {
                    default: {
                        container: listItemContainer,
                        uiMap: {
                            closeButton: ".cz-listitem-close-btn",
                            iconImg: ".cz-contentitem-listitem-icon > img",
                            titleTextblock: ".cz-contentitem-listitem-title",
                            descrTextblock: ".cz-contentitem-listitem-descr"
                        }
                    }
                };

                listItemsInfo.default.ctor = ContentItemListItem;
                _super.call(this, container, listBoxInfo, listItemsInfo);
            }
            ContentItemListBox.prototype.remove = function (item) {
                for (var i = this.items.indexOf(item) + 1; i < this.items.length; i++)
                    if (this.items[i].data && this.items[i].data.order)
                        this.items[i].data.order--;

                _super.prototype.remove.call(this, item);
            };
            return ContentItemListBox;
        })(UI.ListBoxBase);
        UI.ContentItemListBox = ContentItemListBox;

        var ContentItemListItem = (function (_super) {
            __extends(ContentItemListItem, _super);
            function ContentItemListItem(parent, container, uiMap, context) {
                var _this = this;
                _super.call(this, parent, container, uiMap, context);

                this.iconImg = this.container.find(uiMap.iconImg);
                this.titleTextblock = this.container.find(uiMap.titleTextblock);
                this.descrTextblock = this.container.find(uiMap.descrTextblock);

                this.iconImg.attr("onerror", "this.src='/images/Temp-Thumbnail2.png';");
                this.iconImg.attr("src", this.data.uri);
                this.titleTextblock.text(this.data.title);
                this.descrTextblock.text(this.data.description);

                this.closeButton.off();
                this.closeButton.click(function () {
                    if (CZ.Authoring.mode === "createExhibit") {
                        _super.prototype.close.call(_this);
                    } else if (CZ.Authoring.mode === "editExhibit") {
                        if (_this.parent.items.length > 1) {
                            _super.prototype.close.call(_this);
                        }
                    }
                });
            }
            return ContentItemListItem;
        })(UI.ListItemBase);
        UI.ContentItemListItem = ContentItemListItem;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditTimeline = (function (_super) {
            __extends(FormEditTimeline, _super);
            // We only need to add additional initialization in constructor.
            function FormEditTimeline(container, formInfo) {
                var _this = this;
                _super.call(this, container, formInfo);

                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.startDate = new CZ.UI.DatePicker(container.find(formInfo.startDate));
                this.endDate = new CZ.UI.DatePicker(container.find(formInfo.endDate));
                this.mediaListContainer = container.find(formInfo.mediaListContainer);
                this.backgroundUrl = container.find(formInfo.backgroundUrl);
                this.titleInput = container.find(formInfo.titleInput);
                this.errorMessage = container.find(formInfo.errorMessage);

                this.timeline = formInfo.context;

                this.saveButton.off();
                this.deleteButton.off();

                this.titleInput.focus(function () {
                    _this.titleInput.hideError();
                });

                this.initialize();
            }
            FormEditTimeline.prototype.initialize = function () {
                var _this = this;

                this.mediaInput = {};
                this.mediaList = new CZ.UI.MediaList(this.mediaListContainer, CZ.Media.mediaPickers, this.mediaInput, this);
                this.mediaList.container.find("[title='skydrive']").hide(); // Background Images doesn't support iframes.

                this.saveButton.prop('disabled', false);
                if (CZ.Authoring.mode === "createTimeline") {
                    this.deleteButton.hide();
                    this.titleTextblock.text("Create Timeline");
                    this.saveButton.text("Create Timeline");
                } else if (CZ.Authoring.mode === "editTimeline") {
                    this.deleteButton.show();
                    this.titleTextblock.text("Edit Timeline");
                    this.saveButton.text("Update Timeline");
                } else if (CZ.Authoring.mode === "createRootTimeline") {
                    this.deleteButton.hide();
                    this.closeButton.hide();
                    this.titleTextblock.text("Create Root Timeline");
                    this.saveButton.text("Create Timeline");
                } else {
                    console.log("Unexpected authoring mode in timeline form.");
                    this.close();
                }

                this.isCancel = true;
                this.endDate.addEditMode_Infinite();

                this.titleInput.val(this.timeline.title);
                this.startDate.setDate(this.timeline.x, true);
                this.backgroundUrl.val(this.timeline.backgroundUrl || "");

                if (this.timeline.endDate === 9999) {
                    this.endDate.setDate(this.timeline.endDate, true);
                } else {
                    this.endDate.setDate(this.timeline.x + this.timeline.width, true);
                }

                $(_this.startDate.circaSelector).find('input').prop('checked', this.timeline.FromIsCirca);
                $(_this.endDate.circaSelector  ).find('input').prop('checked', this.timeline.ToIsCirca);

                this.saveButton.click(function () {
                    _this.errorMessage.empty();
                    var isDataValid = false;
                    var backgroundImage;
                    var backgroundUrl = _this.backgroundUrl.val().trim();
                    isDataValid = CZ.Authoring.validateTimelineData(_this.startDate.getDate(), _this.endDate.getDate(), _this.titleInput.val());

                    // Other cases are covered by datepicker
                    if (!CZ.Authoring.isNotEmpty(_this.titleInput.val())) {
                        _this.titleInput.showError("Title cannot be empty");
                    }

                    if (!CZ.Authoring.isIntervalPositive(_this.startDate.getDate(), _this.endDate.getDate())) {
                        _this.errorMessage.text('Time interval cannot be less than one day');
                    }

                    function onDataValid () {
                        _this.errorMessage.empty();
                        var self = _this;
                        var aspectRatio = backgroundImage ? backgroundImage.width / backgroundImage.height : null;
                        var isAspectRatioChanged = aspectRatio !== _this.timeline.aspectRatio;

                        _this.timeline.FromIsCirca  = $(_this.startDate.circaSelector).find('input').is(':checked');
                        _this.timeline.ToIsCirca    = $(_this.endDate.circaSelector  ).find('input').is(':checked');

                        _this.saveButton.prop('disabled', true);
                        CZ.Authoring.updateTimeline(_this.timeline, {
                            title: _this.titleInput.val(),
                            start: _this.startDate.getDate(),
                            end: _this.endDate.getDate(),
                            backgroundUrl: backgroundUrl,
                            aspectRatio: aspectRatio
                        }).then(function () {
                            self.isCancel = false;
                            self.close();

                            // If aspect ratio has changed, then we need to redraw layout.
                            if (isAspectRatioChanged) {
                                CZ.VCContent.clear(CZ.Common.vc.virtualCanvas("getLayerContent"));
                                CZ.Common.reloadData().done(function () {
                                    self.timeline = CZ.Common.vc.virtualCanvas("findElement", self.timeline.id);
                                    self.timeline.animation = null;

                                    //Move to new created timeline
                                    self.timeline.onmouseclick();
                                });
                            }

                            //Move to new created timeline
                            self.timeline.onmouseclick();
                        }, function (error) {
                            if (error !== undefined && error !== null) {
                                self.errorMessage.text(error).show().delay(7000).fadeOut();
                            } else {
                                self.errorMessage.text("Sorry, internal server error :(").show().delay(7000).fadeOut();
                            }
                            console.log(error);
                        }).always(function () {
                            _this.saveButton.prop('disabled', false);
                        });
                    }

                    function onDataInvalid () {
                        var self = _this;
                        self.errorMessage.empty();
                        self.errorMessage.text("Please, set a correct URL for background image.").show().delay(7000).fadeOut();
                        self.backgroundUrl.val("");
                    }

                    if (!isDataValid) {
                        return;
                    } else if (backgroundUrl !== "") {
                        backgroundImage = new Image();
                        backgroundImage.addEventListener("load", onDataValid, false);
                        backgroundImage.addEventListener("error", onDataInvalid, false);
                        backgroundImage.src = backgroundUrl;
                    } else {
                        onDataValid();
                    }
                });

                this.deleteButton.click(function (event) {
                    if (confirm("Are you sure want to delete timeline and all of its nested timelines and exhibits? Delete can't be undone!")) {
                        var isDataValid = true;
                        CZ.Authoring.removeTimeline(_this.timeline);
                        _this.close();
                    }
                });
            };

            FormEditTimeline.prototype.updateMediaInfo = function () {
                this.backgroundUrl.val(this.mediaInput.uri || "");
            };

            FormEditTimeline.prototype.show = function () {
                CZ.Menus.isDisabled = true;
                CZ.Menus.Refresh();
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("active");
            };

            FormEditTimeline.prototype.close = function () {
                var _this = this;
                this.errorMessage.empty();

                CZ.Menus.isDisabled = false;
                CZ.Menus.Refresh();
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.endDate.remove();
                        _this.startDate.remove();
                        _this.titleInput.hideError();
                        _this.mediaList.remove();
                    }
                });

                if (this.isCancel && CZ.Authoring.mode === "createTimeline") {
                    CZ.VCContent.removeChild(this.timeline.parent, this.timeline.id);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                }

                CZ.Authoring.isActive = false;

                this.activationSource.removeClass("active");

                CZ.Common.vc.virtualCanvas("showNonRootVirtualSpace");
            };
            return FormEditTimeline;
        })(CZ.UI.FormUpdateEntity);
        UI.FormEditTimeline = FormEditTimeline;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='contentitem-listbox.ts' />
/// <reference path='../ui/controls/formbase.ts' />
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditExhibit = (function (_super) {
            __extends(FormEditExhibit, _super);
            function FormEditExhibit(container, formInfo) {
                var _this = this;
                _super.call(this, container, formInfo);

                this.titleTextblock = container.find(formInfo.titleTextblock);
                this.titleInput = container.find(formInfo.titleInput);
                this.datePicker = new CZ.UI.DatePicker(container.find(formInfo.datePicker));
                this.createArtifactButton = container.find(formInfo.createArtifactButton);
                this.contentItemsListBox = new CZ.UI.ContentItemListBox(container.find(formInfo.contentItemsListBox), formInfo.contentItemsTemplate, formInfo.context.contentItems);
                this.errorMessage = container.find(formInfo.errorMessage);
                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);

                this.titleInput.focus(function () {
                    _this.titleInput.hideError();
                });

                this.contentItemsTemplate = formInfo.contentItemsTemplate;

                this.exhibit = formInfo.context;
                this.exhibitCopy = $.extend({}, formInfo.context, { children: null }); // shallow copy of exhibit (without children)
                this.exhibitCopy = $.extend(true, {}, this.exhibitCopy); // deep copy of exhibit
                delete this.exhibitCopy.children;

                this.mode = CZ.Authoring.mode; // deep copy mode. it never changes throughout the lifecycle of the form.
                this.isCancel = true;
                this.isModified = false;
                this.initUI();
            }
            FormEditExhibit.prototype.initUI = function () {
                var _this = this;
                this.saveButton.prop('disabled', false);

                this.titleInput.change(function () {
                    _this.isModified = true;
                });
                this.datePicker.datePicker.change(function () {
                    _this.isModified = true;
                });

                if (this.mode === "createExhibit") {
                    this.titleTextblock.text("Create Exhibit");
                    this.saveButton.text("Create Exhibit");

                    this.titleInput.val(this.exhibit.title || "");
                    this.datePicker.setDate(Number(this.exhibit.infodotDescription.date) || "", true);
                    $(this.datePicker.circaSelector).find('input').prop('checked', this.exhibit.infodotDescription.isCirca || false);

                    this.closeButton.show();
                    this.createArtifactButton.show();
                    this.saveButton.show();
                    this.deleteButton.hide();

                    // this.closeButton.click() is handled by base
                    this.createArtifactButton.off();
                    this.createArtifactButton.click(function () {
                        return _this.onCreateArtifact();
                    });
                    this.saveButton.off();
                    this.saveButton.click(function () {
                        return _this.onSave();
                    });

                    this.contentItemsListBox.itemDblClick(function (item, index) {
                        return _this.onContentItemDblClick(item, index);
                    });
                    this.contentItemsListBox.itemRemove(function (item, index) {
                        return _this.onContentItemRemoved(item, index);
                    });
                    this.contentItemsListBox.itemMove(function (item, indexStart, indexStop) {
                        return _this.onContentItemMove(item, indexStart, indexStop);
                    });
                } else if (this.mode === "editExhibit") {
                    this.titleTextblock.text("Edit Exhibit");
                    this.saveButton.text("Update Exhibit");

                    // store when exhibit last updated
                    // exhibit.id = letter "e" followed by exhibitId GUID, so strip off leading "e" before passing
                    CZ.Service.getExhibitLastUpdate(this.exhibit.id.substring(1)).done(function (data) {
                        _this.saveButton.data('lastUpdate', data);
                    });

                    this.titleInput.val(this.exhibit.title || "");
                    this.datePicker.setDate(Number(this.exhibit.infodotDescription.date) || "", true);
                    $(this.datePicker.circaSelector).find('input').prop('checked', this.exhibit.infodotDescription.isCirca || false);

                    this.closeButton.show();
                    this.createArtifactButton.show();
                    this.saveButton.show();
                    this.deleteButton.show();

                    // this.closeButton.click() is handled by base
                    this.createArtifactButton.off();
                    this.createArtifactButton.click(function () {
                        return _this.onCreateArtifact();
                    });
                    this.saveButton.off();
                    this.saveButton.click(function () {
                        return _this.onSave();
                    });
                    this.deleteButton.off();
                    this.deleteButton.click(function () {
                        return _this.onDelete();
                    });

                    this.contentItemsListBox.itemDblClick(function (item, index) {
                        return _this.onContentItemDblClick(item, index);
                    });
                    this.contentItemsListBox.itemRemove(function (item, index) {
                        return _this.onContentItemRemoved(item, index);
                    });
                    this.contentItemsListBox.itemMove(function (item, indexStart, indexStop) {
                        return _this.onContentItemMove(item, indexStart, indexStop);
                    });
                } else {
                    console.log("Unexpected authoring mode in exhibit form.");
                }
            };

            FormEditExhibit.prototype.onCreateArtifact = function () {
                this.isModified = true;
                if (this.exhibit.contentItems.length < CZ.Settings.infodotMaxContentItemsCount) {
                    this.exhibit.title = this.titleInput.val() || "";
                    this.exhibit.x = this.datePicker.getDate() - this.exhibit.width / 2;
                    this.exhibit.infodotDescription =
                    {
                        date: this.datePicker.getDate(),
                        isCirca: $(this.datePicker.circaSelector).find('input').is(':checked')
                    };
                  //this.exhibit.IsCirca = $(this.datePicker.circaSelector).find('input').is(':checked');
                    var newContentItem = {
                        title: "",
                        uri: "",
                        mediaSource: "",
                        mediaType: "",
                        attribution: "",
                        description: "",
                        order: this.exhibit.contentItems.length
                    };
                    this.exhibit.contentItems.push(newContentItem);
                    this.hide(true);
                    CZ.Authoring.contentItemMode = "createContentItem";
                    CZ.Authoring.showEditContentItemForm(newContentItem, this.exhibit, this, true);
                } else {
                    var self = this;
                    var origMsg = this.errorMessage.text();
                    this.errorMessage.text("Sorry, only 10 artifacts are allowed in one exhibit").show().delay(7000).fadeOut(function () {
                        return self.errorMessage.text(origMsg);
                    });
                }
            };

            FormEditExhibit.prototype.onSave = function () {
                var _this = this;
                var exhibit_x = this.datePicker.getDate() - this.exhibit.width / 2;
                var exhibit_y = this.exhibit.y;

                if (exhibit_x + this.exhibit.width >= this.exhibit.parent.x + this.exhibit.parent.width) {
                    exhibit_x = this.exhibit.parent.x + this.exhibit.parent.width - this.exhibit.width;
                }
                if (exhibit_x <= this.exhibit.parent.x) {
                    exhibit_x = this.exhibit.parent.x;
                }

                if (exhibit_y + this.exhibit.height >= this.exhibit.parent.y + this.exhibit.parent.height) {
                    exhibit_y = this.exhibit.parent.y + this.exhibit.parent.height - this.exhibit.height;
                }
                if (exhibit_y <= this.exhibit.parent.y) {
                    exhibit_y = this.exhibit.parent.y;
                }

                var newExhibit = {
                    title: this.titleInput.val() || "",
                    x: exhibit_x,
                    y: exhibit_y,
                    height: this.exhibit.height,
                    width: this.exhibit.width,
                    infodotDescription:
                    {
                        date:    CZ.Dates.getDecimalYearFromCoordinate(this.datePicker.getDate()),
                        isCirca: $(this.datePicker.circaSelector).find('input').is(':checked')
                    },
                  //IsCirca: $(this.datePicker.circaSelector).find('input').is(':checked'),
                    contentItems: this.exhibit.contentItems || [],
                    type: "infodot"
                };

                if (!CZ.Authoring.isNotEmpty(this.titleInput.val())) {
                    this.titleInput.showError("Title can't be empty");
                }

                if (CZ.Authoring.checkExhibitIntersections(this.exhibit.parent, newExhibit, true)) {
                    this.errorMessage.text("Exhibit intersects other elemenets");
                }

                if (CZ.Authoring.validateExhibitData(this.datePicker.getDate(), this.titleInput.val(), this.exhibit.contentItems) && CZ.Authoring.checkExhibitIntersections(this.exhibit.parent, newExhibit, true) && this.exhibit.contentItems.length >= 1 && this.exhibit.contentItems.length <= CZ.Settings.infodotMaxContentItemsCount) {
                    if (this.mode === "editExhibit") {
                        // edit mode - see if someone else has saved edit since we loaded it
                        CZ.Service.getExhibitLastUpdate(this.exhibit.id.substring(1)).done(function (data) {
                            if (data == _this.saveButton.data('lastUpdate')) {
                                // no-one else has touched - save without warning
                                _this.onSave_PerformSave(newExhibit);
                            } else {
                                // someone else has touched - warn and give options
                                if 
                                (
                                    confirm
                                    (
                                      //"Someone else has made changes to this exhibit since you began editing it.\n\n" +
                                        data.split('|')[1] + " has made changes to this exhibit since you began editing it.\n\n" +
                                        "Do you want to replace their changes with yours? This will cause all of their changes to be lost."
                                    )
                                )
                                {
                                    _this.onSave_PerformSave(newExhibit);
                                }
                                else
                                {
                                    alert
                                    (
                                        "Your changes were not saved.\n\n" +
                                        "You can click on your artifacts to copy off any changes you've made before closing the Edit Exhibit pane. " +
                                        "After closing the Edit Exhibits pane, you can then refresh your browser to see the latest changes."
                                    );
                                }
                            }
                        });
                    } else {
                        // create mode - just save
                        this.onSave_PerformSave(newExhibit);
                    }
                } else if (this.exhibit.contentItems.length === 0) {
                    var self = this;
                    var origMsg = this.errorMessage.text();
                    this.errorMessage.text("Cannot create exhibit without artifacts.").show().delay(7000).fadeOut(function () {
                        return self.errorMessage.text(origMsg);
                    });
                } else {
                    this.errorMessage.text("One or more fields filled wrong").show().delay(7000).fadeOut();
                }
            };

            FormEditExhibit.prototype.onSave_PerformSave = function (newExhibit) {
                var _this = this;
                this.saveButton.prop('disabled', true);

                CZ.Authoring.updateExhibit(this.exhibitCopy, newExhibit).then(function (success) {
                    _this.isCancel = false;
                    _this.isModified = false;
                    _this.close();
                    _this.exhibit.id = arguments[0].id;
                    _this.exhibit.onmouseclick();
                }, function (error) {
                    var errorMessage = JSON.parse(error.responseText).errorMessage;
                    if (errorMessage !== "") {
                        _this.errorMessage.text(errorMessage);
                        var that = _this;
                        var errCI = CZ.Authoring.erroneousContentItemsList(error.responseText);
                        errCI.forEach(function (contentItemIndex) {
                            var item = that.contentItemsListBox.items[contentItemIndex];
                            item.container.find(".cz-listitem").css("border-color", "red");
                        });
                        errorMessage = "(1/" + errCI.length + ") " + JSON.parse(error.responseText).errorMessage;
                        ;
                        _this.errorMessage.text(errorMessage);
                    } else {
                        _this.errorMessage.text("Sorry, internal server error :(");
                    }
                    _this.errorMessage.show().delay(7000).fadeOut();
                }).always(function () {
                    _this.saveButton.prop('disabled', false);
                });
            };

            FormEditExhibit.prototype.onDelete = function () {
                if (confirm("Are you sure want to delete the exhibit and all of its content items? Delete can't be undone!")) {
                    CZ.Authoring.removeExhibit(this.exhibit);
                    this.isCancel = false;
                    this.isModified = false;
                    this.close();
                }
            };

            FormEditExhibit.prototype.onContentItemDblClick = function (item, _) {
                var idx;
                if (typeof item.data.order !== 'undefined' && item.data.order !== null && item.data.order >= 0 && item.data.order < CZ.Settings.infodotMaxContentItemsCount) {
                    idx = item.data.order;
                } else if (typeof item.data.guid !== 'undefined' && item.data.guid !== null) {
                    idx = this.exhibit.contentItems.map(function (ci) {
                        return ci.guid;
                    }).indexOf(item.data.guid);
                } else {
                    idx = -1;
                }

                var item = this.contentItemsListBox.items[idx];
                item.container.find(".cz-listitem").css("border-color", "#c7c7c7");

                if (idx >= 0) {
                    this.clickedListItem = item;
                    this.exhibit.title = this.titleInput.val() || "";
                    this.exhibit.x = this.datePicker.getDate() - this.exhibit.width / 2;
                    this.exhibit.infodotDescription = { date: this.datePicker.getDate() };
                    this.hide(true);
                    CZ.Authoring.contentItemMode = "editContentItem";
                    CZ.Authoring.showEditContentItemForm(this.exhibit.contentItems[idx], this.exhibit, this, true);
                }
            };

            FormEditExhibit.prototype.onContentItemRemoved = function (item, _) {
                var idx;
                this.isModified = true;
                if (typeof item.data.order !== 'undefined' && item.data.order !== null && item.data.order >= 0 && item.data.order < CZ.Settings.infodotMaxContentItemsCount) {
                    idx = item.data.order;
                } else if (typeof item.data.guid !== 'undefined' && item.data.guid !== null) {
                    idx = this.exhibit.contentItems.map(function (ci) {
                        return ci.guid;
                    }).indexOf(item.data.guid);
                } else {
                    idx = -1;
                }

                if (idx >= 0) {
                    this.exhibit.contentItems.splice(idx, 1);
                    for (var i = 0; i < this.exhibit.contentItems.length; i++)
                        this.exhibit.contentItems[i].order = i;
                    this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                }
            };

            FormEditExhibit.prototype.onContentItemMove = function (item, indexStart, indexStop) {
                this.isModified = true;
                var ci = this.exhibit.contentItems.splice(indexStart, 1)[0];
                this.exhibit.contentItems.splice(indexStop, 0, ci);
                for (var i = 0; i < this.exhibit.contentItems.length; i++)
                    this.exhibit.contentItems[i].order = i;
                this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                CZ.Common.vc.virtualCanvas("requestInvalidate");
            };

            FormEditExhibit.prototype.show = function (noAnimation) {
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                CZ.Authoring.isActive = true;
                this.activationSource.addClass("active");
                this.errorMessage.hide();
                CZ.Menus.isDisabled = true;
                CZ.Menus.Refresh();
                _super.prototype.show.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
            };

            FormEditExhibit.prototype.hide = function (noAnimation) {
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };

            FormEditExhibit.prototype.close = function (noAnimation) {
                var _this = this;
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                if (this.isModified) {
                    if (window.confirm("There is unsaved data. Do you want to close without saving?")) {
                        this.isModified = false;
                    } else {
                        return;
                    }
                }

                CZ.Menus.isDisabled = false;
                CZ.Menus.Refresh();
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.datePicker.remove();
                        _this.contentItemsListBox.clear();
                        _this.titleInput.hideError();
                    }
                });
                if (this.isCancel) {
                    if (this.mode === "createExhibit") {
                        CZ.VCContent.removeChild(this.exhibit.parent, this.exhibit.id);
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                    } else if (this.mode === "editExhibit") {
                        delete this.exhibit.contentItems;
                        $.extend(this.exhibit, this.exhibitCopy);
                        this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                    }
                }
                this.activationSource.removeClass("active");
                CZ.Authoring.isActive = false;

                CZ.Common.vc.virtualCanvas("showNonRootVirtualSpace");
            };
            return FormEditExhibit;
        })(UI.FormUpdateEntity);
        UI.FormEditExhibit = FormEditExhibit;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../scripts/media.ts'/>
/// <reference path='../ui/media/skydrive-mediapicker.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditCI = (function (_super) {
            __extends(FormEditCI, _super);
            function FormEditCI(container, formInfo) {
                var _this = this;
                _super.call(this, container, formInfo);

                this.titleTextblock = container.find(formInfo.titleTextblock);
                this.titleInput = container.find(formInfo.titleInput);
                this.mediaInput = container.find(formInfo.mediaInput);
                this.mediaSourceInput = container.find(formInfo.mediaSourceInput);
                this.mediaTypeInput = container.find(formInfo.mediaTypeInput);
                this.attributionInput = container.find(formInfo.attributionInput);
                this.descriptionInput = container.find(formInfo.descriptionInput);
                this.previewButton = container.find('a.preview');
                this.previewBox = container.find('div.preview');
                this.errorMessage = container.find(formInfo.errorMessage);
                this.saveButton = container.find(formInfo.saveButton);
                this.mediaListContainer = container.find(formInfo.mediaListContainer);

                this.titleInput.focus(function () {
                    _this.titleInput.hideError();
                });

                this.mediaInput.focus(function () {
                    _this.mediaInput.hideError();
                });

                this.mediaSourceInput.focus(function () {
                    _this.mediaSourceInput.hideError();
                });

                this.prevForm = formInfo.prevForm;

                this.exhibit = formInfo.context.exhibit;
                this.contentItem = formInfo.context.contentItem;

                this.mode = CZ.Authoring.mode; // deep copy mode. it never changes throughout the lifecycle of the form.
                this.isCancel = true;
                this.isModified = false;
                this.initUI();
            }
            FormEditCI.prototype.initUI = function () {
                var _this = this;
                this.mediaList = new CZ.UI.MediaList(this.mediaListContainer, CZ.Media.mediaPickers, this.contentItem, this);
                var that = this;
                this.saveButton.prop('disabled', false);

                this.titleInput.change(function () {
                    _this.isModified = true;
                });
                this.mediaInput.change(function () {
                    _this.isModified = true;
                });
                this.mediaSourceInput.change(function () {
                    _this.isModified = true;
                });
                this.mediaTypeInput.change(function () {
                    _this.isModified = true;
                });
                this.attributionInput.change(function () {
                    _this.isModified = true;
                });
                this.descriptionInput.change(function () {
                    _this.isModified = true;
                });

                this.descriptionInput.on('keyup', function (e) {
                    if (e.which == 13) {
                        that.saveButton.click(function () {
                            return that.onSave();
                        });
                    }
                });
                this.descriptionInput.on('keydown', function (e) {
                    if (e.which == 13) {
                        that.saveButton.off();
                    }
                });

                if (CZ.Media.SkyDriveMediaPicker.isEnabled && this.mediaTypeInput.find("option[value='skydrive-image']").length === 0) {
                    $("<option></option>", {
                        value: "skydrive-image",
                        text: " OneDrive Image "
                    }).appendTo(this.mediaTypeInput);
                    $("<option></option>", {
                        value: "skydrive-document",
                        text: " OneDrive Document "
                    }).appendTo(this.mediaTypeInput);
                }

                this.titleInput.val(this.contentItem.title || "");
                this.mediaInput.val(this.contentItem.uri || "");
                this.mediaSourceInput.val(this.contentItem.mediaSource || "");
                this.mediaTypeInput.val(this.contentItem.mediaType || "");
                this.attributionInput.val(this.contentItem.attribution || "");
                this.descriptionInput.val(this.contentItem.description || "");

                this.renderPreviewButton = function ()
                {
                    if (_this.previewBox.is(':visible'))
                    {
                        _this.previewButton.text('edit');
                        _this.previewButton.attr('title', 'Return to editing the description');
                    }
                    else
                    {
                        _this.previewButton.text('preview');
                        _this.previewButton.attr('title', 'See what the description looks like using Markdown');
                    }
                };

                this.renderPreviewButton(); // call to set initial label and text

                this.previewButton.off().on('click', function (event)
                {
                    _this.previewBox.html(marked(_this.descriptionInput.val()));
                    _this.descriptionInput.toggle();
                    _this.previewBox.toggle();
                    _this.renderPreviewButton();
                });

                this.saveButton.off();
                this.saveButton.click(function () {
                    return _this.onSave();
                });

                if (CZ.Authoring.contentItemMode === "createContentItem") {
                    this.titleTextblock.text("Create New");
                    this.saveButton.text("Create Artifiact");

                    this.closeButton.hide();
                } else if (CZ.Authoring.contentItemMode === "editContentItem") {
                    this.titleTextblock.text("Edit");
                    this.saveButton.text("Update Artifact");

                    if (this.prevForm && this.prevForm instanceof UI.FormEditExhibit)
                        this.closeButton.hide();
                    else
                        this.closeButton.show();
                } else {
                    console.log("Unexpected authoring mode in content item form.");
                    this.close();
                }

                this.saveButton.show();
            };

            FormEditCI.prototype.onSave = function () {
                var _this = this;
                var newContentItem = {
                    title: this.titleInput.val() || "",
                    uri: this.mediaInput.val() || "",
                    mediaSource: this.mediaSourceInput.val() || "",
                    mediaType: this.mediaTypeInput.val() || "",
                    attribution: this.attributionInput.val() || "",
                    description: this.descriptionInput.val() || "",
                    order: this.contentItem.order
                };

                if (!CZ.Authoring.isNotEmpty(newContentItem.title)) {
                    this.titleInput.showError("Title can't be empty");
                }

                if (!CZ.Authoring.isNotEmpty(newContentItem.uri)) {
                    this.mediaInput.showError("URL can't be empty");
                }
                if (!CZ.Authoring.isValidURL(newContentItem.uri)) {
                    this.mediaInput.showError("URL is wrong");
                }

                if ((CZ.Authoring.validateContentItems([newContentItem], this.mediaInput)) && (CZ.Authoring.isValidURL(newContentItem.uri))) {
                    if (CZ.Authoring.contentItemMode === "createContentItem") {
                        if (this.prevForm && this.prevForm instanceof UI.FormEditExhibit) {
                            this.isCancel = false;
                            this.prevForm.contentItemsListBox.add(newContentItem);
                            $.extend(this.exhibit.contentItems[this.contentItem.order], newContentItem);
                            this.prevForm.exhibit = this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                            CZ.Common.vc.virtualCanvas("requestInvalidate");
                            this.isModified = false;
                            this.back();
                        }
                    } else if (CZ.Authoring.contentItemMode === "editContentItem") {
                        if (this.prevForm && this.prevForm instanceof UI.FormEditExhibit) {
                            this.isCancel = false;
                            var clickedListItem = this.prevForm.clickedListItem;
                            clickedListItem.iconImg.attr("src", newContentItem.uri);
                            clickedListItem.titleTextblock.text(newContentItem.title);
                            clickedListItem.descrTextblock.text(newContentItem.description);
                            $.extend(this.exhibit.contentItems[this.contentItem.order], newContentItem);
                            this.prevForm.exhibit = this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                            this.prevForm.isModified = true;
                            CZ.Common.vc.virtualCanvas("requestInvalidate");
                            this.isModified = false;
                            this.back();
                        } else {
                            this.saveButton.prop('disabled', true);
                            CZ.Authoring.updateContentItem(this.exhibit, this.contentItem, newContentItem).then(function (response) {
                                _this.isCancel = false;
                                _this.isModified = false;
                                _this.close();
                            }, function (error) {
                                var errorMessage = error.statusText;

                                if (errorMessage.match(/Media Source/)) {
                                    _this.errorMessage.text("One or more fields filled wrong");
                                    _this.mediaSourceInput.showError("Media Source URL is not a valid URL");
                                } else {
                                    _this.errorMessage.text("Sorry, internal server error :(");
                                }

                                _this.errorMessage.show().delay(7000).fadeOut();
                            }).always(function () {
                                _this.saveButton.prop('disabled', false);
                            });
                        }
                    }
                } else {
                    this.errorMessage.text("One or more fields filled wrong").show().delay(7000).fadeOut();
                }
            };

            FormEditCI.prototype.updateMediaInfo = function () {
                this.mediaInput.val(this.contentItem.uri || "");
                this.mediaSourceInput.val(this.contentItem.mediaSource || "");
                this.mediaTypeInput.val(this.contentItem.mediaType || "");
                this.attributionInput.val(this.contentItem.attribution || "");
            };

            FormEditCI.prototype.show = function (noAnimation) {
                CZ.Authoring.isActive = true;
                this.activationSource.addClass("active");
                this.errorMessage.hide();
                CZ.Menus.isDisabled = true;
                CZ.Menus.Refresh();
                _super.prototype.show.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
            };

            FormEditCI.prototype.close = function (noAnimation) {
                var _this = this;
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                if (this.isModified) {
                    if (window.confirm("There is unsaved data. Do you want to close without saving?")) {
                        this.isModified = false;
                    } else {
                        return;
                    }
                }

                CZ.Menus.isDisabled = false;
                CZ.Menus.Refresh();
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.mediaList.remove();
                        _this.mediaInput.hideError();
                        _this.titleInput.hideError();
                        _this.mediaSourceInput.hideError();
                    }
                });
                if (this.isCancel) {
                    if (CZ.Authoring.contentItemMode === "createContentItem") {
                        this.exhibit.contentItems.pop();
                    }
                }
                this.activationSource.removeClass("active");
                CZ.Authoring.isActive = false;
            };
            return FormEditCI;
        })(CZ.UI.FormUpdateEntity);
        UI.FormEditCI = FormEditCI;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='../ui/tourstop-listbox.ts' />
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var TourStop = (function () {
            function TourStop(target, title) {
                if (target == undefined || target == null)
                    throw "target element of a tour stop is null or undefined";
                if (typeof target.type == "undefined")
                    throw "type of the tour stop target element is undefined";
                this.targetElement = target;
                if (target.type === "Unknown") {
                    this.type = target.type;
                    this.title = title;
                } else if (target.type === "contentItem") {
                    this.type = "Content Item";
                    this.title = title ? title : target.contentItem.title;
                } else {
                    this.type = target.type === "timeline" ? "Timeline" : "Event";
                    this.title = title ? title : target.title;
                }
            }
            Object.defineProperty(TourStop.prototype, "Target", {
                get: function () {
                    return this.targetElement;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TourStop.prototype, "Title", {
                get: function () {
                    return this.title;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TourStop.prototype, "Description", {
                get: function () {
                    return this.description;
                },
                set: function (d) {
                    this.description = d;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(TourStop.prototype, "LapseTime", {
                get: function () {
                    return this.lapseTime;
                },
                set: function (value) {
                    this.lapseTime = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TourStop.prototype, "Type", {
                get: function () {
                    return this.type;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TourStop.prototype, "NavigationUrl", {
                get: function () {
                    return CZ.UrlNav.vcelementToNavString(this.targetElement);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TourStop.prototype, "ThumbnailUrl", {
                get: function () {
                    if (!this.thumbUrl)
                        this.thumbUrl = this.GetThumbnail(this.targetElement);
                    return this.thumbUrl;
                },
                enumerable: true,
                configurable: true
            });

            TourStop.prototype.GetThumbnail = function (element) {
                // uncomment for debug: return "http://upload.wikimedia.org/wikipedia/commons/7/71/Ivan_kramskoy_self_portrait_tr.gif";
                var defaultThumb = "/images/Temp-Thumbnail2.png";
                try  {
                    if (!element)
                        return defaultThumb;
                    if (element.type === "contentItem") {
                        var thumbnailUri = CZ.Settings.contentItemThumbnailBaseUri + 'x64/' + element.id + '.png';
                        return thumbnailUri;
                    }
                    if (element.type === "infodot") {
                        if (element.contentItems && element.contentItems.length > 0) {
                            var child = element.contentItems[0];
                            var thumbnailUri = CZ.Settings.contentItemThumbnailBaseUri + 'x64/' + child.id + '.png';
                            return thumbnailUri;
                        }
                    } else if (element.type === "timeline") {
                        for (var n = element.children.length, i = 0; i < n; i++) {
                            var child = element.children[i];
                            if (child.type === "infodot" || child.type === "timeline") {
                                var thumb = this.GetThumbnail(child);
                                if (thumb && thumb !== defaultThumb)
                                    return thumb;
                            }
                        }
                    }
                } catch (exc) {
                    if (console && console.error)
                        console.error("Failed to get a thumbnail url: " + exc);
                }
                return defaultThumb;
            };
            return TourStop;
        })();
        UI.TourStop = TourStop;

        var Tour = (function () {
            function Tour(id, title, description, audio, category, sequence, stops) {
                this.id = id;
                this.title = title;
                this.description = description;
                this.audio = audio;
                this.sequence = sequence;
                this.stops = stops;
                this.category = category;
            }
            Object.defineProperty(Tour.prototype, "Id", {
                get: function () {
                    return this.id;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Tour.prototype, "Title", {
                get: function () {
                    return this.title;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Tour.prototype, "Category", {
                get: function () {
                    return this.category;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Tour.prototype, "Sequence", {
                get: function () {
                    return this.sequence;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Tour.prototype, "Description", {
                get: function () {
                    return this.description;
                },
                set: function (val) {
                    this.description = val;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Tour.prototype, "Audio", {
                get: function () {
                    return this.audio;
                },
                set: function (val) {
                    this.audio = val;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Tour.prototype, "Stops", {
                get: function () {
                    return this.stops;
                },
                enumerable: true,
                configurable: true
            });
            return Tour;
        })();
        UI.Tour = Tour;

        var FormEditTour = (function (_super) {
            __extends(FormEditTour, _super);
            // We only need to add additional initialization in constructor.
            function FormEditTour(container, formInfo) {
                _super.call(this, container, formInfo);

                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.addStopButton = container.find(formInfo.addStopButton);
                this.titleInput = container.find(formInfo.titleInput);

                this.tourTitleInput = this.container.find(".cz-form-tour-title");
                this.tourDescriptionInput = this.container.find(".cz-form-tour-description");
                this.tourAudioPicker = this.container.find('.cz-medialist-item-icon');
                this.tourAudioInput = this.container.find('#cz-form-tour-audio');
                this.tourAudioControls = this.container.find('.audiojs');
                this.clean();

                this.saveButton.off();
                this.deleteButton.off();

                this.tour = formInfo.context;
                var stops = [];
                var self = this;
                if (this.tour) {
                    this.tourTitleInput.val(this.tour.title);
                    this.tourDescriptionInput.val(this.tour.description);
                    this.tourAudioInput.val(this.tour.audio);
                    for (var i = 0, len = this.tour.bookmarks.length; i < len; i++) {
                        var bookmark = this.tour.bookmarks[i];
                        var stop = FormEditTour.bookmarkToTourstop(bookmark);
                        stops.push(stop);
                    }
                } else {
                    this.tourTitleInput.val("");
                    this.tourDescriptionInput.val("");
                }
                this.tourStopsListBox = new CZ.UI.TourStopListBox(container.find(formInfo.tourStopsListBox), formInfo.tourStopsTemplate, stops);
                this.tourStopsListBox.itemMove(function (item, startPos, endPos) {
                    return self.onStopsReordered.apply(self, [item, startPos, endPos]);
                });
                this.tourStopsListBox.itemRemove(function (item, index) {
                    return self.onStopRemoved.apply(self, [item, index]);
                });
                this.initialize();
            }
            FormEditTour.bookmarkToTourstop = function (bookmark) {
                var target = CZ.Tours.bookmarkUrlToElement(bookmark.url);
                if (target == null) {
                    target = {
                        type: "Unknown"
                    };
                }
                var stop = new TourStop(target, (!bookmark.caption || $.trim(bookmark.caption) === "") ? undefined : bookmark.caption);
                stop.Description = bookmark.text;
                stop.LapseTime = bookmark.lapseTime;
                return stop;
            };

            FormEditTour.tourstopToBookmark = function (tourstop, index) {
                var url = CZ.UrlNav.vcelementToNavString(tourstop.Target);
                var title = tourstop.Title;
                var bookmark = new CZ.Tours.TourBookmark(url, title, tourstop.LapseTime, tourstop.Description);
                bookmark.number = index + 1;
                return bookmark;
            };

            FormEditTour.prototype.deleteTourAsync = function () {
                return CZ.Service.deleteTour(this.tour.id);
            };

            // Creates new tour instance from the current state of the UI.
            // Returns a promise of the created tour. May fail.
            FormEditTour.prototype.putTourAsync = function (sequenceNum) {
                var deferred = $.Deferred();
                var self = this;
                var stops = this.getStops();

                // Add the tour to the local tours collection
                var name = this.tourTitleInput.val();
                var descr = this.tourDescriptionInput.val();
                var audio = this.tourAudioInput.val();
                var category = "tours";
                var n = stops.length;
                var tourId = undefined;
                if (this.tour) {
                    category = this.tour.category;
                    tourId = this.tour.id;
                }

                // Posting the tour to the service
                var request = CZ.Service.putTour2(new CZ.UI.Tour(tourId, name, descr, audio, category, n, stops));

                request.done(function (q) {
                    // build array of bookmarks of current tour
                    var tourBookmarks = new Array();
                    for (var j = 0; j < n; j++) {
                        var tourstop = stops[j];
                        var bookmark = FormEditTour.tourstopToBookmark(tourstop, j);
                        tourBookmarks.push(bookmark);
                    }

                    var tour = new CZ.Tours.Tour(q.TourId, name, tourBookmarks, CZ.Tours.bookmarkTransition, CZ.Common.vc, category, audio, sequenceNum, descr);
                    deferred.resolve(tour);
                }).fail(function (q) {
                    deferred.reject(q);
                });
                return deferred.promise();
            };

            FormEditTour.prototype.initializeAsEdit = function () {
                this.deleteButton.show();
                this.titleTextblock.text("Edit Tour");
                this.saveButton.text("Update Tour");
            };

            FormEditTour.prototype.initialize = function () {
                var _this = this;
                this.saveButton.prop('disabled', false);
                if (this.tour == null) {
                    this.deleteButton.hide();
                    this.titleTextblock.text("Create Tour");
                    this.saveButton.text("Create Tour");
                } else {
                    this.initializeAsEdit();
                }

                var self = this;

                // ensure Windows Live API initialized for OneDrive
                WL.init
                ({
                    client_id:      CZ.Settings.WLAPIClientID,
                    redirect_uri:   CZ.Settings.WLAPIRedirectUrl
                });

                // OneDrive audio picker - see https://msdn.microsoft.com/en-us/library/jj219328.aspx
                this.tourAudioPicker.click(function (event)
                {
                    WL.login
                    ({
                        scope: ['wl.skydrive', 'wl.signin']
                    })
                    .then
                    (
                        function(response)
                        {
                            WL.fileDialog
                            ({
                                mode:   'open',
                                select: 'single'
                            })
                            .then
                            (
                                function (response)
                                {
                                    var file = response.data.files[0];
                                    if (file.type === 'audio' && file.name.toLowerCase().match('\.mp3$'))
                                    {
                                        _this.tourAudioInput.val(file.source);
                                        _this.renderAudioControls();
                                    }
                                    else
                                    {
                                        // Don't use CZ.Authoring.showMessageWindow to warn as
                                        // currently not noticeable on top of Edit Tour pane.
                                        alert('Sorry, you need to pick an MP3 file.');
                                    }
                                }
                            );
                        }
                    );
                });

                this.renderAudioControls();
                this.tourAudioInput.on('change input', function (event) {
                    _this.renderAudioControls();
                });

                this.addStopButton.click(function (event) {
                    CZ.Authoring.isActive = true; // for now we do not watch for mouse moves
                    CZ.Authoring.mode = "editTour-selectTarget";
                    CZ.Authoring.callback = function (arg) {
                        return self.onTargetElementSelected(arg);
                    };
                    self.hide();
                    setTimeout(function () {
                        if (CZ.Authoring.mode == "editTour-selectTarget") {
                            CZ.Authoring.showMessageWindow("Click an element to select it as a tour stop.", "New tour stop", function () {
                                if (CZ.Authoring.mode == "editTour-selectTarget")
                                    self.onTargetElementSelected(null);
                            });
                        }
                    }, 500);
                });

                this.saveButton.click(function (event) {
                    var message = '';

                    if (!_this.tourTitleInput.val())
                        message += "Please enter a title.\n";

                    // audio URL validation
                    _this.tourAudioInput.val($.trim(_this.tourAudioInput.val())); // first trim excess space
                    if (_this.tourAudioInput.val() != '' && !CZ.Data.validURL(_this.tourAudioInput.val())) {
                        // content has been entered and is not a validly formed URL
                        message += 'Please provide a valid audio URL.\n';
                    }

                    if (_this.tourStopsListBox.items.length == 0)
                        message += "Please add a tour stop to the tour.\n";

                    if (message) {
                        alert(message);
                        return;
                    }

                    var self = _this;

                    _this.saveButton.prop('disabled', true);

                    // create new tour
                    if (_this.tour == null) {
                        // Add the tour to the local tours collection
                        _this.putTourAsync(CZ.Tours.tours.length).done(function (tour) {
                            self.tour = tour;
                            CZ.Tours.tours.push(tour);
                            _this.hide();
                        }).fail(function (f) {
                            if (console && console.error) {
                                console.error("Failed to create a tour: " + f.status + " " + f.statusText);
                            }
                            alert("Failed to create a tour");
                        }).done(function () {
                            _this.saveButton.prop('disabled', false);
                        });
                    } else {
                        for (var i = 0, n = CZ.Tours.tours.length; i < n; i++) {
                            if (CZ.Tours.tours[i] === _this.tour) {
                                _this.putTourAsync(i).done(function (tour) {
                                    _this.tour = CZ.Tours.tours[i] = tour;
                                    _this.hide();
                                }).fail(function (f) {
                                    if (console && console.error) {
                                        console.error("Failed to update a tour: " + f.status + " " + f.statusText);
                                    }
                                    alert("Failed to update a tour");
                                }).always(function () {
                                    _this.saveButton.prop('disabled', false);
                                });
                                break;
                            }
                        }
                    }
                });

                this.deleteButton.click(function (event) {
                    if (_this.tour == null)
                        return;
                    _this.deleteTourAsync().done(function (q) {
                        for (var i = 0, n = CZ.Tours.tours.length; i < n; i++) {
                            if (CZ.Tours.tours[i] === _this.tour) {
                                _this.tour = null;
                                CZ.Tours.tours.splice(i, 1);
                                _this.close();
                                break;
                            }
                        }
                    }).fail(function (f) {
                        if (console && console.error) {
                            console.error("Failed to delete a tour: " + f.status + " " + f.statusText);
                        }
                        alert("Failed to delete a tour");
                    });
                });
            };

            // Gets an array of TourStops as they are currently in the listbox.
            FormEditTour.prototype.getStops = function () {
                var n = this.tourStopsListBox.items.length;
                var stops = new Array(n);
                for (; --n >= 0;) {
                    stops[n] = this.tourStopsListBox.items[n].data;
                }
                return stops;
            };

            FormEditTour.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("active");
            };

            FormEditTour.prototype.hide = function (noAnimation) {
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };

            FormEditTour.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                    }
                });

                CZ.Authoring.isActive = false;
                this.clean();
            };

            FormEditTour.prototype.clean = function () {
                this.activationSource.removeClass("active");
                this.container.find(".cz-form-errormsg").hide();
                this.container.find(".cz-listbox").empty();
                this.tourTitleInput.val("");
                this.tourDescriptionInput.val("");
                this.tourAudioInput.val('');
            };

            FormEditTour.prototype.renderAudioControls = function () {
                this.tourAudioControls.find('audio').stop();
                this.tourAudioControls.find('audio').html('<source src="' + this.tourAudioInput.val() + '" />');

                if (CZ.Data.validURL(this.tourAudioInput.val())) {
                    this.tourAudioControls.show();
                } else {
                    this.tourAudioControls.hide();
                }
            };

            FormEditTour.prototype.onStopsReordered = function () {
                this.updateSequence();
            };

            FormEditTour.prototype.onStopRemoved = function () {
                this.updateSequence();
            };

            FormEditTour.prototype.updateSequence = function () {
                var stops = this.getStops();
                var n = stops.length;
                var lapseTime = 0;
                for (var i = 0; i < n; i++) {
                    var stop = stops[i];
                    stop.LapseTime = lapseTime;
                    lapseTime += CZ.Settings.tourDefaultTransitionTime;
                }
            };

            // New tour stop is added.
            FormEditTour.prototype.onTargetElementSelected = function (targetElement) {
                CZ.Authoring.mode = "editTour";
                CZ.Authoring.hideMessageWindow();
                CZ.Authoring.isActive = false;
                CZ.Authoring.callback = null;

                if (targetElement) {
                    var n = this.tourStopsListBox.items.length;
                    var stop = new TourStop(targetElement);
                    stop.LapseTime = n == 0 ? 0 : this.tourStopsListBox.items[this.tourStopsListBox.items.length - 1].data.LapseTime + CZ.Settings.tourDefaultTransitionTime;
                    this.tourStopsListBox.add(stop);
                }
                this.show();
            };
            return FormEditTour;
        })(CZ.UI.FormBase);
        UI.FormEditTour = FormEditTour;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/settings.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../scripts/media.ts'/>
/// <reference path='../ui/media/skydrive-mediapicker.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditCollection = (function (_super) {
            __extends(FormEditCollection, _super);
            // We only need to add additional initialization in constructor.
            function FormEditCollection(container, formInfo) {
                var _this = this;
                _super.call(this, container, formInfo);
                this.contentItem = {};

                this.saveButton             = container.find(formInfo.saveButton);
                this.deleteButton           = container.find(formInfo.deleteButton);
                this.errorMessage           = container.find(formInfo.errorMessage);
                this.colorPickers           = container.find('input[type="color"]');
                this.rangePickers           = container.find('.cz-form-range');
                this.collectionName         = container.find(formInfo.collectionName);
                this.collectionPath         = container.find(formInfo.collectionPath);
                this.originalPath           = this.collectionPath;
                this.backgroundInput        = container.find(formInfo.backgroundInput);
                this.collectionTheme        = formInfo.collectionTheme;
                this.activeCollectionTheme  = jQuery.extend(true, {}, formInfo.collectionTheme);
                this.mediaListContainer     = container.find(formInfo.mediaListContainer);
                this.kioskmodeInput         = formInfo.kioskmodeInput;
                this.chkPublic              = container.find(formInfo.chkPublic);
                this.chkDefault             = container.find(formInfo.chkDefault);
                this.chkEditors             = container.find(formInfo.chkEditors);
                this.btnEditors             = container.find(formInfo.btnEditors);
                this.lnkUseDefaultImage     = container.find('.cz-form-default-image');

                this.timelineBackgroundColorInput = formInfo.timelineBackgroundColorInput;
                this.timelineBackgroundOpacityInput = formInfo.timelineBackgroundOpacityInput;
                this.timelineBorderColorInput = formInfo.timelineBorderColorInput;
                this.exhibitBackgroundColorInput = formInfo.exhibitBackgroundColorInput;
                this.exhibitBackgroundOpacityInput = formInfo.exhibitBackgroundOpacityInput;
                this.exhibitBorderColorInput = formInfo.exhibitBorderColorInput;

                this.collectionName.on('input change', function ()
                {
                    _this.updateCollectionPath();
                });

                this.lnkUseDefaultImage.click(function ()
                {
                    _this.backgroundInput.val('/images/background.jpg');
                    _this.updateCollectionTheme(true);
                });

                this.backgroundInput.on('input change', function () {
                    _this.updateCollectionTheme(true);
                });

                this.kioskmodeInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.timelineBackgroundColorInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.timelineBackgroundOpacityInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.timelineBorderColorInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.exhibitBackgroundColorInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.exhibitBackgroundOpacityInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.exhibitBorderColorInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.backgroundInput.focus(function () {
                    _this.backgroundInput.hideError();
                });

                try  {
                    this.initialize();
                } catch (e) {
                    console.log("Error initializing collection form attributes");
                }

                this.saveButton.off().click(function (event)
                {
                    _this.errorMessage.hide();

                    CZ.Service.isUniqueCollectionName(_this.collectionName.val()).done(function (isUniqueCollectionName)
                    {
                        if (!isUniqueCollectionName)
                        {
                            _this.errorMessage.html
                            (
                                "This collection name or URL has already been used. &nbsp;" +
                                "Please try a different collection name."
                            ).show();
                            return;
                        }

                        _this.updateCollectionTheme(true);
                        _this.activeCollectionTheme = _this.collectionTheme;

                        var collectionData =
                        {
                            Title:              $.trim(_this.collectionName.val()),
                            Path:               _this.collectionName.val().replace(/[^a-zA-Z0-9\-]/g, ''),
                            theme:              JSON.stringify(_this.collectionTheme),
                            PubliclySearchable: $(_this.chkPublic ).prop('checked'),
                            MembersAllowed:     $(_this.chkEditors).prop('checked'),
                            Default:            $(_this.chkDefault).prop('checked')
                        };

                        CZ.Service.putCollection(CZ.Service.superCollectionName, CZ.Service.collectionName, collectionData)
                        .done(function ()
                        {
                            _this.close();
                            if (_this.collectionPath.val() != _this.originalPath) window.location = _this.collectionPath.val();
                        })
                        .fail(function ()
                        {
                            _this.errorMessage.html('An unexpected error occured.').show();
                        });
                    });
                });

                this.deleteButton.off().click(function (event)
                {
                    _this.errorMessage.hide();

                    CZ.Service.deleteCollection().done(function (success)
                    {
                        if (success)
                        {
                            window.location =
                            (
                                window.location.protocol + '//' + window.location.host + '/' + CZ.Service.superCollectionName
                            )
                            .toLowerCase();
                        }
                        else
                        {
                            CZ.Authoring.showMessageWindow
                            (
                                "An unexpected error occured.",
                                "Unable to Delete Collection"
                            );
                        }
                    });
                });
            }
            FormEditCollection.prototype.initialize = function () {
                var _this = this;
                this.saveButton.prop('disabled', false);

                // see http://refreshless.com/nouislider
                if (!this.rangePickers.hasClass('noUi-target'))
                {
                    this.rangePickers.noUiSlider
                    ({
                        connect:    'lower',
                        start:      0.5,
                        step:       0.05,
                        range:
                        {
                            'min':  0,
                            'max':  1
                        }
                    });
                }

                this.backgroundInput.val(this.collectionTheme.backgroundUrl);
                this.mediaList = new CZ.UI.MediaList(this.mediaListContainer, CZ.Media.mediaPickers, this.contentItem, this);
                this.kioskmodeInput.prop('checked', false);

                if (!this.collectionTheme.timelineColor) this.collectionTheme.timelineColor = CZ.Settings.timelineColorOverride;
                this.timelineBackgroundColorInput.val(this.getHexColorFromColor(this.collectionTheme.timelineColor));
                this.timelineBackgroundOpacityInput.val(this.getOpacityFromRGBA(this.collectionTheme.timelineColor).toString());
                this.timelineBorderColorInput.val(this.getHexColorFromColor(this.collectionTheme.timelineStrokeStyle));

                this.exhibitBackgroundColorInput.val(this.getHexColorFromColor(this.collectionTheme.infoDotFillColor));
                this.exhibitBackgroundOpacityInput.val(this.getOpacityFromRGBA(this.collectionTheme.infoDotFillColor).toString());
                this.exhibitBorderColorInput.val(this.getHexColorFromColor(this.collectionTheme.infoDotBorderColor));

                // see http://bgrins.github.io/spectrum
                this.colorPickers.spectrum();
                $.each(this.colorPickers, function (index, value)
                {
                    var $this = $(this);
                    $this.next().find('.sp-preview').attr('title', $this.attr('title'));
                });

                CZ.Service.getCollection().done(function (data)
                {
                    var themeFromDb = JSON.parse(data.theme);
                    if (themeFromDb == null) {
                        $(_this.kioskmodeInput).prop('checked', false);
                    } else {
                        $(_this.kioskmodeInput).prop('checked', themeFromDb.kioskMode);
                    }
                    $(_this.collectionName).val(data.Title);
                    _this.updateCollectionPath();
                    _this.originalPath = _this.collectionPath.val();
                    $(_this.chkDefault).prop('checked', data.Default);
                    $(_this.chkDefault).parent().attr('title', 'The default for ' + window.location.protocol + '//' + window.location.host + '/' + CZ.Service.superCollectionName);
                    if (data.Default)
                    {
                        $(_this.chkDefault).prop('disabled', true);
                        $(_this.deleteButton).hide();
                    }
                    $(_this.chkPublic ).prop('checked', data.PubliclySearchable);
                    $(_this.chkEditors).prop('checked', data.MembersAllowed);
                    _this.renderManageEditorsButton();
                });

                this.chkEditors.off().click(function (event) {
                    _this.renderManageEditorsButton();
                });
            };

            FormEditCollection.prototype.updateCollectionPath = function ()
            {
                this.collectionPath.val
                (
                    (
                        window.location.protocol + '//' + window.location.host + '/' +
                        CZ.Service.superCollectionName + '/' +
                        this.collectionName.val().replace(/[^a-zA-Z0-9\-]/g, '')
                    )
                    .toLowerCase()
                );
            };

            FormEditCollection.prototype.colorIsRgba = function (color) {
                return color ? color.substr(0, 5) === "rgba(" : false;
            };

            FormEditCollection.prototype.colorIsRgb = function (color) {
                return color ? color.substr(0, 4) === "rgb(" : false;
            };

            FormEditCollection.prototype.colorIsHex = function (color) {
                return color ? color.substr(0, 1) === "#" && color.length >= 7 : false;
            };

            FormEditCollection.prototype.rgbaFromColor = function (color, alpha) {
                if (!color)
                    return color;

                if (this.colorIsRgba(color)) {
                    var parts = color.substr(5, color.length - 5 - 1).split(",");
                    if (parts.length > 3)
                        parts[parts.length - 1] = alpha.toString();
                    else
                        parts.push(alpha.toString());
                    return "rgba(" + parts.join(",") + ")";
                }

                var red = parseInt("0x" + color.substr(1, 2));
                var green = parseInt("0x" + color.substr(3, 2));
                var blue = parseInt("0x" + color.substr(5, 2));

                return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
            };

            FormEditCollection.prototype.getOpacityFromRGBA = function (rgba) {
                if (!rgba)
                    return null;
                if (!this.colorIsRgba(rgba))
                    return 1.0;

                var parts = rgba.split(",");
                var lastPart = parts[parts.length - 1].split(")")[0];
                return parseFloat(lastPart);
            };

            FormEditCollection.prototype.getHexColorFromColor = function (color) {
                if (this.colorIsHex(color))
                    return color;

                if (!this.colorIsRgb(color) && !this.colorIsRgba(color))
                    return null;

                var offset = this.colorIsRgb(color) ? 4 : 5;
                var parts = color.substr(offset, color.length - offset - 1).split(",");
                var lastPart = parts[parts.length - 1].split(")")[0];
                return "#" + this.colorHexFromInt(parts[0]) + this.colorHexFromInt(parts[1]) + this.colorHexFromInt(parts[2]);
            };

            FormEditCollection.prototype.colorHexFromInt = function (colorpart) {
                var hex = Number(colorpart).toString(16);
                if (hex.length === 1)
                    return "0" + hex;

                return hex;
            };

            FormEditCollection.prototype.renderManageEditorsButton = function () {
                if (this.chkEditors.prop('checked')) {
                    this.btnEditors.slideDown('fast');
                } else {
                    this.btnEditors.slideUp('fast');
                }
            };

            FormEditCollection.prototype.updateCollectionTheme = function (clearError)
            {
                this.collectionTheme =
                {
                    backgroundUrl:          this.backgroundInput.val(),
                    backgroundColor:        "#232323",
                    kioskMode:              this.kioskmodeInput.prop("checked"),
                    /*
                    // native color picker:
                    timelineColor:          this.rgbaFromColor(this.timelineBackgroundColorInput.val(), this.timelineBackgroundOpacityInput.val()),
                    timelineStrokeStyle:    this.timelineBorderColorInput.val(),
                    infoDotFillColor:       this.rgbaFromColor(this.exhibitBackgroundColorInput.val(),  this.exhibitBackgroundOpacityInput.val()),
                    infoDotBorderColor:     this.exhibitBorderColorInput.val()
                    */
                    // spectrum color picker:
                    timelineColor:          this.rgbaFromColor(this.timelineBackgroundColorInput.spectrum('get').toHexString(), this.timelineBackgroundOpacityInput.val()),
                    timelineStrokeStyle:    this.timelineBorderColorInput.spectrum('get').toHexString(),
                    infoDotFillColor:       this.rgbaFromColor(this.exhibitBackgroundColorInput.spectrum( 'get').toHexString(), this.exhibitBackgroundOpacityInput.val()),
                    infoDotBorderColor:     this.exhibitBorderColorInput.spectrum( 'get').toHexString()
                };

                // if input has rgba color then update textbox with new alpha
                if (this.colorIsRgb(this.timelineBackgroundColorInput.val()))
                {
                    this.timelineBackgroundColorInput.val(this.collectionTheme.timelineColor);
                    this.exhibitBackgroundColorInput.val(this.collectionTheme.infoDotFillColor);
                }

                if (clearError) this.backgroundInput.hideError();

                this.updateCollectionThemeFromTheme(this.collectionTheme);
            };

            FormEditCollection.prototype.updateCollectionThemeFromTheme = function (theme) {
                CZ.Settings.applyTheme(theme, false);

                CZ.Common.vc.virtualCanvas("forEachElement", function (element) {
                    if (element.type === "timeline") {
                        element.settings.fillStyle = theme.timelineColor;
                        element.settings.strokeStyle = theme.timelineStrokeStyle;
                        element.settings.gradientFillStyle = theme.timelineStrokeStyle;
                    } else if (element.type === "infodot") {
                        element.settings.fillStyle = theme.infoDotFillColor;
                        element.settings.strokeStyle = theme.infoDotBorderColor;
                    }
                });

                CZ.Common.vc.virtualCanvas("requestInvalidate");
            };

            FormEditCollection.prototype.updateMediaInfo = function () {
                var clearError = true;

                // Using tempSource is less than ideal; however, SkyDrive does not support any permanent link to the file and therefore we will warn users. Future: Create an image cache in the server.
                if (this.contentItem.mediaType == "skydrive-image") {
                    this.backgroundInput.val(this.contentItem.tempSource || "");
                    clearError = false;
                    this.backgroundInput.showError("OneDrive static links are not permanent. Consider hosting it as a public image instead.");
                } else {
                    this.backgroundInput.val(this.contentItem.uri || "");
                }

                this.updateCollectionTheme(clearError);
            };

            FormEditCollection.prototype.show = function () {
                CZ.Menus.isDisabled = true;
                CZ.Menus.Refresh();
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("active");
            };

            FormEditCollection.prototype.close = function () {
                var _this = this;
                CZ.Menus.isDisabled = false;
                CZ.Menus.Refresh();
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.backgroundInput.hideError();
                        _this.mediaList.remove();
                    }
                });

                this.backgroundInput.hideError();
                this.updateCollectionThemeFromTheme(this.activeCollectionTheme);
            };
            return FormEditCollection;
        })(CZ.UI.FormUpdateEntity);
        UI.FormEditCollection = FormEditCollection;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
﻿/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/settings.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormManageEditors = (function (_super) {
            __extends(FormManageEditors, _super);
            function FormManageEditors(container, formInfo) {
                _super.call(this, container, formInfo);

                // populate list of existing editors
                CZ.Service.getMembers().done(function (data) {
                    if (data.length == 0) {
                        $('#tblDelEditors tbody').html('<tr class="none"><td colspan="2" class="cz-lightgray center">&mdash; None &mdash;</td></tr>');
                    } else {
                        $('#tblDelEditors tbody').html('');
                        data.forEach(function (member) {
                            $('#tblDelEditors tbody').append('<tr data-id="' + member.Id + '">' + '<td class="delete" title="Remove Editor"></td>' + '<td title="' + member.DisplayName + '">' + member.DisplayName + '</td>' + '</tr>');
                        });
                    }
                });

                // populate search results every time find input is altered
                $('#tblAddEditors input[type="search"]').off('input').on('input', function (event) {
                    var _this = this;
                    CZ.Service.findUsers($(this).val()).done(function (data) {
                        $(_this).closest('table').find('tbody').html('');
                        $(_this).closest('tr').find('input[type="checkbox"]').prop('checked', false);
                        data.forEach(function (user) {
                            $('#tblAddEditors tbody').append('<tr data-id="' + user.Id + '">' + '<td class="select" title="Select/Unselect This User"><input type="checkbox" /></td>' + '<td title="' + user.DisplayName + '">' + user.DisplayName + '</td>' + '</tr>');
                        });
                        if (data.length == 0) {
                            $(_this).closest('table').find('tfoot').hide();
                        } else {
                            $(_this).closest('table').find('tfoot').show();
                        }
                    });
                });

                // send chosen list of user ids when save button is clicked
                $('#auth-edit-collection-editors .cz-form-save').off().click(function (event) {
                    var userIds = new Array();

                    $('#tblDelEditors tbody tr:not(.none)').each(function (index) {
                        userIds.push($(this).attr('data-id'));
                    });

                    CZ.Service.putMembers(CZ.Service.superCollectionName, CZ.Service.collectionName, userIds).always(function () {
                        $('#auth-edit-collection-editors').hide();
                    });
                });
            }
            return FormManageEditors;
        })(UI.FormUpdateEntity);
        UI.FormManageEditors = FormManageEditors;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormHeaderEdit = (function (_super) {
            __extends(FormHeaderEdit, _super);
            // We only need to add additional initialization in constructor.
            function FormHeaderEdit(container, formInfo) {
                _super.call(this, container, formInfo);

                this.createTimelineBtn = this.container.find(formInfo.createTimeline);
                this.createExhibitBtn = this.container.find(formInfo.createExhibit);
                this.createTourBtn = this.container.find(formInfo.createTour);

                this.initialize();
            }
            FormHeaderEdit.prototype.initialize = function () {
                var _this = this;
                this.createTimelineBtn.off();
                this.createExhibitBtn.off();
                this.createTourBtn.off();

                this.createTimelineBtn.click(function (event) {
                    CZ.Authoring.UI.createTimeline();
                    _this.close();
                });

                this.createExhibitBtn.click(function (event) {
                    CZ.Authoring.UI.createExhibit();
                    _this.close();
                });

                this.createTourBtn.click(function (event) {
                    CZ.Authoring.UI.createTour();
                    _this.close();
                });
            };

            FormHeaderEdit.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };

            FormHeaderEdit.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            return FormHeaderEdit;
        })(CZ.UI.FormBase);
        UI.FormHeaderEdit = FormHeaderEdit;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
﻿/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../ui/media/skydrive-mediapicker.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditProfile = (function (_super) {
            __extends(FormEditProfile, _super);
            function FormEditProfile(container, formInfo) {
                _super.call(this, container, formInfo);
                this.saveButton = container.find(formInfo.saveButton);
                this.logoutButton = container.find(formInfo.logoutButton);
                this.usernameInput = container.find(formInfo.usernameInput);
                this.emailInput = container.find(formInfo.emailInput);
                this.agreeInput = container.find(formInfo.agreeInput);
                this.loginPanel = $(document.body).find(formInfo.loginPanel).first();
                this.profilePanel = $(document.body).find(formInfo.profilePanel).first();
                this.loginPanelLogin = $(document.body).find(formInfo.loginPanelLogin).first();
                this.allowRedirect = formInfo.allowRedirect;

                this.usernameInput.off("keypress");
                this.emailInput.off("keypress");

                this.initialize();
            }
            FormEditProfile.prototype.validEmail = function (e) {
                // Maximum length is 254: http://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
                if (String(e).length > 254)
                    return false;
                var filter = /^([\w^_]+((?:([-_.\+][\w^_]+)|))+|(xn--[\w^_]+))@([\w^_]+(?:(-+[\w^_]+)|)|(xn--[\w^_]+))(?:\.([\w^_]+(?:([\w-_\.\+][\w^_]+)|)|(xn--[\w^_]+)))$/i;
                return String(e).search(filter) != -1;
            };

            FormEditProfile.prototype.validUsername = function (e) {
                var filter = /^[a-z0-9\-_]{4,20}$/i;
                return String(e).search(filter) != -1;
            };

            FormEditProfile.prototype.initialize = function () {
                var _this = this;
                var profile = CZ.Service.getProfile();

                profile.done(function (data) {
                    if (data.DisplayName != null) {
                        _this.usernameInput.val(data.DisplayName);
                        if (data.DisplayName != "") {
                            _this.usernameInput.prop('disabled', true);
                        }
                        _this.emailInput.val(data.Email);
                        if (data.Email !== undefined && data.Email !== '' && data.Email != null) {
                            _this.agreeInput.attr('checked', 'true');
                            _this.agreeInput.prop('disabled', true);
                        }
                    }
                });

                this.saveButton.click(function (event) {
                    var isValid = _this.validUsername(_this.usernameInput.val());
                    if (!isValid) {
                        alert("Provided incorrect username, \n'a-z', '0-9', '-', '_' - characters allowed only. ");
                        return;
                    }

                    var emailAddress = "";
                    if (_this.emailInput.val()) {
                        var emailIsValid = _this.validEmail(_this.emailInput.val());
                        if (!emailIsValid) {
                            alert("Provided incorrect email address");
                            return;
                        }

                        var agreeTerms = _this.agreeInput.prop("checked");
                        if (!agreeTerms) {
                            alert("Please agree with provided terms");
                            return;
                        }

                        emailAddress = _this.emailInput.val();
                    }

                    CZ.Service.getProfile().done(function (curUser) {
                        CZ.Service.getProfile(_this.usernameInput.val()).done(function (getUser) {
                            if (curUser.DisplayName == null && typeof getUser.DisplayName != "undefined") {
                                //such username exists
                                alert("Sorry, this username is already in use. Please try again.");
                                return;
                            }
                            CZ.Service.putProfile(_this.usernameInput.val(), emailAddress).then(function (success) {
                                if (_this.allowRedirect) {
                                    window.location.assign("/" + success);
                                } else {
                                    _this.close();
                                }
                            }, function (error) {
                                alert("Unable to save changes. Please try again later.");
                                console.log(error);
                            });
                        });
                    });
                });

                this.logoutButton.click(function (event) {
                    WL.logout();
                    window.location.assign("/pages/logoff.aspx");
                });

                // Prevent default behavior of Enter key for input elements.
                var preventEnterKeyPress = function (event) {
                    if (event.which == 13) {
                        event.preventDefault();
                    }
                };
                this.usernameInput.keypress(preventEnterKeyPress);
                this.emailInput.keypress(preventEnterKeyPress);
            };

            FormEditProfile.prototype.show = function () {
                CZ.Menus.isDisabled = true;
                CZ.Menus.Refresh();
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.activationSource.addClass("active");
            };

            FormEditProfile.prototype.close = function () {
                CZ.Menus.isDisabled = false;
                CZ.Menus.Refresh();
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.activationSource.removeClass("active");
            };
            return FormEditProfile;
        })(CZ.UI.FormUpdateEntity);
        UI.FormEditProfile = FormEditProfile;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
﻿/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormLogin = (function (_super) {
            __extends(FormLogin, _super);
            function FormLogin(container, formInfo) {
                _super.call(this, container, formInfo);
            }
            FormLogin.prototype.show = function () {
                //CZ.Menus.isDisabled = true;
                //CZ.Menus.Refresh();
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            FormLogin.prototype.close = function () {
                //CZ.Menus.isDisabled = false;
                //CZ.Menus.Refresh();
                sessionStorage.removeItem('showMyCollections');
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            return FormLogin;
        })(CZ.UI.FormBase);
        UI.FormLogin = FormLogin;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
﻿/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormLogoutProfile = (function (_super) {
            __extends(FormLogoutProfile, _super);
            function FormLogoutProfile(container, formInfo) {
                _super.call(this, container, formInfo);
            }
            FormLogoutProfile.prototype.show = function () {
                CZ.Menus.isDisabled = true;
                CZ.Menus.Refresh();
                _super.prototype.show.call(this);
                this.activationSource.addClass("active");
            };

            FormLogoutProfile.prototype.close = function () {
                CZ.Menus.isDisabled = false;
                CZ.Menus.Refresh();
                _super.prototype.close.call(this);
                this.activationSource.removeClass("active");
            };
            return FormLogoutProfile;
        })(CZ.UI.FormBase);
        UI.FormLogoutProfile = FormLogoutProfile;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/search.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormHeaderSearch = (function (_super) {
            __extends(FormHeaderSearch, _super);
            function FormHeaderSearch(container, formInfo) {
                _super.call(this, container, formInfo);

                this.searchTextbox = container.find(formInfo.searchTextbox);
                this.searchScope = $('#scope');
                this.searchResultsBox = container.find(formInfo.searchResultsBox);
                this.progressBar = container.find(formInfo.progressBar);
                this.resultSections = container.find(formInfo.resultSections);
                this.resultsCountTextblock = container.find(formInfo.resultsCountTextblock);

                this.initialize();
            }
            FormHeaderSearch.prototype.initialize = function () {
                var _this = this;
                this.fillFormWithSearchResults();

                this.searchResults = [];
                this.progressBar.css("opacity", 0);
                this.hideResultsCount();
                this.clearResultSections();
                this.hideSearchResults();
                this.searchTextbox.off();

                // populate search scope option choices
                CZ.Service.getSearchScopeOptions().done(function (response)
                {
                    _this.searchScope.find('select').html('');

                    for (loop = 0; loop < response.length; loop++)
                    {
                        _this.searchScope.find('select').append(new Option
                        (
                            response[loop].Value,
                            response[loop].Key,
                            response[loop].Key == 1,
                            response[loop].Key == 1
                        ));
                    }
                });

                var onSearchQueryChanged = function (event)
                {
                    if (_this.searchTextbox.val().length < 2) return;

                    clearTimeout(_this.delayedSearchRequest);

                    _this.delayedSearchRequest = setTimeout(function ()
                    {
                        var query = _this.searchTextbox.val();
                        var scope = parseInt(_this.searchScope.find('select').val());
                        query     = _this.escapeSearchQuery(query);
                        _this.showProgressBar();
                        _this.sendSearchQuery(query, scope).then(function (response)
                        {
                            _this.hideProgressBar();
                            _this.searchResults = response;
                            _this.updateSearchResults();
                        }, function (error)
                        {
                            console.log("Error connecting to service: search.\n" + error.responseText);
                        });
                    }, 300);
                };

                this.searchTextbox.on('input search',        onSearchQueryChanged);
                this.searchScope.find('select').on('change', onSearchQueryChanged);

                // NOTE: Workaround for IE9. IE9 doesn't fire 'input' event on backspace/delete buttons.
                //       http://www.useragentman.com/blog/2011/05/12/fixing-oninput-in-ie9-using-html5widgets/
                //       https://github.com/zoltan-dulac/html5Forms.js/blob/master/shared/js/html5Widgets.js
                var isIE9 = (CZ.Settings.ie === 9);
                if (isIE9) {
                    this.searchTextbox.on("keyup", function (event) {
                        switch (event.which) {
                            case 8:
                            case 46:
                                onSearchQueryChanged(event);
                                break;
                        }
                    });
                    this.searchTextbox.on("cut", onSearchQueryChanged);
                }
            };

            FormHeaderSearch.prototype.sendSearchQuery = function (query, scope)
            {
                return (query === "") ? $.Deferred().resolve(null).promise() : CZ.Service.getSearch(query, scope);
            };

            FormHeaderSearch.prototype.updateSearchResults = function () {
                var _this = this;
                this.clearResultSections();

                // Query string is empty. No update.
                if (this.searchResults === null) {
                    this.hideSearchResults();
                    return;
                }

                // No results for this query.
                if (this.searchResults.length === 0) {
                    this.showNoResults();
                    return;
                }

                // There are search results. Show them.
                var resultTypes = {
                    0: "exhibit",
                    1: "timeline",
                    2: "contentItem"
                };

                var sections = {
                    exhibit: $(this.resultSections[1]),
                    timeline: $(this.resultSections[0]),
                    contentItem: $(this.resultSections[2])
                };

                var idPrefixes = {
                    exhibit: "e",
                    timeline: "t",
                    contentItem: ""
                };

                this.searchResults.forEach(function (item)
                {
                    var form        = _this;
                    var resultType  = resultTypes[item.ObjectType];
                    var resultId    = idPrefixes[resultType] + item.Id;
                    var resultTitle = item.Title;
                    var resultURL   = item.ReplacementURL ? item.ReplacementURL : '';

                    sections[resultType].append($('<div></div>',
                    {
                        class:              'cz-form-search-result',
                        title:              'Curator: "' + item.UserName + '". Collection: "' + item.CollectionName + '".',
                        text:               resultTitle,
                        'data-result-id':   resultId,
                        'data-result-type': resultType,
                        'data-result-url':  resultURL,
                        click: function ()
                        {
                            var self = $(this);

                            if (self.attr('data-result-url') == '')
                            {
                                CZ.Search.goToSearchResult(self.attr('data-result-id'), self.attr('data-result-type'));
                                form.close();
                            }
                            else
                            {
                                window.location = self.attr('data-result-url');
                            }
                        }
                    }));
                });

                this.showResultsCount();
                this.showNonEmptySections();
            };

            FormHeaderSearch.prototype.fillFormWithSearchResults = function () {
                // NOTE: Initially the form is hidden. Show it to compute heights and then hide again.
                this.container.show();
                this.searchResultsBox.css("height", "calc(100% - 190px)");
                this.searchResultsBox.css("height", "-moz-calc(100% - 190px)");
                this.searchResultsBox.css("height", "-webkit-calc(100% - 190px)");
                this.searchResultsBox.css("height", "-o-calc(100% - 190px)");
                this.container.hide();
            };

            FormHeaderSearch.prototype.clearResultSections = function () {
                this.resultSections.find("div").remove();
            };

            FormHeaderSearch.prototype.escapeSearchQuery = function (query) {
                return query ? query.replace(/"/g, "") : "";
            };

            FormHeaderSearch.prototype.getResultsCountString = function () {
                var count = this.searchResults.length;
                return count + ((count === 1) ? " Result:" : " Results:");
            };

            FormHeaderSearch.prototype.showProgressBar = function () {
                this.progressBar.animate({
                    opacity: 1
                });
            };

            FormHeaderSearch.prototype.hideProgressBar = function () {
                this.progressBar.animate({
                    opacity: 0
                });
            };

            FormHeaderSearch.prototype.showNonEmptySections = function () {
                this.searchResultsBox.show();
                this.resultSections.show();
                this.resultSections.each(function (i, item) {
                    var results = $(item).find("div");
                    if (results.length === 0) {
                        $(item).hide();
                    }
                });
            };

            FormHeaderSearch.prototype.showNoResults = function () {
                this.searchResultsBox.show();
                this.resultSections.hide();
                this.resultsCountTextblock.show();
                this.resultsCountTextblock.text("No results");
            };

            FormHeaderSearch.prototype.showResultsCount = function () {
                this.searchResultsBox.show();
                this.resultsCountTextblock.show();
                this.resultsCountTextblock.text(this.getResultsCountString());
            };

            FormHeaderSearch.prototype.hideResultsCount = function () {
                this.resultsCountTextblock.hide();
            };

            FormHeaderSearch.prototype.hideSearchResults = function () {
                this.hideResultsCount();
                this.searchResultsBox.hide();
            };

            FormHeaderSearch.prototype.show = function () {
                var _this = this;
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.searchTextbox.focus();
                    }
                });

                this.activationSource.addClass("active");
            };

            FormHeaderSearch.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });

                this.activationSource.removeClass("active");
            };
            return FormHeaderSearch;
        })(CZ.UI.FormBase);
        UI.FormHeaderSearch = FormHeaderSearch;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='controls/formbase.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../scripts/data.ts'/>
/// <reference path='../scripts/cz.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var TimeSeriesDataForm = (function (_super) {
            __extends(TimeSeriesDataForm, _super);
            // We only need to add additional initialization in constructor.
            function TimeSeriesDataForm(container, formInfo) {
                _super.call(this, container, formInfo);

                var existingTimSeriesList = $("#existingTimeSeries");

                if (existingTimSeriesList.children().length == 0) {
                    var preloadedlist;
                    $.ajax({
                        cache: false,
                        type: "GET",
                        async: false,
                        dataType: "JSON",
                        url: '/dumps/timeseries-preloaded.txt',
                        success: function (result) {
                            preloadedlist = result.d;
                        },
                        error: function (xhr) {
                            alert("Error fetching pre-loaded time series chart: " + xhr.responseText);
                        }
                    });

                    preloadedlist.forEach(function (preloaded) {
                        var li = $('<li></li>').css("margin-left", 10).css("margin-bottom", "3px").height(22).appendTo(existingTimSeriesList);

                        var link = $('<a></a>').addClass("cz-form-preloadedrecord").appendTo(li);
                        link.text(preloaded.name);

                        var div = $("<span></span>").addClass("cz-form-preloadedrecord").appendTo(li);
                        div.text("Source:");

                        var sourceDiv = $("<a></a>").addClass("cz-form-preloadedrecord time-series-link").appendTo(li);
                        sourceDiv.text(preloaded.source); 
                        sourceDiv.prop("href", preloaded.link);

                        link.click(function (e) {
                            var data;
                            $.ajax({
                                cache: false,
                                type: "GET",
                                async: false,
                                dataType: "text",
                                url: preloaded.file,
                                success: function (result) {
                                    data = result;
                                },
                                error: function (xhr) {
                                    alert("Error fetching time series data: " + xhr.responseText);
                                }
                            });

                            var dataSet = undefined;

                            try  {
                                dataSet = CZ.Data.csvToDataSet(data, preloaded.delimiter, preloaded.source);
                            } catch (err) {
                                alert(err);
                                return;
                            }

                            CZ.HomePageViewModel.showTimeSeriesChart();
                            CZ.rightDataSet = dataSet;
                            var vp = CZ.Common.vc.virtualCanvas("getViewport");
                            CZ.HomePageViewModel.updateTimeSeriesChart(vp);
                        });
                    });
                }

                this.input = $("#fileLoader");
                var that = this;

                $("#fileLoader").change(function () {
                    var fl = $("#fileLoader");
                    $("#selectedFile").text(fl[0].files[0].name);
                });

                if (this.checkFileLoadCompatibility()) {
                    $("#loadDataBtn").click(function () {
                        var fr = that.openFile({
                            "onload": function (e) {
                                that.updateUserData(fr.result); // this -> FileReader
                            }
                        });
                    });
                } else {
                    $("#uploadDataCnt").hide();
                }
            }
            TimeSeriesDataForm.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.activationSource.addClass("active");
            };

            TimeSeriesDataForm.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.activationSource.removeClass("active");
            };

            TimeSeriesDataForm.prototype.checkFileLoadCompatibility = function () {
                return window['File'] && window['FileReader'] && window['FileList'] && window['Blob'];
            };

            TimeSeriesDataForm.prototype.openFile = function (callbacks) {
                var file = this.input[0].files[0];
                var fileReader = new FileReader();

                //TODO: add verifivation of input file
                fileReader.onloadstart = callbacks["onloadstart"];
                fileReader.onerror = callbacks["onerror"];
                fileReader.onabort = callbacks["onabort"];
                fileReader.onload = callbacks["onload"];
                fileReader.onloadend = callbacks["onloadend"];

                fileReader.readAsText(file);

                return fileReader;
            };

            TimeSeriesDataForm.prototype.updateUserData = function (csvString) {
                var dataSet = undefined;

                var delimValue = $("#delim").prop("value");
                if (delimValue === "tab")
                    delimValue = "\t";
                else if (delimValue === "space")
                    delimValue = " ";

                try  {
                    dataSet = CZ.Data.csvToDataSet(csvString, delimValue, this.input[0].files[0].name);
                } catch (err) {
                    alert(err);
                    return;
                }

                CZ.HomePageViewModel.showTimeSeriesChart();
                CZ.leftDataSet = dataSet;
                var vp = CZ.Common.vc.virtualCanvas("getViewport");
                CZ.HomePageViewModel.updateTimeSeriesChart(vp);
            };
            return TimeSeriesDataForm;
        })(CZ.UI.FormBase);
        UI.TimeSeriesDataForm = TimeSeriesDataForm;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
﻿/// <reference path='controls/formbase.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../scripts/data.ts'/>
/// <reference path='../scripts/cz.ts'/>
/// <reference path='../scripts/gestures.ts'/>
var CZ;
(function (CZ) {
    (function (UI) {
        var LineChart = (function () {
            function LineChart(container) {
                this.container = container;

                this.canvas = document.createElement("canvas");
                $(this.canvas).prependTo($("#timeSeries"));

                this.canvas.width = container.width();
                this.canvas.height = container.height();

                this.context = this.canvas.getContext("2d");

                $("#closeTimeChartBtn").click(function () {
                    CZ.HomePageViewModel.hideTimeSeriesChart();
                });
            }
            LineChart.prototype.calculateTicks = function (ymin, ymax, labelCount) {
                var delta = (ymax - ymin) / labelCount;
                var h = Math.round(Math.log(delta) / Math.LN10);
                var h10 = Math.pow(10, h);
                var k = delta / h10;
                if (k < 1.5)
                    k = 1;
                else if (k < 3.5)
                    k = 2;
                else
                    k = 5;

                var imin = Math.ceil(ymin / (k * h10));
                var imax = Math.floor(ymax / (k * h10));
                var actualLabelCount = imax - imin + 1;

                if (actualLabelCount < labelCount) {
                    while (true) {
                        var k1 = k;
                        var h1 = h;
                        if (k1 == 5)
                            k1 = 2;
                        else if (k1 == 2)
                            k1 = 1;
                        else {
                            h1--;
                            k1 = 5;
                        }
                        var imin1 = Math.ceil(ymin / (k1 * Math.pow(10, h1)));
                        var imax1 = Math.floor(ymax / (k1 * Math.pow(10, h1)));
                        var actualLabelCount1 = imax1 - imin1 + 1;
                        if (Math.abs(labelCount - actualLabelCount) > Math.abs(labelCount - actualLabelCount1)) {
                            imin = imin1;
                            imax = imax1;
                            k = k1;
                            h = h1;
                            h10 = Math.pow(10, h1);
                        } else
                            break;
                    }
                } else if (actualLabelCount > labelCount) {
                    while (true) {
                        var k1 = k;
                        var h1 = h;
                        if (k1 == 5) {
                            k1 = 1;
                            h1++;
                        } else if (k1 == 2)
                            k1 = 5;
                        else
                            k1 = 2;
                        var imin1 = Math.ceil(ymin / (k1 * Math.pow(10, h1)));
                        var imax1 = Math.floor(ymax / (k1 * Math.pow(10, h1)));
                        var actualLabelCount1 = imax1 - imin1 + 1;
                        if (Math.abs(labelCount - actualLabelCount) > Math.abs(labelCount - actualLabelCount1) && actualLabelCount1 > 0) {
                            imin = imin1;
                            imax = imax1;
                            k = k1;
                            h = h1;
                            h10 = Math.pow(10, h1);
                        } else
                            break;
                    }
                }

                var ticks = [];
                for (var i = imin; i <= imax; i++) {
                    var newTick = i * k * h10;
                    if (h < 0) {
                        newTick = newTick.toPrecision(-h);
                    }

                    ticks.push(newTick);
                }

                var result = {};
                result.ticks = ticks;
                result.h = h;
                result.h10 = h10;

                return result;
            };

            LineChart.prototype.clear = function (screenLeft, screenRight) {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

                this.context.fillStyle = "white";
                this.context.fillRect(screenLeft, 0, screenRight - screenLeft, this.canvas.height);

                var maxLegendWidth = Math.max(24, (screenRight - screenLeft) / 2 - 60);

                $("#rightLegend").css("right", $("#timeSeries").width() - screenRight + 30);
                $("#rightLegend").css("max-width", maxLegendWidth + "px");

                $("#leftLegend").css("left", screenLeft + 30);
                $("#leftLegend").css("max-width", maxLegendWidth + "px");

                $("#timeSeriesChartHeader").text("Time Series Chart");
            };

            LineChart.prototype.drawDataSet = function (dataSet, screenLeft, screenRight, verticalPadding, plotLeft, plotRight, plotTop, plotBottom) {
                var that = this;
                dataSet.series.forEach(function (seria) {
                    if (seria.appearanceSettings && seria.appearanceSettings.thickness && seria.appearanceSettings.thickness > verticalPadding) {
                        verticalPadding = seria.appearanceSettings.thickness;
                    }
                });

                var screenHeight = this.canvas.height - 2 * verticalPadding;

                var dataToScreenX = function (x) {
                    return (x - plotLeft) / (plotRight - plotLeft) * (screenRight - screenLeft) + screenLeft;
                };
                var dataToScreenY = function (y) {
                    return verticalPadding + screenHeight * (plotTop - y) / (plotTop - plotBottom);
                };

                var x = dataSet.time;
                var n = x.length;

                var context = this.context;

                // size of the canvas
                var xmin = screenLeft, xmax = screenRight;
                var ymin = 0, ymax = this.canvas.height;

                dataSet.series.forEach(function (seria) {
                    //setup appearance
                    context.strokeStyle = seria.appearanceSettings.stroke;
                    context.lineWidth = seria.appearanceSettings.thickness;

                    //ctx.lineCap = 'round';
                    //drawing line
                    var y = seria.values;

                    context.beginPath();
                    var x1, x2, y1, y2;
                    var i = 0;

                    // Looking for non-missing value
                    var nextValuePoint = function () {
                        for (; i < n; i++) {
                            if (isNaN(x[i]) || isNaN(y[i]))
                                continue;
                            x1 = dataToScreenX(x[i]);
                            y1 = dataToScreenY(y[i]);
                            c1 = that.code(x1, y1, xmin, xmax, ymin, ymax);
                            break;
                        }
                        if (c1 == 0)
                            context.moveTo(x1, y1);
                    };
                    nextValuePoint();

                    var c1, c2, c1_, c2_;
                    var dx, dy;
                    var x2_, y2_;
                    var m = 1;
                    for (i++; i < n; i++) {
                        if (isNaN(x[i]) || isNaN(y[i])) {
                            if (m == 1) {
                                context.stroke(); // finishing previous segment (it is broken by missing value)
                                var c = that.code(x1, y1, xmin, xmax, ymin, ymax);
                                if (c == 0) {
                                    context.beginPath();
                                    context.arc(x1, y1, seria.appearanceSettings.thickness / 2, 0, 2 * Math.PI);
                                    context.fill();
                                }
                            } else {
                                context.stroke(); // finishing previous segment (it is broken by missing value)
                            }
                            context.beginPath();
                            i++;
                            nextValuePoint();
                            m = 1;
                            continue;
                        }

                        x2_ = x2 = dataToScreenX(x[i]);
                        y2_ = y2 = dataToScreenY(y[i]);
                        if (Math.abs(x1 - x2) < 1 && Math.abs(y1 - y2) < 1)
                            continue;

                        // Clipping and drawing segment p1 - p2:
                        c1_ = c1;
                        c2_ = c2 = that.code(x2, y2, xmin, xmax, ymin, ymax);

                        while (c1 | c2) {
                            if (c1 & c2)
                                break;
                            dx = x2 - x1;
                            dy = y2 - y1;
                            if (c1) {
                                if (x1 < xmin) {
                                    y1 += dy * (xmin - x1) / dx;
                                    x1 = xmin;
                                } else if (x1 > xmax) {
                                    y1 += dy * (xmax - x1) / dx;
                                    x1 = xmax;
                                } else if (y1 < ymin) {
                                    x1 += dx * (ymin - y1) / dy;
                                    y1 = ymin;
                                } else if (y1 > ymax) {
                                    x1 += dx * (ymax - y1) / dy;
                                    y1 = ymax;
                                }
                                c1 = that.code(x1, y1, xmin, xmax, ymin, ymax);
                            } else {
                                if (x2 < xmin) {
                                    y2 += dy * (xmin - x2) / dx;
                                    x2 = xmin;
                                } else if (x2 > xmax) {
                                    y2 += dy * (xmax - x2) / dx;
                                    x2 = xmax;
                                } else if (y2 < ymin) {
                                    x2 += dx * (ymin - y2) / dy;
                                    y2 = ymin;
                                } else if (y2 > ymax) {
                                    x2 += dx * (ymax - y2) / dy;
                                    y2 = ymax;
                                }
                                c2 = that.code(x2, y2, xmin, xmax, ymin, ymax);
                            }
                        }
                        if (!(c1 & c2)) {
                            if (c1_ != 0)
                                context.moveTo(x1, y1);
                            context.lineTo(x2, y2);
                            m++;
                        }

                        x1 = x2_;
                        y1 = y2_;
                        c1 = c2_;
                    }

                    // Final stroke
                    if (m == 1) {
                        context.stroke(); // finishing previous segment (it is broken by missing value)
                        var c = that.code(x1, y1, xmin, xmax, ymin, ymax);
                        if (c == 0) {
                            context.beginPath();
                            context.arc(x1, y1, seria.appearanceSettings.thickness / 2, 0, 2 * Math.PI);
                            context.fill();
                        }
                    } else {
                        context.stroke(); // finishing previous segment (it is broken by missing value)
                    }
                });
            };

            // Clipping algorithms
            LineChart.prototype.code = function (x, y, xmin, xmax, ymin, ymax) {
                var a = x < xmin ? 1 : 0;
                var b = x > xmax ? 1 : 0;
                var c = y < ymin ? 1 : 0;
                var d = y > ymax ? 1 : 0;
                return a << 3 | b << 2 | c << 1 | d;
            };

            LineChart.prototype.generateAxisParameters = function (tickOrigin, secondScreenBorder, ymin, ymax, appearence) {
                var that = this;
                var ticksForDraw = [];
                var verticalPadding = appearence.verticalPadding ? appearence.verticalPadding : 0;
                var screenHeight = this.canvas.height - 2 * verticalPadding;

                var dataToScreenY = function (y) {
                    return verticalPadding + screenHeight * (ymax - y) / (ymax - ymin);
                };
                var plotToScreenY = function (top) {
                    return (ymax - ymin) * (1 - ((top - verticalPadding) / screenHeight)) + ymin;
                };

                var ticks = this.calculateTicks(plotToScreenY(this.canvas.height), plotToScreenY(0), appearence.labelCount).ticks;

                var ctx = this.context;
                ctx.font = appearence.font;
                ctx.textBaseline = 'middle';
                ctx.strokeStyle = appearence.stroke;
                ctx.fillStyle = appearence.stroke;
                ctx.lineWidth = appearence.majorTickThickness;
                var ticklength = appearence.tickLength;
                var textOffset = 2;

                if (appearence.axisLocation == "right") {
                    ticklength = -ticklength;
                    textOffset = -textOffset;
                }

                ctx.textAlign = appearence.axisLocation;

                ticks.forEach(function (tick) {
                    var tickForDraw = {};
                    tickForDraw.tick = tick;

                    var y = dataToScreenY(tick);
                    tickForDraw.y = y;
                    tickForDraw.xLineStart = tickOrigin;
                    tickForDraw.xLineEnd = tickOrigin + ticklength;
                    tickForDraw.xText = tickOrigin + ticklength + textOffset;

                    var textWidth = ctx.measureText(tick).width;
                    if (appearence.axisLocation == "right") {
                        textWidth = -textWidth;
                    }
                    var offset = ticklength + textWidth + 2 * textOffset;

                    tickForDraw.isGridLineVisible = offset > 0 && (tickOrigin + offset) <= secondScreenBorder || offset < 0 && (tickOrigin + offset) >= secondScreenBorder;
                    tickForDraw.xGridLineStart = tickOrigin + offset;
                    tickForDraw.xGridLineEnd = secondScreenBorder;

                    ticksForDraw.push(tickForDraw);
                });

                return ticksForDraw;
            };

            LineChart.prototype.drawAxis = function (ticksForDraw, appearence) {
                var that = this;
                var ctx = this.context;
                ctx.font = appearence.font;
                ctx.textBaseline = 'middle';
                ctx.strokeStyle = appearence.stroke;
                ctx.fillStyle = appearence.stroke;
                ctx.lineWidth = appearence.majorTickThickness;
                ctx.textAlign = appearence.axisLocation;

                ticksForDraw.forEach(function (tick) {
                    ctx.strokeStyle = appearence.stroke;
                    ctx.beginPath();
                    ctx.moveTo(tick.xLineStart, tick.y);
                    ctx.lineTo(tick.xLineEnd, tick.y);
                    ctx.stroke();

                    var minTextOffset = 8;
                    ctx.fillText(tick.tick, tick.xText, Math.max(minTextOffset, Math.min(that.canvas.height - minTextOffset, tick.y)));
                });
            };

            LineChart.prototype.drawHorizontalGridLines = function (ticksForDraw, appearence) {
                var that = this;
                var ctx = this.context;
                ctx.strokeStyle = 'lightgray';
                ctx.lineWidth = appearence.majorTickThickness;

                ticksForDraw.forEach(function (tick) {
                    if (tick.isGridLineVisible) {
                        ctx.beginPath();
                        ctx.moveTo(tick.xGridLineStart, tick.y);
                        ctx.lineTo(tick.xGridLineEnd, tick.y);
                        ctx.stroke();
                    }
                });
            };

            LineChart.prototype.drawVerticalGridLines = function (screenLeft, screenRight, plotLeft, plotRight) {
                var ctx = this.context;
                var verticalTicks = CZ.Common.axis.ticksInfo;
                var height = this.canvas.height;
                ctx.strokeStyle = 'lightgray';
                verticalTicks.forEach(function (tick) {
                    var coord = tick.position;
                    ctx.beginPath();
                    ctx.moveTo(coord, 0);
                    ctx.lineTo(coord, height);
                    ctx.stroke();
                });
            };

            LineChart.prototype.updateCanvasHeight = function () {
                $("#timeSeries").height($("#timeSeriesContainer").height() - 36);
                this.canvas.height = $("#timeSeries").height();
                this.canvas.width = $("#timeSeries").width();
            };

            LineChart.prototype.clearLegend = function (location) {
                var legendCnt = location === "left" ? $("#leftLegend") : $("#rightLegend");
                var legend = location === "left" ? $("#leftLegendList") : $("#rightLegendList");
                legend.empty();
                legendCnt.hide();
            };

            LineChart.prototype.addLegendRecord = function (location, stroke, description) {
                var legend = location === "left" ? $("#leftLegendList") : $("#rightLegendList");
                var legendCont = location === "left" ? $("#leftLegend") : $("#rightLegend");

                legendCont.show();
                var cont = $('<li></li>');
                var strokeIndicatior = $('<div></div>').addClass("tsc-legend-indicator");
                strokeIndicatior.css("background-color", stroke);

                var descriptionDiv = $('<div></div>').addClass("tsc-legend-description");
                descriptionDiv.css("max-width", parseFloat(legendCont.css("max-width")) - 24);
                descriptionDiv.text(description);

                strokeIndicatior.appendTo(cont);
                descriptionDiv.appendTo(cont);
                cont.height(24).appendTo(legend);
            };

            LineChart.prototype.checkLegendVisibility = function (screenWidth) {
                var baseIndicatorSize = 24;
                var horOffset = 30;
                var topOffset = 10;
                return screenWidth >= baseIndicatorSize + horOffset && this.canvas.height >= baseIndicatorSize + topOffset;
            };
            return LineChart;
        })();
        UI.LineChart = LineChart;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path="../scripts/authoring.ts" />
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../ui/controls/listboxbase.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var TourListBox = (function (_super) {
            __extends(TourListBox, _super);
            function TourListBox(container, listItemContainer, contentItems, takeTour, editTour) {
                this.takeTour = takeTour;
                this.editTour = editTour;

                var listBoxInfo = {
                    context: contentItems,
                    sortableSettings: null
                };

                var listItemsInfo = {
                    default: {
                        container: listItemContainer,
                        uiMap: {
                            closeButton: ".cz-listitem-close-btn",
                            iconImg: ".cz-contentitem-listitem-icon > img",
                            titleTextblock: ".cz-contentitem-listitem-title",
                            typeTextblock: ".cz-contentitem-listitem-highlighted"
                        }
                    }
                };

                listItemsInfo.default.ctor = TourListItem;
                _super.call(this, container, listBoxInfo, listItemsInfo);
            }
            Object.defineProperty(TourListBox.prototype, "TakeTour", {
                get: function () {
                    return this.takeTour;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TourListBox.prototype, "EditTour", {
                get: function () {
                    return this.editTour;
                },
                enumerable: true,
                configurable: true
            });
            return TourListBox;
        })(UI.ListBoxBase);
        UI.TourListBox = TourListBox;

        var TourListItem = (function (_super) {
            __extends(TourListItem, _super);
            function TourListItem(parent, container, uiMap, context) {
                if (!context)
                    throw "Tour list item's context is undefined";
                _super.call(this, parent, container, uiMap, context);

                this.iconImg = this.container.find(uiMap.iconImg);
                this.titleTextblock = this.container.find(uiMap.titleTextblock);
                this.descrTextblock = this.container.find(".cz-contentitem-listitem-descr");

                var self = this;
                var thumbUrl = this.data.thumbnailUrl;
                this.iconImg
                    .attr("src", this.data.icon || "/images/Temp-Thumbnail2.png")
                    .css('cursor', 'pointer');
                var img = new Image();
                img.onload = function () {
                    self.iconImg.replaceWith(img);
                };
                img.onerror = function () {
                    if (console && console.warn)
                        console.warn("Could not load a thumbnail image " + thumbUrl);
                };
                img.src = thumbUrl; // fires off loading of image

                this.titleTextblock.text(this.data.title);
                if (this.data.description)
                    this.descrTextblock.text(this.data.description);
                else
                    this.descrTextblock.hide();

                this.container.find('.cz-contentitem-listitem-icon, .cz-tourslist-viewing')
                    .click(function (e) { parent.TakeTour(context);         })
                ;

                this.container.find('.cz-tourslist-editing')
                    .css('display', parent.EditTour ? 'inline' : 'none')
                    .click(function (e) { parent.EditTour(context);         })
                ;

                this.container.find('.cz-tourslist-linking')
                    .click(function (e) { CZ.Tours.showAutoTourURL(context); })
                ;

              //this.container.find('.cz-tourslist-like-fb').attr('href', CZ.Tours.getFacebookURL(context));
                this.container.find('.cz-tourslist-like-tw').attr('href', CZ.Tours.getTwitterURL( context));

            }
            return TourListItem;
        })(UI.ListItemBase);
        UI.TourListItem = TourListItem;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../ui/tour-listbox.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormToursList = (function (_super) {
            __extends(FormToursList, _super);
            // We only need to add additional initialization in constructor.
            function FormToursList(container, formInfo) {
                var _this = this;
                _super.call(this, container, formInfo);
                this.tourAmount = formInfo.tours.length;
                this.takeTour = formInfo.takeTour;
                this.editTour = formInfo.editTour;
                var tours = formInfo.tours.sort(function (a, b) {
                    return a.sequenceNum - b.sequenceNum;
                });
                this.toursListBox = new CZ.UI.TourListBox(container.find("#tours"), formInfo.tourTemplate, formInfo.tours, function (tour) {
                    _this.onTakeTour(tour);
                }, this.editTour ? function (tour) {
                    _this.onEditTour(tour);
                } : null);
                this.createTourBtn = this.container.find(formInfo.createTour);

                if (CZ.Settings.isAuthorized && (CZ.Settings.userDisplayName === CZ.Settings.collectionOwner))
                {
                    $('#cz-tours-list-title').text('My Tours');
                }
                else
                {
                    $('#cz-tours-list-title').text('Tours');
                }

                if (CZ.Settings.isAuthorized && CZ.Authoring.isEnabled)
                {
                    $('#tours-missed-warning').text('Share and present your timeline by creating a tour.');
                    $("#tours-create-button").show();
                }
                else
                {
                    $('#tours-missed-warning').text('There are no tours currently in this collection.');
                    $("#tours-create-button").hide();
                }

                if (formInfo.tours.length != 0) {
                    $("#take-tour-proposal").show();
                    $("#tours-missed-warning").hide();
                } else {
                    $("#take-tour-proposal").hide();
                    $("#tours-missed-warning").show();
                }

                if (formInfo.tours.length == 0)
                    $("#take-tour-proposal").hide();

                if (CZ.Common.isInCosmos()) {
                    $('#tour-cosmos').hide();
                }

                this.initialize();
            }
            FormToursList.prototype.initialize = function () {
                var _this = this;
                this.createTourBtn.click(function (event) {
                    CZ.Authoring.UI.createTour();
                    _this.close();
                });
            };

            FormToursList.prototype.show = function () {
                var self = this;
                $(window).resize(this.onWindowResize);
                this.onWindowResize(null);

                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.activationSource.addClass("active");
            };

            FormToursList.prototype.close = function () {
                var _this = this;
                $(window).unbind("resize", this.onWindowResize);

                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500,
                    complete: function () {
                        _this.container.find("cz-form-errormsg").hide();
                        _this.container.find("#tours").empty();
                        _this.toursListBox.container.empty();
                    }
                });

                CZ.Authoring.isActive = false;

                this.activationSource.removeClass("active");
            };

            FormToursList.prototype.onTakeTour = function (tour) {
                this.close();
                this.takeTour(tour);
            };

            FormToursList.prototype.onEditTour = function (tour) {
                this.close();
                this.editTour(tour);
            };

            FormToursList.prototype.onWindowResize = function (e) {
                var height = $(window).height();
                this.container.height(height - 70);
                this.container.find("#tour-listbox-wrapper").css("max-height", (height - 250) + "px");
            };
            return FormToursList;
        })(CZ.UI.FormBase);
        UI.FormToursList = FormToursList;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
﻿/// <reference path="../scripts/authoring.ts" />
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../ui/controls/listboxbase.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var TourStopListBox = (function (_super) {
            __extends(TourStopListBox, _super);
            function TourStopListBox(container, listItemContainer, contentItems) {
                var listBoxInfo = {
                    context: contentItems,
                    sortableSettings: {
                        forcePlaceholderSize: true,
                        cursor: "move",
                        placeholder: "cz-listbox-placeholder",
                        revert: 100,
                        opacity: 0.75,
                        tolerance: "pointer",
                        scroll: false,
                        start: function (event, ui) {
                            ui.placeholder.height(ui.item.height());
                        }
                    }
                };

                var listItemsInfo = {
                    default: {
                        container: listItemContainer,
                        uiMap: {
                            closeButton: ".cz-listitem-close-btn",
                            iconImg: ".cz-form-tour-contentitem-listitem-icon > img",
                            titleTextblock: ".cz-contentitem-listitem-title",
                            typeTextblock: ".cz-contentitem-listitem-highlighted"
                        }
                    }
                };

                listItemsInfo.default.ctor = TourStopListItem;
                _super.call(this, container, listBoxInfo, listItemsInfo);
            }
            return TourStopListBox;
        })(UI.ListBoxBase);
        UI.TourStopListBox = TourStopListBox;

        var TourStopListItem = (function (_super) {
            __extends(TourStopListItem, _super);
            function TourStopListItem(parent, container, uiMap, context) {
                _super.call(this, parent, container, uiMap, context);

                this.iconImg = this.container.find(uiMap.iconImg);
                this.titleTextblock = this.container.find(uiMap.titleTextblock);
                this.typeTextblock = this.container.find(uiMap.typeTextblock);

                var self = this;

                var lapse = this.container.find(".cz-tourstop-lapse");
                var descr = this.container.find(".cz-tourstop-description");

                lapse.val(self.data.lapseTime);
                descr.text(self.data.Description);

                lapse.change(function (ev) {
                    self.data.lapseTime = self.LapseTime;
                });

                descr.change(function (ev) {
                    self.data.Description = self.Description;
                });

                var thumbUrl = this.data.ThumbnailUrl;
                var img = new Image();
                img.onload = function () {
                    self.iconImg.replaceWith(img);
                };
                img.onerror = function () {
                    if (console && console.warn)
                        console.warn("Could not load a thumbnail image " + thumbUrl);
                };
                img.src = thumbUrl; // fires off loading of image

                this.titleTextblock.text(this.data.Title);
                this.typeTextblock.text(this.data.Type);

                this.Activate();
                this.container.click(function (e) {
                    self.Activate();
                });

                this.container.dblclick(function (e) {
                    if (typeof context.Target.vc == "undefined")
                        return;
                    var vp = context.Target.vc.getViewport();
                    var visible = CZ.VCContent.getVisibleForElement(context.Target, 1.0, vp, true);
                    var target = {
                        newvisible: visible,
                        element: context.Target
                    };
                    CZ.Search.navigateToElement(target);
                });
            }
            Object.defineProperty(TourStopListItem.prototype, "LapseTime", {
                get: function () {
                    var element = this.container.find('.cz-tourstop-lapse');
                    var rv = parseInt('0' + element.val());
                    if (rv > 3600)
                        rv = 3600; // max 1 hour
                    return rv;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TourStopListItem.prototype, "Description", {
                get: function () {
                    var descr = this.container.find(".cz-tourstop-description");
                    return descr.val();
                },
                enumerable: true,
                configurable: true
            });
            
            TourStopListItem.prototype.Activate = function () {
                var selectedStop = this.container.find('.cz-tourstop-detailblock');
                this.parent.container.find('.cz-tourstop-detailblock').not(selectedStop).hide();
                selectedStop
                    .show(500)
                    .find('.cz-tourstop-lapse')
                        .autoNumeric('destroy')
                        .autoNumeric('init');
            };
            return TourStopListItem;
        })(UI.ListItemBase);
        UI.TourStopListItem = TourStopListItem;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/tours.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var TourPlayer = (function () {
            function TourPlayer(container, playerInfo) {
                this.container = container;
                this.tour = playerInfo.context;

                this.playPauseButton = this.container.find(playerInfo.playPauseButton);
                this.nextButton = this.container.find(playerInfo.nextButton);
                this.prevButton = this.container.find(playerInfo.prevButton);
                this.volButton = this.container.find(playerInfo.volButton);

                this.playPauseButton.off();
                this.nextButton.off();
                this.prevButton.off();
                this.volButton.off();

                this.initialize();
            }
            TourPlayer.prototype.initialize = function () {
                var _this = this;
                this.playPauseButton.attr("state", "pause");
                this.volButton.attr("state", "on");

                this.playPauseButton.click(function (event) {
                    var state = _this.playPauseButton.attr("state");

                    var stateHandlers = {
                        play: function () {
                            _this.play();
                        },
                        pause: function () {
                            _this.pause();
                        }
                    };

                    stateHandlers[state]();
                });

                this.nextButton.click(function (event) {
                    _this.next();
                });

                this.prevButton.click(function (event) {
                    _this.prev();
                });

                this.volButton.click(function (event) {
                    var state = _this.volButton.attr("state");

                    var stateHandlers = {
                        on: function () {
                            _this.volumeOff();
                        },
                        off: function () {
                            _this.volumeOn();
                        }
                    };

                    stateHandlers[state]();
                });
            };

            TourPlayer.prototype.play = function () {
                this.playPauseButton.attr("state", "pause");
                CZ.Tours.tourResume();
            };

            TourPlayer.prototype.pause = function () {
                this.playPauseButton.attr("state", "play");
                CZ.Tours.tourPause();
            };

            TourPlayer.prototype.next = function () {
                CZ.Tours.tourNext();
            };

            TourPlayer.prototype.prev = function () {
                CZ.Tours.tourPrev();
            };

            TourPlayer.prototype.exit = function () {
                CZ.Tours.tourAbort();
            };

            TourPlayer.prototype.volumeOn = function () {
                this.volButton.attr("state", "on");
                CZ.Tours.isNarrationOn = true;
                this.tour.audioElement.volume = 1;
            };

            TourPlayer.prototype.volumeOff = function () {
                this.volButton.attr("state", "off");
                CZ.Tours.isNarrationOn = false;
                this.tour.audioElement.volume = 0;
            };
            return TourPlayer;
        })();
        UI.TourPlayer = TourPlayer;

        var FormTourCaption = (function (_super) {
            __extends(FormTourCaption, _super);
            function FormTourCaption(container, formInfo) {
                _super.call(this, container, formInfo);

                this.minButton = this.container.find(formInfo.minButton);
                this.captionTextarea = this.container.find(formInfo.captionTextarea);
                this.tourPlayerContainer = this.container.find(formInfo.tourPlayerContainer);
                this.bookmarksCount = this.container.find(formInfo.bookmarksCount);
                this.tour = formInfo.context;
                this.tourPlayer = new CZ.UI.TourPlayer(this.tourPlayerContainer, {
                    playPauseButton: "div:nth-child(2)",
                    nextButton: "div:nth-child(3)",
                    prevButton: "div:nth-child(1)",
                    volButton: "div:nth-child(4)",
                    context: this.tour
                });

                this.minButton.off();

                this.initialize();
            }
            FormTourCaption.prototype.initialize = function () {
                var _this = this;
                this.titleTextblock.text(this.tour.title);
                this.bookmarksCount.text("Slide 1 of " + this.tour.bookmarks.length);
                this.captionTextarea.css("opacity", 0);
                this.isMinimized = false;

                this.minButton.click(function (event) {
                    _this.minimize();
                });
            };

            FormTourCaption.prototype.hideBookmark = function () {
                this.captionTextarea.css("opacity", 0);
            };

            FormTourCaption.prototype.showBookmark = function (bookmark)
            {
                bookmark.text = bookmark.text || '';
                this.captionTextarea.html(marked(bookmark.text));
                this.bookmarksCount.text("Slide " + bookmark.number + " of " + this.tour.bookmarks.length);
                this.captionTextarea.stop();
                this.captionTextarea.animate({
                    opacity: 1
                });
            };

            FormTourCaption.prototype.showTourEndMessage = function () {
                this.captionTextarea.text(CZ.Tours.TourEndMessage);
                this.bookmarksCount.text("Start a tour");
            };

            FormTourCaption.prototype.setPlayPauseButtonState = function (state) {
                this.tourPlayer.playPauseButton.attr("state", state);
            };

            FormTourCaption.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("active");
            };

            FormTourCaption.prototype.close = function () {
                var _this = this;
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.tourPlayer.exit();

                        // Enable hashchange event.
                        CZ.Common.hashHandle = true;
                    }
                });

                this.activationSource.removeClass("active");
            };

            FormTourCaption.prototype.minimize = function () {
                if (this.isMinimized) {
                    this.contentContainer.show({
                        effect: "slide",
                        direction: "up",
                        duration: 500
                    });
                } else {
                    this.contentContainer.hide({
                        effect: "slide",
                        direction: "up",
                        duration: 500
                    });
                }

                this.isMinimized = !this.isMinimized;
            };
            return FormTourCaption;
        })(CZ.UI.FormBase);
        UI.FormTourCaption = FormTourCaption;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
﻿/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../ui/controls/formbase.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var MessageWindow = (function (_super) {
            __extends(MessageWindow, _super);
            function MessageWindow(container, message, title) {
                _super.call(this, container, {
                    activationSource: null,
                    prevForm: null,
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    contentContainer: ".cz-form-content"
                });

                this.tourTitleInput = this.container.find(".cz-form-label");
                this.titleTextblock.text(title || "ChronoZoom");
                this.tourTitleInput.text(message);
                this.setHeight();
            }
            MessageWindow.prototype.show = function () {
                var _this = this;
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 300,
                    complete: function () {
                        $(document).on("keyup", _this.onDocumentKeyPress);
                    }
                });
            };

            MessageWindow.prototype.close = function () {
                var _this = this;
                this.container.find('textarea').hide();
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 300,
                    complete: function () {
                        $(document).off("keyup", _this.onDocumentKeyPress);
                    }
                });
            };

            MessageWindow.prototype.onDocumentKeyPress = function (e) {
                var self = e.data;
                if (e.which == 27 && self.isFormVisible) {
                    self.closeButton.click();
                }
            };

            MessageWindow.prototype.setHeight = function () {
                this.container.show();
                var messageHeight = this.tourTitleInput.outerHeight(true);
                this.contentContainer.height(messageHeight);
                this.container.hide();
            };
            return MessageWindow;
        })(CZ.UI.FormBase);
        UI.MessageWindow = MessageWindow;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/service.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormHeaderSessionExpired = (function (_super) {
            __extends(FormHeaderSessionExpired, _super);
            function FormHeaderSessionExpired(container, formInfo) {
                _super.call(this, container, formInfo);
                this.time = 60;
                this.sessionTimeSpan = container.find(formInfo.sessionTimeSpan);
                this.sessionButton = container.find(formInfo.sessionButton);

                this.initialize();
            }
            FormHeaderSessionExpired.prototype.initialize = function () {
                var _this = this;
                this.sessionButton.click(function () {
                    CZ.Service.getProfile();
                    clearTimeout(_this.timer);
                    _this.time = 60;
                    _this.close();
                    _this.sessionTimeSpan.html(_this.time.toString());
                    CZ.Authoring.resetSessionTimer();
                    return false;
                });
            };

            FormHeaderSessionExpired.prototype.onTimer = function () {
                var _this = this;
                if (this.time > 0) {
                    this.time--;
                    this.sessionTimeSpan.html(this.time.toString());
                    clearTimeout(this.timer);
                    this.timer = setTimeout(function () {
                        _this.onTimer();
                    }, 1000);
                } else {
                    clearTimeout(this.timer);

                    this.close();
                    document.location.href = "/account/logout";
                }
            };
            FormHeaderSessionExpired.prototype.show = function () {
                var _this = this;
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                    }
                });

                this.timer = setTimeout(function () {
                    _this.onTimer();
                }, 1000);
                this.activationSource.addClass("active");
            };

            FormHeaderSessionExpired.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            return FormHeaderSessionExpired;
        })(CZ.UI.FormBase);
        UI.FormHeaderSessionExpired = FormHeaderSessionExpired;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormMediaPicker = (function (_super) {
            __extends(FormMediaPicker, _super);
            function FormMediaPicker(container, mediaPickerContainer, title, formInfo) {
                _super.call(this, container, formInfo);

                this.titleTextblock.text(title);
                this.contentContainer.append(mediaPickerContainer);
                $(this).off();
            }
            FormMediaPicker.prototype.show = function () {
                var _this = this;
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        $(_this).trigger("showcompleted");
                    }
                });

                this.activationSource.addClass("active");
            };

            FormMediaPicker.prototype.close = function () {
                var _this = this;
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        $(_this).trigger("closecompleted");
                    }
                });

                this.activationSource.removeClass("active");
            };
            return FormMediaPicker;
        })(CZ.UI.FormBase);
        UI.FormMediaPicker = FormMediaPicker;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (Overlay) {


        /**********************
         * Private Properties *
         **********************/
        
        var initialized     = false;
        var quantity        = (screen.width >= 1800 || screen.height >= 1800) ? 9 : 6;      // how many tiles to display in featured or recent lists
        var defaultImages   = ['/images/background.jpg',   '/images/default-tile.png'];     // use the default tile background if these are provided by API
        var brightImages    = ['/images/tile-default.jpg', '/images/tile-bighistory.jpg'];  // do not darken the background for tiles with these images
        var cosmosImage     = '/images/tile-bighistory.jpg';
        var $overlay        = $('#overlay');
        var $listWelcome;
        var $listCollections;
        var $listFeatured;
        var $listUpdated;
        var $listFavorites;
        var $templates;
        var $templateCollection;
        var $templateFeatured;
        var $templateTimeline;
        var $templateExhibit;
        var $templateNoFavorite;
        var $templateMarkPublic;



        /******************
         * Public Methods *
         ******************/

        function Initialize()
        {
            $listWelcome        = $overlay.find('#listWelcome');
            $listCollections    = $overlay.find('#listCollections');
            $listFeatured       = $overlay.find('#listFeatured');
            $listUpdated        = $overlay.find('#listUpdated');
            $listFavorites      = $overlay.find('#listFavorites');
            $templateCollection = $overlay.find('#tileCollection').html();
            $templateFeatured   = $overlay.find('#tileFeatured'  ).html();
            $templateTimeline   = $overlay.find('#tileTimeline'  ).html();
            $templateExhibit    = $overlay.find('#tileExhibit'   ).html();
            $templateNoFavorite = $overlay.find('#msgNoFavorite' ).html();
            $templateMarkPublic = $overlay.find('#msgMarkPublic' ).html();

            $('.overlay-list')
                .mouseenter(function (event)
                {
                    $(this).find('.hint').removeClass('hidden');
                })
                .mouseleave(function (event)
                {
                    $(this).find('.hint').addClass('hidden');
                })
            ;

            if (screen.width >= 1024 || screen.height >= 768)
            {
                $('#themePicker option:selected').attr('selected', null);
                $('#themePicker option[value="' + localStorage.getItem('theme') + '"]').attr('selected', 'selected');

                $('#themePicker').change(function (event)
                {
                    var theme = $('#themePicker option:selected').val();

                    $('body')
                    .removeClass(localStorage.getItem('theme'))
                    .addClass(theme);

                    localStorage.setItem('theme', theme);
                });

                $('#themePicker').removeClass('hidden');
            }

            initialized = true;

            populateFeatured(); // never changes during page lifecycle and shown in all views
        }
        Overlay.Initialize = Initialize;


        function Hide()
        {
            if (CZ.Settings.isCosmosCollection)
            {
                $('.header-regimes' ).visible();
            }
            $('.header-breadcrumbs' ).visible();

            $overlay.fadeOut();
        }
        Overlay.Hide = Hide;


        function Show(preferPersonalizedLayout)
        {
            CZ.HomePageViewModel.closeAllForms();
            $('.header-regimes'     ).invisible();
            $('.header-breadcrumbs' ).invisible();

            if (initialized)
            {
                layout(preferPersonalizedLayout);
            }

            $overlay.fadeIn();
        }
        Overlay.Show = Show;


        function ExploreBigHistory()
        {
            if (isInCosmos(window.location.pathname))
            {
                // already in the big history collection
                Hide();                                     // hide overlay
                $('#regime-link-cosmos').trigger('click');  // visually expand out to full view
            }
            else
            {
                // switch to big history as in a different collection
                window.location.href = '/#/t00000000-0000-0000-0000-000000000000@x=0'; // x=0 so don't start with overlay
            }
        }
        Overlay.ExploreBigHistory = ExploreBigHistory;


        function ExploreIntroTour()
        {
            if (isInCosmos(window.location.pathname))
            {
                // already in the big history collection
                if (CZ.Tours.tours.length > 0)
                {
                    // at least the first tour (the one we want) has been initialized so start tour
                    Hide();
                    CZ.Tours.takeTour(CZ.Tours.tours[0]);
                }
            }
            else
            {
                // switch to big history and auto-start tour
                window.location.href = '/#/t00000000-0000-0000-0000-000000000000@auto-tour=cd44d92d-8af3-4c4e-ab28-bf9a9397ea27';
            }
        }
        Overlay.ExploreIntroTour = ExploreIntroTour;



        /*******************
         * Private Methods *
         *******************/

        function layout(preferPersonalizedLayout)
        {
            if
            (
                (typeof CZ.Authoring === 'undefined')   ||
                (typeof CZ.Settings === 'undefined')    ||
                (preferPersonalizedLayout === false)    ||
                (!preferPersonalizedLayout  &&  CZ.Settings.isCosmosCollection) ||
                (!CZ.Authoring.isEnabled    && !CZ.Settings.isAuthorized)
            )
            {
                // home page view

                populateUpdated();

                $listCollections.hide();
                $listFavorites.hide();

                $listWelcome.show();
                $listFeatured.show();
                $listUpdated.show();
            }
            else
            {
                // my collections view

                populateCollections();
                populateFavorites();

                $listWelcome.hide();
                $listUpdated.hide();

                $listCollections.show();
                $listFeatured.show();
                $listFavorites.show();
            }
        }


        function populateFeatured()
        {
            $.getJSON(constants.featuredContentList, function (response)
            {
                var json    = response ? response : [];
                var $list   = $('<div></div>');

                $.each(json, function (index, item)
                {
                    if (index < quantity)
                    {
                        var tile =  $templateFeatured
                                    .replace(new RegExp('{{contentTitle}}', 'g'),   simpleClean(item.Title))
                                    .replace(           '{{collectionCurator}}',    item.Curator)
                                    .replace(           '{{contentBackground}}',    item.Background)
                                    .replace(           '{{contentURL}}',           item.Link)
                        ;
                        $list.append(tile);
                    }
                });

                $listFeatured.find('.overlay-tile').off('click').remove();
                $listFeatured
                    .append($list.html())
                    .find('.overlay-tile').click(function (event)
                    {
                        var newURL = $(this).attr('data-url');

                        if (newURL != '')
                        {
                            window.location.href = newURL;

                            if
                            (
                                window.location.pathname === newURL.split('#')[0] &&
                                (window.location.hash.length > 1 || newURL.indexOf('#') > -1)
                            )
                            {
                                setTimeout(function ()
                                {
                                    // if same page and has # anchor then .href won't reload
                                    // so force reload (using cache) but delay to give .href
                                    // a chance to fire first.
                                    window.location.reload();
                                },  200);
                            }
                        }
                    })
                ;

                loadCustomBackgrounds($listFeatured, false);
            })
            .fail(function ()
            {
                console.log('[ERROR] CZ.Overlay:populateFeatured');
            });
        }


        function populateUpdated()
        {
            CZ.Service.getRecentlyUpdatedExhibits(quantity).then(function (response)
            {
                var json        = response ? response : [];
                var $list       = $('<div></div>');
                var msg         = $templateMarkPublic;

                $.each(json, function (index, item)
                {
                    var year =  CZ.Dates.convertCoordinateToYear(item.Year);
                    var tile =  $templateExhibit
                                .replace(           '{{collectionTitle}}',      simpleClean(item.CollectionName))
                                .replace(           '{{collectionCurator}}',    item.CuratorName)
                                .replace(           '{{exhibitImage}}',         item.CustomBackground)
                                .replace(new RegExp('{{exhibitTitle}}', 'g'),   simpleClean(item.Title))
                                .replace(           '{{exhibitYear}}',          year.year + '&nbsp;' + year.regime)
                                .replace(           '{{exhibitURL}}',           item.Link)
                    ;
                    $list.append(tile);
                });

                if (json.length < quantity || quantity > 6) $list.append(msg);

                $listUpdated.find('.overlay-list-note').remove(); // msg
                $listUpdated.find('.overlay-tile').off('click').remove();
                $listUpdated
                    .append($list.html())
                    .find('.overlay-tile')
                        .click(function (event)
                        {
                            if ($(this).attr('data-url') != '')
                            {
                                window.location.href = $(this).attr('data-url');
                            }
                            Hide();
                        })
                ;

                loadCustomBackgrounds($listUpdated, true);
            },
            function (error)
            {
                console.log('[ERROR] CZ.Overlay:populateUpdated');
            });
        }


        function populateCollections()
        {
            CZ.Service.getEditableCollections(true).then(function (response)
            {
                var json         = response ? response : [];
                var $list        = $('<div></div>');

                $.each(json, function (index, item)
                {
                    var url     = item.TimelineUrl  || '';
                    var image   = item.ImageUrl     || '';

                    if (hasDefaultBackground(image))        image   = '';
                    if (image === '' && isInCosmos(url))    image   = cosmosImage;
                    if (item.CurrentCollection)             url     = '';

                    var tile =  $templateCollection
                                .replace(           '{{collectionURL}}',            url)
                                .replace(           '{{collectionBackground}}',     image)
                                .replace(new RegExp('{{collectionTitle}}', 'g'),    simpleClean(item.Title) || '')
                                .replace(           '{{collectionCurator}}',        item.Author             || '')
                    ;
                    $list.append(tile);
                });

                $listCollections.find('.overlay-tile').off('click').remove();
                $listCollections
                    .append($list.html())
                    .find('.overlay-tile').click(function (event)
                    {
                        if ($(this).attr('data-url') != '')
                        {
                            window.location.href = $(this).attr('data-url');
                        }
                        Hide();
                    })
                ;

                loadCustomBackgrounds($listCollections, true);
            },
            function (error)
            {
                console.log('[ERROR] CZ.Overlay:populateCollections');
            });
        }


        function populateFavorites()
        {
            CZ.Service.getUserFavorites().then(function (response)
            {
                var json         = response ? response : [];
                var $list        = $('<div></div>');

                $.each(json, function (index, item)
                {
                    var image   = item.CustomBackground || '';

                    if (hasDefaultBackground(image))    image   = '';
                    if (item.IsCosmosCollection)        image   = cosmosImage;

                    var tile =  $templateTimeline
                                .replace(new RegExp('{{timelineTitle}}', 'g'),  simpleClean(item.Title)             || '')
                                .replace(           '{{timelineURL}}',          item.Link                           || '')
                                .replace(           '{{collectionBackground}}', image)
                                .replace(           '{{collectionTitle}}',      simpleClean(item.CollectionName)    || '')
                                .replace(           '{{collectionCurator}}',    item.CuratorName                    || '')
                    ;
                    $list.append(tile);
                });

                if (json.length === 0)
                {
                    var tile =  $templateTimeline
                                .replace(new RegExp('{{timelineTitle}}', 'g'),  'Big Bang to Present Day')
                                .replace(           '{{timelineURL}}',          '/#/t00000000-0000-0000-0000-000000000000@x=0')
                                .replace(           '{{collectionBackground}}', cosmosImage)
                                .replace(           '{{collectionTitle}}',      'Cosmos')
                                .replace(           '{{collectionCurator}}',    'ChronoZoom')
                    ;
                    var msg  = $templateNoFavorite;
                    $list
                        .append(tile)
                        .append(msg)
                    ;
                }

                $listFavorites.find('.overlay-list-note').remove(); // msg
                $listFavorites.find('.overlay-tile').off('click').remove();
                $listFavorites
                    .append($list.html())
                    .find('.overlay-tile').click(function (event)
                    {
                        if ($(this).attr('data-url') != '')
                        {
                            window.location.href = $(this).attr('data-url');
                        }
                        Hide();
                    })
                ;

                loadCustomBackgrounds($listFavorites);
            },
            function (error)
            {
                console.log('[ERROR] CZ.Overlay:populateFavorites');
            });
        }


        this.hasBrightBackground =
        function hasBrightBackground(imageURL)
        {
            if (typeof imageURL != 'string') return true;

            return $.inArray(imageURL.toLowerCase(), brightImages) > -1;
        };

        this.hasDefaultBackground =
        function hasDefaultBackground(imageURL)
        {
            if (typeof imageURL != 'string') return true;

            return $.inArray(imageURL.toLowerCase(), defaultImages) > -1;
        };


        this.isInCosmos =
        function isInCosmos(url)
        {
            if (typeof url != 'string') return false;

            var path    = url.toLowerCase().split('#')[0];
            var matches = ['/', '/chronozoom', '/chronozoom/', '/chronozoom/cosmos', '/chronozoom/cosmos/'];

            return $.inArray(path, matches) > -1;
        };


        function loadCustomBackgrounds($list, darken)
        {
            darken = (darken === true) || false;

            $list.find('.overlay-tile:not([data-image=""])').each(function (index, tile)
            {
                var $tile = $(tile);

                if ($tile.attr('data-image') || '' != '')
                {
                    if (darken && !hasBrightBackground($tile.attr('data-image')))
                    {
                        // use rgba gradient to darken provided custom background image
                        $tile
                        .css('background', 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(' + $tile.attr('data-image') + ')')
                        .css('background-size', 'cover') // do not combine with .css('background') call - this way browser will recalc scale
                        .attr('data-image', '');
                    }
                    else
                    {
                        // embed provided custom background image as is without darkening
                        $tile
                        .css('background', '#445 url(' + $tile.attr('data-image') + ')')
                        .css('background-size', 'cover') // do not combine with .css('background') call - this way browser will recalc scale
                        .attr('data-image', '');
                    }
                }
            });
        }


        function simpleClean(title)
        {
            // DB has collection, timeline and exhibit titles containing double quotes and "<" and ">".
            // Double quotes breaks rendering in title attributes, and "<" or ">" in elements, so this
            // function replaces them. It is NOT a substitute for a full cleansing for XSS, etc.
            if (typeof title === 'undefined') return '';
            return title
                    .replace(new RegExp('<', 'g'), "&lt;")
                    .replace(new RegExp('>', 'g'), "&gt;")
                    .replace(new RegExp('"', 'g'), "&quot;");
        }


    })(CZ.Overlay || (CZ.Overlay = {}));
    var Overlay = CZ.Overlay;
})(CZ || (CZ = {}));/// <reference path='settings.ts'/>
/// <reference path='common.ts'/>
/// <reference path='timescale.ts'/>
/// <reference path='viewport-controller.ts'/>
/// <reference path='gestures.ts'/>
/// <reference path='tours.ts'/>
/// <reference path='virtual-canvas.ts'/>
/// <reference path='uiloader.ts'/>
/// <reference path='media.ts'/>
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../ui/controls/datepicker.ts'/>
/// <reference path='../ui/controls/medialist.ts'/>
/// <reference path='../ui/auth-edit-timeline-form.ts'/>
/// <reference path='../ui/auth-edit-exhibit-form.ts'/>
/// <reference path='../ui/auth-edit-contentitem-form.ts'/>
/// <reference path='../ui/auth-edit-tour-form.ts'/>
/// <reference path='../ui/auth-edit-collection-form.ts'/>
/// <reference path='../ui/auth-edit-collection-editors.ts'/>
/// <reference path='../ui/header-edit-form.ts' />
/// <reference path='../ui/header-edit-profile-form.ts'/>
/// <reference path='../ui/header-login-form.ts'/>
/// <reference path='../ui/header-search-form.ts' />
/// <reference path='../ui/timeseries-graph-form.ts'/>
/// <reference path='../ui/timeseries-data-form.ts'/>
/// <reference path='../ui/tourslist-form.ts'/>
/// <reference path='../ui/tour-caption-form.ts'/>
/// <reference path='../ui/message-window.ts'/>
/// <reference path='../ui/header-session-expired-form.ts'/>
/// <reference path='../ui/mediapicker-form.ts'/>
/// <reference path='typings/jquery/jquery.d.ts'/>
/// <reference path='extensions/extensions.ts'/>
/// <reference path='../ui/media/skydrive-mediapicker.ts'/>
/// <reference path='plugins/error-plugin.ts'/>
/// <reference path='plugins/utility-plugins.ts'/>
var constants;

var CZ;
(function (CZ) {
    CZ.timeSeriesChart;
    CZ.leftDataSet;
    CZ.rightDataSet;

    (function (HomePageViewModel) {
        // Contains mapping of jQuery selector to HTML file, which is used to initialize the various panels via CZ.UILoader.
        var _uiMap =
        {
            "#header-edit-form": "/ui/header-edit-form.html",
            "#auth-edit-timeline-form": "/ui/auth-edit-timeline-form.html",
            "#auth-edit-exhibit-form": "/ui/auth-edit-exhibit-form.html",
            "#auth-edit-contentitem-form": "/ui/auth-edit-contentitem-form.html",
            "$('<div></div>')": "/ui/contentitem-listbox.html",
            "#profile-form": "/ui/header-edit-profile-form.html",
            "#login-form": "/ui/header-login-form.html",
            "#auth-edit-tours-form": "/ui/auth-edit-tour-form.html",
            "$('<div><!--Tours Authoring--></div>')": "/ui/tourstop-listbox.html",
            "#toursList": "/ui/tourslist-form.html",
            "$('<div><!--Tours list item --></div>')": "/ui/tour-listbox.html",
            "#timeSeriesContainer": "/ui/timeseries-graph-form.html",
            "#timeSeriesDataForm": "/ui/timeseries-data-form.html",
            "#message-window": "/ui/message-window.html",
            "#header-search-form": "/ui/header-search-form.html",
            "#header-session-expired-form": "/ui/header-session-expired-form.html",
            "#tour-caption-form": "/ui/tour-caption-form.html",
            "#mediapicker-form": "/ui/mediapicker-form.html",
            "#overlay": "/ui/overlay.html",
            "#auth-edit-collection-form": "/ui/auth-edit-collection-form.html",
            "#auth-edit-collection-editors": "/ui/auth-edit-collection-editors.html"
        };

        HomePageViewModel.sessionForm;
        HomePageViewModel.rootCollection;

        function UserCanEditCollection(profile)
        {
            // can't edit if no profile, no display name or no supercollection
            if (!profile || !profile.DisplayName || !CZ.Service.superCollectionName)
            {
                return false;
            }

            // override - anyone can edit the sandbox
            if (CZ.Service.superCollectionName.toLowerCase() === "sandbox")
            {
                return true;
            }

            // if here then logged in and on a page (other than sandbox) with a supercollection and collection
            // so return canEdit Boolean, which was previously set after looking up permissions in db.
            return CZ.Service.canEdit;
        }

        function InitializeToursUI(profile, forms)
        {
            CZ.Tours.tourCaptionFormContainer = forms[16];
            var allowEditing =UserCanEditCollection(profile);

            CZ.Tours.takeTour = function(tour)
            {
                CZ.HomePageViewModel.closeAllForms();
                CZ.Tours.tourCaptionForm = new CZ.UI.FormTourCaption
                (
                    CZ.Tours.tourCaptionFormContainer,
                    {
                        activationSource: $(),
                        navButton: ".cz-form-nav",
                        closeButton: ".cz-tour-form-close-btn > .cz-form-btn",
                        titleTextblock: ".cz-tour-form-title",
                        contentContainer: ".cz-form-content",
                        minButton: ".cz-tour-form-min-btn > .cz-form-btn",
                        captionTextarea: ".cz-form-tour-caption",
                        tourPlayerContainer: ".cz-form-tour-player",
                        bookmarksCount: ".cz-form-tour-bookmarks-count",
                        narrationToggle: ".cz-toggle-narration",
                        context: tour
                    }
                );
                CZ.Tours.tourCaptionForm.show();
                CZ.Tours.removeActiveTour();
                CZ.Tours.activateTour(tour, undefined);
            };

            CZ.HomePageViewModel.panelShowToursList = function (canEdit)
            {
                // canEdit undefined    = use allowEditing
                // canEdit false        = read only rendering
                // canEdit true         = edit rights rendering
                if (typeof canEdit == 'undefined') canEdit = allowEditing;


                if (canEdit && CZ.Tours.tours)
                {
                    if (CZ.Tours.tours.length === 0)
                    {
                        // if there are no tours to show and user has tour editing rights, lets fire off the add a tour dialog instead
                        CZ.Overlay.Hide();
                        CZ.HomePageViewModel.closeAllForms();
                        CZ.Authoring.UI.createTour();
                        return;
                    }
                }

                var toursListForm = getFormById("#toursList");
                if (toursListForm.isFormVisible)
                {
                    toursListForm.close();
                }
                else
                {
                    CZ.Overlay.Hide();
                    closeAllForms();
                    var form = new CZ.UI.FormToursList
                    (
                        forms[9],
                        {
                            activationSource: $(this),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            tourTemplate: forms[10],
                            tours: CZ.Tours.tours,
                            takeTour: CZ.Tours.takeTour,
                            editTour: canEdit ? function (tour)
                            {
                                if (CZ.Authoring.showEditTourForm) CZ.Authoring.showEditTourForm(tour);
                            }
                            : null,
                            createTour: ".cz-form-create-tour"
                        }
                    );
                    form.show();
                }
            };
        }

        var defaultRootTimeline = { title: "My Timeline", x: 1950, endDate: 9999, children: [], parent: { guid: null } };

        $(document).ready(function () {
            // ensures there will be no 'console is undefined' errors
            window.console = window.console || (function () {
                var c = {};
                c.log = c.warn = c.debug = c.info = c.log = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
                };
                return c;
            })();

            $('.bubbleInfo').hide();

            // auto-hourglass
            $('#wait').hide();

            $(document).ajaxStart(function () {
                $('#wait').show();
            });
            $(document).ajaxStop(function () {
                $('#wait').hide();
            });

            // overlay & general wrapper theme
            var theme = localStorage.getItem('theme') || '';
            if (theme === '')
            {
                theme = 'theme-linen'; // initial
                localStorage.setItem('theme', theme);
            }
            $('body').addClass(theme);

            // populate collection names from URL
            var url = CZ.UrlNav.getURL();
            HomePageViewModel.rootCollection = url.superCollectionName === undefined;
            CZ.Service.superCollectionName = url.superCollectionName;
            CZ.Service.collectionName = url.collectionName;
            CZ.Common.initialContent = url.content;

            // register ChronoZoom extensions
            CZ.Extensions.registerExtensions();

            // register ChronoZoom media pickers
            CZ.Media.SkyDriveMediaPicker.isEnabled = true;
            CZ.Media.initialize();
            CZ.Common.initialize();

            // hook logo click
            $('.header-logo').click(function ()
            {
                //window.location.href = '/';
                CZ.Overlay.Show(false);  // false = home page overlay
            });

            // ensure we have a supercollection for getCanEdit and other API calls.
            if (typeof CZ.Service.superCollectionName === 'undefined' && CZ.Common.isInCosmos()) CZ.Service.superCollectionName = 'chronozoom';

            // check if current user has edit permissions before continuing with load
            // since other parts of load need to know if can display edit buttons etc.
            CZ.Service.getCanEdit().done(function (result)
            {
                CZ.Service.canEdit = (result === true);
                finishLoad();
            });
        });

        function finishLoad()
        {
            // only invoked after user's edit permissions are checked (AJAX callback)
            CZ.UILoader.loadAll(_uiMap).done(function ()
            {
                var forms = arguments;

                CZ.Settings.isCosmosCollection = CZ.Common.isInCosmos();
                if (CZ.Settings.isCosmosCollection) $('.header-regimes').show();

                CZ.Menus.isEditor = CZ.Service.canEdit;
                CZ.Menus.Refresh();
                CZ.Overlay.Initialize();

                CZ.timeSeriesChart = new CZ.UI.LineChart(forms[11]);

                CZ.HomePageViewModel.panelToggleTimeSeries = function ()
                {
                    CZ.Overlay.Hide();
                    var tsForm = getFormById('#timeSeriesDataForm');
                    if (tsForm === false)
                    {
                        closeAllForms();

                        var timeSeriesDataFormDiv = forms[12];
                        var timeSeriesDataForm = new CZ.UI.TimeSeriesDataForm
                        (
                            timeSeriesDataFormDiv,
                            {
                                activationSource: $(),
                                closeButton: ".cz-form-close-btn > .cz-form-btn"
                            }
                        );
                        timeSeriesDataForm.show();
                    }
                    else
                    {
                        if (tsForm.isFormVisible)
                        {
                            tsForm.close();
                        }
                        else
                        {
                            closeAllForms();
                            tsForm.show();
                        }
                    }
                };

                CZ.HomePageViewModel.panelToggleSearch = function ()
                {
                    var searchForm = getFormById("#header-search-form");
                    if (searchForm === false)
                    {
                        closeAllForms();
                        var form = new CZ.UI.FormHeaderSearch
                        (
                            forms[14],
                            {
                                activationSource: $(this),
                                navButton: ".cz-form-nav",
                                closeButton: ".cz-form-close-btn > .cz-form-btn",
                                titleTextblock: ".cz-form-title",
                                searchTextbox: ".cz-form-search-input",
                                searchResultsBox: ".cz-form-search-results",
                                progressBar: ".cz-form-progress-bar",
                                resultSections: ".cz-form-search-results > .cz-form-search-section",
                                resultsCountTextblock: ".cz-form-search-results-count"
                            }
                        );
                        form.show();
                    }
                    else
                    {
                        if (searchForm.isFormVisible)
                        {
                            searchForm.close();
                        }
                        else
                        {
                            closeAllForms();
                            searchForm.show();
                        }
                    }
                };

                $("#editCollectionButton img").click(function () {
                    closeAllForms();
                    var form = new CZ.UI.FormEditCollection(forms[19], {
                        activationSource: $(),
                        navButton: ".cz-form-nav",
                        closeButton: ".cz-form-close-btn > .cz-form-btn",
                        deleteButton: '.cz-form-delete',
                        titleTextblock: ".cz-form-title",
                        saveButton: ".cz-form-save",
                        errorMessage: '.cz-form-errormsg',
                        collectionName: '#cz-collection-name',
                        collectionPath: '#cz-collection-path',
                        collectionTheme: CZ.Settings.theme,
                        backgroundInput: $(".cz-form-collection-background"),
                        kioskmodeInput: $(".cz-form-collection-kioskmode"),
                        mediaListContainer: ".cz-form-medialist",
                        timelineBackgroundColorInput: $(".cz-form-timeline-background"),
                        timelineBackgroundOpacityInput: $(".cz-form-timeline-background-opacity"),
                        timelineBorderColorInput: $(".cz-form-timeline-border"),
                        exhibitBackgroundColorInput: $(".cz-form-exhibit-background"),
                        exhibitBackgroundOpacityInput: $(".cz-form-exhibit-background-opacity"),
                        exhibitBorderColorInput: $(".cz-form-exhibit-border"),
                        chkDefault: '#cz-form-collection-default',
                        chkPublic:  '#cz-form-public-search',
                        chkEditors: '#cz-form-multiuser-enable',
                        btnEditors: '#cz-form-multiuser-manage'
                    });
                    form.show();
                });

                $('body').on('click', '#cz-form-multiuser-manage', function (event) {
                    var form = new CZ.UI.FormManageEditors(forms[20], {
                        activationSource: $(this),
                        navButton: ".cz-form-nav",
                        titleTextblock: ".cz-form-title",
                        closeButton: ".cz-form-close-btn > .cz-form-btn",
                        saveButton: ".cz-form-save"
                    });
                    form.show();
                });

                CZ.Authoring.initialize(CZ.Common.vc, {
                    showMessageWindow: function (message, title, onClose) {
                        var wnd = new CZ.UI.MessageWindow(forms[13], message, title);
                        if (onClose)
                            wnd.container.bind("close", function () {
                                wnd.container.unbind("close", onClose);
                                onClose();
                            });
                        wnd.show();
                    },
                    hideMessageWindow: function () {
                        var wnd = forms[13].data("form");
                        if (wnd)
                            wnd.close();
                    },
                    showEditTourForm: function (tour) {
                        CZ.Tours.removeActiveTour();
                        var form = new CZ.UI.FormEditTour(forms[7], {
                            activationSource: $(),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            addStopButton: ".cz-form-tour-addstop",
                            titleInput: ".cz-form-title",
                            tourStopsListBox: "#stopsList",
                            tourStopsTemplate: forms[8],
                            context: tour
                        });
                        form.show();
                    },
                    showCreateTimelineForm: function (timeline) {
                        CZ.Authoring.hideMessageWindow();
                        CZ.Authoring.mode = "createTimeline";
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $(),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            mediaListContainer: ".cz-form-medialist",
                            backgroundUrl: ".cz-form-background-url",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            errorMessage: ".cz-form-errormsg",
                            context: timeline
                        });
                        form.show();
                    },
                    showCreateRootTimelineForm: function (timeline) {
                        CZ.Authoring.mode = "createRootTimeline";
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $(),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            mediaListContainer: ".cz-form-medialist",
                            backgroundUrl: ".cz-form-background-url",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            errorMessage: ".cz-form-errormsg",
                            context: timeline
                        });
                        form.show();
                    },
                    showEditTimelineForm: function (timeline) {
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $(),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            mediaListContainer: ".cz-form-medialist",
                            backgroundUrl: ".cz-form-background-url",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            errorMessage: ".cz-form-errormsg",
                            context: timeline
                        });
                        form.show();
                    },
                    showCreateExhibitForm: function (exhibit) {
                        CZ.Authoring.hideMessageWindow();
                        var form = new CZ.UI.FormEditExhibit(forms[2], {
                            activationSource: $(),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            titleInput: ".cz-form-item-title",
                            datePicker: ".cz-form-time",
                            createArtifactButton: ".cz-form-create-artifact",
                            contentItemsListBox: ".cz-listbox",
                            errorMessage: ".cz-form-errormsg",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            contentItemsTemplate: forms[4],
                            context: exhibit
                        });
                        form.show();
                    },
                    showEditExhibitForm: function (exhibit) {
                        var form = new CZ.UI.FormEditExhibit(forms[2], {
                            activationSource: $(),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            titleInput: ".cz-form-item-title",
                            datePicker: ".cz-form-time",
                            createArtifactButton: ".cz-form-create-artifact",
                            contentItemsListBox: ".cz-listbox",
                            errorMessage: ".cz-form-errormsg",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            contentItemsTemplate: forms[4],
                            context: exhibit
                        });
                        form.show();
                    },
                    showEditContentItemForm: function (ci, e, prevForm, noAnimation) {
                        var form = new CZ.UI.FormEditCI(forms[3], {
                            activationSource: $(),
                            prevForm: prevForm,
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            errorMessage: ".cz-form-errormsg",
                            saveButton: ".cz-form-save",
                            titleInput: ".cz-form-item-title",
                            mediaSourceInput: ".cz-form-item-mediasource",
                            mediaInput: ".cz-form-item-mediaurl",
                            descriptionInput: ".cz-form-item-descr",
                            attributionInput: ".cz-form-item-attribution",
                            mediaTypeInput: ".cz-form-item-media-type",
                            mediaListContainer: ".cz-form-medialist",
                            context: {
                                exhibit: e,
                                contentItem: ci
                            }
                        });
                        form.show(noAnimation);
                    }
                });

                HomePageViewModel.sessionForm = new CZ.UI.FormHeaderSessionExpired(forms[15], {
                    activationSource: $(),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    titleInput: ".cz-form-item-title",
                    context: "",
                    sessionTimeSpan: "#session-time",
                    sessionButton: "#session-button"
                });

                var loginForm = new CZ.UI.FormLogin
                (
                    forms[6],
                    {
                        activationSource: $(),
                        navButton: ".cz-form-nav",
                        closeButton: ".cz-form-close-btn > .cz-form-btn",
                        titleTextblock: ".cz-form-title",
                        titleInput: ".cz-form-item-title",
                        context: ""
                    }
                );
                CZ.HomePageViewModel.panelToggleLogin = function ()
                {
                    if (loginForm.isFormVisible)
                    {
                        loginForm.close();
                    }
                    else
                    {
                        closeAllForms();
                        loginForm.show();
                    }
                };

                var profileForm = new CZ.UI.FormEditProfile
                (
                    forms[5],
                    {
                        activationSource: $(),
                        navButton: ".cz-form-nav",
                        closeButton: ".cz-form-close-btn > .cz-form-btn",
                        titleTextblock: ".cz-form-title",
                        saveButton: "#cz-form-save",
                        logoutButton: "#cz-form-logout",
                        titleInput: ".cz-form-item-title",
                        usernameInput: ".cz-form-username",
                        emailInput: ".cz-form-email",
                        agreeInput: ".cz-form-agree",
                        loginPanel: "#login-panel",
                        profilePanel: "#profile-panel",
                        loginPanelLogin: "#profile-panel.auth-panel-login",
                        context: "",
                        allowRedirect: true
                    }
                );
                CZ.HomePageViewModel.panelToggleProfile = function ()
                {
                    if (profileForm.isFormVisible)
                    {
                        profileForm.close();
                    }
                    else
                    {
                        closeAllForms();
                        profileForm.show();
                    }
                };

                CZ.Service.getProfile().done(function (data)
                {
                    if (data !== '')
                    {
                        CZ.Settings.isAuthorized            = true;
                        CZ.Menus.isSignedIn                 = true;
                        CZ.Menus.Refresh();
                        CZ.Settings.userSuperCollectionName = data.DisplayName || '';
                        CZ.Settings.userCollectionName      = data.DisplayName || '';
                        CZ.Settings.userDisplayName         = data.DisplayName || '';
                        CZ.Authoring.timer                  = setTimeout(function ()
                        {
                            CZ.Authoring.showSessionForm();
                        }, (CZ.Settings.sessionTime - 60) * 1000);
                    }

                    CZ.Authoring.isEnabled = UserCanEditCollection(data);
                    InitializeToursUI(data, forms);
                })
                .fail(function (error)
                {
                    var canEdit                 = UserCanEditCollection(null);
                    CZ.Authoring.isEnabled      = canEdit;
                    CZ.Settings.isAuthorized    = canEdit;

                    InitializeToursUI(null, forms);
                })
                .always(function ()
                {
                    // *****************************
                    // *** Collection Load Logic ***
                    // *****************************

                    // load the entire collection
                    CZ.Common.loadData().then(function (response)
                    {
                        // if collection is empty
                        if (!response)
                        {
                            // if user has edit rights
                            if (CZ.Authoring.isEnabled)
                            {
                                // show a form to create the root timeline
                                if (CZ.Authoring.showCreateRootTimelineForm)
                                {
                                    CZ.Authoring.showCreateRootTimelineForm(defaultRootTimeline);
                                }
                            }
                            else
                            {
                                // tell the user there is no content
                                CZ.Authoring.showMessageWindow
                                (
                                    'There is no content in this collection yet. '               +
                                    'Please click on the ChronoZoom logo, (found just above this message,) '  +
                                    'to see some other collections that you can view.',
                                    "Collection Has No Content"
                                );
                            }
                        }
                    });

                    // get and store the collection title and owner
                    CZ.Service.getCollection().done(function (collection)
                    {
                        if (collection != null)
                        {
                            CZ.Common.collectionTitle   = collection.Title || '';
                            CZ.Settings.collectionOwner = collection.User.DisplayName;
                        }

                        //  set the canvas edit collection icon title
                        $('#editCollectionButton').find('.title').text(CZ.Common.collectionTitle);
                    });


                    // **************************************
                    // *** Start-Up Overlay Display Logic ***
                    // **************************************

                    // if user can edit collection then unhide the canvas edit collection icon
                    if (CZ.Authoring.isEnabled) $('#editCollectionButton').find('.hidden').removeClass('hidden');

                    // if logged in and user hasn't completed profile
                    if (CZ.Menus.isSignedIn && CZ.Settings.userSuperCollectionName === '')
                    {
                        // show profile form on top of home page overlay
                        CZ.Overlay.Show();
                        profileForm.show();
                        $('#username').focus();
                    }
                    // else if logged in and my collections was requested
                    else if (CZ.Menus.isSignedIn && sessionStorage.getItem('showMyCollections') === 'requested')
                    {
                        // show my collections overlay
                        CZ.Overlay.Show(true);
                    }
                    else
                    {
                        if  // if no auto-tour and collection is Big History collection
                        (
                            CZ.Tours.getAutoTourGUID() === ''   // <--  Always check first as fn must fire.
                            &&                                  //      This fn sets up tours.js's parseTours
                            (                                   //      to auto-start a tour, if specified.
                                (CZ.Settings.isCosmosCollection && window.location.hash === '') ||
                                window.location.hash === '#/t00000000-0000-0000-0000-000000000000'
                            )
                        )
                        {
                            // show home page overlay
                            CZ.Overlay.Show();
                        }
                    }

                    // remove any my collections queued request
                    sessionStorage.removeItem('showMyCollections');

                    // remove splash screen
                    $('#splash').fadeOut('slow');
                });

            });

            CZ.Service.getServiceInformation().then(function (response) {
                CZ.Settings.contentItemThumbnailBaseUri = response.thumbnailsPath;
                CZ.Settings.signinUrlMicrosoft = response.signinUrlMicrosoft;
                CZ.Settings.signinUrlGoogle = response.signinUrlGoogle;
                CZ.Settings.signinUrlYahoo = response.signinUrlYahoo;
            });

            CZ.Settings.applyTheme(null, CZ.Service.superCollectionName != null);

            // If not the default supercollection's default collection then look up the appropriate collection's theme
            if (CZ.Service.superCollectionName)
            {
                CZ.Service.getCollections(CZ.Service.superCollectionName).then(function (response)
                {
                    $(response).each(function (index) {
                        if
                        (
                            response[index] &&
                            (
                                (response[index].Default && ((typeof CZ.Service.collectionName) === 'undefined')) ||
                                (response[index].Path === CZ.Service.collectionName)
                            )
                        )
                        {
                            var themeData = null;
                            try  {
                                themeData = JSON.parse(response[index].theme);
                            } catch (e) {
                            }

                            CZ.Settings.applyTheme(themeData, false);
                        }
                    });
                });
            }

            $('#breadcrumbs-nav-left').click(CZ.BreadCrumbs.breadCrumbNavLeft);
            $('#breadcrumbs-nav-right').click(CZ.BreadCrumbs.breadCrumbNavRight);

            $('#biblCloseButton').mouseout(function () {
                CZ.Common.toggleOffImage('biblCloseButton', 'png');
            }).mouseover(function () {
                CZ.Common.toggleOnImage('biblCloseButton', 'png');
            });

            if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
                // Suppress the default iOS elastic pan/zoom actions.
                document.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                });
            }

            if (navigator.userAgent.indexOf('Mac') != -1) {
                // Disable Mac OS Scrolling Bounce Effect
                var body = document.getElementsByTagName('body')[0];
                body.style.overflow = "hidden";
            }

            // init seadragon. set path to image resources for nav buttons
            Seadragon.Config.imagePath = CZ.Settings.seadragonImagePath;

            if (window.location.hash)
                CZ.Common.startHash = window.location.hash; // to be processes after the data is loaded

            CZ.Search.initializeSearch();
            CZ.Bibliography.initializeBibliography();

            var canvasGestures = CZ.Gestures.getGesturesStream(CZ.Common.vc);
            var axisGestures = CZ.Gestures.applyAxisBehavior(CZ.Gestures.getGesturesStream(CZ.Common.ax));
            var timeSeriesGestures = CZ.Gestures.getPanPinGesturesStream($("#timeSeriesContainer"));
            var jointGesturesStream = canvasGestures.Merge(axisGestures.Merge(timeSeriesGestures));

            CZ.Common.controller = new CZ.ViewportController.ViewportController2(function (visible) {
                var vp = CZ.Common.vc.virtualCanvas("getViewport");
                var markerPos = CZ.Common.axis.markerPosition;
                var oldMarkerPosInScreen = vp.pointVirtualToScreen(markerPos, 0).x;

                CZ.Common.vc.virtualCanvas("setVisible", visible, CZ.Common.controller.activeAnimation);
                CZ.Common.updateAxis(CZ.Common.vc, CZ.Common.ax);
                vp = CZ.Common.vc.virtualCanvas("getViewport");
                if (CZ.Tours.pauseTourAtAnyAnimation) {
                    CZ.Tours.tourPause();
                    CZ.Tours.pauseTourAtAnyAnimation = false;
                }

                var hoveredInfodot = CZ.Common.vc.virtualCanvas("getHoveredInfodot");
                var actAni = CZ.Common.controller.activeAnimation != undefined;

                if (actAni) {
                    var newMarkerPos = vp.pointScreenToVirtual(oldMarkerPosInScreen, 0).x;
                    CZ.Common.updateMarker();
                }

                updateTimeSeriesChart(vp);
            }, function () {
                return CZ.Common.vc.virtualCanvas("getViewport");
            }, jointGesturesStream);

            var hashChangeFromOutside = true;

            // URL Nav: update URL when animation is complete
            CZ.Common.controller.onAnimationComplete.push(function (id) {
                hashChangeFromOutside = false;
                if (CZ.Common.setNavigationStringTo && CZ.Common.setNavigationStringTo.bookmark) {
                    CZ.UrlNav.navigationAnchor = CZ.UrlNav.navStringTovcElement(CZ.Common.setNavigationStringTo.bookmark, CZ.Common.vc.virtualCanvas("getLayerContent"));
                    window.location.hash = CZ.Common.setNavigationStringTo.bookmark;
                } else {
                    if (CZ.Common.setNavigationStringTo && CZ.Common.setNavigationStringTo.id == id)
                        CZ.UrlNav.navigationAnchor = CZ.Common.setNavigationStringTo.element;

                    var vp = CZ.Common.vc.virtualCanvas("getViewport");
                    window.location.hash = CZ.UrlNav.vcelementToNavString(CZ.UrlNav.navigationAnchor, vp);
                }
                CZ.Common.setNavigationStringTo = null;
            });

            // URL Nav: handle URL changes from outside
            window.addEventListener("hashchange", function () {
                if (window.location.hash && hashChangeFromOutside && CZ.Common.hashHandle) {
                    var hash = window.location.hash;
                    var visReg = CZ.UrlNav.navStringToVisible(window.location.hash.substring(1), CZ.Common.vc);
                    if (visReg) {
                        CZ.Common.isAxisFreezed = true;
                        CZ.Common.controller.moveToVisible(visReg, true);

                        // to make sure that the hash is correct (it can be incorrectly changed in onCurrentlyObservedInfodotChanged)
                        if (window.location.hash != hash) {
                            hashChangeFromOutside = false;
                            window.location.hash = hash;
                        }
                    }
                    CZ.Common.hashHandle = true;
                } else
                    hashChangeFromOutside = true;
            });

            /*
            // Axis: enable showing thresholds
            CZ.Common.controller.onAnimationComplete.push(function () {
                //CZ.Common.ax.axis("enableThresholds", true);
                //if (window.console && console.log("thresholds enabled"));
            });

            //Axis: disable showing thresholds
            CZ.Common.controller.onAnimationStarted.push(function () {
                //CZ.Common.ax.axis("enableThresholds", true);
                //if (window.console && console.log("thresholds disabled"));
            });

            // Axis: enable showing thresholds
            CZ.Common.controller.onAnimationUpdated.push(function (oldId, newId) {
                if (oldId != undefined && newId == undefined) {
                    setTimeout(function () {
                        //CZ.Common.ax.axis("enableThresholds", true);
                        //if (window.console && console.log("thresholds enabled"));
                    }, 500);
                }
            });
            */

            //Tour: notifyng tour that the bookmark is reached
            CZ.Common.controller.onAnimationComplete.push(function (id) {
                if (CZ.Tours.tourBookmarkTransitionCompleted != undefined)
                    CZ.Tours.tourBookmarkTransitionCompleted(id);
                if (CZ.Tours.tour != undefined && CZ.Tours.tour.state != "finished")
                    CZ.Tours.pauseTourAtAnyAnimation = true;
            });

            //Tour: notifyng tour that the transition was interrupted
            CZ.Common.controller.onAnimationUpdated.push(function (oldId, newId) {
                if (CZ.Tours.tour != undefined) {
                    if (CZ.Tours.tourBookmarkTransitionInterrupted != undefined) {
                        var prevState = CZ.Tours.tour.state;
                        CZ.Tours.tourBookmarkTransitionInterrupted(oldId);
                        var alteredState = CZ.Tours.tour.state;

                        if (prevState == "play" && alteredState == "pause")
                            CZ.Tours.tourPause();

                        CZ.Common.setNavigationStringTo = null;
                    }
                }
            });

            CZ.Common.updateLayout();

            CZ.Common.vc.bind("elementclick", function (e) {
                CZ.Search.navigateToElement(e);
            });

            CZ.Common.vc.bind('cursorPositionChanged', function (cursorPositionChangedEvent) {
                CZ.Common.updateMarker();
            });

            CZ.Common.ax.bind('thresholdBookmarkChanged', function (thresholdBookmark) {
                var bookmark = CZ.UrlNav.navStringToVisible(thresholdBookmark.Bookmark, CZ.Common.vc);
                if (bookmark != undefined) {
                    CZ.Common.controller.moveToVisible(bookmark, false);
                }
            });

            // Reacting on the event when one of the infodot exploration causes inner zoom constraint
            CZ.Common.vc.bind("innerZoomConstraintChanged", function (constraint) {
                CZ.Common.controller.effectiveExplorationZoomConstraint = constraint.zoomValue; // applying the constraint
                CZ.Common.axis.allowMarkerMovesOnHover = !constraint.zoomValue;
            });

            CZ.Common.vc.bind("breadCrumbsChanged", function (breadCrumbsEvent) {
                CZ.BreadCrumbs.updateBreadCrumbsLabels(breadCrumbsEvent.breadCrumbs);
            });

            $(window).bind('resize', function () {
                if (CZ.timeSeriesChart) {
                    CZ.timeSeriesChart.updateCanvasHeight();
                }

                CZ.Common.updateLayout();

                //updating timeSeries chart
                var vp = CZ.Common.vc.virtualCanvas("getViewport");
                updateTimeSeriesChart(vp);
            });

            var vp = CZ.Common.vc.virtualCanvas("getViewport");
            CZ.Common.vc.virtualCanvas("setVisible", CZ.VCContent.getVisibleForElement({
                x: -13700000000,
                y: 0,
                width: 13700000000,
                height: 5535444444.444445
            }, 1.0, vp, false), true);
            CZ.Common.updateAxis(CZ.Common.vc, CZ.Common.ax);

            var bid = window.location.hash.match("b=([a-z0-9_\-]+)");
            if (bid) {
                //bid[0] - source string
                //bid[1] - found match
                $("#bibliography .sources").empty();
                $("#bibliography .title").append($("<span></span>", {
                    text: "Loading..."
                }));
                $("#bibliographyBack").css("display", "block");
            }
        }

        function closeAllForms() {
            $('.cz-major-form').each(function (i, f) {
                var form = $(f).data('form');
                if (form && form.isFormVisible === true) {
                    form.close();
                }
            });
        }
        HomePageViewModel.closeAllForms = closeAllForms;

        function getFormById(name) {
            var form = $(name).data("form");
            if (form)
                return form;
            else
                return false;
        }
        HomePageViewModel.getFormById = getFormById;

        function showTimeSeriesChart() {
            $('#timeSeriesContainer').height('30%');
            $('#timeSeriesContainer').show();
            $('#vc').height('70%');
            CZ.timeSeriesChart.updateCanvasHeight();
            CZ.Common.updateLayout();
        }
        HomePageViewModel.showTimeSeriesChart = showTimeSeriesChart;

        function hideTimeSeriesChart() {
            CZ.leftDataSet = undefined;
            CZ.rightDataSet = undefined;
            $('#timeSeriesContainer').height(0);
            $('#timeSeriesContainer').hide();
            $('#vc').height('100%');
            CZ.Common.updateLayout();
        }
        HomePageViewModel.hideTimeSeriesChart = hideTimeSeriesChart;

        function updateTimeSeriesChart(vp) {
            var left = vp.pointScreenToVirtual(0, 0).x;
            if (left < CZ.Settings.maxPermitedTimeRange.left)
                left = CZ.Settings.maxPermitedTimeRange.left;
            var right = vp.pointScreenToVirtual(vp.width, vp.height).x;
            if (right > CZ.Settings.maxPermitedTimeRange.right)
                right = CZ.Settings.maxPermitedTimeRange.right;

            if (CZ.timeSeriesChart !== undefined) {
                var leftCSS = vp.pointVirtualToScreen(left, 0).x;
                var rightCSS = vp.pointVirtualToScreen(right, 0).x;
                var leftPlot = CZ.Dates.getYMDFromCoordinate(left).year;
                var rightPlot = CZ.Dates.getYMDFromCoordinate(right).year;

                CZ.timeSeriesChart.clear(leftCSS, rightCSS);
                CZ.timeSeriesChart.clearLegend("left");
                CZ.timeSeriesChart.clearLegend("right");

                var chartHeader = "Time Series Chart";

                if (CZ.rightDataSet !== undefined || CZ.leftDataSet !== undefined) {
                    CZ.timeSeriesChart.drawVerticalGridLines(leftCSS, rightCSS, leftPlot, rightPlot);
                }

                var screenWidthForLegend = rightCSS - leftCSS;
                if (CZ.rightDataSet !== undefined && CZ.leftDataSet !== undefined) {
                    screenWidthForLegend /= 2;
                }
                var isLegendVisible = CZ.timeSeriesChart.checkLegendVisibility(screenWidthForLegend);

                if (CZ.leftDataSet !== undefined) {
                    var padding = CZ.leftDataSet.getVerticalPadding() + 10;

                    var plotBottom = Number.MAX_VALUE;
                    var plotTop = Number.MIN_VALUE;

                    CZ.leftDataSet.series.forEach(function (seria) {
                        if (seria.appearanceSettings !== undefined && seria.appearanceSettings.yMin !== undefined && seria.appearanceSettings.yMin < plotBottom) {
                            plotBottom = seria.appearanceSettings.yMin;
                        }

                        if (seria.appearanceSettings !== undefined && seria.appearanceSettings.yMax !== undefined && seria.appearanceSettings.yMax > plotTop) {
                            plotTop = seria.appearanceSettings.yMax;
                        }
                    });

                    if ((plotTop - plotBottom) === 0) {
                        var absY = Math.max(0.1, Math.abs(plotBottom));
                        var offsetConstant = 0.01;
                        plotTop += absY * offsetConstant;
                        plotBottom -= absY * offsetConstant;
                    }

                    var axisAppearence = { labelCount: 4, tickLength: 10, majorTickThickness: 1, stroke: 'black', axisLocation: 'left', font: '16px Calibri', verticalPadding: padding };
                    var tickForDraw = CZ.timeSeriesChart.generateAxisParameters(leftCSS, rightCSS, plotBottom, plotTop, axisAppearence);
                    CZ.timeSeriesChart.drawHorizontalGridLines(tickForDraw, axisAppearence);
                    CZ.timeSeriesChart.drawDataSet(CZ.leftDataSet, leftCSS, rightCSS, padding, leftPlot, rightPlot, plotTop, plotBottom);
                    CZ.timeSeriesChart.drawAxis(tickForDraw, axisAppearence);

                    if (isLegendVisible) {
                        for (var i = 0; i < CZ.leftDataSet.series.length; i++) {
                            CZ.timeSeriesChart.addLegendRecord("left", CZ.leftDataSet.series[i].appearanceSettings.stroke, CZ.leftDataSet.series[i].appearanceSettings.name);
                        }
                    }

                    chartHeader += " (" + CZ.leftDataSet.name;
                }

                if (CZ.rightDataSet !== undefined) {
                    var padding = CZ.rightDataSet.getVerticalPadding() + 10;

                    var plotBottom = Number.MAX_VALUE;
                    var plotTop = Number.MIN_VALUE;

                    CZ.rightDataSet.series.forEach(function (seria) {
                        if (seria.appearanceSettings !== undefined && seria.appearanceSettings.yMin !== undefined && seria.appearanceSettings.yMin < plotBottom) {
                            plotBottom = seria.appearanceSettings.yMin;
                        }

                        if (seria.appearanceSettings !== undefined && seria.appearanceSettings.yMax !== undefined && seria.appearanceSettings.yMax > plotTop) {
                            plotTop = seria.appearanceSettings.yMax;
                        }
                    });

                    if ((plotTop - plotBottom) === 0) {
                        var absY = Math.max(0.1, Math.abs(plotBottom));
                        var offsetConstant = 0.01;
                        plotTop += absY * offsetConstant;
                        plotBottom -= absY * offsetConstant;
                    }

                    var axisAppearence = { labelCount: 4, tickLength: 10, majorTickThickness: 1, stroke: 'black', axisLocation: 'right', font: '16px Calibri', verticalPadding: padding };
                    var tickForDraw = CZ.timeSeriesChart.generateAxisParameters(rightCSS, leftCSS, plotBottom, plotTop, axisAppearence);
                    CZ.timeSeriesChart.drawHorizontalGridLines(tickForDraw, axisAppearence);
                    CZ.timeSeriesChart.drawDataSet(CZ.rightDataSet, leftCSS, rightCSS, padding, leftPlot, rightPlot, plotTop, plotBottom);
                    CZ.timeSeriesChart.drawAxis(tickForDraw, axisAppearence);

                    if (isLegendVisible) {
                        for (var i = 0; i < CZ.rightDataSet.series.length; i++) {
                            CZ.timeSeriesChart.addLegendRecord("right", CZ.rightDataSet.series[i].appearanceSettings.stroke, CZ.rightDataSet.series[i].appearanceSettings.name);
                        }
                    }

                    var str = chartHeader.indexOf("(") > 0 ? ", " : " (";
                    chartHeader += str + CZ.rightDataSet.name + ")";
                } else {
                    chartHeader += ")";
                }

                $("#timeSeriesChartHeader").text(chartHeader);
            }
        }
        HomePageViewModel.updateTimeSeriesChart = updateTimeSeriesChart;

    })(CZ.HomePageViewModel || (CZ.HomePageViewModel = {}));
    var HomePageViewModel = CZ.HomePageViewModel;
})(CZ || (CZ = {}));
