// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

using Chronozoom.Entities;

namespace DataMigration
{
    public class Program
    {
        private static readonly Storage Storage = new Storage();

        public static void Main()
        {
            Migrate();
        }

        public static void Migrate()
        {
            var myWebClient = new WebClient();

            using (Stream dataTimelines = myWebClient.OpenRead("http://www.chronozoomproject.org/Chronozoom.svc/get"))
            {
                var bjrTimelines = (BaseJsonResult<IEnumerable<Timeline>>)new DataContractJsonSerializer(typeof(BaseJsonResult<IEnumerable<Timeline>>)).ReadObject(dataTimelines);

                foreach (var timeline in bjrTimelines.d)
                {
                    MigrateInPlace(timeline);
                    Storage.Timelines.Add(timeline);
                }
            }

            using (Stream dataTours = myWebClient.OpenRead("http://www.chronozoomproject.org/Chronozoom.svc/getTours"))
            {
                var bjrTours = (BaseJsonResult<IEnumerable<Tour>>)new DataContractJsonSerializer(typeof(BaseJsonResult<IEnumerable<Tour>>)).ReadObject(dataTours);

                foreach (var tour in bjrTours.d)
                {
                    Storage.Tours.Add(tour);
                }
            }

            using (Stream dataThresholds = myWebClient.OpenRead("http://www.chronozoomproject.org/Chronozoom.svc/getThresholds"))
            {
                var bjrThresholds = (BaseJsonResult<IEnumerable<Threshold>>)new DataContractJsonSerializer(typeof(BaseJsonResult<IEnumerable<Threshold>>)).ReadObject(dataThresholds);

                foreach (var threshold in bjrThresholds.d)
                {
                    Storage.Thresholds.Add(threshold);
                }
            }

            Storage.SaveChanges();
            Console.WriteLine("Parsed Successfully \n");
        }

        private static void MigrateInPlace(Timeline timeline)
        {
            timeline.FromYear = ConvertToDecimalYear(timeline.FromDay, timeline.FromMonth, timeline.FromYear, timeline.FromTimeUnit);

            timeline.ToYear = ConvertToDecimalYear(timeline.ToDay, timeline.ToMonth, timeline.ToYear, timeline.ToTimeUnit);

            foreach (var exhibit in timeline.Exhibits)
            {
                exhibit.Year = ConvertToDecimalYear(exhibit.Day, exhibit.Month, exhibit.Year, exhibit.TimeUnit);
            }

            foreach (var child in timeline.ChildTimelines)
            {
                MigrateInPlace(child);
            }
        }

        // returns the decimal year equivalent of the incoming data
        private static decimal ConvertToDecimalYear(int? day, int? month, decimal year, string timeUnit)
        {
            decimal decimalyear = year; 

            // if the timeUnit is null - we still calculate decimalyear in the first if of the function and return that value
            if (timeUnit != null)
            {
                // if the timeunit is CE
                if (string.Compare(timeUnit, "ce", StringComparison.OrdinalIgnoreCase) == 0)
                {
                    int tempmonth = 1;
                    int tempday = 1;

                    // if the month and day values are null, calculating decimalyear with the first day of the year
                    if (month.HasValue && month > 0)
                    {
                        tempmonth = (int)month;
                        if (day.HasValue && day > 0)
                        {
                            tempday = (int)day;
                        }
                    }

                    var dt = new DateTime((int)decimalyear, tempmonth, tempday);
                    decimalyear = ConvertToDecimalYear(dt);
                }
                else if (string.Compare(timeUnit, "bce", StringComparison.OrdinalIgnoreCase) == 0)
                {
                    // anything that is not CE is in the negative scale. 0 CE = O Decimal Year
                    decimalyear *= -1;
                }
                else if (string.Compare(timeUnit, "ka", StringComparison.OrdinalIgnoreCase) == 0)
                {
                    decimalyear *= -1000;
                }
                else if (string.Compare(timeUnit, "ma", StringComparison.OrdinalIgnoreCase) == 0)
                {
                    decimalyear *= -1000000;
                }
                else if (string.Compare(timeUnit, "ga", StringComparison.OrdinalIgnoreCase) == 0)
                {
                    decimalyear *= -1000000000;
                }
                else if (string.Compare(timeUnit, "ta", StringComparison.OrdinalIgnoreCase) == 0)
                {
                    decimalyear *= -1000000000000;
                }
                else if (string.Compare(timeUnit, "pa", StringComparison.OrdinalIgnoreCase) == 0)
                {
                    decimalyear *= -1000000000000000;
                }
                else if (string.Compare(timeUnit, "ea", StringComparison.OrdinalIgnoreCase) == 0)
                {
                    decimalyear *= -1000000000000000000;
                }
                else
                {
                    throw new DataException(string.Format("Unable to parse timeUnit: {0}", timeUnit));
                }
            }

            return decimalyear;
        }

        private static decimal ConvertToDecimalYear(DateTime dateTime)
        {
            decimal year = dateTime.Year;
            decimal secondsInThisYear = DateTime.IsLeapYear(dateTime.Year) ? 366 * 24 * 60 * 60 : 365 * 24 * 60 * 60;
            decimal secondsElapsedSinceYearStart = (dateTime.DayOfYear - 1) * 24 * 60 * 60 + dateTime.Hour * 60 * 60 + dateTime.Minute * 60 + dateTime.Second;

            decimal fractionalYear = secondsElapsedSinceYearStart / secondsInThisYear;

            return year + fractionalYear;
        }

        [DataContract]
        public class BaseJsonResult<T>
        {
            [DataMember]
            public T d { get; set; }
        }
    }
}