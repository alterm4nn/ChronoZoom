using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;
using ImageSearchEngine.CustomExceptions;

namespace ImageSearchEngine
{
    public class ImageCoordinateFinder
    {
        public static Point GetTargetImagePosition(Bitmap sourceImage, string targetImagePath)
        {
            if (!File.Exists(targetImagePath))
            {
                throw new FileNotFoundException();
            }
            Bitmap targetImage = (Bitmap)Image.FromFile(targetImagePath);
            return GetTargetImagePosition(sourceImage, targetImage);
        }

        public static Point GetTargetImagePosition(Bitmap sourceImage, Bitmap targetImage)
        {
            List<Point> startAndEndPoints = new List<Point>();
            int mainImageHeight = sourceImage.Height;
            int subImageWidth = targetImage.Width;
            int subImageHeight = targetImage.Height;
            int maxWidthForSearch = sourceImage.Width - targetImage.Width;
            int maxHeightForSearch = sourceImage.Height - targetImage.Height;

            BitmapData mainImageData = sourceImage.LockBits(new Rectangle(new Point(0, 0), sourceImage.Size), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            BitmapData subImageData = targetImage.LockBits(new Rectangle(new Point(0, 0), targetImage.Size), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);

            List<Point> firstIterationPoints = new List<Point>
                {
                    new Point(0, 0),
                    new Point(0, subImageHeight - 1),
                    new Point(subImageWidth - 1, 0),
                    new Point(subImageWidth - 1, subImageHeight - 1),
                    new Point(subImageWidth/2, subImageHeight/2)
                };

            int bytesMain = Math.Abs(mainImageData.Stride) * mainImageHeight;
            int strideMain = mainImageData.Stride;
            IntPtr scan0Main = mainImageData.Scan0;
            byte[] dataMain = new byte[bytesMain];
            Marshal.Copy(scan0Main, dataMain, 0, bytesMain);

            int bytesSub = Math.Abs(subImageData.Stride) * subImageHeight;
            int strideSub = subImageData.Stride;
            IntPtr scan0Sub = subImageData.Scan0;
            byte[] dataSub = new byte[bytesSub];
            Marshal.Copy(scan0Sub, dataSub, 0, bytesSub);
            List<Point> secondIterationPoints = GetAllPoints(subImageWidth, subImageHeight);
            bool isResultPassed = false;

            for (int y = 0; y <= maxHeightForSearch && !isResultPassed; y++)
            {
                for (int x = 0; x <= maxWidthForSearch && !isResultPassed; x++)
                {
                    bool firstIterationresult = FirstIteration(firstIterationPoints, x, y, strideMain, dataMain, strideSub, dataSub);
                    if (firstIterationresult)
                    {
                        isResultPassed = SecondIteration(secondIterationPoints, x, y, strideMain, dataMain, strideSub,
                                                         dataSub);
                        if (isResultPassed)
                        {
                            startAndEndPoints.Add(new Point(x, y));
                        }
                    }
                }
            }

            Marshal.Copy(dataSub, 0, scan0Sub, bytesSub);
            targetImage.UnlockBits(subImageData);

            Marshal.Copy(dataMain, 0, scan0Main, bytesMain);
            sourceImage.UnlockBits(mainImageData);
            if (startAndEndPoints.Count == 0)
            {
                throw new ImageNotFoundException("Target image is not found.");
            }
            return startAndEndPoints[0];

        }

        private static List<Point> GetAllPoints(int subImageWidth, int subImageHeight)
        {
            List<Point> points = new List<Point>();
            for (int y = 0; y < subImageHeight; y++)
            {
                for (int x = 0; x < subImageWidth; x++)
                {
                    points.Add(new Point(x, y));
                }
            }
            return points;
        }

        private static bool FirstIteration(List<Point> firstIterationPoints, int x, int y, int strideMain, byte[] dataMain, int strideSub, byte[] dataSub)
        {
            int counter = 0;
            bool firstIterationresult = false;
            foreach (Point firstIterationPoint in firstIterationPoints)
            {
                Color mainColor = GetColor(firstIterationPoint.X + x, firstIterationPoint.Y + y, strideMain, dataMain);
                Color subColor = GetColor(firstIterationPoint.X, firstIterationPoint.Y, strideSub, dataSub);

                if (mainColor.Equals(subColor))
                {
                    counter++;
                }
                else
                {
                    break;
                }
            }
            if (counter == firstIterationPoints.Count)
            {
                firstIterationresult = true;
            }
            return firstIterationresult;
        }

        private static bool SecondIteration(List<Point> secondIterationPoints, int x, int y, int strideMain, byte[] dataMain, int strideSub, byte[] dataSub)
        {
            bool secondIterationResult = false;
            int counter = 0;
            foreach (Point secondIterationPoint in secondIterationPoints)
            {

                Color mainColor = GetColor(secondIterationPoint.X + x, secondIterationPoint.Y + y, strideMain, dataMain);
                Color subColor = GetColor(secondIterationPoint.X, secondIterationPoint.Y, strideSub, dataSub);

                if (mainColor.Equals(subColor))
                {
                    counter++;
                }
                else
                {
                    break;
                }
                if (counter == secondIterationPoints.Count)
                {
                    secondIterationResult = true;
                    break;
                }
            }
            return secondIterationResult;
        }

        private static Color GetColor(int x, int y, int stride, byte[] data)
        {
            int pos = y * stride + x * 4;
            byte a = data[pos + 3];
            byte r = data[pos + 2];
            byte g = data[pos + 1];
            byte b = data[pos + 0];
            return Color.FromArgb(a, r, g, b);
        }
    }
}
