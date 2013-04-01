using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class ExhibitsTests : TestBase
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
            NavigationHelper.NavigateToCosmos();
        }

        #endregion


        [TestMethod]
        public void CreateExhibits()
        {
            const string name = "WebdriverTitle";
            ExhibitHelper.AddExhibit(name);
            Assert.AreEqual(name, TimelineHelper.GetLastTimelinename());
        }
    }
}