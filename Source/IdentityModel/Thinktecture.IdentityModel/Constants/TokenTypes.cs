/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

namespace Thinktecture.IdentityModel.Constants
{
    public static class TokenTypes
    {
        public const string Kerberos = "http://schemas.microsoft.com/ws/2006/05/identitymodel/tokens/Kerberos";
        public const string OasisWssSaml11TokenProfile11 = "http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV1.1";
        public const string OasisWssSaml2TokenProfile11 = "http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV2.0";
        public const string Rsa = "http://schemas.microsoft.com/ws/2006/05/identitymodel/tokens/Rsa";
        public const string Saml11TokenProfile11 = "urn:oasis:names:tc:SAML:1.0:assertion";
        public const string Saml2TokenProfile11 = "urn:oasis:names:tc:SAML:2.0:assertion";
        public const string UserName = "http://schemas.microsoft.com/ws/2006/05/identitymodel/tokens/UserName";
        public const string X509Certificate = "http://schemas.microsoft.com/ws/2006/05/identitymodel/tokens/X509Certificate";
        public const string SimpleWebToken = "http://schemas.xmlsoap.org/ws/2009/11/swt-token-profile-1.0";
        public const string JsonWebToken = "urn:ietf:params:oauth:token-type:jwt";
    }
}
