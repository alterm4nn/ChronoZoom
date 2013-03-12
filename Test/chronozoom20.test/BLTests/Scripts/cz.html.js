timings.scriptsLoaded = new Date();
var searchString;
var ax, vc;
var visReg;
var cosmosVisible, earthVisible, lifeVisible, prehistoryVisible, humanityVisible;
var content;
var breadCrumbs; //titles and visibles of the recent breadcrumbs

var firstTimeWelcomeChecked = true; // if welcome screen checkbox checked or not

var regimes = new Array();
var regimeNavigator;

var k = 1000000000;
var setNavigationStringTo; // { element or bookmark, id } identifies that we zoom into this element and when (if) finish the zoom, we should put the element's path into navigation string

var regimesRatio;

var hashHandle = true; // Handle hash change event

function updateAxis(vc, ax) {
    var vp = vc.virtualCanvas("getViewport");
    var lt = vp.pointScreenToVirtual(0, 0);
    var rb = vp.pointScreenToVirtual(vp.width, vp.height);
    ax.axis("setRange", lt.x, rb.x);
}

function updateNavigator(vp) {
    var navigatorFunc = function (coordinate) {
        if (Math.abs(coordinate) < 0.00000000001)
            return 0;
        //Get log10 from coordinate
        var log = Math.log(coordinate) / 2.302585092994046;
        //Get pow from log10
        var pow = Math.pow(log, 3) * Math.exp(-log * 0.001);
        //Get final width of the column
        return (log + pow) * 13700000000 / 1041.2113538234402;
    }

    var left = vp.pointScreenToVirtual(0, 0).x;
    if (left < maxPermitedTimeRange.left) left = maxPermitedTimeRange.left;
    var right = vp.pointScreenToVirtual(vp.width, vp.height).x;
    if (right > maxPermitedTimeRange.right) right = maxPermitedTimeRange.right;
    var newRight = navigatorFunc(Math.abs(right));
    var newLeft = navigatorFunc(Math.abs(left));
    var newWidth = Math.max(2.0 / regimesRatio, Math.abs(newRight - newLeft));

    var min = 0;
    var max = document.getElementById("cosmos_rect").clientWidth;

    var l = 301 - regimesRatio * newLeft;
    var w = regimesRatio * newWidth;

    if (l < 0 || l + w > max + 5)
        return;

    regimeNavigator.css('left', l);
    regimeNavigator.css('width', w);
}

var controller; //a controller to perform smooth navigation
var isAxisFreezed = true; //indicates whether the axis moves together with canvas during navigation or not
var startHash;

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

