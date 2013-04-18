using System;
using System.Collections.ObjectModel;
using System.Net;
using System.Threading;
using Application.Driver.Extensions;
using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;
using Cookie = OpenQA.Selenium.Cookie;

namespace Application.Driver.UserActions
{
    public class CommonActions
    {
        private readonly WebDriverWait _wait;
        private IWebDriver _webDriver;
        public IWebDriver WebDriver
        {
            get
            {
                _webDriver = DriverManager.GetEnvironmentInstance().GetDriver();
                return _webDriver;
            }
            set { _webDriver = value; }
        }
        private IJavaScriptExecutor _executor;
        public IJavaScriptExecutor Executor
        {
            get { _executor = DriverManager.GetEnvironmentInstance().GetJavaScriptExecutor(); return _executor; }
            set { _executor = value; }
        }

        private Actions _builder;
        protected Actions Builder
        {
            get { _builder = new Actions(WebDriver);
                return _builder;
            }
        }

        protected CommonActions()
        {
            _wait = Wait(Configuration.ExplicitWait);
        }

        protected WebDriverWait Wait(int seconds)
        {
            return new WebDriverWait(WebDriver, TimeSpan.FromSeconds(seconds));
        }

        protected string GetCurrentUrl()
        {
            return WebDriver.Url;
        }

        protected IWebElement FindElement(By by)
        {
            try
            {
                IWebElement element = WebDriver.FindElement(by);
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
            return WebDriver.FindElements(by);
        }

        protected void Click(By by)
        {
            FindElement(by).Click();
        }

        protected void Select(By by, String text)
        {
            if (String.IsNullOrEmpty(text))
                throw new ArgumentException("text");
            new SelectElement(FindElement(by)).SelectByText(text);
        }

        protected void OpenUrl(string url)
        {
            WebDriver.Navigate().GoToUrl(url);
        }

        protected string GetText(By by)
        {
            return FindElement(by).Text;
        }

        protected string GetPageTitle()
        {
            return WebDriver.Title;
        }

        protected ReadOnlyCollection<Cookie> GetAllCookies()
        {
            return WebDriver.Manage().Cookies.AllCookies;
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
                Executor.ExecuteScript(script);
            }
            else
            {
                Executor.ExecuteScript(script, obj);
            }
        }


        protected void ClickByJavaScript(By by)
        {
            object[] objects = { FindElement(by) };
            ExecuteJavaScript("arguments[0].click()", objects);
        }

        protected string GetJavaScriptExecutionResult(string script)
        {
            return Executor.ExecuteScript("return " + script).ToString();
        }

        protected bool IsElementExists(By by)
        {
            try
            {
                DriverManager.GetEnvironmentInstance().SetImplicitWait(0);
                return FindElements(by).Count > 0;
            }
            finally
            {
                DriverManager.GetEnvironmentInstance().SetImplicitWait(Configuration.ImplicitWait);
            }
        }

        protected void Refresh()
        {
            WebDriver.Navigate().Refresh();
        }

        protected static void InvokeChain(Func<Actions> chain)
        {
            chain.Invoke().Build().Perform();
        }

        private bool AreEqualViewports()
        {
            string v1 = GetJavaScriptExecutionResult("$('#vc').virtualCanvas('getViewport')");
            Sleep(2);
            string v2 = GetJavaScriptExecutionResult("$('#vc').virtualCanvas('getViewport')");
            return v1 == v2;
        }

        protected void ClickElementAndType(By by, string text)
        {
            IWebElement element = FindElement(by);
            InvokeChain(() => Builder.MoveToElement(element).Click().SendKeys(text));
        }

        protected void SwitchToFrame(By by)
        {
            IWebElement frame = FindElement(by);
            WebDriver.SwitchTo().Frame(frame);
        }

        protected void SwitchToDefaultContent()
        {
            WebDriver.SwitchTo().DefaultContent();
        }

        protected void SwitchToWindow(string name)
        {
            foreach (string item in WebDriver.WindowHandles)
            {
                if (WebDriver.SwitchTo().Window(item).Title.Contains(name))
                {
                    WebDriver.SwitchTo().Window(item);
                    break;
                }
            }
        }

        protected string GetCurrentWindowTitle()
        {
            return WebDriver.Title;
        }

        protected void MoveToElementAndClick(By by)
        {
            IWebElement element = FindElement(by);
            InvokeChain(() => Builder.MoveToElement(element).Click(element));
        }
        
        protected void MoveToElementCoordinates(By by, int x, int y)
        {
            IWebElement element = FindElement(by);
            InvokeChain(() => Builder.MoveToElement(element,x,y));
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
            WebDriver.Close();
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
                handles = WebDriver.WindowHandles;
            }
            catch (Exception)
            {
                throw new Exception("Can not get browser handles");
            }
            return handles;
        }

        protected string GetCurrentHandle()
        {
            return WebDriver.CurrentWindowHandle;
        }

        protected void WaitAnimation()
        {
            WaitCondition(AreEqualViewports, 60);
        }


        protected void MoveToElementAndDrugAndDrop(By by, int x = 0, int y = 0)
        {
            IWebElement element = FindElement(by);
            InvokeChain(() => Builder.MoveToElement(element).DragAndDropToOffset(element, 50, 50));
        } 
        
        protected void AcceptAlert()
        {
            WebDriver.SwitchTo().Alert().Accept();
        }
    }
}