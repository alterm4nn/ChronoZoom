/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System;
using System.Net.Http;
using System.Web;

namespace Thinktecture.IdentityModel.Extensions
{
    public static class HttpRequestMessageExtensions
    {
        public static HttpRequestMessage ToHttpRequestMessage(this HttpRequestBase httpRequest, bool includeContent = true)
        {
            var httpMethod = GetHttpMethod(httpRequest.HttpMethod);
            var url = httpRequest.Url;
            
            var httpRequestMessage = new HttpRequestMessage(httpMethod, url);
            
            if (includeContent)
            {
                httpRequestMessage.Content = new StreamContent(httpRequest.InputStream);
            }
            
            foreach (string str in httpRequest.Headers)
            {
                var values = httpRequest.Headers.GetValues(str);
                AddHeaderToHttpRequestMessage(httpRequestMessage, str, values);
            }
            
            return httpRequestMessage;
        }

        internal static HttpMethod GetHttpMethod(string method)
        {
            if (string.IsNullOrEmpty(method))
            {
                return null;
            }
            if (string.Equals("GET", method, StringComparison.OrdinalIgnoreCase))
            {
                return HttpMethod.Get;
            }
            if (string.Equals("POST", method, StringComparison.OrdinalIgnoreCase))
            {
                return HttpMethod.Post;
            }
            if (string.Equals("PUT", method, StringComparison.OrdinalIgnoreCase))
            {
                return HttpMethod.Put;
            }
            if (string.Equals("DELETE", method, StringComparison.OrdinalIgnoreCase))
            {
                return HttpMethod.Delete;
            }
            if (string.Equals("HEAD", method, StringComparison.OrdinalIgnoreCase))
            {
                return HttpMethod.Head;
            }
            if (string.Equals("OPTIONS", method, StringComparison.OrdinalIgnoreCase))
            {
                return HttpMethod.Options;
            }
            if (string.Equals("TRACE", method, StringComparison.OrdinalIgnoreCase))
            {
                return HttpMethod.Trace;
            }

            return new HttpMethod(method);
        }

        private static void AddHeaderToHttpRequestMessage(HttpRequestMessage httpRequestMessage, string headerName, string[] headerValues)
        {
            if (!httpRequestMessage.Headers.TryAddWithoutValidation(headerName, headerValues))
            {
                httpRequestMessage.Content.Headers.TryAddWithoutValidation(headerName, headerValues);
            }
        }
    }
}
