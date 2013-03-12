/// <reference path="../jquery-1.8.0.min.js" />
/// <reference path="../common.js" />
/// <reference path="../cz.settings.js" />

describe("isLeapYear() method", function () {
    describe("should return", function () {
        it("true, if year is leap and above zero (1600)", function () {
            var year = 1600;
            var result = isLeapYear(year);
            expect(true).toEqual(result);
        });
        
        it("false, if year is not leap and above zero (1990)", function () {
            var year = 1990;
            var result = isLeapYear(year);
            expect(false).toEqual(result);
        });
        
        it("true, if year is leap and less zero", function () {
            var year = -1600;
            var result = isLeapYear(year);
            expect(true).toEqual(result);
        });
        
        it("false, if year is not leap and less zero", function () {
            var year = -1990;
            var result = isLeapYear(year);
            expect(false).toEqual(result);
        });
        
        it("true, if year equal zero", function () {
            var year = 0;
            var result = isLeapYear(year);
            expect(true).toEqual(result);
        });

        it("false, if year = 1900)", function () {
            var year = 1900;
            var result = isLeapYear(year);
            expect(false).toEqual(result);
        });

        it("false, if year = 2000)", function () {
            var year = 2000;
            var result = isLeapYear(year);
            expect(true).toEqual(result);
        });

    });
});

describe("getDateFrom() method", function () {
    describe("should return", function () {
        it("by 10 yeas above, if delta = 10 years", function () {
            var year = 2000;
            var month = 0;
            var day = 0;
            var delta = 10;
            var result = getDateFrom(year,month,day,delta);
            expect({ year : 2010, month : 0, day : 0}).toEqual(result);
        });
      
        it("by 10 yeas less, if delta = -10 years", function () {
            var year = 2000;
            var month = 0;
            var day = 0;
            var delta = -10;
            var result = getDateFrom(year, month, day, delta);
            expect({ year: 1990, month: 0, day: 0 }).toEqual(result);
        });
        
        it("1 year, if start year = -1 and delta = 1", function () {
            var year = -1;
            var month = 0;
            var day = 0;
            var delta = 1;
            var result = getDateFrom(year, month, day, delta);
            expect({ year: 1, month: 0, day: 0 }).toEqual(result);
        });

    });
});

describe("getYearsBetweenDates() method", function () {
    describe("should return", function () {
        it("-1.0027397260273974, if start date = 1600-1-28 and end date = 1601-1-28", function () {
            var y1 = 1600;
            var m1 = 1;
            var d1 = 28;
            var y2 = 1601;
            var m2 = 1;
            var d2 = 28;
            var result = getYearsBetweenDates(y1,m1,d1,y2,m2,d2);
            expect(-1.0027397260273974).toEqual(result);
        });
    });
});
