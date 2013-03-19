using System;
using System.Globalization;
using Framework.UserActions;
using OpenQA.Selenium;

namespace Framework.Helpers
{
    public class HomePageHelper : DependentActions
    {
        private readonly ApplicationManager _manager;

        public HomePageHelper()
        {
            _manager = new ApplicationManager();
        }
        public void CloseWelcomePopup()
        {
            Logger.Log("<-");
            ClickCloseButton();
            WaitCondition(()=>Convert.ToBoolean(GetJavaScriptExecutionResult("visReg != undefined")),60);
            Logger.Log("->");
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
            string targetDate = (GetCurrentTimeInYearFormat() - 1).ToString(CultureInfo.InvariantCulture);
            Logger.Log("-- targetDate: " + targetDate);
            string script = String.Format("controller.moveToVisible(new VisibleRegion2d(-{0},222893683.28948474,0.0009286813988062588),false)", targetDate);
            Logger.Log("-- script: " + script);
            ExecuteJavaScript(script);
            WaitForElementIsDisplayed(By.Id("bc_link_t550"));
            WaitAnimation();
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
            IWebElement timescale = FindElement(By.Id("axis"));
            MoveToElementAndClick(By.Id("axis"));
        }

        public void MoveMouseToLeft()
        {
            IWebElement timescale = FindElement(By.Id("axis"));
            double size = timescale.Size.Width;
            MoveToElementCoordinates(By.Id("axis"), (int)Math.Round(size/4), 0);
            
        }

        private double GetCurrentTimeInYearFormat()
        {
            DateTime now = DateTime.Now;
            var yearFirstDay = new DateTime(now.Year, 1, 1);
            double secondsInThisYear = (yearFirstDay.AddYears(1).AddSeconds(-1) - yearFirstDay).TotalSeconds;
            double secondsFromFirstDay = (now - yearFirstDay).TotalSeconds;
            double currentTimeInYearFormat = now.Year + (secondsFromFirstDay / secondsInThisYear);
            return currentTimeInYearFormat;
        }
    }
}