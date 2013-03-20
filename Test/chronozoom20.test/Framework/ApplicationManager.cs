using Framework.Helpers;

namespace Framework
{
    public class ApplicationManager
    {
        private static ApplicationManager _singleton;
        private static Environment _environment;
        private static NavigationHelper _navigationHelper;
        private static BrowserStateManager _browserStateManager;
        private static ScreenshotManager _screenshotManager;
        private static HomePageHelper _homePageHelper;
        private static TourHelper _tourHelper;
        private static BookmarkHelper _bookmarkHelper;
        private static TimelineHelper _timelineHelper;

        public static ApplicationManager GetInstance()
        {
            return _singleton ?? (_singleton = new ApplicationManager());
        }

        public void Stop()
        {
            if (_environment != null)
            {
                _environment.StopDriver();
                _singleton = null;
            }
        }

        public Environment GetEnvironment()
        {
            return _environment ?? (_environment = new Environment());
        }
        
        public NavigationHelper GetNavigationHelper()
        {
            return _navigationHelper ?? (_navigationHelper = new NavigationHelper());
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