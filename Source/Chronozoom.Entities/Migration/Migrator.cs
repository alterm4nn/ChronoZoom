﻿// ---------------------------------------​---------------------------------------​--------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// ---------------------------------------​---------------------------------------​--------------------------------------

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
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
        private const string _defaultUserName = "anonymous";

        // The user that is able to modify the base collections (e.g. Beta Content, AIDS Quilt)
        private static Lazy<string> _baseContentAdmin = new Lazy<string>(() =>
        {
            return ConfigurationManager.AppSettings["BaseCollectionsAdministrator"];
        });

        private static Lazy<string> _baseDirectory = new Lazy<string>(() =>
        {
            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["BaseDataMigrationDirectory"]))
                return ConfigurationManager.AppSettings["BaseDataMigrationDirectory"];

            return AppDomain.CurrentDomain.BaseDirectory;
        });

        public Migrator(Storage storage)
        {
            _storage = storage;
        }

        public void Migrate()
        {
            MigrateRiTree();
            LoadDataFromDump("Beta Content", "beta-get.json", "beta-gettours.json", "beta-getthresholds.json", false, _baseContentAdmin.Value);
            LoadDataFromDump("Sandbox", "beta-get.json", "beta-gettours.json", "beta-getthresholds.json", true, null);
            LoadDataFromDump("AIDS Timeline", "aidstimeline-get.json", "aidstimeline-gettours.json", null, true, _baseContentAdmin.Value);
            LoadDataFromDump("AIDS Standalone", "aidsstandalone-get.json", null, null, true, _baseContentAdmin.Value);
            LoadDataFromDump("CERN", "cern-get.json", null, null, true, null);
        }


        private void MigrateRiTree()
        {
            if (!_storage.Bitmasks.Any())
            {
                long v = 1;
                foreach (var b in _storage.Bitmasks)
                {
                    _storage.Bitmasks.Remove(b);
                }
                _storage.SaveChanges();
                for (int r = 0; r < 63; ++r)
                {
                    Bitmask b = new Bitmask();
                    b.B1 = -(v << 1);
                    b.B2 = v;
                    b.B3 = v << 1;
                    _storage.Bitmasks.Add(b);
                    v <<= 1;
                }
                _storage.SaveChanges();
            }
        }

        private void LoadDataFromDump(string superCollectionName, string getFileName, string getToursFileName, string getThresholdsFileName, bool replaceGuids, string contentAdminId)
        {
            if (_storage.SuperCollections.Find(CollectionIdFromText(superCollectionName)) == null)
            {
                // Load the Beta Content collection
                Collection collection = LoadCollections(superCollectionName, superCollectionName, contentAdminId);
                using (Stream getData = File.OpenRead(_baseDirectory.Value + @"Dumps\" + getFileName))
                using (Stream getToursData = getToursFileName == null ? null : File.OpenRead(_baseDirectory.Value + @"Dumps\" + getToursFileName))
                using (Stream getThresholdsData = getThresholdsFileName == null ? null : File.OpenRead(_baseDirectory.Value + @"Dumps\" + getThresholdsFileName))
                {
                    LoadData(getData, getToursData, getThresholdsData, collection, replaceGuids);
                }

                // Save changes to storage
                _storage.SaveChanges();
            }
        }

        private Collection LoadCollections(string superCollectionName, string collectionName, string userId)
        {
            User user;
            if (userId == null)
            {
                // Anonymous user - Sandbox collection etc.
                user = _storage.Users.Where(candidate => candidate.NameIdentifier == null).FirstOrDefault();
            }
            else
            {
                // Beta content
                user = _storage.Users.Where(candidate => candidate.NameIdentifier == userId).FirstOrDefault();
            }

            if (user == null)
            {
                user = new User { Id = Guid.NewGuid(), NameIdentifier = userId };
                user.DisplayName = userId == null ? _defaultUserName : userId; // TODO: check what to set this to
            }
            // Load Collection
            Collection collection = new Collection();
            collection.Title = collectionName;
            collection.Id = CollectionIdFromSuperCollection(superCollectionName, collectionName);
            //TODO update User
            collection.User = user;
           // collection.User.NameIdentifier = userId;

            // Load SuperCollection
            SuperCollection superCollection = new SuperCollection();
            superCollection.Title = superCollectionName;
            superCollection.Id = CollectionIdFromText(superCollectionName);
            //TOD update User
            superCollection.User = user;
            //superCollection.User.NameIdentifier = userId;

            superCollection.Collections = new System.Collections.ObjectModel.Collection<Collection>();
            superCollection.Collections.Add(collection);
            _storage.SuperCollections.Add(superCollection);

            return collection;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity", Justification = "Incremental change, will refactor later if the import process is kept")]
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
                    if (exhibit.ContentItems != null)
                    {
                        foreach (ContentItem contentItem in exhibit.ContentItems)
                        {
                            contentItem.Collection = collection;
                        }
                    }
                }
            });

            if (replaceGuids)
            {
                // Replace GUIDs to ensure multiple collections can be imported
                TraverseTimelines(bjrTimelines.d, timeline =>
                {
                    timeline.Id = Guid.NewGuid();

                    if (timeline.Exhibits != null)
                    {
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
                }
                );
            }

            foreach (var timeline in bjrTimelines.d)
            {
                if (replaceGuids) timeline.Id = Guid.NewGuid();
                timeline.Collection = collection;
                MigrateInPlace(timeline);
                timeline.ForkNode = Storage.ForkNode((long)timeline.FromYear, (long)timeline.ToYear);
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

            if (timeline.Exhibits != null)
            {
                foreach (var exhibit in timeline.Exhibits)
                {
                    exhibit.Year = ConvertToDecimalYear(exhibit.Day, exhibit.Month, exhibit.Year, exhibit.TimeUnit);
                }
            }

            if (timeline.ChildTimelines != null)
            {
                foreach (var child in timeline.ChildTimelines)
                {
                    MigrateInPlace(child);
                }
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
                if (string.Compare(timeUnit, "ce", StringComparison.OrdinalIgnoreCase) == 0 && day != null && month != null)
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
                else if (string.Compare(timeUnit, "ce", StringComparison.OrdinalIgnoreCase) == 0)
                {
                    // decimalyear is already in decimal year
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

        public static void TraverseTimelines(IEnumerable<Timeline> timelines, TraverseOperation operation)
        {
            foreach (Timeline timeline in timelines)
            {
                timeline.Traverse(operation);
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

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase", Justification = "Lowercase is URL friendly")]
        private static Guid CollectionIdFromText(string value)
        {
            // Replace with URL friendly representations
            value = value.Replace(' ', '-');

            byte[] data = _md5Hasher.ComputeHash(Encoding.Default.GetBytes(value.ToLowerInvariant()));
            return new Guid(data);
        }
    }
}
