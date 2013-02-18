using System;
using System.Configuration;

namespace Chronozoom.Test
{
    public static class CzCommon
    {
        public static readonly Uri StartPage = new Uri("http://www.bing.com/");
        public static readonly BrowserType BrowserName = BrowserType.Firefox;

        public const string ChromeDriverDirectory = "../../../External/WebDrivers/";
        public const string IeDriverDirectory = "../../../External/WebDrivers/";

        public const string StartPagePrefix = "http://localhost:4949/";
        public const string RCDefaultAddress = "http://localhost:4444/wb/hub/";
        public const string RCDefaultPath = "/wd/hub/";
        public const int RCDefaultPort = 4444;

        public const string CzBetaStartPage = "http://www.czbeta.com/";
    }
}