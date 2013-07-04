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


// Obsolete functions not included in the typescript base library bindings
declare var escape: any;
declare var unescape: any;

declare var hashChangeFromOutside: any;

module CZ {
    export module Common {

        export var maxPermitedScale;
        export var maxPermitedVerticalRange;


        export var controller; //a controller to perform smooth navigation
        export var isAxisFreezed = true; //indicates whether the axis moves together with canvas during navigation or not
        export var startHash;

        /*
        Array for logging of inners messages and exceptions
        */

        var searchString;
        export var ax;
        export var axis;
        export var vc;
        var visReg;
        var content;
        var breadCrumbs; //titles and visibles of the recent breadcrumbs

        var firstTimeWelcomeChecked = true; // if welcome screen checkbox checked or not


        var k = 1000000000;
        export var setNavigationStringTo; // { element or bookmark, id } identifies that we zoom into this element and when (if) finish the zoom, we should put the element's path into navigation string
        export var hashHandle = true; // Handle hash change event
        var tourNotParsed = undefined; // indicates that URL was checked at tour sharing after page load

        export var supercollection = ""; // the supercollection associated with this url
        export var collection = ""; // the collection associated with this url

        // Initial Content contains the identifier (e.g. ID or Title) of the content that should be loaded initially.
        export var initialContent = null;

        // Throttles requests to the server such that 
        // min interval between request >= 1 sec
        export var missingDataRequestsTimer;

        // Stores the number of outgoing requests to the server for missing timeline data
        var missingDataRequestsCount = 0;

        /* Initialize the JQuery UI Widgets
        */
        export function initialize() {
            ax = (<any>$)('#axis');
            axis = new CZ.Timescale(ax);

            CZ.VirtualCanvas.initialize();
            vc = (<any>$)('#vc');
            vc.virtualCanvas();
        }


