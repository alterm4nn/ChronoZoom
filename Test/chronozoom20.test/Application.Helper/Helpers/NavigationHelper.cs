using System;
using Application.Driver;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class NavigationHelper : DependentActions
    {
        public void OpenHomePage()
        {
            OpenUrl(Configuration.BaseUrl);
        }  
        
        public void OpenSandboxPage()
        {
            OpenUrl(Configuration.BaseUrl + "/sandbox/sandbox/");
        }

        public void OpenExhibitEukaryoticCells()
        {
            Logger.Log("<-");
            OpenLifePage();
            NavigateToProterozoic();
            ExecuteJavaScript("CZ.Search.goToSearchResult('e51b29786-5f4e-42a8-85b2-5d3b0930ae35')");
            WaitAnimation();
            Logger.Log("->");
        }

        public void NavigateToCosmos()
        {
            Logger.Log("<-");
            OpenRegime(By.Id("regime-link-cosmos"));
            WaitAnimation();
            Logger.Log("->");
        }

        public void OpenLifePage()
        {
            Logger.Log("<-");
            OpenRegime(By.Id("regime-link-life"));
            Logger.Log("->");
        } 
        
        public void OpenHumanityPage()
        {
            Logger.Log("<-");
            OpenRegime(By.Id("regime-link-humanity"));
            Logger.Log("->");
        }

        public void NavigateToRomanHistoryTimeline()
        {
            Logger.Log("<-");
            ExecuteJavaScript("CZ.Search.goToSearchResult('t11e808ae-e25c-44a2-adca-278819b60462')");
            Logger.Log("->");
        }

        private void NavigateToProterozoic()
        {
            Logger.Log("<-");
            ExecuteJavaScript("CZ.Search.goToSearchResult('t7d44a667-7247-4450-85fb-4dc968774dd8')");
            Logger.Log("->");
        }

        private void OpenRegime(By by)
        {
            WaitForElementEnabled(by);
            Click(by);
        }
    }
}