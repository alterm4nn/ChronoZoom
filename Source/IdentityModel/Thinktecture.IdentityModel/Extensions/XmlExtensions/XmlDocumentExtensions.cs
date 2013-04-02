/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Diagnostics.Contracts;
using System.Xml;
using System.Xml.Linq;

namespace Thinktecture.IdentityModel.Extensions
{
    public static partial class XmlExtensions
    {
        /// <summary>
        /// Converts a XmlDocument to a XDocument.
        /// </summary>
        /// <param name="document">The XmlDocument.</param>
        /// <returns>A XDocument</returns>
        public static XDocument ToXDocument(this XmlDocument document)
        {
            Contract.Requires(document != null);
            Contract.Ensures(Contract.Result<XDocument>() != null);


            return new XmlConverter(document).CreateXDocument();
        }   
    }
}