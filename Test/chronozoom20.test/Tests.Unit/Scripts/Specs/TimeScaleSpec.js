/// <reference path="../Utils/jquery-1.7.2.min.js" />
/// <reference path="../Utils/j" />
/// <reference path="../Utils/jasmine-jquery.js" />
/// <reference path="../Js/timescale.js" />
/// <reference path="../Js/common.js" />
/// <reference path="../Js/cz.dates.js" />
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

        describe("setMode() method should set 'mode'", function () {
            var range;
            var timescale;
            beforeEach(function () {
                $('body').prepend('<div id="axis" style="display:none;"></div>');
                $('body').prepend('<p id="timescale_left_border" style="display:none;"></p>');
                $('body').prepend('<p id="timescale_right_border" style="display:none;"></p>');
                timescale = new CZ.Timescale($('#axis'));
            });

            it("to 'cosmos' if range.min <= -10000", function () {
                range = { min: -20000, max: 50 };
                timescale.update(range);
                expect(timescale.mode).toEqual("cosmos");
            });

            it("to 'calendar' if range.min > -10000 and beta >= 0", function () {
                range = { min: 5, max: 10 };
                timescale.update(range);
                expect(timescale.mode).toEqual("calendar");
            });

            //it("to 'date' if range.min > -10000 and beta < 0", function () {
            //    range = { min: 99.1, max: 100 };
            //    timescale.update(range);
            //    expect(timescale.mode).toEqual("date");
            //});
        });

    });
});

describe("CZ.TickSource part", function () { //this is the class for creating ticks
    var tickSrc;
    beforeEach(function () {
        tickSrc = new CZ.TickSource();
    });

    describe("decreaseTickCount() method", function () {
        describe("should", function () {
            it("decrease delta to 2 if delta = 1", function () {
                tickSrc.delta = 1;
                tickSrc.decreaseTickCount();
                expect(2).toEqual(tickSrc.delta);
            });

            it("decrease delta to 5 if delta = 2", function () {
                tickSrc.delta = 2;
                tickSrc.decreaseTickCount();
                expect(5).toEqual(tickSrc.delta);
            });

            it("increase delta to 1 if delta = 5, and beta ++", function () {
                tickSrc.beta = 1;
                tickSrc.delta = 5;
                tickSrc.decreaseTickCount();
                expect(1).toEqual(tickSrc.delta);
                expect(2).toEqual(tickSrc.beta);
            });

            it("nothing if delta not equall 1,2,5", function () {
                tickSrc.beta = 0;
                tickSrc.delta = 0;
                tickSrc.decreaseTickCount();
                expect(0).toEqual(tickSrc.delta);
                expect(0).toEqual(tickSrc.beta);
            });

            it("have been call createTicks()", function () {
                spyOn(tickSrc, 'createTicks');
                tickSrc.decreaseTickCount();
                expect(tickSrc.createTicks).toHaveBeenCalled();
            });
        });

        describe("increaseTickCount() method", function () {
            describe("should", function () {
                it("increase beta to 1 and set delta to 5, if delta = 1 ", function () {
                    tickSrc.delta = 1;
                    tickSrc.beta = 1;
                    tickSrc.increaseTickCount();
                    expect(5).toEqual(tickSrc.delta);
                    expect(0).toEqual(tickSrc.beta);
                });

                it("decrease delta to 1, if delta = 2", function () {
                    tickSrc.delta = 2;
                    tickSrc.increaseTickCount();
                    expect(1).toEqual(tickSrc.delta);
                });

                it("decrease delta to 2, if delta = 5", function () {
                    tickSrc.delta = 5;
                    tickSrc.increaseTickCount();
                    expect(2).toEqual(tickSrc.delta);
                });

                it("nothing if delta not equall 1,2,5", function () {
                    tickSrc.beta = 0;
                    tickSrc.delta = 0;
                    tickSrc.increaseTickCount();
                    expect(0).toEqual(tickSrc.delta);
                    expect(0).toEqual(tickSrc.beta);
                });

                it("have been call createTicks()", function () {
                    spyOn(tickSrc, 'createTicks');
                    tickSrc.increaseTickCount();
                    expect(tickSrc.createTicks).toHaveBeenCalled();
                });
            });
        });
    });
});

