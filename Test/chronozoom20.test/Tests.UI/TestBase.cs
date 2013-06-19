using Application.Driver;
using Application.Helper;
using Application.Helper.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class TestBase
    {
        public static NavigationHelper NavigationHelper { get; set; }
        public static BrowserStateManager BrowserStateManager { get; set; }
        public static TourHelper TourHelper { get; set; }
        public static TimescaleHelper TimescaleHelper { get; set; }
        public static BookmarkHelper BookmarkHelper { get; set; }
        public static ScreenshotManager ScreenshotManager { get; set; }
        public static WelcomeScreenHelper WelcomeScreenHelper { get; set; }
        public static TimelineHelper TimelineHelper { get; set; }
        public static ExhibitHelper ExhibitHelper { get; set; }
        public static AuthorizationHelper AuthorizationHelper { get; set; }
        public static HomePageHelper HomePageHelper { get; set; }
        public static SearchHelper SearchHelper { get; set; }
        public static BreadcrumbsHelper BreadcrumbsHelper { get; set; }
        public static ApiHelper ApiHelper { get; set; }

        [AssemblyInitialize]
        public static void AssemblyInit(TestContext testContext)
        {
            IoC.Initialize(new UnityDependencyResolver());

            NavigationHelper = HelperManager<NavigationHelper>.GetInstance;
            BrowserStateManager = HelperManager<BrowserStateManager>.GetInstance;
            HomePageHelper = HelperManager<HomePageHelper>.GetInstance;
            TourHelper = HelperManager<TourHelper>.GetInstance;
            BookmarkHelper = HelperManager<BookmarkHelper>.GetInstance;
            TimescaleHelper = HelperManager<TimescaleHelper>.GetInstance;
            ScreenshotManager = HelperManager<ScreenshotManager>.GetInstance;
            WelcomeScreenHelper = HelperManager<WelcomeScreenHelper>.GetInstance;
            TimelineHelper = HelperManager<TimelineHelper>.GetInstance;
            ExhibitHelper = HelperManager<ExhibitHelper>.GetInstance;
            SearchHelper = HelperManager<SearchHelper>.GetInstance;
            AuthorizationHelper = HelperManager<AuthorizationHelper>.GetInstance;
            BreadcrumbsHelper = HelperManager<BreadcrumbsHelper>.GetInstance;
            ApiHelper = HelperManager<ApiHelper>.GetInstance;
        }

        [AssemblyCleanup]
        public static void AssemblyCleanup()
        {
            Stop();
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

        internal static void Stop()
        {
            if (DriverManager.GetEnvironmentInstance() != null)
            {
                DriverManager.GetEnvironmentInstance().StopDriver();
            }
        }
    }
}