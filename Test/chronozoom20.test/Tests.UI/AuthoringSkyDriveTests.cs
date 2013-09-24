using System.Collections.ObjectModel;
using Application.Helper.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class AuthoringSkyDriveTests : TestBase
    {
        #region Initialize and Cleanup
        public TestContext TestContext { get; set; }
        private static Exhibit _newExhibit;

        [ClassInitialize]
        public static void ClassInitialize(TestContext testContext)
        {
        }

        [TestInitialize]
        public void TestInitialize()
        {
            BrowserStateManager.RefreshState();
            HomePageHelper.OpenPage();
            AuthorizationHelper.OpenLoginPage();
            AuthorizationHelper.AuthenticateAsExistedGoogleUser();
            HomePageHelper.CloseStartPage();
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
            AuthorizationHelper.LogoutByUrl();
            AuthorizationHelper.LogoutFromSkyDrive();
            CreateScreenshotsIfTestFail(TestContext);
        }

        #endregion

        [TestMethod]
        public void exhibit_should_allow_skydrive_content_item_adding()
        {
            var contentDocumentItemSkyDrive = new ContentItem
            {
                Title = "ContentItemSkyDrive",
                Caption = "This is skydrive",
                SkyDriveFileType = ContentItem.SkyDriveType.Document,
                Attribution = "Tests Attribution",
                FileName = "test document"
            };

            var contentPictureItemSkyDrive = new ContentItem
            {
                Title = "ContentItemSkyDrive",
                Caption = "This is skydrive",
                SkyDriveFileType = ContentItem.SkyDriveType.Image,
                Attribution = "Tests Attribution",
                FileName = "panda"
            };
            var exhibit = new Exhibit
            {
                Title = "WebdriverExhibitWithContent",
                ContentItems = new Collection<Chronozoom.Entities.ContentItem> { contentDocumentItemSkyDrive, contentPictureItemSkyDrive }
            };
            ExhibitHelper.AddExhibitWithSkyDriveContentItem(exhibit);
            _newExhibit = ExhibitHelper.GetNewExhibit();
            Assert.AreEqual(exhibit.ContentItems.Count, _newExhibit.ContentItems.Count, "Content items count are not equal");
            for (int i = 0; i < exhibit.ContentItems.Count; i++)
            {
                Assert.AreEqual(exhibit.ContentItems[i].Title, _newExhibit.ContentItems[i].Title, "Content items titles are not equal");
            }
        }
    }
}