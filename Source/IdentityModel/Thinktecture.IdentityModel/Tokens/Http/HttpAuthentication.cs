/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography.X509Certificates;
using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Protocols.WSTrust;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using Thinktecture.IdentityModel.Diagnostics;

namespace Thinktecture.IdentityModel.Tokens.Http
{
    public class HttpAuthentication
    {
        public AuthenticationConfiguration Configuration { get; set; }

        public HttpAuthentication(AuthenticationConfiguration configuration)
        {
            Configuration = configuration;
        }

        public ClaimsPrincipal Authenticate(HttpRequestMessage request)
        {
            string resourceName = request.RequestUri.AbsoluteUri;

            // if session feature is enabled (and this is not a token request), check for session token first
            if (Configuration.EnableSessionToken && !IsSessionTokenRequest(request))
            {
                var principal = AuthenticateSessionToken(request);

                if (principal.Identity.IsAuthenticated)
                {
                    Tracing.Information(Area.HttpAuthentication, "Client authenticated using session token");
                    return principal;
                }
            }

            // check for credentials on the authorization header
            if (Configuration.HasAuthorizationHeaderMapping)
            {
                var authZ = request.Headers.Authorization;
                if (authZ != null)
                {
                    Tracing.Verbose(Area.HttpAuthentication, "Mapping for authorization header found: " + authZ.Scheme);

                    var principal = AuthenticateAuthorizationHeader(authZ.Scheme, authZ.Parameter);

                    if (principal.Identity.IsAuthenticated)
                    {
                        Tracing.Information(Area.HttpAuthentication, "Client authenticated using authorization header mapping: " + authZ.Scheme);

                        return Transform(resourceName, principal) as ClaimsPrincipal;
                    }
                }
            }

            // check for credentials on other headers
            if (Configuration.HasHeaderMapping)
            {
                if (request.Headers != null)
                {
                    Tracing.Verbose(Area.HttpAuthentication, "Mapping for header header found.");

                    var principal = AuthenticateHeaders(request.Headers);

                    if (principal.Identity.IsAuthenticated)
                    {
                        Tracing.Information(Area.HttpAuthentication, "Client authenticated using header mapping");

                        return Transform(resourceName, principal);
                    }
                }
            }

            // check for credentials on the query string
            if (Configuration.HasQueryStringMapping)
            {
                if (request.RequestUri != null && !string.IsNullOrWhiteSpace(request.RequestUri.Query))
                {
                    Tracing.Verbose(Area.HttpAuthentication, "Mapping for query string found.");

                    var principal = AuthenticateQueryStrings(request.RequestUri);

                    if (principal.Identity.IsAuthenticated)
                    {
                        Tracing.Information(Area.HttpAuthentication, "Client authenticated using query string mapping");
                        return Transform(resourceName, principal);
                    }
                }
            }

            // check for client certificate
            if (Configuration.HasClientCertificateMapping)
            {
                var cert = request.GetClientCertificate();

                if (cert != null)
                {
                    Tracing.Verbose(Area.HttpAuthentication, "Mapping for client certificate found.");

                    var principal = AuthenticateClientCertificate(cert);

                    if (principal.Identity.IsAuthenticated)
                    {
                        Tracing.Information(Area.HttpAuthentication, "Client authenticated using client certificate");
                        return Transform(resourceName, principal);
                    }
                }
            }

            // do claim transformation (if enabled), and return.
            return Transform(resourceName, Principal.Anonymous);
        }

        public virtual ClaimsPrincipal AuthenticateSessionToken(HttpRequestMessage request)
        {
            // grab authorization header
            var authZheader = request.Headers.Authorization;

            if (authZheader != null)
            {
                // if configured scheme was sent, try to authenticate the session token
                if (authZheader.Scheme == Configuration.SessionToken.Scheme)
                {
                    var handler = Configuration.SessionToken.SecurityTokenHandler;

                    var token = ((IHttpSecurityTokenHandler)handler).ReadToken(authZheader.Parameter);
                    return new ClaimsPrincipal(handler.ValidateToken(token));
                }
            }

            return Principal.Anonymous;
        }

        public virtual ClaimsPrincipal AuthenticateAuthorizationHeader(string scheme, string credential)
        {
            SecurityTokenHandlerCollection handlers;

            if (Configuration.TryGetAuthorizationHeaderMapping(scheme, out handlers))
            {
                return InvokeHandler(handlers, credential);
            }
            else
            {
                return Principal.Anonymous;
            }
        }

        public virtual ClaimsPrincipal AuthenticateHeaders(Dictionary<string, string> headers)
        {
            SecurityTokenHandlerCollection handlers;

            foreach (var header in headers)
            {
                if (Configuration.TryGetHeaderMapping(header.Key, out handlers))
                {
                    return InvokeHandler(handlers, header.Value);
                }
            }

            return Principal.Anonymous;
        }

