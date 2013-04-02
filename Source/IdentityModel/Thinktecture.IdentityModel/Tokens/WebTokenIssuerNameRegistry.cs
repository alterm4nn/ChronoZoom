/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Collections.Generic;
using System.IdentityModel.Tokens;
using Microsoft.IdentityModel.Tokens;

namespace Thinktecture.IdentityModel.Tokens
{
    public class WebTokenIssuerNameRegistry : IssuerNameRegistry
    {
        Dictionary<string, string> _allowedIssuers = new Dictionary<string, string>();

        public void AddTrustedIssuer(string issuerUri, string issuerName)
        {
            _allowedIssuers.Add(issuerUri.ToLowerInvariant(), issuerName.ToLowerInvariant());
        }

        public override string GetIssuerName(SecurityToken securityToken)
        {
            var swt = securityToken as SimpleWebToken;
            if (swt != null)
            {
                string name;
                if (_allowedIssuers.TryGetValue(swt.Issuer.ToLowerInvariant(), out name))
                {
                    return name;
                }   
            }

            var jwt = securityToken as JsonWebToken;
            if (jwt != null)
            {
                string name;
                if (_allowedIssuers.TryGetValue(jwt.Issuer.ToLowerInvariant(), out name))
                {
                    return name;
                }
            }

            return null;
        }
    }
}