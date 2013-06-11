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
            var sign = (year != 0) ? year / Math.abs(year) : 1;
            var i = 0;
            var coordinate = year;
            var days = day;
            var daysPerYear = isLeapYear(year) ? 366 : 365;
            for(i = 0; i < month; i++) {
                days += Dates.daysInMonth[i];
                if((i === 1) && (isLeapYear(year))) {
                    days++;
                }
            }
            if((month > 1) && (isLeapYear(year))) {
                coordinate += sign * days / daysPerYear;
            } else {
                coordinate += (sign >= 0) ? sign * days / daysPerYear : sign * (1 - days / daysPerYear);
            }
            if(year < 0) {
                coordinate += 1;
            }
            coordinate -= 1 / daysPerYear;
            return coordinate;
        }
        Dates.getCoordinateFromYMD = getCoordinateFromYMD;
        function getYMDFromCoordinate(coord) {
            var sign = (coord === 0) ? 1 : coord / Math.abs(coord);
            var day = 0, month = 0, year = 0;
            var idxYear, countLeapYears = 0;
            year = (coord >= 0) ? Math.floor(coord) : Math.floor(coord) + 1;
            var daysPerYear = isLeapYear(year) ? 366 : 365;
            var day, month;
            var countDays;
            countDays = Math.abs(coord) - Math.abs(year) + sign * 1. / daysPerYear;
            if(sign < 0) {
                countDays = 1 - countDays;
            }
            var idxMonth = 0;
            while(countDays > Dates.daysInMonth[idxMonth] / daysPerYear) {
                countDays -= Dates.daysInMonth[idxMonth] / daysPerYear;
                if(isLeapYear(year) && (idxMonth === 1)) {
                    countDays -= 1 / daysPerYear;
                }
                idxMonth++;
            }
            month = idxMonth;
            day = countDays * daysPerYear;
            while(Math.round(day) <= 0) {
                month--;
                if(month === -1) {
                    year--;
                    month = 11;
                }
                day = Dates.daysInMonth[month] + Math.round(day);
                if(isLeapYear(year) && (month === 1)) {
                    day++;
                }
            }
            if(coord < 0) {
                year--;
            }
            return {
                year: year,
                month: month,
                day: Math.round(day)
            };
        }
        Dates.getYMDFromCoordinate = getYMDFromCoordinate;
        function getCoordinateFromDecimalYear(decimalYear) {
            var localPresent = getPresent();
            var presentDate = getCoordinateFromYMD(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);
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
            if(year.regime === 'BCE') {
                year.year += 2;
            }
            if((year.regime === 'CE') && (year.year === 0)) {
                year.regime = 'BCE';
                year.year = 1;
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
                    coordinate += 1;
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
        function isLeapYear(year) {
            if(year >= 1582 && (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))) {
                return true;
            } else {
                return false;
            }
        }
        Dates.isLeapYear = isLeapYear;
        function numberofLeap(year) {
            var startLeap = 1582;
            if(year < startLeap) {
                return 0;
            }
            var years1 = Math.floor(year / 4) - Math.floor(startLeap / 4);
            years1 -= Math.floor(year / 100) - Math.floor(startLeap / 100);
            years1 += Math.floor(year / 400) - Math.floor(startLeap / 400);
            if(isLeapYear(year)) {
                years1--;
            }
            return years1;
        }
        Dates.numberofLeap = numberofLeap;
    })(CZ.Dates || (CZ.Dates = {}));
    var Dates = CZ.Dates;
})(CZ || (CZ = {}));
