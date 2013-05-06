using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class SearchTests : TestBase
    {
        public TestContext TestContext { get; set; }

        #region Initialize and Cleanup

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
            SearchHelper.InitSearchWindow();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
        }

        #endregion

        [TestMethod]
        public void Search_Timeline()
        {
            SearchHelper.TypeSearchString("Mayan");
            SearchHelper.WaitSearchProcess();
            SearchHelper.NavigateToSearchResult("Mayan History");
            SearchHelper.WaitNavigationToMayan();
            Assert.AreEqual("Mayan History",SearchHelper.GetLastBreadcrumbsText());
        }
    }
}