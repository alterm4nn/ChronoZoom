/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

namespace Thinktecture.IdentityModel.Constants
{
    /// <summary>
    /// Represents DateTimeFormats used in tokens and claims
    /// </summary>
    public static class DateTimeFormats
    {
        /// <summary>
        /// Accepted DateTime formats
        /// </summary>
        public static string[] Accepted = new string[] { "yyyy-MM-ddTHH:mm:ss.fffffffZ", "yyyy-MM-ddTHH:mm:ss.ffffffZ", "yyyy-MM-ddTHH:mm:ss.fffffZ", "yyyy-MM-ddTHH:mm:ss.ffffZ", "yyyy-MM-ddTHH:mm:ss.fffZ", "yyyy-MM-ddTHH:mm:ss.ffZ", "yyyy-MM-ddTHH:mm:ss.fZ", "yyyy-MM-ddTHH:mm:ssZ", "yyyy-MM-ddTHH:mm:ss.fffffffzzz", "yyyy-MM-ddTHH:mm:ss.ffffffzzz", "yyyy-MM-ddTHH:mm:ss.fffffzzz", "yyyy-MM-ddTHH:mm:ss.ffffzzz", "yyyy-MM-ddTHH:mm:ss.fffzzz", "yyyy-MM-ddTHH:mm:ss.ffzzz", "yyyy-MM-ddTHH:mm:ss.fzzz", "yyyy-MM-ddTHH:mm:sszzz" };

        /// <summary>
        /// Generated DateTime format
        /// </summary>
        public static string Generated = "yyyy-MM-ddTHH:mm:ss.fffZ";
    }
}