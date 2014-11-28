using System.Diagnostics;
using Chronozoom.Entities;
using Chronozoom.UI;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Description;
using System.Web;
using System.Xml;
using System.Xml.Linq;
using System.Xml.XPath;
using System.Text.RegularExpressions;

namespace Chronozoom.UI
{
    public class PageInformation
    {
        public string AnalyticsServiceId    { get; private set; }
        public bool   AirbrakeTrackServer   { get; private set; }
        public bool   AirbrakeTrackClient   { get; private set; }
        public string AirbrakeProjectId     { get; private set; }
        public string AirbrakeProjectKey    { get; private set; }
        public string AirbrakeEnvironment   { get; private set; }
        public string FeaturedContentList   { get; private set; }
        public string OneDriveClientID      { get; private set; }
        public bool   UseMergedJSFiles      { get; private set; }
        public bool   UseMinifiedJSFiles    { get; private set; }
        public string CSSFileVersion        { get; private set; }
        public string JSFileVersion         { get; private set; }
        public string SchemaVersion         { get; private set; }

        [SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        public string Title { get; set; }

        [SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        public string Description { get; set; }

        [SuppressMessage("Microsoft.Design", "CA1002:DoNotExposeGenericLists")]
        public List<string> Images { get; private set; }

        // constructor
        public PageInformation()
        {
            AnalyticsServiceId  = ConfigurationManager.AppSettings["AnalyticsServiceId"];
            AirbrakeTrackClient = ConfigurationManager.AppSettings["Airbrake.TrackClient"       ].ToLower() == "true" ? true : false;
            AirbrakeProjectId   = AirbrakeTrackClient ? ConfigurationManager.AppSettings["Airbrake.ProjectId"   ] : "";
            AirbrakeProjectKey  = AirbrakeTrackClient ? ConfigurationManager.AppSettings["Airbrake.ApiKey"      ] : "";
            AirbrakeEnvironment = ConfigurationManager.AppSettings["Airbrake.Environment"       ]; if (AirbrakeEnvironment == "") AirbrakeEnvironment = "development";
            FeaturedContentList = ConfigurationManager.AppSettings["FeaturedContentListLocation"]; if (FeaturedContentList == "") FeaturedContentList = "/featured/featured.json";
            OneDriveClientID    = ConfigurationManager.AppSettings["OneDriveClientID"];
            UseMergedJSFiles    = ConfigurationManager.AppSettings["UseMergedJavaScriptFiles"   ].ToLower() == "true" ? true : false;
            UseMinifiedJSFiles  = ConfigurationManager.AppSettings["UseMinifiedJavaScriptFiles" ].ToLower() == "true" ? true : false;
            CSSFileVersion      = GetFileVersion("/css/cz.min.css");
            JSFileVersion       = GetFileVersion("/cz.merged.js");
            SchemaVersion       = GetLastSchemaUpdate();
            Images              = new List<string>();
        }

        /// <summary>
        /// Used to obtain a versioning value that can be used in a query string when linking static content such as .js and .css files.
        /// The versioning value changes every time the file is changed, and can be used so that browsers do not need to be manually refreshed by users when static content changes.
        /// For example, x.js?v=2014-12-31--17-30 is seen by browsers as a different file compared to x.js?v2015-01-01--00-00.
        /// It should be noted that this particular approach is not be suitable for a web farm unless sticky IPs are used on the load balancer.
        /// </summary>
        /// <param name="webPath">Optional path to static content file such as .js or .css file. Leave blank to use assembly build date/time.</param>
        /// <returns>GMT/UTC string based off of file creation date and time.</returns>
        private string GetFileVersion(string webPath = "")
        {
            DateTime rv;

            if (webPath == "")
            {
                // use assembly date/time (from when last built)
                rv = File.GetCreationTime(System.Reflection.Assembly.GetExecutingAssembly().Location).ToUniversalTime();
            }
            else
            {
                // get date/time from file specified in webPath
                FileInfo info = new FileInfo(HttpContext.Current.Server.MapPath(webPath));
                rv = info.LastWriteTimeUtc;
            }

            return rv.ToString("yyyy-MM-dd--HH-mm-ss");
        }

        /// <summary>
        /// Used to obtain a string that is unique for each version of the db schema.
        /// When importing a saved timeline, this is used to ensure that the timeline being imported
        /// was created under the same version of the db schema as is currently being run.
        /// </summary>
        /// <returns>A multipart string that includes a date prefix, but no need to break down further.</returns>
        private string GetLastSchemaUpdate()
        {
            using (Entities.Version version = new Entities.Version())
            {
                return version.LastUpdate();
            }
        }
    }

    /// <summary>
    /// Summary description for _default
    /// </summary>
    public class DefaultHttpHandler : IHttpHandler
    {
        private const string _mainPageName = @"cz.html";
        private static readonly Storage _storage = new Storage();

        private static readonly Lazy<string> _mainPage = new Lazy<string>(() =>
            {
                PageInformation pageInformation = new PageInformation();
                return GenerateDefaultPage(pageInformation);
            });

        private static Lazy<string> _hostPath = new Lazy<string>(() =>
            {
                Uri uri = HttpContext.Current.Request.Url;
                return uri.Scheme + Uri.SchemeDelimiter + uri.Host + ":" + uri.Port;
            });

        private static Lazy<string> _baseDirectory = new Lazy<string>(() =>
            {
                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["BaseDirectory"]))
                    return ConfigurationManager.AppSettings["BaseDirectory"];

                return AppDomain.CurrentDomain.BaseDirectory;
            });

