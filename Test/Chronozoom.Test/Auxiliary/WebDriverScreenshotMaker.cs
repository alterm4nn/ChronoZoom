using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing.Imaging;
using OpenQA.Selenium;
using System.IO;
using System.Text.RegularExpressions;

namespace Chronozoom.Test.Auxiliary
{
    /// <summary>
    /// This static class provides SaveScreenshot methods for saving screenshots.
    /// </summary>
    public static class WebDriverScreenshotMaker
    {
        public static string ScreenshotsEnvironment { get; set; }

        static WebDriverScreenshotMaker()
        {
            ScreenshotsEnvironment = "SELENIUM_SCR";
        }

        // Auxiliary collection with extension strings.
        private static class FormatsDictionary
        {
            public static Dictionary<ImageFormat, string> Format = new Dictionary<ImageFormat, string>();

            // Some of the extension strings can be wrong.
            static FormatsDictionary()
            {
                Format.Add(ImageFormat.Bmp, ".bmp");
                Format.Add(ImageFormat.Emf, ".emf");
                Format.Add(ImageFormat.Exif, ".exif");
                Format.Add(ImageFormat.Gif, ".gif");
                Format.Add(ImageFormat.Icon, ".ico");
                Format.Add(ImageFormat.Jpeg, ".jpeg");
                Format.Add(ImageFormat.Png, ".png");
                Format.Add(ImageFormat.Tiff, ".tiff");
                Format.Add(ImageFormat.Wmf, ".wmf");
            }
        }

        #region Main Methods

        /// <summary>
        /// Saves a screenshot to file.
        /// </summary>
        /// <param name="driver">Webdriver object.</param>
        /// <param name="dirPath">A path of directory with screenshots.</param>
        /// <example name="dirPath">"Screenshots\\"</example>
        /// <param name="scrName">A name of screenshot file.</param>
        /// <param name="format">An extension of screenshot file.</param>
        public static void SaveScreenshot(IWebDriver driver, string dirPath, string scrName, ImageFormat format)
        {
            ITakesScreenshot scrDriver = driver as ITakesScreenshot;

            if (Directory.Exists(dirPath) == false && dirPath != String.Empty)
            {
                throw new DirectoryNotFoundException("This directory of screenshots doesn't exist.");
            }

            if (scrDriver == null)
            {
                throw new Exception("WebDriver argument is null or it's impossible to cast it to ITakesScreenshot.");
            }

            Screenshot scr = scrDriver.GetScreenshot();
            string ext = GetScreenshotExtensionString(format);
            int id = GetScreenshotId(dirPath, scrName, ext);

            string fileName = new StringBuilder(dirPath).Append(scrName).Append(id).Append(ext).ToString();

            scr.SaveAsFile(fileName, format);
        }

        /// <summary>
        /// Saves a screenshot to file. It uses environment variable to take
        /// a path of directory with screenshots. Name of environment variable
        /// is defined by ScreenshotsDirectory property, that is SELENIUM_SCR
        /// by default. It must be user's environment variable.
        /// </summary>
        /// <param name="driver">Webdriver object.</param>
        /// <param name="scrName">A name of screenshot file.</param>
        /// <param name="format">An extension of screenshot file.</param>
        public static void SaveScreenshot(IWebDriver driver, string scrName, ImageFormat format)
        {
            string dirPath = Environment.GetEnvironmentVariable(ScreenshotsEnvironment, EnvironmentVariableTarget.User);
            ITakesScreenshot scrDriver = driver as ITakesScreenshot;

            if (dirPath == String.Empty || dirPath == null)
            {
                throw new Exception("There is no environment variable with this name or it's empty: " + ScreenshotsEnvironment);
            }

            if (Directory.Exists(dirPath) == false)
            {
                throw new DirectoryNotFoundException("This directory of screenshots doesn't exist.");
            }

            if (scrDriver == null)
            {
                throw new Exception("WebDriver argument is null or it's impossible to cast it to ITakesScreenshot.");
            }

            Screenshot scr = scrDriver.GetScreenshot();
            string ext = GetScreenshotExtensionString(format);
            int id = GetScreenshotId(dirPath, scrName, ext);

            string fileName = new StringBuilder(dirPath).Append(scrName).Append(id).Append(ext).ToString();

            scr.SaveAsFile(fileName, format);
        }

