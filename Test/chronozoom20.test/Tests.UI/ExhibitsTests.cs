using System;
using Application.Helper.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.ObjectModel;

namespace Tests
{
    [TestClass]
    public class ExhibitsTests : TestBase
    {
        #region Initialize and Cleanup
        public TestContext TestContext { get; set; }

        readonly static ContentItem ContentItem = new ContentItem
        {
            Title = "contentItem",
            Caption = "This is a test item",
            MediaSource = "https://www.youtube.com/watch?v=eVpXkyN0zOE",
            MediaType = "Video",
            Attribution = "Tests Attribution",
            Uri = "https://www.youtube.com/"
            
        };

        readonly Exhibit _exhibit = new Exhibit
        {
            Title = "WebdriverExhibitWithContent",
            ContentItems = new Collection<Chronozoom.Entities.ContentItem> { ContentItem }
        };

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
            HomePageHelper.DeleteAllElementsLocally();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
            try
            {
                ExhibitHelper.DeleteExhibit(_exhibit);
            }
            finally
            {
                CreateScreenshotsIfTestFail(TestContext);
            }
            
        }

        #endregion

        [TestMethod]
        public void Create_exibit_with_one_content_item()
        {
           
            ExhibitHelper.AddExhibitWithContentItem(_exhibit);
            Exhibit newExhibit = ExhibitHelper.GetNewExhibit();
            Assert.AreEqual(_exhibit.Title,newExhibit.Title, "Titles are not equal");
            Assert.AreEqual(_exhibit.ContentItems.Count, newExhibit.ContentItems.Count, "Content items count are not equal");
            Assert.IsNotNull(newExhibit.Id);
            for (int i = 0; i < _exhibit.ContentItems.Count; i++)
            {
                Assert.AreEqual(_exhibit.ContentItems[i].Title, newExhibit.ContentItems[i].Title, "Content items titles are not equal");
                Assert.AreEqual(_exhibit.ContentItems[i].Caption, newExhibit.ContentItems[i].Caption, "Content items descriptions are not equal");
                Assert.AreEqual(_exhibit.ContentItems[i].Uri, newExhibit.ContentItems[i].Uri, "Content items Urls are not equal");
                Assert.AreEqual(_exhibit.ContentItems[i].MediaType, newExhibit.ContentItems[i].MediaType, "Content items mediaTypes are not equal");
                Assert.AreEqual(_exhibit.ContentItems[i].MediaSource, newExhibit.ContentItems[i].MediaSource, "Content items mediaSourses are not equal");
                Assert.AreEqual(_exhibit.ContentItems[i].Attribution, newExhibit.ContentItems[i].Attribution, "Content items attributions are not equal");
            }
        }
    }
}