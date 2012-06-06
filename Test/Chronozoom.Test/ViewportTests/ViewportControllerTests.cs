using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Windows;
using Chronozoom.Test.Auxiliary;
using Chronozoom.Test.Components;
using Chronozoom.Test.JsTypes;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using System.Threading;

namespace Chronozoom.Test.ViewportTests
{
    [TestClass]
    [TestPage("testViewportController.htm")]
    public abstract class ViewportControllerTests : CzTestBase
    {
        [TestInitialize]
        public void TestInitialize()
        {
            GoToUrl();
            //var vcPageObj = new VirtualCanvasComponent(Driver);
            //vcPageObj.WaitContentLoading();
        }
        /// <summary>
        /// Interrupts one elliptical zoom with another one
        /// </summary>
        [TestMethod]
        public void TestControllerCallbacks()
        {
            int ellipticZoomTimeWait = 6200;
            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;

            (Driver as IJavaScriptExecutor).ExecuteScript(
                "controller.moveToVisible(new VisibleRegion2d(-277.50329878783214, 1919874940.9157667, 0.15011512823718295),false);" //going into Humanity timline (coordinates snapshot)
                );
            Thread.Sleep(ellipticZoomTimeWait / 3);

            (Driver as IJavaScriptExecutor).ExecuteScript(
                "controller.moveToVisible(new VisibleRegion2d(-3000329878.783214, 1919874940.9157667, 15011512.823718295),false);" //interrupting ongoing animation with a new moveTo
                );

            Thread.Sleep(ellipticZoomTimeWait); //waiting for animation complete

            var animationsId = (Driver as IJavaScriptExecutor).ExecuteScript("return {interrupted:interruptedIds[0].o, created:interruptedIds[0].n, complete:completedIds[0]};") as Dictionary<string, object>;

            Assert.AreNotEqual(null, animationsId["interrupted"]);
            Assert.AreNotEqual(null, animationsId["created"]);
            Assert.AreNotEqual(null, animationsId["complete"]);
            Assert.AreNotEqual(animationsId["interrupted"], animationsId["created"]); //newly created animation must be different from interrupted one
            Assert.AreNotEqual(Convert.ToInt32(animationsId["interrupted"]), Convert.ToInt32(animationsId["created"])); //newly created animation must be different from interrupted one
            Assert.AreEqual(Convert.ToInt32(animationsId["created"]), Convert.ToInt32(animationsId["complete"]));//completed animation id must be the same as newly created after interruption
        }

        /// <summary>
        /// Verifiys that the user cant zoom deeper than the inner constraint into the timeline
        /// </summary>
        [TestMethod]
        public void TestViewportController_TimelineInnerZoomConstraintCoercation()
        {
            GoToUrl();
            double scaleToCheck = 0.000001;
            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;
            string visibleChange = "var visibleToSet = new VisibleRegion2d(-5000000000,0," + scaleToCheck.ToString("F6", System.Globalization.CultureInfo.InvariantCulture) + ");" +//the scale is too low (very deeo)
                "controller.coerceVisibleInnerZoom(visibleToSet);" +//applying constraint which is set in settings.js
                "return visibleToSet;";
            var coercedVisible = js.ExecuteScript(visibleChange) as Dictionary<string, object>;

            Assert.IsTrue(Convert.ToDouble(coercedVisible["scale"]) > scaleToCheck);
        }

        /// <summary>
        /// Verifiys that the user cant zoom deeper than the inner constraint into the infodot
        /// </summary>
        [TestMethod]
        public void TestViewportController_InfodotInnerZoomConstraintCoercation()
        {
            GoToUrl();
            double scaleToCheck = 0.000001;
            double scaleConstraint = 0.1;
            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;
            string visibleChange = "var visibleToSet = new VisibleRegion2d(-5000000000,0," + scaleToCheck.ToString("F6", System.Globalization.CultureInfo.InvariantCulture) + ");" +//the scale is too low (very deeo)
                "controller.effectiveExplorationZoomConstraint=" + scaleConstraint.ToString("F6", System.Globalization.CultureInfo.InvariantCulture) + ";" + //setting constraint, overriding the timeline zoom-in constraint
                "controller.coerceVisibleInnerZoom(visibleToSet);" +//applying constraint
                "return visibleToSet;";
            var coercedVisible = js.ExecuteScript(visibleChange) as Dictionary<string, object>;

            Assert.IsTrue(Convert.ToDouble(coercedVisible["scale"]) >= scaleConstraint);
        }

