/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

namespace Thinktecture.IdentityModel.Constants
{
    public static class Algorithms
    {
        public const string HmacSha256Signature = "http://www.w3.org/2001/04/xmldsig-more#hmac-sha256";
        public const string HmacSha384Signature = "http://www.w3.org/2001/04/xmldsig-more#hmac-sha384";
        public const string HmacSha512Signature = "http://www.w3.org/2001/04/xmldsig-more#hmac-sha512";

        public const string Sha256Digest = "http://www.w3.org/2001/04/xmlenc#sha256";
        public const string Sha384Digest = "http://www.w3.org/2001/04/xmlenc#sha384";
        public const string Sha512Digest = "http://www.w3.org/2001/04/xmlenc#sha512";
    }
}
