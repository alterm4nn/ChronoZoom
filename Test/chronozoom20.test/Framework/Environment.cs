using System;
using Framework.Constants;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.IE;
using OpenQA.Selenium.Remote;
using OpenQA.Selenium.Safari;

namespace Framework
{
    public class Environment
    {
        private static IWebDriver _driver;
        private readonly DesiredCapabilities _capability;
        readonly string _browserName = Configuration.BrowserName;
        readonly bool _isUsingGrid = Configuration.IsUsingGrid;

        internal Environment()
        {
            string browserVersion = Configuration.BrowserVersion;
            string platform = Configuration.Platform;
            _capability = new DesiredCapabilities(_browserName, browserVersion, new Platform(NormalizePlatformName(platform)));
            Logger.Log("[browser: " + _browserName + "; version: " + browserVersion + "; platform: " + platform + "; isUsingGrid: " + _isUsingGrid + "]", LogType.Delimiter);
            IoC.Initialize(new UnityDependencyResolver());
        }

        public void StartDriver()
        {
            var chromeOptions = new ChromeOptions();
            chromeOptions.AddArguments("--start-maximized");
            switch (_browserName)
            {
                case BrowserNames.Chrome:

                    if (!_isUsingGrid)
                    {
                        _driver = new ChromeDriver(chromeOptions);
                    }
                    else
                    {
                        _capability.SetCapability(ChromeOptions.Capability, chromeOptions);
                    }
                    break;
                case BrowserNames.Firefox:
                    if (!_isUsingGrid)
                    {
                        _driver = new FirefoxDriver(new FirefoxProfile{EnableNativeEvents = true});
                        _driver.Manage().Window.Maximize();
                    }
                    break;
                case BrowserNames.InternetExplorer:
                    if (!_isUsingGrid)
                    {
                        var ie = new InternetExplorerOptions
                        {
                            EnableNativeEvents = true
                        };
                        _driver = new InternetExplorerDriver(ie);
                        _driver.Manage().Window.Maximize();
                    }
                    break;
                case BrowserNames.Safari:
                    if (!_isUsingGrid)
                    {
                        _driver = new SafariDriver();
                        _driver.Manage().Window.Maximize();
                    }
                    break;
                default:
                    throw new NotSupportedException("Unsupported browser.");
            }
            if (_isUsingGrid)
            {
                _capability.IsJavaScriptEnabled = true;
                _driver = new ScreenShotRemoteWebDriver(new Uri(Configuration.HubUrl), _capability);
                //_driver = new RemoteWebDriver(new Uri("http://192.168.50.39:3001/wd/hub"), DesiredCapabilities.IPad()); //Not implemented yet; only for ipad testing
                _driver.Manage().Window.Maximize();

            }
            SetImplicitWait(Configuration.ImplicitWait);
        }

        public IWebDriver GetDriver()
        {
            if (_driver == null)
            {
                StartDriver();
            }
            return _driver;
        }

        internal void RestartDriver()
        {
            StopDriver();
            StartDriver();
        }

        internal void StopDriver()
        {
            _driver.Quit();
            _driver = null;
        }

        internal IJavaScriptExecutor GetJavaScriptExecutor()
        {
            return (IJavaScriptExecutor)_driver;
        }

        internal void SetImplicitWait(int seconds)
        {
            _driver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(seconds));
        }

        private static PlatformType NormalizePlatformName(string platformname)
        {
            var lowerPlatformName = platformname.ToLower();
            var result = new PlatformType();
            if (lowerPlatformName.Contains("xp"))
            {
                result = PlatformType.XP;
            }
            if (lowerPlatformName.Contains("vista"))
            {
                result = PlatformType.Vista;
            }
            if (lowerPlatformName.Contains("mac"))
            {
                result = PlatformType.Mac;
            }
            return result;
        }
    }
}