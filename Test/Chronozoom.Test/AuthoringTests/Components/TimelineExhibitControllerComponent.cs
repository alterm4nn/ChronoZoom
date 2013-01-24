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
    /// Page object for TimelineExhibit Controller of AuthoringTool.
    /// </summary>  
    class TimelineExhibitControllerComponent
    {
        #region Constants

        // URL of Create page for TimelineExhibit Controller
        public const string URL = "http://localhost:44625/TimelineExhibit/Create";
        // Loading time to be sure that all page elements were loaded.
        private const int LoadingTime = 2000;

        #endregion Constants

        private readonly IWebDriver timelineExhibitCreateController;

        #region Fields

        [FindsBy(How = How.Id, Using = "TimelineID")]
        public readonly IWebElement timeline;

        [FindsBy(How = How.Id, Using = "ExhibitID")]
        public readonly IWebElement exhibit;

        [FindsBy(How = How.XPath, Using = "//p/input")] 
        public readonly IWebElement submit;

        #endregion Fields

        public TimelineExhibitControllerComponent(IWebDriver driver)
        {
            timelineExhibitCreateController = driver;
            timelineExhibitCreateController.Navigate().GoToUrl(URL);

            timeline = null;
            exhibit = null;
            submit = null;

            // Wait for few moments to be sure that all page elements were loaded.
            Thread.Sleep(LoadingTime);
            PageFactory.InitElements(timelineExhibitCreateController, this);
        }

        /// <summary>
        /// Adds first exhibit in list of all exhbitis to the first timeline in list of all timelines.
        /// Use this method after you have added timeline and exhibit throught methods in TimelineControllerComponents and ExhibitControllerComponents.
        /// </summary>
        /// <returns>Return true if timelineExhibit was created, otherwise return false.</returns>
        public bool Create()
        {
            // Select first timeline in list of all timelines in select timeline field.
            timeline.FindElements(By.TagName("option"))[1].Click();

            // Select first exhibit in list of all exhibits in select exhibit field.
            exhibit.FindElements(By.TagName("option"))[1].Click();

            // Submit timelineExhibit.
            submit.Click();

            // Wait for service's reaction on submitting of this timelineExhibit. 
            Thread.Sleep(LoadingTime);

            // If submit wasn't succesful, then current page would stay, return false.
            // Otherwise, browser will be redirected to the page with all timelineExhibits, return true.
            if (timelineExhibitCreateController.Url == URL)
                return false;
            return true;
        }
    }
}
