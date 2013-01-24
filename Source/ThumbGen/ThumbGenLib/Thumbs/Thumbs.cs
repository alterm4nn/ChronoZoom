using System;
using System.Text.RegularExpressions;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.IO;
using System.Xml;
using System.Net;

namespace ThumbGen
{
    /// <summary>
    /// Contains methods for thumbnails creation from the specified data.
    /// </summary>
    public static class Thumbs
    {
        /// <summary>
        /// Generates content item visual and makes a picture of it
        /// </summary>
        /// <param name="_title">String containing title of the content item</param>
        /// <param name="_url">Uri of the media element of the content item</param>
        /// <param name="_desc">String contanting the description of the content item</param>
        /// <param name="initialSize">Initial size of the content item</param>
        /// <returns>BitmapSource with image of the content item of the specified size</returns>
        internal static BitmapSource[] MakeThumbs(ContentItem ciData, Size[] sizes, Size initialSize)
        {
            if (ciData.thumbnail == null)
            {
                ciData.thumbnail = Thumbs.GetMediaThumbnail(ciData);
            }

            if (ciData.thumbnail == null)
            {
                // cannot create thumbnail
                return null;
            }

            ContentItemControl element = new ContentItemControl();
            element.Height = initialSize.Height;
            element.Width = initialSize.Width;
            element.Data = ciData;
            element.Measure(initialSize);
            element.Arrange(new Rect(initialSize));

            BitmapSource bmpSource = CreateBitmapSourceFromVisual(initialSize, element);

            return CreateResizedBitmapSources(bmpSource, sizes);
        }

        /// <summary>
        /// Determines kind of the media in the content item and returns image
        /// </summary>
        /// <param name="ciData"></param>
        /// <returns></returns>
        private static BitmapSource GetMediaThumbnail(ContentItem ciData)
        {
            BitmapSource bmp;
            string mediasrc = ciData.MediaTypeID.ToString().ToLower();

            MediaTypes mtype = MediaType.GetMediaType(ciData.MediaTypeID);

            try
            {
                if (mtype == MediaTypes.Image)
                {
                        bmp = (BitmapImage)Utils.GetImage(new Uri(ciData.MediaBlobURL));
                }
                else
                {
                        bmp = Utils.GenerateScreenshot(ciData.MediaBlobURL);
                }
            }
            catch (UriFormatException e)
            {
                Console.WriteLine(e.Message);
                bmp = null;
            }
            return bmp;
        }

        /// <summary>
        /// Create BitmapSource from internet video
        /// </summary>
        /// <param name="mediasrc">string conainind video url</param>
        /// <returns>BitmapSource with </returns>
        private static BitmapSource CreateBitmapSourceFromInternetVideo(string mediasrc)
        {
            // determine video provider:
            // currently available providers are:
            // YouTube and Vimeo
            Regex YouTubeRegex = new Regex(@"youtu(?:\.be|be\.com)/(?:.*v(?:/|=)|(?:.*/)?)([a-zA-Z0-9-_]+)");
            Match YouTubeMatch = YouTubeRegex.Match(mediasrc.ToString());

            if (YouTubeMatch.Success)
            {
                // Return Youtube thumbnail
                return GetThumbBitmapFromYT(YouTubeMatch.Groups[1].Value);
            }

            Regex VimeoRegex = new Regex(@"vimeo\.com/(?:.*#|.*videos/|.*video/)?([0-9]+)");
            Match VimeoMatch = VimeoRegex.Match(mediasrc.ToString());

            if (VimeoMatch.Success)
            {
                // Return Vimeo thumbnail
                return GetThumbBitmapFromVimeo(VimeoMatch.Groups[1].Value);
            }
            
            // cannon determine provider
            return null;


        }

        /// <summary>
        /// Resize given image to the specified size
        /// </summary>
        /// <param name="photo">Source BitmapFrame to resize</param>
        /// <param name="resultSize">Size of the resulting BitmapFrame</param>
        /// <returns>Resized BitmapFrame with given dimensions</returns>
        internal static BitmapSource ResizeBitmapSource(BitmapSource sourceBitmap, Size resultSize)
        {
            // Creating new bitmap and DrawingVisual. The only supported PixelFormat is Pbgra32.
            var target = new RenderTargetBitmap((int)resultSize.Width, (int)resultSize.Height, 96, 96, PixelFormats.Pbgra32);
            var tVisual = new DrawingVisual();

            using (var tContext = tVisual.RenderOpen())
            {
                // creating Drawing Group
                var group = new DrawingGroup();

                // Set scaling mode (HighQuality = Fant = 2)
                RenderOptions.SetBitmapScalingMode(group, BitmapScalingMode.Fant);

                // Adding source image to the group
                group.Children.Add(new ImageDrawing(sourceBitmap, new Rect(0, 0, resultSize.Width, resultSize.Height)));
                tContext.DrawDrawing(group);
            }

            target.Render(tVisual);

            return target;
        }


