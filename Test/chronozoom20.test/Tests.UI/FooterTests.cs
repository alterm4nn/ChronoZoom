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
            Assert.AreEqual("Develop |", HomePageHelper.GetTitle());
        }

        [TestMethod]
        public void FeedbackLink()
        {
            HomePageHelper.OpenFeedbackLink();
            Assert.AreEqual("Forum: ChronoZoom Beta Feedback |", HomePageHelper.GetTitle());
        }

        [TestMethod]
        public void AboutLink()
        {
            HomePageHelper.OpenAboutLink();
            Assert.AreEqual("Home", HomePageHelper.GetTitle());
        }

        [TestMethod]
        public void PrivacyLink()
        {
            HomePageHelper.OpenPrivacyLink();
            Assert.AreEqual("Notices |", HomePageHelper.GetTitle());
        }

    }
}