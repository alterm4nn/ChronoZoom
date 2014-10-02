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

namespace Chronozoom.UI
{
    public class PageInformation
    {
        public string AnalyticsServiceId        { get; private set; }
        public string AirbrakeProjectId         { get; private set; }
        public string AirbrakeProjectKey        { get; private set; }
        public string AirbrakeEnvironmentName   { get; private set; }
        public string OneDriveClientID          { get; private set; }
        public bool   SpeechInputEnabled        { get; private set; }
        public string CSSFileVersion            { get; private set; }
        public string JSFileVersion             { get; private set; }
        public string SchemaVersion             { get; private set; }

        [SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        public string Title { get; set; }

        [SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        public string Description { get; set; }

        [SuppressMessage("Microsoft.Design", "CA1002:DoNotExposeGenericLists")]
        public List<string> Images { get; private set; }

        // constructor
        public PageInformation()
        {
            AnalyticsServiceId      = ConfigurationManager.AppSettings["AnalyticsServiceId"];
            AirbrakeProjectId       = ConfigurationManager.AppSettings["AirbrakeProjectId"];
            AirbrakeProjectKey      = ConfigurationManager.AppSettings["AirbrakeProjectKey"];
            AirbrakeEnvironmentName = ConfigurationManager.AppSettings["AirbrakeEnvironmentName"];  if (AirbrakeEnvironmentName == "") AirbrakeEnvironmentName = "development";
            OneDriveClientID        = ConfigurationManager.AppSettings["OneDriveClientID"];

            SpeechInputEnabled      = (("" + ConfigurationManager.AppSettings["SpeechInputEnabled"]).Trim().ToLower() == "true");

            CSSFileVersion = GetFileVersion("/css/cz.min.css");
            JSFileVersion  = GetFileVersion();
            SchemaVersion  = GetLastSchemaUpdate();

            Images = new List<string>();
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
                PageInformation pageInforamtion = new PageInformation();
                return GenerateDefaultPage(pageInforamtion);
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
            if (pageUrl.Segments.Length <= 1 ||
                pageUrl.ToString().EndsWith("default.ashx", StringComparison.OrdinalIgnoreCase))
                return false;

            string superCollection = string.Empty;
            if (pageUrl.Segments.Length >= 2)
                superCollection = pageUrl.Segments[1].Split('/')[0];

            string collection = superCollection;
            if (pageUrl.Segments.Length >= 3)
                collection = pageUrl.Segments[2].Split('/')[0];

            if (IsSuperCollectionPresent(superCollection))
            {

                Timeline timeline = ChronozoomSVC.Instance.GetTimelines(superCollection, collection, null, null, null, null, null, "1");
                if (timeline != null)
                {

                    pageInformation.Title = timeline.Title;

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
            }

            return false;

        }

        /// <summary>
        /// Validates if a supercollection is present.
        /// </summary>
        /// <param name="superCollection"></param>
        /// <returns>Boolean value</returns>
        public static bool IsSuperCollectionPresent(string superCollection)
        {
            string _superCollection = FriendlyUrl.FriendlyUrlDecode( superCollection);
            if (_storage.SuperCollections.Any(candidate => candidate.Title.ToLower() == _superCollection ))
            {
                return true;
            }
            else
            {
                HttpContext.Current.Response.Redirect("/");
                return false;
            }
        }

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
                "analyticsId: \""               + pageInformation.AnalyticsServiceId        + "\", " +
                "airbrakeProjectId: \""         + pageInformation.AirbrakeProjectId         + "\", " +
                "airbrakeProjectKey: \""        + pageInformation.AirbrakeProjectKey        + "\", " +
                "airbrakeEnvironmentName: \""   + pageInformation.AirbrakeEnvironmentName   + "\", " +
                "onedriveClientId: \""          + pageInformation.OneDriveClientID          + "\", " +
                "speechInputEnabled: "          + pageInformation.SpeechInputEnabled.ToString().ToLower() + ", " +
                "cssFileVersion: \""            + pageInformation.CSSFileVersion            + "\", " +
                "jsFileVersion: \""             + pageInformation.JSFileVersion             + "\", " +
                "schemaVersion: \""             + pageInformation.SchemaVersion             + "\", " +
                "environment: \""               + CurrentEnvironment.ToString()             + "\"  " +
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