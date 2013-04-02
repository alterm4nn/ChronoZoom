/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.IdentityModel.Tokens;
using Thinktecture.IdentityModel.Constants;

namespace Thinktecture.IdentityModel.Tokens
{
    public class HmacSigningCredentials : SigningCredentials
    {
        public HmacSigningCredentials(string base64EncodedKey)
            : this(Convert.FromBase64String(base64EncodedKey))
        { }

        public HmacSigningCredentials(byte[] key)
            : base(new InMemorySymmetricSecurityKey(key),
                    CreateSignatureAlgorithm(key), 
                    CreateDigestAlgorithm(key))
        { }

        protected static string CreateSignatureAlgorithm(byte[] key)
        {
            switch (key.Length)
            {
                case 32:
                    return Algorithms.HmacSha256Signature;
                case 48:
                    return Algorithms.HmacSha384Signature;
                case 64:
                    return Algorithms.HmacSha512Signature;
                default:
                    throw new InvalidOperationException("Unsupported key lenght");
            }
        }

        protected static string CreateDigestAlgorithm(byte[] key)
        {
            switch (key.Length)
            {
                case 32:
                    return Algorithms.Sha256Digest;
                case 48:
                    return Algorithms.Sha384Digest;
                case 64:
                    return Algorithms.Sha512Digest;
                default:
                    throw new InvalidOperationException("Unsupported key length");
            }
        }
    }
}

