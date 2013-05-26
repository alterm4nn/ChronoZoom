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
        function getCoordinateFromDate(dateTime) {
            return getYearsBetweenDates(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDay(), 0, 0, 0);
        }
        Dates.getCoordinateFromDate = getCoordinateFromDate;
        function getCoordinateFromDMY(year, month, day) {
            return getYearsBetweenDates(year, month, day, 0, 0, 0);
        }
        Dates.getCoordinateFromDMY = getCoordinateFromDMY;
        function getDMYFromCoordinate(coord) {
            return getDateFrom(0, 0, 1, coord);
        }
        Dates.getDMYFromCoordinate = getDMYFromCoordinate;
        function getCoordinateFromDecimalYear(decimalYear) {
            var localPresent = getPresent();
            var presentDate = getYearsBetweenDates(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay, 0, 0, 0);
            return decimalYear === 9999 ? presentDate : decimalYear;
        }
        Dates.getCoordinateFromDecimalYear = getCoordinateFromDecimalYear;
        function convertCoordinateToYear(coordinate) {
            var year = {
                year: coordinate,
                regime: "CE"
            };
            if(coordinate < -999999999) {
                year.year /= -1000000000;
                year.regime = 'Ga';
            } else if(coordinate < -999999) {
                year.year /= -1000000;
                year.regime = 'Ma';
            } else if(coordinate < -999) {
                year.year /= -1000;
                year.regime = 'Ka';
            } else if(coordinate < 0) {
                year.year /= -1;
                year.year = Math.floor(year.year);
                year.regime = 'BCE';
            } else {
                year.year = Math.floor(year.year);
            }
            return year;
        }
        Dates.convertCoordinateToYear = convertCoordinateToYear;
        function convertYearToCoordinate(year, regime) {
            var coordinate = year;
            switch(regime.toLowerCase()) {
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
        Dates.convertYearToCoordinate = convertYearToCoordinate;
        var present = undefined;
        function getPresent() {
            if(!present) {
                present = new Date();
                present.presentDay = present.getUTCDate();
                present.presentMonth = present.getUTCMonth();
                present.presentYear = present.getUTCFullYear();
            }
            return present;
        }
        Dates.getPresent = getPresent;
        function getYearsBetweenDates(y1, m1, d1, y2, m2, d2) {
            var years = y2 - y1;
            if(y2 > 0 && y1 < 0) {
                years -= 1;
            }
            var months = m2 - m1;
            if(m1 > m2 || (m1 == m2 && d1 > d2)) {
                years--;
                months += 12;
            }
            var month = m1;
            var days = -d1;
            for(var i = 0; i < months; i++) {
                if(month == 12) {
                    month = 0;
                }
                days += Dates.daysInMonth[month];
                month++;
            }
            days += d2;
            days += 1;
            var res = years + days / 365;
            return -res;
        }
        function getDateFrom(year, month, day, n) {
            var endYear = year;
            var endMonth = month;
            var endDay = day;
            endYear -= Math.floor(-n);
            var nDays = (n + Math.floor(-n)) * 365;
            while(nDays < 0) {
                var tempMonth = endMonth > 0 ? endMonth - 1 : 11;
                nDays += Dates.daysInMonth[tempMonth];
                endMonth--;
                if(endMonth < 0) {
                    endYear--;
                    endMonth = 11;
                }
            }
            endDay += Math.round(nDays);
            var tempDays = Dates.daysInMonth[endMonth];
            while(endDay > tempDays) {
                endDay -= tempDays;
                endMonth++;
                if(endMonth > 11) {
                    endMonth = 0;
                    endYear++;
                }
                tempDays = Dates.daysInMonth[endMonth];
            }
            if(endYear < 0 && year > 0) {
                endYear -= 1;
            }
            return {
                year: endYear,
                month: endMonth,
                day: endDay
            };
        }
        function isLeapYear(year) {
            if(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
                return true;
            } else {
                return false;
            }
        }
    })(CZ.Dates || (CZ.Dates = {}));
    var Dates = CZ.Dates;
})(CZ || (CZ = {}));
