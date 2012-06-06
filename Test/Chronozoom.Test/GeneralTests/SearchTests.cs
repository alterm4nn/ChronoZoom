using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Chronozoom.Test.Components;
using Chronozoom.Test.Auxiliary;
using System.IO;
using System.Threading;
using System.Drawing;
using System.Drawing.Imaging;
using System.Text.RegularExpressions;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium.Interactions;

namespace Chronozoom.Test.GeneralTests
{
    [TestClass]
    [TestPage(CzCommon.CzBetaStartPage)]
    public abstract class SearchTests : CzTestBase
    {
        // Set RandomRegimeOn to true or false. If it's true, then the test checks NumberOfSearchQueries random existent titles.
        // If it's false, then the test checks the range of titles, starting from StartIndex. The length of range is NumberOfSearchQueries.
        private const bool RandomRegimeOn = false;
        private const int NumberOfSearchQueries = 5;
        private const int StartIndex = 0;

        private const string ResponseDumpPath = "../../../../Source/Chronozoom.UI/ResponseDump.txt";
        private const string SearchResultXPath = ".//*[@class = 'searchResult'][1]";
        private const int WaitResultsMs = 3000;
        private const int WaitSearchMenuExpandingMs = 1000;
        private const int WaitTimeOutMs = 1000;
        private const string alertString = "ALERT_";

        private VirtualCanvasComponent vcPageObj;
        private ActionsExtension action;

        [TestInitialize]
        public void TestInitialize()
        {
            GoToUrl();
            vcPageObj = new VirtualCanvasComponent(Driver);
            vcPageObj.WaitContentLoading();
        }

        [TestCleanup]
        public void TestCleanup()
        {
            if (action != null)
            {
                action.SetDefault();
            }
        }

        [TestMethod]
        public void TestSearch_SearchQueries_ScreenshotsCreated()
        {
            // Get titles.
            string[] titles = GetTitlesFromResponseDump();

            // Get random titles or range of titles from collection.
            List<string> searchQueries = (RandomRegimeOn) ? GetRandomTitles(titles) : GetRangeOfTitles(titles);

            // Click on the Search button and wait until it expands.
            vcPageObj.SearchButton.Click();
            Thread.Sleep(WaitSearchMenuExpandingMs);

            action = new ActionsExtension(Driver);

            // Regular expression to remove invalid filename characters of screenshots.
            string invalidFileNameChars = new string(Path.GetInvalidFileNameChars());
            Regex regex = new Regex(string.Format("[{0}]", Regex.Escape(invalidFileNameChars)));

            // For alert handling.
            IAlert alert = null;
            bool alertIsActive = false;

            // Enter search queries and click on them.
            foreach (string query in searchQueries)
            {
                alertIsActive = false;

                vcPageObj.EnterSearchQuery(query);
                Thread.Sleep(WaitResultsMs);

                // Move mouse arrow to result and click on it.
                WebDriverWait wait = new WebDriverWait(Driver, TimeSpan.FromMilliseconds(WaitTimeOutMs));

                try
                {
                    IWebElement result = wait.Until<IWebElement>((d) =>
                    {
                        // Return dynamically created search result.
                        return Driver.FindElement(By.XPath(SearchResultXPath));
                    });

                    action.Click(result).Perform();
                    vcPageObj.WaitAnimation();
                }
                catch (TimeoutException)
                {
                    Console.WriteLine("NOT FOUND: " + query);
                }

                // Handling of alert messages.
                try
                {
                    alert = Driver.SwitchTo().Alert();
                    alertIsActive = true;
                    alert.Accept();
                    Console.WriteLine("ALERT: " + query);
                }
                catch (NoAlertPresentException)
                {
                    Console.WriteLine("OK: " + query);
                }

                // Save screenshot of search result. If alert had appeared, then add special string to filename of screenshot.
                // NOTE: Uses user environment variable SELENIUM_SCR.
                if (alertIsActive)
                {
                    WebDriverScreenshotMaker.SaveScreenshot(Driver, "TestSearch", alertString + regex.Replace(query, ""), ImageFormat.Png, true);
                }
                else
                {
                    WebDriverScreenshotMaker.SaveScreenshot(Driver, "TestSearch", regex.Replace(query, ""), ImageFormat.Png, true);
                }

                action.SetDefault();
                vcPageObj.ClearSearchTextBox();
            }
        }

        private string[] GetTitlesFromResponseDump()
        {
            string response = String.Empty;

            using (StreamReader reader = new StreamReader(ResponseDumpPath))
            {
                response = reader.ReadLine();
            }

            // Split response on more simple strings.
            var subStrings = response.Split(',');

            // Get strings, that starts from "Title".
            var titleStrings = from subString in subStrings
                               where subString.StartsWith("\"Title\"")
                               select subString;

            // Get titles without quotes.
            return (from titleString in titleStrings
                    let keyValue = titleString.Split(':')
                    let titleWithQuotes = (keyValue.Length == 3) ? (keyValue[1] + ':' + keyValue[2]) : keyValue[1] // Does title contain ':'?
                    let titleWithoutQuotes = titleWithQuotes.Split('"')[1]
                    select titleWithoutQuotes).ToArray<string>();
        }

        private List<string> GetRandomTitles(string[] titles)
        {
            // Choose random titles from title collection.
            List<string> searchQueries = new List<string>();
            int numberOfTitles = titles.Length;
            Random randomIndex = new Random((int)DateTime.Now.Ticks);

            for (int i = 0; i < NumberOfSearchQueries; ++i)
            {
                searchQueries.Add(titles[randomIndex.Next(numberOfTitles)]);
            }

            return searchQueries;
        }

        private List<string> GetRangeOfTitles(string[] titles)
        {
            // Get the range of titles.
            List<string> searchQueries = new List<string>();
            int endIndex = StartIndex + NumberOfSearchQueries;

            for (int i = StartIndex; i < endIndex; ++i)
            {
                searchQueries.Add(titles[i]);
            }

            return searchQueries;
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class SearchTests_Firefox : SearchTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class SearchTests_IE : SearchTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}
