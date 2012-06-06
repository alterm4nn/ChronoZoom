using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using System.Threading;
using Chronozoom.Test.Components;
using OpenQA.Selenium.Interactions;
using Chronozoom.Test.Auxiliary;
using System.Diagnostics;

namespace Chronozoom.Test.GeneralTests
{
    [TestClass]
    [TestPage("cz.htm")]
    abstract public class BreadCrumbsTests : CzTestBase
    {
        [TestInitialize]
        public void TestInitialize() 
        {
            GoToUrl();
            var vcPageObj = new VirtualCanvasComponent(Driver);
            vcPageObj.WaitContentLoading();
        }

        /// <summary>
        /// Clicking on one of the bread crumbs
        /// </summary>
        [TestMethod]        
        public void TestBreadCrumbLink()
        {
            switch (Browser)
            {
                case BrowserType.Firefox:
                    // 10.1 version of FF doesn't correctly supported by Selenium.
                    //TODO: update this test with new version of Selenium.
                    Assert.Inconclusive("10.1 version of FF doesn't correctly supported by Selenium. Test will be updated with new version of Selenium.");
                    break;
                case BrowserType.InternetExplorer:

                    int ellipticZoomTimeWait = 6200;            
                    IJavaScriptExecutor js = Driver as IJavaScriptExecutor;

                    var setVis = (Driver as IJavaScriptExecutor).ExecuteScript(
                        "setVisible(new VisibleRegion2d(-692.4270728052991,222750361.2049456,0.35779500398729397));" //going into Humanity timline (coordinates snapshot)
                        );
                    Thread.Sleep(ellipticZoomTimeWait);

                    var zoomedVisible = (Driver as IJavaScriptExecutor).ExecuteScript("return $('#vc').virtualCanvas('getViewport').visible;") as Dictionary<string, object>; //saving visible region after zoom

                    IWebElement crumb2 = Driver.FindElement(By.Id("bread_crumb_1")); //finding second bread crumb to test a link of it
                    ActionsExtension crumbClick = new ActionsExtension(Driver);
                    crumbClick.MoveToElement(crumb2, crumb2.Size.Width / 2, crumb2.Size.Height / 2);
                    crumbClick.Click();            
                    crumbClick.Perform(); //clicking on the bread crumb

                    Thread.Sleep(ellipticZoomTimeWait);

                    var breadCrumbVisible = (Driver as IJavaScriptExecutor).ExecuteScript("return $('#vc').virtualCanvas('getViewport').visible;") as Dictionary<string, object>; //saving visible region after clicking bread crumb

                    crumbClick.SetDefault(); // return mouse position to default

                    Assert.IsTrue(Convert.ToDouble(zoomedVisible["scale"]) < Convert.ToDouble(breadCrumbVisible["scale"])); //scale must ascend
                    break;
            }
        }

        /// <summary>
        /// calculate 3 breadcrumbs for dummy timeline
        /// </summary>
        [TestMethod]
        public void TestBreadCrumbCalculation()
        {            
            var breadCrumbsArray=(Driver as IJavaScriptExecutor).ExecuteScript(
                "k = 200;"+
            "var root = vc.virtualCanvas('getLayerContent');"+
            "root.beginEdit();"+

            "t1 = addTimeline(root, 'layerTimelines', 't1',{" + //adding nested dummy timelines
                     "timeStart: -5.7 * k, timeEnd: 0,"+
                     "top: 0.1 * k, height: 2 * k,"+
                     "header: 't1',"+
                     "fillStyle: 'rgba(30, 100, 30, 0.5)'"+
                 "});"+

                 "t2 = addTimeline(t1, 'layerTimelines', 't2',{" +
                     "timeStart: -4.7 * k, timeEnd: 0," +
                     "top: 0.1 * k, height: 2 * k," +
                     "header: 't2'," +
                     "fillStyle: 'rgba(30, 100, 30, 0.5)'" +
                 "});" +

                 "t3 = addTimeline(t2, 'layerTimelines', 't3',{" +
                     "timeStart: -3.7 * k, timeEnd: 0," +
                     "top: 0.1 * k, height: 2 * k," +
                     "header: 't3'," +
                     "fillStyle: 'rgba(30, 100, 30, 0.5)'" +
                 "});" +

            "root.endEdit(true);" +
            "var innerVisible = new VisibleRegion2d(-2.7 * k,0.5 * k,k*0.00001);" +
            "controller.moveToVisible(innerVisible, true);" +//moving into deepest timeline;
            "return {len:breadCrumbs.length, first:breadCrumbs[breadCrumbs.length-3].vcElement.title,last:breadCrumbs[breadCrumbs.length-1].vcElement.title};"            //returning breadcrumbs values for check
            ) as Dictionary<string, object>;

            Assert.IsTrue(3 <= Convert.ToInt32(breadCrumbsArray["len"]));
            Assert.AreEqual("t1", (string)breadCrumbsArray["first"]);
            Assert.AreEqual("t3", (string)breadCrumbsArray["last"]);
        }

