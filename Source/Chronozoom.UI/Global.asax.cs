// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using Chronozoom.Api;
using Chronozoom.Api.Models;
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

namespace UI
{
    public class Global : System.Web.HttpApplication
    {
        internal static readonly TraceListener SignalRTraceListener = new SignalRTraceListener();

        internal static TraceSource Trace { get; set; }

        public class WebFormRouteHandler<T> : IRouteHandler where T : IHttpHandler, new()
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

        public static void RegisterRoutes(RouteCollection routes)
        {
            var routeHandlerDetails = new WebFormRouteHandler<Page>("~/cz.aspx");
            routes.MapRoute(
                "Account", // Route name
                "account/{action}", // URL with parameters
                new { controller = "Account" } // Parameter defaults
            );
            routes.Add(new Route("{supercollection}/{collection}/", routeHandlerDetails));

        }

        public void Application_Start(object sender, EventArgs e)
        {
            Trace = new TraceSource("Global", SourceLevels.All);
            Trace.Listeners.Add(SignalRTraceListener);
            Storage.Trace.Listeners.Add(SignalRTraceListener);

            RouteTable.Routes.MapHubs();
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            RegisterRoutes(RouteTable.Routes);


            using (StreamReader file = File.OpenText(HostingEnvironment.ApplicationPhysicalPath + @"ResponseDumpRest.txt"))
            {
                JsonSerializer serializer = new JsonSerializer();
                Globals.Root = (Chronozoom.Api.Models.Timeline)serializer.Deserialize(file, typeof(Chronozoom.Api.Models.Timeline));
            }

            Trace.TraceInformation("Application Starting");
        }

        public void Application_End(object sender, EventArgs e)
        {
        }

        public void Application_Error(object sender, EventArgs e)
        {
        }

        void Application_BeginRequest(object sender, EventArgs e)
        {
            Regex r = new Regex(@"^/[a-z\-_0-9]+/?$");

            var app = (HttpApplication)sender;
            if (app.Context.Request.Url.LocalPath=="/")
            {
                app.Context.RewritePath(
                         string.Concat(app.Context.Request.Url.LocalPath, "cz.aspx"));
            }
            else if( r.IsMatch(app.Context.Request.Url.LocalPath))
            {
                app.Context.RewritePath(string.Concat(app.Context.Request.Url.LocalPath, "cz.aspx?new=1"));
            }
        }
    }
}