        public void ProcessRequest(HttpContext context)
        {
            if (context == null)
                throw new ArgumentNullException("context");

            context.Response.ContentType = "text/html";

            PageInformation pageInformation;
            if (PageIsDynamic(HttpContext.Current.Request.Url, out pageInformation))
            {
                context.Response.Write(GenerateDefaultPage(pageInformation));
            }
            else
            {
                context.Response.Write(_mainPage.Value);
            }
        }

        private static bool PageIsDynamic(Uri pageUrl, out PageInformation pageInformation)
        {
            pageInformation = new PageInformation();

            // if the home page was specified
            if
            (
                pageUrl.Segments.Length == 1 ||
                pageUrl.ToString().EndsWith("default.ashx", StringComparison.OrdinalIgnoreCase)
            )
            {
                // then exit reporting page is not dynamic
                return false;
            }

            // home page was not specified so ascertain the superCollection title and collection Path from the URL
            string superCollectionSegment =
                Regex.Replace(pageUrl.Segments[1].Trim(), @"[^A-Za-z0-9]+", "").ToLower();

            string collectionSegment = pageUrl.Segments.Length < 3 ? "" :
                Regex.Replace(pageUrl.Segments[2].Trim(), @"[^A-Za-z0-9]+", "").ToLower();

            // try to look up collection id
            Guid collectionId = ChronozoomSVC.Instance.CollectionIdOrDefault(_storage, superCollectionSegment, collectionSegment);

            // if collection id could not be found
            if (collectionId == Guid.Empty)
            {
                // if collection segment was specified (and also the supercollection segment)
                if (collectionSegment != "")
                {
                    // redirect to the default collection for the specified supercollection
                    HttpContext.Current.Response.Redirect("/" + superCollectionSegment + "#");
                    return false;
                }

                // otherwise redirect to the default supercollection's default collection
                HttpContext.Current.Response.Redirect("/#");
                return false;
            }

            // set page title to collection title (must be server-side and not through JS for SEO purposes)
            pageInformation.Title = (ChronozoomSVC.Instance.GetCollection(superCollectionSegment, collectionSegment)).Title;

            // collection id was found so try to get root timeline and its accoutriments
            Timeline timeline = ChronozoomSVC.Instance.GetTimelines(superCollectionSegment, collectionSegment, null, null, null, null, null, "1");
            if (timeline == null)
            {
                // a timeline for this collection could not be found so exit reporting page is not dynamic
                return false;
            }

            // timeline was found so populate rest of page contents and report page is dynamic
            foreach (Exhibit exhibit in timeline.Exhibits)
            {
                foreach (ContentItem contentItem in exhibit.ContentItems)
                {
                    if (contentItem.Uri.ToString().EndsWith(".jpg", StringComparison.OrdinalIgnoreCase))
                    {
                        pageInformation.Images.Add(contentItem.Uri);
                    }
                }
            }

            return true;
        }

