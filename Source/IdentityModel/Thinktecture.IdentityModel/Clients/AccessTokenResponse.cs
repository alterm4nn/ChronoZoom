/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */


namespace Thinktecture.IdentityModel.Clients
{
    public class AccessTokenResponse
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public string TokenType { get; set; }
        public int ExpiresIn { get; set; }
    }
}
