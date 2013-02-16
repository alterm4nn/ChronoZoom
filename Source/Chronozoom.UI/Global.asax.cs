// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;

namespace UI
{
    using System.Data.Entity;

    public class Global : System.Web.HttpApplication
    {
        public void Application_Start(object sender, EventArgs e)
        {
            Database.SetInitializer(new Storage.StorageChangeInitializer());
        }

        public void Application_End(object sender, EventArgs e)
        {
        }

        public void Application_Error(object sender, EventArgs e)
        {
        }

        public void Session_Start(object sender, EventArgs e)
        {
        }

        public void Session_End(object sender, EventArgs e)
        {
            // Code that runs when a session ends. 
            // Note: The Session_End event is raised only when the sessionstate mode
            // is set to InProc in the Web.config file. If session mode is set to StateServer 
            // or SQLServer, the event is not raised.
        }
    }
}