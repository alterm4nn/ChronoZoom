/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Net.Http;
using System.Web.Http;

namespace Thinktecture.IdentityModel.Http.Cors.WebApi
{
    public class WebApiCorsConfiguration : CorsConfiguration
    {
        public void RegisterGlobal(HttpConfiguration httpConfig)
        {
            httpConfig.MessageHandlers.Add(new CorsMessageHandler(this, httpConfig));
        }

        public DelegatingHandler CreateHandler(HttpConfiguration httpConfig, DelegatingHandler innerHandler = null)
        {
            return new CorsMessageHandler(this, httpConfig)
            {
                InnerHandler = innerHandler
            };
        }
    }
}