        // Move mouse in lower left corner when running this test.
        [TestMethod]
        public void TestBreadCrumbs_HoverMouseOverBreadCrumb_BreadCrumbHighlighted()
        {
            GoToUrl("http://localhost:4949/cz.htm#/t55/e165/c477");            

            IWebElement breadCrumb = Driver.FindElement(By.Id("bread_crumb_0"));
            ActionsExtension action = new ActionsExtension(Driver);
            switch (Browser)
            {
                case BrowserType.Firefox: // 10.1 version of FF doesn't correctly supported by Selenium.
                    //TODO: update this test with new version of Selenium.
                    Assert.Inconclusive("10.1 version of FF doesn't correctly supported by Selenium. Test will be updated with new version of Selenium.");
                    break;
                case BrowserType.InternetExplorer:
                    // Hover mouse over breadcrumb link.
                    action.MoveToElement(breadCrumb, breadCrumb.Size.Width / 2, breadCrumb.Size.Height / 2)
                        .Perform();

                    var res = (bool)(Driver as IJavaScriptExecutor).ExecuteScript(
                    "var currentColor = $('#bread_crumb_0').css('color');" + // Get the color of breadcrumb link.
                    "return currentColor == 'rgb(255, 255, 255)';"); // Check that this color is rgb(255,255,255). Return result.
                    action.SetDefault();
                    // Check that color is corret.
                    Assert.IsTrue(res);
                    break;
            }
        }

        // Move mouse in lower left corner when running this test.
        [TestMethod]
        public void TestBreadCrumbs_HoverMouseOutFromBreadCrumb_BreadCrumbNotHighlighted()
        {
            GoToUrl("http://localhost:4949/cz.htm#/t55/e165/c477");

            IWebElement breadCrumb = Driver.FindElement(By.Id("bread_crumb_0"));
            ActionsExtension action = new ActionsExtension(Driver);
            switch (Browser)
            {
                case BrowserType.Firefox: // 10.1 version of FF doesn't correctly supported by Selenium.
                    //TODO: update this test with new version of Selenium.
                    Assert.Inconclusive("10.1 version of FF doesn't correctly supported by Selenium. Test will be updated with new version of Selenium.");
                    break;
                case BrowserType.InternetExplorer:
                    // Hover mouse over breadcrumb link.
                    action.MoveToElement(breadCrumb, breadCrumb.Size.Width / 2, breadCrumb.Size.Height / 2)
                        .Perform();

                    var res = (bool)(Driver as IJavaScriptExecutor).ExecuteScript(
                    "var currentColor = $('#bread_crumb_0').css('color');" + // Get the color of breadcrumb link.
                    "return currentColor == 'rgb(255, 255, 255)';"); // Check that this color is rgb(255, 255, 255). Return result.
                    // Check that highlight color is corret.
                    Assert.IsTrue(res);

                    // Hover mouse out from breadcrumb link.
                    action.SetDefault();

                    res = (bool)(Driver as IJavaScriptExecutor).ExecuteScript(
                    "var currentColor = $('#bread_crumb_0').css('color');" + // Get the color of breadcrumb link.
                    "return currentColor == 'rgb(191, 191, 191)';"); // Check that this color is rgb(191, 191, 191). Return result.
                    // Check that color is corret.
                    Assert.IsTrue(res);
                    break;
            }
        }

        // Move mouse in lower left corner, when running this test.
        [TestMethod]
        public void TestBreadCrumbs_BreadCrumbLinkColorIsCorrect()
        {
            GoToUrl("http://localhost:4949/cz.htm#/t55/e165/c477");

            IWebElement breadCrumb = Driver.FindElement(By.Id("bread_crumb_0"));
            ActionsExtension action = new ActionsExtension(Driver);
            switch (Browser)
            {
                case BrowserType.Firefox: // 10.1 version of FF doesn't correctly supported by Selenium.
                    //TODO: update this test with new version of Selenium.
                    Assert.Inconclusive("10.1 version of FF doesn't correctly supported by Selenium. Test will be updated with new version of Selenium.");
                    break;
                case BrowserType.InternetExplorer:                    
                    var colorBefore = (string)(Driver as IJavaScriptExecutor).ExecuteScript(
                    "var currentColor = $('#bread_crumb_0').css('color');" + // Get the color of breadcrumb link.
                    "return currentColor;"); // Return the color.

                    // Hover mouse over breadcrumb link.
                    action.MoveToElement(breadCrumb, breadCrumb.Size.Width / 2, breadCrumb.Size.Height / 2)
                        .Perform();
                    // Hover mouse out from breadcrumb link.
                    action.SetDefault();

                    var colorAfter = (string)(Driver as IJavaScriptExecutor).ExecuteScript(
                    "var currentColor = $('#bread_crumb_0').css('color');" + // Get the color of breadcrumb link after it was hover by mouse.
                    "return currentColor;"); // Return the color.

                    // Check that initial and current color are the same.
                    Assert.AreEqual(colorBefore, colorAfter);
                    break;
            }
        }

        [TestMethod]
        public void TestBreadCrumbs_TooManyBreadCrumbLinks_SomeBreadCrumbsClipped()
        {
            // Only Cosmos breadcrumb link must be visible.
            GoToUrl("http://localhost:4949/cz.htm#/t55/e129");

            var firstLink = (string)(Driver as IJavaScriptExecutor).ExecuteScript("return $('#bread_crumb_0').text();");
            // Check that there is only 1 breadcrumb link.
            Assert.AreEqual(firstLink, "Cosmos");

            // Full path - Cosmos > Earth & Solar System > Life > Human Prehistory > Humanity > Industrial Revolution > 
            // Wave 3: Russia and Japan > Japanese Industrialization > Emperor Meiji(1868-1912) 
            // It is too long text, probably it will be clipped.
            GoToUrl("http://localhost:4949/cz.htm#/t55/t174/t66/t46/t161/t9/t110/t302/t303/e61");
            // Get the first breadcrumb link text.
            firstLink = (string)(Driver as IJavaScriptExecutor).ExecuteScript("return $('#bread_crumb_0').text();");
            // Probably first breadcrumb link wouldn't be 'Cosmos' but '. . .', because of clipping.
            Assert.AreNotEqual(firstLink, "Cosmos");
        }        
    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class BreadCrumbsTests_Firefox : BreadCrumbsTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class BreadCrumbsTests_IE : BreadCrumbsTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }    
}
