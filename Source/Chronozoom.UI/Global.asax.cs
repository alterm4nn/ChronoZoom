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

            String filename = String.Empty;
            if (File.Exists(HostingEnvironment.ApplicationPhysicalPath + @"/Dumps/wahib-responsedumprest.json"))
                filename = @"/Dumps/wahib-responsedumprest.json";
            else if (File.Exists(HostingEnvironment.ApplicationPhysicalPath + "ResponseDumpRest.txt"))
                filename = "ResponseDumpRest.txt";
            else if (File.Exists(HostingEnvironment.ApplicationPhysicalPath + "ResponseDumpRestBase.txt"))
                filename = "ResponseDumpRestBase.txt";
            else
                throw new HttpResponseException(System.Net.HttpStatusCode.InternalServerError);

            using (StreamReader file = File.OpenText(HostingEnvironment.ApplicationPhysicalPath + filename))
            {
                JsonSerializer serializer = new JsonSerializer();
                Globals.Root = (Chronozoom.Api.Models.Timeline)serializer.Deserialize(file, typeof(Chronozoom.Api.Models.Timeline));
            }

            Timer timer = new Timer();
            timer.Interval = 15 * 60 * 1000;
            timer.Tick += Timer_Tick;
            timer.Enabled = true;

            Trace.TraceInformation("Application Starting");
        }

        void Timer_Tick(object sender, EventArgs e)
        {
            if (Globals.Root != null)
            {
                JsonSerializer serializer = new JsonSerializer();
                using (StreamWriter sw = new StreamWriter(HostingEnvironment.ApplicationPhysicalPath + "ResponseDumpRest.txt"))
                using (JsonWriter writer = new JsonTextWriter(sw))
                {
                    Globals.Mutex.WaitOne();
                    serializer.Serialize(writer, Globals.Root);
                    Globals.Mutex.ReleaseMutex();
                }
            }
        }

        public void Application_End(object sender, EventArgs e)
        {
            Timer_Tick(null, null);
        }

        public void Application_Error(object sender, EventArgs e)
        {
        }
    }
}
