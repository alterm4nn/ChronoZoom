using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using System.Diagnostics;
using Chronozoom.Test.Components;
using System.Threading;
using System.Text;

namespace Chronozoom.Test.ContentItemsTests
{
    [TestClass]
    [TestPage("testInfodotContent.htm")]
    public abstract class InfodotContentTests : CzTestBase
    {
        private ContentItemsComponent ContentItems;

        [TestMethod]
        public void TestInfodotContent_FindMinorCI_CIFound()
        {
            string infodotID = "demoInfodot";
            // Minor content items IDs.
            string item1 = "minorItem";

            GoToUrl();
            ContentItems.AddInfodot();

            // Failed if infodot wasn't found.
            if (!ContentItems.GetInfodot(infodotID))
                Assert.Fail();

            // View demo infodot to invoke content items load.
            ContentItems.ViewDemoInfodot();
            // Assert is successfull if minor content item was found.
            Assert.IsTrue(ContentItems.GetInfodotCI(infodotID, item1));
        }

        [TestMethod]
        public void TestInfodotContent_FindMainCI_CIFound()
        {
            string infodotID = "demoInfodot";
            string contentItemID = "mainItem";

            GoToUrl();
            ContentItems.AddInfodot();

            // Failed if infodot wasn't found.
            if (!ContentItems.GetInfodot(infodotID))
                Assert.Fail();

            // View demo infodot to invoke content items load.
            ContentItems.ViewDemoInfodot();
            // Assert is successfull if main content item was found.
            Assert.IsTrue(ContentItems.GetInfodotCI(infodotID, contentItemID));
        }

        [TestMethod]
        public void TestInfodotContent_AddInfodot_InfodotAdded()
        {
            string id = "demoInfodot";

            GoToUrl();            

            // Failed if infodot already exists.
            if (ContentItems.GetInfodot(id))
                Assert.Fail();

            // Add infodot.
            ContentItems.AddInfodot();
            // View infodot.
            ContentItems.ViewDemoInfodot();
            Assert.IsTrue(ContentItems.GetInfodot(id));
        }

        [TestMethod]
        public void TestInfodotContent_RemoveInfodot_InfodotRemoved()
        {
            string id = "demoInfodot";

            GoToUrl();
            // Add infodot.
            ContentItems.AddInfodot();
            // View infodot.
            ContentItems.ViewDemoInfodot();

            // Failed if infodot wasn't added.
            if (!ContentItems.GetInfodot(id))
                Assert.Fail();

            ContentItems.RemoveInfodot(id);
            Assert.IsFalse(ContentItems.GetInfodot(id));
        }

        #region Infodot's content and thumbnail tests
        [TestMethod]
        public void TestInfodotContent_ZoomToInfodot_InfodotContentLoaded()
        {
            string infodotID = "demoInfodot";
            string mainItem = "mainItem";
            string minorItem = "minorItem";
            string expected = @"Demo Infodot
(1500)";

            GoToUrl();
            // Add infodot.
            ContentItems.AddInfodot();
            // View infodot.
            ContentItems.ViewDemoInfodot();
            // Fail if infodot wasn't added.
            if (!ContentItems.GetInfodot(infodotID))
                Assert.Fail();

            // Check that title is correct.
            string result = ContentItems.GetInfodotTitle(infodotID);
            Assert.IsTrue(result.Equals(expected));
            // Check that content items were loaded.
            Assert.IsTrue(ContentItems.GetInfodotCI(infodotID, mainItem) && ContentItems.GetInfodotCI(infodotID, minorItem));
        }

        [TestMethod]
        public void TestInfodotContent_ZoomOutFromInfodot_InfodotContentUnloaded()
        {
            int timeout = 2000;
            string infodotID = "demoInfodot";
            string mainItem = "mainItem";
            string minorItem = "minorItem";

            GoToUrl();
            // Add infodot.
            ContentItems.AddInfodot();
            // Fail if infodot wasn't added.
            if (!ContentItems.GetInfodot(infodotID))
                Assert.Fail();
            // View infodot.
            ContentItems.ViewDemoInfodot();
            // Zoom out from infodot to view it's thumbnail.
            ContentItems.ViewDemoInfodotThumbnail();

            Thread.Sleep(timeout);

            // Check that title disappeared.
            Assert.IsTrue(ContentItems.GetInfodotTitle(infodotID) == null);
            // Check that content items are not loaded.
            Assert.IsFalse(ContentItems.GetInfodotCI(infodotID, mainItem) && ContentItems.GetInfodotCI(infodotID, minorItem));
            // Check that bibliography link is not loaded.
            Assert.IsFalse(ContentItems.GetBibliography());
        }

