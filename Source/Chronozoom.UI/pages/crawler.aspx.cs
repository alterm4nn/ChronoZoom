using System;
using System.Configuration;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Collections.ObjectModel;
using Chronozoom.Entities;
using System.Text;
using System.Globalization;

namespace Chronozoom.UI
{
    public partial class Crawler : System.Web.UI.Page
    {
        private static readonly Storage _storage = new Storage();

        private static Lazy<string> _hostPath = new Lazy<string>(() =>
        {
            Uri uri = HttpContext.Current.Request.Url;
            return uri.Scheme + Uri.SchemeDelimiter + uri.Host + ":" + uri.Port;
        });

        public static bool SearchEnabled()
        {
            if (ConfigurationManager.AppSettings["SearchEngineIndexing"] == "true")
            {
                return true;
            }
            return false;
        }


        /// <summary>
        /// Parses the URL passed to the page to determine the SuperCollection.
        /// </summary>
        /// <param name="url">The URL passed to the code.</param>
        /// <returns>The URL segment for the SuperCollection.</returns>
        public static string UrlSuperCollection(Uri url)
        {
            string superCollection = ConfigurationManager.AppSettings["DefaultSuperCollection"] + "/";

            if (url != null && url.Segments.Length >= 2)
            {
                if (IsGuid(url.Segments[url.Segments.Length - 1]))
                {
                    return null;
                }
                if (url.Segments[1] != "pages/")
                {
                    superCollection = url.Segments[1];
                }
            }

            return superCollection.ToString().Split('/')[0];
        }

        /// <summary>
        /// Parses the URL passed to the page to determine the Collection.
        /// </summary>
        /// <param name="url">The URL passed to the code.</param>
        /// <returns>The URL segment for a Collection.</returns>
        public static string UrlCollection(Uri url)
        {
            string collection = ConfigurationManager.AppSettings["DefaultSuperCollection"] + "/";

            if (url != null)
            {

                string realUrl = url.ToString().Split('#')[0];
                    url = new Uri(realUrl);

                if (url.Segments.Length == 2)
                {
                    if (url.Segments[1] != "pages/")
                    {
                        collection = url.Segments[1];
                    }
                }
                else
                {
                    if (url != null && url.Segments.Length > 2)
                    {
                        if (IsGuid(url.Segments[2]))
                        {
                            return null;
                        }
                        if (url.Segments[2] == "crawler.aspx" || url.Segments[2] == "crawler.aspx/" || url.Segments[2] == "pages/")
                        {
                            return collection.ToString().Split('/')[0];
                        }

                        collection = url.Segments[2];
                    }
                }
            }

            return collection.ToString().Split('/')[0];
        }

        /// <summary>
        /// Parses the URL passed to the page to determine the GUID if the object being requested.
        /// 
        /// </summary>
        /// <param name="url">The URL passed to the code.</param>
        /// <returns>The URL segment for a GUID.</returns>
        public static string UrlGuid(Uri url)
        {
            string guid = null;

            if (url != null && url.Segments.Length > 1)
            {
                guid = url.Segments[url.Segments.Length - 1];
            }

            if(IsGuid(guid))
                return guid;
            return RootTimelineId(url);
        }

        /// <summary>
        /// Takes the GUID of an object passed by the code and constructs a URL to refer to the object.
        /// </summary>
        /// <param name="id"> Should be a GUID from the database that refers to a Timeline, Exhibit, or ContentItem.</param>
        /// <returns>Constructs a FriendlyURL for use in the Crawler code.</returns>
        public static Uri GetFriendlyUrl(Guid id)
        {
            if (id == null)
            {
                return null;
            }

            return new Uri(_hostPath.Value + "/" + id);
        }

        public static Uri UrlForCollection(string superCollection, string collection)
        {
            if (superCollection == null || collection == null || string.IsNullOrEmpty(superCollection) || string.IsNullOrEmpty(collection))
            {
                return null;
            }

            return new Uri(_hostPath.Value + "/" + FriendlyUrl.FriendlyUrlEncode(superCollection) + "/" + FriendlyUrl.FriendlyUrlEncode(collection)+ "/");
        }

