using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Drawing.Imaging;
using System.Net;
using System.Reflection;
using System.Threading;
using System.Windows.Forms;
using Framework.Extensions;
using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;

namespace Framework.UserActions
{
    public class CommonActions
    {
        private readonly IWebDriver _driver;
        private readonly WebDriverWait _wait;
        private readonly IJavaScriptExecutor _executor;
        private readonly Actions _builder;
        private readonly Environment _environment;

        protected Actions Builder
        {
            get { return _builder; }
        }

        protected CommonActions()
        {
            _driver = ApplicationManager.GetInstance().GetEnvironment().GetDriver();
            _environment = ApplicationManager.GetInstance().GetEnvironment();
            _builder = new Actions(_driver);
            _wait = Wait(Configuration.ExplicitWait);
            _executor = ApplicationManager.GetInstance().GetEnvironment().GetJavaScriptExecutor();
        }

        protected WebDriverWait Wait(int seconds)
        {
            return new WebDriverWait(_driver, TimeSpan.FromSeconds(seconds));
        }

        protected string GetCurrentUrl()
        {
            return _driver.Url;
        }

        protected IWebElement FindElement(By by)
        {
            try
            {
                IWebElement element = _driver.FindElement(by);
                element.Highlight();
                return element;
            }
            catch (Exception ex)
            {
                throw new NoSuchElementException("Can not find element " + by, ex);
            }
        }

        protected ReadOnlyCollection<IWebElement> FindElements(By by)
        {
            return _driver.FindElements(by);
        }

        protected void Click(By by)
        {
            FindElement(by).Click();
        }

        protected void OpenUrl(string url)
        {
            _driver.Navigate().GoToUrl(url);
        }

        protected string GetText(By by)
        {
            return FindElement(by).Text;
        }

        protected string GetPageTitle()
        {
            return _driver.Title;
        }

        protected int GetItemsCount(By by)
        {
            try
            {
                return FindElements(by).Count;
            }
            catch (Exception)
            {
                return 0;
            }
        }

        protected bool IsElementDisplayed(By by)
        {
            return FindElement(by).Displayed;
        }

        protected bool IsElementEnabled(By by)
        {
            return FindElement(by).Enabled;
        }

        protected void WaitForElementIsDisplayed(By by)
        {
            _wait.Until(w => IsElementDisplayed(by));
        }

        protected void WaitForElementEnabled(By by)
        {
            _wait.Until(w => IsElementEnabled(by));
        }

        protected void WaitForElementIsExisted(By by)
        {
            _wait.Until(w => IsElementExists(by));
        }

        protected void TypeText(By by, string text)
        {
            IWebElement element = FindElement(by);
            element.Clear();
            element.SendKeys(text);
        }

        protected void WaitCondition(Func<bool> condition, int timeoutInSeconds, int pauseInSeconds = 1)
        {
            var finish = DateTime.Now.AddSeconds(timeoutInSeconds);
            IWebElement element = FindElement(By.TagName("body"));
            string color = element.GetPreviousAndChangeBackgroundColor("yellow");
            while ((DateTime.Now < finish) && !condition.Invoke())
                Sleep(pauseInSeconds);
            element.ChangeBackgroundColor(color);
        }

        protected void ExecuteJavaScript(string script, object[] obj = null)
        {
            if (obj == null)
            {
                _executor.ExecuteScript(script);
            }
            else
            {
                _executor.ExecuteScript(script, obj);
            }
        }


        protected void ClickByJavaScript(By by)
        {
            object[] objects = { FindElement(by) };
            ExecuteJavaScript("arguments[0].click()", objects);
        }

        protected string GetJavaScriptExecutionResult(string script)
        {
            return _executor.ExecuteScript("return " + script).ToString();
        }

        protected bool IsElementExists(By by)
        {
            try
            {
                _environment.SetImplicitWait(0);
                return FindElements(by).Count > 0;
            }
            finally
            {
                _environment.SetImplicitWait(Configuration.ImplicitWait);
            }
        }

        protected void Refresh()
        {
            _driver.Navigate().Refresh();
        }

        private static void InvokeChain(Func<Actions> chain)
        {
            chain.Invoke().Build().Perform();
        }

        protected void ClickElementAndType(By by, string text)
        {
            IWebElement element = FindElement(by);
            InvokeChain(() => _builder.MoveToElement(element).Click().SendKeys(text));
        }

        protected void SwitchToFrame(By by)
        {
            IWebElement frame = FindElement(by);
            _driver.SwitchTo().Frame(frame);
        }

        protected void SwitchToDefaultContent()
        {
            _driver.SwitchTo().DefaultContent();
        }

        protected void SwitchToWindow(string name)
        {
            foreach (string item in _driver.WindowHandles)
            {
                if (_driver.SwitchTo().Window(item).Title.Contains(name))
                {
                    _driver.SwitchTo().Window(item);
                    break;
                }
            }
        }

        protected string GetCurrentWindowTitle()
        {
            return _driver.Title;
        }

        protected void PressCtrlAndSpace()
        {
            SendKeys.SendWait("^( )");
        }

        protected void PressArrowDown()
        {
            SendKeys.SendWait("{DOWN}");
        }

        protected void MoveToElementAndClick(By by)
        {
            IWebElement element = FindElement(by);
            InvokeChain(() => _builder.MoveToElement(element).Click(element));
        }

        protected string GetAttributeValue(By by, string attributeName)
        {
            return FindElement(by).GetAttribute(attributeName);
        }

        protected void WaitAjaxComplete(int timeoutInSeconds)
        {
            WaitCondition(() => GetJavaScriptExecutionResult("window.jQuery.active") == "0", timeoutInSeconds);
        }

        protected bool IsCurrentPageAvailable()
        {
            string url = GetCurrentUrl();
            return IsPageAvailable(url);
        }

        protected bool IsPageAvailable(string url)
        {
            Logger.Log("url: " + url);
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.CookieContainer = new CookieContainer();
            request.Proxy = null;
            request.AllowAutoRedirect = false;

            HttpWebResponse httpWebResponse;

            try
            {
                httpWebResponse = (HttpWebResponse)request.GetResponse();
            }
            catch (Exception)
            {
                throw new Exception(string.Format("No response from url: {0}", url));
            }

            bool result = (httpWebResponse.StatusCode == HttpStatusCode.Found) || (httpWebResponse.StatusCode == HttpStatusCode.OK) || (httpWebResponse.StatusCode == HttpStatusCode.MovedPermanently);
            Logger.Log("result: " + result.ToString());

            httpWebResponse.Close();
            request.Abort();
            return result;
        }

        protected void CloseCurrentWindow()
        {
            _driver.Close();
        }

        protected void Sleep(int sec)
        {
            Thread.Sleep(TimeSpan.FromSeconds(sec));
        }

        protected ReadOnlyCollection<string> GetHandles()
        {
            ReadOnlyCollection<string> handles;
            try
            {
                handles = _driver.WindowHandles;
            }
            catch (Exception)
            {
                throw new Exception("Can not get browser handles");
            }
            return handles;
        }

        protected string GetCurrentHandle()
        {
            return _driver.CurrentWindowHandle;
        }

    }
}