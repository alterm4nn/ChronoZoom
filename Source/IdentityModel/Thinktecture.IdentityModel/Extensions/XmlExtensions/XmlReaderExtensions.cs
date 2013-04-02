/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Diagnostics.Contracts;
using System.IO;
using System.Text;
using System.Xml;

namespace Thinktecture.IdentityModel.Extensions
{
    public static partial class XmlExtensions
    {
        /// <summary>
        ///     Converts an XmlReader to a string.
        /// </summary>
        /// <param name="reader">The reader.</param>
        /// <returns>The converted string</returns>
        public static string AsString(this XmlReader reader)
        {
            Contract.Requires(reader != null);
            Contract.Ensures(Contract.Result<string>() != null);


            StringBuilder sb = new StringBuilder();
            while (reader.Read())
            {
                sb.AppendLine(reader.ReadOuterXml());
            }

            return sb.ToString();
        }

        /// <summary>
        /// Converts a string to an XmlReader.
        /// </summary>
        /// <param name="input">The input string.</param>
        /// <returns>An XmlReader</returns>
        public static XmlReader AsXmlReader(this string input)
        {
            Contract.Requires(!String.IsNullOrEmpty(input));
            Contract.Ensures(Contract.Result<XmlReader>() != null);


            var reader = new XmlTextReader(new StringReader(input));
            return reader;
        }

        /// <summary>
        /// Converts a string to an XmlReader.
        /// </summary>
        /// <param name="input">The input.</param>
        /// <param name="isInteractive">if set to <c>true</c> the reader will be in an interactive state.</param>
        /// <returns>An XmlReader</returns>
        public static XmlReader AsXmlReader(this string input, bool isInteractive)
        {
            Contract.Requires(!String.IsNullOrEmpty(input));
            Contract.Ensures(Contract.Result<XmlReader>() != null);


            var reader = input.AsXmlReader();

            if (isInteractive)
            {
                reader.MoveToContent();
            }

            return reader;
        }
    }
}