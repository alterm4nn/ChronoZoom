// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Caching;
using System.Security.Cryptography;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using System.Web.Script.Services;
using Chronozoom.Entities;
using System.Runtime.Serialization;

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
        public BaseJsonResult<IEnumerable<Timeline>> Get(string supercollection, string collection, string start, string end, string timespan)
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
                        return new BaseJsonResult<IEnumerable<Timeline>>((IEnumerable<Timeline>)Cache[timelineCacheKey]);
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

            return new BaseJsonResult<IEnumerable<Timeline>>((IEnumerable<Timeline>)timelines);
         }

        private static bool AllDataRequested(string start, string end, string timespan)
        {
            return string.IsNullOrWhiteSpace(start) && string.IsNullOrWhiteSpace(end) && string.IsNullOrWhiteSpace(timespan);
        }

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public BaseJsonResult<List<Threshold>> GetThresholds()
        {
            Trace.TraceInformation("Get Thresholds");

            lock (Cache)
            {
                if (!Cache.Contains("Thresholds"))
                {
                    Trace.TraceInformation("Get Thresholds Cache Miss");
                    Cache.Add("Thresholds", _storage.Thresholds.ToList(), DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"], CultureInfo.InvariantCulture)));
                }

                return new BaseJsonResult<List<Threshold>>((List<Threshold>)Cache["Thresholds"]);
            }
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public BaseJsonResult<IEnumerable<SearchResult>> Search(string supercollection, string collection, string searchTerm)
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

            return new BaseJsonResult<IEnumerable<SearchResult>>((IEnumerable<SearchResult>)searchResults);
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public BaseJsonResult<IEnumerable<Reference>> GetBibliography(string exhibitId)
        {
            Guid guid;
            if (!Guid.TryParse(exhibitId, out guid))
            {
                Trace.TraceEvent(TraceEventType.Warning, 0, "GetBibliography called with invalid Id {0}", exhibitId);
                return null;
            }

            var exhibit = _storage.Exhibits.Find(guid);
            if (exhibit == null)
            {
                Trace.TraceEvent(TraceEventType.Warning, 0, "GetBibliography called, no matching exhibit found with Id {0}", exhibitId);
                return null;
            }

            Trace.TraceInformation("GetBibliography called for Exhibit Id {0}", exhibitId);
            _storage.Entry(exhibit).Collection(_ => _.References).Load();
            return new BaseJsonResult<IEnumerable<Reference>>((IEnumerable<Reference>) exhibit.References.ToList());
        }

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public BaseJsonResult<List<Tour>> GetTours(string supercollection, string collection)
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

                return new BaseJsonResult<List<Tour>>((List<Tour>)Cache[toursCacheKey]);
            }
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public BaseJsonResult<IEnumerable<SuperCollection>> GetSuperCollection()
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

            return new BaseJsonResult<IEnumerable<SuperCollection>>((IEnumerable<SuperCollection>)superCollection);
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

        /// <summary>
        /// If the specified supercollection does not exist the call is considered a bad request.
        /// If collection does not exist then a new collection is created in the supercollection and the
        /// authenticated user is set as the author if no author is already registered.
        ///
        /// If the collection exists in the supercollection and the authenticated user is its author then
        /// the title of the existing collection is modified.
        /// </summary>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}?id={id}&title={title}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public Guid PutCollection(string superCollectionName, string collectionName, string id, string title)
        {
            Trace.TraceInformation("Put Collection");

            string user = "TestUser"; // TODO: Retrieve the correct user
            Guid retval = Guid.Empty;
            Guid superCollectionGuid = CollectionIdFromText(superCollectionName);
            SuperCollection superCollection = _storage.SuperCollections.Find(superCollectionGuid);
            if (superCollection == null)
            {
                // Supercollection does not exist.
                SetStatusCode(HttpStatusCode.BadRequest);
                return retval;
            }

            Guid collectionGuid = CollectionIdFromText(collectionName);
            Collection collection = _storage.Collections.Find(collectionGuid);
            if (collection == null)
            {
                if (superCollection.UserId != user)
                {
                    SetStatusCode(HttpStatusCode.Unauthorized);
                    return retval;
                }

                collection = new Collection {Id = collectionGuid, Title = collectionName, UserId = user};
                _storage.Entry(superCollection).Collection(_ => _.Collections).Load();
                if (superCollection.Collections == null)
                {
                    superCollection.Collections = new System.Collections.ObjectModel.Collection<Chronozoom.Entities.Collection>();
                }
                superCollection.Collections.Add(collection);
                _storage.Collections.Add(collection);
                retval = collectionGuid;
            }
            else
            {
                if (collection.UserId != user)
                {
                    SetStatusCode(HttpStatusCode.Unauthorized);
                    return retval;
                }
 
                collection.Title = title;
            }
            _storage.SaveChanges();
            return retval;
        }

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public void DeleteCollection(string superCollectionName, string collectionName)
        {
            Trace.TraceInformation("Delete Collection");

            string user = "TestUser"; // TODO: Retrieve the correct user

            Guid superCollectionGuid = CollectionIdFromText(superCollectionName);
            SuperCollection superCollection = _storage.SuperCollections.Find(superCollectionGuid);
            if (superCollection == null)
            {
                // Supercollection does not exist.
                SetStatusCode(HttpStatusCode.BadRequest);
                return;
            }

            Guid guid = CollectionIdFromText(collectionName);
            Collection collection = _storage.Collections.Find(guid);
            if (collection == null)
            {
                SetStatusCode(HttpStatusCode.NotFound);
                return;
            }

            if (collection.UserId != user)
            {
                SetStatusCode(HttpStatusCode.Unauthorized);
                return;
            }

            superCollection.Collections.Remove(collection);
            _storage.Collections.Remove(collection);
            _storage.SaveChanges();
        }

        /// <summary>
        /// Creates or updates the timeline in a given collection.
        /// If the collection does not exist, then fail.
        ///
        /// If timeline id is not specified, then add a new timeline to the collection.
        /// For a new timeline, if the parent is not defined, set this to the root timeline.
        /// </summary>
        // If timeline id to be updated does not exist return a not found status.
        // If id is specified and the timeline exists, then the existing timeline is updated.
        //
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/{collectionName}/timeline?id={id}&title={title}&start={start}&" +
                                                 "end={end}&parent={parent}",
                                                 RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public Guid PutTimeline(string collectionName, string id, string title, string start, string end, string parent)
        {
            Trace.TraceInformation("Put Timeline");

            string user = "TestUser"; // TODO: Retrieve the correct user
            Guid retval = Guid.Empty; // TODO: root timeline is currently using Guid.Empty - will that change? Currently all error cases return Guid.Empty

            Guid collectionGuid = CollectionIdFromText(collectionName);
            Collection collection = _storage.Collections.Find(collectionGuid);
            if (collection == null)
            {
                // Collection does not exist
                SetStatusCode(HttpStatusCode.BadRequest);
                return retval;
            }

            // Validate user
            if (collection.UserId != user)
            {
                SetStatusCode(HttpStatusCode.Unauthorized);
                return retval;
            }

            if (id == null)
            {
                Timeline parentTimeline = FindParentTimeline(parent);
                if (parentTimeline == null)
                {
                    SetStatusCode(HttpStatusCode.BadRequest);
                    return retval;
                }

                // Parent timeline is valid - add new timeline
                Guid newTimelineGuid = Guid.NewGuid();
                Timeline newTimeline = new Timeline {Id = newTimelineGuid, Title = title};
                //newTimeline.Title = title;
                newTimeline.FromYear = (start == null) ? 0 : Decimal.Parse(start);
                newTimeline.ToYear = (end == null) ? 0 : Decimal.Parse(end);
                newTimeline.Collection = collection;

                // Update parent timeline.
                _storage.Entry(parentTimeline).Collection(_ => _.ChildTimelines).Load();
                if (parentTimeline.ChildTimelines == null)
                {
                    parentTimeline.ChildTimelines = new System.Collections.ObjectModel.Collection<Timeline>();
                }
                parentTimeline.ChildTimelines.Add(newTimeline);

                _storage.Timelines.Add(newTimeline);
                retval = newTimelineGuid;
            }
            else
            {
                Guid updateTimelineGuid = Guid.Parse(id);
                Timeline updateTimeline = _storage.Timelines.Find(updateTimelineGuid);
                if (updateTimeline == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound);
                    return retval;
                }

                if (parent != null)
                {
                    // Parent timeline updating is currently not supported
                    SetStatusCode(HttpStatusCode.NotImplemented);
                    return retval;
                }

                // Update the timeline fields
                updateTimeline.Title = title;
                updateTimeline.FromYear = start == null ? 0 : Decimal.Parse(start);
                updateTimeline.ToYear = end == null ? 0 : Decimal.Parse(end);
                retval = updateTimelineGuid;
            }
            _storage.SaveChanges();
            return retval;
        }

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{collectionName}/timeline/id={id}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public void DeleteTimeline(string collectionName, string id)
        {
            Trace.TraceInformation("Delete Timeline");

            string user = "TestUser"; // TODO: Retrieve the correct user
            Guid collectionGuid = CollectionIdFromText(collectionName);
            Collection collection = _storage.Collections.Find(collectionGuid);
            if (collection == null)
            {
                SetStatusCode(HttpStatusCode.BadRequest);
                return;
            }

            if (collection.UserId != user)
            {
                SetStatusCode(HttpStatusCode.Unauthorized);
                return;
            }

            if (id == null)
            {
                SetStatusCode(HttpStatusCode.BadRequest);
                return;
            }

            Guid timelineGuid = Guid.Parse(id);
            Timeline deleteTimeline = _storage.Timelines.Find(timelineGuid);
            if (deleteTimeline == null)
            {
                SetStatusCode(HttpStatusCode.NotFound);
                return;
            }

            _storage.Timelines.Remove(deleteTimeline);
            _storage.SaveChanges();
        }

        /// <summary>
        /// Creates or updates the exhibit in a given collection.
        /// If the collection does not exist, then fail.    
        ///
        /// If exhibit id is not specified, then add a new exhibit to the collection.
        /// For a new exhibit, if the parent timeline is not specified it is added to the root timeline.
        /// Otherwise if a valid parent timeline is specifed the new exhibit is added to it.
        /// If an invalid parent timeline is specifed then it is considered a bad request.
        ///
        /// If exhibit id to be updated does not exist return a not found status.
        /// If id is specified and the exhibit exists, then the existing exhibit is updated.
        /// </summary>
       [OperationContract]
       [WebInvoke(Method = "PUT", UriTemplate = "/{collectionName}/exhibit?id={id}&parent={parent}&title={title}&time={time}",
                                                RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
       public Guid PutExhibit(string collectionName, string id, string parent, string title, string time)
       {
           Trace.TraceInformation("Put Exhibit");

           string user = "TestUser"; // TODO: Retrieve the correct user
           Guid retval = Guid.Empty;
           Guid collectionGuid = CollectionIdFromText(collectionName);
           Collection collection = _storage.Collections.Find(collectionGuid);
           if (collection == null)
           {
               // Collection does not exist
               SetStatusCode(HttpStatusCode.BadRequest);
               return retval;
           }

            // Validate user
            if (collection.UserId != user)
            {
                SetStatusCode(HttpStatusCode.Unauthorized);
                return retval;
            }

            if (id == null)
            {
                Timeline parentTimeline = FindParentTimeline(parent);
                if (parentTimeline == null)
                {
                    SetStatusCode(HttpStatusCode.BadRequest);
                    return retval;
                }

                // Parent timeline is valid - add new exhibit
                Guid newExhibitGuid = Guid.NewGuid();
                Exhibit newExhibit = new Exhibit { Id = newExhibitGuid };
                newExhibit.Title = title;
                newExhibit.Year = (time == null) ? 0 : Decimal.Parse(time);
                newExhibit.Collection = collection;

                // Update parent timeline.
                _storage.Entry(parentTimeline).Collection(_ => _.Exhibits).Load();
                if (parentTimeline.Exhibits == null)
                {
                    parentTimeline.Exhibits = new System.Collections.ObjectModel.Collection<Exhibit>();
                }
                parentTimeline.Exhibits.Add(newExhibit);

                _storage.Exhibits.Add(newExhibit);
                retval = newExhibitGuid;
            }
            else
            {
                Guid updateExhibitGuid = Guid.Parse(id);
                Exhibit updateExhibit = _storage.Exhibits.Find(updateExhibitGuid);
                if (updateExhibit == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound);
                    return retval;
                }

                if (parent != null)
                {
                    // Parent timeline updating is currently not supported
                    SetStatusCode(HttpStatusCode.NotImplemented);
                    return retval;
                }

                // Update the exhibit fields
                updateExhibit.Title = title;
                updateExhibit.Year = (time == null) ? 0 : Decimal.Parse(time);
                retval = updateExhibitGuid;
            }
            _storage.SaveChanges();
            return retval;
        }

       [OperationContract]
       [WebInvoke(Method = "DELETE", UriTemplate = "/{collectionName}/exhibit/id={id}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
       public void DeleteExhibit(string collectionName, string id)
       {
            Trace.TraceInformation("Delete Exhibit");

            string user = "TestUser"; // TODO: Retrieve the correct user

            Guid collectionGuid = CollectionIdFromText(collectionName);
            Collection collection = _storage.Collections.Find(collectionGuid);
            if (collection == null)
            {
                SetStatusCode(HttpStatusCode.BadRequest);
                return;
            }

            if (collection.UserId != user)
            {
                SetStatusCode(HttpStatusCode.Unauthorized);
                return;
            }

            if (id == null)
            {
                SetStatusCode(HttpStatusCode.BadRequest);
                return;
            }

            Guid exhibitGuid = Guid.Parse(id);
            Exhibit deleteExhibit = _storage.Exhibits.Find(exhibitGuid);
            if (deleteExhibit == null)
            {
                SetStatusCode(HttpStatusCode.NotFound);
                return;
            }
            _storage.Exhibits.Remove(deleteExhibit);
            _storage.SaveChanges();
        }

        /// <summary>
        /// Creates or updates the content item in a given collection.
        /// If the collection does not exist, then fail.    
        ///
        /// If the content item id is not specified, then add a new content item is added to the parent exhibit.
        /// For a new content item, if the parent exhibit is not specified then fail.
        /// Otherwise if a valid parent exhibit is specifed the new content item is added to it.
        /// If an invalid parent exhibit is specifed then it is considered a bad request.
        ///
        /// If the content item id to be updated does not exist return a not found status.
        /// If id is specified and the content item exists, then the existing content item is updated.
        /// </summary>
       [OperationContract]
       [WebInvoke(Method = "PUT", UriTemplate = "/{collectionName}/contentitem?id={id}&parent={parent}&title={title}",
                                                RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
       public Guid PutContentItem(string collectionName, string id, string parent, string title)
       {
           Trace.TraceInformation("Put Content Item");

           string user = "TestUser"; // TODO: Retrieve the correct user
           Guid collectionGuid = CollectionIdFromText(collectionName);
           Collection collection = _storage.Collections.Find(collectionGuid);
           Guid retval = Guid.Empty;
           if (collection == null)
           {
               // Collection does not exist
               SetStatusCode(HttpStatusCode.BadRequest);
               return retval;
           }

            // Validate user
            if (collection.UserId != user)
            {
                SetStatusCode(HttpStatusCode.Unauthorized);
                return retval;
            }

            if (id == null)
            {
                Exhibit parentExhibit = FindParentExhibit(parent);
                if (parentExhibit == null)
                {
                    SetStatusCode(HttpStatusCode.BadRequest);
                    return retval;
                }

                // Parent content item is valid - add new content item
                Guid newContentItemGuid = Guid.NewGuid();
                ContentItem newContentItem = new ContentItem { Id = newContentItemGuid, Title = title };
                newContentItem.Collection = collection;

                // Update parent exhibit.
                _storage.Entry(parentExhibit).Collection(_ => _.ContentItems).Load();
                if (parentExhibit.ContentItems == null)
                {
                    parentExhibit.ContentItems = new System.Collections.ObjectModel.Collection<ContentItem>();
                }
                parentExhibit.ContentItems.Add(newContentItem);
                _storage.ContentItems.Add(newContentItem);
                retval = newContentItemGuid;
            }
            else
            {
                Guid updateContentItemGuid = Guid.Parse(id);
                ContentItem updateContentItem = _storage.ContentItems.Find(updateContentItemGuid);
                if (updateContentItem == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound);
                    return retval;
                }

                if (parent != null)
                {
                    // Parent exhibit updating is currently not supported
                    SetStatusCode(HttpStatusCode.NotImplemented);
                    return retval;
                }

                // Update the content item fields
                updateContentItem.Title = title;
                retval = updateContentItemGuid;
            }
           _storage.SaveChanges();
           return retval;
       }

       [OperationContract]
       [WebInvoke(Method = "DELETE", UriTemplate = "/{collectionName}/contentitem/id={id}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
       public void DeleteContentItem(string collectionName, string id)
       {
           Trace.TraceInformation("Delete Content Item");

           string user = "TestUser"; // TODO: Retrieve the correct user
           Guid collectionGuid = CollectionIdFromText(collectionName);
           Collection collection = _storage.Collections.Find(collectionGuid);
           if (collection == null)
           {
               SetStatusCode(HttpStatusCode.BadRequest);
               return;
           }

           if (collection.UserId != user)
           {
               SetStatusCode(HttpStatusCode.Unauthorized);
               return;
           }

            if (id == null)
            {
                SetStatusCode(HttpStatusCode.BadRequest);
                return;
            }

            Guid contentItemGuid = Guid.Parse(id);
            ContentItem deleteContentItem = _storage.ContentItems.Find(contentItemGuid);
            if (deleteContentItem == null)
            {
                SetStatusCode(HttpStatusCode.NotFound);
                return;
            }
            _storage.ContentItems.Remove(deleteContentItem);
            _storage.SaveChanges();
       }

       private Timeline FindParentTimeline(string parentTimelineId)
       {
           // Validate parent timeline
           Guid parentTimelineGuid = parentTimelineId == null ? Guid.Empty : Guid.Parse(parentTimelineId);

           Timeline parentTimeline = _storage.Timelines.Find(parentTimelineGuid);
           if (parentTimeline == null)
           {
               // Parent id is not found so no timeline will be added
               SetStatusCode(HttpStatusCode.NotImplemented);
           }
           return parentTimeline;
       }

       private Exhibit FindParentExhibit(string parentExhibitId)
       {
           // Validate parent exhibit timeline
           Guid parentExhibitGuid = parentExhibitId == null ? Guid.Empty : Guid.Parse(parentExhibitId);

           Exhibit parentExhibit = _storage.Exhibits.Find(parentExhibitGuid);
           if (parentExhibit == null)
           {
               // Parent exhibit id is not found so no exhibit will be added
               SetStatusCode(HttpStatusCode.NotImplemented);
           }
           return parentExhibit;
       }

        private static void SetStatusCode(HttpStatusCode status)
        {
            if (WebOperationContext.Current != null)
            {
                WebOperationContext.Current.OutgoingResponse.StatusCode = status;
            }
        }

        [DataContract]
        public class BaseJsonResult<T>
        {
            public BaseJsonResult(T data)
            {
                d = data;
            }

            [DataMember]
            public T d { get; set; }
        }
    }
}
