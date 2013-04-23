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
using System.Web;
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
        private const string _defaultUserCollectionName = "default";
        private const string _defaultUserName = "anonymous";
        private const string _sandboxSuperCollectionName = "Sandbox";
        private const string _sandboxCollectionName = "Sandbox";
        
        // The default number of max elements returned by the API
        private static Lazy<int> _maxElements = new Lazy<int>(() =>
        {
            string maxElements = ConfigurationManager.AppSettings["MaxElementsDefault"];

            return string.IsNullOrEmpty(maxElements) ? 2000 : int.Parse(maxElements);
        });


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
            public const string Unauthenticated = "User is not authenticated";
            public const string MissingClaim = "User missing expected claim";
            public const string ParentExhibitNonEmpty = "Parent exhibit should not be specified";
            public const string CollectionIdMismatch = "Collection id mismatch";
            public const string UserNotFound = "User not found";
            public const string SandboxSuperCollectionNotFound = "Default sandbox supercollection not found";
            public const string DefaultUserNotFound = "Default anonymous user not found";
            public const string SuperCollectionNotFound = "SuperCollection not found";
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public Timeline GetTimelines(string supercollection, string collection, string start, string end, string minspan, string lca, string maxElements)
        {
            return AuthenticatedOperation(delegate(User user)
            {
                Trace.TraceInformation("Get Filtered Timelines");

                Guid collectionId = CollectionIdOrDefault(supercollection, collection);

                // If available, retrieve from cache.
                if (CanCacheGetTimelines(user, collectionId))
                {
                    Timeline cachedTimeline = GetCachedGetTimelines(collectionId, start, end, minspan, lca, maxElements);
                    if (cachedTimeline != null)
                    {
                        return cachedTimeline;
                    }
                }

                // initialize filters
                decimal startTime = string.IsNullOrWhiteSpace(start) ? _minYear : decimal.Parse(start, CultureInfo.InvariantCulture);
                decimal endTime = string.IsNullOrWhiteSpace(end) ? _maxYear : decimal.Parse(end, CultureInfo.InvariantCulture);
                decimal span = string.IsNullOrWhiteSpace(minspan) ? 0 : decimal.Parse(minspan, CultureInfo.InvariantCulture);
                Guid? lcaParsed = string.IsNullOrWhiteSpace(lca) ? (Guid?)null : Guid.Parse(lca);
                int maxElementsParsed = string.IsNullOrWhiteSpace(maxElements) ? _maxElements.Value : int.Parse(maxElements);

                Collection<Timeline> timelines = _storage.TimelinesQuery(collectionId, startTime, endTime, span, lcaParsed, maxElementsParsed);
                Timeline timeline = timelines.Where(candidate => candidate.Id == lcaParsed).FirstOrDefault();

                if (timeline == null)
                    timeline = timelines.FirstOrDefault();

                CacheGetTimelines(timeline, collectionId, start, end, minspan, lca, maxElements);

                return timeline;
            });
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
            var searchResults = timelines.Select(timeline => new SearchResult { Id = timeline.Id, Title = timeline.Title, ObjectType = ObjectType.Timeline }).ToList();

            var exhibits = _storage.Exhibits.Where(_ => _.Title.ToUpper().Contains(searchTerm) && _.Collection.Id == collectionId).ToList();
            searchResults.AddRange(exhibits.Select(exhibit => new SearchResult { Id = exhibit.Id, Title = exhibit.Title, ObjectType = ObjectType.Exhibit }));

            var contentItems = _storage.ContentItems.Where(_ => 
                (_.Title.ToUpper().Contains(searchTerm) || _.Caption.ToUpper().Contains(searchTerm))
                 && _.Collection.Id == collectionId
                ).ToList();
            searchResults.AddRange(contentItems.Select(contentItem => new SearchResult { Id = contentItem.Id, Title = contentItem.Title, ObjectType = ObjectType.ContentItem }));

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

        /// <summary>
        /// Creates or updates user information and the user's associated personal collection.
        ///
        /// If the user id is not specified, then this is a new user. For a new user
        /// the following will be done:
        /// - if there is no ACS treat as an anonymous user who can access the Sandbox collection
        /// - if the anonymous user does not exist in the db then it is created
        /// - add a new supercollection with the user's display name
        /// - add a new default collection to this supercollection with user's display name
        /// - create a new user  with the specified attributes
        ///
        /// If the user display name is specified and it does not exisit it is considered an error.
        /// If the user display name is specified and it exists then the user's attributes are updated.
        ///
        /// </summary>
        /// <returns>The URL for the new user collection.</returns>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/user", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public String PutUser(User userRequest)
        {
            return AuthenticatedOperation<String>(delegate(User user)
            {
                Trace.TraceInformation("Put User");

                if (userRequest == null)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                    return string.Empty;
                }

                Uri collectionUri, uriRequest;

                if (user == null)
                {
                    // No ACS so treat as an anonymous user who can access the sandbox collection.
                    // If anonymous user does not already exist create the user.
                    user = _storage.Users.Where(candidate => candidate.NameIdentifier == null).FirstOrDefault();
                    if (user == null)
                    {
                        user = new User { Id = Guid.NewGuid(), DisplayName = _defaultUserName };
                        _storage.Users.Add(user);
                        _storage.SaveChanges();
                    }

                    collectionUri = UpdatePersonalCollection(user.NameIdentifier, userRequest);
                    uriRequest = System.ServiceModel.OperationContext.Current.RequestContext.RequestMessage.Headers.To;
                    return new Uri(new Uri(uriRequest.GetLeftPart(UriPartial.Authority)), collectionUri.ToString()).ToString();
                }

                User updateUser = _storage.Users.Where(candidate => candidate.DisplayName == userRequest.DisplayName).FirstOrDefault();
                if (userRequest.Id == Guid.Empty && updateUser == null)
                {
                    // Add new user
                    User newUser = new User { Id = Guid.NewGuid(), DisplayName = userRequest.DisplayName, Email = userRequest.Email };
                    newUser.NameIdentifier = user.NameIdentifier;
                    newUser.IdentityProvider = user.IdentityProvider;
                    collectionUri = UpdatePersonalCollection(userRequest.NameIdentifier, newUser);
                }
                else
                {
                    if (updateUser == null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.UserNotFound);
                        return String.Empty;
                    }

                    updateUser.Email = userRequest.Email;
                    collectionUri = UpdatePersonalCollection(updateUser.NameIdentifier, updateUser);
                    _storage.SaveChanges();
                }

                uriRequest = System.ServiceModel.OperationContext.Current.RequestContext.RequestMessage.Headers.To;
                return new Uri(new Uri(uriRequest.GetLeftPart(UriPartial.Authority)), collectionUri.ToString()).ToString();
            });
        }

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/user", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public void DeleteUser(User userRequest)
        {
            AuthenticatedOperation(delegate(User user)
            {
                Trace.TraceInformation("Delete User");
                if (userRequest == null)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                    return;
                }

                if (user == null)
                {
                    // No ACS so treat as an anonymous user who cannot delete anything.
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.UnauthorizedUser);
                    return;
                }

                User deleteUser = _storage.Users.Where(candidate => candidate.DisplayName == userRequest.DisplayName).FirstOrDefault();
                if (deleteUser == null)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.UserNotFound);
                    return;
                }

                if (user.NameIdentifier != deleteUser.NameIdentifier)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.UnauthorizedUser);
                    return;
                }

                DeleteCollection(userRequest.DisplayName, userRequest.DisplayName);
                DeleteSuperCollection(userRequest.DisplayName);
                _storage.Users.Remove(deleteUser);
                _storage.SaveChanges();
                return;
            });
        }

        private void DeleteSuperCollection(string superCollectionName)
        {
            AuthenticatedOperation(delegate(User user)
            {
                Trace.TraceInformation("Delete SuperCollection {0} from user {1} ", superCollectionName, user);

                Guid superCollectionId = CollectionIdFromText(superCollectionName);
                SuperCollection superCollection = _storage.SuperCollections.Find(superCollectionId);
                if (superCollection == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.SuperCollectionNotFound);
                    return;
                }

                if (user == null || superCollection.User.NameIdentifier != user.NameIdentifier)
                {
                    SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                    return;
                }

                _storage.SuperCollections.Remove(superCollection);
                _storage.SaveChanges();
            });
        }
        private Uri UpdatePersonalCollection(string userId, User user)
        {
            if (string.IsNullOrEmpty(userId))
            {
                // Anonymous user so use the sandbox supercollection and collection
                SuperCollection sandboxSuperCollection = _storage.SuperCollections.Where(candidate => candidate.Title == _sandboxSuperCollectionName).FirstOrDefault();
                if (sandboxSuperCollection == null)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.SandboxSuperCollectionNotFound);
                    return new Uri(string.Format(
                        CultureInfo.InvariantCulture,
                        @"{0}\{1}\",
                        String.Empty,
                        String.Empty), UriKind.Relative);
                }
                else
                {
                    return new Uri(string.Format(
                        CultureInfo.InvariantCulture,
                        @"{0}\{1}\",
                        FriendlyUrlReplacements(sandboxSuperCollection.Title),
                        _sandboxCollectionName), UriKind.Relative);
                }
            }

            SuperCollection superCollection = _storage.SuperCollections.Where(candidate => candidate.User.NameIdentifier == user.NameIdentifier).FirstOrDefault();
            if (superCollection == null)
            {
                // Create the personal supercollection
                superCollection = new SuperCollection();
                superCollection.Title = user.DisplayName;
                superCollection.Id = CollectionIdFromText(user.DisplayName);
                superCollection.User = user;
                superCollection.Collections = new Collection<Collection>();

                // Create the personal collection
                Collection personalCollection = new Collection();
                personalCollection.Title = user.DisplayName;
                personalCollection.Id = CollectionIdFromSuperCollection(superCollection.Title, personalCollection.Title);
                personalCollection.User = user;

                superCollection.Collections.Add(personalCollection);

                _storage.SuperCollections.Add(superCollection);
                _storage.Collections.Add(personalCollection);
                _storage.SaveChanges();

                Trace.TraceInformation("Personal collection saved.");
            }

            return new Uri(string.Format(
                CultureInfo.InvariantCulture,
                @"{0}\{1}\",
                FriendlyUrlReplacements(superCollection.Title),
                FriendlyUrlReplacements(superCollection.Title)), UriKind.Relative);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        ~ChronozoomSVC() 
        {
            // Finalizer calls Dispose(false)
            Dispose(false);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                // Free managed resources
                if (_storage != null)
                {
                    _storage.Dispose();
                }
            }
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
        
        /// <summary>
        /// Replace with URL friendly representations. For instance, converts space to '-'.
        /// </summary>
        private static string FriendlyUrlReplacements(string value)
        {
            return Uri.EscapeDataString(value.Replace(' ', '-'));
        }

        private static Guid CollectionIdFromText(string value)
        {
            // Replace with URL friendly representations
            value = value.Replace(' ', '-');

            byte[] data = null;
            lock (_md5Hasher)
            {
                data = _md5Hasher.ComputeHash(Encoding.Default.GetBytes(value.ToLowerInvariant()));
            }

            return new Guid(data);
        }


        /// <summary>
        /// If collection does not exist then a new collection is created the
        /// authenticated user is set as the author if no author is already registered.
        ///
        /// If the collection exists and the authenticated user is its author then
        /// the collection is modified.
        /// 
        /// The title field can't be modified since it's part of the URL and the URL is indexable by 3rd parties.
        /// </summary>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public Guid PutCollectionName(string superCollectionName, string collectionName, Collection collectionRequest)
        {
            return AuthenticatedOperation(delegate(User user)
                {
                    Trace.TraceInformation("Put Collection {0} from user {1} in supercollection {2}", collectionName, user, superCollectionName);

                    Guid returnValue = Guid.Empty;

                    if (collectionRequest == null)
                    {
                        SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                        return Guid.Empty;
                    }

                    if (user == null)
                    {
                        // No ACS so treat as an anonymous user who cannot add or modify a collection.
                        SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                        return Guid.Empty;
                    }

                    Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                    Collection collection = _storage.Collections.Find(collectionGuid);
                    if (collection == null)
                    {
                        collection = new Collection { Id = collectionGuid, Title = collectionName, User = user };
                        _storage.Collections.Add(collection);
                        returnValue = collectionGuid;
                    }
                    else
                    {
                        if (collection.User != user)
                        {
                            SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                            return Guid.Empty;
                        }

                        // Modify collection fields. However, title can't be modified since it would change the URL and break indexing.
                    }
                    _storage.SaveChanges();
                    return returnValue;
                });
        }

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public void DeleteCollection(string superCollectionName, string collectionName)
        {
            AuthenticatedOperation(delegate(User user)
                {
                    Trace.TraceInformation("Delete Collection {0} from user {1} in supercollection {2}", collectionName, user, superCollectionName);

                    Guid collectionId = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                    Collection collection = _storage.Collections.Find(collectionId);
                    if (collection == null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                        return;
                    }

                    if (user == null || collection.User.NameIdentifier != user.NameIdentifier)
                    {
                        SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                        return;
                    }

                    _storage.Collections.Remove(collection);
                    _storage.SaveChanges();
                });
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
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}/timeline", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public Guid PutTimeline(string superCollectionName, string collectionName, TimelineRaw timelineRequest)
        {
            return AuthenticatedOperation(delegate(User user)
                {
                    Trace.TraceInformation("Put Timeline");
                    Guid returnValue;

                    if (timelineRequest == null)
                    {
                        SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                        return Guid.Empty;
                    }

                    Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                    Collection collection = _storage.Collections.Find(collectionGuid);
                    if (collection == null)
                    {
                        // Collection does not exist
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                        return Guid.Empty;
                    }

                    // Validate user for timelines that require validation
                    if (!UserCanModifyCollection(user, collection))
                    {
                        SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                        return Guid.Empty;
                    }

                    if (timelineRequest.Id == Guid.Empty)
                    {
                        Timeline parentTimeline = FindParentTimeline(timelineRequest.Timeline_ID);
                        if (parentTimeline == null)
                        {
                            SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ParentTimelineNotFound);
                            return Guid.Empty;
                        }

                        // Parent timeline is valid - add new timeline
                        Guid newTimelineGuid = Guid.NewGuid();
                        Timeline newTimeline = new Timeline { Id = newTimelineGuid, Title = timelineRequest.Title, Regime = timelineRequest.Regime };
                        newTimeline.FromYear = timelineRequest.FromYear;
                        newTimeline.ToYear = timelineRequest.ToYear;
                        newTimeline.Collection = collection;

                        // Update parent timeline.
                        _storage.Entry(parentTimeline).Collection(_ => _.ChildTimelines).Load();
                        if (parentTimeline.ChildTimelines == null)
                        {
                            parentTimeline.ChildTimelines = new System.Collections.ObjectModel.Collection<Timeline>();
                        }
                        parentTimeline.ChildTimelines.Add(newTimeline);

                        _storage.Timelines.Add(newTimeline);
                        returnValue = newTimelineGuid;
                    }
                    else
                    {
                        Guid updateTimelineGuid = timelineRequest.Id;
                        Timeline updateTimeline = _storage.Timelines.Find(updateTimelineGuid);
                        if (updateTimeline == null)
                        {
                            SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TimelineNotFound);
                            return Guid.Empty;
                        }

                        if (updateTimeline.Collection.Id != collectionGuid)
                        {
                            SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                            return Guid.Empty;
                        }

                        // Update the timeline fields
                        updateTimeline.Title = timelineRequest.Title;
                        updateTimeline.Regime = timelineRequest.Regime;
                        updateTimeline.FromYear = timelineRequest.FromYear;
                        updateTimeline.ToYear = timelineRequest.ToYear;
                        returnValue = updateTimelineGuid;
                    }
                    _storage.SaveChanges();
                    return returnValue;
                });
        }

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}/timeline", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public void DeleteTimeline(string superCollectionName, string collectionName, Timeline timelineRequest)
        {
            AuthenticatedOperation(delegate(User user)
                {
                    Trace.TraceInformation("Delete Timeline");

                    if (timelineRequest == null)
                    {
                        SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                        return;
                    }

                    Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName); ;
                    Collection collection = _storage.Collections.Find(collectionGuid);
                    if (collection == null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                        return;
                    }

                    if (!UserCanModifyCollection(user, collection))
                    {
                        SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                        return;
                    }

                    if (timelineRequest.Id == Guid.Empty)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TimelineNull);
                        return;
                    }

                    Timeline deleteTimeline = _storage.Timelines.Find(timelineRequest.Id);
                    if (deleteTimeline == null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TimelineNotFound);
                        return;
                    }

                    if (deleteTimeline.Collection.Id != collectionGuid)
                    {
                        SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                        return;
                    }

                    _storage.DeleteTimeline(timelineRequest.Id);
                    _storage.SaveChanges();
                });
        }

        public class PutExhibitResult
        {
            public Guid ExhibitId { get; set; }
            public List<Guid> ContentItemId { get; set; }
        }

        /// <summary>
        /// Creates or updates the exhibit and its content items in a given collection.
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
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}/exhibit", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public PutExhibitResult PutExhibit(string superCollectionName, string collectionName, ExhibitRaw exhibitRequest)
        {
            return AuthenticatedOperation(delegate(User user)
                {
                    Trace.TraceInformation("Put Exhibit");
                    var returnValue = new PutExhibitResult();

                    if (exhibitRequest == null)
                    {
                        SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                        return returnValue;
                    }

                    Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                    Collection collection = _storage.Collections.Find(collectionGuid);
                    if (collection == null)
                    {
                        // Collection does not exist
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                        return returnValue;
                    }

                    // Validate user, if required.
                    if (!UserCanModifyCollection(user, collection))
                    {
                        SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                        return returnValue;
                    }

                    if (exhibitRequest.Id == Guid.Empty)
                    {
                        Timeline parentTimeline = FindParentTimeline(exhibitRequest.Timeline_ID);
                        if (parentTimeline == null)
                        {
                            SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ParentTimelineNotFound);
                            return returnValue;
                        }

                        // Parent timeline is valid - add new exhibit
                        Guid newExhibitGuid = Guid.NewGuid();
                        Exhibit newExhibit = new Exhibit { Id = newExhibitGuid };
                        newExhibit.Title = exhibitRequest.Title;
                        newExhibit.Year = exhibitRequest.Year;
                        newExhibit.Collection = collection;

                        // Update parent timeline.
                        _storage.Entry(parentTimeline).Collection(_ => _.Exhibits).Load();
                        if (parentTimeline.Exhibits == null)
                        {
                            parentTimeline.Exhibits = new System.Collections.ObjectModel.Collection<Exhibit>();
                        }
                        parentTimeline.Exhibits.Add(newExhibit);

                        _storage.Exhibits.Add(newExhibit);
                        _storage.SaveChanges();
                        returnValue.ExhibitId = newExhibitGuid;

                        // Populate the content items
                        if (exhibitRequest.ContentItems != null)
                        {
                            foreach (ContentItem contentItemRequest in exhibitRequest.ContentItems)
                            {
                                // Parent exhibit item will be equal to the newly added exhibit
                                var newContentItemGuid = AddContentItem(collection, newExhibit, contentItemRequest);
                                if (returnValue.ContentItemId == null)
                                {
                                    returnValue.ContentItemId = new List<Guid>();
                                }
                                returnValue.ContentItemId.Add(newContentItemGuid);
                            }
                        }

                    }
                    else
                    {
                        Exhibit updateExhibit = _storage.Exhibits.Find(exhibitRequest.Id);
                        if (updateExhibit == null)
                        {
                            SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ExhibitNotFound);
                            return returnValue;
                        }

                        if (updateExhibit.Collection.Id != collectionGuid)
                        {
                            SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                            return returnValue;
                        }

                        // Update the exhibit fields
                        updateExhibit.Title = exhibitRequest.Title;
                        updateExhibit.Year = exhibitRequest.Year;
                        returnValue.ExhibitId = exhibitRequest.Id;

                        // Update the content items
                        if (exhibitRequest.ContentItems != null)
                        {
                            foreach (ContentItem contentItemRequest in exhibitRequest.ContentItems)
                            {
                                Guid updateContentItemGuid = UpdateContentItem(collectionGuid, contentItemRequest);
                                if (updateContentItemGuid != Guid.Empty)
                                {
                                    if (returnValue.ContentItemId == null)
                                    {
                                        returnValue.ContentItemId = new List<Guid>();
                                    }
                                    returnValue.ContentItemId.Add(updateContentItemGuid);
                                }
                            }
                        }
                    }
                    _storage.SaveChanges();
                    return returnValue;
                });
        }

        private Guid UpdateContentItem(Guid collectionGuid, ContentItem contentItemRequest)
        {
            ContentItem updateContentItem = _storage.ContentItems.Find(contentItemRequest.Id);
            if (updateContentItem == null)
            {
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ContentItemNotFound);
                return Guid.Empty;
            }

            if (updateContentItem.Collection.Id != collectionGuid)
            {
                SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                return Guid.Empty;
            }

            // Update the content item fields
            updateContentItem.Title = contentItemRequest.Title;
            updateContentItem.Caption = contentItemRequest.Caption;
            updateContentItem.MediaType = contentItemRequest.MediaType;
            updateContentItem.Uri = contentItemRequest.Uri;
            updateContentItem.MediaSource = contentItemRequest.MediaSource;
            updateContentItem.Attribution = contentItemRequest.Attribution;
            return contentItemRequest.Id;
        }

        private Guid AddContentItem(Collection collection, Exhibit newExhibit, ContentItem contentItemRequest)
        {
            Guid newContentItemGuid = Guid.NewGuid();
            ContentItem newContentItem = new ContentItem
                                        {
                                            Id = newContentItemGuid,
                                            Title = contentItemRequest.Title,
                                            Caption = contentItemRequest.Caption,
                                            MediaType = contentItemRequest.MediaType,
                                            Uri = contentItemRequest.Uri,
                                            MediaSource = contentItemRequest.MediaSource,
                                            Attribution = contentItemRequest.Attribution
                                        };
            newContentItem.Collection = collection;

            // Update parent exhibit.
            _storage.Entry(newExhibit).Collection(_ => _.ContentItems).Load();
            if (newExhibit.ContentItems == null)
            {
                newExhibit.ContentItems = new System.Collections.ObjectModel.Collection<ContentItem>();
            }
            newExhibit.ContentItems.Add(newContentItem);
            _storage.ContentItems.Add(newContentItem);
            return newContentItemGuid;
        }

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}/exhibit", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public void DeleteExhibit(string superCollectionName, string collectionName, Exhibit exhibitRequest)
        {
            AuthenticatedOperation(user =>
                {
                    Trace.TraceInformation("Delete Exhibit");

                    if (exhibitRequest == null)
                    {
                        SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                        return;
                    }

                    Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                    Collection collection = _storage.Collections.Find(collectionGuid);
                    if (collection == null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                        return;
                    }

                    if (!UserCanModifyCollection(user, collection))
                    {
                        SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                        return;
                    }

                    if (exhibitRequest.Id == Guid.Empty)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ExhibitNotFound);
                        return;
                    }

                    Exhibit deleteExhibit = _storage.Exhibits.Find(exhibitRequest.Id);
                    if (deleteExhibit == null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ExhibitNotFound);
                        return;
                    }

                    if (deleteExhibit.Collection == null || deleteExhibit.Collection.Id != collectionGuid)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionIdMismatch);
                        return;
                    }
                    _storage.DeleteExhibit(exhibitRequest.Id);
                    _storage.SaveChanges();
                });
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
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}/contentitem", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public Guid PutContentItem(string superCollectionName, string collectionName, ContentItemRaw contentItemRequest)
        {
            return AuthenticatedOperation(user =>
                {
                    Trace.TraceInformation("Put Content Item");

                    Guid returnValue;

                    if (contentItemRequest == null)
                    {
                        SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                        return Guid.Empty;
                    }

                    Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                    Collection collection = _storage.Collections.Find(collectionGuid);

                    if (collection == null)
                    {
                        // Collection does not exist
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                        return Guid.Empty;
                    }

                    // Validate user, if required.
                    if (!UserCanModifyCollection(user, collection))
                    {
                        SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                        return Guid.Empty;
                    }

                    if (contentItemRequest.Id == Guid.Empty)
                    {
                        Exhibit parentExhibit = FindParentExhibit(contentItemRequest.Exhibit_ID);
                        if (parentExhibit == null)
                        {
                            SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ParentTimelineNotFound);
                            return Guid.Empty;
                        }

                        // Parent content item is valid - add new content item
                        var newContentItemGuid = AddContentItem(collection, parentExhibit, contentItemRequest);
                        returnValue = newContentItemGuid;
                    }
                    else
                    {
                        Guid updateContentItemGuid = UpdateContentItem(collectionGuid, contentItemRequest);
                        returnValue = updateContentItemGuid;
                    }
                    _storage.SaveChanges();
                    return returnValue;
                });
        }

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}/contentitem", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public void DeleteContentItem(string superCollectionName, string collectionName, ContentItem contentItemRequest)
        {
            AuthenticatedOperation(user =>
                {
                    Trace.TraceInformation("Delete Content Item");

                    if (contentItemRequest == null)
                    {
                        SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                        return;
                    }

                    Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                    Collection collection = _storage.Collections.Find(collectionGuid);
                    if (collection == null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                        return;
                    }

                    if (!UserCanModifyCollection(user, collection))
                    {
                        SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                        return;
                    }

                    if (contentItemRequest.Id == Guid.Empty)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ContentItemNotFound);
                        return;
                    }

                    ContentItem deleteContentItem = _storage.ContentItems.Find(contentItemRequest.Id);
                    if (deleteContentItem == null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ContentItemNotFound);
                        return;
                    }

                    if (deleteContentItem.Collection == null || deleteContentItem.Collection.Id != collectionGuid)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionIdMismatch);
                        return;
                    }

                    _storage.ContentItems.Remove(deleteContentItem);
                    _storage.SaveChanges();
                });
        }

        private Timeline FindParentTimeline(Guid? parentTimelineGuid)
        {
            // Validate parent timeline
            if (parentTimelineGuid == null)
            {
                parentTimelineGuid = Guid.Empty;
            }
            Timeline parentTimeline = _storage.Timelines.Find(parentTimelineGuid);
            if (parentTimeline == null)
            {
                // Parent id is not found so no timeline will be added
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ParentTimelineNotFound);
            }
            return parentTimeline;
        }

        private Exhibit FindParentExhibit(Guid parentExhibitGuid)
        {
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

        /// <summary>
        /// Performs an operation under an authenticated user.
        /// </summary>
        private static T AuthenticatedOperation<T>(Func<User, T> operation)
        {
            Microsoft.IdentityModel.Claims.ClaimsIdentity claimsIdentity = HttpContext.Current.User.Identity as Microsoft.IdentityModel.Claims.ClaimsIdentity;

            if (claimsIdentity == null || !claimsIdentity.IsAuthenticated)
            {
                return operation(null);
            }

            Microsoft.IdentityModel.Claims.Claim nameIdentifierClaim = claimsIdentity.Claims.Where(candidate => candidate.ClaimType.EndsWith("nameidentifier")).FirstOrDefault();
            if (nameIdentifierClaim == null)
            {
                return operation(null);
            }

            Microsoft.IdentityModel.Claims.Claim identityProviderClaim = claimsIdentity.Claims.Where(candidate => candidate.ClaimType.EndsWith("identityprovider")).FirstOrDefault();
            if (identityProviderClaim == null)
            {
                return operation(null);
            }

            User user = new User();
            user.NameIdentifier = nameIdentifierClaim.Value;
            user.IdentityProvider = identityProviderClaim.Value;

            return operation(user);
        }

        /// <summary>
        /// Helper to AuthenticatedOperation to handle void.
        /// </summary>
        private static void AuthenticatedOperation(Action<User> operation)
        {
            AuthenticatedOperation<bool>(user =>
                {
                    operation(user);
                    return true;
                });
        }

        /// <summary>
        /// Can a given GetTimelines request be cached?
        /// </summary>
        private bool CanCacheGetTimelines(User user, Guid collectionId)
        {
            if (user == null)
            {
                // Anonymous user
                return true;
            }
            string cacheKey = string.Format(CultureInfo.InvariantCulture, "Collection-To-Owner {0}", collectionId);
            if (!Cache.Contains(cacheKey))
            {
                string ownerId = _storage.Collections.Find(collectionId).User.NameIdentifier;
                if (ownerId != null)
                {
                    Cache.Add(cacheKey, ownerId, DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"], CultureInfo.InvariantCulture)));
                }
            }

            // Can cache as long as the user does not own the collection.
            return (string)Cache[cacheKey] != user.NameIdentifier;
        }

        /// <summary>
        /// Retrieves the cached timeline.
        /// </summary>
        /// <returns>Null if not cached.</returns>
        private Timeline GetCachedGetTimelines(Guid collectionId, string start, string end, string minspan, string lca, string maxElements)
        {
            string cacheKey = string.Format(CultureInfo.InvariantCulture, "GetTimelines {0}|{1}|{2}|{3}|{4}|{5}", collectionId, start, end, minspan, lca, maxElements);
            if (Cache.Contains(cacheKey))
            {
                return (Timeline)Cache[cacheKey];
            }

            return null;
        }

        /// <summary>
        /// Caches the given timeline for the given GetTimelines request.
        /// </summary>
        private void CacheGetTimelines(Timeline timeline, Guid collectionId, string start, string end, string minspan, string lca, string maxElements)
        {
            string cacheKey = string.Format(CultureInfo.InvariantCulture, "GetTimelines {0}|{1}|{2}|{3}|{4}|{5}", collectionId, start, end, minspan, lca, maxElements);
            if (!Cache.Contains(cacheKey))
            {
                Cache.Add(cacheKey, timeline, DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"], CultureInfo.InvariantCulture)));
            }
        }

        private static bool UserCanModifyCollection(User user, Collection collection)
        {
            if (user == null)
            {
                return collection.User == null || collection.User.NameIdentifier == null;
            }
            else
            {
                return collection.User.NameIdentifier == user.NameIdentifier;
            }
        }
    }
}
