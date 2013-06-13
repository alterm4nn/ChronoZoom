using System;
using Application.Driver;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class TourHelper : DependentActions
    {
        private const string MayanHistoryTourName = "Mayan History";

        public void OpenToursListWindow()
        {
            Logger.Log("<-");
            Click(By.Id("tours_index"));
            Logger.Log("->");
        }

        public void SelectMayanHistoryTour()
        {
            Logger.Log("<-");
            SelectTour(MayanHistoryTourName);
            WaitForElementIsDisplayed(By.XPath("//*[@id='breadcrumbs-table']//*[text()='Mayan History']"));
            Logger.Log("->");
        }

        public void PauseTour()
        {
            Logger.Log("<-");
            Click(By.Id("tour_playpause"));
            Logger.Log("->");
        }

        public void ResumeTour()
        {
            Logger.Log("<-");
            PauseTour();
            Logger.Log("->");
        }

        private void SelectTour(string tour)
        {
            string xpath = String.Format("//*[@id='toursList']//*[text()='{0}']/following-sibling::div[1]", tour);
            Click(By.XPath(xpath));
        }
    }
}