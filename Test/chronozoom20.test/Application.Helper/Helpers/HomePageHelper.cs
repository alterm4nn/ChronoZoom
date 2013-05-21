using System;
using Application.Driver;
using Application.Helper.Constants;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class HomePageHelper : DependentActions
    {
        private readonly HelperManager _manager;

        public HomePageHelper()
        {
            _manager = new HelperManager();
        }

        public void OpenPage()
        {
            _manager.GetNavigationHelper().OpenHomePage();
            WaitWhileHomePageIsLoaded();
        }

        public void OpenSandboxPage()
        {
            _manager.GetNavigationHelper().OpenSandboxPage();
            WaitWhileHomePageIsLoaded();
        }

        public string GetEukaryoticCellsDescription()
        {
            Logger.Log("<-");
            _manager.GetNavigationHelper().OpenExhibitEukaryoticCells();
            Logger.Log("ExhibitEukaryotic Cell is opened");
            string description = _manager.GetExhibitHelper().GetContentItemDescription();
            Logger.Log("-> description: " + description);
            return description;
        }

        public void OpenLifeTimeline()
        {
            Logger.Log("<-");
            _manager.GetNavigationHelper().OpenLifePage();
            WaitAnimation();
            WaitForElementIsDisplayed(By.XPath("//*[@id='breadcrumbs-table']//*[text()='Life']"));
            Logger.Log("->");
        }

        public void OpenHumanityTimeline()
        {
            Logger.Log("<-");
            _manager.GetNavigationHelper().OpenHumanityPage();
            WaitForElementIsDisplayed(By.XPath("//*[@id='breadcrumbs-table']//*[text()='Humanity']"));
            WaitAnimation();
            Logger.Log("->");
        }


        public void OpenCosmosTimeline()
        {
            Logger.Log("<-");
            _manager.GetNavigationHelper().NavigateToCosmos();
            WaitCondition(() => GetItemsCount(By.XPath("//*[@id='breadcrumbs-table']//td")) == 1, 60);
            Logger.Log("->");
        }

        public void OpenBceCeArea()
        {
            Logger.Log("<-");
            NavigateBceToCeEra();
            WaitForElementIsDisplayed(By.XPath("//*[@id='breadcrumbs-table']//*[text()='Geologic Time Scale']"));
            WaitForElementIsDisplayed(By.XPath("//*[@class='cz-timescale-label' and contains(@style,'display: block;') and text()='1 BCE']"));
            Logger.Log("->");
        }

        public void OpenRomanHistoryTimeline()
        {
            Logger.Log("<-");
            _manager.GetNavigationHelper().NavigateToRomanHistoryTimeline();
            WaitForElementIsDisplayed(By.XPath("//*[@id='breadcrumbs-table']//*[text()='Roman History']"));
            WaitAnimation();
            Logger.Log("->");
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

        public void OpenHelpLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='footer']/*/*/*/a[text()='Help']"));
            Logger.Log("->");
        }

        public void OpenFeedbackLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='footer']/*/*/*/a[text()='Feedback']"));
            Logger.Log("->");
        }

        public void OpenNoticeLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='footer']/*/*/*/a[text()='Notices']"));
            Logger.Log("->");
        }

        public void OpenDevelopersLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='footer']/*/*/*/a[text()='Developers']"));
            Logger.Log("->");
        }

        public void OpenLoginPage()
        {
            Logger.Log("<-");
            Click(By.Id("login-button"));
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

        public string GetLastBreadcrumbs()
        {
            Logger.Log("<-");
            WaitAnimation();
            string result = GetText(By.XPath("//*[@id='breadcrumbs-table']/*/tr/td[last()]/div"));
            Logger.Log("-> Last Breadcrumbs: " + result);
            return result;
        }

    }
}