        /// <summary>
        /// Saves a screenshot to file. It uses name of suite for storing screenshots
        /// for each test in order. Name of suite always has the unique ID. Screenshot
        /// name isn't unique and it describes a situation/action, that captured by screenshot.
        /// </summary>
        /// <param name="driver">Webdriver object.</param>
        /// <param name="dirPath">A path of directory with screenshots.</param>
        /// <example name="dirPath">"Screenshots\\"</example>
        /// <param name="suiteName">A name of suite, that contains associate screenshots.</param>
        /// <param name="scrName">A name of screenshot file.</param>
        /// <param name="format">An extension of screenshot file.</param>
        /// <param name="createDir">If it's true, then the directory for suite will be created.</param>
        public static void SaveScreenshot(IWebDriver driver, string dirPath, string suiteName, string scrName, ImageFormat format, bool createDir)
        {
            ITakesScreenshot scrDriver = driver as ITakesScreenshot;

            if (Directory.Exists(dirPath) == false)
            {
                throw new DirectoryNotFoundException("This directory of screenshots doesn't exist.");
            }

            if (scrDriver == null)
            {
                throw new Exception("WebDriver argument is null or it's impossible to cast it to ITakesScreenshot.");
            }

            if (Directory.Exists(dirPath + suiteName) && createDir)
            {
                dirPath += suiteName + '/';
            }
            else if (createDir)
            {
                dirPath += suiteName + '/';
                Directory.CreateDirectory(dirPath);
            }

            Screenshot scr = scrDriver.GetScreenshot();
            string ext = GetScreenshotExtensionString(format);
            int id = GetScreenshotId(dirPath, suiteName, scrName, ext);

            string fileName =
                new StringBuilder(dirPath).Append(suiteName).Append(id).Append('_').Append(scrName).Append(ext).ToString();

            scr.SaveAsFile(fileName, format);
        }

        /// <summary>
        /// Saves a screenshot to file. It uses name of suite for storing screenshots
        /// for each test in order. Name of suite always has the unique ID. Screenshot
        /// name isn't unique and it describes a situation/action, that captured by screenshot.
        /// It also uses environment variable to take a path of directory with
        /// screenshots. Name of environment variable is defined by ScreenshotsDirectory
        /// property, that is SELENIUM_SCR by default. It must be user's environment variable.
        /// </summary>
        /// <param name="driver">Webdriver object.</param>
        /// <param name="suiteName">A name of suite, that contains associate screenshots.</param>
        /// <param name="scrName">A name of screenshot file.</param>
        /// <param name="format">An extension of screenshot file.</param>
        /// <param name="createDir">If it's true, then the directory for suite will be created.</param>
        public static void SaveScreenshot(IWebDriver driver, string suiteName, string scrName, ImageFormat format, bool createDir)
        {
            string dirPath = Environment.GetEnvironmentVariable(ScreenshotsEnvironment, EnvironmentVariableTarget.User);
            ITakesScreenshot scrDriver = driver as ITakesScreenshot;

            if (dirPath == String.Empty)
            {
                throw new Exception("There is no environment variable with this name or it's empty: " + ScreenshotsEnvironment);
            }

            if (Directory.Exists(dirPath) == false)
            {
                throw new DirectoryNotFoundException("This directory of screenshots doesn't exist.");
            }

            if (scrDriver == null)
            {
                throw new Exception("WebDriver argument is null or it's impossible to cast it to ITakesScreenshot.");
            }

            if (Directory.Exists(dirPath + suiteName) && createDir)
            {
                dirPath += suiteName + "/";
            }
            else if (createDir)
            {
                dirPath += suiteName + "/";
                Directory.CreateDirectory(dirPath);
            }

            Screenshot scr = scrDriver.GetScreenshot();
            string ext = GetScreenshotExtensionString(format);
            int id = GetScreenshotId(dirPath, suiteName, scrName, ext);

            string fileName =
                new StringBuilder(dirPath).Append(suiteName).Append(id).Append('_').Append(scrName).Append(ext).ToString();

            scr.SaveAsFile(fileName, format);
        }

        #endregion Main Methods

        #region Private Methods

        // Finds max ID of file with given name and returns (max ID + 1).
        private static int GetScreenshotId(string dirPath, string scrName, string ext)
        {
            string searchPattern = new StringBuilder(scrName).Append('*').Append(ext).ToString();
            List<string> files = new List<string>(Directory.GetFiles(dirPath, searchPattern, SearchOption.TopDirectoryOnly));
            int id = 1;

            // If files are found.
            if (files.Count != 0)
            {
                // Find the max ID.
                id = files.Max<string>((fullPath) =>
                {
                    string fileName = Path.GetFileName(fullPath);
                    string idString = Regex.Match(fileName, @"[\d]+", RegexOptions.RightToLeft).Value; // Find the most right number in filename.

                    return Int32.Parse(idString);
                });

                return ++id;
            }

            return id;
        }

        private static int GetScreenshotId(string dirPath, string suiteName, string scrName, string ext)
        {
            string searchPattern = new StringBuilder(suiteName).Append('*').Append(scrName).Append(ext).ToString();
            List<string> files = new List<string>(Directory.GetFiles(dirPath, searchPattern, SearchOption.TopDirectoryOnly));
            int id = 1;

            // If files are found.
            if (files.Count != 0)
            {
                // Find the max ID.
                id = files.Max<string>((fullPath) =>
                {
                    string fileName = Path.GetFileName(fullPath);
                    string idString = Regex.Match(fileName, @"[\d]+").Value; // Find the most left number in filename.

                    return Int32.Parse(idString);
                });

                return ++id;
            }

            return id;
        }

        // Gets an extension's string of screenshot file.
        private static string GetScreenshotExtensionString(ImageFormat format)
        {
            return FormatsDictionary.Format[format];
        }

        #endregion Private Methods
    }
}
