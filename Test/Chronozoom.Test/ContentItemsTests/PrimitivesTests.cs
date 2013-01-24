using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using System.Diagnostics;
using Chronozoom.Test.Components;
using System.Threading;


namespace Chronozoom.Test.ContentItemsTests
{
    [TestClass]
    [TestPage("testVirtualCanvasPrimitives.htm")]
    public abstract class VirtualCanvasPrimitivesTests : CzTestBase
    {
        private ContentItemsComponent ContentItems;

        private const int SleepTime = 1000;

        #region Add item tests

        // Adds circle to root element. After searches id of the circle in children tree.
        [TestMethod]
        public void TestAddItem_AddCircle_CircleAdded()
        {
            string id = "testCircle";

            GoToUrl();
            // Failed if element with current id is already exist.
            if (ContentItems.GetChild(id))
            {
                Trace.WriteLine("Element with id=" + id + " alredy exists.");
                Assert.Fail();
            }

            ContentItems.AddCircle(id);

            Assert.IsTrue(ContentItems.GetChild(id));            
        }

        // Adds rectangle to root element. After searches id of the rectangle in children tree.
        [TestMethod]
        public void TestAddItem_AddRectangle_RectangleAdded()
        {
            string id = "testRectangle";

            GoToUrl();
            // Failed if element with current id is already exist.
            if (ContentItems.GetChild(id))
            {
                Trace.WriteLine("Element with id=" + id + " alredy exists.");
                Assert.Fail();
            }

            ContentItems.AddRectangle(id);

            Assert.IsTrue(ContentItems.GetChild(id));
        }

        // Adds image to root element. After searches id of the image in children tree.
        [TestMethod]
        public void TestAddItem_AddImage_ImageAdded()
        {
            string id = "testImage";

            GoToUrl();
            // Failed if element with current id is already exist.
            if (ContentItems.GetChild(id))
            {
                Trace.WriteLine("Element with id=" + id + " alredy exists.");
                Assert.Fail();
            }

            ContentItems.AddImage(id);

            Assert.IsTrue(ContentItems.GetChild(id));
        }

        // Adds text to root element. After searches id of the text in children tree.
        [TestMethod]
        public void TestAddItem_AddText_TextAdded()
        {
            string id = "testText";
            string text = "Hello, Chronozoom!";

            GoToUrl();
            // Failed if element with current id is already exist.
            if (ContentItems.GetChild(id))
            {
                Trace.WriteLine("Element with id=" + id + " alredy exists.");
                Assert.Fail();
            }

            ContentItems.AddText(id, text);

            Assert.IsTrue(ContentItems.GetChild(id));
        }

        // Adds youtube and vimeo video to root element. After searches ids of the videos in children tree.
        [TestMethod]
        public void TestAddItem_AddVideo_VideoAdded()
        {
            string youtubeID = "testYoutube";
            string vimeoID = "testVimeo";

            GoToUrl();
            // Failed if element with current id is already exist.
            if (ContentItems.GetChild(youtubeID) || ContentItems.GetChild(vimeoID))
            {
                Trace.WriteLine("Video with current id alredy exists.");
                Assert.Fail();
            }

            ContentItems.AddVideo(youtubeID, vimeoID);

            Assert.IsTrue(ContentItems.GetChild(youtubeID) && ContentItems.GetChild(vimeoID));
        }

        // Adds audio to root element. After searches id of the audio in children tree.
        [TestMethod]
        public void TestAddItem_AddAudio_AudioAdded()
        {
            string id = "testAudio";

            GoToUrl();
            // Failed if element with current id is already exist.
            if (ContentItems.GetChild(id))
            {
                Trace.WriteLine("Audio with current id alredy exists.");
                Assert.Fail();
            }

            ContentItems.AddAudio(id);

            Assert.IsTrue(ContentItems.GetChild(id));
        }

        // Adds multiline text to root element. After searches id of the multiline text in children tree.
        [TestMethod]
        public void TestAddItem_AddMultiText_TextAdded()
        {
            // ID's of two multitext elements with the same text but with different linewidth.
            string id1 = "mtext";
            string id2 = "mtext2";

            string text = "Text to test. Text to test. Text to test. Text to test. Text to test. Text to test. Text to test. Text to test. Text to test. Text to test.";

            GoToUrl();
            // Failed if element with current id is already exist.
            if (ContentItems.GetChild(id1) || ContentItems.GetChild(id2))
            {
                Trace.WriteLine("Multitext with current id alredy exists.");
                Assert.Fail();
            }

            ContentItems.AddMultiText(id1, id2, text);

            Assert.IsTrue(ContentItems.GetChild(id1) && ContentItems.GetChild(id2));
        }

        #endregion

        #region Remove item tests

        [TestMethod]
        public void TestRemoveItem_RemoveRectangle_RectangleRemoved()
        {
            string id = "testRectangle";

            GoToUrl();
            // Failed if element with current id is already exist.
            if (!ContentItems.GetChild(id))
            {
                ContentItems.AddRectangle(id);
            }

            // Failed if element wasn't added.
            if (!ContentItems.GetChild(id))
            {
                Trace.WriteLine("Element with id=" + id + " wasn't added");
                Assert.Fail();
            }

            if (!ContentItems.RemoveChild(id))
            {
                Trace.WriteLine("JavaScript method removeChild in vccontent.js failed.");
                Assert.Fail();
            }

            Assert.IsTrue(!ContentItems.GetChild(id));
        }

