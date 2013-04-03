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
        }

        #endregion

        [TestMethod]
        public void Create_exhibit()
        {
            Exhibit exhibit = new Exhibit() {Title = "WebdriverExhibit"};
            ExhibitHelper.AddExhibit(exhibit);
            Assert.AreEqual(exhibit.Title, ExhibitHelper.GetNewExhibit().Title);
        }

        [TestMethod]
        public void Create_exibit_with_one_content_item()
        {
            ContentItem contentItem = new ContentItem()
                {
                    Title = "contentItem",
                    Caption = "This is a test item",
                    MediaSource = "https://www.youtube.com/watch?v=eVpXkyN0zOE",
                    MediaType = "Video"
                };
            Exhibit exhibit = new Exhibit()
                {
                    Title = "ExhibitWithContent",
                    ContentItems = new Collection<Chronozoom.Entities.ContentItem> { contentItem }
                };
            ExhibitHelper.AddExhibitWithContentItem(exhibit);
            Exhibit newExhibit = ExhibitHelper.GetNewExhibit();
            Assert.AreEqual(exhibit.Title,newExhibit.Title, "Titles are not equal");
            Assert.AreEqual(exhibit.ContentItems.Count, newExhibit.ContentItems.Count, "Content items count are not equal");
            Assert.IsNotNull(newExhibit.ExhibitId);
            for (int i = 0; i < exhibit.ContentItems.Count; i++)
            {
                Assert.AreEqual(exhibit.ContentItems[i].Title, newExhibit.ContentItems[i].Title, "Content items titles are not equal");
                Assert.AreEqual(exhibit.ContentItems[i].Caption, newExhibit.ContentItems[i].Caption, "Content items descriptions are not equal");
                Assert.AreEqual(exhibit.ContentItems[i].MediaSource, newExhibit.ContentItems[i].MediaSource, "Content items mediaSourses are not equal");
                Assert.AreEqual(exhibit.ContentItems[i].MediaType, newExhibit.ContentItems[i].MediaType, "Content items mediaTypes are not equal");
            }
        }
    }
}