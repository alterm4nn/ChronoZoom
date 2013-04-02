/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Diagnostics;
using System.IdentityModel.Tokens;
using Microsoft.IdentityModel.Tokens;

namespace Thinktecture.IdentityModel.Tokens
{
    /// <summary>
    /// Simple implementation of an issuer registy that returns the certificate issuer name or public key hash as an issuer
    /// </summary>
    public class TestIssuerNameRegistry : IssuerNameRegistry
    {
        /// <summary>
        /// Gets the name of the issuer.
        /// </summary>
        /// <param name="securityToken">The security token.</param>
        /// <returns></returns>
        public override string GetIssuerName(SecurityToken securityToken)
        {
            if (securityToken == null)
            {
                throw new ArgumentNullException("securityToken");
            }

            var x509Token = securityToken as X509SecurityToken;
            if (x509Token != null)
            {
                var issuer = x509Token.Certificate.Thumbprint;
                Debug.WriteLine("Certificate thumbprint: " + issuer);

                return issuer;
            }
            
            var rsaToken = securityToken as RsaSecurityToken;
            if (rsaToken != null)
            {
                var issuer = rsaToken.Rsa.ToXmlString(false);
                Debug.WriteLine("RSA: " + issuer);

                return issuer;
            }

            throw new SecurityTokenException(securityToken.GetType().FullName);
        }
    }
}