$(document).ready(function () {
    $('.bubbleInfo').hide();
    ("#axis").showThresholds = true;
    var wlcmScrnCookie = getCookie("welcomeScreenDisallowed");
    if (wlcmScrnCookie != null) {
        hideWelcomeScreen();
    }
    else {
        // click on gray area hides welcome screen
        $("#welcomeScreenOut").click(function (e) {
            e.stopPropagation();
        });

        $("#welcomeScreenBack").click(function () {
            hideWelcomeScreen();
        });
    }

    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
            var oprversion = new Number(RegExp.$1) // capture x.x portion and store as a number
            if (oprversion < 14.0) {
                var fallback_agreement = getCookie("new_bad_browser_agreement");
                if ((fallback_agreement == null) || (fallback_agreement == "")) {
                    window.location = "testFallBackPage.htm";
                    return;
                }
            }
        }
    }
    else if (navigator.userAgent.toLowerCase().indexOf('version') > -1) {
        if (/Version[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
            var oprversion = new Number(RegExp.$1) // capture x.x portion and store as a number
            if (oprversion < 5.0) {
                var fallback_agreement = getCookie("new_bad_browser_agreement");
                if ((fallback_agreement == null) || (fallback_agreement == "")) {
                    window.location = "testFallBackPage.htm";
                    return;
                }
            }
        }
    }
    else {
        var br = $.browser;
        var isIe9 = br.msie && parseInt(br.version, 10) >= 9;
        if (!isIe9) {
            var isFF9 = br.mozilla && parseInt(br.version, 10) >= 7;
            if (!isFF9) {
                var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
                if (!is_chrome) {
                    var fallback_agreement = getCookie("new_bad_browser_agreement");
                    if ((fallback_agreement == null) || (fallback_agreement == "")) {
                        window.location = "testFallBackPage.htm";
                        return;
                    }
                }
                return;
            }
        }
    }

    if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
        // Suppress the default iOS elastic pan/zoom actions.
        document.addEventListener('touchmove', function (e) { e.preventDefault(); });
    }

    if (navigator.userAgent.indexOf('Mac') != -1) {
        // Disable Mac OS Scrolling Bounce Effect
        var body = document.getElementsByTagName('body')[0];
        body.style.overflow = "hidden";
    }

    // init seadragon. set path to image resources for nav buttons 
    Seadragon.Config.imagePath = seadragonImagePath;

    maxPermitedVerticalRange = { top: 0, bottom: 10000000 }; //temporary value until there is no data
    timings.readyStarted = new Date();

    ax = $("#axis");
    ax.axis();

    vc = $("#vc");
    vc.virtualCanvas();

    regimeNavigator = $('#regime_navigator');
    regimeNavigator.click(passThrough);
    regimesRatio = 300 / Math.abs(maxPermitedTimeRange.left - maxPermitedTimeRange.right);

    if (window.location.hash)
        startHash = window.location.hash; // to be processes after the data is loaded
    loadData(); //retrieving the data

    initializeSearch();
    initializeBibliography();
    initializeToursUI();

    var canvasGestures = getGesturesStream(vc); //gesture sequence of the virtual canvas
    var axisGestures = applyAxisBehavior(getGesturesStream(ax)); //gesture sequence of axis (tranformed according to axis behavior logic)
    var jointGesturesStream = canvasGestures.Merge(axisGestures);

    controller = new ViewportController(
                    function (visible) {
                        var vp = vc.virtualCanvas("getViewport");
                        var markerPos = ax.axis("MarkerPosition");
                        var oldMarkerPosInScreen = vp.pointVirtualToScreen(markerPos, 0).x;

                        vc.virtualCanvas("setVisible", visible, controller.activeAnimation);
                        updateAxis(vc, ax);
                        vp = vc.virtualCanvas("getViewport");
                        if (pauseTourAtAnyAnimation) { //watch for the user animation during playing of some tour bookmark
                            tourPause();
                            pauseTourAtAnyAnimation = false;
                        }

                        var hoveredInfodot = vc.virtualCanvas("getHoveredInfodot");
                        var actAni = controller.activeAnimation != undefined;

                        if (actAni && !hoveredInfodot.id) {
                            var newMarkerPos = vp.pointScreenToVirtual(oldMarkerPosInScreen, 0).x;
                            ax.axis("setTimeMarker", newMarkerPos);
                        }

                        updateNavigator(vp);
                    },
                    function () {
                        return vc.virtualCanvas("getViewport");
                    },
                    jointGesturesStream);

    var hashChangeFromOutside = true; // True if url is changed externally

    // URL Nav: update URL when animation is complete
    controller.onAnimationComplete.push(function (id) {
        hashChangeFromOutside = false;
        if (setNavigationStringTo && setNavigationStringTo.bookmark) { // go to search result
            navigationAnchor = navStringTovcElement(setNavigationStringTo.bookmark, vc.virtualCanvas("getLayerContent"));
            window.location.hash = setNavigationStringTo.bookmark;
        }
        else {
            if (setNavigationStringTo && setNavigationStringTo.id == id)
                navigationAnchor = setNavigationStringTo.element;

            var vp = vc.virtualCanvas("getViewport");
            window.location.hash = vcelementToNavString(navigationAnchor, vp);
        }
        setNavigationStringTo = null;
    });

    // URL Nav: handle URL changes from outside
    window.addEventListener("hashchange", function () {
        if (window.location.hash && hashChangeFromOutside && hashHandle) {
            var hash = window.location.hash;
            var visReg = navStringToVisible(window.location.hash.substring(1), vc);
            if (visReg) {
                isAxisFreezed = true;
                controller.moveToVisible(visReg, true);
                // to make sure that the hash is correct (it can be incorrectly changed in onCurrentlyObservedInfodotChanged)
                if (window.location.hash != hash) {
                    hashChangeFromOutside = false;
                    window.location.hash = hash;
                }
            }
            hashHandle = true;
        } else
            hashChangeFromOutside = true;
    });


    // Axis: enable showing thresholds
    controller.onAnimationComplete.push(function () {
        ax.axis("enableThresholds", true);
        //if (window.console && console.log("thresholds enabled"));
    });
    //Axis: disable showing thresholds
    controller.onAnimationStarted.push(function () {
        ax.axis("enableThresholds", true);
        //if (window.console && console.log("thresholds disabled"));
    });
    // Axis: enable showing thresholds
    controller.onAnimationUpdated.push(function (oldId, newId) {
        if (oldId != undefined && newId == undefined) { // animation interrupted
            setTimeout(function () {
                ax.axis("enableThresholds", true);
                //if (window.console && console.log("thresholds enabled"));
            }, 500);
        }
    });

    //Tour: notifyng tour that the bookmark is reached
    controller.onAnimationComplete.push(
                        function (id) {
                            if (tourBookmarkTransitionCompleted != undefined)
                                tourBookmarkTransitionCompleted(id);
                            if (tour != undefined && tour.state != "finished") //enabling wathcing for user activity while playing the bookmark
                                pauseTourAtAnyAnimation = true;
                        });
    //Tour: notifyng tour that the transition was interrupted
    controller.onAnimationUpdated.push(
                        function (oldId, newId) {
                            if (tour != undefined) {
                                if (tourBookmarkTransitionInterrupted != undefined) { //in transition
                                    var prevState = tour.state;
                                    tourBookmarkTransitionInterrupted(oldId);
                                    var alteredState = tour.state;

                                    if (prevState == "play" && alteredState == "pause") //interruption caused toue pausing. stop any animations, updating UI as well
                                        tourPause();

                                    setNavigationStringTo = null;
                                }
                            }
                        }
    );

    updateLayout();

    vc.bind("elementclick", function (e) {
        navigateToElement(e);
    });

    vc.bind('cursorPositionChanged', function (cursorPositionChangedEvent) {
        updateMarker();
    });

    ax.bind('thresholdBookmarkChanged', function (thresholdBookmark) {
        var bookmark = navStringToVisible(thresholdBookmark.Bookmark, vc);
        if (bookmark != undefined) {
            controller.moveToVisible(bookmark, false);
        }
    });

    // Reacting on the event when one of the infodot exploration causes inner zoom constraint
    vc.bind("innerZoomConstraintChenged", function (constraint) {
        controller.effectiveExplorationZoomConstraint = constraint.zoomValue; // applying the constraint
        ax.axis("allowMarkerMovesOnHover", !constraint.zoomValue);
    });

    vc.bind("breadCrumbsChanged", function (breadCrumbsEvent) { //reacting on the event when the first timeline that contains whole visible region is changed
        updateBreadCrumbsLabels(breadCrumbsEvent.breadCrumbs);
    });

    timings.readyFinished = new Date();
    var vp = vc.virtualCanvas("getViewport");
    vc.virtualCanvas("setVisible", getVisibleForElement({ x: -13700000000, y: 0, width: 13700000000, height: 5535444444.444445 }, 1.0, vp));
    updateAxis(vc, ax);

    var bid = window.location.hash.match("b=([a-z0-9_]+)");
    if (bid) {
        //bid[0] - source string
        //bid[1] - found match
        $("#bibliography .sources").empty();
        $("#bibliography .title").html("<span>Loading...</span>");
        $("#bibliographyBack").css("display", "block");
    }
});

