using System;
using System.Threading;
using OpenQA.Selenium;

namespace Application.Driver.Extensions
{
    public static class WebElementExtension
    {
        private static IJavaScriptExecutor _javaScriptExecutor;
        private static DriverManager _driverManager;

        //private static HelperManager ApplicationManager
        //{
        //    get { return ApplicationManager.GetEnvironmentInstance(); }
        //}

        public static IJavaScriptExecutor JavaScriptExecutor
        {
            get { _javaScriptExecutor = DriverManager.GetEnvironmentInstance().GetJavaScriptExecutor(); return _javaScriptExecutor; }
            set { _javaScriptExecutor = value; }
        }

        public static string GetBackgroundColor(this IWebElement element)
        {
            return element.GetCssValue("backgroundColor");
        }

        public static void Highlight(this IWebElement element)
        {
            if (!IsHighlitingOn())
                return;
            string previousColor = element.GetPreviousAndChangeBackgroundColor("red");
            Thread.Sleep(Configuration.HighlightWait);
            element.ChangeBackgroundColor(previousColor);
        }

        public static void HighlightBodyForAction(Action action)
        {
            if (!IsHighlitingOn())
                return;
            var element = DriverManager.GetEnvironmentInstance().GetDriver().FindElement(By.TagName("body"));
            var color = element.GetPreviousAndChangeBackgroundColor("yellow");
            action.Invoke();
            element.ChangeBackgroundColor(color);
        }

        public static string GetPreviousAndChangeBackgroundColor(this IWebElement element, string color)
        {
            string previousColor = GetBackgroundColor(element);
            element.ChangeBackgroundColor(color);
            return previousColor;
        }

        public static void ChangeBackgroundColor(this IWebElement element, string color = "red")
        {
            if (!IsHighlitingOn())
                return;
            JavaScriptExecutor.ExecuteScript("arguments[0].style.backgroundColor = '" + color + "'", element);
        }

        private static bool IsHighlitingOn()
        {
            return Configuration.HasHighliting;
        }
    }
}