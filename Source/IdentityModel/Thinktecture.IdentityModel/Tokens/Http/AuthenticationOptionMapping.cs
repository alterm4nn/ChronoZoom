/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using Microsoft.IdentityModel.Tokens;

namespace Thinktecture.IdentityModel.Tokens.Http
{
    public class AuthenticationOptionMapping
    {
        public AuthenticationOptions Options { get; set; }
        public SecurityTokenHandlerCollection TokenHandler { get; set; }
    }
}
