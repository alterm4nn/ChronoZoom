using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.IO;
using System.Xml;
using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Chronozoom.Entities;
using UI;

namespace DataMigration
{
    class Program
    {
        public static string TIMELINE_ENTITY = "Timeline:#Chronozoom.Entities";
        public static string EXHIBIT_ENTITY = "Exhibit:#Chronozoom.Entities";
        public static string CONTENTITEM_ENTITY = "ContentItem:#Chronozoom.Entities";
        
        // Unused
        public static Decimal BigBangTime = -13700000000;

        private static Storage dbInst;

        private static void InitializeDbContext()
        {
            dbInst = new Storage();
        }

        static void Main(string[] args)
        {
            //Console.Write("Enter the URL from which you want to migrate JSON data ");
            InitializeDbContext();
            Migrate();
        }

        //returns the decimal year equivalent of the incoming data
        private static Decimal? convertToDecimalYear(int? day, int? month, Decimal? year, string timeUnit)
        {
            Decimal? decimalyear = null;
            if (year.HasValue)
            {
                decimalyear = (Decimal)year; 
            }
            else 
            {
                return null; //if the value of the year var is null, return null
            }

            if (timeUnit != null) //if the timeUnit is null - we still calculate decimalyear in the first if of the function and return that value
            {
                if (string.Compare(timeUnit, "ce", true) == 0) //if the timeunit is CE
                {
                    int tempmonth = 1;
                    int tempday = 1;
                    if (month.HasValue && month > 0) //if the month and day values are null, calculating decimalyear with the first day of the year
                    {
                        tempmonth = (int)month;
                        if (day.HasValue && day > 0)
                        {
                            tempday = (int)day;
                        }
                    }
                    DateTime dt = new DateTime((int)decimalyear, tempmonth, tempday);
                    decimalyear = convertToDecimalYear(dt);
                }
                else if (string.Compare(timeUnit, "bce", true) == 0)
                {
                    decimalyear *= -1; //anything that is not CE is in the negative scale. 0 CE = O Decimal Year
                }
                else if (string.Compare(timeUnit, "ka", true) == 0)
                {
                    decimalyear *= -1000;
                }
                else if (string.Compare(timeUnit, "ma", true) == 0)
                {
                    decimalyear *= -1000000;
                }
                else if (string.Compare(timeUnit, "ga", true) == 0)
                {
                    decimalyear *= -1000000000;
                }
                else if (string.Compare(timeUnit, "ta", true) == 0)
                {
                    decimalyear *= -1000000000000;
                }
                else if (string.Compare(timeUnit, "pa", true) == 0)
                {
                    decimalyear *= -1000000000000000;
                }
                else if (string.Compare(timeUnit, "ea", true) == 0)
                {
                    decimalyear *= -1000000000000000000;
                }
                else
                {
                    Console.WriteLine(timeUnit); //was never hit with the current data
                }
            }
            return decimalyear;
        }

        private static Decimal convertToDecimalYear(DateTime dateTime)
        {
            Decimal year = dateTime.Year;
            Decimal secondsInThisYear = DateTime.IsLeapYear(dateTime.Year) ? 366 * 24 * 60 * 60 : 365 * 24 * 60 * 60;
            Decimal secondsElapsedSinceYearStart = 
                (dateTime.DayOfYear - 1) * 24 * 60 * 60 + dateTime.Hour * 60 * 60 + dateTime.Minute * 60 + dateTime.Second;

            Decimal fractionalYear = secondsElapsedSinceYearStart / secondsInThisYear;

            return year + fractionalYear;
        }

        private static DateTime getDateTimeFromDateTimeOffset(JObject dateTimeOffset)
        {
            string datetime = (string)dateTimeOffset["DateTime"];
            int offsetmins = (int)dateTimeOffset["OffsetMinutes"];
            DateTimeOffset dtOffset = new DateTimeOffset(DateTime.Parse(datetime), new TimeSpan(0, 0, offsetmins, 0));
            return dtOffset.DateTime;
        }

        private static ContentItem ParseContentItem(JObject jobj)
        {
            ContentItem c = new ContentItem();
            
            c.ID = Guid.NewGuid();
            c.Title = (string)jobj["Title"];
            c.Caption = (string)jobj["Caption"];
            c.Threshold = (string)jobj["Threshold"];
            c.Regime = (string)jobj["Regime"];
            c.TimeUnit = (string)jobj["TimeUnit"];
            try
            {
                // not using time unit here as it is built into date if the date is in CE
                //If the date is not in CE, then this object is not of type JObject - it is of type JValue in the JSON and is handled in the catch block
                //c.Date = getDateTimeFromDateTimeOffset((JObject)jobj["Date"]); 
                c.Year = convertToDecimalYear(getDateTimeFromDateTimeOffset((JObject)jobj["Date"]));
            }
            catch (InvalidCastException e)
            {   //Calculating the decimal year given year and TimeUnit
                c.Year = convertToDecimalYear(null, null, (Decimal?)jobj["Year"], (string)jobj["TimeUnit"]);
            }   
            c.MediaType = (string)jobj["MediaType"];
            c.Uri = (string)jobj["Uri"];
            c.MediaSource = (string)jobj["MediaSource"];
            c.Attribution = (string)jobj["Attribution"];
            c.UniqueID = (int)jobj["UniqueID"];
            c.Order = (short?)jobj["Order"];
            c.HasBibliography = (bool)jobj["HasBibliography"];
            // Insert into db here
            dbInst.ContentItems.Add(c);
            return c;
        }

