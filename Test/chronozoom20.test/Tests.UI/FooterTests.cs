using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class FooterTests : TestBase
    {
        #region Initialize and Cleanup
        public TestContext TestContext { get; set; }

        [ClassInitialize]
        public static void ClassInitialize(TestContext testContext)
        {

        }

        [TestInitialize]
        public void TestInitialize()
        {
            BrowserStateManager.RefreshState();
            NavigationHelper.OpenHomePage();
            WelcomeScreenHelper.CloseWelcomePopup();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
            CreateScreenshotsIfTestFail(TestContext);
        }

        #endregion
        [TestMethod]
        public void HelpLink()
        {
            HomePageHelper.OpenHelpLink();
            Assert.AreEqual("User Guide – ChronoZoom Project", HomePageHelper.GetTitle());
        }

        [TestMethod]
        public void FeedbackLink()
        {
            HomePageHelper.OpenFeedbackLink();
            Assert.AreEqual("Forum: Forums - ChronoZoom Project", HomePageHelper.GetTitle());
        }

        [TestMethod]
        public void NoticeLink()
        {
            HomePageHelper.OpenNoticeLink();
            Assert.AreEqual("Notices – ChronoZoom Project", HomePageHelper.GetTitle());
        }

        [TestMethod]
        public void DevelopersLink()
        {
            HomePageHelper.OpenDevelopersLink();
            Assert.AreEqual("Develop – ChronoZoom Project", HomePageHelper.GetTitle());
        }

    }
}