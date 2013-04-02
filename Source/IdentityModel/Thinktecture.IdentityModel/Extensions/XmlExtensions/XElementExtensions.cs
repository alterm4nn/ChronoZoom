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
        /// Converts a XElement to a XmlElement.
        /// </summary>
        /// <param name="element">The XElement.</param>
        /// <returns>A XmlElement</returns>
        public static XmlElement ToXmlElement(this XElement element)
        {
            Contract.Requires(element != null);
            Contract.Ensures(Contract.Result<XmlElement>() != null);


            return new XmlConverter(element).CreateXmlElement();
        }
    }
}