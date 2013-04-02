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
using System.Security;
using Microsoft.IdentityModel.Claims;

namespace Thinktecture.IdentityModel.Extensions
{
    public static partial class IClaimsIdentityExtensions
    {
        /// <summary>
        /// Demands a specific claim.
        /// </summary>
        /// <param name="identity">The principal.</param>
        /// <param name="predicate">The search predicate.</param>
        public static void DemandClaim(this IClaimsIdentity identity, Predicate<Claim> predicate)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(predicate != null);


            if (!identity.ClaimExists(predicate))
            {
                throw new SecurityException("Demand for Claim failed");
            }
        }

        /// <summary>
        /// Demands a specific claim.
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="claimType">Type of the claim.</param>
        public static void DemandClaim(this IClaimsIdentity identity, string claimType)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));


            try
            {
                identity.DemandClaim(claim =>
                    claim.ClaimType.Equals(claimType, StringComparison.OrdinalIgnoreCase));
            }
            catch (SecurityException)
            {
                throw new SecurityException(String.Format("Demand for Claim {0} failed.", claimType));
            }
        }

        /// <summary>
        /// Demands a specific claim.
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <param name="value">The value.</param>
        public static void DemandClaim(this IClaimsIdentity identity, string claimType, string value)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            Contract.Requires(!String.IsNullOrEmpty(value));


            try
            {
                identity.DemandClaim(claim =>
                    claim.ClaimType.Equals(claimType, StringComparison.OrdinalIgnoreCase) &&
                    claim.Value.Equals(value, StringComparison.OrdinalIgnoreCase));
            }
            catch (SecurityException)
            {
                throw new SecurityException(String.Format("Demand for Claim {0} failed.", claimType));
            }
        }

        /// <summary>
        /// Demands a specific claim.
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <param name="value">The value.</param>
        /// <param name="issuer">The issuer.</param>
        public static void DemandClaim(this IClaimsIdentity identity, string claimType, string value, string issuer)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            Contract.Requires(!String.IsNullOrEmpty(value));
            Contract.Requires(!String.IsNullOrEmpty(issuer));


            try
            {
                identity.DemandClaim(claim =>
                    claim.ClaimType.Equals(claimType, StringComparison.OrdinalIgnoreCase) &&
                    claim.Value.Equals(value, StringComparison.OrdinalIgnoreCase) &&
                    claim.Issuer.Equals(issuer, StringComparison.OrdinalIgnoreCase));
            }
            catch (SecurityException)
            {
                throw new SecurityException(String.Format("Demand for Claim {0} failed.", claimType));
            }
        }
    }
}