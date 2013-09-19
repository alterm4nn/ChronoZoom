using System;
using System.Collections.ObjectModel;
using Application.Helper.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ContentItem = Chronozoom.Entities.ContentItem;
using Exhibit = Application.Helper.Entities.Exhibit;

namespace Tests
{
    [TestClass]
    [Ignore]
    public class BibliographyTests : TestBase
    {
        private Exhibit _newExhibit;
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
            #region create exhibit

            var contentItems = new Collection<ContentItem>();
            var contentItem = new ContentItem { Title = "WebDriverApi", MediaType = "image", Uri = @"http://yandex.st/www/1.609/yaru/i/logo.png", Caption = "", Order = 0, Attribution = "AttributionApI", MediaSource = "https://trello.com/board/development/510a91105420848638003cda" };
            contentItems.Add(contentItem);

            _newExhibit = new Exhibit
                {
                Timeline_ID = new Guid("bdc1ceff-76f8-4df4-ba72-96b353991314"),
                Title = "WebDriverApiExhibitAlexey",
                Year = -8596430000,
                ContentItems = contentItems
            };
            ApiHelper.CreateExhibitByApi(_newExhibit);

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
            CreateScreenshotsIfTestFail(TestContext);
            ApiHelper.DeleteExhibitByApi(_newExhibit);
        }

        #endregion

        [TestMethod]
        [Ignore]
        public void Test_Open_Bibliography()
        {
            ExhibitHelper.NavigateToExhibit(_newExhibit);
            Bibliography bibliography = ExhibitHelper.GetBibliography();
            bool isBibliographyOpened = ExhibitHelper.IsBibliographyOpened();
            ExhibitHelper.CloseBibliography();
            Assert.IsTrue(isBibliographyOpened, "Bibliography is not opened");
            StringAssert.Contains(bibliography.Sources[0].Name, _newExhibit.ContentItems[0].MediaSource);
            StringAssert.StartsWith(bibliography.Sources[0].Description, _newExhibit.ContentItems[0].Title);
        }
    }
}