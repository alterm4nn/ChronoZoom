using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using Chronozoom.Test.Components;
using System.Drawing;
using System.Threading;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Interactions.Internal;
using Chronozoom.Test.Auxiliary;
using System.Drawing.Imaging;
using Chronozoom.Test.JsTypes;

namespace Chronozoom.Test.VirtualCanvasTests
{
    [TestClass]
    [TestPage("testVirtualCanvas.htm")]
    public abstract class VirtualCanvasTests : CzTestBase
    {
        private VirtualCanvasComponent vcPage;
        private ActionsExtension actions;

        [TestInitialize]
        public void TestInitialize()
        {
            GoToUrl();
            vcPage = new VirtualCanvasComponent(Driver);
        }

        [TestCleanup]
        public void TestCleanup()
        {
            if (actions != null)
            {
                actions.SetDefault();
            }
        }

        [TestMethod]
        public void TestViewport_CoordinatesMapping()
        {
            string createViewport = "var vp = new Viewport2d(2.0,100,100,new VisibleRegion2d(10.5,10.5, 0.1));";

            var result = (Driver as IJavaScriptExecutor).ExecuteScript(createViewport + "return vp.widthScreenToVirtual(10);");
            Assert.AreEqual(1.0, Convert.ToDouble(result));

            result = (Driver as IJavaScriptExecutor).ExecuteScript(createViewport + "return vp.heightScreenToVirtual(10);");
            Assert.AreEqual(2.0, Convert.ToDouble(result));

            result = (Driver as IJavaScriptExecutor).ExecuteScript(createViewport + "return vp.widthVirtualToScreen(1.0);");
            Assert.AreEqual(10.0, Convert.ToDouble(result));

            result = (Driver as IJavaScriptExecutor).ExecuteScript(createViewport + "return vp.heightVirtualToScreen(2.0);");
            Assert.AreEqual(10.0, Convert.ToDouble(result));

            result = (Driver as IJavaScriptExecutor).ExecuteScript(createViewport + "return vp.heightVirtualToScreen(2.0);");
            Assert.AreEqual(10.0, Convert.ToDouble(result));

            var dict = (Driver as IJavaScriptExecutor).ExecuteScript(createViewport + "return vp.vectorVirtualToScreen(1.0,2.0);") as Dictionary<string, object>;
            Assert.AreEqual(10.0, Convert.ToDouble(dict["x"]));
            Assert.AreEqual(10.0, Convert.ToDouble(dict["y"]));

            dict = (Driver as IJavaScriptExecutor).ExecuteScript(createViewport + "return vp.vectorScreenToVirtual(10.0,10.0);") as Dictionary<string, object>;
            Assert.AreEqual(1.0, Convert.ToDouble(dict["x"]));
            Assert.AreEqual(2.0, Convert.ToDouble(dict["y"]));

            dict = (Driver as IJavaScriptExecutor).ExecuteScript(createViewport + "return vp.pointVirtualToScreen(10.5,10.5);") as Dictionary<string, object>;
            Assert.AreEqual(50.0, Convert.ToDouble(dict["x"]));
            Assert.AreEqual(50.0, Convert.ToDouble(dict["y"]));

            dict = (Driver as IJavaScriptExecutor).ExecuteScript(createViewport + "return vp.pointVirtualToScreen(15.5,20.5);") as Dictionary<string, object>;
            Assert.AreEqual(100.0, Convert.ToDouble(dict["x"]));
            Assert.AreEqual(100.0, Convert.ToDouble(dict["y"]));

            dict = (Driver as IJavaScriptExecutor).ExecuteScript(createViewport + "return vp.pointScreenToVirtual(100.0,100.0);") as Dictionary<string, object>;
            Assert.AreEqual(15.5, Convert.ToDouble(dict["x"]));
            Assert.AreEqual(20.5, Convert.ToDouble(dict["y"]));

            dict = (Driver as IJavaScriptExecutor).ExecuteScript(createViewport + "return vp.pointScreenToVirtual(50.0,50.0);") as Dictionary<string, object>;
            Assert.AreEqual(10.5, Convert.ToDouble(dict["x"]));
            Assert.AreEqual(10.5, Convert.ToDouble(dict["y"]));
        }

