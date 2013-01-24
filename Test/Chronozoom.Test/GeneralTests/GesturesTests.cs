using System;
using System.Text;
using System.Collections.Generic;
using System.Windows;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Interactions.Internal;
using Chronozoom.Test.Auxiliary;
using Chronozoom.Test.Components;
using System.Drawing.Imaging;
using System.Threading;
using Chronozoom.Test.JsTypes;
using Point = System.Drawing.Point;
using Size = System.Drawing.Size;

namespace Chronozoom.Test.GeneralTests
{
    [TestClass]
    [TestPage("testGestures.htm")]
    public abstract class GesturesTests : CzTestBase
    {
        private VirtualCanvasComponent vcPageObj;
        private ActionsExtension action;

        [TestInitialize]
        public void TestInitialize()
        {
            GoToUrl();
            vcPageObj = new VirtualCanvasComponent(Driver);
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
        public void TestGestures_MouseActivity_GesturesGenerated()
        {
            const int offsetX = 100;
            const int offsetY = 100;

            action = new ActionsExtension(Driver);

            bool zoomHandled = (bool)ExecuteScript("return zoomHandled;"); ;
            bool panHandled = (bool)ExecuteScript("return panHandled;");
            bool pinHandled = (bool)ExecuteScript("return pinHandled;");

            Assert.IsFalse(zoomHandled);
            Assert.IsFalse(panHandled);
            Assert.IsFalse(pinHandled);

            // Pin and pan gestures.
            action.MoveToElement(vcPageObj.VirtualCanvas, offsetX, offsetY);
            action.ClickAndHold();
            action.MoveByOffset(offsetX, offsetY);
            action.Release();
            action.Perform();

            vcPageObj.WaitAnimation();

            zoomHandled = (bool)ExecuteScript("return zoomHandled;");
            panHandled = (bool)ExecuteScript("return panHandled;");
            pinHandled = (bool)ExecuteScript("return pinHandled;");

            Assert.IsFalse(zoomHandled);
            Assert.IsTrue(panHandled);
            Assert.IsTrue(pinHandled);

            // Zoom gesture.
            action.DoubleClick();
            action.Perform();

            vcPageObj.WaitAnimation();

            zoomHandled = (bool)ExecuteScript("return zoomHandled;");
            panHandled = (bool)ExecuteScript("return panHandled;");
            pinHandled = (bool)ExecuteScript("return pinHandled;");

            Assert.IsTrue(zoomHandled);
            Assert.IsTrue(panHandled);
            Assert.IsTrue(pinHandled);
        }

        [TestMethod]
        public void TestGestures_MouseActivity_GestureBodyIsCorrect()
        {
            Dictionary<string, object> offset, scale;

            const int offsetX = 100;
            const int offsetY = 100;

            // Make pan gesture and check, that body of gesture is correct.
            action = new ActionsExtension(Driver);
            action.MoveByOffset(offsetX, offsetY).Perform();

            action.ClickAndHold();
            action.MoveByOffset(offsetX, offsetY);
            action.Release();
            action.Perform();

            vcPageObj.WaitAnimation();

            offset = ExecuteScriptGetJson("return offset;");

            Assert.AreEqual((double)offsetX, Convert.ToDouble(offset["xOffset"]), 5);
            Assert.AreEqual((double)offsetY, Convert.ToDouble(offset["yOffset"]), 5);

            action.SetDefault();

            // Make zoom gesture and check, that body of gesture is correct.
            GoToUrl();

            action.MoveByOffset(offsetX, offsetY).Perform();

            action.DoubleClick();
            action.Perform();

            vcPageObj.WaitAnimation();

            scale = ExecuteScriptGetJson("return scale;");

            Assert.AreEqual((double)offsetX, Convert.ToDouble(scale["xOrigin"]), 10);
            Assert.AreEqual((double)offsetY, Convert.ToDouble(scale["yOrigin"]), 10);
        }

        [TestMethod]
        public void TestMouseBehavior_DoubleClickOnCanvas_NextLevelOfZoom()
        {
            const int offsetX = 100;
            const int offsetY = 100;

            action = new ActionsExtension(Driver);

            // NOTE: Uses user environment variable SELENIUM_SCR.
            WebDriverScreenshotMaker.SaveScreenshot(Driver, "TestMouseBehaviour", "SingleClickCanvasBefore", ImageFormat.Png, true);

            action.MoveToElement(vcPageObj.VirtualCanvas, offsetX, offsetY);
            action.DoubleClick();
            action.Perform();

            vcPageObj.WaitAnimation();
            WebDriverScreenshotMaker.SaveScreenshot(Driver, "TestMouseBehaviour", "SingleClickCanvasAfter", ImageFormat.Png, true);
        }

        [TestMethod]
        public void TestMouseBehavior_Panning_VisibleChangedCorrectly()
        {
            const int offsetX = 100;
            const int offsetY = 100;

            action = new ActionsExtension(Driver);
            JsVisible visibleBefore = vcPageObj.GetViewport();
            JsVisible visibleAfter;

            action.MoveToElement(vcPageObj.VirtualCanvas, offsetX, offsetY);
            action.ClickAndHold();
            action.MoveByOffset(offsetX, offsetY);
            action.Release();
            action.Perform();

            vcPageObj.WaitAnimation();
            visibleAfter = vcPageObj.GetViewport();

            JsCoordinates offsetScreen;
            JsCoordinates offsetVirtual;

            // Firefox browser had an inaccuracy in 3px.
            offsetScreen = (Browser == BrowserType.Firefox) ? new JsCoordinates(offsetX - 3, offsetY - 3) : new JsCoordinates(offsetX, offsetY);
            offsetVirtual = vcPageObj.VectorScreenToVirtual(offsetScreen);
            Assert.AreEqual(visibleBefore.CenterX - offsetVirtual.X, visibleAfter.CenterX, 1);
            Assert.AreEqual(visibleBefore.CenterY - offsetVirtual.Y, visibleAfter.CenterY, 1);
        }

        // Mark this test with TestMethod attribute, if need to check error
        // of mouse move actions in Selenium.
        public void TestGestures_SeleniumMouseMoveError()
        {
            Dictionary<string, object> offset;

            const int startX = 100;
            const int startY = 100;

            Actions action = new Actions(Driver);
            action.MoveToElement(vcPageObj.VirtualCanvas, startX, startY).Perform();

            for (int i = 0; i < 101; i++)
            {
                GoToUrl();

                action.Build();
                action.ClickAndHold();
                action.MoveByOffset(i, i);
                action.Release();
                action.MoveByOffset(-i, -i);
                action.Perform();

                offset = ExecuteScriptGetJson("return offset;");
                Console.WriteLine("Expected offset ({0}, {1}); Observed offset: ({2}, {3});", i, i, offset["xOffset"], offset["yOffset"]);
            }
        }

        // TODO: Check that preview appears also (probably manually), when it will be implemented.
        [TestMethod]
        public void TestMouseBehavior_HoverOverInfodot_HighlightAndPreview()
        {
            // Compute coordinates of infodot on the screen.
            JsCoordinates offsetVirtual = new JsCoordinates(-3200, 400); // k = 200; time = -16 * k, vyc = 2.0 * k, radv = 0.6 * k
            JsCoordinates offsetScreen = vcPageObj.PointVirtualToScreen(offsetVirtual);

            // Get the color of stroke and its width.
            string colorBefore = (string)ExecuteScript("return infodot.settings.strokeStyle;");
            double lineWidthBefore = ExecuteScriptGetNumber("return infodot.settings.lineWidth;");

            action = new ActionsExtension(Driver);
            action.MoveToElement(vcPageObj.VirtualCanvas, (int)offsetScreen.X, (int)offsetScreen.Y).Perform();

            // Get the color of stroke and its width.
            string colorAfter = (string)ExecuteScript("return infodot.settings.strokeStyle;");
            double lineWidthAfter = ExecuteScriptGetNumber("return infodot.settings.lineWidth;");

            Assert.AreNotEqual(colorBefore, colorAfter);
            Assert.IsTrue(lineWidthAfter > lineWidthBefore);
        }

        [TestMethod]
        public void TestMouseBehavior_SingleClickOnInfodot_ZoomIntoInfodot()
        {
            // Compute coordinates of infodot on the screen.
            JsCoordinates offsetVirtual = new JsCoordinates(-3200, 400); // k = 200; time = -16 * k, vyc = 2.0 * k, radv = 0.6 * k;
            JsCoordinates offsetScreen = vcPageObj.PointVirtualToScreen(offsetVirtual);

            JsVisible visibleBefore = vcPageObj.GetViewport();

            action = new ActionsExtension(Driver);
            action.MoveToElement(vcPageObj.VirtualCanvas, (int)offsetScreen.X, (int)offsetScreen.Y).Perform();
            action.Click().Perform();

            vcPageObj.WaitAnimation();

            JsVisible visibleAfter = vcPageObj.GetViewport();
            Size vcSize = vcPageObj.VirtualCanvas.Size;
            double infodotVirtualSize = 240; // k = 200; radv = 0.6 * k;
            double infodotScreenSize = infodotVirtualSize / visibleAfter.Scale;

            // Infodot fills more than 90% of canvas' height. This condition can be regulated.
            // Also check, that center of viewport in the same point as center of the infodot.
            // It indicates, that infodot is inside of visible region and that infodot fills most of its space.
            double ratio = infodotScreenSize / vcSize.Height;

            Assert.IsTrue(ratio > 0.9 && ratio < 1);
            Assert.IsTrue(visibleAfter.CenterX == offsetVirtual.X && visibleAfter.CenterY == offsetVirtual.Y);
            Assert.AreNotEqual(visibleBefore, visibleAfter);
        }

        [TestMethod]
        public void TestMouseBehavior_SingleClickOnTimeline_ZoomIntoTimeline()
        {
            // Compute coordinates of timeline's center on the screen.
            // k = 200; timeStart: -18.7 * k, timeEnd: 0, top: 0, height: 5 * k
            const double Width = 3740;
            const double Height = 1000;
            JsCoordinates offsetVirtual = new JsCoordinates(-3740 + Width / 2, 0 + Height / 2);
            JsCoordinates offsetScreen = vcPageObj.PointVirtualToScreen(offsetVirtual);

            JsVisible visibleBefore = vcPageObj.GetViewport();

            // Enable onmouseclick handler.
            ExecuteScript("timelineClickOn();");

            action = new ActionsExtension(Driver);
            action.MoveToElement(vcPageObj.VirtualCanvas, (int)offsetScreen.X, (int)offsetScreen.Y).Perform();
            action.Click().Perform();

            vcPageObj.WaitAnimation();

            JsVisible visibleAfter = vcPageObj.GetViewport();
            Size vcSize = vcPageObj.VirtualCanvas.Size;
            double timelineScreenWidth = Width / visibleAfter.Scale;
            double timelineScreenHeight = Height / visibleAfter.Scale;
            double timelineAspectRatio = timelineScreenWidth / timelineScreenHeight;
            double canvasAspectRatio = (double)vcSize.Width / vcSize.Height;
            double ratio = 0;

            // Check the side, that should fit the corresponding side of canvas.
            if (timelineAspectRatio >= canvasAspectRatio)
            {
                ratio = timelineScreenWidth / vcSize.Width;
            }
            else
            {
                ratio = timelineScreenHeight / vcSize.Height;
            }

            // Timeline fills more than 90% of canvas' side, but less or equal than 100% of the same side.
            // Also check, that center of viewport in the same point as center of the timeline.
            // It indicates, that timeline is inside of visible region and that timeline fills most of its space.
            Console.WriteLine(ratio);
            Assert.IsTrue(ratio > 0.9 && ratio <= 1);
            Assert.IsTrue(visibleAfter.CenterX == offsetVirtual.X && visibleAfter.CenterY == offsetVirtual.Y);
            Assert.AreNotEqual(visibleBefore, visibleAfter);
        }

        [TestMethod]
        public void TestMouseBehavior_SingleClickOnContentItem_ZoomIntoContentItem()
        {
            Thread.Sleep(5000);
            // Compute coordinates of infodot on the screen.
            JsCoordinates offsetVirtual = new JsCoordinates(-3200, 400); // k = 200; time = -16 * k, vyc = 2.0 * k, radv = 0.6 * k;
            JsCoordinates offsetScreen = vcPageObj.PointVirtualToScreen(offsetVirtual);

            JsVisible visibleBefore = vcPageObj.GetViewport();

            // Click on the infodot and wait animation.
            action = new ActionsExtension(Driver);
            action.MoveToElement(vcPageObj.VirtualCanvas, (int)offsetScreen.X, (int)offsetScreen.Y).Perform();
            action.Click().Perform();

            vcPageObj.WaitAnimation();

            action.SetDefault();

            offsetScreen = vcPageObj.PointVirtualToScreen(offsetVirtual);

            // Click on the content item.
            action.MoveToElement(vcPageObj.VirtualCanvas, (int)offsetScreen.X, (int)offsetScreen.Y).Perform();
            vcPageObj.WaitAnimation();
            action.Click().Perform();

            vcPageObj.WaitAnimation();

            JsVisible visibleAfter = vcPageObj.GetViewport();
            Size vcSize = vcPageObj.VirtualCanvas.Size;

            // From Javascript code:
            //
            // var _rad = 450.0 / 2.0; //489.0 / 2.0;
            // var k = 1.0 / _rad;
            // var _wc = 260.0 * k;
            // var _hc = 270.0 * k;

            // Width = _wc * rad, Height = _hc * rad, rad = 120.

            const double Width = 1.155555555555556 * 120;
            const double Height = 1.2 * 120;

            double contentItemScreenWidth = Width / visibleAfter.Scale;
            double contentItemScreenHeight = Height / visibleAfter.Scale;
            double contentItemAspectRatio = contentItemScreenWidth / contentItemScreenHeight;
            double canvasAspectRatio = (double)vcSize.Width / vcSize.Height;
            double ratio = 0;

            // Check the side, that should fit the corresponding side of canvas.
            if (contentItemAspectRatio >= canvasAspectRatio)
            {
                ratio = contentItemScreenWidth / vcSize.Width;
            }
            else
            {
                ratio = contentItemScreenHeight / vcSize.Height;
            }

            // Content item fills more than 90% of canvas' side, but less or equal than 100% of the same side.
            // Also check, that center of viewport in the same point as center of the timeline.
            // It indicates, that timeline is inside of visible region and that timeline fills most of its space.
            Assert.IsTrue(ratio > 0.9 && ratio <= 1);
            Assert.IsTrue(visibleAfter.CenterX == offsetVirtual.X && visibleAfter.CenterY == offsetVirtual.Y);
            Assert.AreNotEqual(visibleBefore, visibleAfter);
        }

        [TestMethod]
        public void TestMouseBehavior_HoverOverContentItem_Highlight()
        {
            // Compute coordinates of infodot on the screen.
            JsCoordinates offsetVirtual = new JsCoordinates(-3200, 400); // k = 200; time = -16 * k, vyc = 2.0 * k, radv = 0.6 * k;
            JsCoordinates offsetScreen = vcPageObj.PointVirtualToScreen(offsetVirtual);

            // Click on the infodot and wait animation.
            action = new ActionsExtension(Driver);
            action.MoveToElement(vcPageObj.VirtualCanvas, (int)offsetScreen.X, (int)offsetScreen.Y).Perform();
            action.Click().Perform();

            vcPageObj.WaitAnimation();

            action.SetDefault();

            string colorBefore = (string)ExecuteScript("return majorBorder.settings.strokeStyle;");

            offsetScreen = vcPageObj.PointVirtualToScreen(offsetVirtual);

            // Mouse move over the content item.
            action.MoveToElement(vcPageObj.VirtualCanvas, (int)offsetScreen.X, (int)offsetScreen.Y).Perform();
         
            string colorAfter = (string)ExecuteScript("return majorBorder.settings.strokeStyle;");

            Assert.AreNotEqual(colorBefore, colorAfter);
        }


        [TestMethod]
        public void TestGesture_PanWithInertialMotion_ViewportUpdatesCorrectly()
        {
            IWebElement vcElem = Driver.FindElement(By.Id("vc"));
            Assert.IsNotNull(vcElem, "err: cannot find canvas element");
            Assert.IsTrue(vcElem.Size.Width > 10 && vcElem.Size.Height > 10, "err: canvas size should be atleast (10px,10px) to run test");

            int width = vcElem.Size.Width - 10; // assuming a max border width of 5px on each side
            int height = vcElem.Size.Height - 10;
           
            VirtualCanvasComponent vc = new VirtualCanvasComponent(Driver);
            vc.SetVisible(new JsVisible(-3194.8898068225376, 401.0288546497742, 0.38537988462392836));
            vc.UpdateViewport();

            Random rnd = new Random();
            Point panStart = new Point(rnd.Next(width), rnd.Next(height));
            panStart.Offset(5, 5);
            Point panEnd = new Point(rnd.Next(width), rnd.Next(height));
            panEnd.Offset(5, 5);
            Vector pan = new Vector(panEnd.X - panStart.X, panEnd.Y - panStart.Y);

            JsCoordinates p1 = vc.PointScreenToVirtual(new JsCoordinates(panStart.X, panStart.Y));
            
            action = new ActionsExtension(Driver);
            action.MoveToElement(vcElem, panStart.X, panStart.Y);
            action.ClickAndHold();
            action.MoveByOffset(Convert.ToInt32(pan.X), Convert.ToInt32(pan.Y));
            action.Release();
            action.Perform();
            vc.WaitAnimation();
            
            JsCoordinates p2 = vc.PointVirtualToScreen(p1);

            // Assert that start-pt wrt the newViewport corresponds to end-pt in the oldViewport           
            Assert.AreEqual(panEnd.X, p2.X, 5);
            Assert.AreEqual(panEnd.Y, p2.Y, 5);

        }

        [TestMethod]
        public void TestGesture_ZoomWithInertialMotion_ViewportUpdatesCorrectly()
        {
            IWebElement vcElem = Driver.FindElement(By.Id("vc"));
            Assert.IsNotNull(vcElem, "err: cannot find canvas element");
            Assert.IsTrue(vcElem.Size.Width > 10 && vcElem.Size.Height > 10, "err: canvas size should be atleast (10px,10px) to run test");

            int width = vcElem.Size.Width - 10; // assuming a max border width of 5px on each side
            int height = vcElem.Size.Height - 10;

            VirtualCanvasComponent vc = new VirtualCanvasComponent(Driver);
            vc.SetVisible(new JsVisible(-3194.8898068225376, 401.0288546497742, 0.38537988462392836));
            vc.UpdateViewport();

            Random rnd = new Random();
            Point zoomPt = new Point(rnd.Next(0, width), rnd.Next(0, height));
            zoomPt.Offset(5, 5);

            JsCoordinates p1 = vc.PointScreenToVirtual(new JsCoordinates(zoomPt.X, zoomPt.Y));
            
            action = new ActionsExtension(Driver);
            action.MoveToElement(vcElem, Convert.ToInt32(zoomPt.X), Convert.ToInt32(zoomPt.Y));
            action.DoubleClick();
            action.Perform();
            vc.WaitAnimation();
            
            JsCoordinates p2 = vc.PointVirtualToScreen(p1);

            // Assert that the zoom-pt remains fixed after zooming.       
            Assert.AreEqual(zoomPt.X, p2.X, 5);
            Assert.AreEqual(zoomPt.Y, p2.Y, 5);
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class GesturesTests_Firefox : GesturesTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class GesturesTests_IE : GesturesTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}
