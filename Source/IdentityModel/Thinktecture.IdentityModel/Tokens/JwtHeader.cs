/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.IdentityModel.Tokens;
using Thinktecture.IdentityModel.Constants;

namespace Thinktecture.IdentityModel.Tokens
{
    public class JwtHeader
    {
        public string SignatureAlgorithm { get; set; }
        public string Type { get; set; }
        
        public SigningCredentials SigningCredentials { get; set; }

        public JwtHeader()
        {
            Type = JwtConstants.JWT;
        }
    }
}
