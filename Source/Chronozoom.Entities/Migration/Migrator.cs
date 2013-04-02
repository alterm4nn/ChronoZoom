﻿// ---------------------------------------​---------------------------------------​--------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// ---------------------------------------​---------------------------------------​--------------------------------------

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Data;

using Chronozoom.Entities;

namespace Chronozoom.Entities.Migration
{
    class Migrator
    {
        private Storage _storage;
        private static MD5 _md5Hasher = MD5.Create();

        // The user that is able to modify the base collections (e.g. Beta Content, AIDS Quilt)
        private static Lazy<string> _baseContentAdmin = new Lazy<string>(() =>
            {
                return ConfigurationManager.AppSettings["BaseCollectionsAdministrator"];
            });

        public Migrator(Storage storage)
        {
            _storage = storage;
        }

        public void Migrate()
        {

            // Load the Beta Content collection
            Collection betaCollection = LoadCollections("Beta Content", "Beta Content", _baseContentAdmin.Value);
            using (Stream betaGet = File.OpenRead(AppDomain.CurrentDomain.BaseDirectory + @"Dumps\beta-get.json"))
            using (Stream betaGetTours = File.OpenRead(AppDomain.CurrentDomain.BaseDirectory + @"Dumps\beta-gettours.json"))
            using (Stream betaGetThresholds = File.OpenRead(AppDomain.CurrentDomain.BaseDirectory + @"Dumps\beta-getthresholds.json"))
            {
                LoadData(betaGet, betaGetTours, betaGetThresholds, betaCollection, false);
            }

            // Load the Beta Content collection (sandbox mode - everyone can edit)
            Collection betaCollectionSandbox = LoadCollections("Sandbox", "Sandbox", null);
            using (Stream betaGet = File.OpenRead(AppDomain.CurrentDomain.BaseDirectory + @"Dumps\beta-get.json"))
            using (Stream betaGetTours = File.OpenRead(AppDomain.CurrentDomain.BaseDirectory + @"Dumps\beta-gettours.json"))
            using (Stream betaGetThresholds = File.OpenRead(AppDomain.CurrentDomain.BaseDirectory + @"Dumps\beta-getthresholds.json"))
            {
                LoadData(betaGet, betaGetTours, betaGetThresholds, betaCollectionSandbox, true);
            }

            // Load the AIDS Timeline collection
            Collection aidstimelineCollection = LoadCollections("AIDS Timeline", "AIDS Timeline", _baseContentAdmin.Value);
            using (Stream aidsTimelineGet = File.OpenRead(AppDomain.CurrentDomain.BaseDirectory + @"Dumps\aidstimeline-get.json"))
            using (Stream aidsTimelineGetTours = File.OpenRead(AppDomain.CurrentDomain.BaseDirectory + @"Dumps\aidstimeline-get.json"))
            {
                LoadData(aidsTimelineGet, aidsTimelineGetTours, null, aidstimelineCollection, true);
            }

            // Load the AIDS Timeline in standalone mode
            Collection aidsStandaloneCollection = LoadCollections("AIDS Standalone", "AIDS Standalone", _baseContentAdmin.Value);
            using (Stream aidsStandalone = File.OpenRead(AppDomain.CurrentDomain.BaseDirectory + @"Dumps\aidsstandalone-get.json"))
            {
                LoadData(aidsStandalone, null, null, aidsStandaloneCollection, true);
            }

            // Save changes to storage
            _storage.SaveChanges();
        }

