var CZ;
(function (CZ) {
    (function (Common) {
        Common.maxPermitedScale;
        Common.maxPermitedVerticalRange;
        Common.controller;
        Common.isAxisFreezed = true;
        Common.startHash;
        var searchString;
        Common.ax;
        Common.axis;
        Common.vc;
        var visReg;
        var content;
        var breadCrumbs;
        var firstTimeWelcomeChecked = true;
        var k = 1000000000;
        Common.setNavigationStringTo;
        Common.hashHandle = true;
        var tourNotParsed = undefined;
        Common.supercollection = "";
        Common.collection = "";
        Common.initialContent = null;
        Common.missingDataRequestsTimer;
        var missingDataRequestsCount = 0;
        function initialize() {
            Common.ax = ($)('#axis');
            Common.axis = new CZ.Timescale(Common.ax);
            CZ.VirtualCanvas.initialize();
            Common.vc = ($)('#vc');
            Common.vc.virtualCanvas();
        }
        Common.initialize = initialize;
        function getXBrowserMouseOrigin(jqelement, event) {
            var offsetX;
            offsetX = event.pageX - jqelement[0].offsetLeft;
            var offsetY;
            offsetY = event.pageY - jqelement[0].offsetTop;
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
        function preventbubble(e) {
            if(e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        }
        Common.preventbubble = preventbubble;
        function toggleOffImage(elemId, ext) {
            if(!ext) {
                ext = 'jpg';
            }
            var imageSrc = $("#" + elemId).attr("src");
            var len = imageSrc.length;
            var prefix = imageSrc.substring(0, len - 7);
            if(imageSrc.substring(len - 6, len - 4) == "on") {
                var newSrc = prefix + "_off." + ext;
                $("#" + elemId).attr("src", newSrc);
            }
        }
        Common.toggleOffImage = toggleOffImage;
        function toggleOnImage(elemId, ext) {
            if(!ext) {
                ext = 'jpg';
            }
            var imageSrc = $("#" + elemId).attr("src");
            var len = imageSrc.length;
            var prefix = imageSrc.substring(0, len - 7);
            if(imageSrc.substring(len - 6, len - 4) == "ff") {
                var newSrc = prefix + "on." + ext;
                $("#" + elemId).attr("src", newSrc);
            }
        }
        Common.toggleOnImage = toggleOnImage;
        function showFooter() {
            $("#footerBack").show('clip', {
            }, 'slow');
        }
        Common.showFooter = showFooter;
        Common.animationTooltipRunning = null;
        Common.tooltipMode = "default";
        function stopAnimationTooltip() {
            if(Common.animationTooltipRunning != null) {
                $('.bubbleInfo').stop();
                $(".bubbleInfo").css("opacity", "0.9");
                $(".bubbleInfo").css("filter", "alpha(opacity=90)");
                $(".bubbleInfo").css("-moz-opacity", "0.9");
                Common.animationTooltipRunning = null;
                $(".bubbleInfo").attr("id", "defaultBox");
                $(".bubbleInfo").hide();
            }
        }
        Common.stopAnimationTooltip = stopAnimationTooltip;
        function compareVisibles(vis1, vis2) {
            return vis2 != null ? (Math.abs(vis1.centerX - vis2.centerX) < CZ.Settings.allowedVisibileImprecision && Math.abs(vis1.centerY - vis2.centerY) < CZ.Settings.allowedVisibileImprecision && Math.abs(vis1.scale - vis2.scale) < CZ.Settings.allowedVisibileImprecision) : false;
        }
        Common.compareVisibles = compareVisibles;
        function setVisibleByUserDirectly(visible) {
            CZ.Tours.pauseTourAtAnyAnimation = false;
            if(CZ.Tours.tour != undefined && CZ.Tours.tour.state == "play") {
                CZ.Tours.tourPause();
            }
            return setVisible(visible);
        }
        Common.setVisibleByUserDirectly = setVisibleByUserDirectly;
        function setVisible(visible) {
            if(visible) {
                return Common.controller.moveToVisible(visible);
            }
        }
        Common.setVisible = setVisible;
        function updateMarker() {
            Common.axis.setTimeMarker(Common.vc.virtualCanvas("getCursorPosition"));
        }
        Common.updateMarker = updateMarker;
        function loadDataUrl() {
            var match = /dataurl=([^\/]*)/g.exec(window.location.hash);
            if(match) {
                return unescape(match[1]);
            } else {
                switch(CZ.Settings.czDataSource) {
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
        function loadData() {
            var args;
            if(!CZ.Service.superCollectionName && !CZ.Service.collectionName) {
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
            if(typeof CZ.Authoring !== 'undefined' && CZ.Authoring.isActive) {
                args = {
                    minspan: 0
                };
            }
            return CZ.Service.getTimelines(args).then(function (response) {
                var root = Common.vc.virtualCanvas("getLayerContent");
                CZ.Layout.merge(response, root, true, function () {
                    var root = Common.vc.virtualCanvas("findElement", 't' + response.id);
                    CZ.UrlNav.navigationAnchor = root;
                    CZ.Settings.maxPermitedTimeRange = {
                        left: root.x,
                        right: root.x + root.width
                    };
                    if(CZ.HomePageViewModel.IsFeatureEnabled("Regimes")) {
                        initializeRegimes();
                    }
                    if(Common.startHash) {
                        processHash();
                    } else {
                        displayRootTimeline();
                    }
                });
                if(CZ.HomePageViewModel.IsFeatureEnabled("Tours")) {
                    CZ.Service.getTours().then(function (response) {
                        CZ.Tours.parseTours(response);
                    }, function (error) {
                        console.log("Error connecting to service:\n" + error.responseText);
                    });
                }
            }, function (error) {
                console.log("Error connecting to service:\n" + error.responseText);
            });
        }
        Common.loadData = loadData;
        function getTimelineVisible(id) {
            var tl = Common.vc.virtualCanvas("findElement", 't' + id);
            if(!tl) {
                return;
            }
            var tlNavString = CZ.UrlNav.vcelementToNavString(tl);
            if(!tlNavString) {
                return;
            }
            var tlVisible = CZ.UrlNav.navStringToVisible(tlNavString, Common.vc);
            if(!tlVisible) {
                return;
            }
            return tlVisible;
        }
        Common.getTimelineVisible = getTimelineVisible;
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
            if(!root) {
                return;
            }
            var rootVisible = getTimelineVisible(root.guid);
            if(!rootVisible) {
                return;
            }
            Common.controller.moveToVisible(rootVisible, true);
            updateAxis(Common.vc, Common.ax);
        }
        function processHash() {
            visReg = CZ.UrlNav.navStringToVisible(Common.startHash.substring(1), Common.vc);
            if(visReg) {
                Common.controller.moveToVisible(visReg, true);
                updateAxis(Common.vc, Common.ax);
            } else {
                var startPos, endPos, timelineID;
                startPos = Common.startHash.lastIndexOf("/t");
                if(startPos !== -1) {
                    startPos += 2;
                    var pos = [];
                    pos.push(Common.startHash.indexOf("/", startPos));
                    pos.push(Common.startHash.indexOf("\\", startPos));
                    pos.push(Common.startHash.indexOf("@", startPos));
                    pos.push(Common.startHash.indexOf("&", startPos));
                    pos = pos.filter(function (v) {
                        return v >= 0;
                    }).sort();
                    endPos = (pos.length > 0) ? pos[0] - 1 : Common.startHash.length - 1;
                    if(startPos >= 0 && endPos >= 0 && endPos >= startPos) {
                        timelineID = Common.startHash.substring(startPos, endPos + 1);
                    }
                }
                if(!timelineID) {
                    displayRootTimeline();
                    return;
                }
                CZ.Service.getTimelines({
                    start: -13700000000,
                    end: 9999,
                    minspan: 13700000000,
                    commonAncestor: timelineID,
                    fromRoot: 1
                }).then(function (response) {
                    var root = Common.vc.virtualCanvas("getLayerContent");
                    CZ.Layout.merge(response, root.children[0], true, function () {
                        visReg = CZ.UrlNav.navStringToVisible(Common.startHash.substring(1), Common.vc);
                        if(visReg) {
                            Common.controller.moveToVisible(visReg, true);
                            updateAxis(Common.vc, Common.ax);
                        }
                    });
                }, function (error) {
                    displayRootTimeline();
                });
            }
        }
        function IncreaseRequestsCount() {
            missingDataRequestsCount++;
            if(missingDataRequestsCount === 1) {
                var vp = Common.vc.virtualCanvas("getViewport");
                var footer = $(".footer-links");
                $("#progressImage").css({
                    top: (footer.offset().top - 30),
                    left: (vp.width / 2) - ($('#progressImage').width() / 2)
                }).show();
            }
        }
        Common.IncreaseRequestsCount = IncreaseRequestsCount;
        function DecreaseRequestsCount() {
            missingDataRequestsCount--;
            if(missingDataRequestsCount === 0) {
                $("#progressImage").hide();
            }
        }
        Common.DecreaseRequestsCount = DecreaseRequestsCount;
        function getMissingData(vbox, lca) {
            if(typeof CZ.Authoring === 'undefined' || CZ.Authoring.isActive === false) {
                var root = CZ.Common.vc.virtualCanvas("getLayerContent");
                if(root.children.length > 0) {
                    window.clearTimeout(Common.missingDataRequestsTimer);
                    Common.missingDataRequestsTimer = window.setTimeout(function () {
                        IncreaseRequestsCount();
                        CZ.Service.getTimelines({
                            start: vbox.left,
                            end: vbox.right,
                            minspan: CZ.Settings.minTimelineWidth * vbox.scale,
                            commonAncestor: lca.guid,
                            maxElements: 2000
                        }).then(function (response) {
                            DecreaseRequestsCount();
                            CZ.Layout.merge(response, lca);
                        }, function (error) {
                            DecreaseRequestsCount();
                            console.log("Error connecting to service:\n" + error.responseText);
                        });
                    }, 1000);
                }
            }
        }
        Common.getMissingData = getMissingData;
        ;
        function updateLayout() {
            CZ.BreadCrumbs.visibleAreaWidth = $(".breadcrumbs-container").width();
            CZ.BreadCrumbs.updateHiddenBreadCrumbs();
            Common.vc.virtualCanvas("updateViewport");
            updateAxis(Common.vc, Common.ax);
            CZ.BreadCrumbs.updateBreadCrumbsLabels();
        }
        Common.updateLayout = updateLayout;
        function updateAxis(vc, ax) {
            var vp = vc.virtualCanvas("getViewport");
            var lt = vp.pointScreenToVirtual(0, 0);
            var rb = vp.pointScreenToVirtual(vp.width, vp.height);
            var newrange = {
                min: lt.x,
                max: rb.x
            };
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
            for(i = 0; i < ARRcookies.length; i++) {
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
                x = x.replace(/^\s+|\s+$/g, "");
                if(x == c_name) {
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
