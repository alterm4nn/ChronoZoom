/// <reference path="../Utils/jquery-1.7.2.min.js" />
/// <reference path="../Utils/jasmine-jquery.js" />
/// <reference path="../Js/timescale.js" />
/// <reference path="../Js/dates.js" />
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

    //todo: test bug, variable _width can not override. By default it equal 300.
    //describe("setTimeBorders() method should return", function () {

    //    beforeEach(function () {
    //        //setFixtures('<body></body>');
    //        $('body').prepend('<div id="axis" style="display:none;"></div>');
    //        $('body').prepend('<p id="timescale_left_border" style="display:block;"></p>');
    //        $('body').prepend('<p id="timescale_right_border" style="display:block;"></p>');
    //        _width = 1904;
    //        _height = 75;
    //        _mode = "cosmos";
    //        var range = { min: -4029787249.035389, max: 55321190.10329175 }
    //        tm = new CZ.Timescale($('#axis'));
    //        tm.update(range);
    //    });

    //    it("4042.9 Ma and 0.0 Ma when navigate to Life", function () {
    //        tm.setTimeBorders();
    //        expect("4042.9 Ma").toEqual($('#timescale_left_border').text());
    //        expect("0.0 Ma").toEqual($('#timescale_right_border').text());
    //    });
    //});
});

describe("CZ.DateTickSource part", function () {
    var dateTickSource;
    beforeEach(function () {
        dateTickSource = new CZ.DateTickSource();
    });
    describe("GetTicks() method", function () {
        it("should return 1 year after -1 year (not zero year)", function () {
            var range = { min: 0.9875100674037871, max: 1.0127396576942072 };
            CZ.Settings.maxPermitedTimeRange.right = 2013;

            var ticks = dateTickSource.getTicks(range);
            var ticksLabels = [];

            for (var i in ticks) {
                ticksLabels.push(ticks[i].label[0].innerHTML);
            }

            expect(ticksLabels).not.toContain('1 January, 0');
            expect(ticksLabels).toContain('1 January, 1');
        });

        //it("should contain 29 February in leap year (1600)", function () {
        //    throw "Bug #34 is not resolved!";

        //    var range = { min: 1600.144803433211, max: 1600.1702031121245 };
        //    CZ.Settings.maxPermitedTimeRange.right = 2013;

        //    var ticks = dateTickSource.getTicks(range);
        //    var ticksLabels = [];

        //    for (var i in ticks) {
        //        ticksLabels.push(ticks[i].label[0].innerHTML);
        //    }

        //    expect(ticksLabels).toContain('29 February');
        //});

    });
});

//describe("CZ.CalendarTickSource part", function () { //this is the class for creating ticks
//    var calendarTickSrc;
//    beforeEach(function () {
//        calendarTickSrc = new CZ.CalendarTickSource();
//    });

//    describe("createTicks() method should return", function () {
//        it("more than one tiks", function () { //zoom in, visible only one tick on axis
//            throw "Bug #36 is not resolved!";
//            calendarTickSrc.range = { min: -2013.735907209565, max: -2012.656057065432 };
//            calendarTickSrc.beta = 0;
//            calendarTickSrc.delta = 1;
//            var ticks = calendarTickSrc.createTicks(this.range);
//            expect(ticks.length).toBeGreaterThan(1);
//        });
//    });
//});

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

describe("When user set mouse to timescale point", function () {

    beforeEach(function () {
        $('body').prepend('<div id="axis" style="display:none;"></div>');
        $('body').prepend('<p id="timescale_marker" style="display:none;"></p>');
        _width = 1904;
        _height = 75;

        CZ.Settings.maxPermitedTimeRange = {
            left: -13700000000,
            right: 2013.25
        };
        tm = new CZ.Timescale($('#axis'));
    });
    describe("in cosmos mode", function () {
        describe("and Ma regime", function () {
            beforeEach(function () {
                time = -2252824056.1538224;
                expectedResult = 2252.8 + " Ma";
                var range = { min: -5226707537.317015, max: 656709550.6101665 };
                tm.update(range);
            });
            it("Then: marker value should be corrected", function () {
                tm.setTimeMarker(time);
                expect(expectedResult).toEqual($('#marker-text').text());
            });
        });
        describe("and Ga regime", function () {
            beforeEach(function () {
                time = -9722580060.656828;
                expectedResult = 9.7 + " Ga";
                var range = { min: -13920967774.407955, max: 220969787.70110416 };
                tm.update(range);
            });
            it("Then: marker value should be corrected", function () {
                tm.setTimeMarker(time);
                expect(expectedResult).toEqual($('#marker-text').text());
            });
        });
        describe("and ka regime", function () {
            beforeEach(function () {
                time = -5405.34945727703;
                expectedResult = 5.4 + " ka";
                var range = { min: -11613.371118660096, max: 23861.03837495743 };
                tm.update(range);
            });
            it("Then: marker value should be corrected", function () {
                tm.setTimeMarker(time);
                expect(expectedResult).toEqual($('#marker-text').text());
            });
        });
    });
    describe("in calendar mode", function () {
        describe("and BCE area", function () {
            beforeEach(function () {
                time = -3447.996412540633;
                expectedResult = 3449 + " BCE";
                var range = { min: -3447.996412540633, max: 2461.289563225633 };
                tm.update(range);
            });
            it("Then: marker value should be corrected", function () {
                tm.setTimeMarker(time);
                expect(expectedResult).toEqual($('#marker-text').text());
            });
        });
        describe("and CE area", function () {
            beforeEach(function () {
                time = 1001;
                expectedResult = "1001 CE";
                var range = { min: -3447.996412540633, max: 2461.289563225633 };
                tm.update(range);
            });
            it("Then: marker value should be corrected", function () {
                tm.setTimeMarker(time);
                expect(expectedResult).toEqual($('#marker-text').text());
            });
        });
        describe("and time = 0", function () {
            beforeEach(function () {
                time = 0.5027397260273974;
                expectedResult = 1 + " BCE";
                var range = { min: -3447.996412540633, max: 2461.289563225633 };
                tm.update(range);
            });
            it("Then: marker value should be corrected", function () {
                tm.setTimeMarker(time);
                expect(expectedResult).toEqual($('#marker-text').text());
            });
        });
    });
    describe("in date mode", function () {
        describe("and one year area", function () {
            beforeEach(function () {
                time = 2012.1946866592516;
                expectedResult = '13.3.2012';
                var range = { min: 2011.5541057045, max: 2012.5469000468117 };
                tm.update(range);
            });
            it("Then: marker value should be corrected", function () {
                tm.setTimeMarker(time);
                expect(expectedResult).toEqual($('#marker-text').text());
            });
        });


        //todo: Can not define internal variable _ticks.
        //describe("and one day area", function () {
        //    beforeEach(function () {
        //        time = 197.72385213591;
        //        expectedResult = '21';
        //        var range = { min: 198.16175542755357, max: 198.16255773500498 };
        //        tm.update(range);
        //    });
        //    it("Then: marker value should be corrected", function () {
        //        tm.setTimeMarker(time);
        //        expect(expectedResult).toEqual($('#marker-text').text());
        //    });
        //});
    });
});