        [TestMethod]
        public void TestRemoveItem_RemoveCircle_CircleRemoved()
        {
            string id = "testCircle";

            GoToUrl();
            // Failed if element with current id is already exist.
            if (!ContentItems.GetChild(id))
            {
                ContentItems.AddCircle(id);
            }

            // Failed if element wasn't added.
            if (!ContentItems.GetChild(id))
            {
                Trace.WriteLine("Element with id=" + id + " wasn't added");
                Assert.Fail();
            }

            if (!ContentItems.RemoveChild(id))
            {
                Trace.WriteLine("JavaScript method removeChild in vccontent.js failed.");
                Assert.Fail();
            }

            Assert.IsFalse(ContentItems.GetChild(id));
        }

        [TestMethod]
        public void TestRemoveItem_RemoveText_TextRemoved()
        {
            string id = "testText";
            string text = "Hello, Chronozoom!";

            GoToUrl();
            // Failed if element with current id is already exist.
            if (!ContentItems.GetChild(id))
            {
                ContentItems.AddText(id, text);
            }

            // Failed if element wasn't added.
            if (!ContentItems.GetChild(id))
            {
                Trace.WriteLine("Element with id=" + id + " wasn't added");
                Assert.Fail();
            }

            if (!ContentItems.RemoveChild(id))
            {
                Trace.WriteLine("JavaScript method removeChild in vccontent.js failed.");
                Assert.Fail();
            }

            Assert.IsFalse(ContentItems.GetChild(id));
        }

        [TestMethod]
        public void TestRemoveItem_RemoveImage_ImageRemoved()
        {
            string id = "testImage";

            GoToUrl();
            // Failed if element with current id is already exist.
            if (!ContentItems.GetChild(id))
            {
                ContentItems.AddImage(id);
            }

            // Failed if element wasn't added.
            if (!ContentItems.GetChild(id))
            {
                Trace.WriteLine("Element with id=" + id + " wasn't added");
                Assert.Fail();
            }

            if (!ContentItems.RemoveChild(id))
            {
                Trace.WriteLine("JavaScript method removeChild in vccontent.js failed.");
                Assert.Fail();
            }

            Assert.IsFalse(ContentItems.GetChild(id));
        }

        [TestMethod]
        public void TestRemoveItem_RemoveVideo_VideoRemoved()
        {
            string youtubeID = "youtubeVideo";
            string vimeoID = "vimeoVideo";

            GoToUrl();
            // Failed if element with current id is already exist.
            if (!ContentItems.GetChild(youtubeID) && !ContentItems.GetChild(vimeoID))
            {
                ContentItems.AddVideo(youtubeID, vimeoID);
            }

            // Failed if element wasn't added.
            if (!ContentItems.GetChild(youtubeID) || !ContentItems.GetChild(vimeoID))
            {
                Trace.WriteLine("Video element wasn't added");
                Assert.Fail();
            }

            if (!ContentItems.RemoveChild(youtubeID))
            {
                Trace.WriteLine("JavaScript method removeChild in vccontent.js failed.");
                Assert.Fail();
            }

            if (!ContentItems.RemoveChild(vimeoID))
            {
                Trace.WriteLine("JavaScript method removeChild in vccontent.js failed.");
                Assert.Fail();
            }

            Assert.IsFalse(ContentItems.GetChild(vimeoID) && ContentItems.GetChild(youtubeID));
        }

        [TestMethod]
        public void TestRemoveItem_RemoveAudio_AudioRemoved()
        {
            string id = "testAudio";

            GoToUrl();
            // Failed if element with current id is already exist.
            if (!ContentItems.GetChild(id))
            {
                ContentItems.AddAudio(id);
            }

            // Failed if element wasn't added.
            if (!ContentItems.GetChild(id))
            {
                Trace.WriteLine("Element with id=" + id + " wasn't added");
                Assert.Fail();
            }

            if (!ContentItems.RemoveChild(id))
            {
                Trace.WriteLine("JavaScript method removeChild in vccontent.js failed.");
                Assert.Fail();
            }

            Assert.IsFalse(ContentItems.GetChild(id));
        }

        [TestMethod]
        public void TestRemoveItem_RemoveMultiText_MultiTextRemoved()
        {
            string id1 = "mtext";
            string id2 = "mtext2";
            string text = "Text to test.";

            GoToUrl();
            // Failed if elements with current id are already exist.
            if (!ContentItems.GetChild(id1) || !ContentItems.GetChild(id2))
            {
                ContentItems.AddMultiText(id1, id2, text);
                Thread.Sleep(SleepTime);
            }

            // Failed if element wasn't added.
            if (!ContentItems.GetChild(id1) || !ContentItems.GetChild(id2))
            {
                Trace.WriteLine("Multitext wasn't added");
                Assert.Fail();
            }

            if (!ContentItems.RemoveChild(id1))
            {
                Trace.WriteLine("JavaScript method removeChild in vccontent.js failed.");
                Assert.Fail();
            }

            if (!ContentItems.RemoveChild(id2))
            {
                Trace.WriteLine("JavaScript method removeChild in vccontent.js failed.");
                Assert.Fail();
            }

            Assert.IsFalse(ContentItems.GetChild(id1) && ContentItems.GetChild(id2));
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
    public class VirtualCanvasPrimitivesTests_Firefox : VirtualCanvasPrimitivesTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class VirtualCanvasPrimitivesTests_IE : VirtualCanvasPrimitivesTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}

