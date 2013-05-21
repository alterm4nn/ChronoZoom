using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Web;

namespace Chronozoom.UI
{
    internal static class FriendlyUrl
    {
        // Replace with URL friendly representations. For instance, converts space to '-'.
        [SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase")]
        internal static string FriendlyUrlEncode(string value)
        {
            return Uri.EscapeDataString(value.Replace(' ', '-').ToLowerInvariant());
        }

        // Decodes from URL friendly representations. For instance, converts '-' to space.
        internal static string FriendlyUrlDecode(string value)
        {
            return Uri.UnescapeDataString(value.Replace('-', ' '));
        }
    }
}