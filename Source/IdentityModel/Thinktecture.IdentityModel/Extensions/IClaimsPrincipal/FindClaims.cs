/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * 
 * This code is licensed under the Microsoft Permissive License (Ms-PL)
 * 
 * SEE: http://www.microsoft.com/resources/sharedsource/licensingbasics/permissivelicense.mspx
 * 
 */

using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using Microsoft.IdentityModel.Claims;

namespace Thinktecture.IdentityModel.Extensions
{
    public static partial class IClaimsPrincipalExtensions
    {
        /// <summary>
        /// Finds all instances of the specified claim.
        /// </summary>
        /// <param name="principal">The principal.</param>
        /// <param name="predicate">A search predicate.</param>
        /// <returns>A list of claims that match the search criteria.</returns>
        public static IEnumerable<Claim> FindClaims(this IClaimsPrincipal principal, Predicate<Claim> predicate)
        {
            Contract.Requires(principal != null);
            Contract.Requires(predicate != null);
            Contract.Ensures(Contract.Result<IEnumerable<Claim>>() != null);


            foreach (IClaimsIdentity identity in principal.Identities)
            {
                foreach (Claim claim in identity.FindClaims(predicate))
                {
                    yield return claim;
                }
            }
        }

        /// <summary>
        /// Finds all instances of the specified claim.
        /// </summary>
        /// <param name="principal">The principal.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <returns>A list of claims that match the search criteria.</returns>
        public static IEnumerable<Claim> FindClaims(this IClaimsPrincipal principal, string claimType)
        {
            Contract.Requires(principal != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            Contract.Ensures(Contract.Result<IEnumerable<Claim>>() != null);


            return principal.FindClaims(c =>
                c.ClaimType.Equals(claimType, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Finds all instances of the specified claim.
        /// </summary>
        /// <param name="principal">The principal.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <param name="issuer">The issuer.</param>
        /// <returns>A list of claims that match the search criteria.</returns>
        public static IEnumerable<Claim> FindClaims(this IClaimsPrincipal principal, string claimType, string issuer)
        {
            Contract.Requires(principal != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            Contract.Requires(!String.IsNullOrEmpty(issuer));
            Contract.Ensures(Contract.Result<IEnumerable<Claim>>() != null);


            return principal.FindClaims(c =>
                c.ClaimType.Equals(claimType, StringComparison.OrdinalIgnoreCase) &&
                c.Issuer.Equals(issuer, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Finds all instances of the specified claim.
        /// </summary>
        /// <param name="principal">The principal.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <param name="issuer">The issuer.</param>
        /// <param name="value">The value.</param>
        /// <returns>A list of claims that match the search criteria.</returns>
        public static IEnumerable<Claim> FindClaims(this IClaimsPrincipal principal, string claimType, string issuer, string value)
        {
            Contract.Requires(principal != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            Contract.Requires(!String.IsNullOrEmpty(issuer));
            Contract.Requires(!String.IsNullOrEmpty(value));
            Contract.Ensures(Contract.Result<IEnumerable<Claim>>() != null);


            return principal.FindClaims(c =>
                c.ClaimType.Equals(claimType, StringComparison.OrdinalIgnoreCase) &&
                c.Value.Equals(value, StringComparison.OrdinalIgnoreCase) &&
                c.Issuer.Equals(issuer, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Finds all instances of the specified claim.
        /// </summary>
        /// <param name="principal">The principal.</param>
        /// <param name="claim">The claim.</param>
        /// <returns>A list of claims that match the search criteria.</returns>
        public static IEnumerable<Claim> FindClaims(this IClaimsPrincipal principal, Claim claim)
        {
            Contract.Requires(principal != null);
            Contract.Requires(claim != null);
            Contract.Ensures(Contract.Result<IEnumerable<Claim>>() != null);


            return principal.FindClaims(c =>
                c.ClaimType.Equals(claim.ClaimType, StringComparison.OrdinalIgnoreCase) &&
                c.Value.Equals(claim.Value, StringComparison.OrdinalIgnoreCase) &&
                c.Issuer.Equals(claim.Issuer, StringComparison.OrdinalIgnoreCase));
        }
    }
}