        [TestMethod]
        public void TestMouse_MoveAndClick_Circle()
        {
            GoToUrl();

            IWebElement vc = Driver.FindElement(By.Id("vc"));

            actions = new ActionsExtension(Driver);
            // building mouse moves on the virtual canvas element
            actions.MoveToElement(vc, vc.Size.Width / 2, vc.Size.Height / 2);
            actions.Click();
            actions.MoveByOffset(-100, -100);
            actions.Perform();

            var res = (Driver as IJavaScriptExecutor).ExecuteScript("return isMovedIn;");
            Assert.AreNotEqual(0.0, Convert.ToDouble(res));
            res = (Driver as IJavaScriptExecutor).ExecuteScript("return isMovedOut;");
            Assert.AreNotEqual(0.0, Convert.ToDouble(res));
            res = (Driver as IJavaScriptExecutor).ExecuteScript("return isClicked;");
            Assert.AreNotEqual(0.0, Convert.ToDouble(res));
        }

        [TestMethod]
        public void TestMouse_MoveAndClick_Rectangle()
        {
            GoToUrl();

            IWebElement vc = Driver.FindElement(By.Id("vc"));

            var rectCenterX = Convert.ToDouble((Driver as IJavaScriptExecutor).ExecuteScript("return rectCenterX;"));
            var scale = Convert.ToDouble((Driver as IJavaScriptExecutor).ExecuteScript("return scale;"));

            actions = new ActionsExtension(Driver);
            // building mouse moves on the virtual canvas element
            actions.MoveToElement(vc, vc.Size.Width / 2 + (int)(rectCenterX / scale), vc.Size.Height / 2);
            actions.Click();
            actions.MoveByOffset(-100, -100);
            actions.Perform();

            var res = (Driver as IJavaScriptExecutor).ExecuteScript("return isRectMovedIn;");
            Assert.AreNotEqual(0.0, Convert.ToDouble(res));
            res = (Driver as IJavaScriptExecutor).ExecuteScript("return isRectMovedOut;");
            Assert.AreNotEqual(0.0, Convert.ToDouble(res));
            res = (Driver as IJavaScriptExecutor).ExecuteScript("return isRectClicked;");
            Assert.AreNotEqual(0.0, Convert.ToDouble(res));
        }

        [TestMethod]
        public void TestUtility_GetZoomLevel()
        {
            GoToUrl();

            var script = String.Format("return getZoomLevel({{x: 0, y: 0}});");
            var res = (Driver as IJavaScriptExecutor).ExecuteScript(script);
            Assert.AreEqual(0, Convert.ToDouble(res));

            for (int width = 1; width <= 12000; width += (width <= 256 ? 1 : 100))
            {
                script = String.Format("return getZoomLevel({{x: {0}, y: 1}});", width);
                res = (Driver as IJavaScriptExecutor).ExecuteScript(script);
                Assert.AreEqual(Math.Ceiling(Math.Log(width, 2)), Convert.ToDouble(res));

                script = String.Format("return getZoomLevel({{x: {0}, y: {0}}});", width);
                res = (Driver as IJavaScriptExecutor).ExecuteScript(script);
                Assert.AreEqual(Math.Ceiling(Math.Log(width, 2)), Convert.ToDouble(res));

                script = String.Format("return getZoomLevel({{x: 1, y: {0}}});", width);
                res = (Driver as IJavaScriptExecutor).ExecuteScript(script);
                Assert.AreEqual(Math.Ceiling(Math.Log(width, 2)), Convert.ToDouble(res));
            }
        }

