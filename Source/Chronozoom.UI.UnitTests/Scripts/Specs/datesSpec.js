/// <reference path="../../../Chronozoom.UI/scripts/dates.js" />

describe("convertYearToCoordinate method should return", function () {

    using("regime =", ["Ga"], function (value) {
        it("year * -1000000000", function () {
            var year = 100;
            var coordinate = convertYearToCoordinate(year, value);
            expect(coordinate).toEqual(year * -1000000000);
        });
    });

    using("regime =", ["Ma"], function (value) {
        it("year * -1000000", function () {
            var year = -5;
            var coordinate = convertYearToCoordinate(year, value);
            expect(coordinate).toEqual(year * -1000000);
        });
    });

    using("regime =", ["Ka"], function (value) {
        it("year * -1000", function () {
            var year = .13568;
            var coordinate = convertYearToCoordinate(year, value);
            expect(coordinate).toEqual(year * -1000);
        });
    });

    using("regime =", ["bCe"], function (value) {
        it("year * -1", function () {
            var year = 45.50;
            var coordinate = convertYearToCoordinate(year, value);
            expect(coordinate).toEqual(year * -1);
        });
    });

    using("regime =", ["cE"], function (value) {
        it("year", function () {
            var year = 0.11;
            var coordinate = convertYearToCoordinate(year, value);
            expect(coordinate).toEqual(year);
        });
    });
});

describe("convertCoordinateToYear method should return", function () {
    using("coordinate =", [153.56, 0], function (value) {
        it("regime CE ", function () {
            var coordinate = value;
            var result = convertCoordinateToYear(coordinate);
            expect(result.year).toEqual(Math.floor(coordinate));
            expect(result.regime).toEqual('CE');
        });
    });

    using("coordinate =", [-1, -999], function (value) {
        it("regime BCE ", function () {
            var coordinate = value;
            var result = convertCoordinateToYear(coordinate);
            expect(result.year).toEqual(coordinate / -1);
            expect(result.regime).toEqual('BCE');
        });
    });

    using("coordinate =", [-1999, -999999], function (value) {
        it("regime ka ", function () {
            var coordinate = value;
            var result = convertCoordinateToYear(coordinate);
            expect(result.year).toEqual(coordinate / -1000);
            expect(result.regime).toEqual('Ka');
        });
    });
    using("coordinate =", [-999999999, -1999999], function (value) {
        it("regime Ma ", function () {
            var coordinate = value;
            var result = convertCoordinateToYear(coordinate);
            expect(result.year).toEqual(coordinate / -1000000);
            expect(result.regime).toEqual('Ma');
        });
    });

    using("coordinate =", [-1000000001], function (value) {
        it("regime Ga ", function () {
            var coordinate = value;
            var result = convertCoordinateToYear(coordinate);
            expect(result.year).toEqual(coordinate / -1000000000);
            expect(result.regime).toEqual('Ga');
        });
    });
});

// var data1 = [coordinate, exoected year, expected month, expected day];
var data1 = [-0.3479452054794522, -1, 7, 27];
var data2 = [2013.0958904109589, 2013, 1, 5];
var data3 = [1, 1, 0, 1];
var data4 = [-2013.4986301369863, -2014, 6, 3];
var data5 = [2012.1612021857925, 2012, 1, 29]; // - leap year
var data6 = [2013.1616438356166, 2013, 2, 1];
var data7 = [-1599.841095890411, -1600, 1, 28];
var data8 = [2000.1612021857925, 2000, 1, 29]; // - leap year
var data9 = [2000.1639344262296, 2000, 2, 1];


describe("getDMYFromCoordinate() method should return", function () {
    usingDMY("", [data1, data2, data3, data4, data5, data6, data7, data8, data9], function (coordinate, year, month, day) {
        it("{ year: " + year + ", month: " + month + ", day: " + day + " }  with coordinate: " + coordinate, function () {
            var result = CZ.Dates.getDMYFromCoordinate(coordinate);
            expect({ year: year, month: month, day: day }).toEqual(result);
        });
    });
});

describe("getCoordinateFromYMD() method should return", function () {
    usingDMY('', [data1, data2, data3, data4, data5, data6, data7, data8, data9], function (coordinate, year, month, day) {
        it("coordinate: " + coordinate + " with { year: " + year + ", month: " + month + ", day: " + day + " } ", function () {
            var result = CZ.Dates.getCoordinateFromYMD(year, month, day);
            expect(1 * coordinate.toFixed(2)).toEqual(1 * result.toFixed(2));
        });
    });
});

