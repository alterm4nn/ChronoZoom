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

        public string GetEukaryoticCellsDescription()
        {
            Logger.Log("<-");
            _manager.GetNavigationHelper().OpenExhibitEukaryoticCells();
            Logger.Log("ExhibitEukaryotic Cell is opened");
            string description = GetText(By.XPath("//*[@id='vc']/*[@class='contentItemDescription']/div"));
            Logger.Log("-> description: " + description);
            return description;
        }

        public void OpenLifeTimeline()
        {
            Logger.Log("<-");
            _manager.GetNavigationHelper().OpenLifePage();
            WaitForElementIsDisplayed(By.Id("bc_link_t66"));
            WaitAnimation();
            Logger.Log("->");
        }

        public void OpenHumanityTimeline()
        {
            Logger.Log("<-");
            _manager.GetNavigationHelper().OpenHumanityPage();
            WaitForElementIsDisplayed(By.Id("bc_link_t161"));
            WaitAnimation();
            Logger.Log("->");
        }

        public void OpenBceCeArea()
        {
            Logger.Log("<-");
            NavigateBceToCeEra();
            Logger.Log("->");
        }

        public void OpenRomanHistoryTimeline()
        {
            Logger.Log("<-");
            _manager.GetNavigationHelper().NavigateToRomanHistoryTimeline();
            WaitForElementIsDisplayed(By.Id("bc_link_t44"));
            WaitAnimation();
            Logger.Log("->");
        }

        public string GetLastBreadcrumbs()
        {
            Logger.Log("<-");
            WaitAnimation();
            string result = GetText(By.XPath("//*[@id='breadCrumbsTable']/*/tr/td[last()]/div"));
            Logger.Log("-> Last Breadcrumbs: " + result);
            return result;
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

        public void OpenMrcLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@title='Microsoft Research']"));
            Logger.Log("->");
        }

        public void OpenUcBerkelyLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@title='University of California Berkeley Department of Earth and Planetary Science']"));
            Logger.Log("->");
        }

        public void OpenMsuLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@title='Moscow State University']"));
            Logger.Log("->");
        }

        public string GetTitle()
        {
            Logger.Log("<-");
            string title = GetPageTitle();
            Logger.Log("-> title: " + title);
            return title;
        }


        public void OpenTakeOurSurveyLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='footer-right']/a[1]"));
            Logger.Log("->");
        }

        public void OpenReportAProblemLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='footer-right']/a[2]"));
            Logger.Log("->");
        }

        public void OpenBehindTheScenesLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='footer-right']/a[3]"));
            Logger.Log("->");
        }

        public void OpenTermsOfUseLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='footer-right']/a[4]"));
            Logger.Log("->");
        }

        public void OpenPrivacyLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='footer-right']/a[5]"));
            Logger.Log("->");
        }

        public void OpenTrademarkLink()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='footer-right']/a[6]"));
            Logger.Log("->");
        }

        public void OpenLoginPage()
        {
            Logger.Log("<-");
            Click(By.Id("login-panel"));
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
            Sleep(1);
            ExecuteJavaScript(string.Format("clear({0})",Javascripts.Cosmos));
            Logger.Log("-> result: ");
        }

        public void WaitWhileHomePageIsLoaded()
        {
            WaitCondition(() => Convert.ToBoolean(GetJavaScriptExecutionResult("CZ.Common.cosmosVisible != undefined")), 60);
        }
    }
}