        [TestMethod]
        public void TestUpdateViewport_ResizeVirtualCanvas_ChildrenSizeMustBeEqual()
        {
            const int NewHeight = 480;

            Size virtualCanvasSizeBefore = vcPage.VirtualCanvas.Size;
            Size layerTimelinesSizeBefore = vcPage.LayerTimelines.Size;
            Size layerInfodotsSizeBefore = vcPage.LayerInfodots.Size;

            // It's strange, but Size property for virtual canvas returns
            // the value, that greater than actual value by 2.
            // (This fact is verified in IE and FF browsers)
            virtualCanvasSizeBefore.Width -= 2;
            virtualCanvasSizeBefore.Height -= 2;

            Assert.AreEqual(virtualCanvasSizeBefore, layerInfodotsSizeBefore);
            Assert.AreEqual(virtualCanvasSizeBefore, layerTimelinesSizeBefore);

            vcPage.ResizeVirtualCanvas(NewHeight);
            vcPage.UpdateViewport();

            Size virtualCanvasSizeAfter = vcPage.VirtualCanvas.Size;
            Size layerTimelinesSizeAfter = vcPage.LayerTimelines.Size;
            Size layerInfodotsSizeAfter = vcPage.LayerInfodots.Size;

            virtualCanvasSizeAfter.Width -= 2;
            virtualCanvasSizeAfter.Height -= 2;

            Assert.AreEqual(NewHeight, virtualCanvasSizeAfter.Height);
            Assert.AreEqual(virtualCanvasSizeBefore, layerInfodotsSizeBefore);
            Assert.AreEqual(virtualCanvasSizeBefore, layerTimelinesSizeBefore);
        }

        [TestMethod]
        public void TestVirtualCanvas_OnInitialization_ContainsCanvases()
        {
            const string CanvasTagName = "canvas";

            Assert.IsNotNull(vcPage.LayerTimelines.FindElement(By.TagName(CanvasTagName)));
            Assert.IsNotNull(vcPage.LayerInfodots.FindElement(By.TagName(CanvasTagName)));
        }

        [TestMethod]
        public void TestVirtualCanvas_OnInitialization_CssClassesEstablished()
        {
            const string CanvasTagName = "canvas";

            Assert.AreEqual(vcPage.VirtualCanvas.GetAttribute("class"), VirtualCanvasComponent.VirtualCanvasCssClass);
            Assert.AreEqual(vcPage.LayerTimelines.GetAttribute("class"), VirtualCanvasComponent.VirtualCanvasLayerDivCssClass);
            Assert.AreEqual(vcPage.LayerInfodots.GetAttribute("class"), VirtualCanvasComponent.VirtualCanvasLayerDivCssClass);

            var canvases = vcPage.VirtualCanvas.FindElements(By.TagName(CanvasTagName));
            foreach (var canvas in canvases)
            {
                Assert.AreEqual(canvas.GetAttribute("class"), VirtualCanvasComponent.VirtualCanvasLayerCanvasCssClass);
            }
        }

        [TestMethod]
        public void TestViewport_ChangeViewport_VisibleChanged()
        {
            // TODO: probably it's good idea to make this input values random.
            const double offsetX = 50;
            const double offsetY = 25;
            const double scaleBias = 1;

            JsVisible offset = new JsVisible(offsetX, offsetY, scaleBias);

            JsVisible visibleBefore = vcPage.GetViewport();
            JsVisible newVisible = visibleBefore;
            JsVisible visibleAfter;

            newVisible += offset;

            vcPage.SetVisible(newVisible);
            visibleAfter = vcPage.GetViewport();

            Assert.AreEqual(newVisible, visibleAfter);

            newVisible -= offset;

            vcPage.SetVisible(newVisible);
            visibleAfter = vcPage.GetViewport();

            Assert.AreEqual(visibleBefore, visibleAfter);
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class VirtualCanvasTests_Firefox : VirtualCanvasTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class VirtualCanvasTests_IE : VirtualCanvasTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}

