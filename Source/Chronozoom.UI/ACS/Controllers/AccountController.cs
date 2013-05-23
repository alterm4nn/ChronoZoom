using ASC.Hrd;
using ASC.Models;
using Microsoft.IdentityModel.Protocols.WSFederation;
using Microsoft.IdentityModel.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Chronozoom.Api.Controllers
{
    public class AccountController : Controller
    {
        private HrdClient hrdClient;

        public AccountController(HrdClient client)
        {
            hrdClient = client;
        }

        public AccountController(): this(new HrdClient())
        {
        }

        public void Index()
        {

        }


        public bool IsAuth()
        {
            if (Request.IsAuthenticated)
                return true;
            else
                return false;
        }


        public ActionResult Login()
        {
            return Redirect("/");
        }

        [ValidateInput(false)]
        public ActionResult Success(FormCollection forms)
        {
            if (Request.IsAuthenticated)
            {
                var user = (Microsoft.IdentityModel.Claims.IClaimsIdentity)HttpContext.User.Identity;

                string NameIdentifier = "";
                string IdentityProvider = "";

                foreach (var item in user.Claims)
                {
                    if (item.ClaimType.EndsWith("nameidentifier"))
                    {
                        NameIdentifier = item.Value;
                    }
                    else if (item.ClaimType.EndsWith("identityprovider"))
                    {
                        IdentityProvider = item.Value;
                    }
                }

                // We use return url as context
                //string returnUrl = GetUrlFromContext(forms);

                //if (!string.IsNullOrEmpty(returnUrl))
                //{
                //    return Redirect(returnUrl);
                //}
            }

            // Temporary redirect to sandbox
            return Redirect("/cz.html");
        }

        // GET: /Account/Logout
        [HttpGet]
        public ActionResult Logout()
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

            return Redirect("/cz.html");
        }

        //[ChildActionOnly]
        public ActionResult IdentityProvidersWithClientSideCode()
        {
            WSFederationAuthenticationModule fam = FederatedAuthentication.WSFederationAuthenticationModule;
            HrdRequest request = new HrdRequest(fam.Issuer, fam.Realm, context: Request.Url.AbsoluteUri);

            return PartialView("_IdentityProvidersWithClientSideCode", request);
        }

        //
        // Shows how to use server side code to get the identity providers data 
        //
        [OutputCache(Duration = 10)]
        //[ChildActionOnly]
        public ActionResult IdentityProvidersWithServerSideCode()
        {
            WSFederationAuthenticationModule fam = FederatedAuthentication.WSFederationAuthenticationModule;
            HrdRequest request = new HrdRequest(fam.Issuer, fam.Realm, context: Request.Url.AbsoluteUri);

            IEnumerable<HrdIdentityProvider> hrdIdentityProviders = hrdClient.GetHrdResponse(request);

            return PartialView("_IdentityProvidersWithServerSideCode", hrdIdentityProviders);
        }

        /// <summary>
        /// Gets from the form the context
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        private static string GetUrlFromContext(FormCollection form)
        {
            WSFederationMessage message = WSFederationMessage.CreateFromNameValueCollection(new Uri("http://www.notused.com"), form);
            return (message != null ? message.Context : null);
        }
    }
}