/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Diagnostics.Contracts;
using System.IO;
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace Thinktecture.IdentityModel.Extensions
{
    internal class XmlConverter
    {
        private readonly StringBuilder _xmlTextBuilder;
        private readonly XmlWriter _writer;

        private XmlConverter()
        {
            _xmlTextBuilder = new StringBuilder();

            _writer = new XmlTextWriter(new StringWriter(_xmlTextBuilder))
            {
                Formatting = Formatting.Indented,
                Indentation = 2
            };
        }

        public XmlConverter(XNode e)
            : this()
        {
            Contract.Requires(e != null);


            e.WriteTo(_writer);
        }

        public XmlConverter(XmlNode e)
            : this()
        {
            Contract.Requires(e != null);


            e.WriteTo(_writer);
        }

        public XElement CreateXElement()
        {
            return XElement.Load(new StringReader(_xmlTextBuilder.ToString()));
        }

        public XDocument CreateXDocument()
        {
            return XDocument.Load(new StringReader(_xmlTextBuilder.ToString()));
        }

        public XmlElement CreateXmlElement()
        {
            return CreateXmlDocument().DocumentElement;
        }

        public XmlDocument CreateXmlDocument()
        {
            var doc = new XmlDocument();
            doc.Load(new XmlTextReader(new StringReader(_xmlTextBuilder.ToString())));
            return doc;
        }
    }
}
