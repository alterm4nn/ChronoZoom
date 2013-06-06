using Chronozoom.Entities;
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
    /// <summary>
    /// Summary description for _default
    /// </summary>
    public class DefaultHttpHandler : IHttpHandler
    {
        private const string _mainPageName = @"cz.html";
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

        private class PageInformation
        {
            public PageInformation()
            {
                AnalyticsServiceId = ConfigurationManager.AppSettings["AnalyticsServiceId"];
                ExceptionsServiceId = ConfigurationManager.AppSettings["ExceptionsServiceId"];
                Images = new List<string>();
            }

            public string AnalyticsServiceId { get; set; }

            public string ExceptionsServiceId { get; set; }

            [SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
            public string Title { get; set; }

            [SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
            public string Description { get; set; }

            [SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
            public string IECompatibile { get; set; }


            public List<string> Images { get; private set; }
        }

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
            if (pageUrl.Segments.Length <= 1 || pageUrl.ToString().EndsWith("default.ashx", StringComparison.OrdinalIgnoreCase))
                return false;

            string superCollection = string.Empty;
            if (pageUrl.Segments.Length >= 2)
                superCollection = pageUrl.Segments[1].Split('/')[0];

            string collection = superCollection;
            if (pageUrl.Segments.Length >= 3)
                collection = pageUrl.Segments[2].Split('/')[0];

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

            return false;
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        private static string GenerateDefaultPage(PageInformation pageInformation)
        {
            using (StreamReader streamReader = new StreamReader(AppDomain.CurrentDomain.BaseDirectory + _mainPageName))
            {
                XmlReader xmlReader = new XmlTextReader(streamReader);
                XDocument pageRoot = XDocument.Load(xmlReader);

                XNamespace ns = "http://www.w3.org/1999/xhtml";
                XmlNamespaceManager xmlNamespaceManager = new XmlNamespaceManager(xmlReader.NameTable);
                xmlNamespaceManager.AddNamespace("xhtml", ns.ToString());

                ComposePage(pageRoot, xmlNamespaceManager, pageInformation);
                return pageRoot.ToString();
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
                "analyticsId: \"" + pageInformation.AnalyticsServiceId + "\", " +
                "exceptionsId: \"" + pageInformation.ExceptionsServiceId + "\", " +
                "environment: \"" + CurrentEnvironment.ToString() + "\" " +
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

            XElement metaIECompatibile = pageRoot.XPathSelectElement("/xhtml:html/xhtml:head/xhtml:meta[@http-equiv='X-UA-Compatible']", xmlNamespaceManager);
            XName contentIEAttribute = "content";

            metaIECompatibile.SetAttributeValue(contentIEAttribute, "IE=edge");

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