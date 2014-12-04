/// <reference path='settings.ts'/>
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