        /// <summary>
        /// Request animation frame during panning. Verifys that center of the visible is in transition
        /// </summary>
        [TestMethod]
        public void TestViewportController_PanViewport()
        {
            GoToUrl();
            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;
            string panViewport = "var vp = new Viewport2d(2.0,100,100,new VisibleRegion2d(10,5, 0.1)); " + //extracting viewport from virtual canvas
                "var oldScale = vp.visible.scale; var oldX = vp.visible.centerX; var oldY = vp.visible.centerY;" + //storing visible parameters
                "pg = new PanGesture(5,-6);" + //creating pan gesture
                 "controller.PanViewportAccessor(vp,pg);" + // testable call
                "var newScale = vp.visible.scale; var newX = vp.visible.centerX; var newY = vp.visible.centerY;" + //storing changed visible parameters
                "return {oldScale:oldScale,newScale:newScale,oldX:oldX,newX:newX,oldY:oldY,newY:newY};"; //encapsulating all needed into one object


            var dict = js.ExecuteScript(panViewport) as Dictionary<string, object>; // requesting a frame in the middle of the animation
            double oldx = Convert.ToDouble(dict["oldX"]); //extracting values
            double newx = Convert.ToDouble(dict["newX"]);
            double oldy = Convert.ToDouble(dict["oldY"]);
            double newy = Convert.ToDouble(dict["newY"]);
            double oldScale = Convert.ToDouble(dict["oldScale"]);
            double newScale = Convert.ToDouble(dict["newScale"]);
            Assert.IsTrue(oldx > newx);
            Assert.IsTrue(oldy < newy);
            Assert.AreEqual(oldScale, newScale);
        }


        double Ga = 1e9; //  1.0 Gigaannum
                         // 13.7 Gigaannum - Age of universe

        [TestMethod]
        public void TestViewportController_PanForcesViewportToExceedLeftBorder_ViewportDoesNotExceedLeftBorder()
        {
            /* Arrange
             * Set up the viewport such that a pan of width
             * forces the viewport to exceed the left border.
             */
            GoToUrl();

            IWebElement vcElem = Driver.FindElement(By.Id("vc"));
            double widthInSc = vcElem.Size.Width - 2;   // border of 1 px on each side
            double widthInVc = 1.37 * Ga;
            double scale = widthInVc / widthInSc;       // 1/10 the age of the universe

            double minLeftCenterX = ExecuteScriptGetNumber(@"return window.maxPermitedTimeRange.left;"); 

            var vc = new VirtualCanvasComponent(Driver);
            vc.SetVisible(new JsVisible(-13 * Ga, 0, scale));
            vc.UpdateViewport();

            /* Act
             * Pan by width to the right.
             */
            Vector pan = new Vector(widthInSc, 0);
            ActionsExtension act = new ActionsExtension(Driver);
            act.MoveToElement(vcElem, 0, 0);
            act.ClickAndHold();
            act.MoveByOffset(Convert.ToInt32(pan.X), Convert.ToInt32(pan.Y));
            act.Release();
            act.Perform();
            vc.WaitAnimation();

            /* Without the horizontal contraints the viewport centerX will exceed minLeftCenterX
             * after a pan of width as (-13Ga + -1.37Ga < 13.7Ga).
             * With the contraints in place viewport centerX is limited to minLeftCenterX.
             */

            /* Assert
             * Verify that the viewport centerX after
             * panning doesn't exceed the minLeftCenterX.
             */
            var vp = vc.GetViewport();
            double vpCenterX = vp.CenterX;

            Assert.AreEqual(minLeftCenterX, vpCenterX, 5);
        }

        [TestMethod]
        public void TestViewportController_PanForcesViewportToExceedRightBorder_ViewportDoesNotExceedRightBorder()
        {
            /* Arrange
             * Set up the viewport such that a pan of width 
             * forces the viewport to exceed the right border.
             */
            GoToUrl();

            IWebElement vcElem = Driver.FindElement(By.Id("vc"));
            double widthInSc = vcElem.Size.Width - 2;   // border of 1 px on each side
            double widthInVc = 1.37 * Ga;
            double scale = widthInVc / widthInSc;       // 1/10 the age of the universe

            double maxRightCenterX = ExecuteScriptGetNumber(@"return window.maxPermitedTimeRange.right;"); 

            var vc = new VirtualCanvasComponent(Driver);
            vc.SetVisible(new JsVisible(-1 * Ga, 0 , scale));
            vc.UpdateViewport();

            /* Act
             * Pan by width to the left.
             */
            Vector pan = new Vector(-widthInSc, 0);
            ActionsExtension act = new ActionsExtension(Driver);
            act.MoveToElement(vcElem, (int) widthInSc, 0);
            act.ClickAndHold();
            act.MoveByOffset(Convert.ToInt32(pan.X), Convert.ToInt32(pan.Y));
            act.Release();
            act.Perform();
            vc.WaitAnimation();

            /* Assert
             * Verify that the viewport centerX after
             * panning doesn't exceed the maxRightCenterX.
             */
            var vp = vc.GetViewport();
            double vpCenterX = vp.CenterX;

            Assert.AreEqual(maxRightCenterX, vpCenterX, 5);
        }

