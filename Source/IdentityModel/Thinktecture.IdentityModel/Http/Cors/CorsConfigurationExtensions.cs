/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Linq;

namespace Thinktecture.IdentityModel.Http.Cors
{
    internal static class CorsConfigurationExtensions
    {
        internal static CorsConfigurationAllowProperties Clone(this CorsConfigurationAllowProperties other)
        {
            return new CorsConfigurationAllowProperties
            {
                AllowAllMethods = other.AllowAllMethods,
                AllowAllRequestedHeaders = other.AllowAllRequestedHeaders,
                AllowAnyOrigin = other.AllowAnyOrigin,
                AllowCookies = other.AllowCookies,
                Methods = other.Methods.ToArray(),
                RequestHeaders = other.RequestHeaders.ToArray(),
                ResponseHeaders = other.ResponseHeaders.ToArray(),
                CacheDuration = other.CacheDuration
            };
        }

        internal static CorsConfigurationEntry EntryFromAllowProperties(this CorsConfigurationAllowProperties other, CorsAccessRequest accessRequest)
        {
            return new CorsConfigurationEntry
            {
                AllResources = false,
                Resource = accessRequest.Resource,
                Origin = accessRequest.Origin,

                AllowAllMethods = other.AllowAllMethods,
                AllowAllRequestedHeaders = other.AllowAllRequestedHeaders,
                AllowAnyOrigin = other.AllowAnyOrigin,
                AllowCookies = other.AllowCookies,
                Methods = other.Methods.ToArray(),
                RequestHeaders = other.RequestHeaders.ToArray(),
                ResponseHeaders = other.ResponseHeaders.ToArray(),
                CacheDuration = other.CacheDuration
            };
        }
    }
}