describe("getPresent() method should return", function () {
    it("current date", function () {
        var expectedDate = new Date();
        var result = CZ.Dates.getPresent();
        expect(expectedDate.getUTCDate()).toEqual(result.presentDay);
        expect(expectedDate.getUTCMonth()).toEqual(result.presentMonth);
        expect(expectedDate.getUTCFullYear()).toEqual(result.presentYear);
    });
});

describe("getCoordinateFromDecimalYear() method should return", function () {
    it("decimalYear date if year != 9999", function () {
        var decimal = 2012.654794520548;
        var result = CZ.Dates.getCoordinateFromDecimalYear(decimal);
        expect(result).toEqual(decimal);
    });

    it("decimalYear date if year = '9999'", function () {
        var decimal = '9999';
        var result = CZ.Dates.getCoordinateFromDecimalYear(decimal);
        expect(result).toEqual(decimal);
    });

    it("decimalYear date if year = -9999", function () {
        var decimal = -9999;
        var result = CZ.Dates.getCoordinateFromDecimalYear(decimal);
        expect(result).toEqual(decimal);
    });

    it("not decimalYear if year = 9999.00", function () {
        var decimal = 9999.00;
        var result = CZ.Dates.getCoordinateFromDecimalYear(decimal);
        expect(result).not.toEqual(decimal);
    });

    it("not decimalYear if year === 9999", function () {
        var decimal = 9999;
        var result = CZ.Dates.getCoordinateFromDecimalYear(decimal);
        expect(result).not.toEqual(decimal);
    });
});


describe("isLeapYear() method", function () {
    describe("should return", function () {
        it("true, if year is leap and above zero (1600)", function () {
            var year = 1600;
            var result = CZ.Dates.isLeapYear(year);
            expect(true).toEqual(result);
        });

        it("false, if year is not leap and above zero (1582)", function () {
            var year = 1582;
            var result = CZ.Dates.isLeapYear(year);
            expect(false).toEqual(result);
        });

        it("false, if year is not leap and above zero (1200)", function () {
            var year = 1200;
            var result = CZ.Dates.isLeapYear(year);
            expect(false).toEqual(result);
        });

        it("false, if year is not leap and above zero (1700)", function () {
            var year = 1700;
            var result = CZ.Dates.isLeapYear(year);
            expect(false).toEqual(result);
        });

        it("false, if year is not leap and above zero (1990)", function () {
            var year = 1990;
            var result = CZ.Dates.isLeapYear(year);
            expect(false).toEqual(result);
        });

        it("true, if year is leap and less zero", function () {
            var year = -1600;
            var result = CZ.Dates.isLeapYear(year);
            expect(false).toEqual(result);
        });

        it("false, if year is 1700", function () {
            var year = 1700;
            var result = CZ.Dates.isLeapYear(year);
            expect(false).toEqual(result);
        });

        it("false, if year is not leap and less zero", function () {
            var year = -1990;
            var result = CZ.Dates.isLeapYear(year);
            expect(false).toEqual(result);
        });

        it("true, if year equal zero", function () {
            var year = 0;
            var result = CZ.Dates.isLeapYear(year);
            expect(false).toEqual(result);
        });

        it("false, if year = 1900)", function () {
            var year = 1900;
            var result = CZ.Dates.isLeapYear(year);
            expect(false).toEqual(result);
        });

        it("false, if year = 2000)", function () {
            var year = 2000;
            var result = CZ.Dates.isLeapYear(year);
            expect(true).toEqual(result);
        });
    });
});

function convertCoordinateToYear(coordinate) {
    return CZ.Dates.convertCoordinateToYear(coordinate);
}
function convertYearToCoordinate(year, regime) {
    return CZ.Dates.convertYearToCoordinate(year, regime);
}

function using(name, values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, values[i]);
        jasmine.currentEnv_.currentSpec.description += ' (with ' + name + ' ' + values[i].join(', ') + ')';
    }
}

function usingDMY(name, values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, [values[i][0], values[i][1], values[i][2], values[i][3], values[i][4]]);
        jasmine.currentEnv_.currentSpec.description += name;
    }
}
//describe("loadDataUrl() method", function () {
//Bug: https://github.com/alterm4nn/ChronoZoom/issues/281
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
