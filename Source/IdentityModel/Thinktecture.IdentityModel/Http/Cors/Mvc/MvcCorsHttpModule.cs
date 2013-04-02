/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Web;
using Thinktecture.IdentityModel.Http.Cors.IIS;

namespace Thinktecture.IdentityModel.Http.Cors.Mvc
{
    public class MvcCorsHttpModule : IHttpModule
    {
        public void Init(HttpApplication app)
        {
            app.PreRequestHandlerExecute += app_PreRequestHandlerExecute;
        }

        void app_PreRequestHandlerExecute(object sender, EventArgs e)
        {
            PerformCorsCheck();
        }

        protected virtual void PerformCorsCheck()
        {
            var ctx = System.Web.HttpContext.Current;

            var httpRequest = new MvcRequest(new HttpRequestWrapper(ctx.Request));
            var accessRequest = new CorsAccessRequest(httpRequest);
            if (accessRequest.IsCors)
            {
                var accessResponse = MvcCorsConfiguration.Configuration.Engine.CheckAccess(accessRequest);
                if (accessResponse != null)
                {
                    var response = ctx.Response;
                    var httpResponse = new HttpContextResponse(new HttpResponseWrapper(response));
                    accessResponse.WriteResponse(httpResponse);
                }

                if (accessRequest.IsCorsPreflight)
                {
                    ctx.Response.StatusCode = 200;
                    ctx.Response.End();
                }
            }
        }

        public void Dispose()
        {
        }
    }
}
