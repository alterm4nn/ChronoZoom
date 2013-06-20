using System;
using Application.Driver;
using Application.Helper.Constants;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class HomePageHelper : DependentActions
    {
        public void OpenPage()
        {
            HelperManager<NavigationHelper>.GetInstance.OpenHomePage();
            WaitWhileHomePageIsLoaded();
        }

        public void OpenSandboxPage()
        {
            HelperManager<NavigationHelper>.GetInstance.OpenSandboxPage();
            WaitWhileHomePageIsLoaded();
        }
        
        public void MoveMouseToCenter()
        {
            Logger.Log("<-");
            MoveToElementAndClick(By.Id("axis"));
            Logger.Log("->");
        }

        public void MoveMouseToLeft()
        {
            Logger.Log("<-");
            IWebElement timescale = FindElement(By.Id("axis"));
            double size = timescale.Size.Width;
            MoveToElementCoordinates(By.Id("axis"), (int)Math.Round(size / 4), 0);
            Logger.Log("->");
        }

        public string GetTitle()
        {
            Logger.Log("<-");
            string title = GetPageTitle();
            Logger.Log("-> title: " + title);
            return title;
        }
        
        public string GetUrl()
        {
            Logger.Log("<-");
            string url = GetCurrentUrl();
            Logger.Log("-> title: " + url);
            return url;
        }

        public void OpenHelpLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='footer']//a[text()='Help']"));
            Logger.Log("->");
        }

        public void OpenFeedbackLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='footer']//a[text()='Feedback']"));
            Logger.Log("->");
        }

        public void OpenNoticeLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='footer']//a[text()='Notices']"));
            Logger.Log("->");
        }

        public void OpenDevelopersLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='footer']//a[text()='Developers']"));
            Logger.Log("->");
        }

        public void DeleteLastElementLocally(string id)
        {
            Logger.Log("<- id: ");
            string result = GetJavaScriptExecutionResult(string.Format("removeChild({0}.parent,'{1}')", Javascripts.LastCanvasElement, id));
            Logger.Log("-> result: " + result);
        }

        public void DeleteAllElementsLocally()
        {
            Logger.Log("<-");
            ExecuteJavaScript(string.Format("CZ.VCContent.removeChild({0}.parent, {0}.id)", Javascripts.Cosmos));
            Logger.Log("->");
        }

        public void WaitWhileHomePageIsLoaded()
        {
            WaitCondition(() => Convert.ToBoolean(GetJavaScriptExecutionResult("CZ.Common.cosmosVisible != undefined")), 60);
            Sleep(2);
            WaitAjaxComplete(10);
        }
    }
}