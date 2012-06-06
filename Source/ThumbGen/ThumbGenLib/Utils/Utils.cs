using System;
using System.IO;
using System.Net;
using System.Windows.Media.Imaging;
using System.Xml;
using System.Drawing.Imaging;
using System.Windows.Forms;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Windows;
using System.Threading;
using System.Diagnostics;


namespace ThumbGen
{
    public static partial class Utils
    {
        /// <summary>
        /// Loads image from Uri and returns BitmapSource
        /// </summary>
        /// <param name="Url"></param>
        /// <returns></returns>
        public static BitmapSource GetImage(Uri Url)
        {
            var request = WebRequest.CreateDefault(Url);

            var bmp = new BitmapImage();

            byte[] buffer = new byte[4096];

            using (var target = new MemoryStream())
            {
                try
                {
                    using (var response = request.GetResponse())
                    {
                        using (var stream = response.GetResponseStream())
                        {
                            int read;

                            while ((read = stream.Read(buffer, 0, buffer.Length)) > 0)
                            {
                                target.Write(buffer, 0, read);
                            }
                        }

                        bmp.BeginInit();
                        target.Seek(0, SeekOrigin.Begin);
                        bmp.StreamSource = target;
                        bmp.CacheOption = BitmapCacheOption.OnLoad;
                        bmp.EndInit();
                    }
                }
                catch (WebException we)
                {
                    Console.WriteLine(we.Message);
                    return null;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                    return null;
                }
            }

            return bmp;
        }

        public static BitmapSource CreateBitmapSourceFromBitmap(Bitmap bitmap)
        {
            if (bitmap == null)
                throw new ArgumentNullException("bitmap");

            try
            {
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    bitmap.Save(memoryStream, ImageFormat.Png);
                    memoryStream.Seek(0, SeekOrigin.Begin);

                    return CreateBitmapSourceFromBitmap(memoryStream);
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        private static BitmapSource CreateBitmapSourceFromBitmap(Stream stream)
        {
            BitmapDecoder bitmapDecoder = BitmapDecoder.Create(
                stream,
                BitmapCreateOptions.PreservePixelFormat,
                BitmapCacheOption.OnLoad);

            // This will disconnect the stream from the image completely...
            WriteableBitmap writable = new WriteableBitmap(bitmapDecoder.Frames[0]);
            writable.Freeze();

            return writable;
        }

        public static BitmapSource GenerateScreenshot(string url)
        {
            try
            {
                //int width = Screen.PrimaryScreen.Bounds.Width, height = Screen.PrimaryScreen.Bounds.Height;
                int width = 1200, height = 768;
                Bitmap bitmap = null;
                ProcessStartInfo pInfo = new ProcessStartInfo();
                pInfo.FileName = "iexplore.exe";
                pInfo.Arguments = "-k -nohangrecovery " + url;
                Process p = Process.Start(pInfo);
                if (p.Responding)
                {
                    Thread.Sleep(9000);
                    bitmap = new Bitmap(width, height);
                    Graphics gx = Graphics.FromImage(bitmap);
                    gx.CopyFromScreen(0, 0, 0, 0, bitmap.Size);
                    //bitmap.Save("test.png", ImageFormat.Png);
                }

                ProcessStartInfo killInfo = new ProcessStartInfo();
                killInfo.FileName = "taskkill";
                killInfo.Arguments = "/F /IM iexplore.exe ";
                Process killCmd = Process.Start(killInfo);
                return CreateBitmapSourceFromBitmap(bitmap);
            }
            catch
            {
                return null;
            }
        }

 
    }
}
