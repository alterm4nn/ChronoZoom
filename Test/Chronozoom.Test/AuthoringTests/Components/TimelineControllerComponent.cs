using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium.Support.PageObjects;
using OpenQA.Selenium.Interactions.Internal;
using OpenQA.Selenium.Interactions;
using System.Diagnostics;
using System.Drawing;
using System.Threading;

namespace Chronozoom.Test.AuthoringTests.Components
{
    /// <summary>
    /// Page object for Timeline Controller of AuthoringTool.
    /// </summary>  
    class TimelineControllerComponent
    {
        #region Constants

        // URL of Create page for Timeline Controller
        private const string URL = "http://localhost:44625/Timeline/Create";
        // GUID of threshold "Threshold 1: Origins of The Universe"
        private const string OriginsOfTheUniverse = "2de9789d-41f0-445a-9526-3c673a599cf7";
        // GUID of regime "Cosmos"
        private const string Cosmos = "cff9c564-93f1-432c-b171-569499b26ab5";
        // Title for test timeline for easy search.
        private const string Title = "@@@TestTimeline";
        // Value for height field.
        private const string Height = "10";
        // Loading time to be sure that all page elements were loaded.
        private const int LoadingTime = 2000;

        #endregion Constants

        private readonly IWebDriver timelineCreateController;

        #region Fields

        [FindsBy(How = How.Id, Using = "Title")]
        public readonly IWebElement title;

        [FindsBy(How = How.Id, Using = "ThresholdID")]
        public readonly IWebElement thresholdID;

        [FindsBy(How = How.Id, Using = "RegimeID")]
        public readonly IWebElement regimeID;

        [FindsBy(How = How.Id, Using = "Height")]
        public readonly IWebElement height;

        [FindsBy(How = How.Id, Using = "FromContentYear")]
        public readonly IWebElement fromContentYear;

        [FindsBy(How = How.Id, Using = "FromTimeUnit")]
        public readonly IWebElement fromTimeUnit;

        [FindsBy(How = How.Id, Using = "ToContentYear")]
        public readonly IWebElement toContentYear;

        [FindsBy(How = How.Id, Using = "ToTimeUnit")]
        public readonly IWebElement toTimeUnit;

        [FindsBy(How = How.XPath, Using = "//p/input")] 
        public readonly IWebElement submit;

        #endregion Fields

        public TimelineControllerComponent(IWebDriver driver)
        {
            timelineCreateController = driver;
            timelineCreateController.Navigate().GoToUrl(URL);

            title = null;
            thresholdID = null;
            regimeID = null;
            height = null;
            fromContentYear = null;
            fromTimeUnit = null;
            toContentYear = null;
            toTimeUnit = null;
            submit = null;

            // Wait for few moments to be sure that all page elements were loaded.
            Thread.Sleep(LoadingTime);
            PageFactory.InitElements(timelineCreateController, this);
        }

        /// <summary>
        /// Creates new timeline. Title is "@@@TestExhibit", regime "Cosmos", threshold "Threshold 1: Origins of The Universe", height is 10.
        /// </summary>
        /// <param name="fromDate">Start date of timeline</param>
        /// <param name="fromTU">Time unit of start date</param>
        /// <param name="toDate">End date of timeline</param>
        /// <param name="toTU">Time unit of end date</param>
        /// <returns>Return true if timeline was created, otherwise return false.</returns>
        public bool Create(string fromDate, string fromTU, string toDate, string toTU)
        {
            // Fill title field.
            title.SendKeys(Title);

            // Select thresholdID in select field.
            foreach (IWebElement option in thresholdID.FindElements(By.TagName("option")))
            {
                if (option.GetAttribute("value").Equals(OriginsOfTheUniverse))
                {
                    option.Click();
                    break;
                }
            }

            // Select regime in select field.
            foreach (IWebElement option in regimeID.FindElements(By.TagName("option")))
            {
                if (option.GetAttribute("value").Equals(Cosmos))
                {
                    option.Click();
                    break;
                }
            }

            // Fill height field.
            height.SendKeys(Height);

            // Fill timelines's start date field.
            fromContentYear.SendKeys(fromDate);

            // Fill timelines's start date time unit field.
            foreach (IWebElement option in fromTimeUnit.FindElements(By.TagName("option")))
            {
                if (option.GetAttribute("value").Equals(fromTU))
                {
                    option.Click();
                    break;
                }
            }

            // Fill timelines's end date field.
            toContentYear.SendKeys(toDate);

            // Fill timelines's end date time unit field.
            foreach (IWebElement option in toTimeUnit.FindElements(By.TagName("option")))
            {
                if (option.GetAttribute("value").Equals(toTU))
                {
                    option.Click();
                    break;
                }
            }

            // Submit timeline.
            submit.Click();

            // Wait for service's reaction on submitting of this timeline.
            Thread.Sleep(LoadingTime);

            // If submit wasn't succesful, then current page would stay, return false.
            // Otherwise, browser will be redirected to the page with all timelines, return true. 
            if (timelineCreateController.Url == URL)
                return false;
            return true;
        }
    }
}
