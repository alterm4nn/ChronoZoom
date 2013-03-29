using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
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
        public void MrcLink()
        {

        }
        
        [TestMethod]
        public void UcBerkelyLink()
        {

        }
        
        [TestMethod]
        public void MsuLink()
        {

        }
        
        [TestMethod]
        public void TakeOurSurveyLink()
        {

        }
        
        [TestMethod]
        public void ReportAProblemLink()
        {

        } 
        
        [TestMethod]
        public void BehindTheScenesLink()
        {

        }
        
        [TestMethod]
        public void TermsOfUseLink()
        {

        }
        
        [TestMethod]
        public void PrivacyLink()
        {

        }
        
        [TestMethod]
        public void TrademarkLink()
        {

        }




        
    }
}