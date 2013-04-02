/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System.Web.Http.Controllers;

namespace Thinktecture.IdentityModel.Authorization.WebApi
{
    public interface IAuthorizationManager
    {
        bool CheckAccess(HttpActionContext context);
    }
}