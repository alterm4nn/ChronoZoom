using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Windows;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using System.Threading;
using Chronozoom.Test.AuthoringTests.Components;

namespace Chronozoom.Test.AuthoringTests
{
    [TestClass]
    [TestPage("http://localhost:44625/Home")]
    public abstract class AuthoringTests : CzTestBase
    {

        #region Constants

        // GUIDs for { 'GA', 'KA', 'MA', "BCE', 'CE' } time units.
        private const string GA = "3af91c99-c88b-4145-bf65-2a2ac77ca9b7";
        private const string MA = "4d4d707a-377a-4620-acd3-92638ea747e8";
        private const string KA = "92792be9-3ff2-4a11-9605-d634bbbb85cc";
        private const string BCE = "ba50c190-6c29-42fd-b54a-30ee4ad004a3";
        private const string CE = "4d0c906c-ff3b-43dd-8da3-04f13b3576e7";
        // Loading time to be sure that all page elements were loaded.
        private const int LoadingTime = 2000;

        #endregion Constants

        // Flag that indicates that infodot was added during last test method run. 
        private int exhibitsAdded = 0;
        // Flag that indicates that timeline was added during last test method run. 
        private int timelinesAdded = 0;
        // Flag that indicates that timelineExhibit was added during last test method run. 
        private int timelineExhibitsAdded = 0;

        private TimelineControllerComponent tcPageObj;
        private ExhibitControllerComponent ecPageObj;
        private TimelineExhibitControllerComponent tecPageObj;

        #region Test initialization and test cleanup

        [TestInitialize]
        public void TestInitialize()
        {
            GoToUrl();

            // Check if logged in or not.
            LogOn();

            // If browser is still on logon page, then logging in wasn't successful, test was failed.
            if (Driver.Url == "http://localhost:44625/Account/LogOn")
                Assert.Fail("Unable to loggin in. Test was failed.");

            // Logged in was successful, now test can be runed.
            Driver.Navigate().GoToUrl("http://localhost:44625/Home");
        }

        [TestCleanup]
        public void TestCleanup()
        {
            // Remove last N added timelines, they are the first in a list of all timeline because of their titles.
            while (timelinesAdded > 0)
            {
                RemoveTimeline();
            }

            // Remove first N exhibits in a list of all exhibits.
            while (exhibitsAdded > 0)
            {
                RemoveExhibit();
            }

            // Remove first timelineExhibit in a list of all timelineExhibits.
            while (timelineExhibitsAdded > 0)
            {
                RemoveTimelineExhibit();
            }
        }

        #endregion Test initialization and test cleanup

        #region Add timeline tests

        /// <summary>
        /// Add timeline from BCE to CE, start and end dates are positive numbers.
        /// </summary>
        [TestMethod]
        public void AddTimeline_BCEtoCE_PositiveDates()
        {
            // Start date in BCE is lower than end date in CE.
            string startDate = "10";
            string endDate = "100";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, CE) == false)
                Assert.Fail("Can't add timeline from " + startDate + " BCE to " + endDate + " CE.");

            //New timeline was added
            timelinesAdded++;

