using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Security.Cryptography;
using System.Text;
using Chronozoom.Entities;

namespace Chronozoom.UI.Utils
{
    public class PopulateDbFromJSON : IDisposable
    {
        private const    string     _defaultUser    = "anonymous";
        private readonly string     _jsonDirectory;
        private const int           _maxTimelines   = 10000;            // max # to import
        private static readonly MD5 _md5Hasher      = MD5.Create();
        private Storage             _storage        = new Storage();

        [DataContract]
        private class BaseJsonResult<T>
        {
            [DataMember]
            public T d { get; set; }
        }

        // constructor
        public PopulateDbFromJSON()
        {
            _jsonDirectory = AppDomain.CurrentDomain.BaseDirectory + @"Dumps\";
        }

        public void LoadDataFromDump(string superCollectionName, string collectionName, string getFileName, string getToursFileName, bool replaceGuids, string contentAdminId)
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
                Collection collection = LoadCollections(superCollectionName, collectionName, contentAdminId);
                using (Stream getData = File.OpenRead(_jsonDirectory + getFileName))
                using (Stream getToursData = getToursFileName == null ? null : File.OpenRead(_jsonDirectory + getToursFileName))
                {
                    LoadData(getData, getToursData, collection, replaceGuids);
                }

                _storage.SaveChanges();
            }
        }

        #region Private Methods descended from LoadDataFromDump

        private Collection LoadCollections(string superCollectionName, string collectionName, string userId)
        {
            User user = (userId == null
                             ? _storage.Users.FirstOrDefault(candidate => candidate.NameIdentifier == null)
                             : _storage.Users.FirstOrDefault(candidate => candidate.NameIdentifier == userId)) ??
                        new User { Id = Guid.NewGuid(), NameIdentifier = userId, DisplayName = userId ?? _defaultUser };

            // load collection
            var collection = new Collection
            {
                Title = collectionName,
                Id = CollectionIdFromSuperCollection(superCollectionName, collectionName),
                User = user
            };

            // load supercollection
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

            // associate each timeline with the root collection
            TraverseTimelines(timelines, timeline =>
            {
                if (++importedTimelinesCount < _maxTimelines)
                {
                    timeline.Collection = collection;

                    foreach (Exhibit exhibit in timeline.Exhibits)
                    {
                        exhibit.Collection  = collection;
                        exhibit.UpdatedTime = DateTime.UtcNow;

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
                // replace GUIDs to ensure multiple collections can be imported
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
                    timeline.Depth = -1; // this denotes no migration has been applied to current timeline
                    timeline.ForkNode = Storage.ForkNode((long)timeline.FromYear, (long)timeline.ToYear);
                }

                foreach (var timeline in timelines) // note: timeline objects in "timelines" are ordered by depth already since they are parsed from a nested-JSON file 
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
                    new DataContractJsonSerializer(typeof(BaseJsonResult<IEnumerable<Tour>>)).ReadObject(dataTours) as
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
            value       = value.Replace(' ', '-'); // replace with URL friendly representation
            byte[] data = _md5Hasher.ComputeHash(Encoding.Default.GetBytes(value.ToLowerInvariant()));
            return new Guid(data);
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

        private static void TraverseTimelines(IEnumerable<Timeline> timelines, TraverseOperation operation)
        {
            foreach (Timeline timeline in timelines)
            {
                timeline.Traverse(operation);
            }
        }

        #endregion

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                // free any managed resources
                _storage.Dispose();
                _md5Hasher.Dispose();
            }
            // free any native resources
        }
    }
}