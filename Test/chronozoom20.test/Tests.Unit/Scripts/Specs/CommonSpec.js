/// <reference path="../Utils/jquery-1.8.0.min.js" />
/// <reference path="../Js/common.js" />
/// <reference path="../Js/cz.settings.js" />

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

        it("false, if year is 1700", function () {
            var year = 1700;
            var result = isLeapYear(year);
            expect(false).toEqual(result);
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

        it("false, if year less than zero)", function () {
            var year = -1600;
            var result = isLeapYear(year);
            expect(false).toEqual(result);
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
        
        it("19, if start date = (10)-1-1 and end date = (-10)-1-1", function () {
            var y1 = 10;
            var m1 = 1;
            var d1 = 1;
            var y2 = -10;
            var m2 = 1;
            var d2 = 1;
            var result = getYearsBetweenDates(y1, m1, d1, y2, m2, d2);
            expect(19).toEqual(result);
        });
        
        it("-19, if start date = (-10)-1-1 and end date = (10)-1-1", function () {
            var y1 = -10;
            var m1 = 1;
            var d1 = 1;
            var y2 = 10;
            var m2 = 1;
            var d2 = 1;
            var result = getYearsBetweenDates(y1, m1, d1, y2, m2, d2);
            expect(-19).toEqual(result);
        });
    });
});

describe("loadDataUrl() method", function () {
    describe("should return", function () {
        it("'Chronozoom.svc/get' if datasource = 'db'", function () {
            czDataSource = 'db';
            var url = loadDataUrl();
            expect(url).toEqual("Chronozoom.svc/get");
        });

        it("'ChronozoomRelay' if datasource = 'relay'", function () {
            czDataSource = 'relay';
            var url = loadDataUrl();
            expect(url).toEqual("ChronozoomRelay");
        });

        it("'ResponseDump.txt' if datasource = 'dump'", function () {
            czDataSource = 'dump';
            var url = loadDataUrl();
            expect(url).toEqual("oldResponseDump.txt");
        });

        it("null if datasource = empty string", function () {
            czDataSource = '';
            var url = loadDataUrl();
            expect(url).toEqual(null);
        });

        it("null if datasource = random string", function () {
            czDataSource = 'random string';
            var url = loadDataUrl();
            expect(url).toEqual(null);
        });

        it("unescaped string if 'window.location.hash' contain '#dataurl='", function () {
            czDataSource = 'random string';
            window.location.hash = "#dataurl=responsedump.txt/t655/";
            var url = loadDataUrl();
            expect(url).toEqual('responsedump.txt');
        });
    });
});

describe("getCookie() method", function () {
    describe("should return", function () {

        it("unescaped cookie value, if c_name = Cookie1", function () {
            var c_name = "Cookie1";
            document.cookie = "Cookie1=Value1;Cookie2=Value2";
            expect("Value1").toEqual(getCookie(c_name));
        });

        it("unescaped cookie value, if c_name = string in ASCII", function () {
            var c_name = "Cookie1";
            document.cookie = "Cookie1=%56%61%6C%75%65%31;Cookie2=Value2";
            expect("Value1").toEqual(getCookie(c_name));
        });

        it("null, if c_name = empty string", function () {
            var c_name = "";
            document.cookie = "Cookie1=Value1;Cookie2=Value2";
            expect(null).toEqual(getCookie(c_name));
        });

        it("null, if Cookie1 not have value", function () {
            var c_name = "Cookie1";
            document.cookie = "Cookie1=;Cookie2=Value2";
            expect('').toEqual(getCookie(c_name));
        });

        it("null, if c_name not fount in cookies", function () {
            var c_name = "CustomCookie";
            document.cookie = "Cookie1=;Cookie2=Value2";
            expect(null).toEqual(getCookie(c_name));
        });

        it("null, if cookies are empty", function () {
            var c_name = "Cookie1";
            document.cookie = "";
            expect('').toEqual(getCookie(c_name));
        });

        it("null, if Cookie1 name = empty string", function () {
            var c_name = "Cookie1";
            document.cookie = "=Value1;Cookie2=Value2";
            expect('').toEqual(getCookie(c_name));
        });

        it("first value, if Cookie1 is duplicated", function () {
            var c_name = "Cookie1";
            document.cookie = "Cookie1=Value1_0;Cookie1=Value1_1;Cookie2=Value2";
            expect("Value1_0").toEqual(getCookie(c_name));
        });
    });
});
