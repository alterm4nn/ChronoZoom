using System;
using System.Collections.ObjectModel;
using System.Globalization;
using Application.Driver;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RandomDataGenerator;
using ContentItem = Chronozoom.Entities.ContentItem;
using Exhibit = Application.Helper.Entities.Exhibit;
using Timeline = Application.Helper.Entities.Timeline;

namespace Tests
{
    [TestClass]
    public class AuthoringTests : TestBase
    {
        #region Initialize and Cleanup
        public TestContext TestContext { get; set; }
        private static Timeline _newTimeline;
        private static Exhibit _newExhibit;
        private static Timeline _timeline;

        [ClassInitialize]
        public static void ClassInitialize(TestContext testContext)
        {
        }

        [TestInitialize]
        public void TestInitialize()
        {
            BrowserStateManager.RefreshState();
            HomePageHelper.OpenSandboxPage();
            HomePageHelper.DeleteAllElementsLocally();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
            if (_newExhibit != null && ExhibitHelper.IsExhibitFound(_newExhibit))
            {
                ExhibitHelper.DeleteExhibitByJavascript(_newExhibit);
            }
            if (_newTimeline != null && TimelineHelper.IsTimelineFound(_newTimeline))
            {
                TimelineHelper.DeleteTimelineByJavaScript(_newTimeline);
            }
            _newExhibit = null;
            CreateScreenshotsIfTestFail(TestContext);
        }

        #endregion

        [TestMethod]
        public void timeline_should_be_created_in_date_mode()
        {
            _timeline = new Timeline { Title = "WebdriverTitleDayMode" };
            TimelineHelper.AddTimelineWithDateMode(_timeline);
            _newTimeline = TimelineHelper.GetLastTimeline();
            Assert.AreEqual(_timeline.Title, _newTimeline.Title);
        }

        [TestMethod]
        public void exhibit_should_allow_two_content_items_adding()
        {
            var contentItemImage = new ContentItem
            {
                Title = "ContentItemImage",
                MediaType = "Image",
                Uri = "http://i.telegraph.co.uk/multimedia/archive/02429/eleanor_scriven_2429776k.jpg",
                Attribution = "Image",
                Caption = "Description"
            };
            var contentItemMusic = new ContentItem
            {
                Title = "ContentItemMusic",
                MediaType = "Image",
                Uri = "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Aeroflot_Airbus_A330_Kustov_edit.jpg/800px-Aeroflot_Airbus_A330_Kustov_edit.jpg",
                Attribution = "Image2",
                Caption = "Description2"
            };
            var exhibit = new Exhibit
            {
                Title = "WebdriverExhibitWithContent",
                ContentItems = new Collection<ContentItem> { contentItemImage, contentItemMusic }
            };

            ExhibitHelper.AddExhibitWithContentItem(exhibit);
            _newExhibit = ExhibitHelper.GetNewExhibit();
            Assert.AreEqual(exhibit.ContentItems.Count, _newExhibit.ContentItems.Count, "Content items count are not equal");
            for (int i = 0; i < exhibit.ContentItems.Count; i++)
            {
                Assert.AreEqual(exhibit.ContentItems[i].Title, _newExhibit.ContentItems[i].Title, "Content items titles are not equal");
                Assert.AreEqual(exhibit.ContentItems[i].MediaType, _newExhibit.ContentItems[i].MediaType, true, "Content items mediaTypes are not equal");
                Assert.AreEqual(exhibit.ContentItems[i].Uri, _newExhibit.ContentItems[i].Uri, "Content items Uri are not equal");
            }
        }

        [TestMethod]
        public void exhibit_should_allow_pdf_content_item_adding()
        {
            Logger.Log("Bug: https://github.com/alterm4nn/ChronoZoom/issues/526", LogType.Debug);
            var contentItemPdf = new ContentItem
            {
                Title = "ContentItemPdf",
                Caption = "This is pdf",
                MediaSource = "http://ads.ccsd.cnrs.fr/docs/00/10/47/81/PDF/p85_89_vol3483m.pdf",
                MediaType = "PDF",
                Attribution = "Tests Attribution",
                Uri = "http://ads.ccsd.cnrs.fr/docs/00/10/47/81/PDF/p85_89_vol3483m.pdf"

            };
            var exhibit = new Exhibit
            {
                Title = "WebdriverExhibitWithContent",
                ContentItems = new Collection<ContentItem> { contentItemPdf }
            };
            ExhibitHelper.AddExhibitWithContentItem(exhibit);
            _newExhibit = ExhibitHelper.GetNewExhibit();
            Assert.AreEqual(exhibit.ContentItems.Count, _newExhibit.ContentItems.Count, "Content items count are not equal");
            for (int i = 0; i < exhibit.ContentItems.Count; i++)
            {
                Assert.AreEqual(exhibit.ContentItems[i].Title, _newExhibit.ContentItems[i].Title, "Content items titles are not equal");
                Assert.AreEqual(exhibit.ContentItems[i].MediaType, _newExhibit.ContentItems[i].MediaType, true, "Content items mediaTypes are not equal");
                Assert.AreEqual(contentItemPdf.Uri, _newExhibit.ContentItems[i].Uri, "Content items Uri are not equal");
            }
        }