        [TestMethod]
        public void TestInfodotContent_ZoomToInfodot_InfodotThumbnailIsNotVisible()
        {
            string infodotID = "demoInfodot";

            GoToUrl();
            // Add infodot.
            ContentItems.AddInfodot();
            // Fail if infodot wasn't added.
            if (!ContentItems.GetInfodot(infodotID))
                Assert.Fail();
            // View infodot.
            ContentItems.ViewDemoInfodot();

            // Check that thumbnail is visible.
            Assert.IsTrue(ContentItems.GetInfodotThumbnail().Equals("not visible"));
        }

        [TestMethod]
        public void TestInfodotContent_ZoomOutFromInfodot_InfodotThumbnailIsVisible()
        {
            string infodotID = "demoInfodot";

            GoToUrl();
            // Add infodot.
            ContentItems.AddInfodot();
            // Fail if infodot wasn't added.
            if (!ContentItems.GetInfodot(infodotID))
                Assert.Fail();

            // Check that thumbnail is not visible.
            Assert.IsTrue(ContentItems.GetInfodotThumbnail().Equals("visible"));
        }
#endregion

        #region Content item's content and thumbnail tests
        [TestMethod]
        public void TestInfodotContent_ZoomToContentItem_ContentLoaded()
        {
            string infodotID = "demoInfodot";
            string title = "Minor Content Item";

            GoToUrl();
            // Add infodot.
            ContentItems.AddInfodot();
            // Fail if infodot wasn't added.
            if (!ContentItems.GetInfodot(infodotID))
                Assert.Fail();
            // View minor content item of the infodot.
            ContentItems.ViewDemoInfodotCI();

            // Check that media element appeared.
            Assert.IsTrue(ContentItems.GetContentItemMediaElement());
            // Check that description appeared.
            Assert.IsTrue(ContentItems.GetContentItemDescription());  
            // Check that title appeared.
            Assert.IsTrue(ContentItems.GetContentItemTitle().Equals(title));
        }

        [TestMethod]
        public void TestInfodotContent_ZoomOutFromContentItem_ContentIsNotLoaded()
        {
            string infodotID = "demoInfodot";

            GoToUrl();
            // Add infodot.
            ContentItems.AddInfodot();
            // Fail if infodot wasn't added.
            if (!ContentItems.GetInfodot(infodotID))
                Assert.Fail();
            // View minor content item of the infodot.
            ContentItems.ViewDemoInfodot();

            // Check that media element is not loaded.
            Assert.IsFalse(ContentItems.GetContentItemMediaElement());
            // Check that description is not loaded.
            Assert.IsFalse(ContentItems.GetContentItemDescription());
            // Check that title is not loaded.
            Assert.IsTrue(ContentItems.GetContentItemTitle() == null);
        }        

        [TestMethod]
        public void TestInfodotContent_ZoomToCI_InfodotThumbnailIsNotVisible()
        {
            string infodotID = "demoInfodot";

            GoToUrl();
            // Add infodot.
            ContentItems.AddInfodot();
            // Fail if infodot wasn't added.
            if (!ContentItems.GetInfodot(infodotID))
                Assert.Fail();
            // View minor content item of the infodot.
            ContentItems.ViewDemoInfodotCI();

            //Check that thumbnail is not visible.
            Assert.IsTrue(ContentItems.GetContentItemThumbnail().Equals("not visible"));
        }

        [TestMethod]
        public void TestInfodotContent_ZoomOutFromCI_ThumbnailIsVisible()
        {
            string infodotID = "demoInfodot";

            GoToUrl();
            // Add infodot.
            ContentItems.AddInfodot();
            // Fail if infodot wasn't added.
            if (!ContentItems.GetInfodot(infodotID))
                Assert.Fail();
            // View infodot on zoom level when thumbnails of minor content items are still visible.
            ContentItems.ViewDemoInfodot();

            //Check that thumbnail is visible.
            Assert.IsTrue(ContentItems.GetContentItemThumbnail().Equals("visible"));
        }
        #endregion

        #region Bibliography link tests
        [TestMethod]
        public void TestInfodotContent_EmptyBibliographyReferences_NoBibliographyLink()
        {
            string infodotID = "demoInfodot";

            GoToUrl();
            // Add infodot without bibliography references.
            ContentItems.AddInfodot();
            // Fail if infodot wasn't added.
            if (!ContentItems.GetInfodot(infodotID))
                Assert.Fail();
            // View infodot on zoom level when thumbnails of minor content items are still visible.
            ContentItems.ViewDemoInfodot();

            //Check that bibliography link was not added, because there are no bibliography references.
            Assert.IsFalse(ContentItems.GetBibliography());
        }
        #endregion

        [TestInitialize]
        public void TestInitilize()
        {
            ContentItems = new ContentItemsComponent(Driver);
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class InfodotContentTests_Firefox : InfodotContentTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class InfodotContentTests_IE : InfodotContentTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}
