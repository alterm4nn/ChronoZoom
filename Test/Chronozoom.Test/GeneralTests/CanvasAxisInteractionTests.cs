using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using System.Threading;
using Chronozoom.Test.Components;
using Chronozoom.Test.Auxiliary;

namespace Chronozoom.Test.GeneralTests
{
    /// <summary>
    /// The class contains test of integrating VirtualCanvas and Axis components through ViewportController
    /// </summary>
    [TestClass]
    [TestPage("cz.htm")]
    public abstract class CanvasAxisInteractionTests : CzTestBase
    {
        [TestInitialize]
        public void TestInitialize()
        {
            GoToUrl();
            var vcPageObj = new VirtualCanvasComponent(Driver);
            vcPageObj.WaitContentLoading();
        }

        [TestMethod]
        public void TestAxisSyncedWithCanvas()
        {
            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;

            var canvasRange = (Driver as IJavaScriptExecutor).ExecuteScript(
                "var vp=$('#vc').virtualCanvas('getViewport');"+ //viewport reference
                "var canvasWidth= vp.width;"+ // the canvas size in pixels
                "var offset=vp.visible.scale*canvasWidth*0.5;" + //an offset to calculate boundaries in virtual coordinates
                "return {left:vp.visible.centerX-offset,right:vp.visible.centerX+offset,scale:vp.visible.scale};" //canvas shown range in virtual coords, and scale
                ) as Dictionary<string, object>;

            var axisRange = (Driver as IJavaScriptExecutor).ExecuteScript("return $('#axis').axis('getRange')") as Dictionary<string, object>; //axis shown range in virtual coords
            
            double canvasLeft = Convert.ToDouble(canvasRange["left"]);
            double canvasRight = Convert.ToDouble(canvasRange["right"]);
            double axisLeft = Convert.ToDouble(axisRange["left"]);
            double axisRight = Convert.ToDouble(axisRange["right"]);
            double eps = Convert.ToDouble(canvasRange["scale"]) * 0.5;//a difference threshold. the difference must be less than half a pixel

            Assert.AreEqual(canvasLeft, axisLeft, eps);
            Assert.AreEqual(canvasRight, axisRight, eps);           
        }

        /// <summary>
        /// Successful scenario of pan using the axis
        /// </summary>
        [TestMethod]
        public void TestAxisPan()
        {
            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;

            IWebElement axis = Driver.FindElement(By.Id("axis"));

            var previousVisible = (Driver as IJavaScriptExecutor).ExecuteScript("return $('#vc').virtualCanvas('getViewport').visible;") as Dictionary<string, object>; //saving initial visible region

            ActionsExtension pan = new ActionsExtension(Driver);
       
            pan.MoveToElement(axis,axis.Size.Width/2,axis.Size.Height/2);
            pan.ClickAndHold();
            pan.MoveByOffset(-50, 20);            
            pan.Release();
            pan.Perform(); //preforming panning

            pan.SetDefault(); // return mouse position to default

            Thread.Sleep(3000); //waiting the animation to complete

            var newVisible = (Driver as IJavaScriptExecutor).ExecuteScript("return $('#vc').virtualCanvas('getViewport').visible;") as Dictionary<string, object>; //saving new visible region after pan

            Assert.AreEqual(Convert.ToDouble(previousVisible["centerY"]), Convert.ToDouble(newVisible["centerY"])); //the Y must not be changed, as the axis pan is only horizontal 
            Assert.IsTrue(Convert.ToDouble(previousVisible["centerX"]) < Convert.ToDouble(newVisible["centerX"])); //the X must ascend

        }
    }



        [TestClass]
        [WebDriverSettings(BrowserType.Firefox)]
        public class CanvasAxisInteractionTests_Firefox : CanvasAxisInteractionTests
        {
            [ClassCleanup]
            public static void ClassCleanup()
            {
                Stop();
            }
        }

        [TestClass]
        [WebDriverSettings(BrowserType.InternetExplorer)]
        public class CanvasAxisInteractionTests_IE : CanvasAxisInteractionTests
        {
            [ClassCleanup]
            public static void ClassCleanup()
            {
                Stop();
            }
        }    
}