        [TestMethod]
        public void exhibit_should_display_correct_date_in_ce()
        {
            var contentItemPdf = new ContentItem
            {
                Title = RandomString.GetRandomString(1, 200),
                Caption = RandomString.GetRandomString(1, 200),
                MediaSource = RandomUrl.GetRandomWebUrl(),
                MediaType = "pdf",
                Attribution = RandomString.GetRandomString(1, 200),
                Uri = RandomUrl.GetRandomPdfUrl(),
                Order = 0
            };
            CustomDate date = RandomDate.GetRandomDate(1900);
            _newExhibit = new Exhibit
            {
                Title = RandomString.GetRandomString(1, 200),
                ContentItems = new Collection<ContentItem> { contentItemPdf },

                Month = date.MonthName,
                Day = date.Day.ToString(CultureInfo.InvariantCulture),
                Year = ExhibitHelper.GetCoordinateFromYmd(date.Year, date.MonthNumber, date.Day),
                Timeline_ID = new Guid("bdc1ceff-76f8-4df4-ba72-96b353991314")
            };
            ApiHelper.CreateExhibitByApi(_newExhibit);
            HomePageHelper.OpenSandboxPage();
            ExhibitHelper.NavigateToExhibit(_newExhibit);
            string displayDate = ExhibitHelper.GetExhibitDisplayDate(_newExhibit);
            StringAssert.Contains(displayDate, "CE");
            StringAssert.Contains(displayDate, date.Year.ToString(CultureInfo.InvariantCulture));
            StringAssert.Contains(displayDate, _newExhibit.Day);
            if (GitHubIssueWatcher.IssueStatus.IsIssueResolved("1024"))
            {
                StringAssert.Contains(displayDate, DateTime.ParseExact(_newExhibit.Month, "MMMM", CultureInfo.CurrentCulture).Month.ToString(CultureInfo.InvariantCulture));
            }
        }     
        
        [TestMethod]
        public void exhibit_should_display_correct_date_december_in_bce()
        {
            var contentItemPdf = new ContentItem
            {
                Title = RandomString.GetRandomString(1, 200),
                Caption = RandomString.GetRandomString(1, 200),
                MediaSource = RandomUrl.GetRandomWebUrl(),
                MediaType = "image",
                Attribution = RandomString.GetRandomString(1, 200),
                Uri = RandomUrl.GetRandomImageUrl(),
                Order = 0
            };
            const decimal year = -2015;
            _newExhibit = new Exhibit
            {
                Title = RandomString.GetRandomString(1, 200),
                ContentItems = new Collection<ContentItem> { contentItemPdf },

                Month = "December",
                Day = "31",
                Year = ExhibitHelper.GetCoordinateFromYmd(year, 12, 31),
                Timeline_ID = new Guid("bdc1ceff-76f8-4df4-ba72-96b353991314")
            };
            ApiHelper.CreateExhibitByApi(_newExhibit);
            HomePageHelper.OpenSandboxPage();
            ExhibitHelper.NavigateToExhibit(_newExhibit);
            string displayDate = ExhibitHelper.GetExhibitDisplayDate(_newExhibit);
            StringAssert.Contains(displayDate, "BCE");
            StringAssert.Contains(displayDate, year.ToString(CultureInfo.InvariantCulture));
            StringAssert.Contains(displayDate, _newExhibit.Day);
            if (GitHubIssueWatcher.IssueStatus.IsIssueResolved("1024"))
            {
                StringAssert.Contains(displayDate, DateTime.ParseExact(_newExhibit.Month, "MMMM", CultureInfo.InvariantCulture).Month.ToString(CultureInfo.InvariantCulture));
            }
        }
    }
}