        private Collection LoadCollections(string superCollectionName, string collectionName, string userId)
        {
            // Load Collection
            Collection collection = new Collection();
            collection.Title = collectionName;
            collection.Id = CollectionIdFromSuperCollection(superCollectionName, collectionName);
            collection.UserId = userId;

            // Load SuperCollection
            SuperCollection superCollection = new SuperCollection();
            superCollection.Title = superCollectionName;
            superCollection.Id = CollectionIdFromText(superCollectionName);
            superCollection.UserId = userId;
            
            superCollection.Collections = new System.Collections.ObjectModel.Collection<Collection>();
            superCollection.Collections.Add(collection);
            _storage.SuperCollections.Add(superCollection);

            return collection;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity", Justification="Incremental change, will refactor later if the import process is kept")]
        private void LoadData(Stream dataTimelines, Stream dataTours, Stream dataThresholds, Collection collection, bool replaceGuids)
        {
            var bjrTimelines = new DataContractJsonSerializer(typeof(BaseJsonResult<IEnumerable<Timeline>>)).ReadObject(dataTimelines) as BaseJsonResult<IEnumerable<Timeline>>;

            _storage.Collections.Add(collection);

            // Associate each timeline with the root collection
            TraverseTimelines(bjrTimelines.d, timeline =>
            {
                timeline.Collection = collection;
                foreach (Exhibit exhibit in timeline.Exhibits)
                {
                    exhibit.Collection = collection;
                    foreach (ContentItem contentItem in exhibit.ContentItems)
                    {
                        contentItem.Collection = collection;
                    }
                }
            });

            if (replaceGuids)
            {
                // Replace GUIDs to ensure multiple collections can be imported
                TraverseTimelines(bjrTimelines.d, timeline =>
                    {
                        timeline.Id = Guid.NewGuid();

                        foreach (Exhibit exhibit in timeline.Exhibits)
                        {
                            exhibit.Id = Guid.NewGuid();

                            if (exhibit.ContentItems != null)
                            {
                                foreach (ContentItem contentItem in exhibit.ContentItems)
                                {
                                    contentItem.Id = Guid.NewGuid();
                                }
                            }

                            if (exhibit.References != null)
                            {
                                foreach (Reference reference in exhibit.References)
                                {
                                    reference.Id = Guid.NewGuid();
                                }
                            }
                        }
                    }
                );
            }

            foreach (var timeline in bjrTimelines.d)
            {
                if (replaceGuids) timeline.Id = Guid.NewGuid();
                timeline.Collection = collection;

                MigrateInPlace(timeline);
                _storage.Timelines.Add(timeline);
            }

            if (dataTours != null)
            {
                var bjrTours = new DataContractJsonSerializer(typeof(BaseJsonResult<IEnumerable<Tour>>)).ReadObject(dataTours) as BaseJsonResult<IEnumerable<Tour>>;

                foreach (var tour in bjrTours.d)
                {
                    if (replaceGuids) tour.Id = Guid.NewGuid();
                    tour.Collection = collection;

                    if (tour.Bookmarks != null)
                    {
                        foreach (var bookmark in tour.Bookmarks)
                        {
                            bookmark.Id = Guid.NewGuid();
                        }
                    }

                    _storage.Tours.Add(tour);
                }
            }

            if (dataThresholds != null)
            {
                var bjrThresholds = new DataContractJsonSerializer(typeof(BaseJsonResult<IEnumerable<Threshold>>)).ReadObject(dataThresholds) as BaseJsonResult<IEnumerable<Threshold>>;

                foreach (var threshold in bjrThresholds.d)
                {
                    threshold.ThresholdYear = ConvertToDecimalYear(threshold.ThresholdDay, threshold.ThresholdMonth, threshold.ThresholdYear, threshold.ThresholdTimeUnit);
                    _storage.Thresholds.Add(threshold);
                }
            }
        }

        private void MigrateInPlace(Timeline timeline)
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
                    throw new DataException(string.Format(CultureInfo.InvariantCulture, "Unable to parse timeUnit: {0}", timeUnit));
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
        private void TraverseTimelines(IEnumerable<Timeline> timelines, TraverseOperation operation)
        {
            if (timelines == null)
                return;

            foreach (Timeline timeline in timelines)
            {
                operation(timeline);
                TraverseTimelines(timeline.ChildTimelines, operation);
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase", Justification = "Lowercase is URL friendly")]
        private static Guid CollectionIdFromSuperCollection(string supercollection, string collection)
        {
            return CollectionIdFromText(string.Format(
                CultureInfo.InvariantCulture,
                "{0}|{1}",
                supercollection.ToLower(CultureInfo.InvariantCulture),
                collection.ToLower(CultureInfo.InvariantCulture)));
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase", Justification="Lowercase is URL friendly")]
        private static Guid CollectionIdFromText(string value)
        {
            // Replace with URL friendly representations
            value = value.Replace(' ', '-');

            byte[] data = _md5Hasher.ComputeHash(Encoding.Default.GetBytes(value.ToLowerInvariant()));
            return new Guid(data);
        }
    }
}