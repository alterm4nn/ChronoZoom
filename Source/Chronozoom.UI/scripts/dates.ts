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

        export function getCoordinateFromDate(dateTime) {
            return getYearsBetweenDates(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDay(), 0, 0, 0);
        }

        export function getCoordinateFromDMY(year, month, day) {
            return getYearsBetweenDates(year, month, day, 0, 0, 0);
        }

        export function getDMYFromCoordinate(coord) {
            return getDateFrom(0, 0, 1, coord);
        }

        // convert date to virtual coordinate
        // 9999 -> present day
        export function getCoordinateFromDecimalYear(decimalYear) {
            // get virtual coordinate of present day
            var localPresent = getPresent();
            var presentDate = getYearsBetweenDates(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay, 0, 0, 0);

            return decimalYear === 9999 ? presentDate : decimalYear;
        }

        export function convertCoordinateToYear(coordinate: number) {
            var year = {
                year: coordinate,
                regime: "CE"
            }

            if (coordinate < -999999999) {
                year.year /= -1000000000;
                year.regime = 'GA';
            } else if (coordinate < -999999) {
                year.year /= -1000000;
                year.regime = 'MA';
            } else if (coordinate < -999) {
                year.year /= -1000;
                year.regime = 'KA';
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

        // gets the gap between two dates
        // y1, m1, d1 is first date (year, month, day)
        // y2, m2, d2 is second date (year, month, day)
        // returns count of years between given dates
        function getYearsBetweenDates(y1, m1, d1, y2, m2, d2) {
            // get full years and month passed
            var years = y2 - y1;

            if (y2 > 0 && y1 < 0)
                years -= 1;

            var months = m2 - m1;

            if (m1 > m2 || (m1 == m2 && d1 > d2)) {
                years--;
                months += 12;
            }

            var month = m1;
            var days = -d1;

            // calculate count of passed days 
            for (var i = 0; i < months; i++) {
                if (month == 12) {
                    month = 0;
                }
                days += daysInMonth[month];
                month++;
            }
            days += d2;

            // add plus 1 day to make 1 january as 0 offset from year
            days += 1;
            var res = years + days / 365;
            return -res;
        }

        // gets the end date by given start date and gap between them
        // year, month, day is known date
        // n is count of years between known and result dates; n is negative, so result date in earlier then given
        function getDateFrom(year, month, day, n) {
            var endYear = year;
            var endMonth = month;
            var endDay = day;

            // get full year of result date
            endYear -= Math.floor(-n);

            // get count of days in a gap
            var nDays = (n + Math.floor(-n)) * 365;

            // calculate how many full months have passed
            while (nDays < 0) {
                var tempMonth = endMonth > 0 ? endMonth - 1 : 11;
                nDays += daysInMonth[tempMonth];
                endMonth--;
                if (endMonth < 0) {
                    endYear--;
                    endMonth = 11;
                }
            }

            endDay += Math.round(nDays);
            // get count of days in current month
            var tempDays = daysInMonth[endMonth];
            //if (isLeapYear(endYear)) tempDays++;
            // if result day is bigger than count of days then one more month has passed too            
            while (endDay > tempDays) {
                endDay -= tempDays;
                endMonth++;
                if (endMonth > 11) {
                    endMonth = 0;
                    endYear++;
                }
                tempDays = daysInMonth[endMonth];
              //  if (isLeapYear(endYear)) tempDays++;
            }
            if (endYear < 0 && year > 0)
                endYear -= 1;

            return {
                year: endYear,
                month: endMonth,
                day: endDay
            };
        }

        function isLeapYear(year) {
            if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) return true;
            else return false;
        }
    }
}