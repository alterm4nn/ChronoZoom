/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Diagnostics.Contracts;
using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;

namespace Thinktecture.IdentityModel.Extensions
{
    /// <summary>
    /// Extension methods for X509CertificateEndpointIdentity
    /// </summary>
    public static class X509CertificateEndpointIdentityExtensions
    {
        /// <summary>
        /// Finds the leaf certificate on an X509EndpointIdentity
        /// </summary>
        /// <param name="epi">The epi.</param>
        /// <returns>The target site X509 certificate</returns>
        public static X509Certificate2 GetEndCertificate(this X509CertificateEndpointIdentity epi)
        {
            Contract.Requires(epi != null);
            Contract.Requires(epi.IdentityClaim != null);
            Contract.Requires(epi.IdentityClaim.Resource != null);
            Contract.Ensures(Contract.Result<X509Certificate2>() != null);
            

            string primaryHash64 = Convert.ToBase64String((byte[])epi.IdentityClaim.Resource);

            foreach (var certificate in epi.Certificates)
            {
                string certHash64 = Convert.ToBase64String(certificate.GetCertHash());
                if (string.Equals(primaryHash64, certHash64, StringComparison.OrdinalIgnoreCase))
                {
                    return certificate;
                }
            }

            throw new InvalidOperationException("No leaf certificate found");
        }
    }
}
