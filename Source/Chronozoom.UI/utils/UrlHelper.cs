using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Web;

namespace Chronozoom.UI
{
    public static class FriendlyUrl
    {
        // Replace with URL friendly representations. For instance, converts space to '-'.
        [SuppressMessage("Microsoft.Design", "CA1055:UriReturnValuesShouldNotBeStrings"), SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase")]
        public static string FriendlyUrlEncode(string value)
        {
            if (value == null)
                return null;

            return Uri.EscapeDataString(value.Replace(' ', '-').ToLowerInvariant());
        }

        // Decodes from URL friendly representations. For instance, converts '-' to space.
        [SuppressMessage("Microsoft.Design", "CA1055:UriReturnValuesShouldNotBeStrings")]
        public static string FriendlyUrlDecode(string value)
        {
            if (value == null)
                return null;

            return Uri.UnescapeDataString(value.Replace('-', ' '));
        }
    }
}