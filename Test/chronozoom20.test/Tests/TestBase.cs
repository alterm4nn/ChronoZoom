using Framework;
using Framework.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class TestBase
    {
        public static ApplicationManager ApplicationManager { get; set; }
        public static NavigationHelper NavigationHelper { get; set; }
        public static CommonHelper CommonHelper { get; set; }
        public static BrowserStateManager BrowserStateManager { get; set; }
        public static TourHelper TourHelper { get; set; }
        protected static BookmarkHelper BookmarkHelper { get; set; }

        public static ScreenshotManager ScreenshotManager
        {
            get { return ApplicationManager.GetScreenshotManager(); }
        }

        public static HomePageHelper HomePageHelper { get; set; }

        [AssemblyInitialize]
        public static void AssemblyInit(TestContext testContext)
        {
            //Logger.Log(":D");
            ApplicationManager = ApplicationManager.GetInstance();
            NavigationHelper = ApplicationManager.GetNavigationHelper();
            CommonHelper = ApplicationManager.GetCommonHelper();
            BrowserStateManager = ApplicationManager.GetBrowserStateManager();
            HomePageHelper = ApplicationManager.GetHomePageHelper();
            TourHelper = ApplicationManager.GetTourHelper();
            BookmarkHelper = ApplicationManager.GetBookmarkHelper();
        }

        [AssemblyCleanup]
        public static void AssemblyCleanup()
        {
            ApplicationManager.Stop();
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