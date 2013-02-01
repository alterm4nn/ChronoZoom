using System;
using System.Threading;
using OpenQA.Selenium;

namespace Framework.Extensions
{
    public static class WebElementExtension
    {
        private static ApplicationManager App
        {
            get { return ApplicationManager.GetInstance(); }
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
            var element = App.GetEnvironment().GetDriver().FindElement(By.TagName("body"));
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
            IJavaScriptExecutor executor = App.GetEnvironment().GetJavaScriptExecutor();
            executor.ExecuteScript("arguments[0].style.backgroundColor = '" + color + "'", element);
        }

        private static bool IsHighlitingOn()
        {
            return Configuration.HasHighliting;
        }
    }
}