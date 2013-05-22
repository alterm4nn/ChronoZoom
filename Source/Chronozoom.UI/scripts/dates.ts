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
        export function getCoordinateFromDMY(year, month, day) {
            //get sign of coordinate
            var sign = (year != 0) ?  year / Math.abs(year) : 1;
            var i = 0;
            var coordinate = 0;
            //coordinate value given by years
            for (i = 0; i < Math.abs(year); i++) {
                coordinate += sign;
                if (isLeapYear(i * sign)) {
                     coordinate += sign / 365;
                }
            }
            var days = day;
            
            // calculate count of passed days 
            for (i = 0; i < month; i++) {
                days += daysInMonth[i];
                //if Feb and leap year
                if ((i === 1) && (isLeapYear(year))) {
                    days++;
                }
            }
            if ((month > 1) && (isLeapYear(year))) {
                coordinate += sign * days / 365;
            } else {
                coordinate += (sign >= 0) ? sign * days / 365 : sign * (1 - days / 365);
            }

            //zero-year problem solvation
            if (year < 0) coordinate += 1;

            return coordinate;
        }

        export function getDMYFromCoordinate(coord) {
            var sign = coord / Math.abs(coord);
            var day = 0, month = 0, year = 0;
            var idxYear, countLeapYears = 0;
            // Define year
            for (idxYear = 0; idxYear < Math.abs(coord) - 1; idxYear++) {
                year += sign;
                if (isLeapYear(sign * idxYear)) {
                    countLeapYears++;
                }
            }

            var day, month;
            var countDays;
            //months and days are remaining
            countDays = Math.abs(coord) - Math.abs(year);
            //for negative years day and month are converted
            if (sign < 0) countDays = 1 - countDays;

            var daysPerYear = 365.0;
            var countDaysWithoutLeapDays = countDays - countLeapYears / daysPerYear;

            var idxMonth = 0;
            //count month
            while (countDaysWithoutLeapDays > daysInMonth[idxMonth] / daysPerYear) {
                countDaysWithoutLeapDays -= daysInMonth[idxMonth] / daysPerYear;
                if (isLeapYear(year) && (idxMonth === 1)) countDaysWithoutLeapDays -= 1 / daysPerYear;
                idxMonth++;
            }
            month = idxMonth;
            day = countDaysWithoutLeapDays * daysPerYear;
   
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

        // convert date to virtual coordinate
        // 9999 -> present day
        export function getCoordinateFromDecimalYear(decimalYear) {
            // get virtual coordinate of present day
            var localPresent = getPresent();
            var presentDate = getCoordinateFromDMY(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);

            return decimalYear === 9999 ? presentDate : decimalYear;
        }

        export function convertCoordinateToYear(coordinate: number) {
            var year = {
                year: coordinate,
                regime: "CE"
            }

            if (coordinate < -999999999) {
                year.year /= -1000000000;
                year.regime = 'Ga';
            } else if (coordinate < -999999) {
                year.year /= -1000000;
                year.regime = 'Ma';
            } else if (coordinate < -999) {
                year.year /= -1000;
                year.regime = 'Ka';
            } else if (coordinate < 0) {
                year.year /= -1;
                // remove fraction part of year
                year.year = Math.floor(year.year);
                year.regime = 'BCE';
            }
            else {
                // remove fraction part of year
                year.year = Math.floor(year.year);
            }

            return year;
        }

        export function convertYearToCoordinate(year: number, regime: string) {
            var coordinate = year;

            switch (regime.toLowerCase()) {
                case "ga":
                    coordinate *= -1000000000;
                    break;
                case "ma":
                    coordinate *= -1000000;
                    break;
                case "ka":
                    coordinate *= -1000;
                    break;
                case "bce":
                    coordinate *= -1;
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
    }
}
