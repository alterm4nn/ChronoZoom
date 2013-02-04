using System;
using Framework.UserActions;
using OpenQA.Selenium;

namespace Framework.Helpers
{
    public class HomePageHelper : DependentActions
    {
        private ApplicationManager _manager;

        public HomePageHelper()
        {
            _manager = new ApplicationManager();
            
        }
        public void CloseWelcomePopup()
        {
            MoveToElementAndClick(By.Id("welcomeScreenCloseButton"));
            WaitCondition(()=>Convert.ToBoolean(GetJavaScriptExecutionResult("visReg != undefined")),60);
        }

        public string GetEukaryoticCellsDescription()
        {
            _manager.GetNavigationHelper().OpenExhibitEukaryoticCells();
            Logger.Log("ExhibitEukaryotic Cell is opened");
            WaitForElementIsDisplayed(By.XPath("//*[@id='vc']/*[@class='contentItemDescription']/div"));
            return GetText(By.XPath("//*[@id='vc']/*[@class='contentItemDescription']/div"));
        }

        public void OpenLifeTimeLine()
        {
            _manager.GetNavigationHelper().OpenLifePage();
            WaitAnimation();
            Logger.Log("Life page opened");
        }

        public string GetLastBreadcrumbs()
        {
            Logger.Log("<-");
            WaitAnimation();
            var result = GetText(By.XPath("//*[@id='breadCrumbsTable']/*/tr/td[last()]/div"));
            Logger.Log("-> result: " + result);
            return result;
        }
    }
}