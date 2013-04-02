/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * 
 * This code is licensed under the Microsoft Permissive License (Ms-PL)
 * 
 * SEE: http://www.microsoft.com/resources/sharedsource/licensingbasics/permissivelicense.mspx
 * 
 */

using System.Diagnostics.Contracts;
using System.Security.Principal;
using Microsoft.IdentityModel.Claims;

namespace Thinktecture.IdentityModel.Extensions
{
    /// <summary>
    /// Extension methods for IPrincipal
    /// </summary>
    public static class IPrincipalExtensions
    {
        /// <summary>
        /// Casts an IPrincipal to an IClaimsPrincipal.
        /// </summary>
        /// <param name="principal">The principal.</param>
        /// <returns></returns>
        public static IClaimsPrincipal AsClaimsPrincipal(this IPrincipal principal)
        {
            Contract.Requires(principal != null);
            Contract.Requires(principal is IClaimsPrincipal);
            Contract.Ensures(Contract.Result<IClaimsPrincipal>() != null);
            

            return principal as IClaimsPrincipal;
        }
    }
}