describe("CZ.CosmosTickSource part", function () { //this is the class for creating ticks
    var cosmosTickSrc;
    beforeEach(function () {
        cosmosTickSrc = new CZ.CosmosTickSource();
    });

    //describe("getLabel() method should return", function () {
    //    it("'10 ka' if x = -10000", function () {
    //        var x = -10000;
    //        var result = cosmosTickSrc.getLabel(x);
    //        expect("10 ka").toEqual(cosmosTickSrc.regime);
    //        expect("10 ka").toEqual(result);
    //    });
    //});

    describe("getRegime() method should set", function () {
        it("regime to 'Ga' if l <= -10000000000", function () {
            var l = -10000000000;
            var r = 0;
            cosmosTickSrc.getRegime(l, r);
            expect("Ga").toEqual(cosmosTickSrc.regime);
        });

        it("regime to 'Ga' if l <= -10000000000", function () {
            var l = -10000000000;
            var r = 0;
            cosmosTickSrc.getRegime(l, r);
            expect("Ga").toEqual(cosmosTickSrc.regime);
        });

        it("regime to 'Ma' if l <= -10000000", function () {
            var l = -10000000;
            var r = 0;
            cosmosTickSrc.getRegime(l, r);
            expect("Ma").toEqual(cosmosTickSrc.regime);
        });

        it("regime to 'Ma' if range.min <= -10000000 and beta < 7", function () {
            var l = -10000615221.34466;
            var r = -9999780877.874556;
            cosmosTickSrc.getRegime(l, r);
            expect("Ma").toEqual(cosmosTickSrc.regime);
            expect(1000000).toEqual(cosmosTickSrc.level);
        });

        it("regime to 'ka' if l <= -10000", function () {
            var l = -10000;
            var r = 0;
            cosmosTickSrc.getRegime(l, r);
            expect("ka").toEqual(cosmosTickSrc.regime);
        });

        it("range.min and range.max to default value if l>r", function () {
            var l = 20;
            var r = 10;
            var defaultValue = -13700000000; //from cz.settings
            cosmosTickSrc.getRegime(l, r);
            expect(0).toEqual(cosmosTickSrc.range.max);
            expect(defaultValue).toEqual(cosmosTickSrc.range.min);
        });
        
        it("range.min and range.max to input values if l<r", function () {
            var l = -20;
            var r = -10;
            cosmosTickSrc.getRegime(l, r);
            expect(cosmosTickSrc.range.min).toEqual(l);
            expect(cosmosTickSrc.range.max).toEqual(r);
        });
        
        it("range.min to maxPermitedTimeRange.left, if range.min < maxPermitedTimeRange.left and l < r", function () {
            var l = -13700000000;
            var r = -10;
            cosmosTickSrc.getRegime(l, r);
            expect(cosmosTickSrc.range.min).toEqual(l);
        });
        
        it("range.max to maxPermitedTimeRange.right, if range.max > maxPermitedTimeRange.right and l < r", function () {
            var l = -13700000000;
            var r = 10;
            cosmosTickSrc.getRegime(l, r);
            expect(cosmosTickSrc.range.max).toEqual(0);
        });
    });
});

