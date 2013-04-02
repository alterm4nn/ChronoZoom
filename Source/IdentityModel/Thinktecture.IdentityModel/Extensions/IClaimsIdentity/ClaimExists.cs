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

namespace Thinktecture.IdentityModel.Extensions
{
    /// <summary>
    /// Extension methods for IClaimsIdentity
    /// </summary>
    public static partial class IClaimsIdentityExtensions
    {
        /// <summary>
        /// Checks whether a given claim exists
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="predicate">The search predicate.</param>
        /// <returns>true/false</returns>
        public static bool ClaimExists(this IClaimsIdentity identity, Predicate<Claim> predicate)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(predicate != null);


            Claim claim = identity.FindClaims(predicate).FirstOrDefault();
            return (claim != null);
        }

        /// <summary>
        /// Checks whether a given claim exists
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <returns>true/false</returns>
        public static bool ClaimExists(this IClaimsIdentity identity, string claimType)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));


            return identity.ClaimExists(c =>
                c.ClaimType.Equals(claimType, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Checks whether a given claim exists
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <param name="value">The value.</param>
        /// <returns>true/false</returns>
        public static bool ClaimExists(this IClaimsIdentity identity, string claimType, string value)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            Contract.Requires(!String.IsNullOrEmpty(value));


            return identity.ClaimExists(c =>
                c.ClaimType.Equals(claimType, StringComparison.OrdinalIgnoreCase) &&
                c.Value.Equals(value, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Checks whether a given claim exists
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <param name="value">The value.</param>
        /// <param name="issuer">The issuer.</param>
        /// <returns>true/false</returns>
        public static bool ClaimExists(this IClaimsIdentity identity, string claimType, string value, string issuer)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            Contract.Requires(!String.IsNullOrEmpty(value));
            Contract.Requires(!String.IsNullOrEmpty(issuer));


            return identity.ClaimExists(c =>
                c.ClaimType.Equals(claimType, StringComparison.OrdinalIgnoreCase) &&
                c.Value.Equals(value, StringComparison.OrdinalIgnoreCase) &&
                c.Issuer.Equals(issuer, StringComparison.OrdinalIgnoreCase));
        }
    }
}