function updateMarker() {
    ax.axis("setTimeMarker", vc.virtualCanvas("getCursorPosition"));
}

var tourNotParsed = undefined; // indicates that URL was checked at tour sharing after page load

// Retrieves the URL to download the data from
function loadDataUrl() {
    var match = /dataurl=([^\/]*)/g.exec(window.location.hash);
    if (match) {
        return unescape(match[1]);
    } else {
        switch (czDataSource) {
            case 'db':
                return "Chronozoom.svc/get";
            case 'relay':
                return "ChronozoomRelay";
            case 'dump':
                return "ResponseDump.txt";
            default:
                return null;
        }
    }
}

//loading the data from the service
function loadData() {
    timings.wcfRequestStarted = new Date();
    var url = loadDataUrl();

    $.ajax({ //main content fetching
        cache: false,
        type: "GET",
        async: true,
        dataType: "json",
        url: url,
        success: function (result) {
            content = result;
            ProcessContent(result);

            if (typeof tours !== 'undefined') { // tours are loaded, check at shared tour
                loadTourFromURL();
                tourNotParsed = false;
            }
            else // tours are not loaded yet, checking at shared tour will be after successful load of tours 
                tourNotParsed = true;
        },
        error: function (xhr) {
            timings.RequestCompleted = new Date();
            alert("Error connecting to service: " + xhr.responseText);
        }
    });

    var toursUrl;
    switch (czDataSource) {
        case 'db': toursUrl = "Chronozoom.svc/getTours";
            break;
        case 'relay': toursUrl = "ChronozoomRelay";
            break;
        case 'dump': toursUrl = "toursDump.txt";
            break;
    }

    $.ajax({ //tours fetching
        cache: false,
        type: "GET",
        async: true,
        dataType: "json",
        url: toursUrl,
        success: function (result) {
            parseTours(result);
            initializeToursContent();

            // check at shared tour
            if (tourNotParsed == true) {
                loadTourFromURL();
                tourNotParsed = false;
            }
        },
        error: function (xhr) {
            $("tours_index").attr("onmouseup", function () {
                alert("The tours failed to download. Please refresh the page later and try to activate tours again.");
            });
            initializeToursContent();
        }
    });
}

