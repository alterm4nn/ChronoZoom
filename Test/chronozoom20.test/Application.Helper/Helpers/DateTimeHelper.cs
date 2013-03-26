using System;
using Application.Helper.UserActions;

namespace Application.Helper.Helpers
{
    public class DateTimeHelper : DependentActions
    {
        internal static double GetCurrentTimeInYearFormat()
        {
            DateTime now = DateTime.Now;
            var yearFirstDay = new DateTime(now.Year, 1, 1);
            double secondsInThisYear = (yearFirstDay.AddYears(1).AddSeconds(-1) - yearFirstDay).TotalSeconds;
            double secondsFromFirstDay = (now - yearFirstDay).TotalSeconds;
            double currentTimeInYearFormat = now.Year + (secondsFromFirstDay / secondsInThisYear);
            return currentTimeInYearFormat;
        }
    }
}