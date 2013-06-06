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
using System.Data;
using System.Diagnostics;

using Chronozoom.Entities;

namespace Chronozoom.Entities.Migration
{
    internal class Migrator
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
            LoadDataFromDump("Beta Content", "beta-get.json", "beta-gettours.json", false, _baseContentAdmin.Value);
            LoadDataFromDump("Sandbox", "beta-get.json", "beta-gettours.json", true, null);
            LoadDataFromDump("AIDS Timeline", "aidstimeline-get.json", "aidstimeline-gettours.json", false, _baseContentAdmin.Value);
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

        private void LoadDataFromDump(string superCollectionName, string getFileName, string getToursFileName, bool replaceGuids, string contentAdminId)
        {
            if (_storage.SuperCollections.Find(CollectionIdFromText(superCollectionName)) == null)
            {
                // Load the Beta Content collection
                Collection collection = LoadCollections(superCollectionName, superCollectionName, contentAdminId);
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
                user.DisplayName = (userId == null) ? _defaultUserName : userId;
            }
            // Load Collection
            Collection collection = new Collection();
            collection.Title = collectionName;
            collection.Id = CollectionIdFromSuperCollection(superCollectionName, collectionName);
            collection.User = user;

            // Load SuperCollection
            SuperCollection superCollection = new SuperCollection();
            superCollection.Title = superCollectionName;
            superCollection.Id = CollectionIdFromText(superCollectionName);
            superCollection.User = user;

            superCollection.Collections = new System.Collections.ObjectModel.Collection<Collection>();
            superCollection.Collections.Add(collection);
            _storage.SuperCollections.Add(superCollection);

            return collection;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity", Justification = "Incremental change, will refactor later if the import process is kept")]
        private void LoadData(Stream dataTimelines, Stream dataTours, Collection collection, bool replaceGuids)
        {
            var timelines = new DataContractJsonSerializer(typeof(IEnumerable<Timeline>)).ReadObject(dataTimelines) as IEnumerable<Timeline>;

            _storage.Collections.Add(collection);

            // Associate each timeline with the root collection
            TraverseTimelines(timelines, timeline =>
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
            _storage.CreatePostOrderIndex(timelines);
            _storage.SaveChanges();

            if (dataTours != null)
            {
                var bjrTours = new DataContractJsonSerializer(typeof(BaseJsonResult<IEnumerable<Tour>>)).ReadObject(dataTours) as BaseJsonResult<IEnumerable<Tour>>;

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
                    exhibit.Depth = timeline.Depth + 1;
                    if (exhibit.ContentItems != null)
                    {
                        foreach (ContentItem contentItem in exhibit.ContentItems)
                        {
                            contentItem.Depth = exhibit.Depth + 1;
                        }
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
