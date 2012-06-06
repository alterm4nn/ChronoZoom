using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Chronozoom.Test.Components;
using OpenQA.Selenium;
using System.Threading;
using OpenQA.Selenium.Interactions;
using Chronozoom.Test.Auxiliary;

namespace Chronozoom.Test.TourTests
{
    [TestClass]
    [TestPage("cz.htm")]
    abstract public class TourInteractionTests : CzTestBase
    {
        ActionsExtension pan;

        [TestInitialize]
        public void TestInitialize()
        {
            GoToUrl();
            var vcPageObj = new VirtualCanvasComponent(Driver);
            vcPageObj.WaitContentLoading();
        }

        [TestCleanup]
        public void TestCleanup()
        {
            if (pan != null)
            {
                pan.SetDefault();
            }
        }

        /// <summary>
        /// Request animation frame during panning. Verifys that center of the visible is in transition
        /// </summary>
        [TestMethod]
        public void TestInterruptTourByPan()
        {
            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;

            Thread.Sleep(2000);
            js.ExecuteScript("activateTour(tours[0]);"); // running test tour
            Thread.Sleep(500);

            var state1 = js.ExecuteScript("return {state: tour.state};") as Dictionary<string, object>;

            IWebElement vc = Driver.FindElement(By.Id("vc"));            

            pan = new ActionsExtension(Driver);            

            pan.MoveToElement(vc, vc.Size.Width / 2, vc.Size.Height / 2);
            pan.ClickAndHold();
            pan.MoveByOffset(-50, 20);
            pan.Release();
            pan.Perform(); //preforming panning

            pan.SetDefault(); // return mouse position to default

            var state2 = js.ExecuteScript("return {state: tour.state}") as Dictionary<string, object>;

            Thread.Sleep(500);

            Assert.AreEqual("play", state1["state"].ToString());
            Assert.AreEqual("pause", state2["state"].ToString());
        }

        /// <summary>
        /// Request animation frame during panning. Verifys that center of the visible is in transition
        /// </summary>
        [TestMethod]
        public void TestTourPrevNext()
        {
            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;

            js.ExecuteScript("activateTour(tours[0]);"); // running test tour
            Thread.Sleep(500);

            js.ExecuteScript("tourPause()"); // pausing tour

            Thread.Sleep(500);

            var bookmark1 = js.ExecuteScript("return {bmIndex: tour.currentPlace.bookmark};") as Dictionary<string, object>; //saving current bookmark

            //IWebElement nextButton = Driver.FindElement(By.Id("tour_next")); //clicking on next bookmark
            //ActionsExtension clickNext = new ActionsExtension(Driver);
            //clickNext.MoveToElement(nextButton, nextButton.Size.Width / 2, nextButton.Size.Height / 2);
            //clickNext.ClickAndHold();
            //clickNext.MoveByOffset(1, 1);
            //clickNext.Release();
            //clickNext.Perform();
            //clickNext.SetDefault(); // return mouse position to default

            js.ExecuteScript("tourNext()"); //emulating clicks doesn't work here. So calling binded function explicitly

            Thread.Sleep(500);

            var bookmark2 = js.ExecuteScript("return {bmIndex: tour.currentPlace.bookmark};") as Dictionary<string, object>; //saving current bookmark

            //IWebElement prevButton = Driver.FindElement(By.Id("tour_prev")); //clicking on prev bookmark
            //ActionsExtension clickPrev = new ActionsExtension(Driver);
            //clickPrev.MoveToElement(prevButton, prevButton.Size.Width / 2, prevButton.Size.Height / 2);
            //clickPrev.ClickAndHold();
            //clickPrev.MoveByOffset(1, 1);
            //clickPrev.Release();
            //clickPrev.Perform();
            //clickNext.SetDefault(); // return mouse position to default

            js.ExecuteScript("tourPrev()"); //emulating clicks doesn't work here. So calling binded function explicitly

            Thread.Sleep(500);

            var bookmark3 = js.ExecuteScript("return {bmIndex: tour.currentPlace.bookmark};") as Dictionary<string, object>; //saving current bookmark


            Assert.AreEqual(0, Convert.ToInt32(bookmark1["bmIndex"]));
            Assert.AreEqual(1, Convert.ToInt32(bookmark2["bmIndex"]));
            Assert.AreEqual(0, Convert.ToInt32(bookmark3["bmIndex"]));
        }

        [TestMethod]
        public void TestTourTextOnOff()
        {
            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;
            if (js == null) throw (new NullReferenceException());
            Thread.Sleep(2000);

            // On tour start, show bookmark info window
            js.ExecuteScript("activateTour(tours[1], true);");
            Thread.Sleep(2000);

            var state = js.ExecuteScript("return {isVisible: isBookmarksWindowVisible};") as Dictionary<string, object>;
            if (state == null) throw (new NullReferenceException());

            Assert.AreEqual(true, Convert.ToBoolean(state["isVisible"]), "err: Tour caption not visible on tour start.");

            // Collapse bookmark info window
            js.ExecuteScript("collapseBookmarks()");
            Thread.Sleep(2000);

            state = js.ExecuteScript("return {isExpanded: isBookmarksWindowExpanded};") as Dictionary<string, object>;
            if (state == null) throw (new NullReferenceException());

            Assert.AreEqual(false, Convert.ToBoolean(state["isExpanded"]), "err: Tour caption cannot be collapsed.");

            // Expand bookmark info window
            js.ExecuteScript("expandBookmarks()");
            Thread.Sleep(2000);

            state = js.ExecuteScript("return {isExpanded: isBookmarksWindowExpanded};") as Dictionary<string, object>;
            if (state == null) throw (new NullReferenceException());

            Assert.AreEqual(true, Convert.ToBoolean(state["isExpanded"]), "err: Tour caption cannot be expanded.");

            // On tour end, hide bookmark info window
            js.ExecuteScript("tourAbort()");
            Thread.Sleep(2000);

            state = js.ExecuteScript("return {isVisible: isBookmarksWindowVisible};") as Dictionary<string, object>;
            if (state == null) throw (new NullReferenceException());

            Assert.AreEqual(false, Convert.ToBoolean(state["isVisible"]), "err: Tour caption not hidden on tour end.");
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class TourInteractionTests_Firefox : TourInteractionTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class TourInteractionTests_IE : TourInteractionTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}
