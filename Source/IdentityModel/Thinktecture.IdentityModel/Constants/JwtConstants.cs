/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

namespace Thinktecture.IdentityModel.Constants
{
    public static class JwtConstants
    {
        public const string JWT = "JWT";

        public static class SignatureAlgorithms
        {
            public const string None = "none";

            public const string HMACSHA256 = "HS256";
            public const string HMACSHA384 = "HS384";
            public const string HMACSHA512 = "HS512";            
        }

        public static class Header
        {
            public const string Algorithm = "alg";
            public const string Type = "typ";
        }

        public static class Claims
        {
            public const string Type = "typ";
            public const string ExpirationTime = "exp";
            public const string NotBefore = "nbf";
            public const string IssuedAt = "iat";
            public const string Issuer = "iss";
            public const string Audience = "aud";
            public const string Principal = "prn";
            public const string Id = "jti";
        }
    }
}
