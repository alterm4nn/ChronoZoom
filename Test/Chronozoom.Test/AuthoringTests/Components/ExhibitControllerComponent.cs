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
    /// Page object for Exhibit Controller of AuthoringTool.
    /// </summary>  
    class ExhibitControllerComponent
    {
        #region Constants

        // URL of Create page for Exhibit Controller
        private const string URL = "http://localhost:44625/Exhibit/Create";
        // GUID of threshold "Threshold 1: Origins of The Universe"
        private const string OriginsOfTheUniverse = "2de9789d-41f0-445a-9526-3c673a599cf7";
        // GUID of regime "Cosmos"
        private const string Cosmos = "cff9c564-93f1-432c-b171-569499b26ab5";
        // Title for test exhibit for easy search.
        private const string Title = "@@@TestExhibit";
        // Loading time to be sure that all page elements were loaded.
        private const int LoadingTime = 2000;

        #endregion Constants

        private readonly IWebDriver exhibitCreateController;

        #region Fields

        [FindsBy(How = How.Id, Using = "Title")]
        public readonly IWebElement title;

        [FindsBy(How = How.Id, Using = "ThresholdID")]
        public readonly IWebElement thresholdID;

        [FindsBy(How = How.Id, Using = "RegimeID")]
        public readonly IWebElement regimeID;

        [FindsBy(How = How.Id, Using = "ContentYear")]
        public readonly IWebElement contentYear;

        [FindsBy(How = How.Id, Using = "TimeUnitID")]
        public readonly IWebElement timeUnit;

        [FindsBy(How = How.XPath, Using = "//p/input")] 
        public readonly IWebElement submit;

        #endregion Fields

        public ExhibitControllerComponent(IWebDriver driver)
        {
            exhibitCreateController = driver;
            exhibitCreateController.Navigate().GoToUrl(URL);

            title = null;
            thresholdID = null;
            regimeID = null;
            contentYear = null;
            timeUnit = null;
            submit = null;
            
            // Wait for few moments to be sure that all page elements were loaded.
            Thread.Sleep(LoadingTime);
            PageFactory.InitElements(exhibitCreateController, this);
        }

        /// <summary>
        /// Creates new exhibit. Title is "@@@TestExhibit", regime "Cosmos", threshold "Threshold 1: Origins of The Universe".
        /// </summary>
        /// <param name="date">Date of exhibit</param>
        /// <param name="tUnit">Time unit of date</param>
        /// /// <returns>Return true if exhibit was created, otherwise return false.</returns>
        public bool Create(string date, string tUnit)
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
            
            // Fill exhibit's date field.
            contentYear.SendKeys(date);

            // Fill exhibit's time unit field.
            foreach (IWebElement option in timeUnit.FindElements(By.TagName("option")))
            {
                if (option.GetAttribute("value").Equals(tUnit))
                {
                    option.Click();
                    break;
                }
            }

            // Submit exhibit.
            submit.Click();

            // Wait for service's reaction on submitting of this exhibit. 
            Thread.Sleep(LoadingTime);

            // If submit wasn't succesful, then current page would stay, return false.
            // Otherwise, browser will be redirected to the page with all exhibits, return true.
            if (exhibitCreateController.Url == URL)
                return false;
            return true;
        }
    }
}
