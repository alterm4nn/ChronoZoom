/// <reference path='cz.settings.ts'/>
/// <reference path='tours.ts'/>
/// <reference path='breadcrumbs.ts'/>
/// <reference path='search.ts'/>
/// <reference path='urlnav.ts'/>
/// <reference path='layout.ts'/>
/// <reference path='timescale.ts'/>
/// <reference path='virtualcanvas.ts'/>
/// <reference path='authoring.ui.ts'/>

// Obsolete functions not included in the typescript base library bindings
declare var escape: any;
declare var unescape: any;

declare var hashChangeFromOutside: any;

module CZ {
    export module Common {

        var Settings = CZ.Settings;

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
        export var vc;
        var visReg;
        export var cosmosVisible;
        export var earthVisible;
        export var lifeVisible;
        export var prehistoryVisible;
        export var humanityVisible;
        var content;
        var breadCrumbs; //titles and visibles of the recent breadcrumbs

        var firstTimeWelcomeChecked = true; // if welcome screen checkbox checked or not

        var regimes = [];
        export var regimesRatio;
        export var regimeNavigator;

        var k = 1000000000;
        export var setNavigationStringTo; // { element or bookmark, id } identifies that we zoom into this element and when (if) finish the zoom, we should put the element's path into navigation string
        export var hashHandle = true; // Handle hash change event
        var tourNotParsed = undefined; // indicates that URL was checked at tour sharing after page load

        export var supercollection = ""; // the supercollection associated with this url
        export var collection = ""; // the collection associated with this url

        /* Initialize the JQuery UI Widgets
        */
        export function initialize() {
            ax = (<any>$)('#axis');
            CZ.Timescale.Initialize(ax);
            ax.axis();

            CZ.VirtualCanvas.initialize();
            vc = (<any>$)('#vc');
            vc.virtualCanvas();

            CZ.Authoring.initialize(vc, {
                showCreateTimelineForm: CZ.Authoring.UI.showCreateTimelineForm,
                showEditTimelineForm: CZ.Authoring.UI.showEditTimelineForm,
                showCreateExhibitForm: CZ.Authoring.UI.showCreateExhibitForm,
                showEditExhibitForm: CZ.Authoring.UI.showEditExhibitForm,
                showEditContentItemForm: CZ.Authoring.UI.showEditContentItemForm
            });
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

        export function getCoordinateFromDate(dateTime) {
            return getYearsBetweenDates(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDay(), 0, 0, 0);
        }

        export function getCoordinateFromDMY(year, month, day) {
            return getYearsBetweenDates(year, month, day, 0, 0, 0);
        }

        export function getDMYFromCoordinate(coord) {
            return getDateFrom(0, 0, 0, coord);
        }

        // convert date to virtual coordinate
        // 9999 -> present day
        export function getCoordinateFromDecimalYear(decimalYear) {
            // get virtual coordinate of present day
            var localPresent = getPresent();
            var presentDate = getYearsBetweenDates(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay, 0, 0, 0);

            return decimalYear === 9999 ? presentDate : decimalYear;
        }

        var present = undefined;
        export function getPresent() {
            if (!present) {
                present = new Date();

                present.presentDay = present.getUTCDate();
                present.presentMonth = present.getUTCMonth();
                present.presentYear = present.getUTCFullYear();
            }
            return present;
        }

        // gets the gap between two dates
        // y1, m1, d1 is first date (year, month, day)
        // y2, m2, d2 is second date (year, month, day)
        // returns count of years between given dates
        function getYearsBetweenDates(y1, m1, d1, y2, m2, d2) {
            // get full years and month passed
            var years = y2 - y1;

            if (y2 > 0 && y1 < 0)
                years -= 1;

            var months = m2 - m1;

            if (m1 > m2 || (m1 == m2 && d1 > d2)) {
                years--;
                months += 12;
            }

            var month = m1;
            var days = -d1;

            // calculate count of passed days 
            for (var i = 0; i < months; i++) {
                if (month == 12) {
                    month = 0;
                }
                days += Settings.daysInMonth[month];
                month++;
            }
            days += d2;
            var res = years + days / 365;
            return -res;
        }

        // gets the end date by given start date and gap between them
        // year, month, day is known date
        // n is count of years between known and result dates; n is negative, so result date in earlier then given
        function getDateFrom(year, month, day, n) {
            var endYear = year;
            var endMonth = month;
            var endDay = day;

            // get full year of result date
            endYear -= Math.floor(-n);

            // get count of days in a gap
            var nDays = (n + Math.floor(-n)) * 365;

            // calculate how many full months have passed
            while (nDays < 0) {
                var tempMonth = endMonth > 0 ? endMonth - 1 : 11;
                nDays += Settings.daysInMonth[tempMonth];
                endMonth--;
                if (endMonth < 0) {
                    endYear--;
                    endMonth = 11;
                }
            }

            endDay += Math.round(nDays);
            // get count of days in current month
            var tempDays = Settings.daysInMonth[endMonth];
            if (isLeapYear(endYear)) tempDays++;
            // if result day is bigger than count of days then one more month has passed too            
            while (endDay > tempDays) {
                endDay -= tempDays;
                endMonth++;
                if (endMonth > 11) {
                    endMonth = 0;
                    endYear++;
                }
                tempDays = Settings.daysInMonth[endMonth];
                if (isLeapYear(endYear)) tempDays++;
            }
            if (endYear < 0 && year > 0)
                endYear -= 1;

            return { year: endYear, month: endMonth, day: endDay };
        }

        function isLeapYear(year) {
            if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) return true;
            else return false;
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

        export function closeWelcomeScreen() {
            //if ($('input[name=welcomeScreenCheckbox]').is(':checked'))
            setCookie("welcomeScreenDisallowed", "1", 365);

            hideWelcomeScreen();
        }

        export function hideWelcomeScreen() {
            (<HTMLIFrameElement>(document.createElement("welcomeVideo"))).src = "";
            $("#welcomeScreenBack").css("display", "none");
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
                    (Math.abs(vis1.centerX - vis2.centerX) < Settings.allowedVisibileImprecision &&
                    Math.abs(vis1.centerY - vis2.centerY) < Settings.allowedVisibileImprecision &&
                    Math.abs(vis1.scale - vis2.scale) < Settings.allowedVisibileImprecision)
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
                //ax.axis("enableThresholds", false);
                return controller.moveToVisible(visible);
            }
        }

