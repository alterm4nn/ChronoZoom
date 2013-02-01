using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.IO;
using OpenQA.Selenium;

namespace Framework
{
    public class ScreenshotManager
    {
        public static IWebDriver WebDriver
        {
            get { return ApplicationManager.GetInstance().GetEnvironment().GetDriver(); }
        }
        public List<TempScreenshot> Screenshots { get; set; }
        public ScreenshotManager()
        {
            Screenshots = new List<TempScreenshot>();
        }

        public void SaveScreenshots(string testDeploymentDir)
        {
            foreach (var screenshot in Screenshots)
            {
                var filePath = Path.Combine(testDeploymentDir, screenshot.Guid + ".png");
                screenshot.Screenshot.SaveAsFile(filePath,ImageFormat.Png);
            }
        }

        public void AddScreenshot(string guid, Screenshot screenshot)
        {
            Screenshots.Add(new TempScreenshot { Guid = guid, Screenshot = screenshot });
        }

        public void TakeScreenshot(Guid guid)
        {
            Screenshot ss = ((ITakesScreenshot)WebDriver).GetScreenshot();
            AddScreenshot(guid.ToString(), ss);
        }
    }

    public class TempScreenshot
    {
        public string Guid { get; set; }
        public Screenshot Screenshot { get; set; }
    }
}