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
using System.Net;
using System.Runtime.Caching;
using System.Runtime.Serialization;
using System.Security.Cryptography;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using System.Web;
using Chronozoom.Entities;

using Chronozoom.UI.Utils;
using System.ServiceModel.Description;

namespace Chronozoom.UI
{
    [DataContract]
    public class BaseJsonResult<T>
    {
        public BaseJsonResult(T data)
        {
            D = data;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "D")]
        [DataMember(Name = "d")]
        public T D { get; set; }
    }

    /// <summary>
    /// Provides a structure to retrieve information about this service.
    /// </summary>
    [DataContract]
    public class ServiceInformation
    {
        /// <summary>
        /// The path to download thumbanils from.
        /// </summary>
        [DataMember]
        public Uri ThumbnailsPath { get; set; }
    }

    public class PutExhibitResult
    {
        private List<Guid> _contentItemId;

        public Guid ExhibitId { get; set; }
        public IEnumerable<Guid> ContentItemId
        {
            get
            {
                return _contentItemId.AsEnumerable();
            }
        }

        internal PutExhibitResult()
        {
            _contentItemId = new List<Guid>();
        }

        internal void Add(Guid id)
        {
            _contentItemId.Add(id);
        }
    }

    public class TourResult
    {
        private List<Guid> _bookmarkId;

        public Guid TourId { get; set; }
        public IEnumerable<Guid> BookmarkId
        {
            get
            {
                return _bookmarkId.AsEnumerable();
            }
        }

        internal TourResult()
        {
            _bookmarkId = new List<Guid>();
        }

        internal void Add(Guid id)
        {
            _bookmarkId.Add(id);
        }
    }

    [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
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
        private const int _defaultDepth = 30;
        private const string _defaultUserCollectionName = "default";
        private const string _defaultUserName = "anonymous";
        private const string _sandboxSuperCollectionName = "Sandbox";
        private const string _sandboxCollectionName = "Sandbox";

        // The default number of max elements returned by the API
        private static Lazy<int> _maxElements = new Lazy<int>(() =>
        {
            string maxElements = ConfigurationManager.AppSettings["MaxElementsDefault"];

            return string.IsNullOrEmpty(maxElements) ? 2000 : int.Parse(maxElements, CultureInfo.InvariantCulture);
        });

        // Points to the absolute path where thumbnails are stored
        private static Lazy<Uri> _thumbnailsPath = new Lazy<Uri>(() =>
        {
            if (ConfigurationManager.AppSettings["ThumbnailsPath"] == null)
                return null;

            return new Uri(ConfigurationManager.AppSettings["ThumbnailsPath"]);
        });

        private static Lazy<ThumbnailGenerator> _thumbnailGenerator = new Lazy<ThumbnailGenerator>(() =>
        {
            string thumbnailStorage = null;
            if (ConfigurationManager.AppSettings["ThumbnailStorage"] != null)
            {
                thumbnailStorage = ConfigurationManager.AppSettings["ThumbnailStorage"];
            }

            return new ThumbnailGenerator(thumbnailStorage);
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
            public const string SandboxSuperCollectionNotFound = "Default sandbox superCollection not found";
            public const string DefaultUserNotFound = "Default anonymous user not found";
            public const string SuperCollectionNotFound = "SuperCollection not found";
            public const string TimelineRangeInvalid = "Timeline lies outside of bounds of it's parent timeline";
        }

        private static Lazy<string> _hostPath = new Lazy<string>(() =>
        {
            Uri uri = HttpContext.Current.Request.Url;
            return uri.Scheme + Uri.SchemeDelimiter + uri.Host + ":" + uri.Port;
        });

        private static Lazy<IChronozoomSVC> _chronozoomService = new Lazy<IChronozoomSVC>(() =>
        {
            WebHttpBinding myBinding = new WebHttpBinding();
            myBinding.MaxReceivedMessageSize = 100000000;

            EndpointAddress myEndpoint = new EndpointAddress(_hostPath.Value + "/api/chronozoom.svc");

            ChannelFactory<IChronozoomSVC> factory = new ChannelFactory<IChronozoomSVC>(myBinding, myEndpoint);
            factory.Endpoint.Behaviors.Add(new WebHttpBehavior());
            return factory.CreateChannel();
        });

        internal static IChronozoomSVC Instance
        {
            get { return _chronozoomService.Value; }
        }

        /// <summary>
        /// Returns timeline data within a specified range of years from a collection or a superCollection.
        /// </summary>
        /// <param name="superCollection">Name of the superCollection to query.</param>
        /// <param name="collection">Name of the collection to query.</param>
        /// <param name="start">Year at which to begin the search, between -20000000000 and 9999.</param>
        /// <param name="end">Year at which to end the search, between -20000000000 and 9999.</param>
        /// <param name="minspan">Filters the search results to a particular time scale.</param>
        /// <param name="commonAncestor">Least Common Ancestor, a timeline identifier used to hint the server to retrieve timelines close to this location.</param>
        /// <param name="maxElements">The maximum number of elements to return.</param>
        /// <returns>Timeline data in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL:
        /// http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/timelines
        ///
        /// Request body (JSON):
        /// {
        ///    start: 1800
        ///    end: 1920
        ///    minspan: 
        ///    lca: 
        ///    maxElements: 25
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "minspan")]
        public Timeline GetTimelines(string superCollection, string collection, string start, string end, string minspan, string commonAncestor, string maxElements, string depth)
        {
            return AuthenticatedOperation(delegate(User user)
            {
                Trace.TraceInformation("Get Filtered Timelines");

                Guid collectionId = CollectionIdOrDefault(superCollection, collection);

                // If available, retrieve from cache.
                if (CanCacheGetTimelines(user, collectionId))
                {
                    Timeline cachedTimeline = GetCachedGetTimelines(collectionId, start, end, minspan, commonAncestor, maxElements);
                    if (cachedTimeline != null)
                    {
                        return cachedTimeline;
                    }
                }

                // initialize filters
                decimal startTime = string.IsNullOrWhiteSpace(start) ? _minYear : decimal.Parse(start, CultureInfo.InvariantCulture);
                decimal endTime = string.IsNullOrWhiteSpace(end) ? _maxYear : decimal.Parse(end, CultureInfo.InvariantCulture);
                decimal span = string.IsNullOrWhiteSpace(minspan) ? 0 : decimal.Parse(minspan, CultureInfo.InvariantCulture);
                Guid? lcaParsed = string.IsNullOrWhiteSpace(commonAncestor) ? (Guid?)null : Guid.Parse(commonAncestor);
                int maxElementsParsed = string.IsNullOrWhiteSpace(maxElements) ? _maxElements.Value : int.Parse(maxElements, CultureInfo.InvariantCulture);
                int depthParsed = string.IsNullOrWhiteSpace(depth) ? _defaultDepth : int.Parse(depth, CultureInfo.InvariantCulture);

                Collection<Timeline> timelines = _storage.TimelinesQuery(collectionId, startTime, endTime, span, lcaParsed, maxElementsParsed, depthParsed);

                Timeline timeline = timelines.Where(candidate => candidate.Id == lcaParsed).FirstOrDefault();

                if (timeline == null)
                    timeline = timelines.FirstOrDefault();

                CacheGetTimelines(timeline, collectionId, start, end, minspan, commonAncestor, maxElements);

                return timeline;
            });
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "minspan")]
        public IEnumerable<TimelineRaw> GetTimelineSubtree(Guid collectionId, string start, string end, string minspan, string commonAncestor, string maxElements)
        {
            return AuthenticatedOperation(delegate(User user)
            {
                Trace.TraceInformation("Get Filtered Timelines");
                /*
                Guid collectionId = CollectionIdOrDefault(superCollection, collection);

                // If available, retrieve from cache.
                if (CanCacheGetTimelines(user, collectionId))
                {
                    Timeline cachedTimeline = GetCachedGetTimelines(collectionId, start, end, minspan, commonAncestor, maxElements);
                    if (cachedTimeline != null)
                    {
                        return cachedTimeline;
                    }
                }
                */
                
                // initialize filters
                decimal startTime = string.IsNullOrWhiteSpace(start) ? _minYear : decimal.Parse(start, CultureInfo.InvariantCulture);
                decimal endTime = string.IsNullOrWhiteSpace(end) ? _maxYear : decimal.Parse(end, CultureInfo.InvariantCulture);
                decimal minSpanParsed = string.IsNullOrWhiteSpace(minspan) ? 0 : decimal.Parse(minspan, CultureInfo.InvariantCulture);
                Guid? lcaParsed = string.IsNullOrWhiteSpace(commonAncestor) ? (Guid?)null : Guid.Parse(commonAncestor);
                int maxElementsParsed = string.IsNullOrWhiteSpace(maxElements) ? _maxElements.Value : int.Parse(maxElements, CultureInfo.InvariantCulture);
                return _storage.TimelineSubtreeQuery(collectionId, lcaParsed, startTime, endTime, minSpanParsed, maxElementsParsed);
            });
        }



        /// <summary>
        /// Performs a search for a specific term within a collection or a superCollection.
        /// </summary>
        /// <param name="superCollection">Name of the superCollection to query.</param>
        /// <param name="collection">Name of the collection to query.</param>
        /// <param name="searchTerm">The term to search for.</param>
        /// <returns>Search results in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL:
        /// http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/search
        ///
        /// Request body (JSON):
        /// {
        ///    searchTerm: "Pluto"
        /// }
        /// ]]>
        /// </example>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public BaseJsonResult<IEnumerable<SearchResult>> Search(string superCollection, string collection, string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                Trace.TraceEvent(TraceEventType.Warning, 0, "Search called with null search term");
                return null;
            }

            Guid collectionId = CollectionIdOrDefault(superCollection, collection);
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

        /// <summary>
        /// Returns a list of tours for the default collection and default superCollection.
        /// </summary>
        /// <returns>A list of tours in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL: 
        /// http://[site URL]/chronozoom.svc/tours
        /// ]]>
        /// </example>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/tours")]
        public BaseJsonResult<IEnumerable<Tour>> GetDefaultTours()
        {
            return GetTours("", "");
        }

        /// <summary>
        /// Returns a list of tours for a given collection or superCollection.
        /// </summary>
        /// <param name="superCollection">Name of the superCollection to query.</param>
        /// <param name="collection">Name of the collection to query.</param>
        /// <returns>A list of tours in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL: 
        /// http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/tours
        /// ]]>
        /// </example>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/{supercollection}/{collection}/tours")]
        public BaseJsonResult<IEnumerable<Tour>> GetTours(string superCollection, string collection)
        {
            Trace.TraceInformation("Get Tours");

            Guid collectionId = CollectionIdOrDefault(superCollection, collection);
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
        /// Creates a new user, or updates an existing user's information and associated personal collection.
        /// </summary>
        /// <remarks>
        /// If the user ID is omitted then a new user is created.
        /// If there is no ACS the user is treated as anonymous and granted access to the sandbox collection.
        /// If the anonymous user does not exist in the database then it is created.
        /// A new superCollection with the user's display name is added.
        /// A new default collection with the user's display name is added to this superCollection.
        /// A new user with the specified attributes is created.
        ///
        /// If the specified user display name does not exist it is considered an error.
        /// If the user display name is specified and it exists then the user's attributes are updated.
        /// </remarks>
        /// <param name="userRequest">JSON containing the request details.</param>
        /// <returns>The URL for the new user collection.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: PUT
        ///
        /// URL:
        /// http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/user
        /// 
        /// Request body (JSON):
        /// {
        ///     id: "0123456789",
        ///     displayName: "Joe",
        ///     email: "email@email.com"
        /// }
        /// ]]>
        /// </example>
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
                
                Uri collectionUri;

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
                    return collectionUri.ToString();
                }

                User updateUser = _storage.Users.Where(candidate => candidate.DisplayName == userRequest.DisplayName).FirstOrDefault();
                if (userRequest.Id == Guid.Empty && updateUser == null)
                {
                    // Add new user
                    User newUser = new User { Id = Guid.NewGuid(), DisplayName = userRequest.DisplayName, Email = userRequest.Email };
                    newUser.NameIdentifier = user.NameIdentifier;
                    newUser.IdentityProvider = user.IdentityProvider;
                    collectionUri = UpdatePersonalCollection(user.NameIdentifier, newUser);
                }
                else
                {
                    if (updateUser == null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.UserNotFound);
                        return String.Empty;
                    }
                    updateUser.Email = userRequest.Email;
                    collectionUri = UpdatePersonalCollection(user.NameIdentifier, updateUser);
                    _storage.SaveChanges();
                }

                return collectionUri.ToString();
            });
        }

        /// <summary>
        /// Provides information about the ChronoZoom service to the clients. Used internally by the ChronoZoom client.
        /// </summary>
        /// <returns>A ServiceInformation object describing parameter from the running service</returns>
        [SuppressMessage("Microsoft.Performance", "CA1822:MarkMembersAsStatic")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/info", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public ServiceInformation GetServiceInformation()
        {
            Trace.TraceInformation("Get Service Information");

            ServiceInformation serviceInformation = new ServiceInformation();
            serviceInformation.ThumbnailsPath = _thumbnailsPath.Value;

            return serviceInformation;
        }

        /// <summary>
        /// Deletes the user with the specified user ID.
        /// </summary>
        /// <param name="userRequest">JSON containing the request details.</param>
        /// <returns>HTTP response code.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: DELETE
        /// URL:
        /// http://{site URL}/chronozoom.svc/{supercollection}/{collection}/user
        /// 
        /// Request body (JSON):
        /// {
        ///     id: "0123456789"
        /// }
        /// ]]>
        /// </example>
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

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/user", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public User GetUser()
        {
            return AuthenticatedOperation(delegate(User user)
            {
                Trace.TraceInformation("Get User");
                if (user == null)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                    return null;
                }
                var u = _storage.Users.Where(candidate => candidate.NameIdentifier == user.NameIdentifier).FirstOrDefault();
                if (u != null) return u;
                return user;
            });
        }

        private void DeleteSuperCollection(string superCollectionName)
        {
            AuthenticatedOperation(delegate(User user)
            {
                Trace.TraceInformation("Delete SuperCollection {0} from user {1} ", superCollectionName, user);

                Guid superCollectionId = CollectionIdFromText(superCollectionName);
                SuperCollection superCollection = RetrieveSuperCollection(superCollectionId);
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
                // Anonymous user so use the sandbox superCollection and collection
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
                // Create the personal superCollection
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

                // Add root timeline Cosmos to the personal collection
                Timeline rootTimeline = new Timeline { Id = Guid.NewGuid(), Title = "Cosmos" , Regime = "Cosmos" };
                rootTimeline.FromYear = -13700000000;
                rootTimeline.ToYear = 9999;
                rootTimeline.Collection = personalCollection;
                rootTimeline.Depth = 0;
                rootTimeline.FirstNodeInSubtree = rootTimeline.Id;
                rootTimeline.Predecessor = Guid.Empty;
                rootTimeline.Successor = Guid.Empty;

                _storage.SuperCollections.Add(superCollection);
                _storage.Collections.Add(personalCollection);
                _storage.Timelines.Add(rootTimeline);
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

        private Guid CollectionIdOrDefault(string superCollectionName, string collectionName)
        {
            if (string.IsNullOrEmpty(superCollectionName))
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
                if (string.IsNullOrEmpty(collectionName))
                    collectionName = superCollectionName;

                return CollectionIdFromSuperCollection(superCollectionName, collectionName);
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase")]
        private static Guid CollectionIdFromSuperCollection(string superCollection, string collection)
        {
            return CollectionIdFromText(string.Format(
                CultureInfo.InvariantCulture,
                "{0}|{1}",
                superCollection.ToLower(CultureInfo.InvariantCulture),
                collection.ToLower(CultureInfo.InvariantCulture)));
        }

        // Replace with URL friendly representations. For instance, converts space to '-'.
        private static string FriendlyUrlReplacements(string value)
        {
            return Uri.EscapeDataString(value.Replace(' ', '-'));
        }

        // Decodes from URL friendly representations. For instance, converts '-' to space.
        private static string FriendlyUrlDecode(string value)
        {
            return Uri.UnescapeDataString(value.Replace('-', ' '));
        }

        [SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase")]
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
        /// Creates a new collection using the specified name.
        /// </summary>
        /// <remarks>
        /// If a collection of the specified name does not exist then a new collection is created. 
        /// If the collection exists and the authenticated user is the author then the collection is modified. 
        /// If no author is registered then the authenticated user is set as the author. 
        /// The title field can't be modified because it is part of the URL (the URL can be indexed).
        /// </remarks>
        /// <param name="superCollectionName">The name of the parent superCollection for the collection.</param>
        /// <param name="collectionName">The name of the collection to create.</param>
        /// <param name="collectionRequest">The markup for the collection to create in JSON format.</param>
        /// <returns></returns>
        /// <example><![CDATA[ 
        /// HTTP verb: PUT
        ///
        /// URL:
        /// http://{site URL}/chronozoom.svc/{superCollectionName}/{collectionName}
        ///
        /// Request body (JSON):
        /// {
        ///      name: "My Collection"
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public Guid PutCollectionName(string superCollectionName, string collectionName, Collection collectionRequest)
        {
            return AuthenticatedOperation(delegate(User user)
            {
                Trace.TraceInformation("Put Collection {0} from user {1} in superCollection {2}", collectionName, user, superCollectionName);

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
                lock (_storage)
                {
                    Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                    Collection collection = RetrieveCollection(collectionGuid);
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
                }
            });
        }

        /// <summary>
        /// Deletes the specified collection.
        /// </summary>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to delete.</param>
        /// <returns>HTTP response code.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: DELETE
        ///
        /// URL:
        /// http://{site URL}/chronozoom.svc/{superCollectionName}/{collectionName}
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public void DeleteCollection(string superCollectionName, string collectionName)
        {
            AuthenticatedOperation(delegate(User user)
            {
                Trace.TraceInformation("Delete Collection {0} from user {1} in superCollection {2}", collectionName, user, superCollectionName);

                Guid collectionId = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                Collection collection = RetrieveCollection(collectionId);
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
        /// </summary>
        /// <remarks>
        /// If an ID is specified but the collection does not exist, the request will fail ("not found" status).
        /// If an ID is not specified, a new timeline will be added to the collection. 
        /// For a new timeline, if the parent is not defined the root timeline will be set as the parent.
        /// If the timeline with the specified identifier exists, then the existing timeline is updated.
        /// </remarks>
        /// <param name="superCollectionName">The parent collection.</param>
        /// <param name="collectionName">The name of the collection to update.</param>
        /// <param name="timelineRequest">Timeline data in JSON format.</param>
        /// <returns>HTTP status code.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: PUT
        ///
        /// URL:
        /// http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/timeline
        ///
        /// Request body (JSON):
        /// {
        ///      id: "0123456789"
        ///      title: "A New Title"
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}/timeline", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public Guid PutTimeline(string superCollectionName, string collectionName, TimelineRaw timelineRequest)
        {
            return AuthenticatedOperation(delegate(User user)
            {
                Trace.TraceInformation("Put Timeline");
                
                if (timelineRequest == null)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                    return Guid.Empty;
                }

                lock (_storage)
                {
                    Guid returnValue;
                    Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                    Collection collection = RetrieveCollection(collectionGuid);
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
                        Timeline parentTimeline;
                        if (!FindParentTimeline(timelineRequest.Timeline_ID, out parentTimeline))
                        {
                            SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ParentTimelineNotFound);
                            return Guid.Empty;
                        }

                        if (!ValidateTimelineRange(parentTimeline, timelineRequest.FromYear, timelineRequest.ToYear))
                        {
                            SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TimelineRangeInvalid);
                            return Guid.Empty;
                        }

                        // Parent timeline is valid - add new timeline

                        Guid newTimelineGuid = Guid.NewGuid();
                        Timeline newTimeline = new Timeline { Id = newTimelineGuid, Title = timelineRequest.Title, Regime = timelineRequest.Regime };
                        newTimeline.FromYear = timelineRequest.FromYear;
                        newTimeline.ToYear = timelineRequest.ToYear;
                        newTimeline.Collection = collection;

                        // Update parent timeline.
                        if (parentTimeline != null)
                        {
                            _storage.Entry(parentTimeline).Collection(_ => _.ChildTimelines).Load();
                            if (parentTimeline.ChildTimelines == null)
                            {
                                parentTimeline.ChildTimelines = new System.Collections.ObjectModel.Collection<Timeline>();
                            }
                            newTimeline.Depth = parentTimeline.Depth + 1;
                            if (parentTimeline.Predecessor != Guid.Empty)
                            {
                                Timeline predecessorTimeline = _storage.Timelines.Find(parentTimeline.Predecessor);
                                predecessorTimeline.Successor = newTimeline.Id;
                                newTimeline.Predecessor = predecessorTimeline.Id;
                            }
                            else
                            {
                                newTimeline.Predecessor = Guid.Empty;
                            }
                            if (parentTimeline.FirstNodeInSubtree == parentTimeline.Id)
                            {
                                _storage.UpdateFirstNodeInSubtree(parentTimeline, newTimeline.Id);
                            }
                            newTimeline.Successor = parentTimeline.Id;
                            parentTimeline.Predecessor = newTimeline.Id;
                            parentTimeline.ChildTimelines.Add(newTimeline);
                        }
                        else
                        {
                            newTimeline.Depth = 0;
                            newTimeline.FirstNodeInSubtree = newTimeline.Id;
                            newTimeline.Predecessor = Guid.Empty;
                            newTimeline.Successor = Guid.Empty;
                        }
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

                        TimelineRaw parentTimelineRaw = _storage.GetParentTimelineRaw(updateTimeline.Id);

                        if (!ValidateTimelineRange(parentTimelineRaw, timelineRequest.FromYear, timelineRequest.ToYear))
                        {
                            SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TimelineRangeInvalid);
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
                }
            });
        }

        /// <summary>
        /// Deletes the timeline with the specified ID.
        /// </summary>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection from which the timeline should be deleted.</param>
        /// <param name="timelineRequest">The request in JSON format.</param>
        /// <example><![CDATA[ 
        /// HTTP verb: DELETE
        ///
        /// URL:
        /// http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/timeline
        ///
        /// Request body (JSON):
        /// {
        ///      timelineRequest: Need request body format.
        /// }
        /// ]]>
        /// </example>
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

                lock (_storage)
                {
                    Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName); ;
                    Collection collection = RetrieveCollection(collectionGuid);
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
                    Timeline parentTimeline = _storage.GetParentTimelineRaw(timelineRequest.Id);
                    if (parentTimeline != null && deleteTimeline.SubtreeSize > 0)
                    {
                        updateSubtreeSize(parentTimeline, -deleteTimeline.SubtreeSize);
                    }
                    if (deleteTimeline.Successor != Guid.Empty)
                    {
                        Timeline successorTimeline = _storage.Timelines.Find(deleteTimeline.Successor);
                        successorTimeline.Predecessor = deleteTimeline.Predecessor;
                    }
                    if (deleteTimeline.Predecessor != Guid.Empty)
                    {
                        Timeline predecessorTimeline = _storage.Timelines.Find(deleteTimeline.Predecessor);
                        predecessorTimeline.Successor = deleteTimeline.Successor;
                    }
                    if (deleteTimeline.FirstNodeInSubtree == deleteTimeline.Id && parentTimeline != null)
                    {
                        if (deleteTimeline.Successor != Guid.Empty)
                        {
                            _storage.UpdateFirstNodeInSubtree(parentTimeline, deleteTimeline.Successor);
                        }
                        else
                        {
                            _storage.UpdateFirstNodeInSubtree(parentTimeline, parentTimeline.Id);
                        }
                    }
                    _storage.DeleteTimeline(timelineRequest.Id);
                    _storage.SaveChanges();
                }
            });
        }

        static bool ValidateTimelineRange(Timeline parentTimeline, decimal FromYear, decimal ToYear)
        {
            if (parentTimeline == null)
            {
                return true;
            }

            if (FromYear >= parentTimeline.FromYear && ToYear <= parentTimeline.ToYear && FromYear <= ToYear)
            {
                return true;
            }

            return false;
        }

        /// <summary>
        /// Creates or updates the exhibit and its content items in a given collection. If the collection does not exist, then the command will silently fail.
        /// </summary>
        /// <remarks>
        /// If an exhibit id is not specified, a new exhibit is added to the collection. 
        /// If the ID for an existing exhibit is specified then the exhibit will be updated. 
        /// If the exhibit ID to be updated does not exist a "not found" status is returned. 
        /// If the parent timeline is not specified the exhibit is added to the root timeline. 
        /// Otherwise, the exhibit is added to the specified parent timeline. 
        /// If an invalid parent timeline is specified then the request will fail. 
        /// </remarks>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="exhibitRequest">The exhibit data in JSON format.</param>
        /// <returns>An exhibit in JSON format.</returns>
        /// <example><![CDATA[ 
        /// **HTTP verb:** PUT
        ///
        /// **URL:**
        ///     http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/exhibit
        ///
        /// **Request body:**
        ///     {
        ///          
        ///     }
        /// ]]>
        /// </example>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
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

                lock (_storage)
                {
                    Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                    Collection collection = RetrieveCollection(collectionGuid);
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
                        Timeline parentTimeline;
                        if (!FindParentTimeline(exhibitRequest.Timeline_ID, out parentTimeline) || parentTimeline == null)
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
                        newExhibit.Depth = parentTimeline.Depth + 1;

                        // Update parent timeline.
                        _storage.Entry(parentTimeline).Collection(_ => _.Exhibits).Load();
                        if (parentTimeline.Exhibits == null)
                        {
                            parentTimeline.Exhibits = new System.Collections.ObjectModel.Collection<Exhibit>();
                        }
                        parentTimeline.Exhibits.Add(newExhibit);
                        
                        _storage.Exhibits.Add(newExhibit);
                        if (newExhibit.ContentItems.Count() > 0 && parentTimeline != null)
                        {
                            updateSubtreeSize(parentTimeline, newExhibit.ContentItems.Count());
                        }
                        _storage.SaveChanges();
                        returnValue.ExhibitId = newExhibitGuid;

                        // Populate the content items
                        if (exhibitRequest.ContentItems != null)
                        {
                            foreach (ContentItem contentItemRequest in exhibitRequest.ContentItems)
                            {
                                // Parent exhibit item will be equal to the newly added exhibit
                                var newContentItemGuid = AddContentItem(collection, newExhibit, contentItemRequest);
                                returnValue.Add(newContentItemGuid);
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
                                    returnValue.Add(updateContentItemGuid);
                                }
                            }
                        }
                    }
                    _storage.SaveChanges();

                    if (exhibitRequest.ContentItems != null)
                    {
                        foreach (ContentItem contentItem in exhibitRequest.ContentItems)
                        {
                            _thumbnailGenerator.Value.CreateThumbnails(contentItem);
                        }
                    }

                    return returnValue;
                }
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
                Attribution = contentItemRequest.Attribution,
                Depth = newExhibit.Depth + 1
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

        /// <summary>
        /// Deletes the specified exhibit from the specified collection.
        /// </summary>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="exhibitRequest">The exhibit ID in JSON format.</param>
        /// <example><![CDATA[ 
        /// **HTTP verb:** DELETE
        ///
        /// **URL:**
        ///     http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/exhibit
        ///
        /// **Request body:**
        ///     {
        ///          id: "0123456789"
        ///     }
        /// ]]></example>
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
                lock (_storage)
                {
                    Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                    Collection collection = RetrieveCollection(collectionGuid);
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
                    Timeline parentTimeline = _storage.GetExhibitParentTimeline(deleteExhibit.Id);
                    if (deleteExhibit.ContentItems.Count() > 0 && parentTimeline != null)
                    {
                        updateSubtreeSize(parentTimeline, -deleteExhibit.ContentItems.Count());
                    }
                    _storage.DeleteExhibit(exhibitRequest.Id);
                    _storage.SaveChanges();
                }
            });
        }

        /// <summary>
        /// Creates or updates the content item in a given collection. If the collection does not exist the request will fail.
        /// </summary>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="contentItemRequest">The content item data in JSON format.</param>
        /// <returns></returns>
        /// <example><![CDATA[ 
        /// **HTTP verb:** PUT
        ///
        /// **URL:**
        ///     http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/contentitem
        ///
        /// **Request body:**
        ///     {
        ///          
        ///     }
        /// ]]></example>
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

                lock(_storage){
                    Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                    Collection collection = RetrieveCollection(collectionGuid);

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
                        TimelineRaw parentTimeline = _storage.GetExhibitParentTimeline(contentItemRequest.Exhibit_ID);
                        // Parent content item is valid - add new content item
                        var newContentItemGuid = AddContentItem(collection, parentExhibit, contentItemRequest);
                        returnValue = newContentItemGuid;
                        if (parentTimeline != null)
                        {
                            updateSubtreeSize(parentTimeline, 1);

                        }
                    }
                    else
                    {
                        Guid updateContentItemGuid = UpdateContentItem(collectionGuid, contentItemRequest);
                        returnValue = updateContentItemGuid;
                    }
                
                    _storage.SaveChanges();
                    _thumbnailGenerator.Value.CreateThumbnails(contentItemRequest);

                    return returnValue;
                }
            });
        }

        /// <summary>
        /// Delete the specified content item from the specified collection.
        /// </summary>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="contentItemRequest">The request in JSON format.</param>
        /// <example><![CDATA[ 
        /// **HTTP verb:** DELETE
        ///
        /// **URL:**
        ///     http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/contentitem
        ///
        /// **Request body:**
        ///     {
        ///          id: "0123456789"
        ///     }
        /// ]]>
        /// </example>
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

                lock (_storage)
                {
                    Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                    Collection collection = RetrieveCollection(collectionGuid);
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

                    ExhibitRaw parentExhibit = _storage.GetContentItemParentExhibit(deleteContentItem.Id);
                    TimelineRaw parentTimeline = _storage.GetExhibitParentTimeline(parentExhibit.Id);
                    _storage.ContentItems.Remove(deleteContentItem);
                    if (parentTimeline != null)
                    {
                        updateSubtreeSize(parentTimeline, -1);
                    }
                    _storage.SaveChanges();
                }
            });
        }

        /// <summary>
        /// Updates content item counts of all ancestor timelines
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "update"), System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "t")]
        public void updateSubtreeSize(Timeline t, int diff)
        {
            t.SubtreeSize += diff;
            TimelineRaw parentTimeline = _storage.GetParentTimelineRaw(t.Id);
            if (parentTimeline != null)
            {
                updateSubtreeSize(parentTimeline, diff);
            }
        }

        /// <summary>
        /// Retrieves a path to the given content id.
        /// 
        /// For t48fbb8a8-7c5d-49c3-83e1-98939ae2ae6, this API retrieves /t00000000-0000-0000-0000-000000000000/t48fbb8a8-7c5d-49c3-83e1-98939ae2ae67
        /// </summary>
        /// <returns>The full path to the content</returns>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "{supercollection}/{collection}/{reference}/contentpath")]
        public string GetContentPath(string superCollection, string collection, string reference)
        {
            Trace.TraceInformation("Get Content Information");
            
            Guid idCandidate = Guid.Empty;
            Guid? idParsed = null;
            if (Guid.TryParse(reference, out idCandidate))
            {
                idParsed = idCandidate;
                reference = null;
            }
            else
            {
                reference = FriendlyUrlDecode(reference);
            }

            Guid collectionId = CollectionIdOrDefault(superCollection, collection);

            string cacheKey = string.Format(CultureInfo.InvariantCulture, "ContentPath {0} {1} {2}", collectionId, idParsed.ToString(), reference);
            if (Cache.Contains(cacheKey))
                return (string)Cache[cacheKey];

            string value = _storage.GetContentPath(collectionId, idParsed, reference);
            Cache.Add(cacheKey, value, DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"], CultureInfo.InvariantCulture)));

            return value;
        }

        private bool FindParentTimeline(Guid? parentTimelineGuid, out Timeline parentTimeline)
        {
            parentTimeline = null;

            // If parent timeline is not specified it will default to null
            if (parentTimelineGuid == null)
            {
                return true;
            }

            parentTimeline = _storage.Timelines.Find(parentTimelineGuid);
            if (parentTimeline == null)
            {
                // Parent id is not found so no timeline will be added
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ParentTimelineNotFound);
                return false;
            }
            return true;
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

        // Performs an operation under an authenticated user.
        private static T AuthenticatedOperation<T>(Func<User, T> operation)
        {
            Microsoft.IdentityModel.Claims.ClaimsIdentity claimsIdentity = HttpContext.Current.User.Identity as Microsoft.IdentityModel.Claims.ClaimsIdentity;

            if (claimsIdentity == null || !claimsIdentity.IsAuthenticated)
            {
                return operation(null);
            }

            Microsoft.IdentityModel.Claims.Claim nameIdentifierClaim = claimsIdentity.Claims.Where(candidate => candidate.ClaimType.EndsWith("nameidentifier", StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
            if (nameIdentifierClaim == null)
            {
                return operation(null);
            }

            Microsoft.IdentityModel.Claims.Claim identityProviderClaim = claimsIdentity.Claims.Where(candidate => candidate.ClaimType.EndsWith("identityprovider", StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
            if (identityProviderClaim == null)
            {
                return operation(null);
            }

            User user = new User();
            user.NameIdentifier = nameIdentifierClaim.Value;
            user.IdentityProvider = identityProviderClaim.Value;

            return operation(user);
        }

        // Helper to AuthenticatedOperation to handle void.
        private static void AuthenticatedOperation(Action<User> operation)
        {
            AuthenticatedOperation<bool>(user =>
            {
                operation(user);
                return true;
            });
        }

        // Can a given GetTimelines request be cached?
        private bool CanCacheGetTimelines(User user, Guid collectionId)
        {
            string cacheKey = string.Format(CultureInfo.InvariantCulture, "Collection-To-Owner {0}", collectionId);
            if (!Cache.Contains(cacheKey))
            {
                Collection collection = RetrieveCollection(collectionId);

                string ownerNameIdentifier = collection == null || collection.User == null || collection.User.NameIdentifier == null ? "" : collection.User.NameIdentifier;
                Cache.Add(cacheKey, ownerNameIdentifier, DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"], CultureInfo.InvariantCulture)));
            }

            string userNameIdentifier = user == null || user.NameIdentifier == null ? "" : user.NameIdentifier;

            // Can cache as long as the user does not own the collection.
            return (string)Cache[cacheKey] != userNameIdentifier;
        }

        // Retrieves the cached timeline.
        // Null if not cached.
        private static Timeline GetCachedGetTimelines(Guid collectionId, string start, string end, string minspan, string lca, string maxElements)
        {
            string cacheKey = string.Format(CultureInfo.InvariantCulture, "GetTimelines {0}|{1}|{2}|{3}|{4}|{5}", collectionId, start, end, minspan, lca, maxElements);
            if (Cache.Contains(cacheKey))
            {
                return (Timeline)Cache[cacheKey];
            }

            return null;
        }

        // Caches the given timeline for the given GetTimelines request.
        private static void CacheGetTimelines(Timeline timeline, Guid collectionId, string start, string end, string minspan, string lca, string maxElements)
        {
            string cacheKey = string.Format(CultureInfo.InvariantCulture, "GetTimelines {0}|{1}|{2}|{3}|{4}|{5}", collectionId, start, end, minspan, lca, maxElements);
            if (!Cache.Contains(cacheKey) && timeline != null)
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

        private Collection RetrieveCollection(Guid collectionId)
        {
            Collection collection = _storage.Collections.Find(collectionId);
            _storage.Entry(collection).Reference("User").Load();
            return collection;
        }

        private SuperCollection RetrieveSuperCollection(Guid superCollectionId)
        {
            SuperCollection superCollection = _storage.SuperCollections.Find(superCollectionId);
            _storage.Entry(superCollection).Reference("User").Load();
            return superCollection;
        }
    }
}