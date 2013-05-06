using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class SearchHelper : DependentActions
    {
        public void InitSearchWindow()
        {
            Click(By.Id("search_button"));
        }

        public void TypeSearchString(string searchText)
        {
            TypeText(By.Id("searchTextBox"),searchText);
        }

        public void WaitSearchProcess()
        {
            WaitForElementIsDisplayed(By.Id("loadingImage"));
            WaitForElementIsNotDisplayed(By.Id("loadingImage"));
        }

        public void NavigateToSearchResult(string name)
        {
            MoveToElementAndClick(By.XPath(string.Format("//*[@class='searchResult' and text()='{0}']",name)));
        }


        public void WaitNavigationToMayan()
        {
            WaitForElementIsDisplayed(By.XPath("//*[@id='breadcrumbs-table']//*[text()='Mayan History']"));
            WaitAnimation();
        }

        public string GetLastBreadcrumbsText()
        {
            return GetText(By.XPath("//*[@id='breadcrumbs-table']/*/*/*[last()]/div"));
        }
    }
}