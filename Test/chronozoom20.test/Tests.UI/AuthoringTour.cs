using System.Collections.ObjectModel;
using Application.Helper.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ContentItem = Chronozoom.Entities.ContentItem;

namespace Tests
{
    [TestClass]
    public class AuthoringTour : TestBase
    {
        #region Initialize and Cleanup
        public TestContext TestContext { get; set; }
        private static Timeline _newTimeline;
        private static Exhibit _newExhibit;
        private static Tour _newTour;

        [ClassInitialize]
        public static void ClassInitialize(TestContext testContext)
        {
        }

        [TestInitialize]
        public void TestInitialize()
        {
            BrowserStateManager.RefreshState();
            HomePageHelper.OpenSandboxPage();
            TourHelper.DeleteToursIfExist("webdriverTour");

            #region create timeline

            _newTimeline = new Timeline
            {
                FromYear = -6061670000,
                ToYear = -5808809999,
                Title = "WebDriverApiTitle"
            };
            ApiHelper.CreateTimelineByApi(_newTimeline);

            #endregion

            #region create exhibit

            var contentItems = new Collection<ContentItem>();
            var contentItem = new ContentItem { Title = "WebDriverApi", MediaType = "image", Uri = @"http://yandex.st/www/1.609/yaru/i/logo.png", Caption = "", Order = 0, Attribution = "", MediaSource = "" };
            contentItems.Add(contentItem);

            _newExhibit = new Exhibit
                {
                    Timeline_ID = _newTimeline.Id,
                    Title = "WebDriverApiExhibit",
                    Year = -8596430000,
                    ContentItems = contentItems
                };
            ApiHelper.CreateExhibitByApi(_newExhibit);

            #endregion

            #region init new tour

            _newTour = new Tour {Name = "webdriverTour", Description = "webdriver description"};
            Bookmark exhibitBookmark = new Bookmark { Name = "WebDriverApiExhibitBookmark", Id = _newExhibit.Id, Type = "exhibit" };
            Bookmark timelineBookmark = new Bookmark { Name = "WebDriverApiTimelineBookmark", Id = _newTimeline.Id, Type = "timeline" };
            Collection<Chronozoom.Entities.Bookmark> bookmarks = new Collection<Chronozoom.Entities.Bookmark> { exhibitBookmark, timelineBookmark };
            _newTour.Bookmarks = bookmarks;

            #endregion

            HomePageHelper.OpenSandboxPage();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
            #region Delete timeline, exhibit, tour

            ApiHelper.DeleteTimelineByApi(_newTimeline);
            ApiHelper.DeleteExhibitByApi(_newExhibit);
            #endregion
            CreateScreenshotsIfTestFail(TestContext);
        }

        #endregion

        [TestMethod]
        public void tour_should_be_created()
        {
            TourHelper.AddTour(_newTour);
            Assert.IsTrue(TourHelper.IsTourExist(_newTour));
        }
    }
}