        public virtual ClaimsPrincipal AuthenticateHeaders(HttpRequestHeaders headers)
        {
            SecurityTokenHandlerCollection handlers;

            foreach (var header in headers.AsEnumerable())
            {
                if (Configuration.TryGetHeaderMapping(header.Key, out handlers))
                {
                    return InvokeHandler(handlers, header.Value.First());
                }
            }

            return Principal.Anonymous;
        }

        public virtual ClaimsPrincipal AuthenticateQueryStrings(NameValueCollection queryString)
        {
            SecurityTokenHandlerCollection handlers;

            if (queryString != null)
            {
                foreach (string param in queryString.Keys)
                {
                    if (Configuration.TryGetQueryStringMapping(param, out handlers))
                    {
                        return InvokeHandler(handlers, queryString[param]);
                    }
                }
            }

            return Principal.Anonymous;
        }

        public virtual ClaimsPrincipal AuthenticateQueryStrings(Uri uri)
        {
            return AuthenticateQueryStrings(uri.ParseQueryString());
        }

        public virtual ClaimsPrincipal AuthenticateClientCertificate(X509Certificate2 certificate)
        {
            SecurityTokenHandlerCollection handlers;
            var token = new X509SecurityToken(certificate);

            if (Configuration.TryGetClientCertificateMapping(out handlers))
            {
                var identity = handlers.First().ValidateToken(token);
                return new ClaimsPrincipal(identity);
            }

            return Principal.Anonymous;
        }

        public virtual ClaimsPrincipal Transform(string resource, ClaimsPrincipal incomingPrincipal)
        {
            if (Configuration.ClaimsAuthenticationManager != null)
            {
                return Configuration.ClaimsAuthenticationManager.Authenticate(resource, incomingPrincipal) as ClaimsPrincipal;
            }
            else
            {
                return incomingPrincipal;
            }
        }

        public virtual bool IsSessionTokenRequest(HttpRequestMessage request)
        {
            if (Configuration.EnableSessionToken == false)
            {
                return false;
            }

            // parse URL against config
            // todo: need something more robust
            if (request.RequestUri.AbsolutePath.EndsWith(Configuration.SessionToken.EndpointAddress, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            return false;
        }

        public virtual string CreateSessionToken(ClaimsPrincipal principal)
        {
            var handler = Configuration.SessionToken.SecurityTokenHandler;

            var descriptor = new SecurityTokenDescriptor
            {
                AppliesToAddress = Configuration.SessionToken.Audience.AbsoluteUri,
                TokenIssuerName = Configuration.SessionToken.IssuerName,
                SigningCredentials = new HmacSigningCredentials(Configuration.SessionToken.SigningKey),
                Lifetime = new Lifetime(DateTime.UtcNow, DateTime.UtcNow.Add(Configuration.SessionToken.DefaultTokenLifetime)),
                Subject = principal.Identities.First()
            };

            var token = handler.CreateToken(descriptor);
            return handler.WriteToken(token);
        }

        public virtual string CreateSessionTokenResponse(string sessionToken)
        {
            var response = new JObject();
            response["access_token"] = sessionToken;
            response["expires_in"] = Configuration.SessionToken.DefaultTokenLifetime.TotalSeconds;

            return response.ToString();
        }

        protected virtual Dictionary<string, string> CreateQueryStringDictionary(Uri uri)
        {
            var dictionary = new Dictionary<string, string>();
            string[] pairs;

            var query = uri.Query;
            if (query == null)
            {
                return null;
            }

            if (query[0] == '?')
            {
                query = query.Substring(1);
            }

            if (query.Contains('&'))
            {
                pairs = query.Split('&');
            }
            else
            {
                pairs = new string[] { query };
            }

            foreach (var pair in pairs)
            {
                var parts = pair.Split('=');
                if (parts.Length == 2)
                {
                    dictionary.Add(parts[0], parts[1]);
                }
            }

            return dictionary;
        }

        protected virtual ClaimsPrincipal InvokeHandler(SecurityTokenHandlerCollection handlers, string tokenString)
        {
            SecurityTokenHandler handler = null;

            if (handlers.Count == 1)
            {
                handler = handlers.First();
            }
            else
            {
                foreach (var h in handlers)
                {
                    if (((IHttpSecurityTokenHandler)h).CanReadToken(tokenString))
                    {
                        handler = h;
                        break;
                    }
                }
            }

            if (handler != null)
            {
                Tracing.Information(Area.HttpAuthentication, "Invoking token handler: " + handler.GetType().FullName);

                var token = ((IHttpSecurityTokenHandler)handler).ReadToken(tokenString);
                var principal = new ClaimsPrincipal(handler.ValidateToken(token));

                return principal;
            }

            throw new InvalidOperationException("No handler found");
        }
    }
}
