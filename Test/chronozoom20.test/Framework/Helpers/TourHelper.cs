using System;
using Framework.UserActions;
using OpenQA.Selenium;

namespace Framework.Helpers
{
    public class TourHelper : DependentActions
    {

        public void OpenToursListWindow()
        {
            Click(By.Id("tours_index"));
        }

        public void SelectMayanHistoryTour()
        {
            SelectTour("Mayan History");
        }

        public void PauseTour()
        {
            Click(By.Id("tour_playpause"));
        }

        public void ResumeTour()
        {
            PauseTour();
        }

        private void SelectTour(string tour)
        {
            string xpath = String.Format("//*[@id='tours-content']/div[2]/*[text()='{0}']", tour);
            Click(By.XPath(xpath));
            WaitForElementIsDisplayed(By.Id("bc_link_t554"));
        }
    }
}