/// <reference path="../Utils/jquery-1.7.2.min.js" />
/// <reference path="../Utils/jasmine-jquery.js" />
/// <reference path="../Js/timescale.js" />
/// <reference path="../Js/common.js" />
/// <reference path="../Js/cz.settings.js" />
/// <reference path="../Js/settings.js" />

var oneDay = 0.0027397260274;
var currentDate = new Date();
var curY = currentDate.getFullYear();
var curM = currentDate.getMonth();
var curD = currentDate.getDate();

describe("CZ.Timescale part", function () {

    describe("constructor", function () {
        it("should throw exception if container undifined", function () {
            var container;
            expect(function () { new CZ.Timescale(container) }).toThrow(new Error("Container parameter is undefined!"));
        });

        it("should throw exception if container is no 'div'", function () {
            var container = document.createElement('table');
            expect(function () { new CZ.Timescale(container) }).toThrow(new Error("Container parameter is invalid! It should be DIV, or ID of DIV, or jQuery instance of DIV."));
        });
    });

    describe("setTimeBorders() method should return", function () {

        beforeEach(function () {
            //setFixtures('<body></body>');
            $('body').prepend('<div id="axis" style="display:none;"></div>');
            $('body').prepend('<p id="timescale_left_border" style="display:none;"></p>');
            $('body').prepend('<p id="timescale_right_border" style="display:none;"></p>');
            _width = 1904;
            _height = 75;
            _mode = "cosmos";
            var range = { min: -4042918454.9356203, max: 2013 };
            tm = new CZ.Timescale($('#axis'));
            tm.update(range);
        });

        it("4042.9 Ma and 0.0 Ma when navigate to Life", function () {
            tm.setTimeBorders();
            expect("4042.9 Ma").toEqual($('#timescale_left_border').text());
            expect("0.0 Ma").toEqual($('#timescale_right_border').text());
        });
    });
});

describe("CZ.DateTickSource part", function () {
    var dateTickSource;
    beforeEach(function () {
        dateTickSource = new CZ.DateTickSource();
    });
    describe("GetTicks() method", function () {
        it("should return 1 year after -1 year (not zero year)", function () {
            var diff = getYearsBetweenDates(1, 3, 10, curY, curM, curD);

            var rangeMax = diff + oneDay * 4;
            var rangeMin = diff - oneDay * 4;

            var range = { min: rangeMin, max: rangeMax };
            var ticks = dateTickSource.getTicks(range);
            var ticksLabels = [];

            for (var i in ticks) {
                ticksLabels.push(ticks[i].label[0].innerHTML);
            }

            expect(ticksLabels).not.toContain('1 January, 0');
            expect(ticksLabels).toContain('1 January, -2012');
        });

        it("should contain 29 February in leap year (1600)", function () {
            var diff = getYearsBetweenDates(1600, 5, 10, curY, curM, curD);

            var rangeMax = diff + oneDay * 4;
            var rangeMin = diff - oneDay * 4;
            
            var ticks = dateTickSource.getTicks({ min: rangeMin, max: rangeMax });
            var ticksLabels = [];

            for (var i in ticks) {
                ticksLabels.push(ticks[i].label[0].innerHTML);
            }
            
            expect(ticksLabels).toContain('29 February');
        });

    });
});

describe("CZ.CalendarTickSource part", function () { //this is the class for creating ticks
    var calendarTickSrc;
    beforeEach(function () {
        calendarTickSrc = new CZ.CalendarTickSource();
    });

    describe("createTicks() method should return", function () {
        it("more than one tiks", function () { //zoom in, visible only one tick on axis
            calendarTickSrc.range = { min: -2013.735907209565, max: -2012.656057065432 };
            calendarTickSrc.beta = 0;
            calendarTickSrc.delta = 1;
            var ticks = calendarTickSrc.createTicks(this.range);
            expect(ticks.length).toBeGreaterThan(1);
        });
    });
});

describe("Axis", function () {
    var calendarTickSrc;
    var dateTickSource;
    beforeEach(function () {
        calendarTickSrc = new CZ.CalendarTickSource();
        dateTickSource = new CZ.DateTickSource();

    });

    describe("should display", function () {
        it("each small tick in one year", function () {
            var start = -1600;
            var end = -1600;
            var days = 365;

            for (var i = 1; i < days; i++) {
                end += oneDay;
                var range = { min: start, max: end };
                var ticks = dateTickSource.getTicks(range);
                var minors = dateTickSource.createSmallTicks(ticks);
                expect(minors.length).toEqual(3);
                expect(minors[0]).not.toEqual(minors[1]);
                expect(minors[1]).not.toEqual(minors[2]);
                expect(minors[2]).not.toEqual(minors[0]);
                start += oneDay;
            }
        });
    });
});


describe("CZ.CosmosTickSource", function () {
    var cosmosTickSrc;
    beforeEach(function () {
        cosmosTickSrc = new CZ.CosmosTickSource();
    });
    describe("createTicks() method should", function () {  //TODO: test bug: not return ticks
        describe("call", function () {
            it("refreshDivs() method", function () {
                spyOn(cosmosTickSrc, 'createTicks');
                cosmosTickSrc.createTicks();
                expect(cosmosTickSrc.createTicks).toHaveBeenCalled();
            });
        });
    });
});

//Helpers
function getYearsBetweenDates(y1, m1, d1, y2, m2, d2) {
    var years = y2 - y1;
    if (y2 > 0 && y1 < 0) {
        years -= 1;
    }
    var months = m2 - m1;
    if (m1 > m2 || (m1 == m2 && d1 > d2)) {
        years--;
        months += 12;
    }
    var month = m1;
    var days = -d1;
    for (var i = 0; i < months; i++) {
        if (month == 12) {
            month = 0;
        }
        days += CZ.Settings.daysInMonth[month];
        month++;
    }
    days += d2;
    var res = years + days / 365;
    return -res;
}
//Helpers