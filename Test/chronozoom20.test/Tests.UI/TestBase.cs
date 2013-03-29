﻿using Application.Driver;
using Application.Helper;
using Application.Helper.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class TestBase
    {
        public static HelperManager HelperManager { get; set; }
        public static NavigationHelper NavigationHelper { get; set; }
        public static BrowserStateManager BrowserStateManager { get; set; }
        public static TourHelper TourHelper { get; set; }
        public static TimelineHelper TimelineHelper { get; set; }
        public static BookmarkHelper BookmarkHelper { get; set; }
        public static ScreenshotManager ScreenshotManager { get; set; }
        public static WelcomeScreenHelper WelcomeScreenHelper { get; set; }
        

        public static HomePageHelper HomePageHelper { get; set; }

        [AssemblyInitialize]
        public static void AssemblyInit(TestContext testContext)
        {
            HelperManager = HelperManager.GetInstance();
            NavigationHelper = HelperManager.GetNavigationHelper();
            BrowserStateManager = HelperManager.GetBrowserStateManager();
            HomePageHelper = HelperManager.GetHomePageHelper();
            TourHelper = HelperManager.GetTourHelper();
            BookmarkHelper = HelperManager.GetBookmarkHelper();
            TimelineHelper = HelperManager.GetTimelineHelper();
            ScreenshotManager = HelperManager.GetScreenshotManager();
            WelcomeScreenHelper = HelperManager.GetWelcomeScreenHelper();
        }

        [AssemblyCleanup]
        public static void AssemblyCleanup()
        {
            HelperManager.Stop();
        }

        internal void CreateScreenshotsIfTestFail(TestContext testContext)
        {
            if (testContext.CurrentTestOutcome == UnitTestOutcome.Failed)
            {
                ScreenshotManager.SaveScreenshots(testContext.TestDeploymentDir);
            }
            else
            {
                ScreenshotManager.Screenshots.Clear();
            }
        }
    }
}