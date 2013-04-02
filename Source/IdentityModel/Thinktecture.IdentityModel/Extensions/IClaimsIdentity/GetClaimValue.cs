/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * 
 * This code is licensed under the Microsoft Permissive License (Ms-PL)
 * 
 * SEE: http://www.microsoft.com/resources/sharedsource/licensingbasics/permissivelicense.mspx
 * 
 */

using System;
using System.Diagnostics.Contracts;
using System.Linq;
using Microsoft.IdentityModel.Claims;
using Thinktecture.IdentityModel.Claims;

namespace Thinktecture.IdentityModel.Extensions
{
    public static partial class IClaimsIdentityExtensions
    {
        /// <summary>
        /// Retrieves the value of a claim.
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <returns>The value</returns>
        public static string GetClaimValue(this IClaimsIdentity identity, string claimType)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            Contract.Ensures(Contract.Result<string>() != null);
            

            string value = null;
            if (identity.TryGetClaimValue(claimType, out value))
            {
                return value;
            }

            throw new ClaimNotFoundException(claimType);
        }

        /// <summary>
        /// Retrieves the value of a claim.
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <param name="issuer">The issuer.</param>
        /// <returns>The value</returns>
        public static string GetClaimValue(this IClaimsIdentity identity, string claimType, string issuer)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            Contract.Requires(!String.IsNullOrEmpty(issuer));
            Contract.Ensures(Contract.Result<string>() != null);


            string value = null;
            if (identity.TryGetClaimValue(claimType, issuer, out value))
            {
                return value;
            }

            throw new ClaimNotFoundException(claimType);
        }

        /// <summary>
        /// Tries to retrieve the value of a claim.
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <param name="claimValue">The claim value.</param>
        /// <returns>The value</returns>
        public static bool TryGetClaimValue(this IClaimsIdentity identity, string claimType, out string claimValue)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            

            claimValue = null;
            Claim claim = identity.FindClaims(claimType).FirstOrDefault();
                
            if (claim != null)
            {
                claimValue = claim.Value;
                return true;
            }

            return false;
        }

        /// <summary>
        /// Tries to retrieve the value of a claim.
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <param name="issuer">The issuer.</param>
        /// <param name="claimValue">The claim value.</param>
        /// <returns>The value</returns>
        public static bool TryGetClaimValue(this IClaimsIdentity identity, string claimType, string issuer, out string claimValue)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            Contract.Requires(!String.IsNullOrEmpty(issuer));


            claimValue = null;
            Claim claim = identity.FindClaims(claimType, issuer).FirstOrDefault();

            if (claim != null)
            {
                claimValue = claim.Value;
                return true;
            }

            return false;
        }
    }
}