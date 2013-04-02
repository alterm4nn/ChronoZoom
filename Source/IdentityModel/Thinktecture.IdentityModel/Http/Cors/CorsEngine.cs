/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Linq;

namespace Thinktecture.IdentityModel.Http.Cors
{
    public class CorsEngine
    {
        CorsConfiguration configuration;
        public CorsEngine(CorsConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public CorsAccessResponse CheckAccess(CorsAccessRequest accessRequest)
        {
            if (!accessRequest.IsCors) return null;
            var configEntry = configuration.GetConfigurationEntryForRequest(accessRequest);
            return CalculateResponse(accessRequest, configEntry);
        }

        private CorsAccessResponse CalculateResponse(
            CorsAccessRequest accessRequest, CorsConfigurationEntry configEntry)
        {
            CorsAccessResponse response = new CorsAccessResponse();

            if (configEntry != null)
            {
                if (CheckOrigin(accessRequest, configEntry))
                {
                    if (accessRequest.IsCorsSimple)
                    {
                        AddOrigin(accessRequest, configEntry, response);
                        AddCookies(configEntry, response);
                        AddExposedHeaders(configEntry, response);
                    }
                    else if (accessRequest.IsCorsPreflight)
                    {
                        if (CheckMethods(accessRequest, configEntry)
                            && CheckRequestHeaders(accessRequest, configEntry))
                        {
                            AddOrigin(accessRequest, configEntry, response);
                            AddCookies(configEntry, response);
                            AddCacheDuration(configEntry, response);
                            AddAllowedMethods(accessRequest, configEntry, response);
                            AddAllowedRequestHeaders(accessRequest, configEntry, response);
                        }
                    }
                }
            }

            return response;
        }

        private static bool CheckOrigin(CorsAccessRequest accessRequest, CorsConfigurationEntry configEntry)
        {
            return
                configEntry.AllowAnyOrigin ||
                accessRequest.Origin.Equals(configEntry.Origin, StringComparison.OrdinalIgnoreCase);
        }

        private static bool CheckMethods(CorsAccessRequest accessRequest, CorsConfigurationEntry configEntry)
        {
            if (configEntry.AllowAllMethods) return true;
            
            var configMethods = configEntry.Methods.Select(x => x.ToUpper());
            var requestedMethod = accessRequest.RequestedMethod;
            return configMethods.Contains(requestedMethod);
        }

        private bool CheckRequestHeaders(CorsAccessRequest accessRequest, CorsConfigurationEntry configEntry)
        {
            if (configEntry.AllowAllRequestedHeaders) return true;

            var requestedHeaders = accessRequest.RequestedHeaders.RemoveSimpleRequestHeaders();
            var allowedHeaders = configEntry.RequestHeaders.RemoveSimpleRequestHeaders();

            // the requested headers must all be in the allowed list
            var both = requestedHeaders.Intersect(allowedHeaders, StringComparer.OrdinalIgnoreCase);
            return both.Count() == requestedHeaders.Count();
        }

        private static void AddOrigin(CorsAccessRequest accessRequest, CorsConfigurationEntry configEntry, CorsAccessResponse response)
        {
            if (configEntry.AllowAnyOrigin)
            {
                if (configEntry.AllowCookies == true)
                {
                    response.OriginAllowed = accessRequest.Origin;
                }
                else
                {
                    response.OriginAllowed = CorsConstants.ResponseHeader_AllowOrign_Wildcard;
                }
            }
            else
            {
                response.OriginAllowed = accessRequest.Origin;
            }
        }

        private static void AddCookies(CorsConfigurationEntry configEntry, CorsAccessResponse response)
        {
            response.AreCookiesAllowed = configEntry.AllowCookies;
        }

        private void AddExposedHeaders(CorsConfigurationEntry configEntry, CorsAccessResponse response)
        {
            var exposedHeaders = configEntry.ResponseHeaders.RemoveSimpleResponseHeaders();
            if (exposedHeaders.Any())
            {
                response.AllowedResponseHeaders = exposedHeaders;
            }
        }

        private void AddCacheDuration(CorsConfigurationEntry configEntry, CorsAccessResponse response)
        {
            if (configEntry.CacheDuration.HasValue && configEntry.CacheDuration.Value > 0)
            {
                response.ResponseCacheDurationSeconds = configEntry.CacheDuration;
            }
        }

        private static void AddAllowedRequestHeaders(CorsAccessRequest accessRequest, CorsConfigurationEntry configEntry, CorsAccessResponse response)
        {
            var requestedHeaders = accessRequest.RequestedHeaders.RemoveSimpleRequestHeaders();
            if (requestedHeaders.Any())
            {
                if (configEntry.AllowAllRequestedHeaders)
                {
                    response.AllowedRequestHeaders = requestedHeaders;
                }
                else
                {
                    response.AllowedRequestHeaders = configEntry.RequestHeaders.RemoveSimpleRequestHeaders().ToArray();
                }
            }

            var simpleRequestedHeaders = accessRequest.RequestedHeaders.Intersect(CorsConstants.SimpleRequestHeaders, StringComparer.OrdinalIgnoreCase);
            if (simpleRequestedHeaders.Any())
            {
                // chrome asks for things like "Origin" and "Accept", so placate them
                response.AllowedRequestHeaders = simpleRequestedHeaders.Union(response.AllowedRequestHeaders ?? Enumerable.Empty<string>()).Distinct();
            }
        }

        private static void AddAllowedMethods(CorsAccessRequest accessRequest, CorsConfigurationEntry configEntry, CorsAccessResponse response)
        {
            if (!accessRequest.RequestedMethod.IsSimpleMethod())
            {
                if (configEntry.AllowAllMethods)
                {
                    response.AllowedMethods = CorsConstants.NotSimpleMethods;
                }
                else
                {
                    response.AllowedMethods = configEntry.Methods.Select(x=>x.ToUpper()).ToArray();
                }
            }
        }
    }
}