            // Start date in BCE is equal to end date in CE.
            startDate = "10";
            endDate = "10";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, CE) == false)
                Assert.Fail("Can't add timeline from " + startDate + " BCE to " + endDate + " CE.");

            //New timeline was added
            timelinesAdded++;

            // Start date in BCE is greater than end date in CE.
            startDate = "100";
            endDate = "10";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, CE) == false)
                Assert.Fail("Can't add timeline from " + startDate + " BCE to " + endDate + " CE.");

            //New timeline was added
            timelinesAdded++;
        }

        /// <summary>
        /// Add timeline from BCE to CE, start or end date is negative number or both.
        /// </summary>
        [TestMethod]
        public void AddTimeline_BCEtoCE_NegativeDates()
        {
            // Modulus of start date is lower than modulus of end date.
            string startDate = "-10";
            string endDate = "-100";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, CE) == true)
            {
                timelinesAdded++;
                Assert.Fail("Added timeline from " + startDate + " BCE to " + endDate + " CE.");
            }

            // Start and end dates are equal.
            startDate = "-10";
            endDate = "-10";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, CE) == true)
            {
                timelinesAdded++;
                Assert.Fail("Added timeline from " + startDate + " BCE to " + endDate + " CE.");
            }

            // Modulus of start date is greater than modulus of end date.
            startDate = "-100";
            endDate = "-10";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, CE) == true)
            {
                timelinesAdded++;
                Assert.Fail("Added timeline from " + startDate + " BCE to " + endDate + " CE.");
            }
        }

        /// <summary>
        /// Add timeline from BCE to CE, start date is negative nubmer, end date is positive number.
        /// </summary>
        [TestMethod]
        public void AddTimeline_BCEtoCE_NegativeStartDate()
        {
            // Modulus of start date is lower than end date.
            string startDate = "-10";
            string endDate = "100";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, CE) == true)
            {
                timelinesAdded++;
                Assert.Fail("Added timeline from " + startDate + " BCE to " + endDate + " CE.");
            }

            // Modulus of start and end dates are equal.
            startDate = "-10";
            endDate = "10";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, CE) == true)
            {
                timelinesAdded++;
                Assert.Fail("Added timeline from " + startDate + " BCE to " + endDate + " CE.");
            }

            // Modulus of start date is greater than end date.
            startDate = "-100";
            endDate = "10";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, CE) == true)
            {
                timelinesAdded++;
                Assert.Fail("Added timeline from " + startDate + " BCE to " + endDate + " CE.");
            }
        }

        /// <summary>
        /// Add timeline from BCE to CE, start date is positive number, end date is negative nubmer.
        /// </summary>
        [TestMethod]
        public void AddTimeline_BCEtoCE_NegativeEndDate()
        {
            // Start date is lower than modulus of end date.
            string startDate = "10";
            string endDate = "-100";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, CE) == true)
            {
                timelinesAdded++;
                Assert.Fail("Added timeline from " + startDate + " BCE to " + endDate + " CE.");
            }

            // Start date and modulus of end date are equal.
            startDate = "10";
            endDate = "-10";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, CE) == true)
            {
                timelinesAdded++;
                Assert.Fail("Added timeline from " + startDate + " BCE to " + endDate + " CE.");
            }

            // Start date is greater than modulus of end date.
            startDate = "100";
            endDate = "-10";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, CE) == true)
            {
                timelinesAdded++;
                Assert.Fail("Added timeline from " + startDate + " BCE to " + endDate + " CE.");
            }
        }

        /// <summary>
        /// Add timeline from BCE to BCE.
        /// </summary>
        [TestMethod]
        public void AddTimeline_BCEtoBCE()
        {
            // Start date is lower than end date.
            string startDate = "10";
            string endDate = "100";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, BCE) == true)
            {
                timelinesAdded++;
                Assert.Fail("Added timeline from " + startDate + " BCE to " + endDate + " BCE.");
            }

            // Start date is greater than end date
            startDate = "100";
            endDate = "10";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, BCE) == false)
                Assert.Fail("Can't add timeline from " + startDate + " BCE to " + endDate + " BCE.");

            timelinesAdded++;

            // Start date and end date are the same.
            startDate = "50";
            endDate = "50";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, BCE) == true)
            {
                timelinesAdded++;
                Assert.Fail("Added timeline from " + startDate + " BCE to " + endDate + " BCE.");
            }
        }

        /// <summary>
        /// Add timeline from CE to CE.
        /// </summary>
        [TestMethod]
        public void AddTimeline_CEtoCE()
        {
            // Start date is greater than end date.
            string startDate = "100";
            string endDate = "10";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, CE, endDate, CE) == true)
            {
                timelinesAdded++;
                Assert.Fail("Added timeline from " + startDate + " CE to " + endDate + " CE.");
            }

            // Start date is lower than end date
            startDate = "10";
            endDate = "100";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, CE, endDate, CE) == false)
                Assert.Fail("Can't add timeline from " + startDate + " CE to " + endDate + " CE.");

            timelinesAdded++;

            // Start date and end date are the same.
            startDate = "50";
            endDate = "50";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, CE, endDate, CE) == true)
            {
                timelinesAdded++;
                Assert.Fail("Added timeline from " + startDate + " CE to " + endDate + " CE.");
            }
        }
        #endregion Add timeline tests

        #region Add exhibit tests

        /// <summary>
        /// Adds exhibit with with BCE date.
        /// </summary>
        [TestMethod]
        public void AddExhibit_BCE()
        {
            // Start date is positive number;
            string startDate = "10";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(startDate, BCE) == false)
                Assert.Fail("Can't add exhibit " + startDate + " BCE.");

            exhibitsAdded++;

            // Start date is negative number;
            startDate = "-10";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(startDate, BCE) == true)
            {
                exhibitsAdded++;
                Assert.Fail("Added exhibit " + startDate + " BCE.");
            }
        }

        /// <summary>
        /// Adds exhibit with CE date
        /// </summary>
        [TestMethod]
        public void AddExhibit_CE()
        {
            // Start date is positive number;
            string startDate = "10";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(startDate, CE) == false)
                Assert.Fail("Can't add exhibit " + startDate + " CE.");

            exhibitsAdded++;

            // Start date is negative number;
            startDate = "-10";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(startDate, CE) == true)
            {
                exhibitsAdded++;
                Assert.Fail("Added exhibit " + startDate + " CE.");
            }
        }

        #endregion Add exhibit tests

        #region Add timelineExhibit tests

        /// <summary>
        /// Add exhibit inside timeline that starts and ends in BCE.
        /// </summary>
        [TestMethod]
        public void AddTimelineExhibit_BCEtoBCETimeline()
        {
            // Exhibit's date is BCE and higher, than start and end date of timeline.
            string startDate = "100";
            string endDate = "10";
            string contentDate = "110";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, BCE) == false)
                Assert.Fail("Can't add timeline from " + startDate + " BCE to " + endDate + " BCE.");

            timelinesAdded++;

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, BCE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " BCE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == true)
            {
                timelineExhibitsAdded++;
                Assert.Fail("Added exhibit " + contentDate + " BCE to timeline from " + startDate + " BCE to " + endDate + " BCE.");
            }   

            RemoveExhibit();

            // Exhibit's date is BCE and lower, than start and end date of timeline.
            contentDate = "9";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, BCE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " BCE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == true)
            {
                timelineExhibitsAdded++;
                Assert.Fail("Added exhibit " + contentDate + " BCE to timeline from " + startDate + " BCE to " + endDate + " BCE.");
            }            

            RemoveExhibit();

            // Exhibit's date is BCE and between start and end date of timeline.
            contentDate = "50";
            
            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, BCE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " BCE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == false)
                Assert.Fail("Can't add exhibit " + contentDate + " BCE to timeline from " + startDate + " BCE to " + endDate + " BCE.");
                
            timelineExhibitsAdded++;

            RemoveExhibit();

            // Exhibit's date is CE and lower than start and end date of timeline.
            contentDate = "90";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, CE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " CE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == true)
            {
                Assert.Fail("Added exhibit " + contentDate + " CE to timeline from " + startDate + " BCE to " + endDate + " BCE.");
                timelineExhibitsAdded++;
            }

            RemoveExhibit();

            // Exhibit's date is CE and between start and end date of timeline.
            contentDate = "50";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, CE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " CE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == true)
            {
                Assert.Fail("Added exhibit " + contentDate + " CE to timeline from " + startDate + " BCE to " + endDate + " BCE.");
                timelineExhibitsAdded++;
            }

            RemoveExhibit();

            // Exhibit's date is CE and greater than start and end date of timeline.
            contentDate = "110";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, CE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " CE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == true)
            {
                Assert.Fail("Added exhibit " + contentDate + " CE to timeline from " + startDate + " BCE to " + endDate + " BCE.");
                timelineExhibitsAdded++;
            }
        }

        /// <summary>
        /// Add exhibit inside timeline that starts in BCE and ends in CE. Start date is greater than end date.
        /// </summary>
        [TestMethod]
        public void AddTimelineExhibit_BCEtoCETimeline_StartGreaterEnd()
        {
            // Exhibit's date is BCE and higher, than start and end date of timeline.
            string startDate = "100";
            string endDate = "10";
            string contentDate = "110";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, CE) == false)
                Assert.Fail("Can't add timeline from " + startDate + " BCE to " + endDate + " CE.");

            timelinesAdded++;

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, BCE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " BCE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == true)
            {
                timelineExhibitsAdded++;
                Assert.Fail("Added exhibit " + contentDate + " BCE to timeline from " + startDate + " BCE to " + endDate + " CE.");
            }

            RemoveExhibit();

            // Exhibit's date is BCE and inside timeline.
            contentDate = "9";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, BCE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " BCE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == false)
                Assert.Fail("Can't add exhibit " + contentDate + " BCE to timeline from " + startDate + " BCE to " + endDate + " CE.");

            timelineExhibitsAdded++;

            RemoveExhibit();

            // Exhibit's date is CE and inside timeline.
            contentDate = "9";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, BCE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " CE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == false)
                Assert.Fail("Can't add exhibit " + contentDate + " CE to timeline from " + startDate + " BCE to " + endDate + " CE.");

            timelineExhibitsAdded++;

            RemoveExhibit();

            // Exhibit's date is CE and outside of timeline.
            contentDate = "50";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, CE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " CE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == true)
            {
                Assert.Fail("Added exhibit " + contentDate + " CE to timeline from " + startDate + " BCE to " + endDate + " CE.");
                timelineExhibitsAdded++;
            }

            RemoveExhibit();
        }

        /// <summary>
        /// Add exhibit inside timeline that starts in BCE and ends in CE. Start date lower than end date.
        /// </summary>
        [TestMethod]
        public void AddTimelineExhibit_BCEtoCETimeline_StartLowerEnd()
        {
            // Exhibit's date is BCE and higher, than start and end date of timeline.
            string startDate = "10";
            string endDate = "100";
            string contentDate = "110";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, BCE, endDate, CE) == false)
                Assert.Fail("Can't add timeline from " + startDate + " BCE to " + endDate + " CE.");

            timelinesAdded++;

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, BCE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " BCE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == true)
            {
                timelineExhibitsAdded++;
                Assert.Fail("Added exhibit " + contentDate + " BCE to timeline from " + startDate + " BCE to " + endDate + " CE.");
            }

            RemoveExhibit();

            // Exhibit's date is BCE and inside timeline.
            contentDate = "9";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, BCE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " BCE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == false)
                Assert.Fail("Can't add exhibit " + contentDate + " BCE to timeline from " + startDate + " BCE to " + endDate + " CE.");

            timelineExhibitsAdded++;

            RemoveExhibit();

            // Exhibit's date is CE and inside timeline.
            contentDate = "9";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, BCE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " CE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == false)
                Assert.Fail("Can't add exhibit " + contentDate + " CE to timeline from " + startDate + " BCE to " + endDate + " CE.");

            timelineExhibitsAdded++;

            RemoveExhibit();

            // Exhibit's date is CE and outside of timeline.
            contentDate = "110";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, CE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " CE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == true)
            {
                Assert.Fail("Added exhibit " + contentDate + " CE to timeline from " + startDate + " BCE to " + endDate + " CE.");
                timelineExhibitsAdded++;
            }

            RemoveExhibit();
        }

        /// <summary>
        /// Add exhibit inside timeline that starts in CE and ends in CE.
        /// </summary>
        [TestMethod]
        public void AddTimelineExhibit_CEtoCETimeline()
        {
            // Exhibit's date is BCE and higher, than start and end date of timeline.
            string startDate = "10";
            string endDate = "100";
            string contentDate = "110";

            tcPageObj = new TimelineControllerComponent(Driver);
            if (tcPageObj.Create(startDate, CE, endDate, CE) == false)
                Assert.Fail("Can't add timeline from " + startDate + " CE to " + endDate + " CE.");

            timelinesAdded++;

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, BCE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " BCE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == true)
            {
                timelineExhibitsAdded++;
                Assert.Fail("Added exhibit " + contentDate + " BCE to timeline from " + startDate + " CE to " + endDate + " CE.");
            }

            RemoveExhibit();

            // Exhibit's date is BCE and between start and end date of timeline.
            contentDate = "50";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, BCE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " BCE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == true)
            {
                timelineExhibitsAdded++;
                Assert.Fail("Added exhibit " + contentDate + " BCE to timeline from " + startDate + " CE to " + endDate + " CE.");
            }

            RemoveExhibit();

            // Exhibit's date is BCE and lower than start and end dates of timeline.
            contentDate = "9";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, BCE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " BCE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == true)
            {
                timelineExhibitsAdded++;
                Assert.Fail("Added exhibit " + contentDate + " BCE to timeline from " + startDate + " CE to " + endDate + " CE.");
            }

            RemoveExhibit();

            // Exhibit's date is CE and lower than end and start dates of timeline.
            contentDate = "9";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, CE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " CE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == true)
            {
                Assert.Fail("Added " + contentDate + " CE to timeline from " + startDate + " CE to " + endDate + " CE.");
                timelineExhibitsAdded++;
            }

            RemoveExhibit();

            // Exhibit's date is CE and greater than end and start dates of timeline.
            contentDate = "110";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, CE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " CE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == true)
            {
                Assert.Fail("Added " + contentDate + " CE to timeline from " + startDate + " CE to " + endDate + " CE.");
                timelineExhibitsAdded++;
            }

            RemoveExhibit();

            // Exhibit's date is CE and between end and start dates of timeline.
            contentDate = "50";

            ecPageObj = new ExhibitControllerComponent(Driver);
            if (ecPageObj.Create(contentDate, CE) == false)
                Assert.Fail("Can't add exhibit " + contentDate + " CE.");

            exhibitsAdded++;

            tecPageObj = new TimelineExhibitControllerComponent(Driver);
            if (tecPageObj.Create() == false)
                Assert.Fail("Can't add " + contentDate + " CE to timeline from " + startDate + " CE to " + endDate + " CE.");

            timelineExhibitsAdded++;

            RemoveExhibit();
        }


        #endregion Add timelineExhibit tests

        #region Help methods

        /// <summary>
        /// Logging in to the Authoring Tool if you are not logged in yet.
        /// </summary>
        private void LogOn()
        {
            // Wait for few moments to be sure that all page elements were loaded.
            Thread.Sleep(LoadingTime);

            // If you are logged in, then you can see "versionColumn" field, otherwise it is not loaded on the page.
            try
            {
                IWebElement user = Driver.FindElement(By.Id("versionColumn"));
            }
            catch (Exception e)
            {
                // Field wasn't found, logging in.
                LoginPage loginPage = new LoginPage(Driver);
                loginPage.LogOn();
            }
        }

        /// <summary>
        /// Remove last added timeline, it is the first in a list of all timelines because of its title.
        /// </summary>
        private void RemoveTimeline()
        {
            Driver.Navigate().GoToUrl("http://localhost:44625/Timeline");
            Thread.Sleep(LoadingTime);

            // Finds delete button for the first timeline in a list.
            Driver.FindElement(By.XPath("//a[starts-with(@href,'/Timeline/Delete')][1]")).Click();
            Thread.Sleep(LoadingTime);

            // Finds submit deleting button.
            Driver.FindElement(By.XPath("//p/input")).Click();
            Thread.Sleep(LoadingTime);

            timelinesAdded--;
        }

        /// <summary>
        /// Remove first exhibit in a list of all exhibits.
        /// </summary>
        private void RemoveExhibit()
        {
            Driver.Navigate().GoToUrl("http://localhost:44625/Exhibit");
            Thread.Sleep(LoadingTime);
            
            // Finds delete button for the first exhibit in a list.
            Driver.FindElement(By.XPath("//a[starts-with(@href,'/Exhibit/Delete')][1]")).Click();
            Thread.Sleep(LoadingTime);
            
            // Finds submit deleting button.
            Driver.FindElement(By.XPath("//p/input")).Click();
            Thread.Sleep(LoadingTime);

            exhibitsAdded--;
        }

        /// <summary>
        /// Remove first timelineExhibit in a list of all timelineExhibits.
        /// </summary>
        private void RemoveTimelineExhibit()
        {
            Driver.Navigate().GoToUrl("http://localhost:44625/TimelineExhibit");
            Thread.Sleep(LoadingTime);

            // Finds delete button for the first timelineExhibit in a list.
            Driver.FindElement(By.XPath("//a[starts-with(@href,'/TimelineExhibit/Delete')][1]")).Click();
            Thread.Sleep(LoadingTime);

            // Finds submit deleting button.
            Driver.FindElement(By.XPath("//p/input")).Click();
            Thread.Sleep(LoadingTime);

            timelineExhibitsAdded--;
        }

        #endregion Help methods
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class AuthoringTests_IE : AuthoringTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}
