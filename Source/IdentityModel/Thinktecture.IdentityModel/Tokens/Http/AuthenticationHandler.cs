/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.IdentityModel.Tokens;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Dispatcher;
using Microsoft.IdentityModel.Claims;
using Thinktecture.IdentityModel.Diagnostics;

namespace Thinktecture.IdentityModel.Tokens.Http
{
    public class AuthenticationHandler : DelegatingHandler
    {
        HttpAuthentication _authN;

        public AuthenticationHandler(AuthenticationConfiguration configuration, HttpConfiguration httpConfiguration = null)
        {
            _authN = new HttpAuthentication(configuration);

            if (httpConfiguration != null)
            {
                InnerHandler = new HttpControllerDispatcher(httpConfiguration);
            }
        }

        public AuthenticationHandler(AuthenticationConfiguration configuration, HttpMessageHandler innerHandler)
        {
            _authN = new HttpAuthentication(configuration);
            InnerHandler = innerHandler;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Tracing.Start(Area.HttpAuthentication);

            if (_authN.Configuration.InheritHostClientIdentity == false)
            {
                //Tracing.Information(Area.HttpAuthentication, "Setting anonymous principal");
                SetPrincipal(Principal.Anonymous);
            }

            try
            {
                // try to authenticate
                // returns an anonymous principal if no credential was 
                var principal = _authN.Authenticate(request);

                if (principal == null)
                {
                    Tracing.Error(Area.HttpAuthentication, "Authentication returned null principal.");
                    throw new InvalidOperationException("No principal set");
                }

                if (principal.Identity.IsAuthenticated)
                {
                    Tracing.Information(Area.HttpAuthentication, "Authentication successful.");

                    // check for token request - if yes send token back and return
                    if (_authN.IsSessionTokenRequest(request))
                    {
                        Tracing.Information(Area.HttpAuthentication, "Request for session token.");
                        return SendSessionTokenResponse(principal);
                    }

                    // else set the principal
                    SetPrincipal(principal);
                }
            }
            catch (SecurityTokenValidationException ex)
            {
                Tracing.Error(Area.HttpAuthentication, "Error validating the token: " + ex.ToString());
                return SendUnauthorizedResponse(request);
            }
            catch (SecurityTokenException ex)
            {
                Tracing.Error(Area.HttpAuthentication, "Error validating the token: " + ex.ToString());
                return SendUnauthorizedResponse(request);
            }
            catch (Exception ex)
            {
                Tracing.Error(Area.HttpAuthentication, "Exception while validating the token: " + ex.ToString());
                return SendUnauthorizedResponse(request);
            }

            return base.SendAsync(request, cancellationToken).ContinueWith(
                (task) =>
                {
                    var response = task.Result;

                    if (response.StatusCode == HttpStatusCode.Unauthorized)
                    {
                        SetAuthenticateHeader(response);
                    }

                    return response;
                });
        }

        private Task<HttpResponseMessage> SendUnauthorizedResponse(HttpRequestMessage request)
        {
            return Task<HttpResponseMessage>.Factory.StartNew(() =>
            {
                var response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                SetAuthenticateHeader(response);

                return response;
            });
        }

        private Task<HttpResponseMessage> SendSessionTokenResponse(ClaimsPrincipal principal)
        {
            var token = _authN.CreateSessionToken(principal);
            var tokenResponse = _authN.CreateSessionTokenResponse(token);

            return Task<HttpResponseMessage>.Factory.StartNew(() =>
            {
                var response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = new StringContent(tokenResponse, Encoding.UTF8, "application/json");

                return response;
            });
        }

        protected virtual void SetAuthenticateHeader(HttpResponseMessage response)
        {
            if (_authN.Configuration.SendWwwAuthenticateResponseHeader)
            {
                Tracing.Verbose(Area.HttpAuthentication, "Setting Www-Authenticate header with scheme: " + _authN.Configuration.DefaultAuthenticationScheme);

                response.Headers.WwwAuthenticate.Add(new AuthenticationHeaderValue(_authN.Configuration.DefaultAuthenticationScheme));
            }
        }

        protected virtual void SetPrincipal(ClaimsPrincipal principal)
        {
            if (principal.Identity.IsAuthenticated)
            {
                string name = "unknown";

                if (!string.IsNullOrWhiteSpace(principal.Identity.Name))
                {
                    name = principal.Identity.Name;
                }

                Tracing.Information(Area.HttpAuthentication, "Authentication successful for: " + name);
            }
            else
            {
                Tracing.Information(Area.HttpAuthentication, "Setting anonymous principal.");
            }

            Thread.CurrentPrincipal = principal;

            if (HttpContext.Current != null)
            {
                HttpContext.Current.User = principal;
            }
        }
    }
}