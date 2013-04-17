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
        var tourNotParsed = undefined;
        Common.supercollection = "";
        Common.collection = "";
        function initialize() {
            Common.ax = ($)('#axis');
            Common.axis = new CZ.Timescale(Common.ax);
            CZ.VirtualCanvas.initialize();
            Common.vc = ($)('#vc');
            Common.vc.virtualCanvas();
            CZ.Authoring.initialize(Common.vc, {
                showCreateTimelineForm: CZ.Authoring.UI.showCreateTimelineForm,
                showEditTimelineForm: CZ.Authoring.UI.showEditTimelineForm,
                showCreateExhibitForm: CZ.Authoring.UI.showCreateExhibitForm,
                showEditExhibitForm: CZ.Authoring.UI.showEditExhibitForm,
                showEditContentItemForm: CZ.Authoring.UI.showEditContentItemForm
            });
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
        function getCoordinateFromDate(dateTime) {
            return getYearsBetweenDates(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDay(), 0, 0, 0);
        }
        Common.getCoordinateFromDate = getCoordinateFromDate;
        function getCoordinateFromDMY(year, month, day) {
            return getYearsBetweenDates(year, month, day, 0, 0, 0);
        }
        Common.getCoordinateFromDMY = getCoordinateFromDMY;
        function getDMYFromCoordinate(coord) {
            return getDateFrom(0, 0, 0, coord);
        }
        Common.getDMYFromCoordinate = getDMYFromCoordinate;
        function getCoordinateFromDecimalYear(decimalYear) {
            var localPresent = getPresent();
            var presentDate = getYearsBetweenDates(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay, 0, 0, 0);
            return decimalYear === 9999 ? presentDate : decimalYear;
        }
        Common.getCoordinateFromDecimalYear = getCoordinateFromDecimalYear;
        var present = undefined;
        function getPresent() {
            if(!present) {
                present = new Date();
                present.presentDay = present.getUTCDate();
                present.presentMonth = present.getUTCMonth();
                present.presentYear = present.getUTCFullYear();
            }
            return present;
        }
        Common.getPresent = getPresent;
        function getYearsBetweenDates(y1, m1, d1, y2, m2, d2) {
            var years = y2 - y1;
            if(y2 > 0 && y1 < 0) {
                years -= 1;
            }
            var months = m2 - m1;
            if(m1 > m2 || (m1 == m2 && d1 > d2)) {
                years--;
                months += 12;
            }
            var month = m1;
            var days = -d1;
            for(var i = 0; i < months; i++) {
                if(month == 12) {
                    month = 0;
                }
                days += CZ.Settings.daysInMonth[month];
                month++;
            }
            days += d2;
            var res = years + days / 365;
            return -res;
        }
        function getDateFrom(year, month, day, n) {
            var endYear = year;
            var endMonth = month;
            var endDay = day;
            endYear -= Math.floor(-n);
            var nDays = (n + Math.floor(-n)) * 365;
            while(nDays < 0) {
                var tempMonth = endMonth > 0 ? endMonth - 1 : 11;
                nDays += CZ.Settings.daysInMonth[tempMonth];
                endMonth--;
                if(endMonth < 0) {
                    endYear--;
                    endMonth = 11;
                }
            }
            endDay += Math.round(nDays);
            var tempDays = CZ.Settings.daysInMonth[endMonth];
            if(isLeapYear(endYear)) {
                tempDays++;
            }
            while(endDay > tempDays) {
                endDay -= tempDays;
                endMonth++;
                if(endMonth > 11) {
                    endMonth = 0;
                    endYear++;
                }
                tempDays = CZ.Settings.daysInMonth[endMonth];
                if(isLeapYear(endYear)) {
                    tempDays++;
                }
            }
            if(endYear < 0 && year > 0) {
                endYear -= 1;
            }
            return {
                year: endYear,
                month: endMonth,
                day: endDay
            };
        }
        function isLeapYear(year) {
            if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
                return true;
            } else {
                return false;
            }
        }
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
        function closeWelcomeScreen() {
            setCookie("welcomeScreenDisallowed", "1", 365);
            hideWelcomeScreen();
        }
        Common.closeWelcomeScreen = closeWelcomeScreen;
        function hideWelcomeScreen() {
            ((document.createElement("welcomeVideo"))).src = "";
            $("#welcomeScreenBack").css("display", "none");
        }
        Common.hideWelcomeScreen = hideWelcomeScreen;
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
            Common.axis.setTimeBorders();
        }
        Common.updateMarker = updateMarker;
        function loadDataUrl() {
            var match = /dataurl=([^\/]*)/g.exec(window.location.hash);
            if(match) {
                return unescape(match[1]);
            } else {
                switch(CZ.Settings.czDataSource) {
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
        function loadData() {
            CZ.UrlNav.getURL();
            CZ.Service.getTimelines({
                start: -50000000000,
                end: 9999,
                minspan: null
            }).then(function (response) {
                ProcessContent(response);
                Common.vc.virtualCanvas("updateViewport");
            }, function (error) {
                alert("Error connecting to service:\n" + error.responseText);
            });
        }
        Common.loadData = loadData;
        function ProcessContent(content) {
            var root = Common.vc.virtualCanvas("getLayerContent");
            root.beginEdit();
            CZ.Layout.Merge(content, root);
            root.endEdit(true);
            InitializeRegimes(content);
            if(Common.startHash) {
                visReg = CZ.UrlNav.navStringToVisible(Common.startHash.substring(1), Common.vc);
            }
            if(!visReg && Common.cosmosVisible) {
                window.location.hash = Common.cosmosVisible;
                visReg = CZ.UrlNav.navStringToVisible(Common.cosmosVisible, Common.vc);
            }
            if(visReg) {
                Common.controller.moveToVisible(visReg, true);
                updateAxis(Common.vc, Common.ax);
                var vp = Common.vc.virtualCanvas("getViewport");
                if(Common.startHash && window.location.hash !== Common.startHash) {
                    hashChangeFromOutside = false;
                    window.location.hash = Common.startHash;
                }
            }
        }
        function InitializeRegimes(content) {
            var f = function (timeline) {
                if(!timeline) {
                    return null;
                }
                var v = Common.vc.virtualCanvas("findElement", 't' + timeline.id);
                regimes.push(v);
                if(v) {
                    v = CZ.UrlNav.vcelementToNavString(v);
                }
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
            Common.earthVisible = f(earthTimeline);
            $("#regime-link-earth").click(function () {
                var visible = CZ.UrlNav.navStringToVisible(Common.earthVisible, Common.vc);
                setVisible(visible);
            });
            var lifeTimeline = CZ.Layout.FindChildTimeline(earthTimeline, CZ.Settings.lifeTimelineID);
            Common.lifeVisible = f(lifeTimeline);
            $("#regime-link-life").click(function () {
                var visible = CZ.UrlNav.navStringToVisible(Common.lifeVisible, Common.vc);
                setVisible(visible);
            });
            var prehistoryTimeline = CZ.Layout.FindChildTimeline(lifeTimeline, CZ.Settings.prehistoryTimelineID);
            Common.prehistoryVisible = f(prehistoryTimeline);
            $("#regime-link-prehistory").click(function () {
                var visible = CZ.UrlNav.navStringToVisible(Common.prehistoryVisible, Common.vc);
                setVisible(visible);
            });
            var humanityTimeline = CZ.Layout.FindChildTimeline(prehistoryTimeline, CZ.Settings.humanityTimelineID, true);
            Common.humanityVisible = f(humanityTimeline);
            $("#regime-link-humanity").click(function () {
                var visible = CZ.UrlNav.navStringToVisible(Common.humanityVisible, Common.vc);
                setVisible(visible);
            });
            Common.maxPermitedVerticalRange = {
                top: cosmosTimeline.y,
                bottom: cosmosTimeline.y + cosmosTimeline.height
            };
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
