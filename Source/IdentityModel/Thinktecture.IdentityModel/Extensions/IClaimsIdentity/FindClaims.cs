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
using System.Linq;
using Microsoft.IdentityModel.Claims;

namespace Thinktecture.IdentityModel.Extensions
{
    public static partial class IClaimsIdentityExtensions
    {
        /// <summary>
        /// Finds all instances of the specified claim.
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="predicate">The search predicate.</param>
        /// <returns>List of claims that match the search criteria</returns>
        public static IEnumerable<Claim> FindClaims(this IClaimsIdentity identity, Predicate<Claim> predicate)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(predicate != null);
            Contract.Ensures(Contract.Result<IEnumerable<Claim>>() != null);
            

            return from claim in identity.Claims
                   where predicate(claim)
                   select claim;
        }

        /// <summary>
        /// Finds all instances of the specified claim.
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <returns>List of claims that match the search criteria</returns>
        public static IEnumerable<Claim> FindClaims(this IClaimsIdentity identity, string claimType)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            Contract.Ensures(Contract.Result<IEnumerable<Claim>>() != null);


            return identity.FindClaims(c =>
                c.ClaimType.Equals(claimType, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Finds all instances of the specified claim.
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <param name="issuer">The issuer.</param>
        /// <returns>List of claims that match the search criteria</returns>
        public static IEnumerable<Claim> FindClaims(this IClaimsIdentity identity, string claimType, string issuer)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            Contract.Requires(!String.IsNullOrEmpty(issuer));
            Contract.Ensures(Contract.Result<IEnumerable<Claim>>() != null);


            return identity.FindClaims(c =>
                c.ClaimType.Equals(claimType, StringComparison.OrdinalIgnoreCase) &&
                c.Issuer.Equals(issuer, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Finds all instances of the specified claim.
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="claimType">Type of the claim.</param>
        /// <param name="issuer">The issuer.</param>
        /// <param name="value">The value.</param>
        /// <returns>List of claims that match the search criteria</returns>
        public static IEnumerable<Claim> FindClaims(this IClaimsIdentity identity, string claimType, string issuer, string value)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(!String.IsNullOrEmpty(claimType));
            Contract.Requires(!String.IsNullOrEmpty(issuer));
            Contract.Requires(!String.IsNullOrEmpty(value));
            Contract.Ensures(Contract.Result<IEnumerable<Claim>>() != null);


            return identity.FindClaims(c =>
                c.ClaimType.Equals(claimType, StringComparison.OrdinalIgnoreCase) &&
                c.Value.Equals(value, StringComparison.OrdinalIgnoreCase) &&
                c.Issuer.Equals(issuer, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Finds all instances of the specified claim.
        /// </summary>
        /// <param name="identity">The identity.</param>
        /// <param name="claim">Search claim.</param>
        /// <returns>List of claims that match the search criteria</returns>
        public static IEnumerable<Claim> FindClaims(this IClaimsIdentity identity, Claim claim)
        {
            Contract.Requires(identity != null);
            Contract.Requires(identity.Claims != null);
            Contract.Requires(claim != null);
            Contract.Ensures(Contract.Result<IEnumerable<Claim>>() != null);

            
            return identity.FindClaims(c =>
                c.ClaimType.Equals(claim.ClaimType, StringComparison.OrdinalIgnoreCase) &&
                c.Value.Equals(claim.Value, StringComparison.OrdinalIgnoreCase) &&
                c.Issuer.Equals(claim.Issuer, StringComparison.OrdinalIgnoreCase));
        }
    }
}