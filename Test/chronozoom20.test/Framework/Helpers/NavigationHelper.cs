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
            OpenLifePage();
            NavigateToProterozoic();
            ExecuteJavaScript("goToSearchResult('e121')");
        }

        public void NavigateToCosmos()
        {
            Click(By.Id("bc_link_t55"));
        }

        public void OpenLifePage()
        {
            Click(By.Id("life_rect"));
        }

        private void NavigateToProterozoic()
        {
           ExecuteJavaScript("goToSearchResult('t308')");
        }


    }
}