﻿using Application.Driver;
using Application.Helper.Helpers;

namespace Application.Helper
{
    public class HelperManager
    {

        private static HelperManager _singleton;
        private static NavigationHelper _navigationHelper;
        private static BrowserStateManager _browserStateManager;
        private static ScreenshotManager _screenshotManager;
        private static HomePageHelper _homePageHelper;
        private static TourHelper _tourHelper;
        private static BookmarkHelper _bookmarkHelper;
        private static TimelineHelper _timelineHelper;

        public static void Stop()
        {
            if (DriverManager.GetEnvironmentInstance() != null)
            {
                DriverManager.GetEnvironmentInstance().StopDriver();
            }
        }

        public static HelperManager GetInstance()
        {
            IoC.Initialize(new UnityDependencyResolver());
            return _singleton ?? (_singleton = new HelperManager());
        }

        public NavigationHelper GetNavigationHelper()
        {
            return _navigationHelper ?? (_navigationHelper = new NavigationHelper());
        }
        
        public Environment GetDriverManager()
        {
            return DriverManager.GetEnvironmentInstance();
        }

        public BrowserStateManager GetBrowserStateManager()
        {
            return _browserStateManager ?? (_browserStateManager = new BrowserStateManager());
        }

        public ScreenshotManager GetScreenshotManager()
        {
            return _screenshotManager ?? (_screenshotManager = new ScreenshotManager());
        }

        public HomePageHelper GetHomePageHelper()
        {
            return _homePageHelper ?? (_homePageHelper = new HomePageHelper());
        }

        public TourHelper GetTourHelper()
        {
            return _tourHelper ?? (_tourHelper = new TourHelper());
        }

        public BookmarkHelper GetBookmarkHelper()
        {
            return _bookmarkHelper ?? (_bookmarkHelper = new BookmarkHelper());
        }

        public TimelineHelper GetTimelineHelper()
        {
            return _timelineHelper ?? (_timelineHelper = new TimelineHelper());
        }

    }
}