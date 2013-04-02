/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Thinktecture.IdentityModel.Http
{
    public class RequireHttpsHandler : DelegatingHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            if (request.RequestUri.Scheme != Uri.UriSchemeHttps)
            {
                var forbiddenResponse =
                    request.CreateResponse(HttpStatusCode.Forbidden);

                forbiddenResponse.ReasonPhrase = "HTTPS Required";
                
                return new Task<HttpResponseMessage>(() => forbiddenResponse);
            }

            return base.SendAsync(request, cancellationToken);
        }
    }
}
