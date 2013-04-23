/// <reference path="../Utils/jquery-1.7.2.min.js" />
/// <reference path="../Js/cz.dates.js" />
/// <reference path="../Js/cz.settings.js" />


describe("convertCoordinateToYear method", function () {
    var dates;
    beforeEach(function () {
        dates = CZ.Dates;
    });
    describe("should return", function () {
        it("regime GA, if coordinate is -1000000001", function () {
            var coordinate = -1000000001;
            var result = CZ.Dates.convertCoordinateToYear(coordinate);
            expect(result.year).toEqual(coordinate / -1000000000);
            expect(result.regime).toEqual('GA');
        });

        it("regime MA, if coordinate is -1999999", function () {
            var coordinate = -1999999;
            var result = CZ.Dates.convertCoordinateToYear(coordinate);
            expect(result.year).toEqual(coordinate / -1000000);
            expect(result.regime).toEqual('MA');
        });

        it("regime KA, if coordinate is -1999", function () {
            var coordinate = -1999;
            var result = CZ.Dates.convertCoordinateToYear(coordinate);
            expect(result.year).toEqual(coordinate / -1000);
            expect(result.regime).toEqual('KA');
        });

        it("regime BCE, if coordinate is -1", function () {
            var coordinate = -1;
            var result = CZ.Dates.convertCoordinateToYear(coordinate);
            expect(result.year).toEqual(coordinate / -1);
            expect(result.regime).toEqual('BCE');
        });

        it("regime CE, if coordinate is 153.56", function () {
            var coordinate = 153.56;
            var result = CZ.Dates.convertCoordinateToYear(coordinate);
            expect(result.year).toEqual(Math.floor(coordinate));
            expect(result.regime).toEqual('CE');
        });
    });
});



//describe("isLeapYear() method", function () {
//    describe("should return", function () {
//        it("true, if year is leap and above zero (1600)", function () {
//            var year = 1600;
//            var result = isLeapYear(year);
//            expect(true).toEqual(result);
//        });

//        it("false, if year is not leap and above zero (1990)", function () {
//            var year = 1990;
//            var result = isLeapYear(year);
//            expect(false).toEqual(result);
//        });

//        it("true, if year is leap and less zero", function () {
//            var year = -1600;
//            var result = isLeapYear(year);
//            expect(true).toEqual(result);
//        });

//        it("false, if year is 1700", function () {
//            var year = 1700;
//            var result = isLeapYear(year);
//            expect(false).toEqual(result);
//        });

//        it("false, if year is not leap and less zero", function () {
//            var year = -1990;
//            var result = isLeapYear(year);
//            expect(false).toEqual(result);
//        });

//        it("true, if year equal zero", function () {
//            var year = 0;
//            var result = isLeapYear(year);
//            expect(true).toEqual(result);
//        });

//        it("false, if year = 1900)", function () {
//            var year = 1900;
//            var result = isLeapYear(year);
//            expect(false).toEqual(result);
//        });

//        it("false, if year = 2000)", function () {
//            var year = 2000;
//            var result = isLeapYear(year);
//            expect(true).toEqual(result);
//        });

//        it("false, if year less than zero)", function () {
//            var year = -1600;
//            var result = isLeapYear(year);
//            expect(false).toEqual(result);
//        });
//    });
//});

//describe("getDateFrom() method", function () {
//    describe("should return", function () {
//        it("by 10 yeas above, if delta = 10 years", function () {
//            var year = 2000;
//            var month = 0;
//            var day = 0;
//            var delta = 10;
//            var result = getDateFrom(year,month,day,delta);
//            expect({ year : 2010, month : 0, day : 0}).toEqual(result);
//        });

//        it("by 10 yeas less, if delta = -10 years", function () {
//            var year = 2000;
//            var month = 0;
//            var day = 0;
//            var delta = -10;
//            var result = getDateFrom(year, month, day, delta);
//            expect({ year: 1990, month: 0, day: 0 }).toEqual(result);
//        });

//        it("1 year, if start year = -1 and delta = 1", function () {
//            var year = -1;
//            var month = 0;
//            var day = 0;
//            var delta = 1;
//            var result = getDateFrom(year, month, day, delta);
//            expect({ year: 1, month: 0, day: 0 }).toEqual(result);
//        });

//    });
//});

//describe("getYearsBetweenDates() method", function () {
//    var dates;
//    beforeEach(function () {
//        dates = CZ.Dates;
//    });
//    describe("should return", function () {
//        it("-1.0027397260273974, if start date = 1600-1-28 and end date = 1601-1-28", function () {
//            var y1 = 1600;
//            var m1 = 1;
//            var d1 = 28;
//            var y2 = 1601;
//            var m2 = 1;
//            var d2 = 28;
//            var result = CZ.Dates.getYearsBetweenDates(y1, m1, d1, y2, m2, d2);
//            expect(-1.0027397260273974).toEqual(result);
//        });

//        it("19, if start date = (10)-1-1 and end date = (-10)-1-1", function () {
//            var y1 = 10;
//            var m1 = 1;
//            var d1 = 1;
//            var y2 = -10;
//            var m2 = 1;
//            var d2 = 1;
//            var result = dates.getYearsBetweenDates(y1, m1, d1, y2, m2, d2);
//            expect(19).toEqual(result);
//        });

//        it("-19, if start date = (-10)-1-1 and end date = (10)-1-1", function () {
//            var y1 = -10;
//            var m1 = 1;
//            var d1 = 1;
//            var y2 = 10;
//            var m2 = 1;
//            var d2 = 1;
//            var result = dates.getYearsBetweenDates(y1, m1, d1, y2, m2, d2);
//            expect(-19).toEqual(result);
//        });
//    });
//});

//describe("loadDataUrl() method", function () {
//    describe("should return", function () {
//        it("'Chronozoom.svc/get' if datasource = 'db'", function () {
//            czDataSource = 'db';
//            var url = loadDataUrl();
//            expect(url).toEqual("Chronozoom.svc/get");
//        });

//        it("'ChronozoomRelay' if datasource = 'relay'", function () {
//            czDataSource = 'relay';
//            var url = loadDataUrl();
//            expect(url).toEqual("ChronozoomRelay");
//        });

//        it("'ResponseDump.txt' if datasource = 'dump'", function () {
//            czDataSource = 'dump';
//            var url = loadDataUrl();
//            expect(url).toEqual("oldResponseDump.txt");
//        });

//        it("null if datasource = empty string", function () {
//            czDataSource = '';
//            var url = loadDataUrl();
//            expect(url).toEqual(null);
//        });

//        it("null if datasource = random string", function () {
//            czDataSource = 'random string';
//            var url = loadDataUrl();
//            expect(url).toEqual(null);
//        });

//        it("unescaped string if 'window.location.hash' contain '#dataurl='", function () {
//            czDataSource = 'random string';
//            window.location.hash = "#dataurl=responsedump.txt/t655/";
//            var url = loadDataUrl();
//            expect(url).toEqual('responsedump.txt');
//        });
//    });
//});