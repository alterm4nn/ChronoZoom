/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * 
 * This code is licensed under the Microsoft Permissive License (Ms-PL)
 * 
 * SEE: http://www.microsoft.com/resources/sharedsource/licensingbasics/permissivelicense.mspx
 * 
 */

using System.Diagnostics.Contracts;
using System.Linq;
using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Protocols.WSIdentity;

namespace Thinktecture.IdentityModel.Extensions
{
    public static partial class IClaimsIdentityExtensions
    {
        /// <summary>
        ///     Retrieves the issuer name of an IClaimsIdentity. 
        ///     The algorithm checks the name claim first, and if no name is found, the first claim.
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <returns>The issuer name</returns>
        public static string GetIssuerName(this IClaimsIdentity identity)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Ensures(Contract.Result<string>() != null);


            // first try the name claim
            var claim = identity.FindClaims(WSIdentityConstants.ClaimTypes.Name).FirstOrDefault();
            if (claim != null)
            {
                if (claim.Issuer != null)
                {
                    return claim.Issuer;
                }
            }

            // then try the first claim
            if (identity.Claims.Count > 0)
            {
                claim = identity.Claims[0];
                if (claim != null)
                {
                    if (claim.Issuer != null)
                    {
                        return claim.Issuer;
                    }
                }
            }

            // empty or exception?
            return "";
        }
    }
}