﻿/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;

namespace Thinktecture.IdentityModel
{
    public static class Base64Url
    {
        public static string Encode(byte[] arg)
        {
            string s = Convert.ToBase64String(arg); // Standard base64 encoder
            
            s = s.Split('=')[0]; // Remove any trailing '='s
            s = s.Replace('+', '-'); // 62nd char of encoding
            s = s.Replace('/', '_'); // 63rd char of encoding
            
            return s;
        }

        public static byte[] Decode(string arg)
        {
            string s = arg;
            s = s.Replace('-', '+'); // 62nd char of encoding
            s = s.Replace('_', '/'); // 63rd char of encoding
            
            switch (s.Length % 4) // Pad with trailing '='s
            {
                case 0: break; // No pad chars in this case
                case 2: s += "=="; break; // Two pad chars
                case 3: s += "="; break; // One pad char
                default: throw new Exception("Illegal base64url string!");
            }
            
            return Convert.FromBase64String(s); // Standard base64 decoder
        }
    }
}
