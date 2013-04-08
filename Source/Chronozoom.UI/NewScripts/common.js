var CZ;
(function (CZ) {
    (function (Common) {
        var Settings = CZ.Settings;
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
        Common.regimesRatio;
        Common.regimeNavigator;
        var k = 1000000000;
        Common.setNavigationStringTo;
        Common.hashHandle = true;
        var tourNotParsed = undefined;
        Common.supercollection = "";
        Common.collection = "";
        function initialize() {
            Common.ax = ($)('#axis');
            Common.axis = CZ.Timescale(Common.ax);
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
                days += Settings.daysInMonth[month];
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
                nDays += Settings.daysInMonth[tempMonth];
                endMonth--;
                if(endMonth < 0) {
                    endYear--;
                    endMonth = 11;
                }
            }
            endDay += Math.round(nDays);
            var tempDays = Settings.daysInMonth[endMonth];
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
                tempDays = Settings.daysInMonth[endMonth];
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
            return vis2 != null ? (Math.abs(vis1.centerX - vis2.centerX) < Settings.allowedVisibileImprecision && Math.abs(vis1.centerY - vis2.centerY) < Settings.allowedVisibileImprecision && Math.abs(vis1.scale - vis2.scale) < Settings.allowedVisibileImprecision) : false;
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
                switch(Settings.czDataSource) {
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
                minspan: 5013
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
                updateNavigator(vp);
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
            var earthTimeline = CZ.Layout.FindChildTimeline(cosmosTimeline, earthTimelineID);
            Common.earthVisible = f(earthTimeline);
            var lifeTimeline = CZ.Layout.FindChildTimeline(earthTimeline, lifeTimelineID);
            Common.lifeVisible = f(lifeTimeline);
            var prehistoryTimeline = CZ.Layout.FindChildTimeline(lifeTimeline, prehistoryTimelineID);
            Common.prehistoryVisible = f(prehistoryTimeline);
            var humanityTimeline = CZ.Layout.FindChildTimeline(prehistoryTimeline, humanityTimelineID, true);
            Common.humanityVisible = f(humanityTimeline);
            Common.maxPermitedVerticalRange = {
                top: cosmosTimeline.y,
                bottom: cosmosTimeline.y + cosmosTimeline.height
            };
            Settings.maxPermitedTimeRange = {
                left: cosmosTimeline.left,
                right: cosmosTimeline.right
            };
            Common.maxPermitedScale = CZ.UrlNav.navStringToVisible(Common.cosmosVisible, Common.vc).scale * 1.1;
        }
        function updateLayout() {
            var topHeight = $("#header").outerHeight(true) + $("#axis").outerHeight(true);
            var bottomHeight = $("#footer").outerHeight(true);
            var bodyTopMargin = parseFloat($("body").css("marginTop").replace('px', ''));
            var bodyBottomMargin = parseFloat($("body").css("marginBottom").replace('px', ''));
            var bodyMargin = bodyTopMargin + bodyBottomMargin;
            var occupiedHeight = topHeight + bottomHeight + bodyMargin;
            document.getElementById("vc").style.height = (window.innerHeight - occupiedHeight) + "px";
            $(".breadCrumbPanel").css("width", Math.round(($("#vc").width() / 2 - 50)));
            $("#bc_navRight").css("left", ($(".breadCrumbPanel").width() + $(".breadCrumbPanel").position().left + 2) + "px");
            CZ.BreadCrumbs.visibleAreaWidth = $(".breadCrumbPanel").width();
            CZ.BreadCrumbs.updateHiddenBreadCrumbs();
            var offset = window.innerHeight - occupiedHeight;
            var biblOutTopMargin = 25;
            var biblOutBottomMargin = 15;
            document.getElementById("bibliographyOut").style.top = (topHeight + bodyTopMargin + 25) + "px";
            document.getElementById("bibliographyOut").style.height = (window.innerHeight - occupiedHeight - biblOutTopMargin - biblOutBottomMargin) + "px";
            var welcomeScreenHeight = $("#welcomeScreenOut").outerHeight();
            var diff = Math.floor((window.innerHeight - welcomeScreenHeight) / 2);
            document.getElementById("welcomeScreenOut").style.top = diff + "px";
            Common.vc.virtualCanvas("updateViewport");
            updateAxis(Common.vc, Common.ax);
            CZ.BreadCrumbs.updateBreadCrumbsLabels();
        }
        Common.updateLayout = updateLayout;
        function passThrough(e) {
            var mouseX = e.pageX;
            var mouseY = e.pageY;
            var cosmos_rect = $("#cosmos_rect");
            var offset_space = cosmos_rect.offset();
            var width_space = cosmos_rect.width();
            var height_space = cosmos_rect.height();
            if(mouseX > offset_space.left && mouseX < offset_space.left + width_space && mouseY > offset_space.top && mouseY < offset_space.top + height_space) {
                CZ.Search.navigateToBookmark(Common.cosmosVisible);
            }
            var earth_rect = $("#earth_rect");
            var offset_earth = earth_rect.offset();
            var width_earth = earth_rect.width();
            var height_earth = earth_rect.height();
            if(mouseX > offset_earth.left && mouseX < offset_earth.left + width_earth && mouseY > offset_earth.top && mouseY < offset_earth.top + height_earth) {
                CZ.Search.navigateToBookmark(Common.earthVisible);
            }
            var life_rect = $("#life_rect");
            var offset_life = life_rect.offset();
            var width_life = life_rect.width();
            var height_life = life_rect.height();
            if(mouseX > offset_life.left && mouseX < offset_life.left + width_life && mouseY > offset_life.top && mouseY < offset_life.top + height_life) {
                CZ.Search.navigateToBookmark(Common.lifeVisible);
            }
            var prehuman_rect = $("#prehuman_rect");
            var offset_prehuman = prehuman_rect.offset();
            var width_prehuman = prehuman_rect.width();
            var height_prehuman = prehuman_rect.height();
            if(mouseX > offset_prehuman.left && mouseX < offset_prehuman.left + width_prehuman && mouseY > offset_prehuman.top && mouseY < offset_prehuman.top + height_prehuman) {
                CZ.Search.navigateToBookmark(Common.prehistoryVisible);
            }
            var human_rect = $("#human_rect");
            var offset_human = human_rect.offset();
            var width_human = human_rect.width();
            var height_human = human_rect.height();
            if(mouseX > offset_human.left && mouseX < offset_human.left + width_human && mouseY > offset_human.top && mouseY < offset_human.top + height_human) {
                CZ.Search.navigateToBookmark(Common.humanityVisible);
            }
        }
        Common.passThrough = passThrough;
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
        function updateNavigator(vp) {
            var navigatorFunc = function (coordinate) {
                if(Math.abs(coordinate) < 0.00000000001) {
                    return 0;
                }
                var log = Math.log(coordinate) / 2.302585092994046;
                var pow = Math.pow(log, 3) * Math.exp(-log * 0.001);
                return (log + pow) * 13700000000 / 1041.2113538234402;
            };
            var left = vp.pointScreenToVirtual(0, 0).x;
            if(left < Settings.maxPermitedTimeRange.left) {
                left = Settings.maxPermitedTimeRange.left;
            }
            var right = vp.pointScreenToVirtual(vp.width, vp.height).x;
            if(right > Settings.maxPermitedTimeRange.right) {
                right = Settings.maxPermitedTimeRange.right;
            }
            var newRight = navigatorFunc(Math.abs(right));
            var newLeft = navigatorFunc(Math.abs(left));
            var newWidth = Math.max(2.0 / Common.regimesRatio, Math.abs(newRight - newLeft));
            var min = 0;
            var max = document.getElementById("cosmos_rect").clientWidth;
            var l = 301 - Common.regimesRatio * newLeft;
            var w = Common.regimesRatio * newWidth;
            if(l < 0 || l + w > max + 5) {
                return;
            }
            Common.regimeNavigator.css('left', l);
            Common.regimeNavigator.css('width', w);
        }
        Common.updateNavigator = updateNavigator;
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
