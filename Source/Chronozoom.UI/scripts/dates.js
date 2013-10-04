var CZ;
(function (CZ) {
    (function (Dates) {
        Dates.months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        Dates.daysInMonth = [
            31,
            28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31
        ];

        function getCoordinateFromYMD(year, month, day) {
            var sign = (year === -1) ? 1 : year / Math.abs(year), isLeap = isLeapYear(year), daysInYear = isLeap ? 366 : 365, coord = (year > -1) ? year : year + 1;

            var sumDaysOfMonths = function (s, d, i) {
                return s + +(i < month) * d;
            };
            var days = Dates.daysInMonth.reduce(sumDaysOfMonths, +(isLeap && month > 1)) + day;

            coord += (days - 1) / daysInYear;

            coord = roundDecimal(coord, CZ.Settings.allowedMathImprecisionDecimals);

            return coord;
        }
        Dates.getCoordinateFromYMD = getCoordinateFromYMD;

        function getYMDFromCoordinate(coord, MarkerCorrection) {
            if (typeof MarkerCorrection === "undefined") { MarkerCorrection = false; }
            var absCoord = Math.abs(coord), floorCoord = Math.floor(coord), sign = (coord === 0) ? 1 : coord / absCoord, day = 0, month = 0, year = (coord >= 1) ? floorCoord : floorCoord - 1, isLeap = isLeapYear(year), daysInYear = isLeap ? 366 : 365, daysFraction = sign * (absCoord - Math.abs(floorCoord));

            day = Math.round(daysFraction * daysInYear);
            if (MarkerCorrection)
                day = Math.floor(daysFraction * daysInYear);
            day += +(day < daysInYear);

            while (day > Dates.daysInMonth[month] + (+(isLeap && month === 1))) {
                day -= Dates.daysInMonth[month];
                if (isLeap && month === 1) {
                    day--;
                }
                month++;
            }

            return {
                year: year,
                month: month,
                day: day
            };
        }
        Dates.getYMDFromCoordinate = getYMDFromCoordinate;

        function getCoordinateFromDecimalYear(decimalYear) {
            var localPresent = getPresent();
            var presentDate = getCoordinateFromYMD(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);

            return decimalYear === 9999 ? presentDate : (decimalYear < 0 ? decimalYear + 1 : decimalYear);
        }
        Dates.getCoordinateFromDecimalYear = getCoordinateFromDecimalYear;

        function getDecimalYearFromCoordinate(coordinate) {
            return coordinate < 1 ? --coordinate : coordinate;
        }
        Dates.getDecimalYearFromCoordinate = getDecimalYearFromCoordinate;

        function convertCoordinateToYear(coordinate) {
            var year = {
                year: coordinate,
                regime: "CE"
            };
            var eps_const = 100000;
            if (coordinate <= -999999999) {
                year.year = (year.year - 1) / (-1000000000);
                year.year = Math.round(year.year * eps_const) / eps_const;
                year.regime = 'Ga';
            } else if (coordinate <= -999999) {
                year.year = (year.year - 1) / (-1000000);
                year.year = Math.round(year.year * eps_const) / eps_const;
                year.regime = 'Ma';
            } else if (coordinate <= -9999) {
                year.year = (year.year - 1) / (-1000);
                year.year = Math.round(year.year * eps_const) / eps_const;
                year.regime = 'Ka';
            } else if (coordinate < 1) {
                year.year = (year.year - 1) / (-1);

                year.year = Math.ceil(year.year);
                year.regime = 'BCE';
            } else {
                year.year = Math.floor(year.year);
            }

            return year;
        }
        Dates.convertCoordinateToYear = convertCoordinateToYear;

        function convertYearToCoordinate(year, regime) {
            var coordinate = year;

            switch (regime.toLowerCase()) {
                case "ga":
                    coordinate = year * (-1000000000) + 1;
                    break;
                case "ma":
                    coordinate = year * (-1000000) + 1;
                    break;
                case "ka":
                    coordinate = year * (-1000) + 1;
                    break;
                case "bce":
                    coordinate = year * (-1) + 1;

                    break;
            }

            return coordinate;
        }
        Dates.convertYearToCoordinate = convertYearToCoordinate;

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
        Dates.getPresent = getPresent;

        function isLeapYear(year) {
            return (year >= 1582 && (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)));
        }
        Dates.isLeapYear = isLeapYear;

        function numberofLeap(year) {
            var startLeap = 1582;
            if (year < startLeap)
                return 0;
            var years1 = Math.floor(year / 4) - Math.floor(startLeap / 4);
            years1 -= Math.floor(year / 100) - Math.floor(startLeap / 100);
            years1 += Math.floor(year / 400) - Math.floor(startLeap / 400);
            if (isLeapYear(year))
                years1--;
            return years1;
        }
        Dates.numberofLeap = numberofLeap;

        function roundDecimal(decimal, precision) {
            return Math.round(decimal * Math.pow(10, precision)) / Math.pow(10, precision);
        }
    })(CZ.Dates || (CZ.Dates = {}));
    var Dates = CZ.Dates;
})(CZ || (CZ = {}));
