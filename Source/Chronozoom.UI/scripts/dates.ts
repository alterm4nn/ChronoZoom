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
            //get sign of coordinate
            var sign = (year != 0) ? year / Math.abs(year) : 1;
            var i = 0;
            var coordinate = year;
            var days = day;
            var daysPerYear = isLeapYear(year) ? 366 : 365;

            // calculate count of passed days 
            for (i = 0; i < month; i++) {
                days += daysInMonth[i];
                //if Feb and leap year
                if ((i === 1) && (isLeapYear(year))) {
                    days++;
                }
            }

            if ((month > 1) && (isLeapYear(year))) {
                coordinate += sign * days / daysPerYear;
            } else {
                coordinate += (sign >= 0) ? sign * days / daysPerYear : sign * (1 - days / daysPerYear);
            }

            //zero-year problem solvation
            if (year < 0) coordinate += 1;
            coordinate -= 1/daysPerYear;

            return coordinate;
        }

        export function getYMDFromCoordinate(coord) {
            var sign = (coord === 0) ? 1 : coord / Math.abs(coord);
            var day = 0, month = 0, year = 0;
            var idxYear, countLeapYears = 0;
            // Define year
            year = (coord >= 0) ? Math.floor(coord) : Math.floor(coord) + 1;
            var daysPerYear = isLeapYear(year) ? 366 : 365;

            var day, month;
            var countDays;
            //months and days are remaining
            countDays = Math.abs(coord) - Math.abs(year) + sign * 1./daysPerYear;
            //for negative years day and month are converted
            if (sign < 0) countDays = 1 - countDays;

            var idxMonth = 0;
            //count month
            while (countDays > daysInMonth[idxMonth] / daysPerYear) {
                countDays -= daysInMonth[idxMonth] / daysPerYear;
                if (isLeapYear(year) && (idxMonth === 1)) countDays -= 1 / daysPerYear;
                idxMonth++;
            }
            month = idxMonth;
            day = countDays * daysPerYear;
            //remaining value need to be represanted as date
            while (Math.round(day) <= 0) {
                month--;
                if (month === -1) {
                    year--;
                    month = 11;
                }
                day = daysInMonth[month] + Math.round(day);
                if (isLeapYear(year) && (month === 1)) day++;
            }
            //zero-year problem solvation
            if (coord < 0) year--;

            return {
                year: year,
                month: month,
                day: Math.round(day)
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
                year.year = (year.year - 1) / (-1000000000);
                year.regime = 'Ga';
            } else if (coordinate < -999999) {
                year.year = (year.year - 1) / (-1000000);
                year.regime = 'Ma';
            } else if (coordinate < -9999) {
                year.year = (year.year - 1) / (-1000);
                year.regime = 'Ka';
            } else if (coordinate < 1) {
                year.year = (year.year - 1) / (-1);
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
                    //coordinate += 1;
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
            if (year >= 1582 && (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))) return true;
            else return false;
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
