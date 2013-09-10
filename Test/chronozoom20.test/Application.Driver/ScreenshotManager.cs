using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.IO;
using OpenQA.Selenium;

namespace Application.Driver
{
    public class ScreenshotManager
    {
        public static IWebDriver WebDriver
        {
            get { return DriverManager.GetEnvironmentInstance().GetDriver(); }
        }
        public static List<TempScreenshot> Screenshots { get; set; }
        public ScreenshotManager()
        {
            Screenshots = new List<TempScreenshot>();
        }

        public void SaveScreenshots(string testDeploymentDir)
        {
            foreach (var screenshot in Screenshots)
            {
                var filePath = Path.Combine(testDeploymentDir, screenshot.Guid + ".png");
                screenshot.Screenshot.SaveAsFile(filePath, ImageFormat.Png);
            }
        }

        public static void AddScreenshot(string guid, Screenshot screenshot)
        {
            Screenshots.Add(new TempScreenshot { Guid = guid, Screenshot = screenshot });
        }

        public static void TakeScreenshot(Guid guid)
        {
            try
            {
                IAlert alert = WebDriver.SwitchTo().Alert();
                Logger.Log("Unexpected alert with text: '" + alert.Text + "' is presented", LogType.MessageWithoutScreenshot);
                alert.Accept();
            }
            catch (NoAlertPresentException)
            {

            }
            Screenshot ss = ((ITakesScreenshot)WebDriver).GetScreenshot();
            AddScreenshot(guid.ToString(), ss);
        }

        public static Screenshot GetScreenshot()
        {
            return ((ITakesScreenshot)WebDriver).GetScreenshot();
        }
    }

    public class TempScreenshot
    {
        public string Guid { get; set; }
        public Screenshot Screenshot { get; set; }
    }
}