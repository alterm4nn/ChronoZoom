using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class FooterTests : TestBase
    {
        #region Initialize and Cleanup
        public TestContext TestContext { get; set; }
        private static string _homePageTitle;

        [ClassInitialize]
        public static void ClassInitialize(TestContext testContext)
        {
            BrowserStateManager.RefreshState();
            HomePageHelper.OpenPage();
            _homePageTitle = HomePageHelper.GetTitle();
        }

        [TestInitialize]
        public void TestInitialize()
        {

        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
            CreateScreenshotsIfTestFail(TestContext);
            HomePageHelper.CloseAllTabsButThis(_homePageTitle);
        }

        #endregion

        [TestMethod]
        public void HelpLink()
        {
            const string title = "User Guide – ChronoZoom Project";
            HomePageHelper.OpenHelpLink();
            Assert.AreEqual(title, HomePageHelper.GetNewTabTitle(title));
        }

        [TestMethod]
        public void FeedbackLink()
        {
            const string title = "Forum: Discuss - ChronoZoom Project";
            HomePageHelper.OpenFeedbackLink();
            Assert.AreEqual(title, HomePageHelper.GetNewTabTitle(title));

        }

        [TestMethod]
        public void NoticeLink()
        {
            const string title = "Notices – ChronoZoom Project";
            HomePageHelper.OpenNoticeLink();
            Assert.AreEqual(title, HomePageHelper.GetNewTabTitle(title));
        }

        [TestMethod]
        public void DevelopersLink()
        {
            const string title = "Develop – ChronoZoom Project";
            HomePageHelper.OpenDevelopersLink();
            Assert.AreEqual(title, HomePageHelper.GetNewTabTitle(title));
        }

    }
}