        /* Calculates local offset of mouse cursor in specified jQuery element.
        @param jqelement  (JQuery to Dom element) jQuery element to get local offset for.
        @param event   (Mouse event args) mouse event args describing mouse cursor.
        */
        export function getXBrowserMouseOrigin(jqelement, event) {
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

        export function sqr(d) { return d * d; }

        // Prevents the event from bubbling. 
        // In non IE browsers, use e.stopPropagation() instead. 
        // To cancel event bubbling across browsers, you should check for support for e.stopPropagation(), and proceed accordingly:
        export function preventbubble(e) {
            if (e && e.stopPropagation) //if stopPropagation method supported
                e.stopPropagation();
            else
                e.cancelBubble = true;
        }

        export function toggleOffImage(elemId, ext?) {
            if (!ext) ext = 'jpg';
            var imageSrc = $("#" + elemId).attr("src");
            var len = imageSrc.length;
            var prefix = imageSrc.substring(0, len - 7);
            if (imageSrc.substring(len - 6, len - 4) == "on") {
                var newSrc = prefix + "_off." + ext;
                $("#" + elemId).attr("src", newSrc);
            }
        }

        export function toggleOnImage(elemId, ext?) {
            if (!ext) ext = 'jpg';
            var imageSrc = $("#" + elemId).attr("src");
            var len = imageSrc.length;
            var prefix = imageSrc.substring(0, len - 7);
            if (imageSrc.substring(len - 6, len - 4) == "ff") {
                var newSrc = prefix + "on." + ext;
                $("#" + elemId).attr("src", newSrc);
            }
        }

        export function showFooter() {
            $("#footerBack").show('clip', {}, 'slow');
        }

        /*Animation tooltip parameter*/
        export var animationTooltipRunning = null;
        export var tooltipMode = "default"; //['infodot'], ['timeline'] indicates whether tooltip is refers to timeline or to infodot

        export function stopAnimationTooltip() {
            if (animationTooltipRunning != null) {
                $('.bubbleInfo').stop();
                $(".bubbleInfo").css("opacity", "0.9");
                $(".bubbleInfo").css("filter", "alpha(opacity=90)");
                $(".bubbleInfo").css("-moz-opacity", "0.9");

                animationTooltipRunning = null;

                //tooltipMode = "default"; //default
                //tooltipIsShown = false;

                $(".bubbleInfo").attr("id", "defaultBox");

                $(".bubbleInfo").hide();
            }
        }

        // Compares 2 visibles. Returns true if they are equal with an allowable imprecision
        export function compareVisibles(vis1, vis2) {
            return vis2 != null ?
                    (Math.abs(vis1.centerX - vis2.centerX) < CZ.Settings.allowedVisibileImprecision &&
                    Math.abs(vis1.centerY - vis2.centerY) < CZ.Settings.allowedVisibileImprecision &&
                    Math.abs(vis1.scale - vis2.scale) < CZ.Settings.allowedVisibileImprecision)
                    : false;
        }

        /*
        Is called by direct user actions like links, bread crumbs clicking, etc.
        */
        export function setVisibleByUserDirectly(visible) {
            CZ.Tours.pauseTourAtAnyAnimation = false;
            if (CZ.Tours.tour != undefined && CZ.Tours.tour.state == "play")
                CZ.Tours.tourPause();
            return setVisible(visible);
        }

        export function setVisible(visible) {
            if (visible) {
                return controller.moveToVisible(visible);
            }
        }

        export function updateMarker() {
            axis.setTimeMarker(vc.virtualCanvas("getCursorPosition"));
        }

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

        //loading the data from the service
        export function loadData() {
            var args;
            if (!CZ.Service.superCollectionName && !CZ.Service.collectionName) {
                // load the initial skeleton timelines for regimes
                args = {
                    start: -400,
                    end: 9999,
                    minspan: 13700000000,
                    commonAncestor: CZ.Settings.humanityTimelineID,
                    fromRoot: 1
                };
            } else {
                args = null;
            }

            return CZ.Service.getTimelines(args)
            .then(function (response) {
                var root = vc.virtualCanvas("getLayerContent");
                CZ.Layout.merge(response, root, true, () => {
                    var root = vc.virtualCanvas("findElement", 't' + response.id);
                    CZ.UrlNav.navigationAnchor = root;
                    CZ.Settings.maxPermitedTimeRange = { left: root.x, right: root.x + root.width };

                    if (CZ.HomePageViewModel.IsFeatureEnabled("Regimes")) {
                        initializeRegimes();
                    }
                    if (startHash) {
                        processHash();
                    } else {
                        displayRootTimeline();
                    }
                });

                if (CZ.HomePageViewModel.IsFeatureEnabled("Tours")) {
                    CZ.Service.getTours()
                    .then(function (response) {
                        CZ.Tours.parseTours(response);
                    }, function (error) {
                        console.log("Error connecting to service:\n" + error.responseText);
                    });
                }
            }, function (error) {
                console.log("Error connecting to service:\n" + error.responseText);
            });
        }

        export function getTimelineVisible(id) {
            var tl = vc.virtualCanvas("findElement", 't' + id);
            if (!tl) return;
            var tlNavString = CZ.UrlNav.vcelementToNavString(tl);
            if (!tlNavString) return;
            var tlVisible = CZ.UrlNav.navStringToVisible(tlNavString, vc);
            if (!tlVisible) return;
            return tlVisible;
        }

        function initializeRegimes() {
            $("#regime-link-cosmos").click(function () {
                var cosmosVisible = CZ.Common.getTimelineVisible(CZ.Settings.cosmosTimelineID);
                setVisible(cosmosVisible);
            });

            $("#regime-link-earth").click(function () {
                var earthVisible = CZ.Common.getTimelineVisible(CZ.Settings.earthTimelineID);
                setVisible(earthVisible);
            });

            $("#regime-link-life").click(function () {
                var lifeVisible = CZ.Common.getTimelineVisible(CZ.Settings.lifeTimelineID);
                setVisible(lifeVisible);
            });

            $("#regime-link-prehistory").click(function () {
                var prehistoryVisible = CZ.Common.getTimelineVisible(CZ.Settings.prehistoryTimelineID);
                setVisible(prehistoryVisible);
            });

            $("#regime-link-humanity").click(function () {
                var humanityVisible = CZ.Common.getTimelineVisible(CZ.Settings.humanityTimelineID);
                setVisible(humanityVisible);
            });
        }

        function displayRootTimeline() {
            var root = CZ.Common.vc.virtualCanvas("getLayerContent").children[0];
            if (!root) return;
            var rootVisible = getTimelineVisible(root.guid);
            if (!rootVisible) return;
            controller.moveToVisible(rootVisible, true);
            updateAxis(vc, ax);
        }

        function processHash() {
            visReg = CZ.UrlNav.navStringToVisible(startHash.substring(1), vc);
            if (visReg) {
                controller.moveToVisible(visReg, true);
                updateAxis(vc, ax);
            } else {
                var startPos, endPos, timelineID;
                startPos = startHash.lastIndexOf("/t");
                if (startPos !== -1) {
                    startPos += 2;
                    var idx1 = startHash.indexOf("/", startPos);
                    var idx2 = startHash.indexOf("\\", startPos);
                    var idx3 = startHash.indexOf("@", startPos);
                    var idx4 = startHash.indexOf("&", startPos);
                    endPos = Math.min(idx1, idx2, idx3, idx4);
                    if (endPos === -1) {
                        endPos = startHash.length - 1;
                    } else {
                        endPos -= 1;
                    }
                    if (startPos >= 0 && endPos >= 0 && endPos >= startPos) {
                        timelineID = startHash.substring(startPos, endPos + 1);
                    }
                }

                if (!timelineID) {
                    displayRootTimeline();
                    return;
                }

                CZ.Service.getTimelines({
                    // load the timelines for the hash
                    start: -13700000000,
                    end: 9999,
                    minspan: 13700000000,
                    commonAncestor: timelineID,
                    fromRoot: 1
                }).then(
                function (response) {
                    var root = vc.virtualCanvas("getLayerContent");
                    CZ.Layout.merge(response, root.children[0], true, () => {
                        visReg = CZ.UrlNav.navStringToVisible(startHash.substring(1), vc);
                        if (visReg) {
                            controller.moveToVisible(visReg, true);
                            updateAxis(vc, ax);
                        }
                    });
                },
                function (error) {
                    displayRootTimeline();
                });
            }
        }

        export function IncreaseRequestsCount() {
            missingDataRequestsCount++;
            if (missingDataRequestsCount === 1) {
                var vp = vc.virtualCanvas("getViewport");
                var footer = $(".footer-links");
                $("#progressImage").css({
                    top: (footer.offset().top - 30),
                    left: (vp.width / 2) - ($('#progressImage').width() / 2)
                }).show();
            }
        }

        export function DecreaseRequestsCount() {
            missingDataRequestsCount--;
            if (missingDataRequestsCount === 0) {
                $("#progressImage").hide();
            }
        }

        // request missing timeline data from the server
        export function getMissingData(vbox, lca) {
            // request new data only in case if authoring is not active
            if (typeof CZ.Authoring === 'undefined' || CZ.Authoring.isActive === false) {
                var root = CZ.Common.vc.virtualCanvas("getLayerContent");
                if (root.children.length > 0) {
                    window.clearTimeout(missingDataRequestsTimer);
                    missingDataRequestsTimer = window.setTimeout(function () {
                        IncreaseRequestsCount();
                        CZ.Service.getTimelines({
                            start: vbox.left,
                            end: vbox.right,
                            minspan: CZ.Settings.minTimelineWidth * vbox.scale,
                            commonAncestor: lca.guid,
                            maxElements: 2000
                        }).then(
                        function (response) {
                            DecreaseRequestsCount();
                            CZ.Layout.merge(response, lca);
                        },
                        function (error) {
                            DecreaseRequestsCount();
                            console.log("Error connecting to service:\n" + error.responseText);
                        });
                    }, 1000);
                }
            }
        };

        export function updateLayout() {
            CZ.BreadCrumbs.visibleAreaWidth = $(".breadcrumbs-container").width();
            CZ.BreadCrumbs.updateHiddenBreadCrumbs();

            vc.virtualCanvas("updateViewport");
            //ax.axis("updateWidth");
            updateAxis(vc, ax);

            CZ.BreadCrumbs.updateBreadCrumbsLabels();
        }

        export function updateAxis(vc, ax) {
            var vp = vc.virtualCanvas("getViewport");
            var lt = vp.pointScreenToVirtual(0, 0);
            var rb = vp.pointScreenToVirtual(vp.width, vp.height);
            var newrange = { min: lt.x, max: rb.x };
            axis.update(newrange);
        }

        export function setCookie(c_name, value, exdays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
            document.cookie = c_name + "=" + c_value;
        }

        export function getCookie(c_name) {
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

        export function viewportToViewBox(vp) {
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
    }
}
