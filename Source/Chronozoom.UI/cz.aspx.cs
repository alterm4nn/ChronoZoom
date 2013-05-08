// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;

namespace UI
{
    public partial class EntryPage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.Browser["IsMobileDevice"] == "false" || Request.QueryString["full"] == "1")
            {
                Server.Transfer(Page.ResolveUrl("~/") + "/cz.html");
            }
            else
            {
                Server.Transfer(Page.ResolveUrl("~/") + "/cz.html?experience=mobile");
            }
        }
    }
}