function ProcessContent(content) {
    timings.wcfRequestCompleted = new Date();
    Load(vc, content.d);
    timings.layoutCompleted = new Date();
    if (startHash) { // restoring the window's hash as it was on the page loading
        visReg = navStringToVisible(startHash.substring(1), vc);
    }

    InitializeRegimes();
    if (!visReg && cosmosVisible) {
        window.location.hash = cosmosVisible;
        visReg = navStringToVisible(cosmosVisible, vc);
    }
    if (visReg) {
        vc.virtualCanvas("setVisible", visReg);
        updateAxis(vc, ax);
        var vp = vc.virtualCanvas("getViewport");
        updateNavigator(vp);

        if (startHash && window.location.hash !== startHash) {
            hashChangeFromOutside = false;
            window.location.hash = startHash; // synchronizing
        }
    }
    timings.canvasInited = new Date();
}

function InitializeRegimes() {
    if (content) {
        if (content.d.length > 0) {
            var f = function (timeline) {
                if (!timeline) return null;
                var v = vc.virtualCanvas("findElement", 't' + timeline.UniqueID);
                regimes.push(v);
                if (v) v = vcelementToNavString(v);
                return v;
            }

            var cosmosTimeline = content.d[0];
            cosmosVisible = f(cosmosTimeline);
            navigationAnchor = vc.virtualCanvas("findElement", 't' + cosmosTimeline.UniqueID);

            var earthTimeline = FindChildTimeline(cosmosTimeline, earthTimelineID);
            earthVisible = f(earthTimeline);
            var lifeTimeline = FindChildTimeline(earthTimeline, lifeTimelineID);
            lifeVisible = f(lifeTimeline);
            var prehistoryTimeline = FindChildTimeline(lifeTimeline, prehistoryTimelineID);
            prehistoryVisible = f(prehistoryTimeline);
            var humanityTimeline = FindChildTimeline(prehistoryTimeline, humanityTimelineID, true);
            humanityVisible = f(humanityTimeline);

            maxPermitedVerticalRange = {    //setting top and bottom observation constraints according to cosmos timeline
                top: cosmosTimeline.y,
                bottom: cosmosTimeline.y + cosmosTimeline.height
            };

            maxPermitedScale = navStringToVisible(cosmosVisible, vc).scale * 1.1;
        }
    }
}

$(window).bind('resize', function () {
    updateLayout();
});

