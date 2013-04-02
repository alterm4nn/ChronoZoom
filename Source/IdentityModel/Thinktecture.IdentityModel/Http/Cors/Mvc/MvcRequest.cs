/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.Generic;
using System.Web;
using Thinktecture.IdentityModel.Http.Cors.IIS;

namespace Thinktecture.IdentityModel.Http.Cors.Mvc
{
    class MvcRequest : HttpContextRequest
    {
        public MvcRequest(HttpRequestBase request) 
            : base(request)
        {
        }

        public override string Resource
        {
            get 
            { 
                var controller = this.request.RequestContext.RouteData.Values["controller"] as string;
                if (MvcCorsConfiguration.Configuration.ResourceNameIncludesActionName)
                {
                    var action = this.request.RequestContext.RouteData.Values["action"] as string;
                    controller = String.Format("{0}.{1}", controller, action);
                }
                return controller;
            }
        }

        public override IDictionary<string, object> Properties
        {
            get { return this.request.RequestContext.RouteData.Values; }
        }
    }
}
