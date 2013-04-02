/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.IdentityModel.Selectors;
using Microsoft.IdentityModel.Tokens;

namespace Thinktecture.IdentityModel.Tokens.Http
{
    class HttpsSecurityTokenHandler : X509SecurityTokenHandler
    {
        public HttpsSecurityTokenHandler()
            : base(X509CertificateValidator.None)
        {
            Configuration = new SecurityTokenHandlerConfiguration
            {
                IssuerNameRegistry = new HttpsIssuerNameRegistry()
            };
        }
    }
}
