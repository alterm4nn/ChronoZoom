/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace Thinktecture.IdentityModel.Http.Cors.WebApi
{
    public class CorsMessageHandler : DelegatingHandler
    {
        CorsConfiguration corsConfiguration;
        HttpConfiguration httpConfiguration;
        public CorsMessageHandler(CorsConfiguration corsConfiguration, HttpConfiguration httpConfiguration)
        {
            this.corsConfiguration = corsConfiguration;
            this.httpConfiguration = httpConfiguration;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var httpRequest = new WebApiHttpRequest(request, httpConfiguration);
            var accessRequest = new CorsAccessRequest(httpRequest);

            Task<HttpResponseMessage> task = accessRequest.IsCorsPreflight ?
                CreateCorsPreflightTask(request, cancellationToken) :
                CreateCorsSimpleTask(request, cancellationToken);

            return task.ContinueWith<HttpResponseMessage>(
                    innerTask =>
                    {
                        var response = innerTask.Result;
                        var accessResponse = corsConfiguration.Engine.CheckAccess(accessRequest);
                        if (accessResponse != null)
                        {
                            var httpResponse = new WebApiHttpResponse(response);
                            accessResponse.WriteResponse(httpResponse);
                        }
                        return response;
                    });
        }

        private Task<HttpResponseMessage> CreateCorsPreflightTask(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew<HttpResponseMessage>(
                () =>
                {
                    return request.CreateResponse(HttpStatusCode.OK);
                });
        }

        private Task<HttpResponseMessage> CreateCorsSimpleTask(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            return base.SendAsync(request, cancellationToken);
        }
    }
}
