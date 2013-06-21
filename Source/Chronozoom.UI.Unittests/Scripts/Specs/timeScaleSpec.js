/// <reference path="../../../Chronozoom.UI/scripts/external/jquery-1.7.2.min.js" />
/// <reference path="../../../Chronozoom.UI/scripts/external/jquery-ui.js" />
/// <reference path="../../../Chronozoom.UI/scripts/settings.js" />
/// <reference path="../../../Chronozoom.UI/scripts/timescale.js" />
/// <reference path="../../../Chronozoom.UI/scripts/dates.js" />

/// <reference path="../../../Chronozoom.UI/scripts/common.ts"/>
/// <reference path="../../../Chronozoom.UI/scripts/viewport.ts"/>
/// <reference path="../../../Chronozoom.UI/scripts/vccontent.ts"/>
/// <reference path="../../../Chronozoom.UI/scripts/virtual-canvas.js" />

var oneDay = 0.0027397260274;
var currentDate = new Date();
var curY = currentDate.getFullYear();
var curM = currentDate.getMonth();
var curD = currentDate.getUTCDate();

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

            it("to 'date' if range.min > -10000 and beta < 0", function () {
                range = { min: 99.1, max: 100 };
                timescale.update(range);
                expect(timescale.mode).toEqual("date");
            });
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

    describe("getLabel() method should return", function () {
        it("'80 ka' if x = -10000", function () {
            var x = -80000;
            var l = -90000;
            var r = 0;
            cosmosTickSrc.getRegime(l, r);
            var result = cosmosTickSrc.getLabel(x);
            expect("80 ka").toEqual(result);
        });

        it("'8 Ma' if x = -8000000", function () {
            var x = -8000000;
            var l = -90000000;
            var r = 0;
            cosmosTickSrc.getRegime(l, r);
            var result = cosmosTickSrc.getLabel(x);
            expect("8 Ma").toEqual(result);
        });

        it("'7 Ga' if x = -7000000000", function () {
            var x = -7000000000;
            var l = -13000000000;
            var r = 0;
            cosmosTickSrc.getRegime(l, r);
            var result = cosmosTickSrc.getLabel(x);
            expect("7 Ga").toEqual(result);
        });

        it("'11.5 Ma' if x = -11500000", function () {
            var x = -11500000;
            var l = -10168815.716898847;
            var r = -1438905.9972291654;
            cosmosTickSrc.getRegime(l, r);
            var result = cosmosTickSrc.getLabel(x);
            expect("11.5 Ma").toEqual(result);
        });
    });

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
            firstYear = CZ.Dates.getCoordinateFromYMD(0, 0, 1);
        });

        it("range.min and range.max to input values if l<r", function () {
            var l = -20;
            var r = -10;
            var firstYear = CZ.Dates.getCoordinateFromYMD(0, 0, 1);
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
            expect({ year: curY, month: curM, day: curD }).toEqual(calendarTickSrc.startDate);
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

        xit("'Quarters_Month' if beta = -0.2", function () {
           var l = 0.3;
           var r = 1;
           dateTickSrc.getRegime(l, r);
           expect("Quarters_Month").toEqual(dateTickSrc.regime);
        });
        
        it("'Month_Weeks' if beta < -0.2 and > -0.8", function () {
            var l = 0.8;
            var r = 1;
            dateTickSrc.getRegime(l, r);
            expect("Month_Weeks").toEqual(dateTickSrc.regime);
        });

        xit("'Month_Weeks' if beta = -0.8", function () {
           var l = 0.8;
           var r = 1;
           dateTickSrc.getRegime(l, r);
           expect("Month_Weeks").toEqual(dateTickSrc.regime);
        });
        
        it("'Weeks_Days' if beta < -0.8 and > -1.4", function () {
            var l = 0.9;
            var r = 1;
            dateTickSrc.getRegime(l, r);
            expect("Weeks_Days").toEqual(dateTickSrc.regime);
        });
        
        xit("'Month_Weeks' if beta = -1.4", function () {
           var l = 0.9601893;
           var r = 1;
           dateTickSrc.getRegime(l, r);
           expect("Weeks_Days").toEqual(dateTickSrc.regime);
        });
        
        it("'Days_Quarters' if beta < -0.8 and > -1.4", function () {
            var l = 0.99;
            var r = 1;
            dateTickSrc.getRegime(l, r);
            expect("Days_Quarters").toEqual(dateTickSrc.regime);
        });
    });
    
    describe("createTicks() method", function () {
        xit("should not hang in January range", function () {
            var testVisible = {
                centerX: -1598.985736056717,
                centerY: 2074963999.3720536,
                scale: 0.000015807448151022422
            };

            CZ.Common.vc.virtualCanvas("setVisible", testVisible);
            CZ.Common.updateAxis(CZ.Common.vc, CZ.Common.ax);
        });

        it("should not hang in January range", function () {
            if (!window.Blob || !window.Worker) {
                return;
            }

            var flag = false;
            var testRange = {
                min: -1599.000911206942,
                max: -1598.9705609064922
            };

            // NOTE: http://www.html5rocks.com/en/tutorials/workers/basics/#toc-inlineworkers
            runs(function() {
                var blob = new Blob([
                    "self.onmessage = function(e) {\n" +
                        "var data = JSON.parse(e.data);\n" +
                        "var url = data.url;\n" +
                        "var i = url.indexOf('Source/');\n" +
                        "var sourceDir = url.substring(0, i + 7);\n" +
                        "var scriptsDir = sourceDir + 'Chronozoom.UI/scripts/';\n" +
                        "var externalDir = scriptsDir + 'external/';\n" +
                        "importScripts(scriptsDir + 'timescale.js');\n" +
                        "var dateTickSrc = new CZ.DateTickSource();\n" +
                        "dateTickSrc.range = data.range;\n" +
                        "dateTickSrc.startDate = data.startDate;\n" +
                        "dateTickSrc.endDate = data.endDate;\n" +
                        "dateTickSrc.createTicks();\n" +
                        "self.postMessage();\n" +
                    "};"
                ]);

                var worker = new Worker(window.URL.createObjectURL(blob));

                worker.onmessage = function(e) {
                    console.log("message");
                    flag = true;
                };

                worker.postMessage(JSON.stringify({
                    url: document.location.href,
                    range: testRange,
                    startDate: CZ.Dates.getYMDFromCoordinate(testRange.min),
                    endDate: CZ.Dates.getYMDFromCoordinate(testRange.max)
                }));

                setTimeout(function () {
                    worker.terminate();
                }, 1900);
            });

            waitsFor(function () {
                return flag;
            }, "createTicks() method", 2000);
        });
    });
});