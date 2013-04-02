using System;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Xml;

namespace Thinktecture.IdentityModel.Tokens
{
    public class FileBasedMetadataCache : IMetadataCache
    {
        string filename;

        public FileBasedMetadataCache(XmlNodeList config)
        {
            LoadCustomConfiguration(config);
        }

        public FileBasedMetadataCache(string filename)
        {
            if (String.IsNullOrWhiteSpace(filename)) throw new ArgumentNullException("filename");

            this.filename = filename;
        }

        public byte[] Load()
        {
            if (File.Exists(filename))
            {
                return File.ReadAllBytes(filename);
            }

            return null;
        }

        public void Save(byte[] data)
        {
            if (data == null)
            {
                File.Delete(filename);
            }
            else
            {
                File.WriteAllBytes(filename, data);
            }
        }

        public TimeSpan Age
        {
            get
            {
                if (File.Exists(filename))
                {
                    var time = File.GetLastWriteTimeUtc(filename);
                    return DateTime.UtcNow.Subtract(time);
                }
                
                return TimeSpan.MaxValue;
            }
        }

        void LoadCustomConfiguration(System.Xml.XmlNodeList nodeList)
        {
            if (nodeList == null || nodeList.Count == 0)
            {
                throw new ConfigurationErrorsException("No configuration provided.");
            }

            var node = nodeList.Cast<XmlNode>().FirstOrDefault(x => x.LocalName == "file");
            if (node == null)
            {
                throw new ConfigurationErrorsException("Expected 'file' element.");
            }

            var elem = node as XmlElement;

            var path = elem.Attributes["path"];
            if (path == null || String.IsNullOrWhiteSpace(path.Value))
            {
                throw new ConfigurationErrorsException("Expected 'path' attribute.");
            }

            this.filename = path.Value;
        }
    }
}