        /// <summary>
        /// Creates Bitmap screenshot of Visual object
        /// </summary>
        /// <param name="renderSize">Rendering size of Visual Object</param>
        /// <param name="visualToRender">Visual element to make picture from</param>
        /// <returns>BitmapSource with picture of the Visual</returns>
        internal static BitmapSource CreateBitmapSourceFromVisual(Size renderSize, Visual visualToRender)
        {
            var rtBitmap = new RenderTargetBitmap((Int32)Math.Ceiling(renderSize.Width),
                            (Int32)Math.Ceiling(renderSize.Height), 96, 96, PixelFormats.Pbgra32);
            var dVisual = new DrawingVisual();

            using (var dContext = dVisual.RenderOpen())
            {
                var vb = new VisualBrush(visualToRender);
                dContext.DrawRectangle(vb, null, new Rect(renderSize));
            }

            rtBitmap.Render(dVisual);

            return rtBitmap;
        }

        /// <summary>
        /// Creates array of bitmap sources of the specified sizes
        /// </summary>
        /// <param name="bmpSource">BitmapSource of the original image</param>
        /// <param name="szsOut">Array with Size elements of resulting images</param>
        /// <returns>Array of resized BitmapSource objects</returns>
        private static BitmapSource[] CreateResizedBitmapSources(BitmapSource bmpSource, Size[] szsOut)
        {
            BitmapSource[] bitmapArray = new BitmapSource[szsOut.Length];

            for (var p = 0; p < szsOut.Length; p++)
            {
                bitmapArray[p] = ResizeBitmapSource(bmpSource, szsOut[p]);
            }

            return bitmapArray;
        }

        /// <summary>
        /// Get YouTube thumbnail of the video with specified ID 
        /// </summary>
        /// <param name="id">Id of the video to get thumbnail of</param>
        /// <returns>BitmapSource of the preview</returns>
        internal static BitmapSource GetThumbBitmapFromYT(string id)
        {
            XmlDocument doc = new XmlDocument();
            
            XmlNamespaceManager ns = new XmlNamespaceManager(doc.NameTable);
            doc.Load("http://gdata.youtube.com/feeds/api/videos/" + id);

            ns.AddNamespace("", "http://www.w3.org/2005/Atom");
            ns.AddNamespace("media", "http://search.yahoo.com/mrss/");
            ns.PushScope();
            
            XmlElement root = doc.DocumentElement;
            XmlNodeList list = root.ChildNodes;

            string videoThumbUrl;
            foreach (XmlNode node in list)
            {
                if (node.Name == "media:group")
                {
                    XmlNode thumbnail = node.SelectSingleNode("media:thumbnail", ns);
                    videoThumbUrl = thumbnail.Attributes["url"].Value;

                    return Utils.GetImage(new Uri(videoThumbUrl));
                }
            }
            
            return null;
        }

        /// <summary>
        /// Get BitmapSource of vimeo video large thumbnail
        /// </summary>
        /// <param name="id">id of the video</param>
        /// <returns>BitmapSource with thumbnail</returns>
        internal static BitmapSource GetThumbBitmapFromVimeo(string id)
        {
            try
            {
                // Fetching XML with video data
                XmlDocument doc = new XmlDocument();
                doc.Load("http://vimeo.com/api/v2/video/" + id + ".xml");

                // Parse document and find large thumbnail
                XmlElement root = doc.DocumentElement;
                string vimeoThumb = root.FirstChild.SelectSingleNode("thumbnail_large").ChildNodes[0].Value;

                return Utils.GetImage(new Uri(vimeoThumb));
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return null;
        }

        /// <summary>
        /// Generates name for thumbnails
        /// </summary>
        /// <param name="id">Id of the file</param>
        /// <param name="relativedir">relative dir where to put the file</param>
        /// <returns></returns>
        public static string GenerateThumbnailUrlString(Guid id, string relativedir)
        {
            return "x" + relativedir + @"\" + id.ToString() + ".png";
        }
    }
}
