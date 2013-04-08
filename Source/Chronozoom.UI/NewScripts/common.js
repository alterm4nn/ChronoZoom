var Log = new Array();
var controller;
var isAxisFreezed = true;
var startHash;
var searchString;
var ax, vc;
var visReg;
var cosmosVisible, earthVisible, lifeVisible, prehistoryVisible, humanityVisible;
var content;
var breadCrumbs;
var firstTimeWelcomeChecked = true;
var regimes = new Array();
var regimesRatio;
var regimeNavigator;
var k = 1000000000;
var setNavigationStringTo;
var hashHandle = true;
var tourNotParsed = undefined;
var supercollection = "";
var collection = "";
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
function sqr(d) {
    return d * d;
}
function preventbubble(e) {
    if(e && e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}
function getCoordinateFromDate(dateTime) {
    return getYearsBetweenDates(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDay(), 0, 0, 0);
}
function getCoordinateFromDMY(year, month, day) {
    return getYearsBetweenDates(year, month, day, 0, 0, 0);
}
function getDMYFromCoordinate(coord) {
    return getDateFrom(0, 0, 0, coord);
}
function getCoordinateFromDecimalYear(decimalYear) {
    var localPresent = getPresent();
    var presentDate = getYearsBetweenDates(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay, 0, 0, 0);
    return decimalYear === 9999 ? presentDate : decimalYear;
}
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
        days += daysInMonth[month];
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
        nDays += daysInMonth[tempMonth];
        endMonth--;
        if(endMonth < 0) {
            endYear--;
            endMonth = 11;
        }
    }
    endDay += Math.round(nDays);
    var tempDays = daysInMonth[endMonth];
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
        tempDays = daysInMonth[endMonth];
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
function showFooter() {
    $("#footerBack").show('clip', {
    }, 'slow');
}
function GenerateProperty(dateContainer, timeUnit, year, month, day, propName) {
    var present = getPresent().getUTCFullYear();
    if(dateContainer[timeUnit].toLowerCase() == "ga") {
        dateContainer[propName] = -dateContainer[year] * 1000000000;
    } else if(dateContainer[timeUnit].toLowerCase() == "ma") {
        dateContainer[propName] = -dateContainer[year] * 1000000;
    } else if(dateContainer[timeUnit].toLowerCase() == "ka") {
        dateContainer[propName] = -dateContainer[year] * 1000;
    } else if(dateContainer[timeUnit].toLowerCase() == "bce") {
        dateContainer[propName] = getCoordinateFromDMY(-dateContainer[year], dateContainer[month] == null ? 0 : Math.min(11, Math.max(0, dateContainer[month] - 1)), dateContainer[day] == null ? 1 : dateContainer[day]);
    } else if(dateContainer[timeUnit].toLowerCase() == "ce") {
        dateContainer[propName] = getCoordinateFromDMY(dateContainer[year], dateContainer[month] == null ? 0 : Math.min(11, Math.max(0, dateContainer[month] - 1)), dateContainer[day] == null ? 1 : dateContainer[day]);
    }
}
function closeWelcomeScreen() {
    setCookie("welcomeScreenDisallowed", "1", 365);
    hideWelcomeScreen();
}
function hideWelcomeScreen() {
    document.getElementById("welcomeVideo").src = "";
    $("#welcomeScreenBack").css("display", "none");
}
var animationTooltipRunning = null;
var tooltipMode = "default";
function stopAnimationTooltip() {
    if(animationTooltipRunning != null) {
        $('.bubbleInfo').stop();
        $(".bubbleInfo").css("opacity", "0.9");
        $(".bubbleInfo").css("filter", "alpha(opacity=90)");
        $(".bubbleInfo").css("-moz-opacity", "0.9");
        animationTooltipRunning = null;
        $(".bubbleInfo").attr("id", "defaultBox");
        $(".bubbleInfo").hide();
    }
}
function compareVisibles(vis1, vis2) {
    return vis2 != null ? (Math.abs(vis1.centerX - vis2.centerX) < allowedVisibileImprecision && Math.abs(vis1.centerY - vis2.centerY) < allowedVisibileImprecision && Math.abs(vis1.scale - vis2.scale) < allowedVisibileImprecision) : false;
}
function setVisibleByUserDirectly(visible) {
    pauseTourAtAnyAnimation = false;
    if(tour != undefined && tour.state == "play") {
        tourPause();
    }
    return setVisible(visible);
}
function setVisible(visible) {
    if(visible) {
        return controller.moveToVisible(visible);
    }
}
function loadDataUrl() {
    var match = /dataurl=([^\/]*)/g.exec(window.location.hash);
    if(match) {
        return unescape(match[1]);
    } else {
        switch(czDataSource) {
            case 'db':
                return "Chronozoom.svc/get";
            case 'relay':
                return "ChronozoomRelay";
            case 'dump':
                return "oldResponseDump.txt";
            default:
                return null;
        }
    }
}
function loadData() {
    getURL();
    CZ.Service.getTimelines({
        start: -50000000000,
        end: 9999
    }).then(function (response) {
        ProcessContent(response);
        vc.virtualCanvas("updateViewport");
    }, function (error) {
        alert("Error connecting to service:\n" + error.responseText);
    });
}
function ProcessContent(content) {
    var root = vc.virtualCanvas("getLayerContent");
    root.beginEdit();
    Merge(content, root);
    root.endEdit(true);
    InitializeRegimes(content);
    if(startHash) {
        visReg = navStringToVisible(startHash.substring(1), vc);
    }
    if(!visReg && cosmosVisible) {
        window.location.hash = cosmosVisible;
        visReg = navStringToVisible(cosmosVisible, vc);
    }
    if(visReg) {
        controller.moveToVisible(visReg, true);
        updateAxis(vc, ax);
        var vp = vc.virtualCanvas("getViewport");
        updateNavigator(vp);
        if(startHash && window.location.hash !== startHash) {
            hashChangeFromOutside = false;
            window.location.hash = startHash;
        }
    }
}
function InitializeRegimes(content) {
    var f = function (timeline) {
        if(!timeline) {
            return null;
        }
        var v = vc.virtualCanvas("findElement", 't' + timeline.id);
        regimes.push(v);
        if(v) {
            v = vcelementToNavString(v);
        }
        return v;
    };
    var cosmosTimeline = content;
    cosmosVisible = f(cosmosTimeline);
    navigationAnchor = vc.virtualCanvas("findElement", 't' + cosmosTimeline.id);
    var earthTimeline = FindChildTimeline(cosmosTimeline, earthTimelineID);
    earthVisible = f(earthTimeline);
    var lifeTimeline = FindChildTimeline(earthTimeline, lifeTimelineID);
    lifeVisible = f(lifeTimeline);
    var prehistoryTimeline = FindChildTimeline(lifeTimeline, prehistoryTimelineID);
    prehistoryVisible = f(prehistoryTimeline);
    var humanityTimeline = FindChildTimeline(prehistoryTimeline, humanityTimelineID, true);
    humanityVisible = f(humanityTimeline);
    maxPermitedVerticalRange = {
        top: cosmosTimeline.y,
        bottom: cosmosTimeline.y + cosmosTimeline.height
    };
    maxPermitedTimeRange = {
        left: cosmosTimeline.left,
        right: cosmosTimeline.right
    };
    maxPermitedScale = navStringToVisible(cosmosVisible, vc).scale * 1.1;
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
    visibleAreaWidth = $(".breadCrumbPanel").width();
    updateHiddenBreadCrumbs();
    var offset = window.innerHeight - occupiedHeight;
    var biblOutTopMargin = 25;
    var biblOutBottomMargin = 15;
    document.getElementById("bibliographyOut").style.top = (topHeight + bodyTopMargin + 25) + "px";
    document.getElementById("bibliographyOut").style.height = (window.innerHeight - occupiedHeight - biblOutTopMargin - biblOutBottomMargin) + "px";
    var welcomeScreenHeight = $("#welcomeScreenOut").outerHeight();
    var diff = Math.floor((window.innerHeight - welcomeScreenHeight) / 2);
    document.getElementById("welcomeScreenOut").style.top = diff + "px";
    vc.virtualCanvas("updateViewport");
    updateAxis(vc, ax);
    updateBreadCrumbsLabels();
}
function passThrough(e) {
    var mouseX = e.pageX;
    var mouseY = e.pageY;
    var cosmos_rect = $("#cosmos_rect");
    var offset_space = cosmos_rect.offset();
    var width_space = cosmos_rect.width();
    var height_space = cosmos_rect.height();
    if(mouseX > offset_space.left && mouseX < offset_space.left + width_space && mouseY > offset_space.top && mouseY < offset_space.top + height_space) {
        navigateToBookmark(cosmosVisible);
    }
    var earth_rect = $("#earth_rect");
    var offset_earth = earth_rect.offset();
    var width_earth = earth_rect.width();
    var height_earth = earth_rect.height();
    if(mouseX > offset_earth.left && mouseX < offset_earth.left + width_earth && mouseY > offset_earth.top && mouseY < offset_earth.top + height_earth) {
        navigateToBookmark(earthVisible);
    }
    var life_rect = $("#life_rect");
    var offset_life = life_rect.offset();
    var width_life = life_rect.width();
    var height_life = life_rect.height();
    if(mouseX > offset_life.left && mouseX < offset_life.left + width_life && mouseY > offset_life.top && mouseY < offset_life.top + height_life) {
        navigateToBookmark(lifeVisible);
    }
    var prehuman_rect = $("#prehuman_rect");
    var offset_prehuman = prehuman_rect.offset();
    var width_prehuman = prehuman_rect.width();
    var height_prehuman = prehuman_rect.height();
    if(mouseX > offset_prehuman.left && mouseX < offset_prehuman.left + width_prehuman && mouseY > offset_prehuman.top && mouseY < offset_prehuman.top + height_prehuman) {
        navigateToBookmark(prehistoryVisible);
    }
    var human_rect = $("#human_rect");
    var offset_human = human_rect.offset();
    var width_human = human_rect.width();
    var height_human = human_rect.height();
    if(mouseX > offset_human.left && mouseX < offset_human.left + width_human && mouseY > offset_human.top && mouseY < offset_human.top + height_human) {
        navigateToBookmark(humanityVisible);
    }
}
function updateAxis(vc, ax) {
    var vp = vc.virtualCanvas("getViewport");
    var lt = vp.pointScreenToVirtual(0, 0);
    var rb = vp.pointScreenToVirtual(vp.width, vp.height);
    var newrange = {
        min: lt.x,
        max: rb.x
    };
    axis.update(newrange);
}
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
    if(left < maxPermitedTimeRange.left) {
        left = maxPermitedTimeRange.left;
    }
    var right = vp.pointScreenToVirtual(vp.width, vp.height).x;
    if(right > maxPermitedTimeRange.right) {
        right = maxPermitedTimeRange.right;
    }
    var newRight = navigatorFunc(Math.abs(right));
    var newLeft = navigatorFunc(Math.abs(left));
    var newWidth = Math.max(2.0 / regimesRatio, Math.abs(newRight - newLeft));
    var min = 0;
    var max = document.getElementById("cosmos_rect").clientWidth;
    var l = 301 - regimesRatio * newLeft;
    var w = regimesRatio * newWidth;
    if(l < 0 || l + w > max + 5) {
        return;
    }
    regimeNavigator.css('left', l);
    regimeNavigator.css('width', w);
}
function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}
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
function updateMarker() {
    axis.setTimeMarker(vc.virtualCanvas("getCursorPosition"));
    axis.setTimeBorders();
}
