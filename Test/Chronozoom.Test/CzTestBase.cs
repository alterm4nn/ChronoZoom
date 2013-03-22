using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.IE;
using OpenQA.Selenium.Remote;
using System.Collections.ObjectModel;
using System.Drawing;
using System.Windows.Forms;

namespace Chronozoom.Test
{
    [TestClass]
    public abstract class CzTestBase : IDisposable
    {
        private TestContext context;

        // This dictionary stores all opened browsers, so they can be used for few test classes.
        private static Dictionary<Tuple<BrowserType, string>, IWebDriver> browsers = new Dictionary<Tuple<BrowserType, string>, IWebDriver>();

        private IWebDriver driver;
        private Uri startPage;
        private BrowserType browser;

        public CzTestBase()
        {
            // Get test page .htm name from TestPage attribute and assign it to StartPage property.
            TestPageAttribute attr = Attribute.GetCustomAttribute(this.GetType(), typeof(TestPageAttribute)) as TestPageAttribute;

            if (attr == null)
            {
                throw new InvalidOperationException("Test class is not marked with TestPage attribute.");
            }

            if (Uri.IsWellFormedUriString(attr.TestPage, UriKind.Absolute))
            {
                StartPage = attr.TestPage;
            }
            else
            {
                StartPage = CzCommon.StartPagePrefix + attr.TestPage;
            }
            driver = null;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (driver != null)
                {
                    driver.Dispose();
                    driver = null;
                }
            }
        }

        #region Test Methods and Properties

        public TestContext Context
        {
            get
            {
                return context;
            }
            set
            {
                context = value;
            }
        }

        [TestInitialize]
        public void BaseTestInitilize()
        {
            // TODO: Some additional initialization.
        }

        [TestCleanup]
        public void BaseTestCleanup()
        {
            // TODO: Some additional cleanup.
        }

        #endregion Test Methods and Properties

        #region Properties

        public IWebDriver Driver
        {
            get
            {
                // Assign existent webdriver or create new webdriver on demand.
                if (driver == null)
                {
                    Start();
                }

                return driver;
            }
        }

        public BrowserType Browser
        {
            get
            {
                return browser;
            }
            set
            {
                browser = value;
            }
        }

        public string StartPage
        {
            get
            {
                return startPage.ToString();
            }
            set
            {
                if (!Uri.IsWellFormedUriString(value, UriKind.RelativeOrAbsolute))
                {
                    throw new UriFormatException("Invalid Start Page URI.");
                }

                startPage = new Uri(value);
            }
        }

        #endregion Properties

        #region Main Methods

        /// <summary>
        /// Starts the new session of browser or continues existent session.
        /// It uses Browser and StartPage properties from TestPage and BrowserSettings
        /// attributes.
        /// </summary>
        public void Start()
        {
            // Get Browser and RemoteAddress properties from BrowserSettings attribute.
            WebDriverSettingsAttribute attr = Attribute.GetCustomAttribute(this.GetType(), typeof(WebDriverSettingsAttribute)) as WebDriverSettingsAttribute;

            if (attr == null)
            {
                throw new InvalidOperationException("Test class is not marked with WebDriverSettings attribute.");
            }

            browser = attr.Browser;
            var attrValue = Tuple.Create(attr.Browser, attr.RemoteAddress);

            // If this browser has started already, then assign it to driver field.
            // Otherwise create new instance of webdriver and add it to browsers dictionary.
            if (browsers.ContainsKey(attrValue))
            {
                driver = browsers[attrValue];
            }
            else
            {
                if (attr.RemoteAddress == String.Empty)
                {
                    StartLocally();
                }
                else
                {
                    StartRemotely(attr.RemoteAddress);
                }

                // Full size for browser window, except Chrome browser.
                // For Chrome browser there are specific DesiredCapabilities with
                // fullscreen mode.
                if (browser != BrowserType.Chrome)
                {
                    driver.Manage().Window.Position = new Point(0, 0);
                    driver.Manage().Window.Size = SystemInformation.PrimaryMonitorSize;
                }

                browsers.Add(attrValue, driver);
            }
        }

        /// <summary>
        /// Navigates to specified URL.
        /// </summary>
        /// <param name="url">URL of webpage.</param>
        public void GoToUrl(Uri url = null)
        {
            if (url == null)
            {
                url = startPage;
            }

            Driver.Navigate().GoToUrl(url);
        }

