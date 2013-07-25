using System.Collections.ObjectModel;
using Application.Helper.Entities;
using Application.Helper.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class BingSearchTests : TestBase
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
            AuthorizationHelper.AuthenticateAsGoogleUser();
            HomePageHelper.DeleteAllElementsLocally();
            var exhibit = new Exhibit { Title = "WebdriverExhibitWithContent" };
            ExhibitHelper.AddExhibitWithoutFormClosing(exhibit);
            ExhibitHelper.ClickByAddArtifact();
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
        public void BingSearch()
        {
            string imageUrlFromSearchResult;
            string mediaSourceFromSearchResult;
            ArtifactSearchHelper.FindAndSelectRandomImage(out imageUrlFromSearchResult, out mediaSourceFromSearchResult);
            string imageUrlFromArtifactForm = ExhibitHelper.GetImageUrl();
            string mediaSourceFromArtifactForm = ExhibitHelper.GetMediaSource();

            Assert.AreEqual(imageUrlFromSearchResult,imageUrlFromArtifactForm);
            Assert.AreEqual(mediaSourceFromArtifactForm, mediaSourceFromSearchResult);
        }

    }
}