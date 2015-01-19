using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
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

        #region constructor

        public PopulateDbFromJSON()
        {
            _jsonDirectory = AppDomain.CurrentDomain.BaseDirectory + @"Dumps\";
        }

        #endregion

        #region destructor

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

        #endregion

        #region public methods

        public void LoadDataFromDump(string curatorDisplayName, string collectionTitle, string collectionDumpFile, string toursDumpFile, bool curatorsDefaultCollection = true, bool replaceGUIDs = false)
        {
            // remove any excess spaces from display names
            curatorDisplayName  = curatorDisplayName.Trim();
            collectionTitle     = collectionTitle.Trim();

            // generate equivalent path names (uniqueness is assumed)
            string superCollectionPath  = Regex.Replace(curatorDisplayName, @"[^A-Za-z0-9\-]+", "").ToLower();  // Aa-Zz, 0-9 and hyphen only, converted to lower case.
            string collectionPath       = Regex.Replace(collectionTitle,    @"[^A-Za-z0-9\-]+", "").ToLower();  // Aa-Zz, 0-9 and hyphen only, converted to lower case.

            // get curator's user record or create if doesn't exist
            User user = _storage.Users.Where(u => u.DisplayName == curatorDisplayName).FirstOrDefault();
            if (user == null)
            {
                user = new User
                {
                    Id                  = Guid.NewGuid(),
                    DisplayName         = curatorDisplayName,
                    IdentityProvider    = "Populated from JSON"
                };
                _storage.Users.Add(user);
            }

            // get curator's supercollection record or create if doesn't exist
            SuperCollection superCollection = _storage.SuperCollections.Include("Collections").Where(s => s.Title == superCollectionPath).FirstOrDefault();
            if (superCollection == null)
            {
                superCollection = new SuperCollection
                {
                    Id                  = Guid.NewGuid(),
                    Title               = superCollectionPath,
                    User                = user,
                    Collections         = new System.Collections.ObjectModel.Collection<Collection>()
                };
                _storage.SuperCollections.Add(superCollection);
            }

            // create new collection
            Collection collection = new Collection
            {
                Id                      = Guid.NewGuid(),
                Default                 = curatorsDefaultCollection,
                PubliclySearchable      = true,
                Title                   = collectionTitle,
                Path                    = collectionPath,
                SuperCollection         = superCollection,
                User                    = user
            };
            superCollection.Collections.Add(collection);

            // populate collection from json files
            using (Stream jsonTimelines =                                File.OpenRead(_jsonDirectory + collectionDumpFile))
            using (Stream jsonTours     = toursDumpFile == null ? null : File.OpenRead(_jsonDirectory + toursDumpFile))
            {
                LoadData(jsonTimelines, jsonTours, collection, replaceGUIDs);
            }

            // commit db changes
            _storage.SaveChanges();
        }

        #endregion

        #region private methods

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

    }
}