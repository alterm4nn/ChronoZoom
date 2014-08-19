using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.ServiceModel.Activation;
using System.Web;
using System.Web.Compilation;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.UI;
using Chronozoom.Entities;
using OuterCurve;
using Microsoft.IdentityModel.Web;
using System.Configuration;

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

        internal class UserAgentConstraint : IRouteConstraint
        {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1062:Validate arguments of public methods", MessageId = "0")]
            public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
            {
                return httpContext.Request.Browser.Crawler;
            }
        }

        internal static void RegisterRoutes(RouteCollection routes)
        {
            var routeHandlerDetails = new WebFormRouteHandler<DefaultHttpHandler>(null);
            var crawlerRouteHandler = new WebFormRouteHandler<Page>("/pages/crawler.aspx");

            routes.MapRoute(
                "Account", // Route name
                "account/{action}", // URL with parameters
                new { controller = "Account" } // Parameter defaults
                );

            routes.Add(new ServiceRoute("api", new WebServiceHostFactory(), typeof(ChronozoomSVC)));

            routes.Add(new Route("sitemap.xml", new WebFormRouteHandler<Page>("/pages/sitemap.aspx")));

            RouteValueDictionary crawlerConstraint = new RouteValueDictionary()
            {
                { "crawler", new UserAgentConstraint() }
            };

            AddFriendlyUrlRoutes(routes, crawlerRouteHandler, crawlerConstraint);
            AddFriendlyUrlRoutes(routes, routeHandlerDetails, null);
        }

        private static void AddFriendlyUrlRoutes(RouteCollection routes, IRouteHandler routeHandlerDetails, RouteValueDictionary constraint)
        {
            routes.Add(new Route("{supercollection}", null, constraint, routeHandlerDetails));
            routes.Add(new Route("{supercollection}/{collection}", null, constraint, routeHandlerDetails));
            routes.Add(new Route("{supercollection}/{collection}/{reference}", null, constraint, routeHandlerDetails));
            routes.Add(new Route("{supercollection}/{collection}/{timelineTitle}/{reference}", null, constraint, routeHandlerDetails));
            routes.Add(new Route("{supercollection}/{collection}/{timelineTitle}/{exhibitTitle}/{reference}", null, constraint, routeHandlerDetails));
            routes.Add(new Route("{supercollection}/{collection}/{timelineTitle}/{exhibitTitle}/{contentItemTitle}/{reference}", null, constraint, routeHandlerDetails));
        }

        public void Application_Start(object sender, EventArgs e)
        {
            Trace = new TraceSource("Global", SourceLevels.All);
            Trace.Listeners.Add(SignalRTraceListener);
            Storage.Trace.Listeners.Add(SignalRTraceListener);

            RouteTable.Routes.MapHubs();
            RegisterRoutes(RouteTable.Routes);

            /* Not using bundling as has issues merging CZ scripts. Bundling does have a few known gotchas, including comment on last line of a .js file commenting out a code line in next .js file.
             * Instead we use enable minification and .map creation in Web Essentials (a VS extension.)
             * 
            BundleTable.EnableOptimizations = true; // enables bundling for debug mode
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            */

            Trace.TraceInformation("Checking Db Schema");
            using (Entities.ManualMigrationCheck check = new Entities.ManualMigrationCheck())
            {
                if (check.NewInstall)
                {
                    Trace.TraceInformation("New Install - Populating Initial Db Content");
                    using (Utils.PopulateDbFromJSON populator = new Utils.PopulateDbFromJSON())
                    {
                        populator.LoadDataFromDump("ChronoZoom",    "Cosmos",           "beta-get.json",            "beta-gettours.json",           true,   false);
                        populator.LoadDataFromDump("ChronoZoom",    "AIDS Timeline",    "aidstimeline-get.json",    "aidstimeline-gettours.json",   false,  false);
                    }
                }
            }

            Trace.TraceInformation("Application Starting");
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        void SessionAuthenticationModule_SessionSecurityTokenReceived(object sender, SessionSecurityTokenReceivedEventArgs e)
        {
            int minutes = 60;
            DateTime now = DateTime.UtcNow;
            DateTime validTo = e.SessionToken.ValidTo;

            //This can reduce token updates count
            if (now < validTo)
            {
                SessionAuthenticationModule sam = sender as SessionAuthenticationModule;
                e.SessionToken = sam.CreateSessionSecurityToken(e.SessionToken.ClaimsPrincipal, e.SessionToken.Context, now, now.AddMinutes(minutes), e.SessionToken.IsPersistent);
                e.ReissueCookie = true;
            }
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
                if (Request.Browser.Crawler)
                {
                    app.Context.RewritePath(string.Concat(app.Context.Request.Url.LocalPath, "/pages/crawler.aspx"));
                }
                else
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