        [Ignore]
        [TestMethod]
        public void TestViewportController_ZoomForcesViewportToExceedMinPermittedZoomIn_ViewportDoesNotExceedMinPermittedZoomIn()
        {
            GoToUrl();

            double zoomFactor = ExecuteScriptGetNumber(@"return window.zoomLevelFactor;");
            dynamic timelines = ExecuteScript("return window.deeperZoomConstraints;");

            for (int i = 0; i < timelines.Count; i++)
            {
                /* Arrange
                 * Set up the viewport such that a zoom gesture 
                 * forces the viewport to exceed the minimum zoomin level.
                 */
                Driver.Navigate().Refresh();

                IWebElement vcElem = Driver.FindElement(By.Id("vc"));

                dynamic timeline = timelines[i];
                double left = timeline["left"];
                double right = timeline["right"];
                double minScale = timeline["scale"];
                double aboveMinScale = minScale * zoomFactor;

                // for all scale in [minScale, aboveMinScale) => scale / zoomFactor < minScale
                Random rnd = new Random();
                double scale = minScale + rnd.NextDouble() * (aboveMinScale - minScale);

                var vc = new VirtualCanvasComponent(Driver);
                vc.SetVisible(new JsVisible((left + right) / 2, 0, scale));
                vc.UpdateViewport();

                /* Act
                 * ZoomIn.
                 */
                ActionsExtension act = new ActionsExtension(Driver);
                act.MoveToElement(vcElem, 10, 10);
                act.DoubleClick();
                act.Perform();
                vc.WaitAnimation();

                /* Assert
                 * Verify that the viewport after zooming doesn't
                 * exceed the minimum zoomin level.
                 */
                var vp = vc.GetViewport();
                Assert.IsTrue(vp.Scale >= minScale);
            }
        }

        [Ignore]
        [TestMethod]
        public void TestViewportController_ZoomForcesViewportToExceedMaxPermittedZoomOut_ViewportDoesNotExceedMaxPermittedZoomOut()
        {
            /* Arrange
             * Set up the viewport such that a zoom gesture 
             * forces the viewport to exceed maximum zoomout level.
             */
            GoToUrl();

            IWebElement vcElem = Driver.FindElement(By.Id("vc"));
            double width = vcElem.Size.Width - 2; // border of 1 px on each side

            double additionalPermitedPixels = ExecuteScriptGetNumber(@"return window.timelinesAbsenceInterval;");
            double zoomFactor = ExecuteScriptGetNumber(@"return window.zoomLevelFactor;");

            double maxScaleWithoutPadding = 13.7 * Ga / width;
            double maxScale = (13.7 * Ga + 2 * additionalPermitedPixels * maxScaleWithoutPadding) / width;
            double belowMaxScale = maxScale / zoomFactor;

            // for all scale in (belowMaxScale, maxScale] => scale * zoomFactor > maxScale 
            Random rnd = new Random();
            double scale = belowMaxScale + rnd.NextDouble() * (maxScale - belowMaxScale);

            var vc = new VirtualCanvasComponent(Driver);
            vc.SetVisible(new JsVisible(-13.7 * Ga / 2, 0, scale));
            vc.UpdateViewport();

            /* Act
             * ZoomOut.
             */
            ExecuteScript(@"setZoomOut()");
            ActionsExtension act = new ActionsExtension(Driver);
            act.MoveToElement(vcElem, 10, 10);
            act.DoubleClick();
            act.Perform();
            vc.WaitAnimation();

            /* Assert
             * Verify that the viewport after zooming doesn't
             * exceed the maximum zoomout level.
             */
            var vp = vc.GetViewport();
            Assert.IsTrue(vp.Scale <= maxScale);
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class ViewportControllerTests_Firefox : ViewportControllerTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class ViewportControllerTests_IE : ViewportControllerTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}
