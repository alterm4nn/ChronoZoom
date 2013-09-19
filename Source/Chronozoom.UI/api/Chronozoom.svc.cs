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
using System.Data.Entity;

using Chronozoom.UI.Utils;
using System.ServiceModel.Description;
using System.Text.RegularExpressions;

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
        [DataMember(Name = "thumbnailsPath")]
        public Uri ThumbnailsPath { get; set; }

        /// <summary>
        /// The URL to sign in with Microsoft account.
        /// </summary>
        [DataMember(Name = "signinUrlMicrosoft")]
        public Uri SignInUrlMicrosoft { get; set; }

        /// <summary>
        /// The URL to sign in with Google account.
        /// </summary>
        [DataMember(Name = "signinUrlGoogle")]
        public Uri SignInUrlGoogle { get; set; }

        /// <summary>
        /// The URL to sign in with Yahoo account.
        /// </summary>
        [DataMember(Name = "signinUrlYahoo")]
        public Uri SignInUrlYahoo { get; set; }
    }

    public class PutExhibitResult
    {
        private List<Guid> _contentItemId;
        public string errorMessage;

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
            errorMessage = "";
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
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public partial class ChronozoomSVC : IChronozoomSVC
    {
        private static readonly StorageCache Cache = new StorageCache();

        private static readonly TraceSource Trace = new TraceSource("Service", SourceLevels.All) { Listeners = { Global.SignalRTraceListener } };
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
            if (string.IsNullOrEmpty(ConfigurationManager.AppSettings["ThumbnailsPath"]))
                return null;

            return new Uri(ConfigurationManager.AppSettings["ThumbnailsPath"]);
        });

        // The login URL to sign in with Microsoft account
        private static Lazy<Uri> _signinUrlMicrosoft = new Lazy<Uri>(() =>
        {
            if (string.IsNullOrEmpty(ConfigurationManager.AppSettings["SignInUrlMicrosoft"]))
                return new Uri(@"https://login.live.com/login.srf?wa=wsignin1.0&wtrealm=https%3a%2f%2faccesscontrol.windows.net%2f&wreply=https%3a%2f%2fcz-nodelete-chronozoom-test.accesscontrol.windows.net%2fv2%2fwsfederation&wp=MBI_FED_SSL&wctx=cHI9d3NmZWRlcmF0aW9uJnJtPWh0dHAlM2ElMmYlMmZ0ZXN0LmNocm9ub3pvb21wcm9qZWN0Lm9yZyUyZiZjeD1ybSUzZDAlMjZpZCUzZHBhc3NpdmUlMjZydSUzZCUyNTJmYWNjb3VudCUyNTJmbG9naW41");

            return new Uri(ConfigurationManager.AppSettings["SignInUrlMicrosoft"]);
        });

        // The login URL to sign in with Google account
        private static Lazy<Uri> _signinUrlGoogle = new Lazy<Uri>(() =>
        {
            if (string.IsNullOrEmpty(ConfigurationManager.AppSettings["SignInUrlGoogle"]))
                return new Uri(@"https://www.google.com/accounts/o8/ud?openid.ns=http%3a%2f%2fspecs.openid.net%2fauth%2f2.0&openid.mode=checkid_setup&openid.claimed_id=http%3a%2f%2fspecs.openid.net%2fauth%2f2.0%2fidentifier_select&openid.identity=http%3a%2f%2fspecs.openid.net%2fauth%2f2.0%2fidentifier_select&openid.realm=https%3a%2f%2fcz-nodelete-chronozoom-test.accesscontrol.windows.net%3a443%2fv2%2fopenid&openid.return_to=https%3a%2f%2fcz-nodelete-chronozoom-test.accesscontrol.windows.net%3a443%2fv2%2fopenid%3fcontext%3dcHI9d3NmZWRlcmF0aW9uJnJtPWh0dHAlM2ElMmYlMmZ0ZXN0LmNocm9ub3pvb21wcm9qZWN0Lm9yZyUyZiZjeD1ybSUzZDAlMjZpZCUzZHBhc3NpdmUlMjZydSUzZCUyNTJmYWNjb3VudCUyNTJmbG9naW4mcHJvdmlkZXI9R29vZ2xl0&openid.ns.ax=http%3a%2f%2fopenid.net%2fsrv%2fax%2f1.0&openid.ax.mode=fetch_request&openid.ax.required=email%2cfullname%2cfirstname%2clastname&openid.ax.type.email=http%3a%2f%2faxschema.org%2fcontact%2femail&openid.ax.type.fullname=http%3a%2f%2faxschema.org%2fnamePerson&openid.ax.type.firstname=http%3a%2f%2faxschema.org%2fnamePerson%2ffirst&openid.ax.type.lastname=http%3a%2f%2faxschema.org%2fnamePerson%2flast");

            return new Uri(ConfigurationManager.AppSettings["SignInUrlGoogle"]);
        });

        // The login URL to sign in with Yahoo account
        private static Lazy<Uri> _signinUrlYahoo = new Lazy<Uri>(() =>
        {
            if (string.IsNullOrEmpty(ConfigurationManager.AppSettings["SignInUrlYahoo"]))
                return new Uri("https://open.login.yahooapis.com/openid/op/auth?openid.ns=http%3a%2f%2fspecs.openid.net%2fauth%2f2.0&openid.mode=checkid_setup&openid.claimed_id=http%3a%2f%2fspecs.openid.net%2fauth%2f2.0%2fidentifier_select&openid.identity=http%3a%2f%2fspecs.openid.net%2fauth%2f2.0%2fidentifier_select&openid.realm=https%3a%2f%2fcz-nodelete-chronozoom-test.accesscontrol.windows.net%3a443%2fv2%2fopenid&openid.return_to=https%3a%2f%2fcz-nodelete-chronozoom-test.accesscontrol.windows.net%3a443%2fv2%2fopenid%3fcontext%3dcHI9d3NmZWRlcmF0aW9uJnJtPWh0dHAlM2ElMmYlMmZ0ZXN0LmNocm9ub3pvb21wcm9qZWN0Lm9yZyUyZiZjeD1ybSUzZDAlMjZpZCUzZHBhc3NpdmUlMjZydSUzZCUyNTJmYWNjb3VudCUyNTJmbG9naW4mcHJvdmlkZXI9WWFob28h0&openid.ns.ax=http%3a%2f%2fopenid.net%2fsrv%2fax%2f1.0&openid.ax.mode=fetch_request&openid.ax.required=email%2cfullname%2cfirstname%2clastname&openid.ax.type.email=http%3a%2f%2faxschema.org%2fcontact%2femail&openid.ax.type.fullname=http%3a%2f%2faxschema.org%2fnamePerson&openid.ax.type.firstname=http%3a%2f%2faxschema.org%2fnamePerson%2ffirst&openid.ax.type.lastname=http%3a%2f%2faxschema.org%2fnamePerson%2flast");

            return new Uri(ConfigurationManager.AppSettings["SignInUrlYahoo"]);
        });

        private static Lazy<ThumbnailGenerator> _thumbnailGenerator = new Lazy<ThumbnailGenerator>(() =>
        {
            string thumbnailStorage = null;
            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["ThumbnailStorage"]))
            {
                thumbnailStorage = ConfigurationManager.AppSettings["ThumbnailStorage"];
            }

            return new ThumbnailGenerator(thumbnailStorage);
        });

        // The Maximum number of elements retured in a Search
        private const int MaxSearchLimit = 50;

        // Is default progressive load enabled?
        private static Lazy<bool> _progressiveLoadEnabled = new Lazy<bool>(() =>
        {
            string progressiveLoadEnabled = ConfigurationManager.AppSettings["ProgressiveLoadEnabled"];

            return string.IsNullOrEmpty(progressiveLoadEnabled) ? true : bool.Parse(progressiveLoadEnabled);
        });

        private static Guid _defaultSuperCollectionId = Guid.Empty;

        // error code descriptions
        private static partial class ErrorDescription
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
            public const string TourNotFound = "Tour not found";
            public const string TourIdShouldBeNull = "Tour id is null";
            public const string TourIdCannotBeNull = "Tour id cannot be null";
            public const string TourIdMismatch = "Tour id mismatch";
            public const string BookmarkNotFound = "Bookmark not found";
            public const string BookmarkSequenceIdDuplicate = "Bookmark sequence id already exists";
            public const string BookmarkSequenceIdInvalid = "Bookmark sequence id is invalid";
            public const string BookmarkIdInvalid = "Bookmark sequence id is invalid";
            public const string ParentTimelineCollectionMismatch = "Parent timeline does not match collection timeline";
            public const string InvalidContentItemUrl = "Artifact URL is invalid";
            public const string InvalidMediaSourceUrl = "Media Source URL is invalid";
            public const string CollectionRootTimelineExists = "Root timeline for the collection already exists";
        }

        private static Lazy<ChronozoomSVC> _sharedService = new Lazy<ChronozoomSVC>(() =>
        {
            return new ChronozoomSVC();
        });

        internal static IChronozoomSVC Instance
        {
            get { return _sharedService.Value; }
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "minspan")]
        public Timeline GetTimelines(string superCollection, string collection, string start, string end, string minspan, string commonAncestor, string maxElements, string depth)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                Trace.TraceInformation("Get Timelines");

                Guid collectionId = CollectionIdOrDefault(storage, superCollection, collection);

                // getTimelines for origin collection may be cached
                if (superCollection == null || CanCacheGetTimelines(storage, user, collectionId))
                {
                    Timeline cachedTimeline = GetCachedGetTimelines(collectionId, start, end, minspan, commonAncestor, maxElements, depth);
                    if (cachedTimeline != null)
                    {
                        return cachedTimeline;
                    }
                }

                // initialize filters
                decimal startTime = string.IsNullOrWhiteSpace(start) ? _minYear : decimal.Parse(start, CultureInfo.InvariantCulture);
                decimal endTime = string.IsNullOrWhiteSpace(end) ? _maxYear : decimal.Parse(end, CultureInfo.InvariantCulture);
                decimal span = string.IsNullOrWhiteSpace(minspan) ? 0 : decimal.Parse(minspan, CultureInfo.InvariantCulture);
                Guid lcaParsed = string.IsNullOrWhiteSpace(commonAncestor) ? Guid.Empty : Guid.Parse(commonAncestor);
                int maxElementsParsed = string.IsNullOrWhiteSpace(maxElements) ? _maxElements.Value : int.Parse(maxElements, CultureInfo.InvariantCulture);
                int depthParsed = string.IsNullOrWhiteSpace(depth) ? _defaultDepth : int.Parse(depth, CultureInfo.InvariantCulture);

                IEnumerable<Timeline> timelines = null;
                if (!_progressiveLoadEnabled.Value || !string.IsNullOrWhiteSpace(depth))
                    timelines = storage.TimelinesQuery(collectionId, startTime, endTime, span, lcaParsed == Guid.Empty ? (Guid?)null : lcaParsed, maxElementsParsed, depthParsed);
                else
                {
                    if (ShouldRetrieveAllTimelines(storage, commonAncestor, collectionId, maxElementsParsed))
                    {
                        timelines = storage.RetrieveAllTimelines(collectionId);
                    }
                    else
                    {
                        Trace.TraceInformation("Get Timelines - Using Progressive Load");
                        timelines = storage.TimelineSubtreeQuery(collectionId, lcaParsed, startTime, endTime, span, maxElementsParsed);
                    }
                }

                Timeline timeline = timelines.Where(candidate => candidate.Id == lcaParsed).FirstOrDefault();

                if (timeline == null)
                    timeline = timelines.FirstOrDefault();

                // Cache getTimeline only for origin collection
                if (superCollection == null)
                {
                    CacheGetTimelines(timeline, collectionId, start, end, minspan, commonAncestor, maxElements, depth);
                }

                return timeline;
            });
        }

        private static bool ShouldRetrieveAllTimelines(Storage storage, string commonAncestor, Guid collectionId, int maxElements)
        {
            if (!string.IsNullOrEmpty(commonAncestor))
                return false;

            Timeline rootTimeline = storage.GetRootTimelines(collectionId);

            if (rootTimeline == null)
                return true;

            if (rootTimeline.SubtreeSize < maxElements)
                return true;

            return false;
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        public BaseJsonResult<IEnumerable<SearchResult>> Search(string superCollection, string collection, string searchTerm)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    Trace.TraceEvent(TraceEventType.Warning, 0, "Search called with null search term");
                    return null;
                }

                Guid collectionId = CollectionIdOrDefault(storage, superCollection, collection);
                searchTerm = searchTerm.ToUpperInvariant();

                var timelines = storage.Timelines.Where(_ => _.Title.ToUpper().Contains(searchTerm) && _.Collection.Id == collectionId).Take(MaxSearchLimit).ToList();
                var searchResults = timelines.Select(timeline => new SearchResult { Id = timeline.Id, Title = timeline.Title, ObjectType = ObjectType.Timeline }).ToList();

                var exhibits = storage.Exhibits.Where(_ => _.Title.ToUpper().Contains(searchTerm) && _.Collection.Id == collectionId).Take(MaxSearchLimit).ToList();
                searchResults.AddRange(exhibits.Select(exhibit => new SearchResult { Id = exhibit.Id, Title = exhibit.Title, ObjectType = ObjectType.Exhibit }));

                var contentItems = storage.ContentItems.Where(_ =>
                    (_.Title.ToUpper().Contains(searchTerm) || _.Caption.ToUpper().Contains(searchTerm))
                     && _.Collection.Id == collectionId
                    ).Take(MaxSearchLimit).ToList();
                searchResults.AddRange(contentItems.Select(contentItem => new SearchResult { Id = contentItem.Id, Title = contentItem.Title, ObjectType = ObjectType.ContentItem }));

                Trace.TraceInformation("Search called for search term {0}", searchTerm);
                return new BaseJsonResult<IEnumerable<SearchResult>>(searchResults);
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/tours")]
        public BaseJsonResult<IEnumerable<Tour>> GetDefaultTours()
        {
            return GetTours("", "");
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        public BaseJsonResult<IEnumerable<Tour>> GetTours(string superCollection, string collection)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                Trace.TraceInformation("Get Tours");

                Guid collectionId = CollectionIdOrDefault(storage, superCollection, collection);
                lock (Cache)
                {
                    string toursCacheKey = string.Format(CultureInfo.InvariantCulture, "Tour {0}", collectionId);
                    if (!Cache.Contains(toursCacheKey))
                    {
                        Trace.TraceInformation("Get Tours Cache Miss for collection " + collectionId);
                        var tours = storage.Tours.Where(candidate => candidate.Collection.Id == collectionId).ToList();
                        foreach (var t in tours)
                        {
                            storage.Entry(t).Collection(x => x.Bookmarks).Load();
                            var orderedBookmarks = t.Bookmarks.OrderBy(candidate => candidate.SequenceId);
                            t.Bookmarks = new Collection<Bookmark>();
                            foreach (Bookmark bookmark in orderedBookmarks)
                            {
                                t.Bookmarks.Add(bookmark);
                            }
                        }

                        Cache.Add(toursCacheKey, tours);
                    }

                    return new BaseJsonResult<IEnumerable<Tour>>((List<Tour>)Cache[toursCacheKey]);
                }
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public String PutUser(User userRequest)
        {
            return ApiOperation<String>(delegate(User user, Storage storage)
            {
                Trace.TraceInformation("Put User");

                if (userRequest == null)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                    return string.Empty;
                }

                if (user == null || string.IsNullOrEmpty(user.NameIdentifier))
                {
                    SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                    return string.Empty; ;
                }

                Uri collectionUri;
                User updateUser = storage.Users.Where(candidate => candidate.DisplayName == userRequest.DisplayName).FirstOrDefault();
                if (userRequest.Id == Guid.Empty && updateUser == null)
                {
                    // Add new user
                    User newUser = new User { Id = Guid.NewGuid(), DisplayName = userRequest.DisplayName, Email = userRequest.Email };
                    newUser.NameIdentifier = user.NameIdentifier;
                    newUser.IdentityProvider = user.IdentityProvider;
                    collectionUri = EnsurePersonalCollection(storage, newUser);
                }
                else
                {
                    if (updateUser == null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.UserNotFound);
                        return String.Empty;
                    }

                    if (user == null || string.IsNullOrEmpty(user.NameIdentifier) || user.NameIdentifier != updateUser.NameIdentifier)
                    {
                        SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                        return string.Empty; ;
                    }

                    updateUser.Email = userRequest.Email;
                    collectionUri = EnsurePersonalCollection(storage, updateUser);
                    storage.SaveChanges();
                }

                return collectionUri.ToString();
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        [SuppressMessage("Microsoft.Performance", "CA1822:MarkMembersAsStatic")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        public ServiceInformation GetServiceInformation()
        {
            Trace.TraceInformation("Get Service Information");

            ServiceInformation serviceInformation = new ServiceInformation();
            serviceInformation.ThumbnailsPath = _thumbnailsPath.Value;
            serviceInformation.SignInUrlMicrosoft = _signinUrlMicrosoft.Value;
            serviceInformation.SignInUrlGoogle = _signinUrlGoogle.Value;
            serviceInformation.SignInUrlYahoo = _signinUrlYahoo.Value;

            return serviceInformation;
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public void DeleteUser(User userRequest)
        {
            ApiOperation(delegate(User user, Storage storage)
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

                User deleteUser = storage.Users.Where(candidate => candidate.DisplayName == userRequest.DisplayName).FirstOrDefault();
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
                storage.Users.Remove(deleteUser);
                storage.SaveChanges();
                return;
            });
        }

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        public User GetUser()
        {
            return GetUser("");
        }


        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1026:DefaultParametersShouldNotBeUsed"), SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        public User GetUser(string name)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                if (String.IsNullOrEmpty(name))
                {

                    Trace.TraceInformation("Get User");
                    if (user == null)
                    {
                        SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.RequestBodyEmpty);
                        return new User();
                    }
                    var u = storage.Users.Where(candidate => candidate.NameIdentifier == user.NameIdentifier).FirstOrDefault();
                    if (u != null) return u;
                    return user;
                }
                else
                {
                    User u = storage.Users.Where(candidate => candidate.DisplayName == name).FirstOrDefault();
                    if (u == null) return u;
                    u.Email = String.Empty;
                    u.IdentityProvider = String.Empty;
                    u.NameIdentifier = String.Empty;
                    u.Id = Guid.Empty;
                    return u;
                }
            });
        }

        private static void DeleteSuperCollection(string superCollectionName)
        {
            ApiOperation(delegate(User user, Storage storage)
            {
                Trace.TraceInformation("Delete SuperCollection {0} from user {1} ", superCollectionName, user);

                Guid superCollectionId = CollectionIdFromText(superCollectionName);
                SuperCollection superCollection = RetrieveSuperCollection(storage, superCollectionId);
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

                storage.SuperCollections.Remove(superCollection);
                storage.SaveChanges();
            });
        }

        private static Uri UpdatePersonalCollection(Storage storage, string userId, User user)
        {
            if (string.IsNullOrEmpty(userId))
            {
                // Anonymous user so use the sandbox superCollection and collection
                SuperCollection sandboxSuperCollection = storage.SuperCollections.Where(candidate => candidate.Title == _sandboxSuperCollectionName).FirstOrDefault();
                if (sandboxSuperCollection == null)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.SandboxSuperCollectionNotFound);
                    return new Uri(string.Format(
                        CultureInfo.InvariantCulture,
                        @"{0}/{1}/",
                        String.Empty,
                        String.Empty), UriKind.Relative);
                }
                else
                {
                    return new Uri(string.Format(
                        CultureInfo.InvariantCulture,
                        @"{0}/{1}/",
                        FriendlyUrlReplacements(sandboxSuperCollection.Title),
                        _sandboxCollectionName), UriKind.Relative);
                }
            }

            SuperCollection superCollection = storage.SuperCollections.Where(candidate => candidate.User.NameIdentifier == user.NameIdentifier).FirstOrDefault();
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
                Timeline rootTimeline = new Timeline { Id = Guid.NewGuid(), Title = "Cosmos", Regime = "Cosmos" };
                rootTimeline.FromYear = -13700000000;
                rootTimeline.ToYear = 9999;
                rootTimeline.Collection = personalCollection;
                rootTimeline.Depth = 0;

                storage.SuperCollections.Add(superCollection);
                storage.Collections.Add(personalCollection);
                storage.Timelines.Add(rootTimeline);
                storage.SaveChanges();

                Trace.TraceInformation("Personal collection saved.");
            }

            return new Uri(string.Format(
                CultureInfo.InvariantCulture,
                @"{0}/{1}/",
                FriendlyUrlReplacements(superCollection.Title),
                FriendlyUrlReplacements(superCollection.Title)), UriKind.Relative);
        }

        private static Uri EnsurePersonalCollection(Storage storage, User user)
        {
            SuperCollection superCollection = storage.SuperCollections.Where(candidate => candidate.User.NameIdentifier == user.NameIdentifier).FirstOrDefault();
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
                storage.SuperCollections.Add(superCollection);
                storage.Collections.Add(personalCollection);
                storage.SaveChanges();

                Trace.TraceInformation("Personal collection saved.");
            }

            return new Uri(string.Format(
                CultureInfo.InvariantCulture,
                @"{0}/{1}/",
                FriendlyUrl.FriendlyUrlEncode(superCollection.Title),
                FriendlyUrl.FriendlyUrlEncode(superCollection.Title)), UriKind.Relative);
        }

        private static Guid CollectionIdOrDefault(Storage storage, string superCollectionName, string collectionName)
        {
            if (string.IsNullOrEmpty(superCollectionName))
            {
                if (_defaultSuperCollectionId != Guid.Empty)
                    return _defaultSuperCollectionId;

                string defaultSuperCollection = ConfigurationManager.AppSettings["DefaultSuperCollection"];
                SuperCollection superCollection = storage.SuperCollections.Where(candidate => candidate.Title == defaultSuperCollection).FirstOrDefault();
                if (superCollection == null)
                    superCollection = storage.SuperCollections.FirstOrDefault();

                storage.Entry(superCollection).Collection(_ => _.Collections).Load();

                _defaultSuperCollectionId = superCollection.Collections.FirstOrDefault().Id;
                return _defaultSuperCollectionId;
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
        /// Documentation under IChronozoomSVC
        /// </summary>
        public Guid PostCollection(string superCollectionName, string collectionName, Collection collectionRequest)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                Trace.TraceInformation("Put Collection {0} from user {1} in superCollection {2}", collectionName, user, superCollectionName);

                Guid returnValue = Guid.Empty;

                if (collectionRequest == null)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                    return Guid.Empty;
                }

                Guid superCollectionId = CollectionIdFromText(superCollectionName);
                SuperCollection superCollection = RetrieveSuperCollection(storage, superCollectionId);
                if (user == null || superCollection.User == null || superCollection.User.NameIdentifier != user.NameIdentifier)
                {
                    // No ACS so treat as an anonymous user who cannot add or modify a collection.
                    SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                    return Guid.Empty;
                }

                Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                Collection collection = RetrieveCollection(storage, collectionGuid);
                if (collection == null)
                {
                    collection = new Collection { Id = collectionGuid, Title = collectionName, User = user };
                    storage.Collections.Add(collection);
                    returnValue = collectionGuid;
                }

                storage.SaveChanges();
                return returnValue;
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public Guid PutCollection(string superCollectionName, string collectionName, Collection collectionRequest)
        {
            return ApiOperationUnderCollection(collectionRequest, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                Trace.TraceInformation("Put Collection {0} from user {1} in superCollection {2}", collectionName, user, superCollectionName);

                collection.Theme = collectionRequest.Theme;

                storage.SaveChanges();
                return collection.Id;
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public void DeleteCollection(string superCollectionName, string collectionName)
        {
            ApiOperation(delegate(User user, Storage storage)
            {
                Trace.TraceInformation("Delete Collection {0} from user {1} in superCollection {2}", collectionName, user, superCollectionName);

                Guid collectionId = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                Collection collection = RetrieveCollection(storage, collectionId);
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

                storage.Collections.Remove(collection);
                storage.SaveChanges();
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public Guid PutTimeline(string superCollectionName, string collectionName, TimelineRaw timelineRequest)
        {
            return ApiOperationUnderCollection(timelineRequest, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                Trace.TraceInformation("Put Timeline");

                Guid returnValue;
                if (timelineRequest.Id == Guid.Empty)
                {
                    Timeline parentTimeline;
                    if (!FindParentTimeline(storage, timelineRequest.Timeline_ID, out parentTimeline))
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ParentTimelineNotFound);
                        return Guid.Empty;
                    }

                    if (parentTimeline != null && !ValidateTimelineInCollection(storage, timelineRequest.Timeline_ID, collection.Id))
                    {
                        return Guid.Empty;
                    }

                    // Prevent more than one root timeline from being created in the same collection
                    if (parentTimeline == null && storage.GetRootTimelines(collection.Id) != null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionRootTimelineExists);
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
                        storage.Entry(parentTimeline).Collection(_ => _.ChildTimelines).Load();
                        if (parentTimeline.ChildTimelines == null)
                        {
                            parentTimeline.ChildTimelines = new System.Collections.ObjectModel.Collection<Timeline>();
                        }
                        newTimeline.Depth = parentTimeline.Depth + 1;

                        parentTimeline.ChildTimelines.Add(newTimeline);
                        UpdateSubtreeSize(storage, parentTimeline, 1);
                    }
                    else
                    {
                        newTimeline.Depth = 0;
                        newTimeline.SubtreeSize = 1;
                    }
                    storage.Timelines.Add(newTimeline);

                    returnValue = newTimelineGuid;
                }
                else
                {
                    Guid updateTimelineGuid = timelineRequest.Id;
                    Timeline updateTimeline = storage.Timelines.Find(updateTimelineGuid);
                    if (updateTimeline == null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TimelineNotFound);
                        return Guid.Empty;
                    }

                    if (updateTimeline.Collection.Id != collection.Id)
                    {
                        SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                        return Guid.Empty;
                    }

                    TimelineRaw parentTimelineRaw = storage.GetParentTimelineRaw(updateTimeline.Id);

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
                storage.SaveChanges();
                return returnValue;
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public void DeleteTimeline(string superCollectionName, string collectionName, Timeline timelineRequest)
        {
            ApiOperationUnderCollection(timelineRequest, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                Trace.TraceInformation("Delete Timeline");

                if (timelineRequest.Id == Guid.Empty)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TimelineNull);
                    return;
                }

                Timeline deleteTimeline = storage.Timelines.Find(timelineRequest.Id);
                if (deleteTimeline == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TimelineNotFound);
                    return;
                }

                if (deleteTimeline.Collection.Id != collection.Id)
                {
                    SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                    return;
                }
                Timeline parentTimeline = storage.GetParentTimelineRaw(timelineRequest.Id);
                UpdateSubtreeSize(storage, parentTimeline, (deleteTimeline.SubtreeSize > 0 ? -deleteTimeline.SubtreeSize : 0) - 1);

                storage.DeleteTimeline(timelineRequest.Id);
                storage.SaveChanges();
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
        /// Documentation under IChronozoomSVC
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity"), System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        public PutExhibitResult PutExhibit(string superCollectionName, string collectionName, ExhibitRaw exhibitRequest)
        {
            return ApiOperationUnderCollection(exhibitRequest, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                Trace.TraceInformation("Put Exhibit");
                var returnValue = new PutExhibitResult();

                foreach (ContentItem contentItemRequest in exhibitRequest.ContentItems)
                {
                    if (!ValidateContentItemUrl(contentItemRequest, out returnValue.errorMessage))
                    {
                        returnValue.errorMessage += " in '" + contentItemRequest.Title + "' artifact.";
                        return returnValue;
                    }
                }

                if (exhibitRequest.Id == Guid.Empty)
                {
                    Timeline parentTimeline;
                    if (!FindParentTimeline(storage, exhibitRequest.Timeline_ID, out parentTimeline) || parentTimeline == null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ParentTimelineNotFound);
                        return returnValue;
                    }

                    if (!ValidateTimelineInCollection(storage, exhibitRequest.Timeline_ID, collection.Id))
                    {
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
                    storage.Entry(parentTimeline).Collection(_ => _.Exhibits).Load();
                    if (parentTimeline.Exhibits == null)
                    {
                        parentTimeline.Exhibits = new System.Collections.ObjectModel.Collection<Exhibit>();
                    }
                    parentTimeline.Exhibits.Add(newExhibit);

                    storage.Exhibits.Add(newExhibit);
                    UpdateSubtreeSize(storage, parentTimeline, 1 + (newExhibit.ContentItems != null ? newExhibit.ContentItems.Count() : 0));

                    returnValue.ExhibitId = newExhibitGuid;

                    // Populate the content items
                    if (exhibitRequest.ContentItems != null)
                    {
                        foreach (ContentItem contentItemRequest in exhibitRequest.ContentItems)
                        {
                            // Parent exhibit item will be equal to the newly added exhibit
                            contentItemRequest.Id = AddContentItem(storage, collection, newExhibit, contentItemRequest);
                            returnValue.Add(contentItemRequest.Id);
                        }
                    }
                }
                else
                {
                    Exhibit updateExhibit = storage.Exhibits.Find(exhibitRequest.Id);
                    if (updateExhibit == null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ExhibitNotFound);
                        return returnValue;
                    }

                    if (updateExhibit.Collection.Id != collection.Id)
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
                        // For each contentItem not in the request, mark for deletion
                        storage.Entry(updateExhibit).Collection(_ => _.ContentItems).Load();
                        List<ContentItem> contentItemsForDeletion = new List<ContentItem>();
                        foreach (ContentItem contentItemInStorage in updateExhibit.ContentItems)
                            if (!exhibitRequest.ContentItems.Any(candidate => candidate.Id == contentItemInStorage.Id))
                                contentItemsForDeletion.Add(contentItemInStorage);

                        // For each contentItem not in the request, delete
                        foreach (ContentItem contentItemForDeletion in contentItemsForDeletion)
                            storage.ContentItems.Remove(contentItemForDeletion);

                        // For each object in the request, either update or add.
                        foreach (ContentItem contentItemRequest in exhibitRequest.ContentItems)
                        {
                            if (storage.ContentItems.Any(candidate => candidate.Id == contentItemRequest.Id))
                            {
                                Guid updateContentItemGuid = UpdateContentItem(storage, collection.Id, contentItemRequest);
                                if (updateContentItemGuid != Guid.Empty)
                                {
                                    returnValue.Add(updateContentItemGuid);
                                }
                            }
                            else
                            {
                                // Parent exhibit item will be equal to the newly added exhibit
                                contentItemRequest.Id = AddContentItem(storage, collection, updateExhibit, contentItemRequest);
                                returnValue.Add(contentItemRequest.Id);
                            }
                        }
                    }
                }
                storage.SaveChanges();

                if (exhibitRequest.ContentItems != null)
                {
                    foreach (ContentItem contentItem in exhibitRequest.ContentItems)
                    {
                        _thumbnailGenerator.Value.CreateThumbnails(contentItem);
                    }
                }

                return returnValue;
            });
        }

        private static Guid UpdateContentItem(Storage storage, Guid collectionGuid, ContentItem contentItemRequest)
        {
            ContentItem updateContentItem = storage.ContentItems.Find(contentItemRequest.Id);
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
            updateContentItem.Order = contentItemRequest.Order;
            return contentItemRequest.Id;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1304:SpecifyCultureInfo", MessageId = "System.String.ToLower")]
        private static Boolean ValidateContentItemUrl(ContentItem contentitem, out string error)
        {
            string contentitemURI = contentitem.Uri;
            error = "";

            // Custom validation for Skydrive images
            if (contentitem.MediaType == "skydrive-image")
            {
                // Parse url parameters. url pattern is - {url} {width} {height}
                var splited = contentitem.Uri.Split(' ');

                // Not enough parameters in url
                if (splited.Length != 3)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.InvalidContentItemUrl);
                    error = ErrorDescription.InvalidContentItemUrl;

                    return false;
                }

                contentitemURI = splited[0];

                // Validate width and height are numbers
                int value;
                if (!Int32.TryParse(splited[1], out value) || !Int32.TryParse(splited[2], out value))
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.InvalidContentItemUrl);
                    error = ErrorDescription.InvalidContentItemUrl;

                    return false;
                }
            }


            Uri uriResult;

            // If Media Source is present, validate it
            if (contentitem.MediaSource.Length > 0 && !(Uri.TryCreate(contentitem.MediaSource, UriKind.Absolute, out uriResult) && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps)))
            {
                SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.InvalidMediaSourceUrl);
                error = ErrorDescription.InvalidMediaSourceUrl;

                return false;
            }

            // Check if valid url
            if (!(Uri.TryCreate(contentitemURI, UriKind.Absolute, out uriResult) && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps)))
            {
                SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.InvalidContentItemUrl);
                error = ErrorDescription.InvalidContentItemUrl;

                return false;
            }

            return true;
        }

        private static Guid AddContentItem(Storage storage, Collection collection, Exhibit newExhibit, ContentItem contentItemRequest)
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
                Order = contentItemRequest.Order,
                Depth = newExhibit.Depth + 1
            };
            newContentItem.Collection = collection;

            // Update parent exhibit.
            if (newExhibit.ContentItems == null)
            {
                newExhibit.ContentItems = new System.Collections.ObjectModel.Collection<ContentItem>();
            }
            newExhibit.ContentItems.Add(newContentItem);
            storage.ContentItems.Add(newContentItem);
            return newContentItemGuid;
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public void DeleteExhibit(string superCollectionName, string collectionName, Exhibit exhibitRequest)
        {
            ApiOperationUnderCollection(exhibitRequest, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                Trace.TraceInformation("Delete Exhibit");

                if (exhibitRequest.Id == Guid.Empty)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ExhibitNotFound);
                    return;
                }

                Exhibit deleteExhibit = storage.Exhibits.Find(exhibitRequest.Id);
                if (deleteExhibit == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ExhibitNotFound);
                    return;
                }

                if (deleteExhibit.Collection == null || deleteExhibit.Collection.Id != collection.Id)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionIdMismatch);
                    return;
                }
                Timeline parentTimeline = storage.GetExhibitParentTimeline(deleteExhibit.Id);

                storage.Entry(deleteExhibit).Collection(_ => _.ContentItems).Load();
                UpdateSubtreeSize(storage, parentTimeline, (deleteExhibit.ContentItems != null ? -deleteExhibit.ContentItems.Count() : 0) - 1);

                storage.DeleteExhibit(exhibitRequest.Id);
                storage.SaveChanges();
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public Guid PutContentItem(string superCollectionName, string collectionName, ContentItemRaw contentItemRequest)
        {
            return ApiOperationUnderCollection(contentItemRequest, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                Trace.TraceInformation("Put Content Item");

                // junk out variable for ValidateContentItemUrl method
                string junk;

                if (!ValidateContentItemUrl(contentItemRequest, out junk))
                    return Guid.Empty;

                Guid returnValue;

                if (contentItemRequest.Id == Guid.Empty)
                {
                    Exhibit parentExhibit = FindParentExhibit(storage, contentItemRequest.Exhibit_ID);
                    if (parentExhibit == null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ParentExhibitNotFound);
                        return Guid.Empty;
                    }
                    storage.Entry(parentExhibit).Collection(_ => _.ContentItems).Load();

                    TimelineRaw parentTimeline = storage.GetExhibitParentTimeline(contentItemRequest.Exhibit_ID);

                    if (!ValidateTimelineInCollection(storage, parentTimeline.Id, collection.Id))
                    {
                        return Guid.Empty;
                    }

                    // Parent content item is valid - add new content item
                    var newContentItemGuid = AddContentItem(storage, collection, parentExhibit, contentItemRequest);
                    returnValue = newContentItemGuid;
                    UpdateSubtreeSize(storage, parentTimeline, 1);
                }
                else
                {
                    contentItemRequest.Id = UpdateContentItem(storage, collection.Id, contentItemRequest);
                    returnValue = contentItemRequest.Id;
                }

                storage.SaveChanges();
                _thumbnailGenerator.Value.CreateThumbnails(contentItemRequest);

                return returnValue;
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public void DeleteContentItem(string superCollectionName, string collectionName, ContentItem contentItemRequest)
        {
            ApiOperationUnderCollection(contentItemRequest, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                Trace.TraceInformation("Delete Content Item");

                if (contentItemRequest.Id == Guid.Empty)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ContentItemNotFound);
                    return;
                }

                ContentItem deleteContentItem = storage.ContentItems.Find(contentItemRequest.Id);
                if (deleteContentItem == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ContentItemNotFound);
                    return;
                }

                if (deleteContentItem.Collection == null || deleteContentItem.Collection.Id != collection.Id)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionIdMismatch);
                    return;
                }

                ExhibitRaw parentExhibit = storage.GetContentItemParentExhibit(deleteContentItem.Id);
                TimelineRaw parentTimeline = storage.GetExhibitParentTimeline(parentExhibit.Id);
                storage.ContentItems.Remove(deleteContentItem);
                UpdateSubtreeSize(storage, parentTimeline, -1);

                storage.SaveChanges();
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        public TourResult PostTour(string superCollectionName, string collectionName, Tour tourRequest)
        {
            return ApiOperationUnderCollection(tourRequest, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                Trace.TraceInformation("Post Tour");
                var returnValue = new TourResult();

                if (tourRequest.Id != Guid.Empty)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.TourIdShouldBeNull);
                    return returnValue;
                }

                // Add a new tour
                Guid newTourGuid = Guid.NewGuid();
                Tour newTour = new Tour { Id = newTourGuid };
                newTour.Name = tourRequest.Name;
                newTour.Description = tourRequest.Description;
                newTour.AudioBlobUrl = tourRequest.AudioBlobUrl;
                newTour.Collection = collection;

                storage.Tours.Add(newTour);
                storage.SaveChanges();
                returnValue.TourId = newTourGuid;

                // Populate the bookmarks.
                if (tourRequest.Bookmarks != null)
                {
                    foreach (Bookmark bookmarkRequest in tourRequest.Bookmarks)
                    {
                        var newBookmarkGuid = AddBookmark(storage, newTour, bookmarkRequest);
                        if (newBookmarkGuid != Guid.Empty)
                        {
                            returnValue.Add(newBookmarkGuid);
                        }
                    }
                }
                storage.SaveChanges();
                return returnValue;
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        public TourResult PutTour(string superCollectionName, string collectionName, Tour tourRequest)
        {
            return ApiOperationUnderCollection(tourRequest, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                Trace.TraceInformation("Put Tour");
                var returnValue = new TourResult();

                if (tourRequest.Id == Guid.Empty)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.TourIdCannotBeNull);
                    return returnValue;
                }

                Tour updateTour = storage.Tours.Find(tourRequest.Id);
                if (updateTour == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TourNotFound);
                    return returnValue;
                }

                if (updateTour.Collection.Id != collection.Id)
                {
                    SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                    return returnValue;
                }

                // Update the tour
                updateTour.Name = tourRequest.Name;
                updateTour.Description = tourRequest.Description;
                updateTour.AudioBlobUrl = tourRequest.AudioBlobUrl;
                returnValue.TourId = tourRequest.Id;

                // Update the bookmarks
                if (tourRequest.Bookmarks != null)
                {
                    foreach (Bookmark bookmarkRequest in tourRequest.Bookmarks)
                    {
                        Guid updateBookmarkGuid = UpdateBookmark(storage, updateTour, bookmarkRequest);
                        if (updateBookmarkGuid != Guid.Empty)
                        {
                            returnValue.Add(updateBookmarkGuid);
                        }
                    }
                }
                storage.SaveChanges();
                return returnValue;
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        public TourResult PutTour2(string superCollectionName, string collectionName, Tour tourRequest)
        {
            return ApiOperationUnderCollection(tourRequest, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                Trace.TraceInformation("Put Tour2");
                var returnValue = new TourResult();

                if (tourRequest.Id == Guid.Empty)
                {
                    // Add a new tour.
                    Guid newTourGuid = Guid.NewGuid();
                    Tour newTour = new Tour { Id = newTourGuid };
                    newTour.Name = tourRequest.Name;
                    newTour.Description = tourRequest.Description;
                    newTour.AudioBlobUrl = tourRequest.AudioBlobUrl;
                    newTour.Collection = collection;
                    storage.Tours.Add(newTour);
                    returnValue.TourId = newTourGuid;

                    AddBookmarks(storage, newTour, tourRequest.Bookmarks, returnValue);
                }
                else
                {
                    // Update an existing tour.
                    Tour updateTour = storage.Tours.Find(tourRequest.Id);
                    if (updateTour == null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TourNotFound);
                        return returnValue;
                    }

                    if (updateTour.Collection.Id != collection.Id)
                    {
                        SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                        return returnValue;
                    }

                    // Update the tour
                    updateTour.Name = tourRequest.Name;
                    updateTour.Description = tourRequest.Description;
                    updateTour.AudioBlobUrl = tourRequest.AudioBlobUrl;
                    returnValue.TourId = tourRequest.Id;

                    // Delete the existing bookmarks and add the bookmarks specified in the request object.
                    DeleteBookmarks(storage, updateTour);
                    AddBookmarks(storage, updateTour, tourRequest.Bookmarks, returnValue);
                }

                storage.SaveChanges();
                Cache.Remove(string.Format(CultureInfo.InvariantCulture, "Tour {0}", collection.Id));
                return returnValue;
            });
        }

        private static void AddBookmarks(Storage storage, Tour tour, Collection<Bookmark> bookmarkRequest, TourResult returnValue)
        {
            if (bookmarkRequest == null)
                return;

            int sequenceId = 1;
            foreach (Bookmark bookmark in bookmarkRequest)
            {
                Guid newBookmarkGuid = Guid.NewGuid();
                Bookmark newBookmark = new Bookmark
                {
                    Id = newBookmarkGuid,
                    SequenceId = sequenceId,
                    Name = bookmark.Name,
                    Url = bookmark.Url,
                    LapseTime = bookmark.LapseTime,
                    Description = bookmark.Description
                };

                if (tour.Bookmarks == null)
                {
                    tour.Bookmarks = new System.Collections.ObjectModel.Collection<Bookmark>();
                }

                tour.Bookmarks.Add(newBookmark);
                storage.Bookmarks.Add(newBookmark);
                returnValue.Add(newBookmarkGuid);
                sequenceId++;
            }

        }

        private static Guid UpdateBookmark(Storage storage, Tour updateTour, Bookmark bookmarkRequest)
        {
            Bookmark updateBookmark = storage.Bookmarks.Find(bookmarkRequest.Id);
            if (updateBookmark == null)
            {
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.BookmarkNotFound);
                return Guid.Empty;
            }

            // Validate permissions at the tour level.   
            // The bookmarks being updated should belong to the tour specified by tourGuid.  
            // If it belong to a different tour the update is disallowed.  
            Tour bookmarkTour = storage.GetBookmarkTour(updateBookmark);
            if (bookmarkTour == null | bookmarkTour.Id != updateTour.Id)
            {
                SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.TourIdMismatch);
                return Guid.Empty;
            }


            // Update the bookmark fields
            // Validate that the sequence id specified is a positive number and does not already exist.
            if (bookmarkRequest.SequenceId <= 0)
            {
                SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.BookmarkSequenceIdInvalid);
                return Guid.Empty;
            }

            // If the bookmark sequence id is unchanged then skip the uniqueness test.
            if (updateBookmark.SequenceId != bookmarkRequest.SequenceId)
            {
                storage.Entry(updateTour).Collection(_ => _.Bookmarks).Load();
                if (updateTour.Bookmarks != null)
                {
                    List<Bookmark> bookmarkList = updateTour.Bookmarks.ToList();
                    Bookmark sequenceIdBookmark = bookmarkList.Where(candidate => candidate.SequenceId == bookmarkRequest.SequenceId).FirstOrDefault();
                    if (sequenceIdBookmark != null)
                    {
                        SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.BookmarkSequenceIdDuplicate);
                        return Guid.Empty;
                    }
                }
            }

            updateBookmark.SequenceId = bookmarkRequest.SequenceId;
            updateBookmark.Name = bookmarkRequest.Name;
            updateBookmark.Url = bookmarkRequest.Url;
            updateBookmark.LapseTime = bookmarkRequest.LapseTime;
            updateBookmark.Description = bookmarkRequest.Description;

            return bookmarkRequest.Id;
        }

        private static Guid AddBookmark(Storage storage, Tour tour, Bookmark bookmarkRequest)
        {
            Guid newBookmarkGuid = Guid.NewGuid();
            Bookmark newBookmark = new Bookmark
            {
                Id = newBookmarkGuid,
                Name = bookmarkRequest.Name,
                Url = bookmarkRequest.Url,
                LapseTime = bookmarkRequest.LapseTime,
                Description = bookmarkRequest.Description
            };

            // Validate that the sequence id specified is a positive number and does not already exist.
            if (bookmarkRequest.SequenceId <= 0)
            {
                SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.BookmarkSequenceIdInvalid);
                return Guid.Empty;
            }

            storage.Entry(tour).Collection(_ => _.Bookmarks).Load();
            if (tour.Bookmarks == null)
            {
                tour.Bookmarks = new System.Collections.ObjectModel.Collection<Bookmark>();
            }
            List<Bookmark> bookmarkList = tour.Bookmarks.ToList();
            Bookmark sequenceIdBookmark = bookmarkList.Where(candidate => candidate.SequenceId == bookmarkRequest.SequenceId).FirstOrDefault();
            if (sequenceIdBookmark != null)
            {
                SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.BookmarkSequenceIdDuplicate);
                return Guid.Empty;
            }
            newBookmark.SequenceId = bookmarkRequest.SequenceId;

            tour.Bookmarks.Add(newBookmark);
            storage.Bookmarks.Add(newBookmark);
            return newBookmarkGuid;
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        public void DeleteTour(string superCollectionName, string collectionName, Tour tourRequest)
        {
            ApiOperationUnderCollection(tourRequest, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                Trace.TraceInformation("Delete Tour");

                Tour deleteTour = storage.Tours.Find(tourRequest.Id);
                if (deleteTour == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TourNotFound);
                    return;
                }
                DeleteBookmarks(storage, deleteTour);
                storage.Tours.Remove(deleteTour);
                storage.SaveChanges();
                Cache.Remove(string.Format(CultureInfo.InvariantCulture, "Tour {0}", collection.Id));
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public TourResult PutBookmarks(string superCollectionName, string collectionName, Tour tourRequest)
        {
            return ApiOperationUnderCollection(tourRequest, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                Trace.TraceInformation("Put Bookmarks");
                var returnValue = new TourResult();

                if (tourRequest.Id == Guid.Empty)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.TourIdCannotBeNull);
                    return returnValue;
                }

                Tour bookmarkTour = storage.Tours.Find(tourRequest.Id);
                if (bookmarkTour == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TourNotFound);
                    return returnValue;
                }
                returnValue.TourId = tourRequest.Id;

                // Populate the bookmarks.
                if (tourRequest.Bookmarks != null)
                {
                    foreach (Bookmark bookmarkRequest in tourRequest.Bookmarks)
                    {
                        var newBookmarkGuid = AddBookmark(storage, bookmarkTour, bookmarkRequest);
                        if (newBookmarkGuid != Guid.Empty)
                        {
                            returnValue.Add(newBookmarkGuid);
                        }
                    }
                    storage.SaveChanges();
                }
                return returnValue;
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        public void DeleteBookmarks(string superCollectionName, string collectionName, Tour tourRequest)
        {
            ApiOperationUnderCollection(tourRequest, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                Trace.TraceInformation("Delete Bookmarks");

                Tour bookmarkTour = storage.Tours.Find(tourRequest.Id);
                if (bookmarkTour == null)
                {
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.TourNotFound);
                    return;
                }

                if (tourRequest.Bookmarks != null)
                {
                    storage.Entry(bookmarkTour).Collection(_ => _.Bookmarks).Load();
                    List<Bookmark> tourBookmarks = bookmarkTour.Bookmarks.ToList();

                    foreach (Bookmark bookmark in tourRequest.Bookmarks)
                    {
                        Bookmark deleteBookmark = tourBookmarks.Where(candidate => candidate.Id == bookmark.Id).FirstOrDefault();
                        if (deleteBookmark == null)
                        {
                            SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.BookmarkNotFound);
                            return;
                        }
                        storage.Bookmarks.Remove(deleteBookmark);
                    }
                    storage.SaveChanges();
                }
            });
        }

        // Delete the specified bookmarks that are part of the tour.
        private static void DeleteBookmarks(Storage storage, Tour tour)
        {
            if (tour == null)
                return;

            storage.Entry(tour).Collection(_ => _.Bookmarks).Load();
            if (tour.Bookmarks != null)
            {
                var bookmarkIds = new List<Guid>();
                foreach (Bookmark bookmark in tour.Bookmarks)
                {
                    bookmarkIds.Add(bookmark.Id);
                }

                while (bookmarkIds.Count != 0)
                {
                    var bookmark = storage.Bookmarks.Find(bookmarkIds.First());
                    tour.Bookmarks.Remove(bookmark);
                    storage.Bookmarks.Remove(bookmark);
                    bookmarkIds.RemoveAt(0);
                }
            }
        }


        /// <summary>
        /// Updates content item counts of all ancestor timelines
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1062:Validate arguments of public methods", MessageId = "0"), System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "update"), System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "t")]
        private void UpdateSubtreeSize(Storage storage, Timeline timeline, int diff)
        {
            if (timeline == null)
                return;

            timeline.SubtreeSize += diff;
            TimelineRaw parentTimeline = storage.GetParentTimelineRaw(timeline.Id);
            UpdateSubtreeSize(storage, parentTimeline, diff);
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public string GetContentPath(string superCollection, string collection, string reference)
        {
            return ApiOperation(delegate(User user, Storage storage)
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
                    reference = FriendlyUrl.FriendlyUrlDecode(reference);
                }

                Guid collectionId = CollectionIdOrDefault(storage, superCollection, collection);

                string cacheKey = string.Format(CultureInfo.InvariantCulture, "ContentPath {0} {1} {2}", collectionId, idParsed.ToString(), reference);
                if (Cache.Contains(cacheKey))
                    return (string)Cache[cacheKey];

                string value = storage.GetContentPath(collectionId, idParsed, reference);
                Cache.Add(cacheKey, value);

                return value;
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public IEnumerable<SuperCollection> GetSuperCollections()
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                // Skip the sandbox collection since it's currently a test-only collection
                List<SuperCollection> superCollections = storage.SuperCollections.Where(candidate => candidate.Title != _sandboxSuperCollectionName).ToList();

                foreach (SuperCollection superCollection in superCollections)
                {
                    if (string.CompareOrdinal(superCollection.Title, _sandboxSuperCollectionName) == 0)
                        continue;

                    storage.Entry(superCollection).Collection(x => x.Collections).Load();
                }

                return superCollections;
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public IEnumerable<Collection> GetCollections(string superCollectionName)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                Guid superCollectionId = CollectionIdFromText(superCollectionName);
                SuperCollection superCollection = storage.SuperCollections.FirstOrDefault(candidate => candidate.Id == superCollectionId);

                if (superCollection == null)
                {
                    return null;
                }

                storage.Entry(superCollection).Collection(x => x.Collections).Load();
                return superCollection.Collections;
            });
        }

        private static bool FindParentTimeline(Storage storage, Guid? parentTimelineGuid, out Timeline parentTimeline)
        {
            parentTimeline = null;

            // If parent timeline is not specified it will default to null
            if (parentTimelineGuid == null)
            {
                return true;
            }

            parentTimeline = storage.Timelines.Find(parentTimelineGuid);
            if (parentTimeline == null)
            {
                // Parent id is not found so no timeline will be added
                SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.ParentTimelineNotFound);
                return false;
            }
            return true;
        }

        private static Exhibit FindParentExhibit(Storage storage, Guid parentExhibitGuid)
        {
            Exhibit parentExhibit = storage.Exhibits.Find(parentExhibitGuid);
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

        private static T ApiOperationUnderCollection<T>(object requestObject, string superCollectionName, string collectionName, Func<User, Storage, Collection, T> operation)
        {
            return ApiOperation<T>(delegate(User user, Storage storage)
            {
                if (requestObject == null)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.RequestBodyEmpty);
                    return default(T);
                }

                Guid collectionGuid = CollectionIdFromSuperCollection(superCollectionName, collectionName);
                Collection collection = RetrieveCollection(storage, collectionGuid);
                if (collection == null)
                {
                    // Collection does not exist
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                    return default(T);
                }

                // Validate user, if required.
                if (!UserCanModifyCollection(user, collection))
                {
                    SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.UnauthorizedUser);
                    return default(T);
                }

                return operation(user, storage, collection);
            });
        }

        // Helper to ApiOperation to handle void.
        private static void ApiOperationUnderCollection(object requestObject, string superCollectionName, string collectionName, Action<User, Storage, Collection> operation)
        {
            ApiOperationUnderCollection<bool>(requestObject, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                operation(user, storage, collection);
                return true;
            });
        }

        // Performs an operation under an authenticated user.
        private static T ApiOperation<T>(Func<User, Storage, T> operation)
        {
            using (Storage storage = new Storage())
            {
                Microsoft.IdentityModel.Claims.ClaimsIdentity claimsIdentity = HttpContext.Current.User.Identity as Microsoft.IdentityModel.Claims.ClaimsIdentity;

                if (claimsIdentity == null || !claimsIdentity.IsAuthenticated)
                {
                    return operation(null, storage);
                }

                Microsoft.IdentityModel.Claims.Claim nameIdentifierClaim = claimsIdentity.Claims.Where(candidate => candidate.ClaimType.EndsWith("nameidentifier", StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
                if (nameIdentifierClaim == null)
                {
                    return operation(null, storage);
                }

                Microsoft.IdentityModel.Claims.Claim identityProviderClaim = claimsIdentity.Claims.Where(candidate => candidate.ClaimType.EndsWith("identityprovider", StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
                if (identityProviderClaim == null)
                {
                    return operation(null, storage);
                }

                User user = new User();
                user.NameIdentifier = nameIdentifierClaim.Value;
                user.IdentityProvider = identityProviderClaim.Value;

                return operation(user, storage);
            }
        }

        // Helper to ApiOperation to handle void.
        private static void ApiOperation(Action<User, Storage> operation)
        {
            ApiOperation<bool>(delegate(User user, Storage storage)
            {
                operation(user, storage);
                return true;
            });
        }

        // Can a given GetTimelines request be cached?
        private static bool CanCacheGetTimelines(Storage storage, User user, Guid collectionId)
        {
            string cacheKey = string.Format(CultureInfo.InvariantCulture, "Collection-To-Owner {0}", collectionId);
            if (!Cache.Contains(cacheKey))
            {
                Collection collection = RetrieveCollection(storage, collectionId);

                string ownerNameIdentifier = collection == null || collection.User == null || collection.User.NameIdentifier == null ? "" : collection.User.NameIdentifier;
                Cache.Add(cacheKey, ownerNameIdentifier);
            }

            string userNameIdentifier = user == null || user.NameIdentifier == null ? "" : user.NameIdentifier;

            // Can cache as long as the user does not own the collection.
            return (string)Cache[cacheKey] != userNameIdentifier;
        }

        private static string GetTimelinesCacheKey(Guid collectionId, string start, string end, string minspan, string lca, string maxElements, string depth)
        {
            return string.Format(CultureInfo.InvariantCulture, "GetTimelines {0}|{1}|{2}|{3}|{4}|{5}|{6}", collectionId, start, end, minspan, lca, maxElements, depth);
        }

        // Retrieves the cached timeline.
        // Null if not cached.
        private static Timeline GetCachedGetTimelines(Guid collectionId, string start, string end, string minspan, string lca, string maxElements, string depth)
        {
            string cacheKey = GetTimelinesCacheKey(collectionId, start, end, minspan, lca, maxElements, depth);
            if (Cache.Contains(cacheKey))
            {
                return (Timeline)Cache[cacheKey];
            }

            return null;
        }

        // Caches the given timeline for the given GetTimelines request.
        private static void CacheGetTimelines(Timeline timeline, Guid collectionId, string start, string end, string minspan, string lca, string maxElements, string depth)
        {
            string cacheKey = GetTimelinesCacheKey(collectionId, start, end, minspan, lca, maxElements, depth);
            if (!Cache.Contains(cacheKey) && timeline != null)
            {
                Cache.Add(cacheKey, timeline);
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

        private static Collection RetrieveCollection(Storage storage, Guid collectionId)
        {
            Collection collection = storage.Collections.Find(collectionId);
            if (collection != null)
                storage.Entry(collection).Reference("User").Load();
            return collection;
        }

        private static SuperCollection RetrieveSuperCollection(Storage storage, Guid superCollectionId)
        {
            SuperCollection superCollection = storage.SuperCollections.Find(superCollectionId);
            storage.Entry(superCollection).Reference("User").Load();
            return superCollection;
        }

        static bool ValidateTimelineInCollection(Storage storage, Guid? timelineId, Guid collectionId)
        {
            // Validate that the collection of the parent timeline in the request object corresponds to the collection specified in the uri.
            Guid timelineCollectionId = storage.GetCollectionFromTimeline(timelineId);
            if (timelineCollectionId != collectionId)
            {
                SetStatusCode(HttpStatusCode.Unauthorized, ErrorDescription.ParentTimelineCollectionMismatch);
                return false;
            }
            return true;
        }

        public string GetMemiTypeByUrl(string url)
        {
            string contentType = "";
            try
            {
                var request = HttpWebRequest.Create(url) as HttpWebRequest;
                request.Method = "head";
                if (request != null)
                {
                    var response = request.GetResponse() as HttpWebResponse;
                    if (response != null)
                        contentType = response.ContentType;
                }
                return contentType;
            }
            catch
            {
                return contentType;
            }
        }

        #region FavoriteTimelines
        private static Regex guidReg = new Regex(@"[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12}", RegexOptions.IgnoreCase | RegexOptions.Compiled);

        public Collection<TimelineShortcut> GetUserFavorites()
        {
            return ApiOperation<Collection<TimelineShortcut>>(delegate(User user, Storage storage)
            {
                if (user == null)
                {
                    return null;
                }
                var triple = storage.GetTriplet(String.Format("czusr:{0}", user.Id), "czpred:favorite").FirstOrDefault();
                if (triple == null)
                    return null;

                var elements = new Collection<TimelineShortcut>();
                foreach (var t in triple.Objects)
                {
                    if (storage.GetPrefix(t.Object) == "cztimeline")
                    {
                        var g = new Guid(storage.GetValue(t.Object));
                        var timeline = storage.Timelines.Where(x => x.Id == g).Include(f => f.Collection).Include(u => u.Collection.User).FirstOrDefault();

                        //ToDo: get image url
                        if (timeline != null)
                            elements.Add(new TimelineShortcut()
                            {
                                Title = timeline.Title,
                                ImageUrl = "/images/chronozoom.png",
                                TimelineUrl = String.Format("/{0}/{1}/#{2}", timeline.Collection.User.DisplayName, timeline.Collection.Title, storage.GetContentPath(timeline.Collection.Id, timeline.Id, null)),
                                Author = timeline.Collection.User.DisplayName
                            });
                    }
                }
                return elements;
            });
        }

        public bool PutUserFavorite(string favoriteGUID)
        {
            if (!guidReg.IsMatch(favoriteGUID))
                return false;

            return ApiOperation<bool>(delegate(User user, Storage storage)
            {
                if (user == null)
                {
                    return false;
                }
                return storage.PutTriplet(String.Format("czusr:{0}", user.Id), "czpred:favorite", String.Format("cztimeline:{0}", favoriteGUID));
            });
        }

        public bool DeleteUserFavorite(string favoriteGUID)
        {
            if (!guidReg.IsMatch(favoriteGUID))
                return false;

            return ApiOperation<bool>(delegate(User user, Storage storage)
            {
                if (user == null)
                {
                    return false;
                }
                return storage.DeleteTriplet(String.Format("czusr:{0}", user.Id), "czpred:favorite", String.Format("cztimeline:{0}", favoriteGUID));
            });
        }

        #endregion

        #region FeaturedTimeline
        public Collection<TimelineShortcut> GetUserFeatured(string guid)
        {
            return ApiOperation<Collection<TimelineShortcut>>(delegate(User user, Storage storage)
            {
                if (String.IsNullOrEmpty(guid))
                {
                    return null;
                }
                var triple = storage.GetTriplet(String.Format("czusr:{0}", new Guid(guid)), "czpred:featured").FirstOrDefault();
                if (triple == null)
                    return null;

                var elements = new Collection<TimelineShortcut>();
                foreach (var t in triple.Objects)
                {
                    if (storage.GetPrefix(t.Object) == "cztimeline")
                    {
                        var g = new Guid(storage.GetValue(t.Object));
                        var timeline = storage.Timelines.Where(x => x.Id == g).Include(f => f.Collection).Include(u => u.Collection.User).FirstOrDefault();

                        //ToDo: get image url
                        if (timeline != null)
                            elements.Add(new TimelineShortcut()
                            {
                                Title = timeline.Title,
                                ImageUrl = "/images/chronozoom.png",
                                TimelineUrl = String.Format("/{0}/{1}/#{2}", timeline.Collection.User.DisplayName, timeline.Collection.Title, storage.GetContentPath(timeline.Collection.Id, timeline.Id, null)),
                                Author = timeline.Collection.User.DisplayName
                            });
                    }
                }
                return elements;
            });
        }

        public bool PutUserFeatured(string faturedGUID)
        {
            if (!guidReg.IsMatch(faturedGUID))
                return false;

            return ApiOperation<bool>(delegate(User user, Storage storage)
            {
                if (user == null)
                {
                    return false;
                }
                return storage.PutTriplet(String.Format("czusr:{0}", user.Id), "czpred:featured", String.Format("cztimeline:{0}", faturedGUID));
            });
        }

        public bool DeleteUserFeatured(string favoriteGUID)
        {
            if (!guidReg.IsMatch(favoriteGUID))
                return false;

            return ApiOperation<bool>(delegate(User user, Storage storage)
            {
                if (user == null)
                {
                    return false;
                }
                return storage.DeleteTriplet(String.Format("czusr:{0}", user.Id), "czpred:featured", String.Format("cztimeline:{0}", favoriteGUID));
            });
        }
        #endregion
    }
}