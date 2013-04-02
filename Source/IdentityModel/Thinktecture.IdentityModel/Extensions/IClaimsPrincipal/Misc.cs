/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * 
 * This code is licensed under the Microsoft Permissive License (Ms-PL)
 * 
 * SEE: http://www.microsoft.com/resources/sharedsource/licensingbasics/permissivelicense.mspx
 * 
 */

using System.Diagnostics.Contracts;
using Microsoft.IdentityModel.Claims;

namespace Thinktecture.IdentityModel.Extensions
{
    public static partial class IClaimsPrincipalExtensions
    {
        /// <summary>
        /// Retrieves the first identity of an IClaimsPrincipal.
        /// </summary>
        /// <param name="principal">The principal.</param>
        /// <returns>The first IClaimsIdentity</returns>
        public static IClaimsIdentity First(this IClaimsPrincipal principal)
        {
            Contract.Requires(principal != null);
            Contract.Requires(principal.Identities.Count > 0);
            Contract.Ensures(Contract.Result<IClaimsIdentity>() != null);
            

            return principal.Identities[0];
        }
    }
}
