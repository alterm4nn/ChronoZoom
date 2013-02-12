using System;
using Framework.UserActions;
using OpenQA.Selenium;

namespace Framework.Helpers
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
            WaitForElementIsDisplayed(By.Id("bc_link_t554"));
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
            string xpath = String.Format("//*[@id='tours-content']/div[2]/*[text()='{0}']", tour);
            Click(By.XPath(xpath));
        }
    }
}