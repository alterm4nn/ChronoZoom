// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Data.Entity;
using System.Diagnostics;
using System.Web.Routing;
using OuterCurve;

namespace UI
{
    public class Global : System.Web.HttpApplication
    {
        public static TraceSource Trace = new TraceSource("Global", SourceLevels.All);

        public static TraceListener SignalRTraceListener = new SignalRTraceListener();

        public void Application_Start(object sender, EventArgs e)
        {
            Trace.Listeners.Add(SignalRTraceListener);
            RouteTable.Routes.MapHubs();

            Trace.TraceInformation("Application Starting");
            Database.SetInitializer(new Storage.StorageChangeInitializer());
        }

        public void Application_End(object sender, EventArgs e)
        {
        }

        public void Application_Error(object sender, EventArgs e)
        {
        }
    }
}