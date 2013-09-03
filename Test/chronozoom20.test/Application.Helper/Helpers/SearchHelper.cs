using Application.Driver;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class SearchHelper : DependentActions
    {
        public void InitSearchWindow()
        {
            Logger.Log("<-");
            Click(By.CssSelector(".header-icon.search-icon"));
            Logger.Log("->");
        }

        public void SearchMayanHistoryTimeline()
        {
            Logger.Log("<-");
            TypeSearchString("Mayan");
            WaitSearchProcess();
            NavigateToSearchResult("Mayan History");
            WaitNavigationToMayan();
            Logger.Log("->");
        }

        public void SearchEvidenceEarliestStoneToolsExhibit()
        {
            Logger.Log("<-");
            TypeSearchString("Stone Tools");
            WaitSearchProcess();
            NavigateToSearchResult("Evidence of Earliest Stone Tools");
            WaitNavigationToGenusHome();
            Logger.Log("->");
        }

        public void Search_Take_Our_Survey_Artifact()
        {
            Logger.Log("<-");
            TypeSearchString("Take our survey");
            WaitSearchProcess();
            NavigateToSearchResult("Take our Survey");
            WaitNavigationToTakeOurSurveyItem();
            Logger.Log("->");
        }

        private void TypeSearchString(string searchText)
        {
            Logger.Log("<- text: " + searchText);
            TypeText(By.CssSelector("input[type='search']"), searchText);
            Logger.Log("->");
        }

        private void WaitSearchProcess()
        {
            Logger.Log("<-");
            WaitForElementIsNotDisplayed(By.ClassName("cz-form-progress-bar"));
            Logger.Log("->");
        }

        private void NavigateToSearchResult(string name)
        {
            Logger.Log("<- result: " + name);
            MoveToElementAndClick(By.XPath(string.Format("//*[@class='cz-form-search-result' and text()='{0}']", name)));
            Logger.Log("->");
        }

        private void WaitNavigationToMayan()
        {
            Logger.Log("<-");
            WaitForElementIsDisplayed(By.XPath("//*[@id='breadcrumbs-table']//*[text()='Mayan History']"));
            WaitAnimation();
            Logger.Log("->");
        }        
        
        private void WaitNavigationToGenusHome()
        {
            Logger.Log("<-");
            WaitForElementIsDisplayed(By.XPath("//*[@id='breadcrumbs-table']//*[text()='Genus Homo']"));
            WaitAnimation();
            Logger.Log("->");
        }    
        
        private void WaitNavigationToTakeOurSurveyItem()
        {
            Logger.Log("<-");
            WaitForElementIsDisplayed(By.XPath("//*[@id='breadcrumbs-table']//*[text()='ChronoZoom Project']"));
            WaitAnimation();
            WaitForElementIsDisplayed(By.XPath("//*[contains(text(),'ChronoZoom is made by the academic community')]"));
            Logger.Log("->");
        }
    }
}