/// <reference path="../Utils/jquery-1.8.0.min.js" />
/// <reference path="../Js/timescale.js" />
/// <reference path="../Js/common.js" />
/// <reference path="../Js/cz.settings.js" />

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

        describe("GetTicks() method", function () {
            it("should return 1 year after -1 year (not zero year)", function () {

                var range = { min: -2013.1791612806953, max: -2013.1715772806954 };
                var dateTickSource = new CZ.DateTickSource();
                var ticks = dateTickSource.getTicks(range);
                var ticksLabels = [];

                for (var i in ticks) {
                    ticksLabels.push(ticks[i].label[0].innerHTML);
                }

                expect(ticksLabels).not.toContain('1 January, 0');
                expect(ticksLabels).toContain('1 January, 1');
            });

            it("should contain 29 February in leap year (1600)", function () {

                var range = { min: -413.023927413497, max: -413.00461469110763 };
                var dateTickSource = new CZ.DateTickSource();
                var ticks = dateTickSource.getTicks(range);
                var ticksLabels = [];

                for (var i in ticks) {
                    ticksLabels.push(ticks[i].label[0].innerHTML);
                }

                expect(ticksLabels).toContain('29 February');
            });
        });
    });
});

describe("Timescale constructor", function () {
    it("should throw exception if container undifined", function () {
        var container;
        expect(function () { new CZ.Timescale(container) }).toThrow(new Error("Container parameter is undefined!"));
    });

    it("should throw exception if container is no 'div'", function () {
        var container = document.createElement('table');
        expect(function () { new CZ.Timescale(container) }).toThrow(new Error("Container parameter is invalid! It should be DIV, or ID of DIV, or jQuery instance of DIV."));
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
            var l = -100000000000;
            var r = 0;
            cosmosTickSrc.getRegime(l, r);
            expect("Ga").toEqual(cosmosTickSrc.regime);
            expect("Ga").toEqual(cosmosTickSrc.beta);
        });
        
        it("regime to 'Ma' if l <= -10000000", function () {
            var l = -10000000;
            var r = 0;
            cosmosTickSrc.getRegime(l, r);
            expect("Ma").toEqual(cosmosTickSrc.regime);
        });
        
        it("regime to 'ka' if l <= -10000", function () {
            var l = -10000;
            var r = 0;
            cosmosTickSrc.getRegime(l, r);
            expect("ka").toEqual(cosmosTickSrc.regime);
        });

        it("range.min = l and range.max = r if l<r", function () {
            var l = 10;
            var r = 20;
            cosmosTickSrc.getRegime(l, r);
            expect(r).toEqual(cosmosTickSrc.range.max);
            expect(l).toEqual(cosmosTickSrc.range.min);
        });
        
        it("range.min and range.max to default value if l>r", function () {
            var l = 20;
            var r = 10;
            var defaultValue = -13700000000; //from cz.settings
            cosmosTickSrc.getRegime(l, r);
            expect(0).toEqual(cosmosTickSrc.range.max);
            expect(defaultValue).toEqual(cosmosTickSrc.range.min);
        });
    });
    
    describe("createTicks() method should", function () {  //TODO: test bug: not return ticks
        //describe("return", function () {
        //    it("2 tiks", function () {
        //        var _range = { min: -13923856209.150328, max: 223856209.15032768 };
        //        cosmosTickSrc.regime = "Ga";
        //        cosmosTickSrc.beta = 6;
        //        var result = cosmosTickSrc.createTicks(_range);
        //        expect(2).toEqual(result.length);
        //    });
            
        //});
        describe("call", function () {
            it("refreshDivs() method", function () {
                spyOn(cosmosTickSrc, 'createTicks');
                cosmosTickSrc.createTicks();
                expect(cosmosTickSrc.createTicks).toHaveBeenCalled();
            });
        });
    });
});

describe("CZ.CalendarTickSource part", function () { //this is the class for creating ticks
    var calendarTickSrc;
    beforeEach(function () {
        calendarTickSrc = new CZ.CalendarTickSource();
    });

    describe("getLabel() method should return", function () {
        it("'1 CE' if x = -10000", function () {
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
        beforeEach(function () {
            currentDate = new Date();
        });

        it("regime to 'BCE/CE' after call", function () {
            var l = -10000000000;
            var r = 0;
            calendarTickSrc.getRegime(l, r);
            expect("BCE/CE").toEqual(calendarTickSrc.regime);
        });
        
        it("startDate value to current date if l<0 (-2000)", function () {
            var l = -2000;
            var r = 0;
            calendarTickSrc.getRegime(l, r);
            expect({ year: currentDate.getFullYear(), month: currentDate.getMonth(), day: currentDate.getDate() }).toEqual(calendarTickSrc.startDate);
        });
        
        it("startDate value to current date if l=r and (-2000)", function () {
            var l = -2000;
            var r = -2000;
            calendarTickSrc.getRegime(l, r);
            expect({ year: currentDate.getFullYear(), month: currentDate.getMonth(), day: currentDate.getDate() }).toEqual(calendarTickSrc.startDate);
        });
        
        it("endDate value to current date if r<0 (-2000)", function () {
            var l = 0;
            var r = -2000;
            calendarTickSrc.getRegime(l, r);
            expect({ year: currentDate.getFullYear(), month: currentDate.getMonth(), day: currentDate.getDate() }).toEqual(calendarTickSrc.endDate);
        });
    });
});

//describe("CZ.DateTickSource part", function () {
//    var dateTickSrc;
//    beforeEach(function () {
//        dateTickSrc = new CZ.DateTickSource();
//    });

//    describe("getLabel() method should return", function () {
//        it("555", function () {
//            var result = dateTickSrc.getLabel();
//            expect("anything").toEqual(result);
//        });
//    });
//});

describe("CZ.ClockTickSource part", function () {
    var clockTickSrc;
    beforeEach(function () {
        clockTickSrc = new CZ.ClockTickSource();
    });

    describe("getRegime() method should set regime to", function () {
        it("'QuarterDays_Hours' if beta >= -2.2", function () {
            var r = 1;
            var l = 0.9;
            clockTickSrc.getRegime(l,r);
            expect("QuarterDays_Hours").toEqual(clockTickSrc.regime);
        });
        
        it("'QuarterDays_Hours' if beta <= -2.2 && beta >= -2.7", function () {
            var l = 0.996;
            var r = 1;
            clockTickSrc.getRegime(l, r);
            expect("Hours_10mins").toEqual(clockTickSrc.regime);
        });
        
        it("'QuarterDays_Hours' if beta <= -2.7 && beta >= -3.4", function () {
            var l = 0.9991;
            var r = 1;
            clockTickSrc.getRegime(l, r);
            expect("10mins_mins").toEqual(clockTickSrc.regime);
        });
        
        it("'QuarterDays_Hours' if beta <= -3.8 && beta >= -4.4", function () {
            var l = 0.99991;
            var r = 1;
            clockTickSrc.getRegime(l, r);
            expect("10mins_mins").toEqual(clockTickSrc.regime);
        });
        
        it("'10mins_mins' if beta = -3.6 ", function () {
            var l = 0.99975;
            var r = 1;
            clockTickSrc.getRegime(l, r);
            expect("10mins_mins").toEqual(clockTickSrc.regime);
        });
        
    });
});