        /// <summary>
        /// Navigates to specified URL.
        /// </summary>
        /// <param name="url">URL of webpage.</param>
        public void GoToUrl(string url)
        {
            if (!Uri.IsWellFormedUriString(url, UriKind.RelativeOrAbsolute))
            {
                throw new UriFormatException("Invalid page URI for navigation.");
            }

            Driver.Navigate().GoToUrl(url);
        }

        // Creates an instance of local webdriver accordingly to assigned browser.
        private void StartLocally()
        {
            switch (browser)
            {
                case BrowserType.Firefox:
                    driver = new FirefoxDriver();
                    break;
                case BrowserType.InternetExplorer:
                    driver = new InternetExplorerDriver(CzCommon.IeDriverDirectory);
                    break;
                case BrowserType.Chrome:
                    // Full size for Chrome browser window.
                    driver = new ChromeDriver(CzCommon.ChromeDriverDirectory);
                    driver.Manage().Window.Maximize();
                    break;
                case BrowserType.Safari:
                    throw new Exception("There is no support for Safari Webdriver yet.");
            }
        }

        // Creates an instance of remote webdriver accordingly to assigned browser.
        // Use Selenium RC server on remote machine for this type of webdriver.
        private void StartRemotely(string remoteAddress)
        {
            DesiredCapabilities capabilities = null;
            Uri remoteAddressUri = null;

            if (!Uri.IsWellFormedUriString(remoteAddress, UriKind.RelativeOrAbsolute))
            {
                throw new UriFormatException("Invalid Remote Address URI.");
            }

            remoteAddressUri = new Uri(remoteAddress);
            CorrectRemoteAddress(ref remoteAddressUri);

            switch (browser)
            {
                case BrowserType.Firefox:
                    capabilities = DesiredCapabilities.Firefox();
                    break;
                case BrowserType.InternetExplorer:
                    capabilities = DesiredCapabilities.InternetExplorer();
                    break;
                case BrowserType.Chrome:
                    capabilities = DesiredCapabilities.Chrome();
                    break;
                case BrowserType.Safari:
                    // TODO: so, probably it works.
                    throw new Exception("There is no support for Safari Webdriver yet.");
            }

            driver = new RemoteWebDriver(remoteAddressUri, capabilities);
        }

        // Stops all instances of existent drivers and clear dictionary.
        // This method is called once in ClassCleanup() method of tests.
        public static void Stop()
        {
            if (browsers.Count != 0)
            {
                foreach (var pair in browsers)
                {
                    pair.Value.Quit();
                }
                browsers.Clear();
            }
        }

        #endregion Main Methods

        #region Auxiliary Methods

        protected double ExecuteScriptGetNumber(string script)
        {
            return Convert.ToDouble((Driver as IJavaScriptExecutor).ExecuteScript(script));
        }

        protected Dictionary<string, object> ExecuteScriptGetJson(string script)
        {
            return (Driver as IJavaScriptExecutor).ExecuteScript(script) as Dictionary<string, object>;
        }

        protected ReadOnlyCollection<object> ExecuteScriptGetArray(string script)
        {
            return (Driver as IJavaScriptExecutor).ExecuteScript(script) as ReadOnlyCollection<object>;
        }

        protected object ExecuteScript(string script)
        {
            return (Driver as IJavaScriptExecutor).ExecuteScript(script);
        }

        // Checks, whether this URI contents port and "/wb/hub/" path and correct it if not.
        private static void CorrectRemoteAddress(ref Uri remoteAddress)
        {
            if (remoteAddress.PathAndQuery != CzCommon.RCDefaultPath)
            {
                StringBuilder correctedUri = new StringBuilder(remoteAddress.GetLeftPart(UriPartial.Scheme));
                correctedUri.Append(remoteAddress.Host).Append(':');

                if (remoteAddress.IsDefaultPort)
                {
                    correctedUri.Append(CzCommon.RCDefaultPort);
                }
                else
                {
                    correctedUri.Append(remoteAddress.Port);
                }

                correctedUri.Append(CzCommon.RCDefaultPath);
                remoteAddress = new Uri(correctedUri.ToString());
            }
        }

        #endregion Auxiliary Private Methods
    }
}
