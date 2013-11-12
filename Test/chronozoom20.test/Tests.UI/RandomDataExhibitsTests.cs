using System.Globalization;
using Application.Helper.Entities;
using GitHubIssueWatcher;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.ObjectModel;
using RandomDataGenerator;

namespace Tests
{
    [TestClass]
    public class RandomDataExhibitsTests : TestBase
    {
        #region Initialize and Cleanup
        public TestContext TestContext { get; set; }

        readonly static ContentItem ContentItemVideo = new ContentItem
        {
            Title = RandomString.GetRandomString(1, 200, isUsingSpecChars: true),
            Caption = RandomString.GetRandomString(1, 200, isUsingSpecChars: true),
            MediaSource = RandomUrl.GetRandomWebUrl(),
            MediaType = "Video",
            Attribution = RandomString.GetRandomString(1, 200),
            Uri = RandomUrl.GetRandomVideoUrl()

        };

        readonly static ContentItem ContentItemImage = new ContentItem
        {
            Title = RandomString.GetRandomString(1, 200, isUsingSpecChars: true),
            Caption = RandomString.GetRandomString(1, 200, isUsingSpecChars: true),
            MediaSource = RandomUrl.GetRandomWebUrl(),
            MediaType = "Image",
            Attribution = RandomString.GetRandomString(1, 200),
            Uri = RandomUrl.GetRandomImageUrl()

        };

        readonly static ContentItem ContentItemPdf = new ContentItem
        {
            Title = RandomString.GetRandomString(1, 200, isUsingSpecChars: true),
            Caption = RandomString.GetRandomString(1, 200, isUsingSpecChars: true),
            MediaSource = RandomUrl.GetRandomWebUrl(),
            MediaType = "PDF",
            Attribution = RandomString.GetRandomString(1, 200),
            Uri = RandomUrl.GetRandomPdfUrl()

        };

        static readonly Exhibit Exhibit = new Exhibit
        {
            Title = RandomString.GetRandomString(1, 200, isUsingSpecChars: true),
            Day = RandomDate.GetRandomDate().Day.ToString(CultureInfo.InvariantCulture),
            Year = RandomDate.GetRandomDate().Year,
            Month = RandomDate.GetRandomDate().MonthName,
            TimeMode = "Date",
            ContentItems = new Collection<Chronozoom.Entities.ContentItem> { ContentItemVideo, ContentItemImage, ContentItemPdf }
        };

        private static Exhibit _newExhibit;

        [ClassInitialize]
        public static void ClassInitialize(TestContext testContext)
        {
            BrowserStateManager.RefreshState();
            HomePageHelper.OpenSandboxPage();
            HomePageHelper.DeleteAllElementsLocally();
            ExhibitHelper.AddExhibitWithContentItem(Exhibit);
            _newExhibit = ExhibitHelper.GetNewExhibit();

        }

        [TestInitialize]
        public void TestInitialize()
        {

        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
            if (ExhibitHelper.IsExhibitFound(_newExhibit))
            {
                ExhibitHelper.DeleteExhibitByJavascript(_newExhibit);
            }

        }

        [TestCleanup]
        public void TestCleanup()
        {
            CreateScreenshotsIfTestFail(TestContext);
        }

        #endregion

        [TestMethod]
        [TestCategory("Random")]
        public void random_new_exhibit_content_should_be_correctly()
        {
            for (int i = 0; i < Exhibit.ContentItems.Count; i++)
            {
                Assert.AreEqual(Exhibit.ContentItems[i].Title, _newExhibit.ContentItems[i].Title, "Content items titles are not equal");
                Assert.AreEqual(Exhibit.ContentItems[i].Caption, _newExhibit.ContentItems[i].Caption, "Content items descriptions are not equal");

                Assert.AreEqual(Exhibit.ContentItems[i].MediaType, _newExhibit.ContentItems[i].MediaType, true, "Content items mediaTypes are not equal");
                Assert.AreEqual(Exhibit.ContentItems[i].MediaSource, _newExhibit.ContentItems[i].MediaSource, "Content items mediaSourses are not equal");
                Assert.AreEqual(Exhibit.ContentItems[i].Attribution, _newExhibit.ContentItems[i].Attribution, "Content items attributions are not equal");
            }
        }

        [TestMethod]
        [TestCategory("Random")]
        public void random_new_exhibit_should_have_a_title()
        {
            Assert.AreEqual(Exhibit.Title, _newExhibit.Title, "Titles are not equal");
        }

        [TestMethod]
        //https://github.com/alterm4nn/ChronoZoom/issues/744
        public void random_new_exhibit_should_have_a_year()
        {
            if (IssueStatus.IsIssueResolved("744"))
            {
                Assert.AreEqual(Exhibit.Year, _newExhibit.Year, "Years are not equal");
            }
            else
            {
                Assert.IsTrue(true, "Bug has not been resolved yet");
            }

        }

        [TestMethod]
        [TestCategory("Random")]
        public void random_new_exhibit_should_have_a_day()
        {
            Assert.AreEqual(Exhibit.Day, _newExhibit.Day, "Days are not equal");
        }   
        
        [TestMethod]
        [TestCategory("Random")]
        public void random_new_exhibit_should_have_a_month()
        {
            Assert.AreEqual(Exhibit.Month, _newExhibit.Month, "Months are not equal");
        }

        [TestMethod]
        [TestCategory("Random")]
        public void random_new_exhibit_should_have_a_correct_url()
        {
            for (int i = 0; i < Exhibit.ContentItems.Count; i++)
            {
                Assert.AreEqual(
                    Exhibit.ContentItems[i].MediaType == "Video"
                        ? ExhibitHelper.GetExpectedYouTubeUri(Exhibit.ContentItems[i].Uri)
                        : Exhibit.ContentItems[i].Uri, _newExhibit.ContentItems[i].Uri,
                    "Content items Urls are not equal");
            }
        }


        [TestMethod]
        [TestCategory("Random")]
        public void random_new_exhibit_should_have_a_content_items()
        {
            Assert.AreEqual(Exhibit.ContentItems.Count, _newExhibit.ContentItems.Count, "Content items count are not equal");
        }

        [TestMethod]
        [TestCategory("Random")]
        public void random_new_exhibit_should_not_have_null_id()
        {
            Assert.IsNotNull(_newExhibit.Id);
        }

        [TestMethod]
        [TestCategory("Random")]
        public void random_new_exhibit_should_be_deleted()
        {
            ExhibitHelper.DeleteExhibit(_newExhibit);
            Assert.IsFalse(ExhibitHelper.IsExhibitFound(_newExhibit));
        }
    }
}