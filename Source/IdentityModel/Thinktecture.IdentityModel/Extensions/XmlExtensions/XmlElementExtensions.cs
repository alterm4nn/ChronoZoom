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
        /// Converts a XmlElement to a XElement.
        /// </summary>
        /// <param name="element">The XmlElement.</param>
        /// <returns>A XElement</returns>
        public static XElement ToXElement(this XmlElement element)
        {
            Contract.Requires(element != null);
            Contract.Ensures(Contract.Result<XElement>() != null);


            return new XmlConverter(element).CreateXElement();
        }        
    }
}