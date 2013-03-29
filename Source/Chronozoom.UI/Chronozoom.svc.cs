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
using System.Net.Http;
using System.Runtime.Caching;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Security.Cryptography;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using System.Web.Script.Services;
using Chronozoom.Entities;
using Newtonsoft.Json;

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
        private const decimal _minYear = -13700000000;
        private const decimal _maxYear = 9999;

        // error code descriptions
        private static class ErrorDescription
        {
            public const string RequestBodyEmpty = "Request body empty";
            public const string UnauthorizedUser = "Unauthorized User";
            public const string CollectionNotFound = "Collection not found";
            public const string ParentTimelineNotFound = "Parent timeline not found";
            public const string TimelineNotFound = "Timeline not found";
            public const string ParentTimelineUpdate = "Parent timeline update not allowed";
            public const string TimelineNull = "Timeline cannot be null";
            public const string ExhibitNotFound = "Exhibit not found";
            public const string ContentItemNotFound = "Content item not found";
            public const string ParentExhibitNotFound = "Parent exhibit not found";
        }

        [OperationContract]
        [Obsolete]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public BaseJsonResult<IEnumerable<Timeline>> Get(string supercollection, string collection)
        {
            Trace.TraceInformation("Get Timelines");

            Guid collectionId = CollectionIdOrDefault(supercollection, collection);

            string timelineCacheKey = string.Format(CultureInfo.InvariantCulture, "Timeline {0}", collectionId);
            lock (Cache)
            {
                if (Cache.Contains(timelineCacheKey))
                {
                    return new BaseJsonResult<IEnumerable<Timeline>>((IEnumerable<Timeline>)Cache[timelineCacheKey]);
                }

                Collection<Timeline> timelines = _storage.TimelinesQuery(collectionId, _minYear, _maxYear, 0, null);

                // Remove Guid.Empty assignment once client supports multiple timelines
                if (timelines.Any())
                    timelines.FirstOrDefault().Id = Guid.Empty;

                Trace.TraceInformation("Add Timelines to cache");
                Cache.Add(timelineCacheKey,
                    timelines,
                    DateTime.Now.AddMinutes(
                        int.Parse(ConfigurationManager.AppSettings["CacheDuration"],
                        CultureInfo.InvariantCulture)));

                return new BaseJsonResult<IEnumerable<Timeline>>(timelines);
            }
         }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public Timeline GetTimelines(string supercollection, string collection, string start, string end, string minspan, string lca)
        {
            Trace.TraceInformation("Get Filtered Timelines");

            Guid collectionId = CollectionIdOrDefault(supercollection, collection);

            // initialize filters
            decimal startTime = string.IsNullOrWhiteSpace(start) ? _minYear : decimal.Parse(start);
            decimal endTime = string.IsNullOrWhiteSpace(end) ? _maxYear : decimal.Parse(end);
            decimal span = string.IsNullOrWhiteSpace(minspan) ? 0 : decimal.Parse(minspan);
            Guid lcaParsed = string.IsNullOrWhiteSpace(lca) ? Guid.Empty : Guid.Parse(lca);

            Collection<Timeline> timelines = _storage.TimelinesQuery(collectionId, startTime, endTime, span, lcaParsed);
            Timeline timeline = timelines.Where(candidate => candidate.Id == lcaParsed).FirstOrDefault();

            return timeline;
        }

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public BaseJsonResult<IEnumerable<Threshold>> GetThresholds()
        {
            Trace.TraceInformation("Get Thresholds");

            lock (Cache)
            {
                if (!Cache.Contains("Thresholds"))
                {
                    Trace.TraceInformation("Get Thresholds Cache Miss");
                    Cache.Add("Thresholds", _storage.Thresholds.ToList(), DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"], CultureInfo.InvariantCulture)));
                }

                return new BaseJsonResult<IEnumerable<Threshold>>((List<Threshold>)Cache["Thresholds"]);
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
            return new BaseJsonResult<IEnumerable<SearchResult>>(searchResults);
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
            return new BaseJsonResult<IEnumerable<Reference>>(exhibit.References.ToList());
        }

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public BaseJsonResult<IEnumerable<Tour>> GetTours(string supercollection, string collection)
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

                return new BaseJsonResult<IEnumerable<Tour>>((List<Tour>)Cache[toursCacheKey]);
            }
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public BaseJsonResult<SuperCollection> GetSuperCollection()
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

            return new BaseJsonResult<SuperCollection>(superCollection);
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
        /// If collection does not exist then a new collection is created the
        /// authenticated user is set as the author if no author is already registered.
        ///
        /// If the collection exists and the authenticated user is its author then
        /// the title of the existing collection is modified.
        /// </summary>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/{collectionName}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public Guid PutCollectionName(string collectionName, Collection collectionRequest)
        {
            string user = "TestUser"; // TODO: Retrieve the correct user
            Trace.TraceInformation("Put Collection {0} from user {1}", collectionName, user);

            Guid retval = Guid.Empty;

            if (collectionRequest == null)
            {
                SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                return retval;
            }

            Guid collectionGuid = CollectionIdFromText(collectionName);
            Collection collection = _storage.Collections.Find(collectionGuid);
            if (collection == null)
            {
                collection = new Collection { Id = collectionGuid, Title = collectionName, UserId = user };
                _storage.Collections.Add(collection);
                retval = collectionGuid;
            }
            else
            {
                if (collection.UserId != user)
                {
                    SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                    return retval;
                }

                collection.Title = collectionRequest.Title;
            }
            _storage.SaveChanges();
            return retval;
        }

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/collectionName", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public void DeleteCollection(Collection collectionRequest)
        {
            string user = "TestUser"; // TODO: Retrieve the correct user

            if (collectionRequest == null)
            {
                SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                return;
            }

            Trace.TraceInformation("Delete Collection {0} from user {1}", collectionRequest.Title, user);

            Guid guid = CollectionIdFromText(collectionRequest.Title);
            Collection collection = _storage.Collections.Find(guid);
            if (collection == null)
            {
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                return;
            }

            if (collection.UserId != user)
            {
                SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                return;
            }

            _storage.Collections.Remove(collection);
            _storage.SaveChanges();
        }

        public class TimelineRequest
        {
            public string Id { get; set; }
            public string Title { get; set; }
            public string FromYear { get; set; }
            public string ToYear { get; set; }
            public string ParentTimelineId { get; set; }
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
        [WebInvoke(Method = "PUT", UriTemplate = "/{collectionName}/timeline", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public Guid PutTimeline(string collectionName, TimelineRequest timelineRequest)
        {
            Trace.TraceInformation("Put Timeline");
            string user = "TestUser"; // TODO: Retrieve the correct user
            Guid retval = Guid.Empty; // TODO: root timeline is currently using Guid.Empty - will that change? Currently all error cases return Guid.Empty

            if (timelineRequest == null)
            {
                SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                return retval;
            }

            Guid collectionGuid = CollectionIdFromText(collectionName);
            Collection collection = _storage.Collections.Find(collectionGuid);
            if (collection == null)
            {
                // Collection does not exist
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                return retval;
            }

            // Validate user
            if (collection.UserId != user)
            {
                SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                return retval;
            }

            if (timelineRequest.Id == null)
            {
                Timeline parentTimeline = FindParentTimeline(timelineRequest.ParentTimelineId);
                if (parentTimeline == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ParentTimelineNotFound);
                    return retval;
                }

                // Parent timeline is valid - add new timeline
                Guid newTimelineGuid = Guid.NewGuid();
                Timeline newTimeline = new Timeline { Id = newTimelineGuid, Title = timelineRequest.Title };
                //newTimeline.Title = title;
                newTimeline.FromYear = (timelineRequest.FromYear == null) ? 0 : Decimal.Parse(timelineRequest.FromYear);
                newTimeline.ToYear = (timelineRequest.ToYear == null) ? 0 : Decimal.Parse(timelineRequest.ToYear);
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
                Guid updateTimelineGuid = Guid.Parse(timelineRequest.Id);
                Timeline updateTimeline = _storage.Timelines.Find(updateTimelineGuid);
                if (updateTimeline == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TimelineNotFound);
                    return retval;
                }

                if (timelineRequest.ParentTimelineId != null)
                {
                    // Parent timeline updating is currently not supported
                    SetStatusCode(HttpStatusCode.NotImplemented, ErrorDescription.ParentTimelineUpdate);
                    return retval;
                }

                // Update the timeline fields
                updateTimeline.Title = timelineRequest.Title;
                updateTimeline.FromYear = timelineRequest.FromYear == null ? 0 : Decimal.Parse(timelineRequest.FromYear);
                updateTimeline.ToYear = timelineRequest.ToYear == null ? 0 : Decimal.Parse(timelineRequest.ToYear);
                retval = updateTimelineGuid;
            }
            _storage.SaveChanges();
            return retval;
        }

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{collectionName}/timeline", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public void DeleteTimeline(string collectionName, TimelineRequest timelineRequest)
        {
            Trace.TraceInformation("Delete Timeline");

            if (timelineRequest == null)
            {
                SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                return;
            }

            string user = "TestUser"; // TODO: Retrieve the correct user
            Guid collectionGuid = CollectionIdFromText(collectionName);
            Collection collection = _storage.Collections.Find(collectionGuid);
            if (collection == null)
            {
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                return;
            }

            if (collection.UserId != user)
            {
                SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                return;
            }

            if (timelineRequest.Id == null)
            {
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TimelineNull);
                return;
            }

            Guid timelineGuid = Guid.Parse(timelineRequest.Id);
            Timeline deleteTimeline = _storage.Timelines.Find(timelineGuid);
            if (deleteTimeline == null)
            {
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TimelineNotFound);
                return;
            }

            _storage.Timelines.Remove(deleteTimeline);
            _storage.SaveChanges();
        }


        public class ExhibitRequest
        {
            public string Id { get; set; }
            public string Title { get; set; }
            public string ParentTimelineId { get; set; }
            public string Year { get; set; }
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
        [WebInvoke(Method = "PUT", UriTemplate = "/{collectionName}/exhibit", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public Guid PutExhibit(string collectionName, ExhibitRequest exhibitRequest)
        {
            Trace.TraceInformation("Put Exhibit");
            Guid retval = Guid.Empty;

            if (exhibitRequest == null)
            {
                SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                return retval;
            }

            string user = "TestUser"; // TODO: Retrieve the correct user
            Guid collectionGuid = CollectionIdFromText(collectionName);
            Collection collection = _storage.Collections.Find(collectionGuid);
            if (collection == null)
            {
                // Collection does not exist
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                return retval;
            }

            // Validate user
            if (collection.UserId != user)
            {
                SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                return retval;
            }

            if (exhibitRequest.Id == null)
            {
                Timeline parentTimeline = FindParentTimeline(exhibitRequest.ParentTimelineId);
                if (parentTimeline == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ParentTimelineNotFound);
                    return retval;
                }

                // Parent timeline is valid - add new exhibit
                Guid newExhibitGuid = Guid.NewGuid();
                Exhibit newExhibit = new Exhibit { Id = newExhibitGuid };
                newExhibit.Title = exhibitRequest.Title;
                newExhibit.Year = (exhibitRequest.Year == null) ? 0 : Decimal.Parse(exhibitRequest.Year);
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
                Guid updateExhibitGuid = Guid.Parse(exhibitRequest.Id);
                Exhibit updateExhibit = _storage.Exhibits.Find(updateExhibitGuid);
                if (updateExhibit == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ExhibitNotFound);
                    return retval;
                }

                if (exhibitRequest.ParentTimelineId != null)
                {
                    // Parent timeline updating is currently not supported
                    SetStatusCode(HttpStatusCode.NotImplemented, ErrorDescription.ParentTimelineUpdate);
                    return retval;
                }

                // Update the exhibit fields
                updateExhibit.Title = exhibitRequest.Title;
                updateExhibit.Year = (exhibitRequest.Year == null) ? 0 : Decimal.Parse(exhibitRequest.Year);
                retval = updateExhibitGuid;
            }
            _storage.SaveChanges();
            return retval;
        }

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{collectionName}/exhibit", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public void DeleteExhibit(string collectionName, ExhibitRequest exhibitRequest)
        {
            Trace.TraceInformation("Delete Exhibit");

            string user = "TestUser"; // TODO: Retrieve the correct user

            if (exhibitRequest == null)
            {
                SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                return;
            }

            Guid collectionGuid = CollectionIdFromText(collectionName);
            Collection collection = _storage.Collections.Find(collectionGuid);
            if (collection == null)
            {
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                return;
            }

            if (collection.UserId != user)
            {
                SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                return;
            }

            if (exhibitRequest.Id == null)
            {
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ExhibitNotFound);
                return;
            }

            Guid exhibitGuid = Guid.Parse(exhibitRequest.Id);
            Exhibit deleteExhibit = _storage.Exhibits.Find(exhibitGuid);
            if (deleteExhibit == null)
            {
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ExhibitNotFound);
                return;
            }
            _storage.Exhibits.Remove(deleteExhibit);
            _storage.SaveChanges();
        }

        public class ContentItemRequest
        {
            public string Id { get; set; }
            public string Title { get; set; }
            public string Caption { get; set; }
            public string MediaType { get; set; }
            public string Uri { get; set; }
            public string ParentExhibitId { get; set; }
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
        [WebInvoke(Method = "PUT", UriTemplate = "/{collectionName}/contentitem", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public Guid PutContentItem(string collectionName, ContentItemRequest contentItemRequest)
        {
            Trace.TraceInformation("Put Content Item");

            Guid retval = Guid.Empty;

            if (contentItemRequest == null)
            {
                SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                return retval;
            }

            string user = "TestUser"; // TODO: Retrieve the correct user
            Guid collectionGuid = CollectionIdFromText(collectionName);
            Collection collection = _storage.Collections.Find(collectionGuid);

            if (collection == null)
            {
                // Collection does not exist
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                return retval;
            }

            // Validate user
            if (collection.UserId != user)
            {
                SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                return retval;
            }

            if (contentItemRequest.Id == null)
            {
                Exhibit parentExhibit = FindParentExhibit(contentItemRequest.ParentExhibitId);
                if (parentExhibit == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ParentTimelineNotFound);
                    return retval;
                }

                // Parent content item is valid - add new content item
                Guid newContentItemGuid = Guid.NewGuid();
                ContentItem newContentItem = new ContentItem
                    {
                        Id = newContentItemGuid,
                        Title = contentItemRequest.Title,
                        Caption = contentItemRequest.Caption,
                        MediaType = contentItemRequest.MediaType,
                        Uri = contentItemRequest.Uri
                    };
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
                Guid updateContentItemGuid = Guid.Parse(contentItemRequest.Id);
                ContentItem updateContentItem = _storage.ContentItems.Find(updateContentItemGuid);
                if (updateContentItem == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ContentItemNotFound);
                    return retval;
                }

                if (contentItemRequest.ParentExhibitId != null)
                {
                    // Parent exhibit updating is currently not supported
                    SetStatusCode(HttpStatusCode.NotImplemented, ErrorDescription.ParentTimelineUpdate);
                    return retval;
                }

                // Update the content item fields
                updateContentItem.Title = contentItemRequest.Title;
                updateContentItem.Caption = contentItemRequest.Caption;
                updateContentItem.MediaType = contentItemRequest.MediaType;
                updateContentItem.Uri = contentItemRequest.Uri;
                retval = updateContentItemGuid;
            }
            _storage.SaveChanges();
            return retval;
        }

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{collectionName}/contentitem", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public void DeleteContentItem(string collectionName, ContentItemRequest contentItemRequest)
        {
            Trace.TraceInformation("Delete Content Item");

            if (contentItemRequest == null)
            {
                SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                return;
            }

            string user = "TestUser"; // TODO: Retrieve the correct user
            Guid collectionGuid = CollectionIdFromText(collectionName);
            Collection collection = _storage.Collections.Find(collectionGuid);
            if (collection == null)
            {
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                return;
            }

            if (collection.UserId != user)
            {
                SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                return;
            }

            if (contentItemRequest.Id == null)
            {
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ContentItemNotFound);
                return;
            }

            Guid contentItemGuid = Guid.Parse(contentItemRequest.Id);
            ContentItem deleteContentItem = _storage.ContentItems.Find(contentItemGuid);
            if (deleteContentItem == null)
            {
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ContentItemNotFound);
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
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ParentTimelineNotFound);
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
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ParentExhibitNotFound);
            }
            return parentExhibit;
        }

        private static void SetStatusCode(HttpStatusCode status, string errorDescription)
        {
            if (WebOperationContext.Current != null)
            {
                WebOperationContext.Current.OutgoingResponse.StatusCode = status;
                WebOperationContext.Current.OutgoingResponse.StatusDescription = errorDescription;
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