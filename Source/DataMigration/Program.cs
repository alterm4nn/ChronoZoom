﻿// ---------------------------------------​---------------------------------------​--------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// ---------------------------------------​---------------------------------------​--------------------------------------

using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Data;

using Chronozoom.Entities;

namespace DataMigration
{
    class Program
    {
        private static readonly Storage Storage = new Storage();
        public static readonly Guid _oldRootID = new Guid("468a8005-36e3-4676-9f52-312d8b6eb7b7");
        private const string _dumpsPath = @"..\..\dumps\";
        private static MD5 _md5Hasher = MD5.Create();

        static void Main(string[] args)
        {
            Migrate();
        }

        public static void Migrate()
        {
            Console.WriteLine("Migration Started\n");

            // First remove the 'Hello World' timeline that is inserted into a new database
            Storage.SuperCollections.Remove(Storage.SuperCollections.Find(Guid.Empty));
            Storage.Collections.Remove(Storage.Collections.Find(Guid.Empty));
            Storage.Timelines.Remove(Storage.Timelines.Find(Guid.Empty));

            // Load the Beta Content collection
            Collection betaCollection = LoadCollections("Beta Content", "Beta Content");
            LoadDataFromFile(
                File.OpenRead(_dumpsPath + @"beta-get.json"),
                File.OpenRead(_dumpsPath + @"beta-gettours.json"),
                File.OpenRead(_dumpsPath + @"beta-getthresholds.json"),
                betaCollection,
                false);

            // Load the AIDS Timeline collection
            Collection aidstimelineCollection = LoadCollections("AIDS Timeline", "AIDS Timeline");
            LoadDataFromFile(
                File.OpenRead(_dumpsPath + @"aidstimeline-get.json"),
                File.OpenRead(_dumpsPath + @"aidstimeline-gettours.json"),
                null,
                aidstimelineCollection,
                true);

            // Load the AIDS Timeline in standalone mode
            Collection aidsStandaloneCollection = LoadCollections("AIDS Standalone", "AIDS Standalone");
            LoadDataFromFile(
                File.OpenRead(_dumpsPath + @"aidsstandalone-get.json"),
                null,
                null,
                aidsStandaloneCollection,
                true);

            // Save changes to storage
            Storage.SaveChanges();

            Console.WriteLine("Migration Completed\n");
        }

        private static Collection LoadCollections(string superCollectionName, string collectionName)
        {
            // Load Collection
            Collection collection = new Collection();
            collection.Title = collectionName;
            collection.Id = CollectionIdFromSuperCollection(superCollectionName, collectionName);

            // Load SuperCollection
            SuperCollection superCollection = new SuperCollection();
            superCollection.Title = superCollectionName;
            superCollection.Id = CollectionIdFromText(superCollectionName);
            
            superCollection.Collections = new System.Collections.ObjectModel.Collection<Collection>();
            superCollection.Collections.Add(collection);
            Storage.SuperCollections.Add(superCollection);

            return collection;
        }

        private static void LoadDataFromFile(Stream dataTimelines, Stream dataTours, Stream dataThresholds, Collection collection, bool replaceGuids)
        {
            var bjrTimelines = new DataContractJsonSerializer(typeof(BaseJsonResult<IEnumerable<Timeline>>)).ReadObject(dataTimelines) as BaseJsonResult<IEnumerable<Timeline>>;

            Storage.Collections.Add(collection);

            // Associate each timeline with the root collection
            TraverseTimelines(bjrTimelines.d, timeline =>
                timeline.Collection = collection
            );

            if (replaceGuids)
            {
                // Replace GUIDs to ensure multiple collections can be imported
                TraverseTimelines(bjrTimelines.d, timeline =>
                    {
                        timeline.Id = Guid.NewGuid();

                        foreach (Exhibit exhibit in timeline.Exhibits)
                        {
                            exhibit.Id = Guid.NewGuid();

                            foreach (ContentItem contentItem in exhibit.ContentItems)
                                contentItem.Id = Guid.NewGuid();

                            foreach (Reference reference in exhibit.References)
                                reference.Id = Guid.NewGuid();
                        }
                    }
                );
            }

            foreach (var timeline in bjrTimelines.d)
            {
                if (replaceGuids) timeline.Id = Guid.NewGuid();
                timeline.Collection = collection;

                MigrateInPlace(timeline);
                Storage.Timelines.Add(timeline);
            }

            if (dataTours != null)
            {
                var bjrTours = new DataContractJsonSerializer(typeof(BaseJsonResult<IEnumerable<Tour>>)).ReadObject(dataTours) as BaseJsonResult<IEnumerable<Tour>>;

                foreach (var tour in bjrTours.d)
                {
                    if (replaceGuids) tour.Id = Guid.NewGuid();
                    tour.Collection = collection;

                    foreach (var bookmark in tour.Bookmarks)
                        bookmark.Id = Guid.NewGuid();

                    Storage.Tours.Add(tour);
                }
            }

            if (dataThresholds != null)
            {
                var bjrThresholds = new DataContractJsonSerializer(typeof(BaseJsonResult<IEnumerable<Threshold>>)).ReadObject(dataThresholds) as BaseJsonResult<IEnumerable<Threshold>>;

                foreach (var threshold in bjrThresholds.d)
                {
                    threshold.ThresholdYear = ConvertToDecimalYear(threshold.ThresholdDay, threshold.ThresholdMonth, threshold.ThresholdYear, threshold.ThresholdTimeUnit);
                    Storage.Thresholds.Add(threshold);
                }
            }
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
            // Substitute 0.0 for year 9999.  Today the algorithm assumes year 0.0 means 'today' but in decimal years, 0.0 is a valid value.
            if (year == 0)
            {
                return 9999;
            }

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

        private delegate void TraverseOperation(Timeline timeline);
        private static void TraverseTimelines(IEnumerable<Timeline> timelines, TraverseOperation operation)
        {
            if (timelines == null)
                return;

            foreach (Timeline timeline in timelines)
            {
                operation(timeline);
                TraverseTimelines(timeline.ChildTimelines, operation);
            }
        }

        private static Guid CollectionIdFromSuperCollection(string supercollection, string collection)
        {
            return CollectionIdFromText(supercollection.ToLower() + "|" + collection.ToLower());
        }

        private static Guid CollectionIdFromText(string value)
        {
            // Replace with URL friendly representations
            value = value.Replace(' ', '-');

            byte[] data = _md5Hasher.ComputeHash(Encoding.Default.GetBytes(value.ToLowerInvariant()));
            return new Guid(data);
        }
    }
}