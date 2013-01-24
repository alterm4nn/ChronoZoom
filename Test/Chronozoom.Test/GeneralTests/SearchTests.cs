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
        private const int NumberOfSearchQueries = 42;
        private const int StartIndex = 725;

        private const string ResponseDumpPath = "../../../../Source/Chronozoom.UI/ResponseDump.txt";
        private const string SearchResultXPath = ".//*[@class = 'searchResult'][1]";
        private const int WaitResultsMs = 3000;
        private const int WaitSearchMenuExpandingMs = 1000;
        private const int WaitTimeOutMs = 3000;
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
            string[] titles = GetExistentTitlesFromResponseDump();
            Console.WriteLine(titles.Length); // The number of titles.

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

                vcPageObj.EnterSearchQuery(query.Replace(@"\/", "/").Replace("\\\"", "\"")); // Replace escape sequences in titles.
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
                catch (StaleElementReferenceException e)
                {
                    Console.WriteLine(e.Message + ": " + query);
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

        // Gets all titles from response dump, including titles of sources, etc.
        private string[] GetAllTitlesFromResponseDump()
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
                    let titleWithoutQuotes = titleWithQuotes.Substring(1, titleWithQuotes.Length - 2) // Remove quotes.
                    select titleWithoutQuotes).ToArray<string>();
        }

        // Gets all titles of timelines, exhibits and content items (excluding sources' titles).
        // TODO: exclude more titles, if necessary.
        private string[] GetExistentTitlesFromResponseDump()
        {
            string response = String.Empty;

            using (StreamReader reader = new StreamReader(ResponseDumpPath))
            {
                response = reader.ReadLine();
            }

            // Split response on more simple strings and remove nonexistent title strings.
            // It's noticable, that nonexistent title strings go after "Source" strings.
            var subStrings = response.Split(',');
            int numberOfSubStrings = subStrings.Length;

            for (int i = 0; i < numberOfSubStrings; ++i)
            {
                if (subStrings[i].StartsWith("\"Source\""))
                {
                    subStrings[i + 1] = String.Empty;
                }
            }

            // Get strings, that starts from "Title".
            var titleStrings = from subString in subStrings
                               where subString.StartsWith("\"Title\"")
                               select subString;

            // Get titles without quotes.
            return (from titleString in titleStrings
                    let keyValue = titleString.Split(':')
                    let titleWithQuotes = (keyValue.Length == 3) ? (keyValue[1] + ':' + keyValue[2]) : keyValue[1] // Does title contain ':'?
                    let titleWithoutQuotes = titleWithQuotes.Substring(1, titleWithQuotes.Length - 2) // Remove quotes.
                    //let titleWithoutQuotes = titleWithQuotes.Split('"')[1]
                    select titleWithoutQuotes).ToArray<string>();
        }

        // Gets random titles from titles collection.
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

        // Gets range of titles from titles collection.
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

        private bool IsElementOnCanvas(string id)
        {
            return vcPageObj.FindElement(id) != null;
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
