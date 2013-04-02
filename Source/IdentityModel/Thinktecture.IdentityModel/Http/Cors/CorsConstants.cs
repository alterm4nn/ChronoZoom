/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */


namespace Thinktecture.IdentityModel.Http.Cors
{
    public class CorsConstants
    {
        // 60 seconds * 60 mins == 1 hour
        public static int? DefaultCacheDurationInSeconds = null; //60 * 60;

        public const string RequestHeader_Orign = "Origin";
        public const string RequestHeader_RequestedMethod = "Access-Control-Request-Method";
        public const string RequestHeader_RequestedHeaders = "Access-Control-Request-Headers";

        public const string ResponseHeader_AllowOrign = "Access-Control-Allow-Origin";
        public const string ResponseHeader_AllowOrign_Wildcard = "*";
        public const string ResponseHeader_AllowRequestHeaders = "Access-Control-Allow-Headers";
        public const string ResponseHeader_AllowResponseHeaders = "Access-Control-Expose-Headers";
        public const string ResponseHeader_AllowMethods = "Access-Control-Allow-Methods";
        public const string ResponseHeader_AllowCookies = "Access-Control-Allow-Credentials";
        public const string ResponseHeader_CacheDuration = "Access-Control-Max-Age";

        public const string ContentType = "Content-Type";

        public static readonly string[] SimpleRequestHeaders = new string[]
            {
                "Origin",
                "Accept",
                "Accept-Language",
                "Content-Language",
            };

        public static readonly string[] SimpleResponseHeaders = new string[]
            {
                "Cache-Control",
                "Content-Language",
                "Content-Type",
                "Expires",
                "Last-Modified",
                "Pragma"
            };

        public static readonly string[] SimpleMethods = { "GET", "HEAD", "POST" };
        public static readonly string[] NotSimpleMethods = 
            { 
                //"OPTIONS", 
                "PUT", 
                "DELETE",  
                //"TRACE"
            };
    }
}