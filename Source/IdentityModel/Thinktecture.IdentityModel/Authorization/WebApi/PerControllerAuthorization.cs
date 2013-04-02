/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System;
using System.Web.Http.Controllers;

namespace Thinktecture.IdentityModel.Authorization.WebApi
{
    public abstract class PerControllerAuthorization : IAuthorizationManager
    {
        protected abstract bool Get(HttpActionContext context);
        protected abstract bool Put(HttpActionContext context);
        protected abstract bool Post(HttpActionContext context);
        protected abstract bool Delete(HttpActionContext context);

        protected virtual bool Default(HttpActionContext context)
        {
            return true;
        }

        public bool CheckAccess(HttpActionContext context)
        {
            try
            {
                var result = Default(context);
                if (result == false)
                {
                    return false;
                }

                switch (context.Request.Method.Method)
                {
                    case "GET":
                        return Get(context);
                    case "POST":
                        return Post(context);
                    case "PUT":
                        return Put(context);
                    case "DELETE":
                        return Delete(context);
                }
            }
            catch (NotImplementedException)
            {
                return false;
            }

            throw new InvalidOperationException("Method not supported by authorization manager");
        }
    }
}
