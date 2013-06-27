module CZ {
    export module Dates {

        // array of month names to use in labels
        export var months = [
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
            'December'];

        // array of numbers of days for each month, 28 days in february by default
        export var daysInMonth = [
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
            31];

        // by give date gives coordinate in virtual coordinates
        export function getCoordinateFromYMD(year, month, day) {
            var sign = (year === -1) ? 1 : year / Math.abs(year),
                isLeap = isLeapYear(year),
                daysInYear = isLeap ? 366 : 365,
                coord = (year > -1) ? year : year + 1;

            // Get the number of day in the year.
            var sumDaysOfMonths = function (s, d, i) {
                return s + (i < month) * d;
            }
            var days = daysInMonth.reduce(sumDaysOfMonths, +(isLeap && month > 1)) + day;

            coord += (days - 1) / daysInYear;

            return coord;
        }

        export function getYMDFromCoordinate(coord) {
            var absCoord = Math.abs(coord),
                floorCoord = Math.floor(coord),
                sign = (coord === 0) ? 1 : coord / absCoord,
                day = 0,
                month = 0,
                year = (coord >= 1) ? floorCoord : floorCoord - 1,
                isLeap = isLeapYear(year),
                daysInYear = isLeap ? 366 : 365,
                daysFraction = sign * (absCoord - Math.abs(floorCoord));
            
            // NOTE: Using Math.round() here causes day to be rounded to 365(366)
            //       in case of the last day in a year. Do not increment day in
            //       in this case.
            day = Math.round(daysFraction * daysInYear);
            day += +(day < daysInYear);

            // Evaluate day and month of the year.
            while (day > daysInMonth[month] + (+(isLeap && month === 1))) {
                day -= daysInMonth[month];
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

        // convert decimal year to virtual coordinate
        // 9999 -> present day
        // TODO: currently in database 1 BCE = -1 in virtual coords, but on client side 1 BCE = 0 in virtual coords
        // decimalYear in database has to be equal to virtual coordinate?
        export function getCoordinateFromDecimalYear(decimalYear) {
            // get virtual coordinate of present day
            var localPresent = getPresent();
            var presentDate = getCoordinateFromYMD(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);

            return decimalYear === 9999 ? presentDate: (decimalYear < 0 ? decimalYear + 1: decimalYear);
        }

        // convert virtual coordinate to decimal year
        export function getDecimalYearFromCoordinate(coordinate) {
            // in database 1 BCE = -1, on client side 1 BCE = 0
            return coordinate < 1 ? --coordinate : coordinate;
        }

        export function convertCoordinateToYear(coordinate: number) {
            var year = {
                year: coordinate,
                regime: "CE"
            }

            if (coordinate < -999999999) {
                year.year = (year.year ) / (-1000000000);
                year.regime = 'Ga';
            } else if (coordinate < -999999) {
                year.year = (year.year) / (-1000000);
                year.regime = 'Ma';
            } else if (coordinate < -9999) {
                year.year = (year.year) / (-1000);
                year.regime = 'Ka';
            } else if (coordinate < 1) {
                year.year = (year.year) / (-1);
                // remove fraction part of year
                year.year = Math.ceil(year.year);
                year.regime = 'BCE';
            }
            else {
                // remove fraction part of year
                year.year = Math.floor(year.year);
            }
            //if (year.regime === 'BCE') {
            //    year.year += 2;
            //   }

            //if ((year.regime === 'CE') && (year.year === 0)) {
            //    year.regime = 'BCE';
            //    year.year = 1;
            //   }
            return year;
        }

        export function convertYearToCoordinate(year: number, regime: string) {
            var coordinate = year;
            var localPresent = getPresent();
            var presentDate = getCoordinateFromYMD(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);

            switch (regime.toLowerCase()) {
                case "ga":
                    coordinate = year * (-1000000000) + presentDate + 1;
                    if (year == 0) {
                        coordinate = 9999;
                    }
                    break;
                case "ma":
                    coordinate = year * (-1000000) + presentDate + 1;
                    if (year == 0) {
                        coordinate = 9999; 
                    }
                    break;
                case "ka":
                    coordinate = year * (-1000) + presentDate + 1;
                    if (year == 0) {
                        coordinate = 9999; 
                    }
                    break;
                case "bce":
                    coordinate = year * (-1) + 1;
                    break;
            }

            return coordinate;
        }
         
        var present = undefined;
        export function getPresent() {
            if (!present) {
                present = new Date();

                present.presentDay = present.getUTCDate();
                present.presentMonth = present.getUTCMonth();
                present.presentYear = present.getUTCFullYear();
            }
            return present;
        }

        export function isLeapYear(year) {
            return (year >= 1582 && (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)));
        }

        export function numberofLeap(year) {
            var startLeap = 1582;
            if (year < startLeap) return 0;
            var years1 = Math.floor(year / 4) - Math.floor(startLeap / 4);
            years1 -= Math.floor(year / 100) - Math.floor(startLeap / 100);
            years1 += Math.floor(year / 400) - Math.floor(startLeap / 400);
            if (isLeapYear(year)) years1--;
            return years1;
        }
    }
}
