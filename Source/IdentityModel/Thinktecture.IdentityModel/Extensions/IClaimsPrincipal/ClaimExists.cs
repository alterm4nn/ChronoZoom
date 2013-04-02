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
using Microsoft.IdentityModel.Claims;

namespace Thinktecture.IdentityModel.Extensions
{
    /// <summary>
    /// Extension methods for IClaimsPrincipal
    /// </summary>
    public static partial class IClaimsPrincipalExtensions
    {
        /// <summary>
        /// Checks whether a given claim exists
        /// </summary>
        /// <param name="principal">The principal.</param>
        /// <param name="predicate">The search predicate.</param>
        /// <returns>true/false</returns>
        public static bool ClaimExists(this IClaimsPrincipal principal, Predicate<Claim> predicate)
        {
            Contract.Requires(principal != null);
            Contract.Requires(predicate != null);


            foreach (var identity in principal.Identities)
            {
                if (identity.ClaimExists(predicate))
                {
                    return true;
                }
            }

            return false;
        }

        /// <summary>
        /// Checks whether a given claim exists
        /// </summary>
        /// <param name="principal">The principal.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <returns>true/false</returns>
        public static bool ClaimExists(this IClaimsPrincipal principal, string claimType)
        {
            Contract.Requires(principal != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));


            return principal.ClaimExists(c =>
                c.ClaimType.Equals(claimType, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Checks whether a given claim exists.
        /// </summary>
        /// <param name="principal">The principal.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <param name="value">The value.</param>
        /// <returns>true/false</returns>
        public static bool ClaimExists(this IClaimsPrincipal principal, string claimType, string value)
        {
            Contract.Requires(principal != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            Contract.Requires(!String.IsNullOrEmpty(value));


            return principal.ClaimExists(c =>
                c.ClaimType.Equals(claimType, StringComparison.OrdinalIgnoreCase) &&
                c.Value.Equals(value, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Checks whether a given claim exists.
        /// </summary>
        /// <param name="principal">The principal.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <param name="value">The value.</param>
        /// <param name="issuer">The issuer.</param>
        /// <returns>true/false</returns>
        public static bool ClaimExists(this IClaimsPrincipal principal, string claimType, string value, string issuer)
        {
            Contract.Requires(principal != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            Contract.Requires(!String.IsNullOrEmpty(value));
            Contract.Requires(!String.IsNullOrEmpty(issuer));


            return principal.ClaimExists(c =>
                c.ClaimType.Equals(claimType, StringComparison.OrdinalIgnoreCase) &&
                c.Value.Equals(value, StringComparison.OrdinalIgnoreCase) &&
                c.Issuer.Equals(issuer, StringComparison.OrdinalIgnoreCase));
        }
    }
}