/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System.Collections.Concurrent;
using System.Reflection;
using System.Web.Http.Controllers;

namespace Thinktecture.IdentityModel.Authorization.WebApi
{
    public class GlobalAuthorization : IAuthorizationManager
    {
        DefaultPolicy _policy = DefaultPolicy.Deny;
        protected static ConcurrentDictionary<string, MethodInfo> _methods = new ConcurrentDictionary<string, MethodInfo>();

        public GlobalAuthorization(DefaultPolicy policy = DefaultPolicy.Deny)
        {
            _policy = policy;
        }

        protected virtual bool Default(HttpActionContext context)
        {
            return true;
        }

        public bool CheckAccess(HttpActionContext context)
        {
            var result = Default(context);
            if (result == false)
            {
                return false;
            }

            return InvokeAuthorization(context);
        }

        protected virtual bool InvokeAuthorization(HttpActionContext context)
        {
            var name = GenerateName(context);

            var method = GetMethodInfo(name, context);
            if (method == null)
            {
                if (_policy == DefaultPolicy.Allow)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }

            return InvokeMethod(method, context);
        }

        protected virtual string GenerateName(HttpActionContext context)
        {
            var controller = Format(context.ControllerContext.ControllerDescriptor.ControllerName);
            return (controller + "Authorization");
        }

        protected virtual bool InvokeMethod(MethodInfo info, HttpActionContext context)
        {
            var result = info.Invoke(this, new object[] { context });
            return (bool)result;
        }

        protected virtual MethodInfo GetMethodInfo(string name, HttpActionContext context)
        {
            MethodInfo info;
            if (_methods.TryGetValue(name, out info))
            {
                return info;
            }

            info = this.GetType().GetMethod(name);
            _methods.TryAdd(name, info);

            return info;
        }

        protected virtual string Format(string input)
        {
            // get the first letter an make it uppercase
            var f = input.Substring(0, 1).ToUpperInvariant();

            // get the rest lowercase
            var r = input.Substring(1).ToLowerInvariant();

            return f + r;
        }
    }
}
