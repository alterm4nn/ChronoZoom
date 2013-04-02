/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Net.Http;

namespace Thinktecture.IdentityModel.Http.Cors.WebApi
{
    class WebApiHttpResponse : IHttpResponseWrapper
    {
        HttpResponseMessage response;

        public WebApiHttpResponse(HttpResponseMessage response)
        {
            this.response = response;
        }

        public void AddHeader(string name, string value)
        {
            this.response.Headers.Add(name, value);
        }
    }
}
