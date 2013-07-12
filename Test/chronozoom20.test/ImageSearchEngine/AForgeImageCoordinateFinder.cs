using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using AForge.Imaging;
using Image = System.Drawing.Image;

namespace ImageSearchEngine
{
    public class AForgeImageCoordinateFinder
    {
            public static Point FindImage(Bitmap sourceImage, string targetImagePath)
            {
                return FindImage(sourceImage, targetImagePath, new Rectangle(0, 0, 0, 0));
            }

            public static Point FindImage(Bitmap sourceImage, string targetImagePath, Rectangle searchArea)
            {
                if (!File.Exists(targetImagePath))
                {
                    throw new FileNotFoundException();
                }
                Bitmap targetImage = (Bitmap)Image.FromFile(targetImagePath);
                ExhaustiveTemplateMatching tm = new ExhaustiveTemplateMatching(0.921f);
                if (sourceImage.PixelFormat != PixelFormat.Format24bppRgb)
                {
                    sourceImage = ChangePixelFormat(sourceImage);
                }
                if (targetImage.PixelFormat != PixelFormat.Format24bppRgb)
                {
                    targetImage = ChangePixelFormat(targetImage);
                }
                TemplateMatch[] matchings = searchArea == new Rectangle(0, 0, 0, 0) ? tm.ProcessImage(sourceImage, targetImage) : tm.ProcessImage(sourceImage, targetImage, searchArea);
                return matchings.Length == 1 ? matchings[0].Rectangle.Location : new Point();
            }

            private static Bitmap ChangePixelFormat(Bitmap inputOriginalImage)
            {
                Bitmap resultingImage = new Bitmap(inputOriginalImage.Width, inputOriginalImage.Height, PixelFormat.Format24bppRgb);
                using (Graphics g = Graphics.FromImage(resultingImage))
                {
                    g.DrawImage(inputOriginalImage, 0, 0);
                }
                return resultingImage;
            }
        
    }
}