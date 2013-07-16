using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class BibliographyTests : TestBase
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
            HomePageHelper.OpenPage();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
            CreateScreenshotsIfTestFail(TestContext);
            //NavigationHelper.NavigateToCosmos();
        }

        #endregion

        [TestMethod]
        public void Test_Open_Bibliography()
        {
            ExhibitHelper.OpenExhibit();
            ExhibitHelper.OpenBibliography();
            Assert.IsTrue(ExhibitHelper.IsBibliographyOpened(),"Bibliography is not opened");
        }
    }
}