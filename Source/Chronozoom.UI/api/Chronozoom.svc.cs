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
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.ComponentModel;
using System.Data.Entity.Validation;
using EntityFramework.Extensions;

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
        private List<int> _erroneouscontentItemIndex;
        public string errorMessage;

        public Guid ExhibitId { get; set; }
        public IEnumerable<Guid> ContentItemId
        {
            get
            {
                return _contentItemId.AsEnumerable();
            }
        }

        public IEnumerable<int> ErroneousContentItemIndex
        {
            get
            {
                return _erroneouscontentItemIndex.AsEnumerable();
            }
        }

        internal PutExhibitResult()
        {
            _contentItemId = new List<Guid>();
            _erroneouscontentItemIndex = new List<int>();
            errorMessage = "";
        }

        internal void Add(Guid id)
        {
            _contentItemId.Add(id);
        }

        internal void ErrCIAdd(int id)
        {
            _erroneouscontentItemIndex.Add(id);
        }

    }

    public enum SearchScope : byte
    {
        CurrentCollection           = 1,    // default
        AllMyCollections            = 2,
        AllSearchableCollections    = 3
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
    [ServiceBehavior(MaxItemsInObjectGraph = 99999)]
    public partial class ChronozoomSVC : IChronozoomSVC
    {
        private static  readonly StorageCache   Cache                       = new StorageCache();
        private static  readonly TraceSource    Trace                       = new TraceSource("Service", SourceLevels.All) { Listeners = { Global.SignalRTraceListener } };
        private static  readonly string         _baseCollectionsUserName    = ConfigurationManager.AppSettings["BaseCollectionsAdministrator"].Trim();
        private static  readonly string         _defaultSuperCollectionName = ConfigurationManager.AppSettings["DefaultSuperCollection"      ].Trim();
        private static  MD5                     _md5Hasher                  = MD5.Create();
        private static  Guid                    _defaultCollectionId        = Guid.Empty;
        private const   string                  _sandboxSuperCollectionName = "sandbox";
        private const   decimal                 _minYear                    = -13700000000;
        private const   decimal                 _maxYear                    = 9999;
        private const   int                     _defaultDepth               = 30;
        private const   int                     _maxSearchLimit             = 25;   // max # elements retured per section of a search (searches have 3 sections)

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

        // Is default progressive load enabled?
        private static Lazy<bool> _progressiveLoadEnabled = new Lazy<bool>(() =>
        {
            string progressiveLoadEnabled = ConfigurationManager.AppSettings["ProgressiveLoadEnabled"];

            return string.IsNullOrEmpty(progressiveLoadEnabled) ? true : bool.Parse(progressiveLoadEnabled);
        });

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
            public const string InvalidContentItemPdfUrl = "Artifact URL is not a PDF";
            public const string InvalidContentItemImageUrl = "Artifact URL is not a JPG/GIF/PNG";
            public const string InvalidContentItemVideoUrl = "Artifact URL is not a Vimeo or Youtube";
            public const string ResourceAccessFailed = "Failed to access given resource";
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
        /// Documented under IChronozoomSVC
        /// </summary>
        /// <param name="topmostTimelineId"></param>
        /// <returns></returns>
        public List<Utils.ExportImport.FlatTimeline> ExportTimelines(string topmostTimelineId)
        {
            Guid guid = new Guid(topmostTimelineId);

            using (Utils.ExportImport xfer = new Utils.ExportImport())
            {
                return xfer.ExportTimelines(guid);
            }
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        /// <param name="exhibitId"></param>
        /// <returns></returns>
        public Exhibit ExportExhibit(string exhibitId)
        {
            Guid guid = new Guid(exhibitId);

            using (Utils.ExportImport xfer = new Utils.ExportImport())
            {
                return xfer.ExportExhibit(guid);
            }
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public String ImportTimelines(string intoTimelineId, List<Utils.ExportImport.FlatTimeline> newTimelineTree)
        {
            Guid guid = new Guid(intoTimelineId);

            using (Utils.ExportImport xfer = new Utils.ExportImport())
            {
                return xfer.ImportTimelines(guid, newTimelineTree);
            }
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public String ImportExhibit(string intoTimelineId, Exhibit newExhibit)
        {
            Guid guid = new Guid(intoTimelineId);

            using (Utils.ExportImport xfer = new Utils.ExportImport())
            {
                return xfer.ImportExhibit(guid, newExhibit);
            }
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public String ImportCollection(Utils.ExportImport.FlatCollection collectionTree)
        {
            using (Utils.ExportImport xfer = new Utils.ExportImport())
            {
                return xfer.ImportCollection
                (
                    collectionId:           collectionTree.collection.Id,
                    collectionTitle:        collectionTree.collection.Title,
                    collectionTheme:        collectionTree.collection.Theme,
                    timelines:              collectionTree.timelines,
                    tours:                  collectionTree.tours,
                    makeDefault:            false,  // }
                    forcePublic:            false,  // } only set when
                    keepOldGuids:           false,  // } seeding database
                    forceUserDisplayName:   null    // }
                );
            }
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public Guid GetRoot(string superCollection, string collection)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                Guid collectionId = CollectionIdOrDefault(storage, superCollection, collection);
                Timeline timeline = storage.GetRootTimelines(collectionId);

                return timeline == null ? new Guid() : timeline.Id;
            });
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
                if
                (
                    superCollection == null
                    || (superCollection == _defaultSuperCollectionName && collection == null)
                    || CanCacheGetTimelines(storage, user, collectionId))
                {
                    Timeline cachedTimeline = GetCachedGetTimelines(collectionId, start, end, minspan, commonAncestor, maxElements, depth);
                    if (cachedTimeline != null)
                    {
                        return cachedTimeline;
                    }
                }

                // initialize filters
                decimal startTime       = string.IsNullOrWhiteSpace(start)          ? _minYear              : decimal.Parse(start,      CultureInfo.InvariantCulture);
                decimal endTime         = string.IsNullOrWhiteSpace(end)            ? _maxYear              : decimal.Parse(end,        CultureInfo.InvariantCulture);
                decimal span            = string.IsNullOrWhiteSpace(minspan)        ? 0                     : decimal.Parse(minspan,    CultureInfo.InvariantCulture);
                Guid lcaParsed          = string.IsNullOrWhiteSpace(commonAncestor) ? Guid.Empty            : Guid.Parse(commonAncestor);
                int maxElementsParsed   = string.IsNullOrWhiteSpace(maxElements)    ? _maxElements.Value    : int.Parse(maxElements,    CultureInfo.InvariantCulture);
                int depthParsed         = string.IsNullOrWhiteSpace(depth)          ? _defaultDepth         : int.Parse(depth,          CultureInfo.InvariantCulture);

                IEnumerable<Timeline> timelines = null;
                if (!_progressiveLoadEnabled.Value || !string.IsNullOrWhiteSpace(depth))
                {
                    timelines = storage.TimelinesQuery(collectionId, startTime, endTime, span, lcaParsed == Guid.Empty ? (Guid?)null : lcaParsed, maxElementsParsed, depthParsed);
                }   
                else
                {
                    //if (ShouldRetrieveAllTimelines(storage, commonAncestor, collectionId, maxElementsParsed))
                    //{
                    timelines = storage.RetrieveAllTimelines(collectionId);
                    //}
                    //else
                    //{
                    //    Trace.TraceInformation("Get Timelines - Using Progressive Load");
                    //    timelines = storage.TimelineSubtreeQuery(collectionId, lcaParsed, startTime, endTime, span, maxElementsParsed);
                    //}
                }

                Timeline timeline = timelines.Where(candidate => candidate.Id == lcaParsed).FirstOrDefault();

                if (timeline == null)
                    timeline = timelines.FirstOrDefault();

                // Cache getTimeline only for origin collection
                if (superCollection == null || (superCollection == _defaultSuperCollectionName && collection == null))
                {
                    CacheGetTimelines(timeline, collectionId, start, end, minspan, commonAncestor, maxElements, depth);
                }

                return timeline;
            });
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        /// <returns></returns>
        public Dictionary<byte, string> SearchScopeOptions()
        {
            Dictionary<byte, string> rv = new Dictionary<byte,string>();

            foreach (SearchScope scope in (SearchScope[]) Enum.GetValues(typeof(SearchScope)))
            {
                rv.Add
                (
                    (byte) scope,
                    System.Text.RegularExpressions.Regex.Replace(scope.ToString(), "[A-Z]", " $0").Trim()   // changes enum name to a displayable description with spaces before each capital letter
                );
            }

            return rv;
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        public IEnumerable<SearchResult> Search(string superCollection, string collection, string searchTerm, byte searchScope = 1)
        {
            // only search if search term provided
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                Trace.TraceEvent(TraceEventType.Warning, 0, "Search called with null search term");
                return null;
            }

            searchTerm = searchTerm.Trim().ToUpper();

            // only search if at least two characters provided
            if (searchTerm.Length < 2)
            {
                Trace.TraceEvent(TraceEventType.Warning, 0, "Search called with less than two characters in the search term");
                return null;
            }

            return ApiOperation(delegate(User user, Storage storage)
            {
                List<SearchResult> rv    = new List<SearchResult>();

                Guid currentCollectionId = CollectionIdOrDefault(storage, superCollection, collection);

                List<Timeline>      timelines;
                List<Exhibit>       exhibits;
                List<ContentItem>   content;

                switch ((SearchScope) searchScope)
                {
                    /*
                    case SearchScope.AllCollections:
                        
                        timelines = storage.Timelines
                                    .Include("Collection.User")
                                    .Where(t => t.Title.ToUpper().Contains(searchTerm))
                                    .Take(_maxSearchLimit)
                                    .OrderBy(t => t.Title)
                                    .ThenByDescending(t => t.Collection.Id == currentCollectionId)
                                    .ToList();
                        
                        exhibits  = storage.Exhibits
                                    .Include("Collection.User")
                                    .Where(e => e.Title.ToUpper().Contains(searchTerm))
                                    .Take(_maxSearchLimit)
                                    .OrderBy(e => e.Title)
                                    .ThenByDescending(e => e.Collection.Id == currentCollectionId)
                                    .ToList();
                        
                        content   = storage.ContentItems
                                    .Include("Collection.User")
                                    .Where
                                    (c =>
                                        c.Title.ToUpper().Contains(searchTerm) ||
                                        c.Caption.ToUpper().Contains(searchTerm)
                                    )
                                    .Take(_maxSearchLimit)
                                    .OrderBy(c => c.Title)
                                    .ThenByDescending(c => c.Collection.Id == currentCollectionId)
                                    .ToList();
                        
                        break;
                    */

                    case SearchScope.AllSearchableCollections:
                        if (user == null)
                        {
                            timelines = storage.Timelines
                                        .Include("Collection.User")
                                        .Where
                                        (t =>
                                            t.Title.ToUpper().Contains(searchTerm)
                                            && t.Collection.PubliclySearchable
                                        )
                                        .Take(_maxSearchLimit)
                                        .OrderBy(t => t.Title)
                                        .ThenByDescending(t => t.Collection.Id == currentCollectionId)
                                        .ToList();

                            exhibits = storage.Exhibits
                                        .Include("Collection.User")
                                        .Where
                                        (e =>
                                            e.Title.ToUpper().Contains(searchTerm)
                                            && e.Collection.PubliclySearchable
                                        )
                                        .Take(_maxSearchLimit)
                                        .OrderBy(e => e.Title)
                                        .ThenByDescending(e => e.Collection.Id == currentCollectionId)
                                        .ToList();

                            content = storage.ContentItems
                                        .Include("Collection.User")
                                        .Where
                                        (c =>
                                            (
                                                c.Title.ToUpper().Contains(searchTerm) ||
                                                c.Caption.ToUpper().Contains(searchTerm)
                                            )
                                            && c.Collection.PubliclySearchable
                                        )
                                        .Take(_maxSearchLimit)
                                        .OrderBy(c => c.Title)
                                        .ThenByDescending(c => c.Collection.Id == currentCollectionId)
                                        .ToList();
                        }
                        else
                        {
                            timelines = storage.Timelines
                                        .Include("Collection.User")
                                        .Where
                                        (t =>
                                            t.Title.ToUpper().Contains(searchTerm)
                                            &&
                                            (
                                                t.Collection.PubliclySearchable ||
                                                t.Collection.User.Id == user.Id
                                            )
                                        )
                                        .Take(_maxSearchLimit)
                                        .OrderBy(t => t.Title)
                                        .ThenByDescending(t => t.Collection.Id == currentCollectionId)
                                        .ToList();

                            exhibits = storage.Exhibits
                                        .Include("Collection.User")
                                        .Where
                                        (e =>
                                            e.Title.ToUpper().Contains(searchTerm)
                                            &&
                                            (
                                                e.Collection.PubliclySearchable ||
                                                e.Collection.User.Id == user.Id
                                            )
                                        )
                                        .Take(_maxSearchLimit)
                                        .OrderBy(e => e.Title)
                                        .ThenByDescending(e => e.Collection.Id == currentCollectionId)
                                        .ToList();

                            content = storage.ContentItems
                                        .Include("Collection.User")
                                        .Where
                                        (c =>
                                            (
                                                c.Title.ToUpper().Contains(searchTerm) ||
                                                c.Caption.ToUpper().Contains(searchTerm)
                                            )
                                            &&
                                            (
                                                c.Collection.PubliclySearchable ||
                                                c.Collection.User.Id == user.Id
                                            )
                                        )
                                        .Take(_maxSearchLimit)
                                        .OrderBy(c => c.Title)
                                        .ThenByDescending(c => c.Collection.Id == currentCollectionId)
                                        .ToList();
                        }
                        break;
                        
                    case SearchScope.AllMyCollections:

                        if (user == null) return null; // if not logged in then provide empty list

                        timelines = storage.Timelines
                                    .Include("Collection.User")
                                    .Where(t => t.Title.ToUpper().Contains(searchTerm) && t.Collection.User.Id == user.Id)
                                    .Take(_maxSearchLimit)
                                    .OrderBy(t => t.Title)
                                    .ThenByDescending(t => t.Collection.Id == currentCollectionId)
                                    .ToList();

                        exhibits  = storage.Exhibits
                                    .Include("Collection.User")
                                    .Where(e => e.Title.ToUpper().Contains(searchTerm) && e.Collection.User.Id == user.Id)
                                    .Take(_maxSearchLimit)
                                    .OrderBy(e => e.Title)
                                    .ThenByDescending(e => e.Collection.Id == currentCollectionId)
                                    .ToList();

                        content   = storage.ContentItems
                                    .Include("Collection.User")
                                    .Where
                                    (c =>
                                        (
                                            c.Title.ToUpper().Contains(searchTerm) ||
                                            c.Caption.ToUpper().Contains(searchTerm)
                                        )
                                        && c.Collection.User.Id == user.Id
                                    )
                                    .Take(_maxSearchLimit)
                                    .OrderBy(c => c.Title)
                                    .ThenByDescending(c => c.Collection.Id == currentCollectionId)
                                    .ToList();

                        break;

                    default: // SearchScope.CurrentCollection

                        timelines = storage.Timelines
                                    .Include("Collection.User")
                                    .Where(t => t.Title.ToUpper().Contains(searchTerm) && t.Collection.Id == currentCollectionId)
                                    .Take(_maxSearchLimit)
                                    .OrderBy(t => t.Title)
                                    .ThenByDescending(t => t.Collection.Id == currentCollectionId)
                                    .ToList();

                        exhibits  = storage.Exhibits
                                    .Include("Collection.User")
                                    .Where(e => e.Title.ToUpper().Contains(searchTerm) && e.Collection.Id == currentCollectionId)
                                    .Take(_maxSearchLimit)
                                    .OrderBy(e => e.Title)
                                    .ThenByDescending(e => e.Collection.Id == currentCollectionId)
                                    .ToList();

                        content   = storage.ContentItems
                                    .Include("Collection.User")
                                    .Where
                                    (c =>
                                        (
                                            c.Title.ToUpper().Contains(searchTerm) ||
                                            c.Caption.ToUpper().Contains(searchTerm)
                                        )
                                        && c.Collection.Id == currentCollectionId
                                    )
                                    .Take(_maxSearchLimit)
                                    .OrderBy(c => c.Title)
                                    .ThenByDescending(c => c.Collection.Id == currentCollectionId)
                                    .ToList();

                        break;
                }

                rv.AddRange(timelines.Select(t => new SearchResult
                {
                    Id              = t.Id,
                    ObjectType      = ObjectType.Timeline,
                    Title           = t.Title,
                    UserName        = t.Collection.User.DisplayName,
                    CollectionName  = t.Collection.Title,
                    ReplacementURL  = (t.Collection.Id == currentCollectionId ? null : Search_GetTimelinePath(t))
                }));

                rv.AddRange(exhibits.Select(e => new SearchResult
                {
                    Id              = e.Id,
                    ObjectType      = ObjectType.Exhibit,
                    Title           = e.Title,
                    UserName        = e.Collection.User.DisplayName,
                    CollectionName  = e.Collection.Title,
                    ReplacementURL = (e.Collection.Id == currentCollectionId ? null : Search_GetExhibitPath(storage, e))
                }));

                rv.AddRange(content.Select(c => new SearchResult
                {
                    Id              = c.Id,
                    ObjectType      = ObjectType.ContentItem,
                    Title           = c.Title,
                    UserName        = c.Collection.User.DisplayName,
                    CollectionName  = c.Collection.Title,
                    ReplacementURL = (c.Collection.Id == currentCollectionId ? null : Search_GetContentPath(storage, c))
                }));

                return rv;
            });
        }

        private string Search_GetTimelinePath(Timeline timeline)
        {
            string rv = "/";

            // insert supercollection and collection into path
            if (timeline.Collection.User.DisplayName == (_baseCollectionsUserName).ToString() && timeline.Collection.Title == "Cosmos")
            {
                // use shortened URL for curated Cosmos collection (default collection for site)
                rv += "#";
            }
            else
            {
                // use full URL that includes supercollection name (user name) and collection name
                rv +=   HttpUtility.UrlPathEncode(timeline.Collection.User.DisplayName) + "/" +
                        HttpUtility.UrlPathEncode(timeline.Collection.Title)            + "/#";
            }

            // insert all ancestor timeline ids and current timeline id into path
            List<Guid> timelines = TimelineExtensions.Ancestors(timeline);
            if (timelines.Count > 0)
            {
                timelines.Reverse();
                rv += "/t" + string.Join("/t", timelines.ToArray());
            }

            return rv;
        }

        private string Search_GetExhibitPath(Storage storage, Exhibit exhibit)
        {
            Guid[]   searchTerm = new Guid[] { exhibit.Id };
            Timeline timeline   = storage.Timelines.Where(t => t.Exhibits.Any(te => searchTerm.Contains(te.Id))).FirstOrDefault();

            return Search_GetTimelinePath(timeline) + "/e" + exhibit.Id;
        }

        private string Search_GetContentPath(Storage storage, ContentItem content)
        {
            Guid[] searchTerm;
            
            searchTerm = new Guid[] { content.Id };
            Exhibit exhibit = storage.Exhibits.Where(e => e.ContentItems.Any(ec => searchTerm.Contains(ec.Id))).FirstOrDefault();

            searchTerm = new Guid[] { exhibit.Id };
            Timeline timeline = storage.Timelines.Where(t => t.Exhibits.Any(te => searchTerm.Contains(te.Id))).FirstOrDefault();

            return Search_GetTimelinePath(timeline) + "/e" + exhibit.Id + "/" + content.Id;
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        public Tour GetTour(Guid guid)
        {
            return GetTour("", "", guid);
        }
        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        public Tour GetTour(string superCollection, Guid guid)
        {
            return GetTour(superCollection, "", guid);
        }
        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        public Tour GetTour(string superCollection, string Collection, Guid guid)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                Tour rv = storage.Tours
                    .Where
                    (t =>
                        t.Id == guid
                        &&
                        (
                            t.Collection.Path == Collection.ToLower() ||
                            (t.Collection.Default && Collection == "")
                        )
                        &&
                        (
                            t.Collection.SuperCollection.Title.ToLower() == superCollection.ToLower() ||
                            (t.Collection.SuperCollection.Title == _defaultSuperCollectionName && superCollection == "")
                        )
                    )
                    .FirstOrDefault();

                if (rv != null)
                {
                    // would've been so much easier to prived sorted bookmarks if could reference tour from bookmark...

                    var bookmarks = storage.Tours
                        .Include("Bookmarks")
                        .Where
                        (t =>
                            t.Id == guid
                            &&
                            (
                                t.Collection.Path == Collection.ToLower() ||
                                (t.Collection.Default && Collection == "")
                            )
                            &&
                            (
                                t.Collection.SuperCollection.Title.ToLower() == superCollection.ToLower() ||
                                (t.Collection.SuperCollection.Title == _defaultSuperCollectionName && superCollection == "")
                            )
                        )
                        .Select(t => t.Bookmarks)
                        .ToList();

                    IEnumerable<Bookmark> sorted = bookmarks[0].ToList()
                        .OrderBy(b => b.SequenceId)
                        .ThenBy( b => b.LapseTime);

                    Collection<Bookmark> inserts = new Collection<Bookmark>();
                    foreach(Bookmark bookmark in sorted)
                    {
                        inserts.Add(bookmark);
                    }

                    rv.Bookmarks = inserts;
                }

                return rv;
            });
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/tours")]
        public BaseJsonResult<IEnumerable<Tour>> GetDefaultTours()
        {
            return GetTours("", "");
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        public BaseJsonResult<IEnumerable<Tour>> GetTours(string superCollection)
        {
            return GetTours(superCollection, "");
        }

        /// <summary>
        /// Documented under IChronozoomSVC
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

        /// <summary>
        ///  Creates the supercollection and default collection if they do not exist for the specified user.
        /// </summary>
        /// <param name="storage"></param>
        /// <param name="user"></param>
        /// <returns>Returns a URL pointing to the user's supercollection and default collection.</returns>
        private static Uri EnsurePersonalCollection(Storage storage, User user)
        {
            bool dbChanged = false;

            SuperCollection superCollection =
                storage.SuperCollections
                .Where(s => s.User.Id == user.Id)
                .Include("Collections")
                .FirstOrDefault();

            Collection defaultCollection    = superCollection   == null ? null :
                storage.Collections
                .Where(c => c.SuperCollection.Id == superCollection.Id && c.Default == true)
                .FirstOrDefault();

            Timeline rootTimeline           = defaultCollection == null ? null :
                storage.Timelines
              //.Where(t => t.Collection.Id == defaultCollection.Id && TimelineExtensions.Ancestors(t).Count == 0)
                .Where(t => t.Collection.Id == defaultCollection.Id) // doesn't confirm is root but adequate to show has timelines
                .FirstOrDefault();

            if (superCollection == null)
            {
                // supercollection doesn't exist so create it
                superCollection = new SuperCollection
                {
                    Id              = Guid.NewGuid(),
                    Title           = Regex.Replace(user.DisplayName.Trim(), @"[^A-Za-z0-9\-]+", "").ToLower(),
                    User            = user,
                    Collections     = new System.Collections.ObjectModel.Collection<Collection>()
                };
                storage.SuperCollections.Add(superCollection);
                dbChanged = true;
            }

            if (defaultCollection == null)
            {
                // default collection doesn't exist so create it
                defaultCollection = new Collection
                {
                    Id              = Guid.NewGuid(),
                    Default         = true,
                    Title           = user.DisplayName,
                    Path            = Regex.Replace(user.DisplayName.Trim(), @"[^A-Za-z0-9\-]+", "").ToLower(),
                    SuperCollection = superCollection,
                    User            = user
                };
                superCollection.Collections.Add(defaultCollection);
                dbChanged = true;
            }

            if (rootTimeline == null)
            {
                // root timeline doesn't exist so create it
                rootTimeline = new Timeline
                {
                    Id              = Guid.NewGuid(),
                    Depth           = 0,
                    Title           = user.DisplayName,
                    FromYear        = 1950,
                    ToYear          = 9999,
                    ForkNode        = 0,
                    Collection      = defaultCollection,
                    SubtreeSize     = 0
                };
                storage.Timelines.Add(rootTimeline);
                dbChanged = true;
            }

            // commit any db changes
            if (dbChanged) storage.SaveChanges();

            // return url
            return new Uri
            (
                string.Format
                (
                    CultureInfo.InvariantCulture,
                    @"{0}/{1}/",
                    FriendlyUrl.FriendlyUrlEncode(superCollection.Title),
                    FriendlyUrl.FriendlyUrlEncode(defaultCollection.Path)
                ),
                UriKind.Relative
            );
        }

        public Guid CollectionIdOrDefault(Storage storage, string superCollectionName, string collectionPath)
        {
            Collection  collection;

            if (string.IsNullOrEmpty(superCollectionName))
            {
                // no supercollection specified so use default supercollection's default collection
                superCollectionName = _defaultSuperCollectionName;
                collectionPath      = "";
            }

            if (superCollectionName == _defaultSuperCollectionName && collectionPath == "" && _defaultCollectionId != Guid.Empty)
            {
                // we're looking up the default supercollection's default collection and that info is cached already
                return _defaultCollectionId;
            }

            if (string.IsNullOrEmpty(collectionPath))
            {
                // no collection specified so use default collection for specified supercollection
                collection =
                    storage.Collections
                    .Where
                    (c =>
                        c.SuperCollection.Title == superCollectionName &&
                        c.Default               == true
                    )
                    .FirstOrDefault();
            }
            else
            {
                // collection specified so look it up within the specified supercollection
                collection =
                    storage.Collections
                    .Where
                    (c =>
                        c.SuperCollection.Title == superCollectionName &&
                        c.Path                  == collectionPath
                    )
                    .FirstOrDefault();
            }

            if (collection == null)
            {
                // we were unable to find the requested collection

                if (superCollectionName == _defaultSuperCollectionName && collectionPath == "")
                {
                    // the collection we could not find is the default supercollection's collection
                    // this should not occur unless the database has an issue or web.config is not set up correctly
                    throw new ConfigurationErrorsException("Unable to locate the default supercollection's default collection.");
                }

                //// so return the default supercollection's default collection
                //return CollectionIdOrDefault(storage, _defaultSuperCollectionName, "");

                // indicate that collection could not be found
                return Guid.Empty;
            }

            if (superCollectionName == _defaultSuperCollectionName && collection.Default)
            {
                // we were looking up the default supercollection's collection so lets cache it for future use
                _defaultCollectionId = collection.Id;
            }

            return collection.Id;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase")]
        private static Guid CollectionIdFromSuperCollection(string superCollectionName, string collectionName)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                Collection collection;

                // if superCollectionName is missing then use default superCollection
                if (string.IsNullOrEmpty(superCollectionName))
                {
                    superCollectionName = _defaultSuperCollectionName;
                }

                // if collectionName is missing
                if (string.IsNullOrEmpty(collectionName))
                {
                    // then look up default collection for the specified supercollection
                    collection = storage.Collections.Where(c => c.SuperCollection.Title == superCollectionName && c.Default).FirstOrDefault();
                }
                else
                {
                    // else look up named collection
                    collection = storage.Collections.Where(c => c.SuperCollection.Title == superCollectionName && c.Path == collectionName).FirstOrDefault();
                }
                
                // if collection was found then return the collection id
                if (collection != null) return collection.Id;

                // couldn't find collection so generate a new guid from hash of names provided (no idea why)
                return CollectionIdFromText
                (
                    string.Format
                    (
                        CultureInfo.InvariantCulture,
                        "{0}|{1}",
                        superCollectionName.Trim().ToLower(CultureInfo.InvariantCulture),
                        collectionName.Trim().ToLower(CultureInfo.InvariantCulture)
                    )
                );
            });
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
        /// Documented under IChronozoomSVC
        /// </summary>
        public Boolean PostCollection(string superCollectionPath, string newCollectionPath, Collection newCollectionData)
        {
            // abort if appropriate parameters have not been provided
            if (superCollectionPath == null) return false;
            if (newCollectionPath   == null) return false;
            if (newCollectionData   == null) return false;

            superCollectionPath = Regex.Replace(superCollectionPath.Trim(), @"[^A-Za-z0-9\-]+", "").ToLower(); 
            newCollectionPath   = Regex.Replace(newCollectionPath.Trim(),   @"[^A-Za-z0-9\-]+", "").ToLower(); 

            if (superCollectionPath == "") return false;
            if (newCollectionPath   == "") return false;

            return ApiOperation(delegate(User user, Storage storage)
            {
                // abort if not currently logged in
                if (user == null) return false;

                // get supercollection - abort if can't find
                SuperCollection superCollection = storage.SuperCollections.Where(s => s.Title == superCollectionPath).Include("User").Include("Collections").FirstOrDefault();
                if (superCollection == null) return false;

                // abort if currently logged in user is not the supercollection owner
                if (user.Id != superCollection.User.Id) return false;

                // abort if supercollection has an existing collection with the same path
                Collection collection = storage.Collections.Where(c => c.SuperCollection.Id == superCollection.Id && c.Path == newCollectionPath).FirstOrDefault();
                if (collection != null) return false;

                // get the full user record as delegated user doesn't return display name which is required when creating new collection
                User fullUser = storage.Users.Where(u => u.Id == user.Id).First();

                // set up creation of new collection
                collection = new Collection
                {
                    Id                  = CollectionIdFromSuperCollection(superCollectionPath, newCollectionPath),
                    SuperCollection     = superCollection,
                    Default             = newCollectionData.Default,
                    Path                = newCollectionPath,
                    Title               = newCollectionData.Title,
                    Theme               = newCollectionData.Theme,
                    MembersAllowed      = newCollectionData.MembersAllowed,
                    Members             = newCollectionData.Members,
                    PubliclySearchable  = newCollectionData.PubliclySearchable,
                    User                = fullUser
                };
                if (string.IsNullOrEmpty(collection.Title)) collection.Title = newCollectionPath;
                superCollection.Collections.Add(collection);

                // if this new collection is the default
                if (newCollectionData.Default)
                {
                    // set any previous default collection to non-default
                    Collection oldDefaultCollection = storage.Collections.Where(c => c.SuperCollection.Id == collection.SuperCollection.Id && c.Default && c.Id != collection.Id).FirstOrDefault();
                    if (oldDefaultCollection != null) oldDefaultCollection.Default = false;
                }

                // set up creation of root timeline
                Timeline rootTimeline = new Timeline
                {
                    Id          = Guid.NewGuid(),
                    Depth       = 0,
                    Title       = collection.Title,
                    FromYear    = 1950,
                    ToYear      = 9999,
                    ForkNode    = 0,
                    Collection  = collection,
                    SubtreeSize = 0
                };
                storage.Timelines.Add(rootTimeline);

                // commit changes
                try
                {
                    storage.SaveChanges();
                }
                catch (DbEntityValidationException dbEx)
                {
                    foreach (var validationErrors in dbEx.EntityValidationErrors)
                    {
                        foreach (var validationError in validationErrors.ValidationErrors)
                        {
                            Trace.TraceInformation("Property: {0} Error: {1}", validationError.PropertyName, validationError.ErrorMessage);
                        }
                    }
                    return false;
                }

                // report success
                return true;
            });
        }

        
        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public Guid PutCollection(string superCollectionName, Collection collectionRequest)
        {
            return PutCollection(superCollectionName, "", collectionRequest);
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public Guid PutCollection(string superCollectionName, string collectionName, Collection collectionRequest)
        {
            return ApiOperationUnderCollection(collectionRequest, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                Trace.TraceInformation("Put Collection {0} from user {1} in superCollection {2}", collectionName, user, superCollectionName);

                collectionRequest.Title = collectionRequest.Title.Trim();

                if (collectionRequest.Title != collection.Title)
                {
                    // collection title has changed so we'll also change title of root timeline
                    Timeline rootInfo = GetTimelines(superCollectionName, collectionName, null, null, null, null, null, "1");
                    if (rootInfo != null)
                    {
                        Timeline rootTimeline = storage.Timelines.Where(t => t.Id == rootInfo.Id).First();
                        rootTimeline.Title = collectionRequest.Title;
                    }
                }

                collection.Title                = collectionRequest.Title;
                collection.Path                 = Regex.Replace(collectionRequest.Path, @"[^A-Za-z0-9\-]+", "").ToLower();
                collection.Theme                = collectionRequest.Theme;
                collection.PubliclySearchable   = collectionRequest.PubliclySearchable;
                collection.MembersAllowed       = collectionRequest.MembersAllowed;

                if (collectionRequest.Default)
                {
                    // set previous default collection to non-default
                    Collection oldDefaultCollection = storage.Collections.Where(c => c.SuperCollection.Id == collection.SuperCollection.Id && c.Default && c.Id != collection.Id).FirstOrDefault();
                    if (oldDefaultCollection != null) oldDefaultCollection.Default = false;
                    // before changing this collection to be the new default
                    collection.Default = true;
                }

                storage.SaveChanges();
                return collection.Id;
            });
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public Boolean DeleteCollection(string superCollectionPath, string collectionPath)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                // obtain collection (within current context)
                Guid       collectionId = CollectionIdOrDefault(storage, superCollectionPath, collectionPath);
                Collection collection   = storage.Collections.Where(c => c.Id == collectionId).FirstOrDefault();

                // if collection can't be found then abort
                if (collection == null) return false;

                // if collection is default collection then abort
                if (collection.Default) return false;

                // if user is not authorized to edit collection then abort
                if (!UserIsMember(collection.Id.ToString())) return false;

                // delete any tours for this collection
                List<Tour> tours = storage.Tours.Where(t => t.Collection.Id == collection.Id).ToList();
                foreach (Tour tour in tours)
                {
                    DeleteBookmarks(storage, tour);
                    storage.Tours.Remove(tour);
                }

                // delete any editors associated with this collection (uses EF.Extended for batch delete)
                storage.Members.Where(m => m.Collection.Id == collection.Id).Delete();

                // delete any existing root timeline for this collection (set up for cascading deletes)
                Timeline timeline = ChronozoomSVC.Instance.GetTimelines(superCollectionPath, collectionPath, null, null, null, null, null, "1");
                if (timeline != null) storage.DeleteTimeline(timeline.Id);

                // delete this collection
                storage.Collections.Remove(collection);

                // commit changes
                try
                {
                    storage.SaveChanges();
                }
                catch (DbEntityValidationException dbEx)
                {
                    foreach (var validationErrors in dbEx.EntityValidationErrors)
                    {
                        foreach (var validationError in validationErrors.ValidationErrors)
                        {
                            Trace.TraceInformation("Property: {0} Error: {1}", validationError.PropertyName, validationError.ErrorMessage);
                        }
                    }
                    return false;
                }

                // report success
                return true;
            });
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public Guid PutTimeline(string superCollectionName, TimelineRaw timelineRequest)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                Collection collection = storage.Collections.Where(c => c.SuperCollection.Title == superCollectionName && c.Default).FirstOrDefault();
                if (collection == null) return Guid.Empty;

                return PutTimeline(superCollectionName, collection.Path, timelineRequest);
            });
        }

        /// <summary>
        /// Documented under IChronozoomSVC
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
                    newTimeline.FromIsCirca = timelineRequest.FromIsCirca;
                    newTimeline.ToYear = timelineRequest.ToYear;
                    newTimeline.ToIsCirca = timelineRequest.ToIsCirca;
                    newTimeline.Collection = collection;
                    newTimeline.BackgroundUrl = timelineRequest.BackgroundUrl;
                    newTimeline.AspectRatio = timelineRequest.AspectRatio;

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
                    updateTimeline.FromIsCirca = timelineRequest.FromIsCirca;
                    updateTimeline.ToYear = timelineRequest.ToYear;
                    updateTimeline.ToIsCirca = timelineRequest.ToIsCirca;
                    updateTimeline.BackgroundUrl = timelineRequest.BackgroundUrl;
                    updateTimeline.AspectRatio = timelineRequest.AspectRatio;
                    returnValue = updateTimelineGuid;
                }
                storage.SaveChanges();
                return returnValue;
            });
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public void DeleteTimeline(string superCollectionName, Timeline timelineRequest)
        {
            ApiOperation(delegate(User user, Storage storage)
            {
                Collection collection = storage.Collections.Where(c => c.SuperCollection.Title == superCollectionName && c.Default).FirstOrDefault();
                if (collection != null) DeleteTimeline(superCollectionName, collection.Path, timelineRequest);
            });
        }

        /// <summary>
        /// Documented under IChronozoomSVC
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
        /// Documented under IChronozoomSVC
        /// </summary>
        public PutExhibitResult PutExhibit(string superCollectionName, ExhibitRaw exhibitRequest)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                Collection collection = storage.Collections.Where(c => c.SuperCollection.Title == superCollectionName && c.Default).FirstOrDefault();
                if (collection == null)
                {
                    PutExhibitResult notFound = new PutExhibitResult();
                    notFound.errorMessage = "Unable to find the collection in which this exhibit should be placed.";
                    notFound.ErrCIAdd(0);
                    return notFound;
                }

                return PutExhibit(superCollectionName, collection.Path, exhibitRequest);
            });
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity"), System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        public PutExhibitResult PutExhibit(string superCollectionName, string collectionName, ExhibitRaw exhibitRequest)
        {
            return ApiOperationUnderCollection(exhibitRequest, superCollectionName, collectionName, delegate(User user, Storage storage, Collection collection)
            {
                Trace.TraceInformation("Put Exhibit");
                var returnValue = new PutExhibitResult();
                var isErroneous = false;
                var index = 0;
                foreach (ContentItem contentItemRequest in exhibitRequest.ContentItems)
                {
                    if (!ValidateContentItemUrl(contentItemRequest, out returnValue.errorMessage))
                    {
                        if (!isErroneous)
                        {
                            returnValue.errorMessage += " in '" + contentItemRequest.Title + "' artifact.";
                            isErroneous = true;
                        }
                        returnValue.ErrCIAdd(index);
                    }
                    index++;
                }

                if (isErroneous) return returnValue;

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
                    Guid newExhibitGuid     = Guid.NewGuid();
                    Exhibit newExhibit      = new Exhibit { Id = newExhibitGuid };
                    newExhibit.Title        = exhibitRequest.Title;
                    newExhibit.Year         = exhibitRequest.Year;
                    newExhibit.IsCirca      = exhibitRequest.IsCirca;
                    newExhibit.Collection   = collection;
                    newExhibit.Depth        = parentTimeline.Depth + 1;
                    newExhibit.UpdatedBy    = storage.Users.Where(u => user.Id == user.Id).FirstOrDefault();
                    newExhibit.UpdatedTime  = DateTime.UtcNow;  // force timestamp update even if no changes have been made since save is still requested and someone else could've edited in meantime

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
                    updateExhibit.Title         = exhibitRequest.Title;
                    updateExhibit.Year          = exhibitRequest.Year;
                    updateExhibit.IsCirca       = exhibitRequest.IsCirca;
                    updateExhibit.UpdatedBy     = storage.Users.Where(u => user.Id == user.Id).FirstOrDefault();
                    updateExhibit.UpdatedTime   = DateTime.UtcNow;  // force timestamp update even if no changes have been made since save is still requested and someone else could've edited in meantime
                    returnValue.ExhibitId       = exhibitRequest.Id;

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

            // Custom validation for OneDrive images
            if (contentitem.MediaType == "skydrive-image")
            {
                if (contentitem.Uri == null || contentitem.Uri.Length < 60)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.InvalidContentItemUrl);
                    error = ErrorDescription.InvalidContentItemUrl;
                    return false;
                }

                if (contentitem.Uri.Substring(0, 41) == "https://onedrive.live.com/download?resid=")
                {
                    // OneDrive download link
                    string[] querystrings = contentitem.Uri.Split('?')[1].Split('&');
                    if (querystrings.Length != 2)
                    {
                        SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.InvalidContentItemUrl);
                        error = ErrorDescription.InvalidContentItemUrl;
                        return false;
                    }
                    if (querystrings[1].Substring(0, 8) != "authkey=")
                    {
                        SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.InvalidContentItemUrl);
                        error = ErrorDescription.InvalidContentItemUrl;
                        return false;
                    }
                }
                else
                {
                    // OneDrive embed link

                    // Parse url parameters. url pattern is - {url} {width} {height}
                    var split = contentitem.Uri.Split(' ');

                    // Not enough parameters in url
                    if (split.Length != 3)
                    {
                        SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.InvalidContentItemUrl);
                        error = ErrorDescription.InvalidContentItemUrl;

                        return false;
                    }

                    contentitemURI = split[0];

                    // Validate width and height are numbers
                    int value;
                    if (!Int32.TryParse(split[1], out value) || !Int32.TryParse(split[2], out value))
                    {
                        SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.InvalidContentItemUrl);
                        error = ErrorDescription.InvalidContentItemUrl;

                        return false;
                    }
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

            // Get MIME type of Url.
            var mimeType = "";
            try
            {
                mimeType = MimeTypeOfUrl(contentitem.Uri);
            }
            catch (Exception)
            {
                if (contentitem.MediaType == "image" || contentitem.MediaType == "pdf")
                {
                    SetStatusCode(HttpStatusCode.InternalServerError, ErrorDescription.ResourceAccessFailed);
                    error = ErrorDescription.InvalidContentItemUrl;

                    return false;
                }
            }

            // Check if MIME type match mediaType (regex test for 'video')
            switch (contentitem.MediaType)
            {
                case "image":
                    if (mimeType != "image/jpg"
                        && mimeType != "image/jpeg"
                        && mimeType != "image/gif"
                        && mimeType != "image/png")
                    {
                        SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.InvalidContentItemImageUrl);
                        error = ErrorDescription.InvalidContentItemImageUrl;

                        return false;
                    }
                    break;

                case "video":
                    // Youtube
                    var youtube = new Regex("(?:youtu\\.be\\/|youtube\\.com(?:\\/embed\\/|\\/v\\/|\\/watch\\?v=|[\\S\\?\\&]+&v=|\\/user\\/\\S+))([^\\/&#]{10,12})");
                    // Vimeo
                    var vimeo = new Regex("vimeo\\.com\\/([0-9]+)", RegexOptions.IgnoreCase);
                    var vimeoEmbed = new Regex("player.vimeo.com\\/video\\/([0-9]+)", RegexOptions.IgnoreCase);

                    if (!youtube.IsMatch(contentitem.Uri) && !vimeo.IsMatch(contentitem.Uri) && !vimeoEmbed.IsMatch(contentitem.Uri))
                    {
                        SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.InvalidContentItemVideoUrl);
                        error = ErrorDescription.InvalidContentItemVideoUrl;

                        return false;
                    }
                    break;

                case "pdf":
                    if (mimeType != "application/pdf")
                    {
                        SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.InvalidContentItemPdfUrl);
                        error = ErrorDescription.InvalidContentItemPdfUrl;

                        return false;
                    }
                    break;
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
        /// Documented under IChronozoomSVC
        /// </summary>
        public void DeleteExhibit(string superCollectionName, Exhibit exhibitRequest)
        {
            ApiOperation(delegate(User user, Storage storage)
            {
                Collection collection = storage.Collections.Where(c => c.SuperCollection.Title == superCollectionName && c.Default).FirstOrDefault();
                if (collection != null) DeleteExhibit(superCollectionName, collection.Path, exhibitRequest);
            });
        }

        /// <summary>
        /// Documented under IChronozoomSVC
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
        /// Documented under IChronozoomSVC
        /// </summary>
        public Guid PutContentItem(string superCollectionName, ContentItemRaw contentItemRequest)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                Collection collection = storage.Collections.Where(c => c.SuperCollection.Title == superCollectionName && c.Default).FirstOrDefault();
                if (collection == null) return Guid.Empty;

                return PutContentItem(superCollectionName, collection.Path, contentItemRequest);
            });
        }

        /// <summary>
        /// Documented under IChronozoomSVC
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

        public TourResult PutTour(string superCollectionName, Tour tourRequest)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                Collection collection = storage.Collections.Where(c => c.SuperCollection.Title == superCollectionName && c.Default).FirstOrDefault();
                if (collection == null)
                {
                    TourResult notFound = new TourResult();
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                    return notFound;
                }

                return PutTour(superCollectionName, collection.Path, tourRequest);
            });
        }

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
        /// Documented under IChronozoomSVC
        /// </summary>
        public TourResult PutTour2(string superCollectionName, Tour tourRequest)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                Collection collection = storage.Collections.Where(c => c.SuperCollection.Title == superCollectionName && c.Default).FirstOrDefault();
                if (collection == null)
                {
                    TourResult notFound = new TourResult();
                    SetStatusCode(HttpStatusCode.NotFound, ErrorDescription.CollectionNotFound);
                    return notFound;
                }

                return PutTour2(superCollectionName, collection.Path, tourRequest);
            });
        }

        /// <summary>
        /// Documented under IChronozoomSVC
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

        /// <summary>Documented under IChronozoomSVC</summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        public void DeleteTour(string superCollectionName, Tour tourRequest)
        {
            DeleteTour(superCollectionName, "", tourRequest);
        }
                                                
        /// <summary>Documented under IChronozoomSVC</summary>
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
                return storage.SuperCollections
                    .Where(s => s.Title != _sandboxSuperCollectionName) // skip the sandbox collection since it's currently a test-only collection
                    .Include("Collections")
                    .OrderBy(s => s.Title)
                    .ToList();
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public IEnumerable<Collection> GetCollections(string superCollectionName)
        {
            superCollectionName = Regex.Replace(superCollectionName.Trim(), @"[^A-Za-z0-9\-]+", "").ToLower();

            return ApiOperation(delegate(User user, Storage storage)
            {
                return storage.Collections
                    .Where(c => c.SuperCollection.Title == superCollectionName)
                    .OrderByDescending(c => c.Default)
                    .ThenBy(c => c.Title)
                    .ToList();
            });
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public Collection GetCollection(string superCollection)
        {
            return GetCollection(superCollection, "");
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public Collection GetCollection(string superCollection, string collection)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                Guid collectionId = CollectionIdOrDefault(storage, superCollection, collection);
                Collection rv = storage.Collections.Include("User").Where(c => c.Id == collectionId).FirstOrDefault();
                return rv;
            });
        }

        /// <summary>Documented under IChronozoomSVC</summary>
        public Boolean IsUniqueCollectionName(string proposedCollectionName)
        {
            return IsUniqueCollectionName("", "", proposedCollectionName);
        }

        /// <summary>Documented under IChronozoomSVC</summary>
        public Boolean IsUniqueCollectionName(string superCollection, string proposedCollectionName)
        {
            return IsUniqueCollectionName(superCollection, "", proposedCollectionName);
        }

        /// <summary>Documented under IChronozoomSVC</summary>
        public Boolean IsUniqueCollectionName(string superCollection, string existingCollectionPath, string proposedCollectionName)
        {
            string proposedCollectionPath;

            if (string.IsNullOrEmpty(superCollection        ))  superCollection         = "";
            if (string.IsNullOrEmpty(existingCollectionPath ))  existingCollectionPath  = "";
            if (string.IsNullOrEmpty(proposedCollectionName ))  return false;

            superCollection         = superCollection       .Trim().ToLower();
            existingCollectionPath  = existingCollectionPath.Trim().ToLower();
            proposedCollectionName  = proposedCollectionName.Trim();
            proposedCollectionPath  = Regex.Replace(proposedCollectionName, @"[^A-Za-z0-9\-]+", "").ToLower(); // Aa-Zz, 0-9 and hyphen only, converted to lower case.

            if (proposedCollectionPath == "") return false;

            return ApiOperation(delegate(User user, Storage storage)
            {
                Guid existingCollectionId = CollectionIdOrDefault(storage, superCollection, existingCollectionPath);
                if (existingCollectionId == Guid.Empty) return true;

                int found = storage.Collections.Where
                (c =>
                    c.SuperCollection.Title == superCollection &&
                    c.Id != existingCollectionId &&
                    (c.Title == proposedCollectionName || c.Path == proposedCollectionPath)
                )
                .Count();

                return (found == 0);
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// IdentityProvider null check is used to exclude anonymous users from results list
        /// </summary>
        /// <param name="partialName"></param>
        /// <returns></returns>
        public IEnumerable<User> FindUsers(string partialName)
        {
            partialName = partialName.Trim();
            return ApiOperation(delegate(User user, Storage storage)
            {
                List<User> users;
                switch (partialName.Length)
                {
                    case 0:
                        // don't bother searching
                        users = new List<User>();
                        break;

                    case 1:
                    case 2:
                        // exact match only as list could be very large
                        users = storage.Users.Where(u => u.DisplayName == partialName && u.IdentityProvider != null).OrderBy(u => u.DisplayName).ToList();
                        break;

                    default:
                        // partial match
                        users = storage.Users.Where(u => u.DisplayName.Contains(partialName) && u.IdentityProvider != null).OrderBy(u => u.DisplayName).ToList();
                        break;
                }
                return users;
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public string GetExhibitLastUpdate(string exhibitId)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                string rv = "";

                Guid exhibitGUID = new Guid(exhibitId);
                Exhibit exhibit  = storage.Exhibits.Where(e => e.Id == exhibitGUID).Include("UpdatedBy").FirstOrDefault();
                if (exhibit != null)
                {
                    rv = exhibit.UpdatedTime.ToString("yyyy/MM/dd HH:mm:ss") + (exhibit.UpdatedBy != null ? "|" + exhibit.UpdatedBy.DisplayName : "");
                }

                return rv;
            });
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public bool UserCanEdit(string superCollection)
        {
            return UserCanEdit(superCollection, "");
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public bool UserCanEdit(string superCollection, string collection)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                if (user == null) return false;

                Guid collectionId = CollectionIdOrDefault(storage, superCollection, collection);
                return UserIsMember(collectionId.ToString());
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public bool UserIsMember(string collectionId)
        {
            Guid collectionGUID = new Guid(collectionId);

            return ApiOperation(delegate(User user, Storage storage)
            {
                if (user == null) return false;

                return // is owner or (members are allowed and is member)
                    (storage.Collections.Where(c => c.Id == collectionGUID && c.User.Id == user.Id).Count() > 0) ||
                    (
                        (storage.Collections.Where(c => c.Id == collectionGUID && c.MembersAllowed).Count() > 0) &&
                        (storage.Members.Where(m => m.User.Id == user.Id && m.Collection.Id == collectionGUID).Count() > 0)
                    );
            });
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public IEnumerable<User> GetMembers(string superCollection)
        {
            return GetMembers(superCollection, "");
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public IEnumerable<User> GetMembers(string superCollection, string collection)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                Guid collectionId    = CollectionIdOrDefault(storage, superCollection, collection);
                List<User> members = storage.Members.Where(m => m.Collection.Id == collectionId).Include(m => m.User).OrderBy(m => m.User.DisplayName).Select(m => m.User).ToList();
                return members;
            });
        }

        /// <summary>
        /// Documente under IChronozoomSVC
        /// </summary>
        public bool PutMembers(string superCollection, IEnumerable<Guid> userIds)
        {
            return PutMembers(superCollection, "", userIds);
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public bool PutMembers(string superCollection, string collection, IEnumerable<Guid> userIds)
        {
            return ApiOperation(delegate(User user, Storage storage)
            {
                Guid collectionId = CollectionIdOrDefault(storage, superCollection, collection);

                // ascertain if current user has right to edit the collection membership
                if (UserIsMember(collectionId.ToString()))
                {
                    // EF extended not installed so no RemoveAll or other batch options. Therefore instead of
                    // one db call per userId, will batch up into just a couple of bulk sql commands...

                    // remove existing users
                    storage.Database.ExecuteSqlCommand("DELETE FROM Members WHERE Collection_Id = {0};", collectionId);

                    // add new user list
                    if (userIds.Count() > 0)
                    {
                        string sql = "INSERT INTO Members (Id, Collection_Id, User_Id) VALUES ";
                        foreach (Guid userId in userIds)
                        {
                            sql += "('" + Guid.NewGuid().ToString() + "', '" + collectionId.ToString() + "', '" + userId.ToString().Replace("'", "") + "'),";
                        }
                        sql = sql.Remove(sql.Length - 1) + ";";
                        storage.Database.ExecuteSqlCommand(sql);
                    }

                    return true;
                }
                else
                {
                    return false;
                }
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
                var u = storage.Users.Where(candidate => candidate.NameIdentifier == user.NameIdentifier).FirstOrDefault();
                if (u != null)
                    user.Id = u.Id;

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
                return Instance.UserIsMember(collection.Id.ToString());
            }
        }

        private static Collection RetrieveCollection(Storage storage, Guid collectionId)
        {
            Collection collection = storage.Collections.Find(collectionId);
            if (collection != null)
            {
                storage.Entry(collection).Reference("SuperCollection").Load();
                storage.Entry(collection).Reference("User").Load();
            }
            return collection;
        }

        private static SuperCollection RetrieveSuperCollection(Storage storage, Guid superCollectionId)
        {
            SuperCollection superCollection = storage.SuperCollections.Find(superCollectionId);
            if (superCollection != null) storage.Entry(superCollection).Reference("User").Load();
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

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        public string GetMimeTypeByUrl(string url)
        {
            // Check if valid url.
            Uri uriResult;
            if (!(Uri.TryCreate(url, UriKind.Absolute, out uriResult) && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps)))
            {
                throw new WebFaultException<string>(ErrorDescription.InvalidContentItemUrl, HttpStatusCode.BadRequest);
            }

            var mimeType = "";
            try
            {
                mimeType = MimeTypeOfUrl(url);
            }
            catch (Exception)
            {
                throw new WebFaultException<string>(ErrorDescription.ResourceAccessFailed, HttpStatusCode.InternalServerError);
            }

            return mimeType;
        }

        /// <summary>
        /// Returns a MIME type of internet resource accessible via given Url. 
        /// Throws an exception if failed to access internet resource via given Url.
        /// </summary>
        /// <param name="url">Url to get MIME type of.</param>
        /// <returns>MIME type of internet resource accessible via given Url.</returns>
        private static string MimeTypeOfUrl(string url)
        {
            string contentType = "";

            var request = HttpWebRequest.Create(url) as HttpWebRequest;
            request.Method = "head";
            if (request != null)
            {
                var response = request.GetResponse() as HttpWebResponse;
                if (response != null)
                {
                    contentType = response.ContentType;
                }
            }

            return contentType;
        }
    }
}
