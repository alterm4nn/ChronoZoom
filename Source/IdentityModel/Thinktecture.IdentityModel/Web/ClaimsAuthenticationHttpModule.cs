/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Web;
using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Web;
using Thinktecture.IdentityModel.Tokens.Http;

namespace Thinktecture.IdentityModel.Web
{
    public class ClaimsAuthenticationHttpModule : IHttpModule
    {
        public void Dispose()
        { }

        public void Init(HttpApplication context)
        {
            context.PostAuthenticateRequest += Context_PostAuthenticateRequest;
        }

        void Context_PostAuthenticateRequest(object sender, EventArgs e)
        {
            var context = ((HttpApplication)sender).Context;

            // no need to call transformation if session already exists
            if (FederatedAuthentication.SessionAuthenticationModule != null &&
                FederatedAuthentication.SessionAuthenticationModule.ContainsSessionTokenCookie(context.Request.Cookies))
            {
                return;
            }

            var transformer = FederatedAuthentication.ServiceConfiguration.ClaimsAuthenticationManager;
            if (transformer != null)
            {
                var principal = context.User as ClaimsPrincipal;

                if (context.Request.ClientCertificate.IsPresent && context.Request.ClientCertificate.IsValid)
                {
                    var cert = new X509Certificate2(context.Request.ClientCertificate.Certificate);
                    var token = new X509SecurityToken(cert);
                    var certId = new HttpsSecurityTokenHandler().ValidateToken(token).First();

                    principal.Identities.Add(certId);
                }

                var transformedPrincipal = transformer.Authenticate(context.Request.RawUrl, principal);

                context.User = transformedPrincipal;
                Thread.CurrentPrincipal = transformedPrincipal;
            }
        }
    }
}