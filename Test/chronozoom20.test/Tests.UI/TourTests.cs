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
           
        }

        [TestInitialize]
        public void TestInitialize()
        {
            BrowserStateManager.RefreshState();
            HomePageHelper.OpenPage();
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