using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Remote;

namespace Framework
{
    internal class ScreenShotRemoteWebDriver : RemoteWebDriver, ITakesScreenshot
    {
        public ScreenShotRemoteWebDriver(Uri remoteAddress, ICapabilities desiredCapabilities)
            : base(remoteAddress, desiredCapabilities)
        {
        }

        public Screenshot GetScreenshot()
        {
            var response = Execute(DriverCommand.Screenshot, null);
            var base64 = response.Value.ToString();
            return new Screenshot(base64);
        }
    }
}