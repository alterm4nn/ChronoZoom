// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using Chronozoom.Api;
using Chronozoom.Entities;
using Newtonsoft.Json;
using OuterCurve;
using System;
using System.Diagnostics;
using System.IO;
using System.Web;
using System.Web.Compilation;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Routing;
using System.Web.UI;
using System.Web.Mvc;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.ServiceModel.Activation;


namespace Chronozoom.UI
{
    public class Global : System.Web.HttpApplication
    {
        internal static readonly TraceListener SignalRTraceListener = new SignalRTraceListener();

        internal static TraceSource Trace { get; set; }

        internal class WebFormRouteHandler<T> : IRouteHandler where T : IHttpHandler, new()
        {
            public string VirtualPath { get; set; }

            public WebFormRouteHandler(string virtualPath)
            {
                this.VirtualPath = virtualPath;
            }

            public IHttpHandler GetHttpHandler(RequestContext requestContext)
            {
                return (VirtualPath != null)
                    ? (IHttpHandler)BuildManager.CreateInstanceFromVirtualPath(VirtualPath, typeof(T))
                    : new T();
            }
        }

        internal static void RegisterRoutes(RouteCollection routes)
        {
            var routeHandlerDetails = new WebFormRouteHandler<DefaultHttpHandler>(null);
            routes.MapRoute(
                "Account", // Route name
                "account/{action}", // URL with parameters
                new { controller = "Account" } // Parameter defaults
                );

            routes.Add(new ServiceRoute("api", new WebServiceHostFactory(), typeof(ChronozoomSVC)));

            routes.Add(new Route("{supercollection}", routeHandlerDetails));
            routes.Add(new Route("{supercollection}/{collection}", routeHandlerDetails));
            routes.Add(new Route("{supercollection}/{collection}/{reference}", routeHandlerDetails));
            routes.Add(new Route("{supercollection}/{collection}/{timelineTitle}/{reference}", routeHandlerDetails));
            routes.Add(new Route("{supercollection}/{collection}/{timelineTitle}/{exhibitTitle}/{reference}", routeHandlerDetails));
            routes.Add(new Route("{supercollection}/{collection}/{timelineTitle}/{exhibitTitle}/{contentItemTitle}/{reference}", routeHandlerDetails));
        }

        public void Application_Start(object sender, EventArgs e)
        {
            Trace = new TraceSource("Global", SourceLevels.All);
            Trace.Listeners.Add(SignalRTraceListener);
            Storage.Trace.Listeners.Add(SignalRTraceListener);

            RouteTable.Routes.MapHubs();
            RegisterRoutes(RouteTable.Routes);

            Trace.TraceInformation("Application Starting");
        }

        public void Application_End(object sender, EventArgs e)
        {
        }

        public void Application_Error(object sender, EventArgs e)
        {
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        public void Application_BeginRequest(object sender, EventArgs e)
        {
            var app = (HttpApplication)sender;
            if (app.Context.Request.Url.LocalPath == "/")
            {
                if (BrowserIsSupported())
                {
                    app.Context.RewritePath(string.Concat(app.Context.Request.Url.LocalPath, "default.ashx"));
                }
                else
                {
                    app.Context.RewritePath(string.Concat(app.Context.Request.Url.LocalPath, "fallback.html"));
                }
            }
        }

        // Supported versions - Moved from JavaScript and added Opera
        private static readonly Dictionary<string, int> _supportedMatrix = new Dictionary<string, int>()
        {
            { "IE", 9 },
            { "Firefox", 7 },
            { "Chrome", 14 },
            { "Safari", 5 },
            { "Opera", 10 },
        };

        private bool BrowserIsSupported()
        {
            System.Web.HttpBrowserCapabilities browser = Request.Browser;

            if (_supportedMatrix.ContainsKey(browser.Browser))
            {
                return Double.Parse(browser.Version, System.Globalization.CultureInfo.InvariantCulture) >= _supportedMatrix[browser.Browser];
            }

            return true;
        }
    }
}