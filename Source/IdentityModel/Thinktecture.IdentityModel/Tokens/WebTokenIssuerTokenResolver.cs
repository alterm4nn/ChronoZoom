/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.Generic;
using System.IdentityModel.Selectors;
using System.IdentityModel.Tokens;

namespace Thinktecture.IdentityModel.Tokens
{
    public class WebTokenIssuerTokenResolver : SecurityTokenResolver
    {
        Dictionary<string, string> _signingKeys = new Dictionary<string, string>();

        public void AddSigningKey(string issuer, string signingKey)
        {
            _signingKeys.Add(issuer.ToLowerInvariant(), signingKey);
        }

        protected override bool TryResolveSecurityKeyCore(SecurityKeyIdentifierClause keyIdentifierClause, out SecurityKey key)
        {
            key = null;
            var swtClause = keyIdentifierClause as WebTokenSecurityKeyClause;

            string value;
            if (_signingKeys.TryGetValue(swtClause.Issuer.ToLowerInvariant(), out value))
            {
                key = new InMemorySymmetricSecurityKey(Convert.FromBase64String(value));

                return true;
            }

            return false;
        }

        #region Not Implemented
        protected override bool TryResolveTokenCore(System.IdentityModel.Tokens.SecurityKeyIdentifierClause keyIdentifierClause, out System.IdentityModel.Tokens.SecurityToken token)
        {
            throw new NotImplementedException();
        }

        protected override bool TryResolveTokenCore(System.IdentityModel.Tokens.SecurityKeyIdentifier keyIdentifier, out System.IdentityModel.Tokens.SecurityToken token)
        {
            throw new NotImplementedException();
        }
        #endregion
    }
}