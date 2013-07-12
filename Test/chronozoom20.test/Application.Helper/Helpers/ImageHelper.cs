using System.Drawing;
using System.IO;
using Application.Driver;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class ImageHelper : DependentActions
    {
        public void ClickOnBibliographyImage()
        {
            const string targetImagePath = Constants.ImageTemplateFilesLocations.ImageTemplatesPath + "Bibliography.png";
            Sleep(10);
            Screenshot screenshotString = ScreenshotManager.GetScreenshot();
            MemoryStream streamBitmap = new MemoryStream(screenshotString.AsByteArray);
            Bitmap sourceImage = new Bitmap(Image.FromStream(streamBitmap));
            //Point coordinate = ImageSearchEngine.ImageCoordinateFinder.GetTargetImagePosition(sourceImage, targetImagePath);
            Rectangle searchArea = GetBibliographySearchArea();
            Point coordinate = ImageSearchEngine.AForgeImageCoordinateFinder.FindImage(sourceImage, targetImagePath, searchArea);
            ClickByCoordinates(coordinate.X + 1, coordinate.Y + 1);
        }

        private Rectangle GetBibliographySearchArea()
        {
            IWebElement screen = FindElement(By.TagName("body"));
            int x = screen.Size.Width / 3;
            int y = 2 * screen.Size.Height / 3;
            int width = x;
            int height = screen.Size.Height / 3;
            Rectangle searchArea = new Rectangle(x, y, width, height);
            return searchArea;
        }
    }
}
