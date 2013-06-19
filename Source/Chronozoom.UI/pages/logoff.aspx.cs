using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using Chronozoom.Api.Controllers;
using System.Web.Security;
using Microsoft.IdentityModel.Web;

namespace Chronozoom.UI
{
    public partial class LogOff : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            WSFederationAuthenticationModule fam = FederatedAuthentication.WSFederationAuthenticationModule;

            try
            {
                FormsAuthentication.SignOut();
            }
            finally
            {
                fam.SignOut(true);
            }
        }

        public static Uri LogOffUrl()
        {
            Uri logOffUrl = new Uri("/", UriKind.Relative);

            switch (GetIdentityProvider())
            {
                case "uri:WindowsLiveID":
                    logOffUrl = new Uri("https://login.live.com/login.srf?wa=wsignout1.0");
                    break;
                case "Google":
                    logOffUrl = new Uri("https://accounts.google.com/Logout");
                    break;
                case "Yahoo!":
                    logOffUrl = new Uri("https://login.yahoo.com/config/login?logout=1");
                    break;
                default:
                    break;
            }

            return logOffUrl;
        }

        private static string GetIdentityProvider()
        {
            Microsoft.IdentityModel.Claims.ClaimsIdentity claimsIdentity = System.Web.HttpContext.Current.User.Identity as Microsoft.IdentityModel.Claims.ClaimsIdentity;

            if (claimsIdentity == null || !claimsIdentity.IsAuthenticated)
                return null;

            Microsoft.IdentityModel.Claims.Claim identityProviderClaim = claimsIdentity.Claims.Where(candidate => candidate.ClaimType.EndsWith("identityprovider", StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
            if (identityProviderClaim == null)
                return null;

            return identityProviderClaim.Value;
        }
    }
}