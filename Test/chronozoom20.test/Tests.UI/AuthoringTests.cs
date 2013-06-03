using System.Collections.ObjectModel;
using Application.Driver;
using Application.Helper.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

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
            CreateScreenshotsIfTestFail(TestContext);
        }

        #endregion

        [TestMethod]
        public void timeline_should_be_created_in_date_mode()
        {
            Logger.Log("Bug: https://github.com/alterm4nn/ChronoZoom/issues/528", LogType.Debug);
            _timeline = new Timeline { Title = "WebdriverTitleDayMode" };
            TimelineHelper.AddTimelineWithDayMode(_timeline);
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
                Uri = "http://i.telegraph.co.uk/multimedia/archive/02429/eleanor_scriven_2429776k.jpg"

            };
            var contentItemMusic = new ContentItem
            {
                Title = "ContentItemMusic",
                MediaType = "Audio",
                Uri = "http://libsyn.com/media/eslpod/ESLPod900.mp3"

            };
            var exhibit = new Exhibit
            {
                Title = "WebdriverExhibitWithContent",
                ContentItems = new Collection<Chronozoom.Entities.ContentItem> { contentItemImage, contentItemMusic }
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
                ContentItems = new Collection<Chronozoom.Entities.ContentItem> {  contentItemPdf }
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
    }
}