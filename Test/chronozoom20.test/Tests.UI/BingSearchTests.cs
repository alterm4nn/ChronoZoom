using Application.Helper.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class BingSearchTests : TestBase
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
            HomePageHelper.OpenPage();
            AuthorizationHelper.OpenLoginPage();
            AuthorizationHelper.AuthenticateAsMicrosoftUser(); //authenticate as existing cz user
            HomePageHelper.DeleteAllElementsLocally();
            var exhibit = new Exhibit { Title = "WebdriverExhibitWithContent" };
            ExhibitHelper.AddExhibitWithoutFormClosing(exhibit);
            ExhibitHelper.ClickOnAddArtifact();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {

        }

        [TestCleanup]
        public void TestCleanup()
        {
            CreateScreenshotsIfTestFail(TestContext);
            AuthorizationHelper.LogoutByUrl();
        }

        #endregion

        [TestMethod]
        public void founded_bing_images_info_should_insert_correctly()
        {
            string imageUrlFromSearchResult;
            string mediaSourceFromSearchResult;
            ArtifactSearchHelper.FindAndSelectRandomImage(out imageUrlFromSearchResult, out mediaSourceFromSearchResult);
            
            string imageUrlFromArtifactForm = ExhibitHelper.GetCurrentImageOrVideoUrl();
            string mediaSourceFromArtifactForm = ExhibitHelper.GetCurrentMediaSource();
            string mediaTypeFromArtifactForm = ExhibitHelper.GetCurrentMediaType();

            Assert.AreEqual(imageUrlFromSearchResult,imageUrlFromArtifactForm);
            Assert.AreEqual(mediaSourceFromArtifactForm, mediaSourceFromSearchResult);
            Assert.AreEqual("image", mediaTypeFromArtifactForm.ToLower());
        }

        [TestMethod]
        public void founded_bing_videos_info_should_insert_correctly()
        {
            string videoUrlFromSearchResult;
            ArtifactSearchHelper.FindAndSelectRandomVideo(out videoUrlFromSearchResult);

            string videoUrlFromArtifactForm = ExhibitHelper.GetCurrentImageOrVideoUrl();
            string attributionFromArtifactForm = ExhibitHelper.GetCurrentAttribution();
            string mediaSourceFromArtifactForm = ExhibitHelper.GetCurrentMediaSource();
            string mediaTypeFromArtifactForm = ExhibitHelper.GetCurrentMediaType();

            Assert.AreEqual(videoUrlFromSearchResult, videoUrlFromArtifactForm);
            Assert.AreEqual(videoUrlFromSearchResult, attributionFromArtifactForm);
            Assert.AreEqual(videoUrlFromSearchResult, mediaSourceFromArtifactForm);
            Assert.AreEqual("video", mediaTypeFromArtifactForm.ToLower());
        }

        [TestMethod]
        public void founded_bing_pdfs_info_should_insert_correctly()
        {
            string pdfUrlFromSearchResult;
            ArtifactSearchHelper.FindAndSelectRandomPdf(out pdfUrlFromSearchResult);

            string pdfUrlFromArtifactForm = ExhibitHelper.GetCurrentImageOrVideoUrl();
            string attributionFromArtifactForm = ExhibitHelper.GetCurrentAttribution();
            string mediaSourceFromArtifactForm = ExhibitHelper.GetCurrentMediaSource();
            string mediaTypeFromArtifactForm = ExhibitHelper.GetCurrentMediaType();

            Assert.AreEqual(pdfUrlFromSearchResult, pdfUrlFromArtifactForm);
            Assert.AreEqual(pdfUrlFromSearchResult, attributionFromArtifactForm);
            Assert.AreEqual(pdfUrlFromSearchResult, mediaSourceFromArtifactForm);
            Assert.AreEqual("pdf", mediaTypeFromArtifactForm.ToLower());
        }

        [TestMethod]
        public void change_of_bing_results_change_form_fields_correctly()
        {
            string imageUrlFromSearchResult;
            string imageMediaSourceFromSearchResult;
            ArtifactSearchHelper.FindAndSelectRandomImage(out imageUrlFromSearchResult, out imageMediaSourceFromSearchResult);
            string imageUrlFromArtifactForm = ExhibitHelper.GetCurrentImageOrVideoUrl();
            string imageMediaSourceFromArtifactForm = ExhibitHelper.GetCurrentMediaSource();
            string imageMediaTypeFromArtifactForm = ExhibitHelper.GetCurrentMediaType();
            Assert.AreEqual(imageUrlFromSearchResult, imageUrlFromArtifactForm);
            Assert.AreEqual(imageMediaSourceFromArtifactForm, imageMediaSourceFromSearchResult);
            Assert.AreEqual("image", imageMediaTypeFromArtifactForm.ToLower());

            string videoUrlFromSearchResult;
            ArtifactSearchHelper.FindAndSelectRandomVideo(out videoUrlFromSearchResult);
            string videoUrlFromArtifactForm = ExhibitHelper.GetCurrentImageOrVideoUrl();
            string videoAttributionFromArtifactForm = ExhibitHelper.GetCurrentAttribution();
            string videoMediaSourceFromArtifactForm = ExhibitHelper.GetCurrentMediaSource();
            string videMediaTypeFromArtifactForm = ExhibitHelper.GetCurrentMediaType();
            Assert.AreEqual(videoUrlFromSearchResult, videoUrlFromArtifactForm);
            Assert.AreEqual(videoUrlFromSearchResult, videoAttributionFromArtifactForm);
            Assert.AreEqual(videoUrlFromSearchResult, videoMediaSourceFromArtifactForm);
            Assert.AreEqual("video", videMediaTypeFromArtifactForm.ToLower());

            string pdfUrlFromSearchResult;
            ArtifactSearchHelper.FindAndSelectRandomPdf(out pdfUrlFromSearchResult);
            string pdfUrlFromArtifactForm = ExhibitHelper.GetCurrentImageOrVideoUrl();
            string pdfAttributionFromArtifactForm = ExhibitHelper.GetCurrentAttribution();
            string pdfMediaSourceFromArtifactForm = ExhibitHelper.GetCurrentMediaSource();
            string pdfMediaTypeFromArtifactForm = ExhibitHelper.GetCurrentMediaType();
            Assert.AreEqual(pdfUrlFromSearchResult, pdfUrlFromArtifactForm);
            Assert.AreEqual(pdfUrlFromSearchResult, pdfAttributionFromArtifactForm);
            Assert.AreEqual(pdfUrlFromSearchResult, pdfMediaSourceFromArtifactForm);
            Assert.AreEqual("pdf", pdfMediaTypeFromArtifactForm.ToLower());
        }
    }
}