describe("CZ.CalendarTickSource part", function () { //this is the class for creating ticks
    var calendarTickSrc;
    beforeEach(function () {
        calendarTickSrc = new CZ.CalendarTickSource();
    });

    describe("getLabel() method should return", function () {
        it("'1 CE' if x = -10000", function () {  //AD vs CE, wain answer from Peter or Roland
            var x = 1;
            var result = calendarTickSrc.getLabel(x);
            expect("1 CE").toEqual(result);
        });
        it("'1 BCE' if x = 0", function () {
            var x = 0;
            var result = calendarTickSrc.getLabel(x);
            expect("1 BCE").toEqual(result);
        });
    });

    describe("getRegime() method should set", function () {
        var currentDate;
        var firstYear;
        beforeEach(function () {
            currentDate = new Date();
            firstYear = CZ.Dates.getCoordinateFromDMY(0, 0, 1);
        });

        it("range.min and range.max to input values if l<r", function () {
            var l = -20;
            var r = -10;
            var firstYear = CZ.Dates.getCoordinateFromDMY(0, 0, 1);
            calendarTickSrc.getRegime(l, r);
            expect(calendarTickSrc.range.min).toEqual(l -= firstYear);
            expect(calendarTickSrc.range.max).toEqual(r -= firstYear);
        });
        
        it("range.min and range.max to maxPermitedTimeRange 'left' and 'right' values if l>r", function () {
            var l = -10;
            var r = -20;
            calendarTickSrc.getRegime(l, r);
            expect(calendarTickSrc.range.min).toEqual(CZ.Settings.maxPermitedTimeRange.left -= firstYear);
            expect(calendarTickSrc.range.max).toEqual(CZ.Settings.maxPermitedTimeRange.right -= firstYear);
        });

        it("range.min to maxPermitedTimeRange.left, if range.min < maxPermitedTimeRange.left and l < r", function () {
            var l = -13700000000;
            var r = -10;
            calendarTickSrc.getRegime(l, r);
            expect(calendarTickSrc.range.min).toEqual(l -= firstYear);
        });

        it("range.max to maxPermitedTimeRange.right, if range.max > maxPermitedTimeRange.right and l < r", function () {
            var l = -13700000000;
            var r = 10;
            calendarTickSrc.getRegime(l, r);
            expect(calendarTickSrc.range.max).toEqual(0 - firstYear*2);
        });

        it("regime to 'BCE/CE' after call", function () {
            var l = -10000000000;
            var r = 0;
            calendarTickSrc.getRegime(l, r);
            expect("BCE/CE").toEqual(calendarTickSrc.regime);
        });

        it("startDate value to current date if l<r and l>0", function () {
            var l = 2000;
            var r = 4000;
            calendarTickSrc.getRegime(l, r);
            expect({ year: currentDate.getFullYear(), month: currentDate.getMonth(), day: currentDate.getDate() }).toEqual(calendarTickSrc.startDate);
        });
        
    });
});

describe("CZ.DateTickSource part", function () {
    var dateTickSrc;
    beforeEach(function () {
        dateTickSrc = new CZ.DateTickSource();
        CZ.Settings.maxPermitedTimeRange.left = 0;
        CZ.Settings.maxPermitedTimeRange.right = 5;
    });

    describe("getRegime() method should set regime to", function () {
        it("'Quarters_Month' if beta > -0.2", function () {
            var l = 0.3;
            var r = 1;
            dateTickSrc.getRegime(l, r);
            expect("Quarters_Month").toEqual(dateTickSrc.regime);
        });

        //it("'Quarters_Month' if beta = -0.2", function () {
        //    var l = 0.3;
        //    var r = 1;
        //    dateTickSrc.getRegime(l, r);
        //    expect("Quarters_Month").toEqual(dateTickSrc.regime);
        //});
        
        it("'Month_Weeks' if beta < -0.2 and > -0.8", function () {
            var l = 0.8;
            var r = 1;
            dateTickSrc.getRegime(l, r);
            expect("Month_Weeks").toEqual(dateTickSrc.regime);
        });

        //it("'Month_Weeks' if beta = -0.8", function () {
        //    var l = 0.8;
        //    var r = 1;
        //    dateTickSrc.getRegime(l, r);
        //    expect("Month_Weeks").toEqual(dateTickSrc.regime);
        //});
        
        it("'Weeks_Days' if beta < -0.8 and > -1.4", function () {
            var l = 0.9;
            var r = 1;
            dateTickSrc.getRegime(l, r);
            expect("Weeks_Days").toEqual(dateTickSrc.regime);
        });
        
        //it("'Month_Weeks' if beta = -1.4", function () {
        //    var l = 0.9601893;
        //    var r = 1;
        //    dateTickSrc.getRegime(l, r);
        //    expect("Weeks_Days").toEqual(dateTickSrc.regime);
        //});
        
        it("'Days_Quarters' if beta < -0.8 and > -1.4", function () {
            var l = 0.99;
            var r = 1;
            dateTickSrc.getRegime(l, r);
            expect("Days_Quarters").toEqual(dateTickSrc.regime);
        });


    });
});