        private static Exhibit ParseExhibit(JObject jobj)
        {
            Exhibit e = new Exhibit();
            e.ID = Guid.NewGuid();
            e.Title = (string)jobj["Title"];
            e.Threshold = (string)jobj["Threshold"];
            e.Regime = (string)jobj["Regime"];
            e.TimeUnit = (string)jobj["TimeUnit"];
            e.Day = (int?)jobj["Day"];
            e.Month = (int?)jobj["Month"];
            e.Year = convertToDecimalYear((int?)jobj["Day"], (int?)jobj["Month"], (Decimal?)jobj["Year"], (string)jobj["TimeUnit"]);
            e.UniqueID = (int)jobj["UniqueID"];
            e.Sequence = (int?)jobj["Sequence"];

            JArray contentItems = (JArray)jobj["ContentItems"];
            foreach (var contentItem in (List<ContentItem>)ParseJArray(contentItems))
            {
                e.ContentItems.Add(contentItem);
            }

            JArray references = (JArray)jobj["References"];
            foreach (var reference in (List<Reference>)ParseJArray(references))
            {
                e.References.Add(reference);
            }

            // Insert into db here
            dbInst.Exhibits.Add(e);
            return e;
        }

        private static Timeline ParseTimeline(JObject jobj)
        {
            Timeline t = new Timeline();
            t.ID = Guid.NewGuid();
            t.Title = (string)jobj["Title"];
            t.Threshold = (string)jobj["Threshold"];
            t.Regime = (string)jobj["Regime"];
            t.FromTimeUnit = (string)jobj["FromTimeUnit"];
            t.FromDay = (int?)jobj["FromDay"];
            t.FromMonth = (int?)jobj["FromMonth"];
            t.FromYear = convertToDecimalYear((int?)jobj["FromDay"], (int?)jobj["FromMonth"], (Decimal?)jobj["FromYear"], (string)jobj["FromTimeUnit"]);
            t.ToTimeUnit = (string)jobj["ToTimeUnit"];
            t.ToDay = (int?)jobj["ToDay"];
            t.ToMonth = (int?)jobj["ToMonth"];
            t.ToYear = convertToDecimalYear((int?)jobj["ToDay"], (int?)jobj["ToMonth"], (Decimal?)jobj["ToYear"], (string)jobj["ToTimeUnit"]);
            t.UniqueID = (int)jobj["UniqueID"];
            t.Sequence = (int?)jobj["Sequence"];
            t.Height = (Decimal?)jobj["Height"];

            JArray childTimesLines = (JArray)jobj["ChildTimelines"];
            foreach (var childTimeline in (List<Timeline>) ParseJArray(childTimesLines))
            {
                t.ChildTimelines.Add(childTimeline);
            }

            JArray exhibitsArray = (JArray)jobj["Exhibits"];
            foreach (var exhibit in (List<Exhibit>) ParseJArray(exhibitsArray))
            {
                t.Exhibits.Add(exhibit);
            }

            // Insert into db here
            dbInst.Timelines.Add(t);
            return t;
        }

        private static Object ParseJArray(JArray parseArray)
        {
            Object retObject = null;
            if (parseArray != null && parseArray.Count > 0)
            {
                string type = (string)parseArray[0]["__type"];
                if (type.Equals(TIMELINE_ENTITY))
                {
                    List<Timeline> l = new List<Timeline>();
                    foreach (JObject obj in parseArray)
                    {
                        l.Add(ParseTimeline(obj));
                    }
                    retObject = l;
                }
                else if (type.Equals(EXHIBIT_ENTITY))
                {
                    List<Exhibit> l = new List<Exhibit>();
                    foreach (JObject obj in parseArray)
                    {
                        l.Add(ParseExhibit(obj));
                    }
                    retObject = l;
                }
                else if (type.Equals(CONTENTITEM_ENTITY))
                {
                    List<ContentItem> l = new List<ContentItem>();
                    foreach (JObject obj in parseArray)
                    {
                        l.Add(ParseContentItem(obj));
                    }
                    retObject = l;
                }
            }
            return retObject;
        }

        public static void Migrate()
        {
            WebClient myWebClient = new WebClient();

            Stream dataTimelines = myWebClient.OpenRead("http://www.chronozoomproject.org/Chronozoom.svc/get");
            var bjrTimelines = new DataContractJsonSerializer(typeof(BaseJsonResult<IEnumerable<Timeline>>)).ReadObject(dataTimelines) as BaseJsonResult<IEnumerable<Timeline>>;

            foreach (var timeline in bjrTimelines.d)
            {
                dbInst.Timelines.Add(timeline);
            }

            Stream dataTours = myWebClient.OpenRead("http://www.chronozoomproject.org/Chronozoom.svc/getTours");
            var bjrTours = new DataContractJsonSerializer(typeof(BaseJsonResult<IEnumerable<Tour>>)).ReadObject(dataTours) as BaseJsonResult<IEnumerable<Tour>>;

            foreach (var tour in bjrTours.d)
            {
                dbInst.Tours.Add(tour);
            }

            Stream dataThresholds = myWebClient.OpenRead("http://www.chronozoomproject.org/Chronozoom.svc/getThresholds");
            var bjrThresholds = new DataContractJsonSerializer(typeof(BaseJsonResult<IEnumerable<Threshold>>)).ReadObject(dataThresholds) as BaseJsonResult<IEnumerable<Threshold>>;

            foreach (var threshold in bjrThresholds.d)
            {
                dbInst.Thresholds.Add(threshold);
            }

            dbInst.SaveChanges();
            Console.WriteLine("Parsed Successfully \n");
        }

        [DataContract]
        public class BaseJsonResult<T>
        {
            [DataMember]
            public T d;
        }
    }
}