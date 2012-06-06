using ThumbGen;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Windows;
using System.Windows.Media.Imaging;
using System.IO;

namespace ThumbGen.Test
{


    /// <summary>
    ///This is a test class for ControllerTest and is intended
    ///to contain all ControllerTest Unit Tests
    ///</summary>
    [TestClass()]
    public class ControllerTest
    {
        private static Controller ctrl;

        private TestContext testContextInstance;

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        #region Additional test attributes
        // 
        //You can use the following additional attributes as you write your tests:
        //
        //Use ClassInitialize to run code before running the first test in the class
        [ClassInitialize()]
        public static void MyClassInitialize(TestContext testContext)
        {
            ctrl = new Controller();

            // prepare azure
            ctrl.SetPreviewSize(new Size(512, 512));
            ctrl.ConfigureAzure(@"http://czbeta.blob.core.windows.net/images/",
                "czbeta", "GuOeSK06XNtEh40CoXUhQUKhPXfxnTvzdY7ZwzGruRmCYA221htHIbeeZ4PC6YU9WZ5IGHLkQTpcxVIBX1WSYw==");
            // prepare sql
            ctrl.ConfigureSQL("data source=iikwkr4fng.database.windows.net;initial catalog=Chronozoom; persist security info=True; user id=czdev; password=ChronoZ)om;multipleactiveresultsets=True;App=EntityFramework");

        }
        //
        //Use ClassCleanup to run code after all tests in a class have run
        //[ClassCleanup()]
        //public static void MyClassCleanup()
        //{
        //}
        //
        //Use TestInitialize to run code before running each test
        //[TestInitialize()]
        //public void MyTestInitialize()
        //{
        //}
        //
        //Use TestCleanup to run code after each test has run
        //[TestCleanup()]
        //public void MyTestCleanup()
        //{
        //}
        //
        #endregion


        #region MediaTypes
        /// <summary>
        /// Tests thumbnail generation from images
        ///</summary>
        [TestMethod()]
        public void ImageThumbnailGeneration()
        {
            ContentItem ci = new ContentItem("Tamias striatus", 
                @"http://upload.wikimedia.org/wikipedia/commons/f/f4/Tamias_striatus_CT.jpg",
                "The eastern chipmunk (Tamias striatus) is a chipmunk species native to eastern North America. Like other chipmunks, they transport food in pouches in their cheeks, as seen here. They eat bulbs, seeds, fruits, nuts, green plants, mushrooms, insects, worms, and bird eggs.",
                MediaType.GetMediaGuid(MediaTypes.Image));

            ci.ID = new Guid();

            ctrl.MakeThumbsForItem(ci);

            foreach (Size s in Utils.GetSizes())
            {
                string p = @"http://czbeta.blob.core.windows.net/images/" +
                    Thumbs.GenerateThumbnailUrlString(ci.ID, s.Width.ToString());
                if (Utils.GetImage(new Uri(p)).PixelWidth != s.Width)
                    Assert.Fail("Test image was not created properly");
            }

            ctrl.DeleteThumbsForItemID(ci.ID);
        }


        /// <summary>
        /// Tests thumbnail generation from YouTube video
        ///</summary>
        [TestMethod()]
        public void YouTubeVideoThumbnailGeneration()
        {
            ContentItem ci = new ContentItem("Cute Owls", @"http://www.youtube.com/watch?v=a-LIfVJus8w",
                "No more kittens on youtube, there's a desire for change. Now people prefer to upload videos of little funny owls.",
                MediaType.GetMediaGuid(MediaTypes.Video));

            ci.ID = new Guid();

            ctrl.MakeThumbsForItem(ci);

            foreach (Size s in Utils.GetSizes())
            {
                string p = @"http://czbeta.blob.core.windows.net/images/" + 
                    Thumbs.GenerateThumbnailUrlString(ci.ID, s.Width.ToString());
                if (Utils.GetImage(new Uri(p)).PixelWidth != s.Width)
                    Assert.Fail("Test image was not created properly");
            }

            ctrl.DeleteThumbsForItemID(ci.ID);
            
        }


        /// <summary>
        /// Tests thumbnail generation from YouTube video
        ///</summary>
        [TestMethod()]
        public void VimeoVideoThumbnailGeneration()
        {
            ContentItem ci = new ContentItem("Windsurfing JAWS", @"http://player.vimeo.com/video/2696386",
                "Windsurf is life",
                MediaType.GetMediaGuid(MediaTypes.Video));

            ci.ID = new Guid();

            ctrl.MakeThumbsForItem(ci);

            foreach (Size s in Utils.GetSizes())
            {
                string p = @"http://czbeta.blob.core.windows.net/images/" + 
                    Thumbs.GenerateThumbnailUrlString(ci.ID, s.Width.ToString());
                if (Utils.GetImage(new Uri(p)).PixelWidth != s.Width)
                    Assert.Fail("Test image was not created properly");
            }

            ctrl.DeleteThumbsForItemID(ci.ID);
        }
        #endregion


    }
}
