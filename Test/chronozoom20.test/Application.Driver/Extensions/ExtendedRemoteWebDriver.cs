using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Remote;

namespace Application.Driver.Extensions
{
    internal class ExtendedRemoteWebDriver : RemoteWebDriver, ITakesScreenshot
    {
        public ExtendedRemoteWebDriver(Uri remoteAddress, ICapabilities desiredCapabilities)
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