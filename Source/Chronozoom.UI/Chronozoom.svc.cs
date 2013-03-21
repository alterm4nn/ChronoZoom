// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using System.Runtime.Caching;
using System.Security.Cryptography;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

using Chronozoom.Entities;

namespace UI
{
    [SuppressMessage("Microsoft.Design", "CA1063:ImplementIDisposableCorrectly", Justification = "No unmanaged handles")]
    [ServiceContract(Namespace = "")]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ChronozoomSVC : IDisposable
    {
        private static readonly MemoryCache Cache = new MemoryCache("Storage");

        private static readonly TraceSource Trace = new TraceSource("Service", SourceLevels.All) { Listeners = { Global.SignalRTraceListener } };
        private readonly Storage _storage = new Storage();
        private static MD5 _md5Hasher = MD5.Create();
        private const decimal _minYear = -20000000000;
        private const decimal _maxYear = 9999;

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public IEnumerable<Timeline> Get(string supercollection, string collection, string start, string end, string timespan)
        {
            Trace.TraceInformation("Get Filtered Timelines");

            Guid collectionId = CollectionIdOrDefault(supercollection, collection);

            string timelineCacheKey = string.Format(CultureInfo.InvariantCulture, "Timeline {0}", collectionId);
            if (AllDataRequested(start, end, timespan))
            {
                lock (Cache)
                {
                    if (Cache.Contains(timelineCacheKey))
                    {
                        return (IEnumerable<Timeline>)Cache[timelineCacheKey];
                    }
                }
            }

            // initialize filters
            decimal startTime = string.IsNullOrWhiteSpace(start) ? _minYear : decimal.Parse(start);
            decimal endTime = string.IsNullOrWhiteSpace(end) ? _maxYear : decimal.Parse(end);
            decimal span = string.IsNullOrWhiteSpace(timespan) ? 0 : decimal.Parse(timespan);

            Collection<Timeline> timelines = _storage.TimelinesQuery(collectionId, startTime, endTime, span);

            // cache only when all data is requested
            if (AllDataRequested(start, end, timespan))
            {
                lock (Cache)
                {
                    // Remove Guid.Empty assignment once client supports multiple timelines
                    if (timelines.Any())
                        timelines.FirstOrDefault().Id = Guid.Empty;

                    Trace.TraceInformation("Add Timelines to cache");
                    Cache.Add(timelineCacheKey,
                        timelines,
                        DateTime.Now.AddMinutes(
                            int.Parse(ConfigurationManager.AppSettings["CacheDuration"],
                            CultureInfo.InvariantCulture)));
                }
            }

            return timelines;
        }

        private static bool AllDataRequested(string start, string end, string timespan)
        {
            return string.IsNullOrWhiteSpace(start) && string.IsNullOrWhiteSpace(end) && string.IsNullOrWhiteSpace(timespan);
        }

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public IEnumerable<Threshold> GetThresholds()
        {
            Trace.TraceInformation("Get Thresholds");

            lock (Cache)
            {
                if (!Cache.Contains("Thresholds"))
                {
                    Trace.TraceInformation("Get Thresholds Cache Miss");
                    Cache.Add("Thresholds", _storage.Thresholds.ToList(), DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"], CultureInfo.InvariantCulture)));
                }

                return (List<Threshold>)Cache["Thresholds"];
            }
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public IEnumerable<SearchResult> Search(string supercollection, string collection, string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                Trace.TraceEvent(TraceEventType.Warning, 0, "Search called with null search term");
                return null;
            }

            Guid collectionId = CollectionIdOrDefault(supercollection, collection);
            searchTerm = searchTerm.ToUpperInvariant();

            var timelines = _storage.Timelines.Where(_ => _.Title.ToUpper().Contains(searchTerm) && _.Collection.Id == collectionId).ToList();
            var searchResults = timelines.Select(timeline => new SearchResult { Id = timeline.Id, Title = timeline.Title, ObjectType = ObjectType.Timeline, UniqueId = timeline.UniqueId }).ToList();

            var exhibits = _storage.Exhibits.Where(_ => _.Title.ToUpper().Contains(searchTerm) && _.Collection.Id == collectionId).ToList();
            searchResults.AddRange(exhibits.Select(exhibit => new SearchResult { Id = exhibit.Id, Title = exhibit.Title, ObjectType = ObjectType.Exhibit, UniqueId = exhibit.UniqueId }));

            var contentItems = _storage.ContentItems.Where(_ => 
                (_.Title.ToUpper().Contains(searchTerm) || _.Caption.ToUpper().Contains(searchTerm))
                 && _.Collection.Id == collectionId
                ).ToList();
            searchResults.AddRange(contentItems.Select(contentItem => new SearchResult { Id = contentItem.Id, Title = contentItem.Title, ObjectType = ObjectType.ContentItem, UniqueId = contentItem.UniqueId }));

            Trace.TraceInformation("Search called for search term {0}", searchTerm);
            return searchResults;
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public IEnumerable<Reference> GetBibliography(string exhibitID)
        {
            Guid guid;
            if (!Guid.TryParse(exhibitID, out guid))
            {
                Trace.TraceEvent(TraceEventType.Warning, 0, "GetBibliography called with invalid Id {0}", exhibitID);
                return null;
            }

            var exhibit = _storage.Exhibits.Find(guid);
            if (exhibit == null)
            {
                Trace.TraceEvent(TraceEventType.Warning, 0, "GetBibliography called, no matching exhibit found with Id {0}", exhibitID);
                return null;
            }

            Trace.TraceInformation("GetBibliography called for Exhibit Id {0}", exhibitID);
            _storage.Entry(exhibit).Collection(_ => _.References).Load();
            return exhibit.References.ToList();
        }

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public IEnumerable<Tour> GetTours(string supercollection, string collection)
        {
            Trace.TraceInformation("Get Tours");

            Guid collectionId = CollectionIdOrDefault(supercollection, collection);
            lock (Cache)
            {
                string toursCacheKey = string.Format(CultureInfo.InvariantCulture, "Tour {0}", collectionId);
                if (!Cache.Contains(toursCacheKey))
                {
                    Trace.TraceInformation("Get Tours Cache Miss for collection " + collectionId);
                    var tours = _storage.Tours.Where(candidate => candidate.Collection.Id == collectionId).ToList();
                    foreach (var t in tours)
                    {
                        _storage.Entry(t).Collection(x => x.Bookmarks).Load();
                    }

                    Cache.Add(toursCacheKey, tours, DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"], CultureInfo.InvariantCulture)));
                }

                return (List<Tour>)Cache[toursCacheKey];
            }
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public SuperCollection GetSuperCollection()
        {
            Trace.TraceInformation("Get Collections.");

            // TODO: Implement the "Authentication User Story" and retrieve the right user ID.
            string userId = "TestUser";

            SuperCollection superCollection = _storage.SuperCollections.Where(candidate => candidate.UserId == userId).FirstOrDefault();
            if (superCollection == null)
            {
                // Create the personal supercollection
                superCollection = new SuperCollection();
                superCollection.Title = userId;
                superCollection.Id = CollectionIdFromText(superCollection.Title);
                superCollection.UserId = userId;
                superCollection.Collections = new Collection<Collection>();

                // Create the personal collection
                Collection personalCollection = new Collection();
                personalCollection.Title = userId;
                personalCollection.Id = Guid.NewGuid();
                personalCollection.UserId = userId;

                superCollection.Collections.Add(personalCollection);

                _storage.SuperCollections.Add(superCollection);
                _storage.Collections.Add(personalCollection);
                _storage.SaveChanges();

                Trace.TraceInformation("Personal collection saved.");
            }
            else
            {
                _storage.Entry(superCollection).Collection(_ => _.Collections).Load();
            }

            return superCollection;
        }

        [SuppressMessage("Microsoft.Design", "CA1063:ImplementIDisposableCorrectly", Justification = "No unmanaged handles")]
        public void Dispose()
        {
            _storage.Dispose();

            GC.SuppressFinalize(this);
        }

        private Guid CollectionIdOrDefault(string supercollection, string collection)
        {
            if (string.IsNullOrEmpty(supercollection))
            {
                lock (Cache)
                {
                    string defaultCacheKey = "SuperCollections-Default-Guid";
                    if (!Cache.Contains(defaultCacheKey))
                    {
                        string defaultSuperCollection = ConfigurationManager.AppSettings["DefaultSuperCollection"];
                        SuperCollection superCollection = _storage.SuperCollections.Where(candidate => candidate.Title == defaultSuperCollection).FirstOrDefault();
                        if (superCollection == null)
                            superCollection = _storage.SuperCollections.FirstOrDefault();

                        _storage.Entry(superCollection).Collection(_ => _.Collections).Load();

                        Guid defaultGuid = superCollection.Collections.FirstOrDefault().Id;
                        Cache.Add(defaultCacheKey, defaultGuid, DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"], CultureInfo.InvariantCulture)));
                    }

                    return (Guid)Cache[defaultCacheKey];
                }
            }
            else
            {
                return CollectionIdFromSuperCollection(supercollection, collection);
            }
        }

        private static Guid CollectionIdFromSuperCollection(string supercollection, string collection)
        {
            return CollectionIdFromText(string.Format(
                CultureInfo.InvariantCulture,
                "{0}|{1}",
                supercollection.ToLower(),
                collection.ToLower()));
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