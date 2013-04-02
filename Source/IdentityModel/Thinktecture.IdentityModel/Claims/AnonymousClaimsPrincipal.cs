/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using Microsoft.IdentityModel.Claims;

namespace Thinktecture.IdentityModel.Claims
{
    public static class AnonymousClaimsPrincipal
    {
        public static ClaimsPrincipal Create()
        {
            var anonId = new ClaimsIdentity();
            var anonPrincipal = new ClaimsPrincipal(new ClaimsIdentityCollection(new ClaimsIdentity[]{anonId}));

            return anonPrincipal;
        }
    }
}
