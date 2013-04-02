/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System.Web.Http.Controllers;
using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Web;

namespace Thinktecture.IdentityModel.Authorization.WebApi
{
    public class HttpClaimsAuthorizationManager : IAuthorizationManager
    {
        ClaimsAuthorizationManager _authZ;

        public HttpClaimsAuthorizationManager()
        {
            _authZ = FederatedAuthentication.ServiceConfiguration
				.ClaimsAuthorizationManager;
        }

        public HttpClaimsAuthorizationManager(ClaimsAuthorizationManager authorizationManager)
        {
            _authZ = authorizationManager;
        }

        public bool CheckAccess(HttpActionContext context)
        {
            var authZcontext = new HttpAuthorizationContext(context);
            return _authZ.CheckAccess(authZcontext);
        }
    }
}
