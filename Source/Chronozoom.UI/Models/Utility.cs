// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;

namespace Chronozoom.Api.Models
{
    public class ReponseDump
    {
        public List<Timeline> d;
    }

    public class Present
    {
        public int presentDay;
        public int presentMonth;
        public int presentYear;
    }

    public static class Utility
    {
        static Present getPresent()
        {
            var present = new Present();
            present.presentDay = DateTime.UtcNow.Day;
            // getUTCMonth() in JS returns the month (from 0 to 11) for the specified date
            // UtcNow.Month in C# returns the month (from 1 to 12) for the specified date
            present.presentMonth = DateTime.UtcNow.Month - 1;
            present.presentYear = DateTime.UtcNow.Year;
            return present;
        }

        static int[] daysInMonth = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

        static double getYearsBetweenDates(double y1, int m1, int d1, double y2, int m2, int d2) {
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

        static double getCoordinateFromDMY(double year, int month, int day) {
        	var localPresent = getPresent();
	        return getYearsBetweenDates(year, month, day, localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);
        }

        public static void ParseLeftRight(Timeline timeline)
        {
            // from -> left
            var fromTimeUnit = timeline.FromTimeUnit.ToLower();
            if (fromTimeUnit == "ga")
            {
                timeline.left = -timeline.FromYear.Value * 1000000000;
            }
            else if (fromTimeUnit == "ma")
            {
                timeline.left = -timeline.FromYear.Value * 1000000;
            }
            else if (fromTimeUnit == "ka")
            {
                timeline.left = -timeline.FromYear.Value * 1000;
            }
            else if (fromTimeUnit == "bce")
            {
                timeline.left = getCoordinateFromDMY(
                    -timeline.FromYear.Value,
                    !timeline.FromMonth.HasValue ? 0 : Math.Min(11, Math.Max(0, timeline.FromMonth.Value - 1)),
                    !timeline.FromDay.HasValue ? 1 : timeline.FromDay.Value
                );
            }
            else if (fromTimeUnit == "ce")
            {
                timeline.left = getCoordinateFromDMY(
                    timeline.FromYear.Value,
                    !timeline.FromMonth.HasValue ? 0 : Math.Min(11, Math.Max(0, timeline.FromMonth.Value - 1)),
                    !timeline.FromDay.HasValue ? 1 : timeline.FromDay.Value
                );
            }

            // to -> right
            var toTimeUnit = timeline.ToTimeUnit.ToLower();
            if (toTimeUnit == "ga")
            {
                timeline.right = -timeline.ToYear.Value * 1000000000;
            }
            else if (toTimeUnit == "ma")
            {
                timeline.right = -timeline.ToYear.Value * 1000000;
            }
            else if (toTimeUnit == "ka")
            {
                timeline.right = -timeline.ToYear.Value * 1000;
            }
            else if (toTimeUnit == "bce")
            {
                timeline.right = getCoordinateFromDMY(
                    -timeline.ToYear.Value,
                    !timeline.ToMonth.HasValue ? 0 : Math.Min(11, Math.Max(0, timeline.ToMonth.Value - 1)),
                    !timeline.ToDay.HasValue ? 1 : timeline.ToDay.Value
                );
            }
            else if (toTimeUnit == "ce")
            {
                timeline.right = getCoordinateFromDMY(
                    timeline.ToYear.Value,
                    !timeline.ToMonth.HasValue ? 0 : Math.Min(11, Math.Max(0, timeline.ToMonth.Value - 1)),
                    !timeline.ToDay.HasValue ? 1 : timeline.ToDay.Value
                );
            }

            // set width
            timeline.width = Math.Max(0, timeline.right - timeline.left);

            // recurse
            foreach (var childTimeline in timeline.ChildTimelines)
                ParseLeftRight(childTimeline);
        }
    }
}