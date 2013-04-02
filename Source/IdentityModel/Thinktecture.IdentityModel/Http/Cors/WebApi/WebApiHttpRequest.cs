/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Routing;

namespace Thinktecture.IdentityModel.Http.Cors.WebApi
{
    class WebApiHttpRequest : IHttpRequestWrapper
    {
        HttpRequestMessage request;
        HttpConfiguration configuration;
        IHttpRouteData routeData;

        public WebApiHttpRequest(HttpRequestMessage request, HttpConfiguration configuration)
        {
            this.request = request;
            this.configuration = configuration;
        }

        public string Resource
        {
            get { return this.Properties["controller"] as string; }
        }

        public IDictionary<string, object> Properties
        {
            get 
            {
                if (routeData == null)
                {
                    routeData = configuration.Routes.GetRouteData(request);
                }
                return routeData.Values;
            }
        }

        public string Method
        {
            get 
            {
                return this.request.Method.Method;
            }
        }

        public string GetHeader(string name)
        {
            IEnumerable<string> vals;
            if (request.Headers.TryGetValues(name, out vals))
            {
                if (vals != null)
                {
                    return vals.FirstOrDefault();
                }
            }

            return null;
        }
    }
}
