/*
Array for logging of inners messages and exceptions
*/
var Log = new Array();

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

function sqr(d) { return d * d; }

// Prevents the event from bubbling. 
// In non IE browsers, use e.stopPropagation() instead. 
// To cancel event bubbling across browsers, you should check for support for e.stopPropagation(), and proceed accordingly:
function preventbubble(e) {
	if (e && e.stopPropagation) //if stopPropagation method supported
		e.stopPropagation();
	else
		e.cancelBubble = true;
}

function getCoordinateFromDate(dateTime) {
	var localPresent = getPresent();
	return getYearsBetweenDates(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDay(), localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);
}

function getCoordinateFromDMY(year, month, day) {
	var localPresent = getPresent();
	return getYearsBetweenDates(year, month, day, localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);
}

function getDMYFromCoordinate(coord) {
	var localPresent = getPresent();
	return getDateFrom(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay, coord);
}

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
		days += daysInMonth[month];
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
		nDays += daysInMonth[tempMonth];
		endMonth--;
		if (endMonth < 0) {
			endYear--;
			endMonth = 11;
		}
	}

	endDay += Math.round(nDays);
	// get count of days in current month
	var tempDays = daysInMonth[endMonth];
	// if result day is bigger than count of days then one more month has passed too            
	while (endDay > tempDays) {
		endDay -= tempDays;
		endMonth++;
		if (endMonth > 11) {
			endMonth = 0;
			endYear++;
		}
		tempDays = daysInMonth[endMonth];
	}
	if (endYear < 0 && year > 0)
		endYear -= 1;

	return { year: endYear, month: endMonth, day: endDay };
}

function isLeapYear(year) {
	if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) return true;
	else return false;
}

function toggleOffImage(elemId, ext) {
	if (!ext) ext = 'jpg';
	var imageSrc = $("#" + elemId).attr("src");
	var len = imageSrc.length;
	var prefix = imageSrc.substring(0, len - 7);
	if (imageSrc.substring(len - 6, len - 4) == "on") {
		var newSrc = prefix + "_off." + ext;
		$("#" + elemId).attr("src", newSrc);
	}
}

function toggleOnImage(elemId, ext) {
	if (!ext) ext = 'jpg';
	var imageSrc = $("#" + elemId).attr("src");
	var len = imageSrc.length;
	var prefix = imageSrc.substring(0, len - 7);
	if (imageSrc.substring(len - 6, len - 4) == "ff") {
		var newSrc = prefix + "on." + ext;
		$("#" + elemId).attr("src", newSrc);
	}
}

function showFooter() {
	$("#footerBack").show('clip', {}, 'slow');
}

function GenerateProperty(dateContainer, timeUnit, year, month, day, propName) {
	var present = getPresent().getUTCFullYear();
	if (dateContainer[timeUnit].toLowerCase() == "ga") {
		dateContainer[propName] = -dateContainer[year] * 1000000000;
	} else if (dateContainer[timeUnit].toLowerCase() == "ma") {
		dateContainer[propName] = -dateContainer[year] * 1000000;
	} else if (dateContainer[timeUnit].toLowerCase() == "ka") {
		dateContainer[propName] = -dateContainer[year] * 1000;
	} else if (dateContainer[timeUnit].toLowerCase() == "bce") {
		dateContainer[propName] = getCoordinateFromDMY(
            -dateContainer[year],
            dateContainer[month] == null ? 0 : Math.min(11, Math.max(0, dateContainer[month] - 1)),
            dateContainer[day] == null ? 1 : dateContainer[day]);
	} else if (dateContainer[timeUnit].toLowerCase() == "ce") {
		dateContainer[propName] = getCoordinateFromDMY(
            dateContainer[year],
            dateContainer[month] == null ? 0 : Math.min(11, Math.max(0, dateContainer[month] - 1)),
            dateContainer[day] == null ? 1 : dateContainer[day]);
	}
}

/*Animation tooltip parameter*/
var animationTooltipRunning = null;
var tooltipMode = "default"; //['infodot'], ['timeline'] indicates whether tooltip is refers to timeline or to infodot

function stopAnimationTooltip() {
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
function compareVisibles(vis1, vis2) {
    return vis2 != null ?
            (Math.abs(vis1.centerX - vis2.centerX) < allowedVisibileImprecision &&
            Math.abs(vis1.centerY - vis2.centerY) < allowedVisibileImprecision &&
            Math.abs(vis1.scale - vis2.scale) < allowedVisibileImprecision)
            : false;
}
