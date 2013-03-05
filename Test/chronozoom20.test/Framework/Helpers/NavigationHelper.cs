using Framework.UserActions;
using OpenQA.Selenium;

namespace Framework.Helpers
{
    public class NavigationHelper : DependentActions
    {
        public void OpenHomePage()
        {
            OpenUrl(Configuration.BaseUrl);
        }

        public void OpenExhibitEukaryoticCells()
        {
            Logger.Log("<-");
            OpenLifePage();
            NavigateToProterozoic();
            ExecuteJavaScript("goToSearchResult('e121')");
            WaitAnimation();
            Logger.Log("->");
        }

        public void NavigateToCosmos()
        {
            Logger.Log("<-");
            Click(By.Id("cosmos_rect"));
            WaitAnimation();
            //Logger.Log("->");
        }

        public void OpenLifePage()
        {
            Logger.Log("<-");
            Click(By.Id("life_rect"));
            Logger.Log("->");
        } 
        
        public void OpenHumanityPage()
        {
            Logger.Log("<-");
            Click(By.Id("human_rect"));
            Logger.Log("->");
        }

        private void NavigateToProterozoic()
        {
            Logger.Log("<-");
            ExecuteJavaScript("goToSearchResult('t308')");
            Logger.Log("->");
        }


    }
}