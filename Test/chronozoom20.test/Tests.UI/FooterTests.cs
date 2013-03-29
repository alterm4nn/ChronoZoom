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
        public void MrcLink()
        {
            HomePageHelper.OpenMrcLink();
            Assert.AreEqual("ChronoZoom - Microsoft Research", HomePageHelper.GetTitle());
        }

        [TestMethod]
        public void UcBerkelyLink()
        {
            HomePageHelper.OpenUcBerkelyLink();
            Assert.AreEqual("Earth & Planetary Science, UC Berkeley - Main Page", HomePageHelper.GetTitle());
        }

        [TestMethod]
        public void MsuLink()
        {
            HomePageHelper.OpenMsuLink();
            Assert.AreEqual("О факультете | ВМК МГУ", HomePageHelper.GetTitle());
        }

        [TestMethod]
        public void TakeOurSurveyLink()
        {
            HomePageHelper.OpenTakeOurSurveyLink();
            Assert.AreEqual("Instant.ly™", HomePageHelper.GetTitle());
        }

        [TestMethod]
        public void ReportAProblemLink()
        {
            HomePageHelper.OpenReportAProblemLink();
            Assert.AreEqual("Issues · alterm4nn/ChronoZoom", HomePageHelper.GetTitle());
        }

        [TestMethod]
        public void BehindTheScenesLink()
        {
            HomePageHelper.OpenBehindTheScenesLink();
            Assert.AreEqual("Behind the scenes", HomePageHelper.GetTitle());
        }

        [TestMethod]
        public void TermsOfUseLink()
        {
            HomePageHelper.OpenTermsOfUseLink();
            Assert.AreEqual("ChronoZoom Terms of Use", HomePageHelper.GetTitle());
        }

        [TestMethod]
        public void PrivacyLink()
        {
            HomePageHelper.OpenPrivacyLink();
            Assert.AreEqual("ChronoZoom Privacy", HomePageHelper.GetTitle());
        }

        [TestMethod]
        public void TrademarkLink()
        {
            HomePageHelper.OpenTrademarkLink();
            Assert.AreEqual("ChronoZoom Trademark and Copyright", HomePageHelper.GetTitle());
        }
    }
}