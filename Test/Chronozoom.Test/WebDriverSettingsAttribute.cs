using System;

namespace Chronozoom.Test
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    public class WebDriverSettingsAttribute : Attribute
    {
        public BrowserType Browser { get; set; }
        public string RemoteAddress { get; set; }

        public WebDriverSettingsAttribute(BrowserType browser, string remoteAddress = "")
        {
            Browser = browser;
            RemoteAddress = remoteAddress;
        }
    }
}