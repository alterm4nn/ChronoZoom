/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */


namespace Thinktecture.IdentityModel.Tokens.Http
{
    public class AuthenticationOptions
    {
        public HttpRequestType RequestType { get; set; }
        public string Name { get; set; }
        public string Scheme { get; set; }

        public static AuthenticationOptions ForAuthorizationHeader(string scheme)
        {
            return new AuthenticationOptions
            {
                RequestType = HttpRequestType.AuthorizationHeader,
                Name = "Authorization",
                Scheme = scheme
            };
        }

        public static AuthenticationOptions ForHeader(string name)
        {
            return new AuthenticationOptions
            {
                RequestType = HttpRequestType.Header,
                Name = name
            };
        }

        public static AuthenticationOptions ForQueryString(string name)
        {
            return new AuthenticationOptions
            {
                RequestType = HttpRequestType.QueryString,
                Name = name
            };
        }

        public static AuthenticationOptions ForCookie(string name)
        {
            return new AuthenticationOptions
            {
                RequestType = HttpRequestType.Cookie,
                Name = name
            };
        }

        public static AuthenticationOptions ForClientCertificate()
        {
            return new AuthenticationOptions
            {
                RequestType = HttpRequestType.ClientCertificate
            };
        }
    }

    public enum HttpRequestType
    {
        Header,
        AuthorizationHeader,
        QueryString,
        ClientCertificate,
        Cookie
    }
}