        public static string RootTimelineId(Uri collection)
        {
            string root = Guid.Empty.ToString();

            if (collection != null)
            {
                if (IsGuid(collection.Segments[collection.Segments.Length - 1]))
                {
                    if (IsTimeline(collection.Segments[collection.Segments.Length - 1]))
                    {
                        Timeline timeline = _storage.GetRootTimelines(_storage.GetCollectionFromTimeline(Guid.Parse(collection.Segments[collection.Segments.Length - 1])));
                        Guid rootGuid = timeline.Id;
                        if (Guid.Parse(root) != rootGuid)
                        {
                            root = rootGuid.ToString();
                        }
                    }
                    if (IsExhibit(collection.Segments[collection.Segments.Length - 1]))
                    {
                        Timeline exhibit = _storage.GetRootTimelines(_storage.GetCollectionFromExhibitGuid(Guid.Parse(collection.Segments[collection.Segments.Length - 1])));
                        Guid rootGuid = exhibit.Id;
                        if (Guid.Parse(root) != rootGuid)
                        {
                            root = rootGuid.ToString();
                        }
                    }
                    if (IsContentItem(collection.Segments[collection.Segments.Length - 1]))
                    {
                        Timeline contentItem = _storage.GetRootTimelines(_storage.GetCollectionFromContentItemGuid(Guid.Parse(collection.Segments[collection.Segments.Length - 1])));
                        Guid rootGuid = contentItem.Id;
                        if (Guid.Parse(root) != rootGuid)
                        {
                            root = rootGuid.ToString();
                        }
                    }
                }
                else
                {
                    string title = FriendlyUrl.FriendlyUrlDecode(UrlCollection(collection).Substring(0, UrlCollection(collection).Length - 1));
                    {
                        title = FriendlyUrl.FriendlyUrlDecode(UrlCollection(collection));
                        Timeline timeline = _storage.GetRootTimelines(_storage.GetCollectionGuid(title));

                        if (timeline != null)
                        {
                            root = timeline.Id.ToString();
                        }
                        else
                        {
                            title = FriendlyUrl.FriendlyUrlDecode(UrlCollection(collection).Substring(0, UrlCollection(collection).Length - 1));
                            timeline = _storage.GetRootTimelines(_storage.GetCollectionGuid(title));

                            if (timeline != null)
                            {
                                root = timeline.Id.ToString();
                            }
                            else
                            {
                                root = "";
                            }
                        }
                    }
                }

                string name = FriendlyUrl.FriendlyUrlDecode(UrlCollection(collection)).ToString().Split('#')[0];
                Timeline rootTimeline = _storage.GetRootTimelines(_storage.GetCollectionGuid(name));

                if (rootTimeline != null)
                {
                    root = rootTimeline.Id.ToString();
                }
            }

            return root;
        }

        public static Timeline Timelines(string id)
        {
            if (IsGuid(id))
            {
                Guid parsedId = Guid.Parse(id);
                Timeline timeline = _storage.Timelines.Find(parsedId);
                _storage.Entry(timeline).Collection(_ => _.Exhibits).Load();
                foreach (Exhibit exhibit in timeline.Exhibits)
                {
                    _storage.Entry(exhibit).Collection(_ => _.ContentItems).Load();
                }

                _storage.Entry(timeline).Collection(_ => _.ChildTimelines).Load();

                return timeline;
            }

            return null;
        }

        public static Exhibit Exhibits(string id)
        {
            if (IsGuid(id))
            {
                Guid parsedId = Guid.Parse(id);
                Exhibit exhibit = _storage.Exhibits.Find(parsedId);
                _storage.Entry(exhibit).Collection(_ => _.ContentItems).Load();
                return exhibit;
            }

            return null;
        }

        public static ContentItem ContentItems(string id)
        {
            Guid parsedId = Guid.Parse(id);
            return _storage.ContentItems.Find(parsedId);
        }

        public static bool IsTimeline(string id)
        {
            if (IsGuid(id))
            {
                Guid parsedId = Guid.Parse(id);
                return _storage.Timelines.Any(candidate => candidate.Id == parsedId);
            }
            else
            {
                string parsedTitle = FriendlyUrl.FriendlyUrlDecode(id);
                return _storage.Timelines.Any(candidate => candidate.Title == parsedTitle);
            }
        }

        public static bool IsExhibit(string id)
        {
            if (IsGuid(id))
            {
                Guid parsedId = Guid.Parse(id);
                return _storage.Exhibits.Any(candidate => candidate.Id == parsedId);
            }
            else
            {
                return false;
            }
        }

        public static bool IsContentItem(string id)
        {
            if (IsGuid(id))
            {
                Guid parsedId = Guid.Parse(id);
                return _storage.ContentItems.Any(candidate => candidate.Id == parsedId);
            }
            else
            {
                return false;
            }
        }

        public static string GetTitle(Uri url)
        {
            StringBuilder title = new StringBuilder();

            string urlGuid = UrlGuid(url);
            
            if(url != null && url.Segments.Length > 1 && IsGuid(url.Segments[url.Segments.Length - 1]))
                if (IsTimeline(urlGuid)) { 
                    title.Append(Timelines(urlGuid).Title + " - ");
                } else if (IsExhibit(urlGuid)) {
                    title.Append(Exhibits(urlGuid).Title + " - ");
                } else if (IsContentItem(urlGuid)) {
                    title.Append(ContentItems(urlGuid).Title + " - ");
                }

            title.Append("ChronoZoom");

            if (!string.IsNullOrEmpty(UrlSuperCollection(url)))
            {
                if (UrlSuperCollection(url) != ConfigurationManager.AppSettings["DefaultSuperCollection"])
                    title.Append(FriendlyUrl.FriendlyUrlDecode(" (" + UrlSuperCollection(url)) + ")");
            }
            else if (!string.IsNullOrEmpty(UrlCollection(url)))
                title.Append(FriendlyUrl.FriendlyUrlDecode(" (" + UrlCollection(url)) + ")");

            return title.ToString();
        }

        private static Regex isGuid =
            new Regex(@"^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$", RegexOptions.Compiled);

        public static bool IsGuid(string candidate)
        {
            bool isValid = false;

            if (candidate != null)
            {

                if (isGuid.IsMatch(candidate))
                {
                    isValid = true;
                }
            }

            return isValid;
        }
    }
}