        export function updateMarker() {
            axis.setTimeMarker(vc.virtualCanvas("getCursorPosition"));
            axis.setTimeBorders();
        }

        // Retrieves the URL to download the data from
        function loadDataUrl() {
            // The following regexp extracts the pattern dataurl=url from the page hash to enable loading timelines from arbitrary sources.
            var match = /dataurl=([^\/]*)/g.exec(window.location.hash);
            if (match) {
                return unescape(match[1]);
            } else {
                switch (Settings.czDataSource) {
                    case 'db':
                        return "/Chronozoom.svc/get";
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
            //load URL state
            CZ.UrlNav.getURL();

            CZ.Service.getTimelines({
                start: -50000000000,
                end: 9999,
                minspan: 5013
            }).then(
                function (response) {
                    ProcessContent(response);
                    vc.virtualCanvas("updateViewport");
                },
                function (error) {
                    alert("Error connecting to service:\n" + error.responseText);
                }
            );
        }

        function ProcessContent(content) {
            var root = vc.virtualCanvas("getLayerContent");
            root.beginEdit();
            CZ.Layout.Merge(content, root);
            root.endEdit(true);

            InitializeRegimes(content);

            if (startHash) { // restoring the window's hash as it was on the page loading
                visReg = CZ.UrlNav.navStringToVisible(startHash.substring(1), vc);
            }

            if (!visReg && cosmosVisible) {
                window.location.hash = cosmosVisible;
                visReg = CZ.UrlNav.navStringToVisible(cosmosVisible, vc);
            }

            if (visReg) {
                controller.moveToVisible(visReg, true);
                updateAxis(vc, ax);
                var vp = vc.virtualCanvas("getViewport");
                updateNavigator(vp);

                if (startHash && window.location.hash !== startHash) {
                    hashChangeFromOutside = false;
                    window.location.hash = startHash; // synchronizing
                }
            }
        }

        function InitializeRegimes(content) {
            var f = function (timeline) {
                if (!timeline) return null;
                var v = vc.virtualCanvas("findElement", 't' + timeline.id);
                regimes.push(v);
                if (v) v = CZ.UrlNav.vcelementToNavString(v);
                return v;
            }

            var cosmosTimeline = content;
            cosmosVisible = f(cosmosTimeline);
            CZ.UrlNav.navigationAnchor = vc.virtualCanvas("findElement", 't' + cosmosTimeline.id);

            var earthTimeline = CZ.Layout.FindChildTimeline(cosmosTimeline, CZ.Settings.earthTimelineID);
            earthVisible = f(earthTimeline);
            var lifeTimeline = CZ.Layout.FindChildTimeline(earthTimeline, CZ.Settings.lifeTimelineID);
            lifeVisible = f(lifeTimeline);
            var prehistoryTimeline = CZ.Layout.FindChildTimeline(lifeTimeline, CZ.Settings.prehistoryTimelineID);
            prehistoryVisible = f(prehistoryTimeline);
            var humanityTimeline = CZ.Layout.FindChildTimeline(prehistoryTimeline, CZ.Settings.humanityTimelineID, true);
            humanityVisible = f(humanityTimeline);

            maxPermitedVerticalRange = {    //setting top and bottom observation constraints according to cosmos timeline
                top: cosmosTimeline.y,
                bottom: cosmosTimeline.y + cosmosTimeline.height
            };

            // update virtual canvas horizontal borders
            Settings.maxPermitedTimeRange = {
                left: cosmosTimeline.left,
                right: cosmosTimeline.right
            };
            maxPermitedScale = CZ.UrlNav.navStringToVisible(cosmosVisible, vc).scale * 1.1;
        }

        export function updateLayout() {
            var topHeight = $("#header").outerHeight(true) + $("#axis").outerHeight(true); // height of header and axis
            var bottomHeight = $("#footer").outerHeight(true); // height of footer
            var bodyTopMargin = parseFloat($("body").css("marginTop").replace('px', ''));
            var bodyBottomMargin = parseFloat($("body").css("marginBottom").replace('px', ''));
            var bodyMargin = bodyTopMargin + bodyBottomMargin; // calculated top and bottom margin of body tag
            var occupiedHeight = topHeight + bottomHeight + bodyMargin; // occupied height of the page

            document.getElementById("vc").style.height = (window.innerHeight - occupiedHeight) + "px";

            $(".breadCrumbPanel").css("width", Math.round(($("#vc").width() / 2 - 50)));
            $("#bc_navRight").css("left", ($(".breadCrumbPanel").width() + $(".breadCrumbPanel").position().left + 2) + "px");
            CZ.BreadCrumbs.visibleAreaWidth = $(".breadCrumbPanel").width();
            CZ.BreadCrumbs.updateHiddenBreadCrumbs();

            var offset = window.innerHeight - occupiedHeight;

            var biblOutTopMargin = 25; // top margin of bibliography outer window
            var biblOutBottomMargin = 15; // bottom margin of bibliography outer window

            document.getElementById("bibliographyOut").style.top = (topHeight + bodyTopMargin + 25) + "px";
            document.getElementById("bibliographyOut").style.height = (window.innerHeight - occupiedHeight -
                biblOutTopMargin - biblOutBottomMargin) + "px";

            var welcomeScreenHeight = $("#welcomeScreenOut").outerHeight();
            var diff = Math.floor((window.innerHeight - welcomeScreenHeight) / 2);
            document.getElementById("welcomeScreenOut").style.top = diff + "px";

            vc.virtualCanvas("updateViewport");
            //ax.axis("updateWidth");
            updateAxis(vc, ax);
            CZ.BreadCrumbs.updateBreadCrumbsLabels();
        }

        export function passThrough(e) {
            var mouseX = e.pageX;
            var mouseY = e.pageY;

            var cosmos_rect = $("#cosmos_rect");
            var offset_space = cosmos_rect.offset();
            var width_space = cosmos_rect.width();
            var height_space = cosmos_rect.height();
            if (mouseX > offset_space.left && mouseX < offset_space.left + width_space
             && mouseY > offset_space.top && mouseY < offset_space.top + height_space)
                CZ.Search.navigateToBookmark(cosmosVisible);

            var earth_rect = $("#earth_rect");
            var offset_earth = earth_rect.offset();
            var width_earth = earth_rect.width();
            var height_earth = earth_rect.height();
            if (mouseX > offset_earth.left && mouseX < offset_earth.left + width_earth
             && mouseY > offset_earth.top && mouseY < offset_earth.top + height_earth)
                CZ.Search.navigateToBookmark(earthVisible);

            var life_rect = $("#life_rect");
            var offset_life = life_rect.offset();
            var width_life = life_rect.width();
            var height_life = life_rect.height();
            if (mouseX > offset_life.left && mouseX < offset_life.left + width_life
             && mouseY > offset_life.top && mouseY < offset_life.top + height_life)
                CZ.Search.navigateToBookmark(lifeVisible);

            var prehuman_rect = $("#prehuman_rect");
            var offset_prehuman = prehuman_rect.offset();
            var width_prehuman = prehuman_rect.width();
            var height_prehuman = prehuman_rect.height();
            if (mouseX > offset_prehuman.left && mouseX < offset_prehuman.left + width_prehuman
             && mouseY > offset_prehuman.top && mouseY < offset_prehuman.top + height_prehuman)
                CZ.Search.navigateToBookmark(prehistoryVisible);

            var human_rect = $("#human_rect");
            var offset_human = human_rect.offset();
            var width_human = human_rect.width();
            var height_human = human_rect.height();
            if (mouseX > offset_human.left && mouseX < offset_human.left + width_human
             && mouseY > offset_human.top && mouseY < offset_human.top + height_human)
                CZ.Search.navigateToBookmark(humanityVisible);
        }

        export function updateAxis(vc, ax) {
            var vp = vc.virtualCanvas("getViewport");
            var lt = vp.pointScreenToVirtual(0, 0);
            var rb = vp.pointScreenToVirtual(vp.width, vp.height);
            var newrange = { min: lt.x, max: rb.x };
            axis.update(newrange);
        }

        export function updateNavigator(vp) {
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
            if (left < Settings.maxPermitedTimeRange.left) left = Settings.maxPermitedTimeRange.left;
            var right = vp.pointScreenToVirtual(vp.width, vp.height).x;
            if (right > Settings.maxPermitedTimeRange.right) right = Settings.maxPermitedTimeRange.right;
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

        export function setCookie(c_name, value, exdays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
            document.cookie = c_name + "=" + c_value;
        }

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
    }
}
