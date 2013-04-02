/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Thinktecture.IdentityModel.Http.Cors.IIS
{
    class HttpContextRequest : IHttpRequestWrapper
    {
        protected HttpRequestBase request;
        public HttpContextRequest(HttpRequestBase request)
        {
            this.request = request;
        }

        public virtual string Resource
        {
            get { return request.AppRelativeCurrentExecutionFilePath; }
        }

        public virtual IDictionary<string, object> Properties
        {
            get { return this.request.RequestContext.RouteData.Values; }
        }

        public string Method
        {
            get { return this.request.HttpMethod; }
        }

        public string GetHeader(string name)
        {
            if (request.Headers.AllKeys.Contains(name))
            {
                return request.Headers[name];
            }
            return null;
        }
    }
}
