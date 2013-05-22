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
        function getCoordinateFromDMY(year, month, day) {
            var sign = (year != 0) ? year / Math.abs(year) : 1;
            var i = 0;
            var coordinate = 0;
            for(i = 0; i < Math.abs(year); i++) {
                coordinate += sign;
                if(isLeapYear(i * sign)) {
                    coordinate += sign / 365;
                }
            }
            var days = day;
            for(i = 0; i < month; i++) {
                days += Dates.daysInMonth[i];
                if((i === 1) && (isLeapYear(year))) {
                    days++;
                }
            }
            if((month > 1) && (isLeapYear(year))) {
                coordinate += sign * days / 365;
            } else {
                coordinate += (sign >= 0) ? sign * days / 365 : sign * (1 - days / 365);
            }
            if(year < 0) {
                coordinate += 1;
            }
            return coordinate;
        }
        Dates.getCoordinateFromDMY = getCoordinateFromDMY;
        function getDMYFromCoordinate(coord) {
            var sign = coord / Math.abs(coord);
            var day = 0, month = 0, year = 0;
            var idxYear, countLeapYears = 0;
            for(idxYear = 0; idxYear < Math.abs(coord) - 1; idxYear++) {
                year += sign;
                if(isLeapYear(sign * idxYear)) {
                    countLeapYears++;
                }
            }
            var day, month;
            var countDays;
            countDays = Math.abs(coord) - Math.abs(year);
            if(sign < 0) {
                countDays = 1 - countDays;
            }
            var daysPerYear = 365.0;
            var countDaysWithoutLeapDays = countDays - countLeapYears / daysPerYear;
            var idxMonth = 0;
            while(countDaysWithoutLeapDays > Dates.daysInMonth[idxMonth] / daysPerYear) {
                countDaysWithoutLeapDays -= Dates.daysInMonth[idxMonth] / daysPerYear;
                if(isLeapYear(year) && (idxMonth === 1)) {
                    countDaysWithoutLeapDays -= 1 / daysPerYear;
                }
                idxMonth++;
            }
            month = idxMonth;
            day = countDaysWithoutLeapDays * daysPerYear;
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
        Dates.getDMYFromCoordinate = getDMYFromCoordinate;
        function getCoordinateFromDecimalYear(decimalYear) {
            var localPresent = getPresent();
            var presentDate = getCoordinateFromDMY(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);
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
        function isLeapYear(year) {
            if(year >= 1582 && (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))) {
                return true;
            } else {
                return false;
            }
        }
        Dates.isLeapYear = isLeapYear;
    })(CZ.Dates || (CZ.Dates = {}));
    var Dates = CZ.Dates;
})(CZ || (CZ = {}));
