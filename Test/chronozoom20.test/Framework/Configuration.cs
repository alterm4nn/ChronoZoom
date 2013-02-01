using System.Linq;
using System.Xml;
using Framework.Constants;

namespace Framework
{
    public static class Configuration
    {
        private static XmlDocument _config;
        private static string _keyValue;

        public static string BrowserName
        {
            get { return GetConfigProperty(ConfigProperties.BrowserName); }
        }

        public static string BaseUrl
        {
            get { return GetConfigProperty(ConfigProperties.BaseUrl); }
        }

        public static string HubUrl
        {
            get { return GetConfigProperty(ConfigProperties.HubUrl); }
        }

        public static int ImplicitWait
        {
            get { return GetIntConfigProperty(ConfigProperties.ImplicitWait); }
        }

        public static int ExplicitWait
        {
            get { return GetIntConfigProperty(ConfigProperties.ExplicitWait); }
        }

        public static bool IsUsingGrid
        {
            get { return GetBoolConfigProperty(ConfigProperties.IsUsingGrid); }
        }

        public static string BrowserVersion
        {
            get { return GetConfigProperty(ConfigProperties.BrowserVersion); }
        }

        public static string Platform
        {
            get { return GetConfigProperty(ConfigProperties.PlatformName); }
        }

        public static string UserGuid
        {
            get { return GetConfigProperty(ConfigProperties.UserGuid); }
        }

        public static int HighlightWait
        {
            get { return GetIntConfigProperty(ConfigProperties.HighlightWait); }
        }

        public static bool HasHighliting
        {
            get { return GetBoolConfigProperty(ConfigProperties.HasHighliting); }
        }

        public static bool IsUsingUsingGrid
        {
            get { return GetBoolConfigProperty(ConfigProperties.IsUsingUsingGrid); }
        }

        public static int ConnectionWait
        {
            get { return GetIntConfigProperty(ConfigProperties.ConnectionWait); }
        }


        #region HelperMethods
        private static XmlDocument GetConfig()
        {
            const string configFilePath = ConfigProperties.ConfigFileName;
            var xml = new XmlDocument();
            xml.Load(configFilePath);
            return _config ?? (_config = xml);
        }

        private static string GetConfigProperty(string property)
        {
            var xmlNodeList = GetConfig().SelectNodes(property);
            if (xmlNodeList == null)
                return null;
            foreach (var xn in xmlNodeList.Cast<XmlNode>().Where(xn => xn != null))
            {
                _keyValue = xn.InnerText;
            }
            return _keyValue;
        }

        private static int GetIntConfigProperty(string property)
        {
            return int.Parse(GetConfigProperty(property));
        }

        private static bool GetBoolConfigProperty(string property)
        {
            return bool.Parse(GetConfigProperty(property));
        }
        #endregion

    }
}