        /// <summary>
        /// Not referenced by CZ but still required for DefaultHttpHandler.
        /// </summary>
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        internal static string GenerateDefaultPage(PageInformation pageInformation)
        {
            try
            {
                using (StreamReader streamReader = new StreamReader(_baseDirectory.Value + _mainPageName))
                {
                    XmlReader xmlReader = new XmlTextReader(streamReader);
                    XDocument pageRoot = XDocument.Load(xmlReader);

                    // Remove DOCTYPE extra []
                    pageRoot.DocumentType.InternalSubset = null;

                    XNamespace ns = "http://www.w3.org/1999/xhtml";
                    XmlNamespaceManager xmlNamespaceManager = new XmlNamespaceManager(xmlReader.NameTable);
                    xmlNamespaceManager.AddNamespace("xhtml", ns.ToString());

                    ComposePage(pageRoot, xmlNamespaceManager, pageInformation);
                    return pageRoot.ToString();
                }
            }
            catch (Exception e)
            {
                if (e is OutOfMemoryException)
                    throw;

                // Not critical since the generated page only contains additional metadata used in SEO/Embedding
                return _mainPage.Value;
            }
        }

        private enum Environment
        {
            Localhost,
            Test,
            Production,
        }

        private static Environment CurrentEnvironment
        {
            get
            {
                if (_hostPath.Value.ToString().Contains("localhost"))
                    return Environment.Localhost;
                else if (_hostPath.Value.ToString().Contains("www."))
                    return Environment.Production;
                else
                    return Environment.Test;
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA1801:ReviewUnusedParameters", MessageId = "ns")]
        private static void ComposePage(XDocument pageRoot, XmlNamespaceManager xmlNamespaceManager, PageInformation pageInformation)
        {
            XElement scriptNode = pageRoot.XPathSelectElement("/xhtml:html/xhtml:head/xhtml:script[@id='constants']", xmlNamespaceManager);
            scriptNode.Value = "var constants = { " +
                "analyticsId: \""           + pageInformation.AnalyticsServiceId                        + "\", " +
                "airbrakeTrackClient: "     + pageInformation.AirbrakeTrackClient.ToString().ToLower()  + ", "   +
                "airbrakeProjectId: \""     + pageInformation.AirbrakeProjectId                         + "\", " +
                "airbrakeProjectKey: \""    + pageInformation.AirbrakeProjectKey                        + "\", " +
                "airbrakeEnvironment: \""   + pageInformation.AirbrakeEnvironment                       + "\", " +
                "featuredContentList: \""   + pageInformation.FeaturedContentList                       + "\", " +
                "onedriveClientId: \""      + pageInformation.OneDriveClientID                          + "\", " +
                "useMergedJSFiles: "        + pageInformation.UseMergedJSFiles.ToString(  ).ToLower()   +   ", " +
                "useMinifiedJSFiles: "      + pageInformation.UseMinifiedJSFiles.ToString().ToLower()   +   ", " +
                "cssFileVersion: \""        + pageInformation.CSSFileVersion                            + "\", " +
                "jsFileVersion: \""         + pageInformation.JSFileVersion                             + "\", " +
                "schemaVersion: \""         + pageInformation.SchemaVersion                             + "\", " +
                "environment: \""           + CurrentEnvironment.ToString()                             + "\"  " +
                "};";

            if (!string.IsNullOrEmpty(pageInformation.Title))
            {
                XElement titleNode = pageRoot.XPathSelectElement("/xhtml:html/xhtml:head/xhtml:title", xmlNamespaceManager);
                titleNode.Value = string.Format(CultureInfo.InvariantCulture, "{0} - ChronoZoom", pageInformation.Title);
            }

            if (!string.IsNullOrEmpty(pageInformation.Description))
            {
                XElement metaDescription = pageRoot.XPathSelectElement("/xhtml:html/xhtml:head/xhtml:meta[@name='Description']", xmlNamespaceManager);
                XName contentAttribute = "content";

                metaDescription.SetAttributeValue(contentAttribute, pageInformation.Description);
            }

            XElement lastMetaTag = pageRoot.XPathSelectElement("/xhtml:html/xhtml:head/xhtml:meta[@name='viewport']", xmlNamespaceManager);
            int imageCount = 0;
            foreach (string image in pageInformation.Images)
            {
                if (++imageCount > 3) break;

                XName metaNode = "meta";
                XName linkNode = "link";
                lastMetaTag.AddAfterSelf(
                    new XElement(
                        linkNode,
                        new XAttribute("rel", "image_src"),
                        new XAttribute("href", image)
                    ),
                    new XElement(
                        metaNode,
                        new XAttribute("property", "og:image"),
                        new XAttribute("content", image)
                    )
                );
            }
        }
    }
}