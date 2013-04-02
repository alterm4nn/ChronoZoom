/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Collections.Generic;
using System.Linq;

namespace Thinktecture.IdentityModel.Http.Cors
{
    public class CorsAccessResponse
    {
        public string OriginAllowed { get; internal set; }
        public bool AreCookiesAllowed { get; internal set; }
        public IEnumerable<string> AllowedMethods { get; internal set; }
        public IEnumerable<string> AllowedRequestHeaders { get; internal set; }
        public IEnumerable<string> AllowedResponseHeaders { get; internal set; }
        public int? ResponseCacheDurationSeconds { get; internal set; }

        public void WriteResponse(IHttpResponseWrapper response)
        {
            if (this.OriginAllowed != null)
            {
                response.AddHeader(CorsConstants.ResponseHeader_AllowOrign, this.OriginAllowed);
            }

            if (this.AreCookiesAllowed == true)
            {
                response.AddHeader(CorsConstants.ResponseHeader_AllowCookies, "true");
            }

            if (this.AllowedMethods != null && this.AllowedMethods.Any())
            {
                var methods = this.AllowedMethods.Aggregate((x, y) => x + "," + y);
                response.AddHeader(CorsConstants.ResponseHeader_AllowMethods, methods);
            }

            if (this.AllowedRequestHeaders != null && this.AllowedRequestHeaders.Any())
            {
                var headers = this.AllowedRequestHeaders.Aggregate((x, y) => x + "," + y);
                response.AddHeader(CorsConstants.ResponseHeader_AllowRequestHeaders, headers);
            }

            if (this.AllowedResponseHeaders != null && this.AllowedResponseHeaders.Any())
            {
                var headers = this.AllowedResponseHeaders.Aggregate((x, y) => x + "," + y);
                response.AddHeader(CorsConstants.ResponseHeader_AllowResponseHeaders, headers);
            }

            if (this.ResponseCacheDurationSeconds.HasValue)
            {
                response.AddHeader(CorsConstants.ResponseHeader_CacheDuration, this.ResponseCacheDurationSeconds.Value.ToString());
            }
        }
    }
}
