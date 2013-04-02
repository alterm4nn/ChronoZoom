/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System.Threading;
using System.Web.Http.Controllers;
using Microsoft.IdentityModel.Claims;
using Thinktecture.IdentityModel.Extensions;

namespace Thinktecture.IdentityModel.Authorization.WebApi
{
    public class HttpAuthorizationContext : AuthorizationContext
    {
        private HttpActionContext _context;

        protected HttpActionContext ActionContext
        {
            get { return _context; }
        }

        public HttpAuthorizationContext(HttpActionContext context)
            : base(Thread.CurrentPrincipal.AsClaimsPrincipal(),
                   context.ControllerContext.ControllerDescriptor.ControllerName,
                   context.Request.Method.Method)
        {
            _context = context;
        }
    }
}
