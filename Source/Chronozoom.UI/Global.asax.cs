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
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Routing;

namespace UI
{
    public class Global : System.Web.HttpApplication
    {
        internal static readonly TraceListener SignalRTraceListener = new SignalRTraceListener();

        internal static TraceSource Trace { get; set; }

        public void Application_Start(object sender, EventArgs e)
        {
            Trace = new TraceSource("Global", SourceLevels.All);
            Trace.Listeners.Add(SignalRTraceListener);
            Storage.Trace.Listeners.Add(SignalRTraceListener);

            RouteTable.Routes.MapHubs();
            WebApiConfig.Register(GlobalConfiguration.Configuration);

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
    }
}