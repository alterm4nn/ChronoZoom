using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace UI
{
    public partial class EntryPage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.Browser["IsMobileDevice"] == "false" || Request.QueryString["full"] == "1")
            {
                //Without redirect
                Server.Transfer("cz.htm");
            }
            else
            {
                //Redirect 301
                  Server.Transfer("czmobile.htm");
            }
        }
    }
}