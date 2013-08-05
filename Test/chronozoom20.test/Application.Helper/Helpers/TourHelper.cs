using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Application.Driver;
using Application.Helper.Constants;
using Application.Helper.UserActions;
using OpenQA.Selenium;
using Tour = Application.Helper.Entities.Tour;
using Bookmark = Application.Helper.Entities.Bookmark;

namespace Application.Helper.Helpers
{
    public class TourHelper : DependentActions
    {
        private const string MayanHistoryTourName = "Mayan History";

        public void AddTour(Tour tour, out string tourId)
        {
            Logger.Log("<- " + tour);

            InitTourCreationMode();
            SetTourName(tour.Name);
            SetTourDescription(tour.Description);
            SetTourBookmarks(tour.Bookmarks);
            CreateTour();
            //tourId = GetTourId(tour.Name);
            tourId = "";

            Logger.Log("->");
        }

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

        public bool IsTourExist(Tour tour)
        {
            Logger.Log("<-");
            bool result = false;
            OpenToursListWindow();
            List<string> tours = GetTourNames();
            if (tours.Contains(tour.Name)) result = true;
            Logger.Log("-> result: " + result.ToString());
            return result;
        }

        public void DeleteToursIfExist(string tourName)
        {
            Logger.Log("<-");
            OpenToursListWindow();
            List<string> tours = GetTourNames();
            OpenToursListWindow();

            foreach (var tour in tours)
            {
                if (tour == tourName)
                {
                    OpenToursListWindow();
                    EditTour(tourName);
                    DeleteTour();
                    Sleep(3);
                    Logger.Log("tour deleted: " + tourName);
                }
            }
            Logger.Log("->");
        }

        private void CloseTourEditForm()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='auth-edit-tours-form']/div[1]/ul/li[3]/a"));
            Logger.Log("->");
        }

        private string GetTourId(string name)
        {
            Logger.Log("<-");
            string tourId = GetJavaScriptExecutionResult("for(var i = 0; i < CZ.Tours.tours.length; i++){if(CZ.Tours.tours[i].title == '" + name + "'){CZ.Tours.tours[i].id}}");
            Logger.Log("-> id: " + tourId);
            return tourId;
        }

        private void EditTour(string tourName)
        {
            Logger.Log("<-");
            string xpath = String.Format("//*[@id='toursList']//*[text()='{0}']/following-sibling::div[2]", tourName);
            Click(By.XPath(xpath));
            Logger.Log("->");
        }

        private void DeleteTour()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='auth-edit-tours-form']/div[2]/button[text()='delete tour']"));
            Logger.Log("->");
        }


        private List<string> GetTourNames()
        {
            Logger.Log("<-");
            ReadOnlyCollection<IWebElement> tourElements = FindElements(By.XPath("//*[@id='tours']/div[*]/li/div[2]/p[1]"));
            List<string> tourNames = tourElements.Select(tourElement => tourElement.Text).ToList();
            Logger.Log("-> " + string.Join(",", tourNames));
            return tourNames;
        }

        private void SelectTour(string tour)
        {
            Logger.Log("<-");
            string xpath = String.Format("//*[@id='toursList']//*[text()='{0}']/following-sibling::div[1]", tour);
            Click(By.XPath(xpath));
            Logger.Log("->");
        }

        private void CreateTour()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='auth-edit-tours-form']/div[2]/button[text()='create tour']"));
            Logger.Log("->");
        }

        private void InitTourCreationMode()
        {
            Logger.Log("<-");
            MoveToElementAndClick(By.XPath("//*[@title='Create Your Events']"));
            MoveToElementAndClick(By.XPath("//*[@id='header-edit-form']/div[2]/button[3]"));
            Logger.Log("->");
        }

        private void SetTourBookmarks(Collection<Chronozoom.Entities.Bookmark> bookmarks)
        {
            foreach (var bookmark in bookmarks)
            {
                Logger.Log("Add bookmark: " + bookmark.Name);
                Click(By.XPath("//*[@id='auth-edit-tours-form']/div[2]/button[text()='add new stop']"));
                WaitForElementIsDisplayed(By.Id("message-window"));
                NavigateToBookmark((Bookmark)bookmark);
                WaitAnimation();
                Sleep(7);
                MoveToElementAndClick(By.Id("vc"));
                Sleep(3);
            }
        }

        private void NavigateToBookmark(Bookmark bookmark)
        {
            switch (bookmark.Type)
            {
                case "timeline":
                    ExecuteJavaScript(string.Format("CZ.Search.goToSearchResult('t{0}', 'timeline')", bookmark.Id));
                    break;
                case "exhibit":
                    ExecuteJavaScript(string.Format("CZ.Search.goToSearchResult('e{0}', 'exhibit')", bookmark.Id));
                    break;
                default:
                    ExecuteJavaScript(string.Format("CZ.Search.goToSearchResult('{0}')", bookmark.Id));
                    break;
            }
        }

        private void GoToTimeline(string guid)
        {
            ExecuteJavaScript("CZ.Search.goToSearchResult('" + guid + "', 'timeline')");
        }

        private void SetTourDescription(string tourDescription)
        {
            Logger.Log("<- tour description: " + tourDescription);
            TypeText(By.XPath("//*[@id='auth-edit-tours-form']/div[2]/textarea"), tourDescription);
            Logger.Log("->");
        }

        private void SetTourName(string tourName)
        {
            Logger.Log("<- tour name: " + tourName);
            TypeText(By.XPath("//*[@id='auth-edit-tours-form']/div[2]/input"), tourName);
            Logger.Log("->");
        }


    }
}