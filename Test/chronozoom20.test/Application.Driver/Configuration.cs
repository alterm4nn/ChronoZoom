using System;
using System.IO;
using System.Linq;
using System.Xml;
using Application.Driver.Constants;

namespace Application.Driver
{
    public static class Configuration
    {
        private static XmlDocument _config;
        private static string _keyValue;

        public static string BrowserName { get; set; }
        public static string BaseUrl { get; set; }
        public static string HubUrl { get; set; }
        public static int ImplicitWait { get; set; }
        public static int ExplicitWait { get; set; }
        public static bool IsUsingGrid { get; set; }
        public static string BrowserVersion { get; set; }
        public static string Platform { get; set; }
        public static int HighlightWait { get; set; }
        public static bool HasHighliting { get; set; }
        public static int ConnectionWait { get; set; }

        static Configuration()
        {
            BrowserName = GetConfigProperty(ConfigProperties.BrowserName);
            BaseUrl = GetConfigProperty(ConfigProperties.BaseUrl);
            HubUrl = GetConfigProperty(ConfigProperties.HubUrl);
            ImplicitWait = GetProperty<int>(ConfigProperties.ImplicitWait);
            ExplicitWait = GetProperty<int>(ConfigProperties.ExplicitWait);
            IsUsingGrid = GetProperty<bool>(ConfigProperties.IsUsingGrid);
            BrowserVersion = GetConfigProperty(ConfigProperties.BrowserVersion);
            Platform = GetConfigProperty(ConfigProperties.PlatformName);
            HighlightWait = GetProperty<int>(ConfigProperties.HighlightWait);
            HasHighliting = GetProperty<bool>(ConfigProperties.HasHighliting);
            ConnectionWait = GetProperty<int>(ConfigProperties.ConnectionWait);
        }

        #region HelperMethods
        private static XmlDocument GetConfig()
        {
            string configFilePath = File.Exists(ConfigFileLocations.ConfigPathVsRun) ? ConfigFileLocations.ConfigPathVsRun : ConfigFileLocations.ConfigPathConsoleRun;
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

        private static T GetProperty<T>(string property) where T : IConvertible
        {
            var thisType = default(T);
            var typeCode = thisType.GetTypeCode();
            if (typeCode == TypeCode.Boolean)
            {
                return (T)Convert.ChangeType(GetConfigProperty(property), typeCode);
            }
            if (typeCode == TypeCode.Int32)
            {
                return (T)Convert.ChangeType(GetConfigProperty(property), typeCode);
            }
            return thisType;
        }

        #endregion

    }
}