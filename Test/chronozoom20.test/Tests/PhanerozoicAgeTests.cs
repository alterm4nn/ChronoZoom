using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class PhanerozoicAgeTests : TestBase
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
            HomePageHelper.CloseWelcomePopup();
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
        public void Test_Eukaryotic_Cells_Description()
        {

            string description = HomePageHelper.GetEukaryoticCellsDescription();
            StringAssert.Contains(description, "Eukaryote cells");
        }

        [TestMethod]
        public void Test_Navigate_To_Life()
        {
            HomePageHelper.OpenLifeTimeLine();
            string actual = HomePageHelper.GetLastBreadcrumbs();
            Assert.AreEqual("Life", actual);
        }
    }
}