function updateLayout() {
    document.getElementById("vc").style.height = (window.innerHeight - 148) + "px";

    $(".breadCrumbPanel").css("width", Math.round(($("#vc").width() / 2 - 50)));
    $("#bc_navRight").css("left", ($(".breadCrumbPanel").width() + $(".breadCrumbPanel").position().left + 2) + "px");
    visibleAreaWidth = $(".breadCrumbPanel").width();
    updateHiddenBreadCrumbs();

    var height = window.innerHeight;
    var offset = height - 187;
    // todo: use axis' height instead of constants
    document.getElementById("bibliographyBack").style.height = window.innerHeight + "px";
    document.getElementById("bibliographyOut").style.top = (150) + "px";
    document.getElementById("bibliographyOut").style.height = offset + "px";
    document.getElementById("bibliographyOut").style.top = (150) + "px";
    document.getElementById("bibliography").style.height = (offset - 50) + "px";
    document.getElementById("bibliography").style.top = (25) + "px";

    document.getElementById("welcomeScreenBack").style.height = window.innerHeight + "px";
    // todo: use (welcomeScreen' content + axis height + footer height) instead of consants
    if (height <= 669) {
        document.getElementById("welcomeScreenOut").style.top = (150) + "px";
        document.getElementById("welcomeScreenOut").style.height = offset + "px";
        document.getElementById("welcomeScreenOut").style.top = (150) + "px";
        document.getElementById("welcomeScreen").style.height = (offset - 50) + "px";
    }
    else { // keeping height of welcome screen constant, positioning in center of canvas
        var diff = Math.floor((height - 669) / 2);
        document.getElementById("welcomeScreenOut").style.top = (150 + diff) + "px";
        document.getElementById("welcomeScreenOut").style.height = (482) + "px";
        document.getElementById("welcomeScreenOut").style.top = (150 + diff) + "px";
        document.getElementById("welcomeScreen").style.height = (432) + "px";
    }
    document.getElementById("welcomeScreen").style.top = (25) + "px";

    InitializeRegimes();
    vc.virtualCanvas("updateViewport");
    ax.axis("updateWidth");
    updateAxis(vc, ax);
    updateBreadCrumbsLabels();
}

/*
Is called by direct user actions like links, bread crumbs clicking, etc.
*/
function setVisibleByUserDirectly(visible) {
    pauseTourAtAnyAnimation = false;
    if (tour != undefined && tour.state == "play")
        tourPause();
    return setVisible(visible);
}

function setVisible(visible) {
    if (visible) {
        //ax.axis("enableThresholds", false);
        return controller.moveToVisible(visible);
    }
}

function passThrough(e) {
    var mouseX = e.pageX;
    var mouseY = e.pageY;

    var cosmos_rect = $("#cosmos_rect");
    var offset_space = cosmos_rect.offset();
    var width_space = cosmos_rect.width();
    var height_space = cosmos_rect.height();
    if (mouseX > offset_space.left && mouseX < offset_space.left + width_space
     && mouseY > offset_space.top && mouseY < offset_space.top + height_space)
        navigateToBookmark(cosmosVisible);

    var earth_rect = $("#earth_rect");
    var offset_earth = earth_rect.offset();
    var width_earth = earth_rect.width();
    var height_earth = earth_rect.height();
    if (mouseX > offset_earth.left && mouseX < offset_earth.left + width_earth
     && mouseY > offset_earth.top && mouseY < offset_earth.top + height_earth)
        navigateToBookmark(earthVisible);

    var life_rect = $("#life_rect");
    var offset_life = life_rect.offset();
    var width_life = life_rect.width();
    var height_life = life_rect.height();
    if (mouseX > offset_life.left && mouseX < offset_life.left + width_life
     && mouseY > offset_life.top && mouseY < offset_life.top + height_life)
        navigateToBookmark(lifeVisible);

    var prehuman_rect = $("#prehuman_rect");
    var offset_prehuman = prehuman_rect.offset();
    var width_prehuman = prehuman_rect.width();
    var height_prehuman = prehuman_rect.height();
    if (mouseX > offset_prehuman.left && mouseX < offset_prehuman.left + width_prehuman
     && mouseY > offset_prehuman.top && mouseY < offset_prehuman.top + height_prehuman)
        navigateToBookmark(prehistoryVisible);

    var human_rect = $("#human_rect");
    var offset_human = human_rect.offset();
    var width_human = human_rect.width();
    var height_human = human_rect.height();
    if (mouseX > offset_human.left && mouseX < offset_human.left + width_human
     && mouseY > offset_human.top && mouseY < offset_human.top + height_human)
        navigateToBookmark(humanityVisible);
}

/*function activateWelcomeBox() {
    $.cookie("welcomeScreenActive", "1");
}

function checkboxWelcomeChanged() {
    if ($('input[name=welcomeScreenCheckbox]').is(':checked'))
        activateWelcomeBox();
    else {
        $.cookie("welcomeScreenActive", null);
    }
}*/

function closeWelcomeScreen() {
    if ($('input[name=welcomeScreenCheckbox]').is(':checked'))
        setCookie("welcomeScreenDisallowed", "1", 365);

    hideWelcomeScreen();
}

function hideWelcomeScreen() {
    document.getElementById("welcomeVideo").src = "";
    $("#welcomeScreenBack").css("display", "none");
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}