// ---------------------------------------​---------------------------------------​--------------------------------------
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

namespace Chronozoom.Entities.Migration
{
    internal class Migrator
    {
        private readonly Storage _storage;
        private static readonly MD5 _md5Hasher = MD5.Create();
        private const string _defaultUserName = "anonymous";

        // The user that is able to modify the base collections (e.g. Beta Content, AIDS Quilt)
        private static readonly Lazy<string> _baseContentAdmin = new Lazy<string>(() => ConfigurationManager.AppSettings["BaseCollectionsAdministrator"]);

        private static readonly Lazy<string> _baseDirectory = new Lazy<string>(() =>
        {
            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["BaseDataMigrationDirectory"]))
                return ConfigurationManager.AppSettings["BaseDataMigrationDirectory"];

            return AppDomain.CurrentDomain.BaseDirectory;
        });

        private static readonly Lazy<int> _maxTimelinesToImport = new Lazy<int>(() =>
        {
            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["MaxTimelinesToImport"]))
                return int.Parse(ConfigurationManager.AppSettings["MaxTimelinesToImport"], CultureInfo.InvariantCulture);

            return 10000;
        });

        public Migrator(Storage storage)
        {
            _storage = storage;
        }

        public void Migrate()
        {
            MigrateRiTree();
            LoadDataFromDump("Beta Content", "Beta Content", "beta-get.json", "beta-gettours.json", false, _baseContentAdmin.Value);
            LoadDataFromDump("Sandbox", "Sandbox", "beta-get.json", null, true, null);
            LoadDataFromDump("Sandbox", "Extensions", "extensions-get.json", null, true, null);
            LoadDataFromDump("AIDS Timeline", "AIDS Timeline", "aidstimeline-get.json", "aidstimeline-gettours.json", false, _baseContentAdmin.Value);
       }

        private void MigrateRiTree()
        {
            if (_storage.Bitmasks.Any()) return;
            long v = 1;
            foreach (var b in _storage.Bitmasks)
            {
                _storage.Bitmasks.Remove(b);
            }
            _storage.SaveChanges();
            for (int r = 0; r < 63; ++r)
            {
                var b = new Bitmask {B1 = -(v << 1), B2 = v, B3 = v << 1};
                _storage.Bitmasks.Add(b);
                v <<= 1;
            }
            _storage.SaveChanges();
        }

        private void LoadDataFromDump(string superCollectionName, string collectionName, string getFileName, string getToursFileName, bool replaceGuids, string contentAdminId)
        {
            SuperCollection superCollection = _storage.SuperCollections.Find(CollectionIdFromText(superCollectionName));
            bool createCollection = true;

            if (superCollection != null)
            {
                _storage.Entry(superCollection).Collection(_ => _.Collections).Load();
                createCollection = superCollection.Collections.All(candidate => candidate.Title != collectionName);
            }

            if (superCollection == null || createCollection)
            {
                // Load the Beta Content collection
                Collection collection = LoadCollections(superCollectionName, collectionName, contentAdminId);
                using (Stream getData = File.OpenRead(_baseDirectory.Value + @"Dumps\" + getFileName))
                using (Stream getToursData = getToursFileName == null ? null : File.OpenRead(_baseDirectory.Value + @"Dumps\" + getToursFileName))
                {
                    LoadData(getData, getToursData, collection, replaceGuids);
                }

                // Save changes to storage
                _storage.SaveChanges();
            }
        }

        private Collection LoadCollections(string superCollectionName, string collectionName, string userId)
        {
            User user = (userId == null 
                             ? _storage.Users.FirstOrDefault(candidate => candidate.NameIdentifier == null) 
                             : _storage.Users.FirstOrDefault(candidate => candidate.NameIdentifier == userId)) ??
                        new User {Id = Guid.NewGuid(), NameIdentifier = userId, DisplayName = userId ?? _defaultUserName};

            // Load Collection
            var collection = new Collection
                {
                    Title = collectionName,
                    Id = CollectionIdFromSuperCollection(superCollectionName, collectionName),
                    User = user
                };

            // Load SuperCollection
            SuperCollection superCollection = _storage.SuperCollections.FirstOrDefault(candidate => candidate.Title == superCollectionName);

            if (superCollection == null)
            {
                superCollection = new SuperCollection
                    {
                        Title = superCollectionName,
                        Id = CollectionIdFromText(superCollectionName),
                        User = user
                    };
                _storage.SuperCollections.Add(superCollection);
            }

            if (superCollection.Collections == null)
            {
                superCollection.Collections = new System.Collections.ObjectModel.Collection<Collection>();
            }

            superCollection.Collections.Add(collection);

            return collection;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity", Justification = "Incremental change, will refactor later if the import process is kept")]
        private void LoadData(Stream dataTimelines, Stream dataTours, Collection collection, bool replaceGuids)
        {
            var timelines = new DataContractJsonSerializer(typeof(IList<Timeline>)).ReadObject(dataTimelines) as IList<Timeline>;

            _storage.Collections.Add(collection);

            int importedTimelinesCount = 0;

            // Associate each timeline with the root collection
            TraverseTimelines(timelines, timeline =>
            {
                if (++importedTimelinesCount < _maxTimelinesToImport.Value)
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
                }
                else if (timeline.ChildTimelines != null)
                {
                    timeline.ChildTimelines.Clear();
                }
            });

            if (replaceGuids)
            {
                // Replace GUIDs to ensure multiple collections can be imported
                TraverseTimelines(timelines, timeline =>
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
                        }
                    }
                }
                );
            }

            if (timelines != null)
            {
                foreach (var timeline in timelines)
                {
                    if (replaceGuids) timeline.Id = Guid.NewGuid();
                    timeline.Collection = collection;
                    timeline.Depth = -1;  // this denotes no migration has been applied to current timeline
                    timeline.ForkNode = Storage.ForkNode((long)timeline.FromYear, (long)timeline.ToYear);
                }

                foreach (var timeline in timelines)  // note: timeline objects in "timelines" are ordered by depth already since they are parsed from a nested-JSON file 
                {
                    if (timeline.Depth == -1)
                    {
                        timeline.Depth = 0;
                        MigrateInPlace(timeline);
                    }
                    _storage.Timelines.Add(timeline);
                }
            }
            _storage.SaveChanges();

            if (dataTours != null)
            {
                var bjrTours =
                    new DataContractJsonSerializer(typeof (BaseJsonResult<IEnumerable<Tour>>)).ReadObject(dataTours) as
                    BaseJsonResult<IEnumerable<Tour>>;

                if (bjrTours != null)
                    foreach (var tour in bjrTours.d)
                    {
                        if (replaceGuids) tour.Id = Guid.NewGuid();
                        tour.Collection = collection;

                        if (tour.Bookmarks != null && replaceGuids)
                        {
                            foreach (var bookmark in tour.Bookmarks)
                            {
                                bookmark.Id = Guid.NewGuid();
                            }
                        }
                        _storage.Tours.Add(tour);
                    }
                _storage.SaveChanges();
            }
        }

        public static void MigrateInPlace(Timeline timeline)
        {
            int subtreeSize = 1;
            if (timeline.Exhibits != null)
            {
                foreach (var exhibit in timeline.Exhibits)
                {
                    subtreeSize++;
                    exhibit.Depth = timeline.Depth + 1;
                    if (exhibit.ContentItems != null)
                    {
                        foreach (ContentItem contentItem in exhibit.ContentItems)
                        {
                            contentItem.Depth = exhibit.Depth + 1;
                        }
                        subtreeSize += exhibit.ContentItems.Count();
                    }
                }
            }

            if (timeline.ChildTimelines != null)
            {
                foreach (var child in timeline.ChildTimelines)
                {
                    child.Depth = timeline.Depth + 1;
                    MigrateInPlace(child);
                    subtreeSize += child.SubtreeSize;
                }
            }
            timeline.SubtreeSize = subtreeSize;
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
