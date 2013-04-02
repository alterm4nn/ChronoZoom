/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace Thinktecture.IdentityModel.Authorization.WebApi
{
    public class ApiAuthorizeAttribute : AuthorizeAttribute
    {
        public const string PropertyName = "Thinktecture.IdentityModel.Http.IAuthorizationManager";
        private IAuthorizationManager _authZ;
        private Type _authZType;

        public bool SkipGlobalPolicy { get; set; }

        public ApiAuthorizeAttribute()
        {
            SkipGlobalPolicy = false;
        }

        public ApiAuthorizeAttribute(Type authorizationManagerType)
            : this()
        {
            _authZType = authorizationManagerType;
        }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            bool globalResult = false;

            // global
            if (SkipGlobalPolicy == false)
            {
                if (actionContext.ControllerContext.Configuration.Properties.ContainsKey(PropertyName))
                {
                    var authZmanager = actionContext.ControllerContext.Configuration.Properties[PropertyName] as IAuthorizationManager;

                    if (authZmanager != null)
                    {
                        globalResult = authZmanager.CheckAccess(actionContext);
                        if (globalResult == false)
                        {
                            return false;
                        }
                    }
                }
            }

            // local
            EnsureAuthZManager(actionContext);
            if (_authZ != null)
            {
                return _authZ.CheckAccess(actionContext);
            }

            return globalResult;
        }

        private void EnsureAuthZManager(HttpActionContext actionContext)
        {
            if (_authZType == null)
            {
                return;
            }

            if (_authZ == null)
            {
                var type = actionContext.ControllerContext.Configuration.DependencyResolver.GetService(_authZType) as IAuthorizationManager;
                if (type != null)
                {
                    _authZ = type;
                }
                else
                {
                    _authZ = Activator.CreateInstance(_authZType) as IAuthorizationManager;
                }
            }
        }
    }
}
