/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.Generic;
using System.Linq;

namespace Thinktecture.IdentityModel.Http.Cors
{
    public static class CorsExtensions
    {
        public static bool IsSimpleMethod(this string method)
        {
            return CorsConstants.SimpleMethods.Contains(method);
        }

        public static IEnumerable<string> RemoveSimpleRequestHeaders(this IEnumerable<string> headers)
        {
            if (headers == null) return Enumerable.Empty<string>();

            return
                from item in headers
                where !CorsConstants.SimpleRequestHeaders.Contains(item, StringComparer.OrdinalIgnoreCase)
                select item;
        }

        public static IEnumerable<string> RemoveSimpleResponseHeaders(this IEnumerable<string> headers)
        {
            if (headers == null) return Enumerable.Empty<string>();

            return
                from item in headers
                where !CorsConstants.SimpleResponseHeaders.Contains(item, StringComparer.OrdinalIgnoreCase)
                select item;
        }
    }
}
