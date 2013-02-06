using Framework;
using Framework.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class TourTests : TestBase
    {
        public TestContext TestContext { get; set; }

        #region Initialize and Cleanup

        [ClassInitialize]
        public static void ClassInitialize(TestContext testContext)
        {
            NavigationHelper.OpenHomePage();
            HomePageHelper.CloseWelcomePopup();
        }

        [TestInitialize]
        public void TestInitialize()
        {
            BrowserStateManager.RefreshState();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
            NavigationHelper.NavigateToCosmos();
            CreateScreenshotsIfTestFail(TestContext);
        }

        #endregion 

        [TestMethod]
        public void Test_Start_Pause_Tour()
        {
            TourHelper.OpenToursListWindow();
            TourHelper.SelectMayanHistoryTour();
            TourHelper.PauseTour();
            TourHelper.ResumeTour();
        }  
        
        [TestMethod]
        public void Test_Show_Hide_Bookmark_Tour()
        {
            TourHelper.OpenToursListWindow();
            TourHelper.SelectMayanHistoryTour();
            TourHelper.PauseTour();
            Assert.IsTrue(BookmarkHelper.IsBookmarkExpanded());
            BookmarkHelper.HideBookmark();
            Assert.IsFalse(BookmarkHelper.IsBookmarkExpanded());
        }
    }
}