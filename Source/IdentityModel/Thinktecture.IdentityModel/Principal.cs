/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System.Collections.Generic;
using System.Linq;
using Microsoft.IdentityModel.Claims;

namespace Thinktecture.IdentityModel
{
    public static class Principal
    {
        public static ClaimsPrincipal Anonymous
        {
            get
            {
                return ClaimsPrincipal.AnonymousPrincipal as ClaimsPrincipal;
            }
        }

        public static ClaimsPrincipal Create(string authenticationType, params Claim[] claims)
        {
            return new ClaimsPrincipal(new IClaimsIdentity[]{new ClaimsIdentity(claims, authenticationType)});
        }

        public static IEnumerable<Claim> CreateRoles(string[] roleNames)
        {
            if (roleNames == null || roleNames.Count() == 0)
            {
                return new Claim[] { };
            }

            return new List<Claim>(from r in roleNames select new Claim(ClaimTypes.Role, r)).ToArray();
        }
    }
}
