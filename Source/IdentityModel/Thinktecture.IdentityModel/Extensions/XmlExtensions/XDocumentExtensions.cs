/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Diagnostics.Contracts;
using System.Xml;
using System.Xml.Linq;

namespace Thinktecture.IdentityModel.Extensions
{
    /// <summary>
    /// Extension methods for XML related tasks
    /// </summary>
    public static partial class XmlExtensions
    {
        /// <summary>
        /// Converts a XDocument to a XmlDocument.
        /// </summary>
        /// <param name="document">The XDocument.</param>
        /// <returns>A XmlDocument</returns>
        public static XmlDocument ToXmlDocument(this XDocument document)
        {
            Contract.Requires(document != null);
            Contract.Ensures(Contract.Result<XmlDocument>() != null);


            return new XmlConverter(document).CreateXmlDocument();
        }
    }
}