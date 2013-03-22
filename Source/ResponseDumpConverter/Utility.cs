using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResponseDumpConverter
{
    public class ReponseDump
    {
        public List<Chronozoom.Models.Timeline> d;
    }

    public class Present
    {
        public int presentDay;
        public int presentMonth;
        public int presentYear;
    }

    public static class Utility
    {
        private static Present getPresent()
        {
            var present = new Present();
            present.presentDay = DateTime.UtcNow.Day;
            // getUTCMonth() in JS returns the month (from 0 to 11) for the specified date
            // UtcNow.Month in C# returns the month (from 1 to 12) for the specified date
            present.presentMonth = DateTime.UtcNow.Month - 1;
            present.presentYear = DateTime.UtcNow.Year;
            return present;
        }

        private static int[] daysInMonth = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

        private static double getYearsBetweenDates(double y1, int m1, int d1, double y2, int m2, int d2)
        {
            // get full years and month passed
            var years = y2 - y1;

            if (y2 > 0 && y1 < 0)
                years -= 1;

            var months = m2 - m1;

            if (m1 > m2 || (m1 == m2 && d1 > d2))
            {
                years--;
                months += 12;
            }

            var month = m1;
            var days = -d1;

            // calculate count of passed days 
            for (var i = 0; i < months; i++)
            {
                if (month == 12)
                {
                    month = 0;
                }
                days += daysInMonth[month];
                month++;
            }
            days += d2;
            var res = years + days / 365;
            return -res;
        }

        private static double getCoordinateFromDMY(double year, int month, int day)
        {
            var localPresent = getPresent();
            return getYearsBetweenDates(year, month, day, localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);
        }

        public static double ParseDateTime(string timeUnit, int? day, int? month, double? year)
        {
            timeUnit = timeUnit.Trim().ToLower();

            if (timeUnit == "ga")
            {
                return -year.Value * 1000000000;
            }
            else if (timeUnit == "ma")
            {
                return -year.Value * 1000000;
            }
            else if (timeUnit == "ka")
            {
                return -year.Value * 1000;
            }
            else if (timeUnit == "bce")
            {
                return getCoordinateFromDMY(
                    -year.Value,
                    !month.HasValue ? 0 : Math.Min(11, Math.Max(0, month.Value - 1)),
                    !day.HasValue ? 1 : day.Value
                );
            }
            else if (timeUnit == "ce")
            {
                return getCoordinateFromDMY(
                    year.Value,
                    !month.HasValue ? 0 : Math.Min(11, Math.Max(0, month.Value - 1)),
                    !day.HasValue ? 1 : day.Value
                );
            }
            else
            {
                throw new Exception("Invalid TimeUnit: " + timeUnit);
            }
        }
    }
}
