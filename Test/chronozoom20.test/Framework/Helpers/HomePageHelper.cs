using System;
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
            MoveToElementAndClick(By.Id("welcomeScreenCloseButton"));
            WaitCondition(()=>Convert.ToBoolean(GetJavaScriptExecutionResult("visReg != undefined")),60);
        }

        public string GetEukaryoticCellsDescription()
        {
            _manager.GetNavigationHelper().OpenExhibitEukaryoticCells();
            WaitForElementIsDisplayed(By.XPath("//*[@id='vc']/*[@class='contentItemDescription']/div"));
            return GetText(By.XPath("//*[@id='vc']/*[@class='contentItemDescription']/div"));
        }

        public void OpenLifeTimeLine()
        {
            _manager.GetNavigationHelper().OpenLifePage();
            Logger.Log("Life page opened");
        }

        public string GetLastBreadcrumbs()
        {
            Sleep(5);
            var result = GetText(By.XPath("//*[@id='breadCrumbsTable']/*/tr/td[last()]/div"));
            Logger.Log(result);
            return result;
        }
    }
}