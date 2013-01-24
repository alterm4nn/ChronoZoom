using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using System.Threading;

namespace Chronozoom.Test.ViewportTests
{
    [TestClass]
    [TestPage("testFunctions.htm")]
    public abstract class ViewportAnimationTests : CzTestBase
    {                
        [TestMethod]
        public void TestEllipticalZoom()
        {
            GoToUrl();
            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;
            string script = "var vp = new Viewport2d(2.0,100,100,new VisibleRegion2d(10,5, 0.1));" +
                "var anim = new EllipticalZoom(vp.visible, new VisibleRegion2d(11,6,0.001));" + //creating animation
            "var startX = anim.x(0); var startY = anim.y(0); var startScale = anim.scale(0);" + // the visible region at the start of the animation
            "var endX = anim.x(1); var endY = anim.y(1); var endScale = anim.scale(1);" + //the visible region at the end of the animation
            "for(var i=0;i<1000000;i++) Math.pow(i,3);" + // busy loop delay
            "var middleVis = anim.produceNextVisible(vp);" +//requesting next animation frame,storing visible of the animation frame in the middle of animation                
            "return {startX:startX,startY:startY,startScale:startScale,  endX:endX,endY:endY,endScale:endScale, middleX:middleVis.centerX,middleY:middleVis.centerY,middleScale:middleVis.scale }"; //incapsulating all data into single object


            var dict = js.ExecuteScript(script) as Dictionary<string, object>; // requesting a frame in the middle of the animation
            double startX = Convert.ToDouble(dict["startX"]);
            double startY = Convert.ToDouble(dict["startY"]);
            double startScale = Convert.ToDouble(dict["startScale"]);

            double endX = Convert.ToDouble(dict["endX"]);
            double endY = Convert.ToDouble(dict["endY"]);
            double endScale = Convert.ToDouble(dict["endScale"]);

            double middleX = Convert.ToDouble(dict["middleX"]);
            double middleY = Convert.ToDouble(dict["middleY"]);
            double middleScale = Convert.ToDouble(dict["middleScale"]);

            Assert.AreEqual(10.0, startX,1e-10);
            Assert.AreEqual(5, startY, 1e-10);
            Assert.AreEqual(0.1, startScale,1e-10);

            Assert.AreEqual(11.0, endX,1e-10);
            Assert.AreEqual(6, endY,1e-10);
            Assert.AreEqual(0.001, endScale,1e-10);

            Assert.IsTrue(startX < middleX && endX > middleX);
            Assert.IsTrue(startY < middleY && endY > middleY);
            
        }

        /// <summary>
        /// Request animation frame during panning. Verifys that center of the visible is in transition
        /// </summary>
        [TestMethod]        
        public void TestZoomPanAnimation_produceNextVisible()
        {
            GoToUrl();
            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;
            string requestAnimationFrameInTheMiddleOfAnimation = "var vp = new Viewport2d(2.0,100,100,new VisibleRegion2d(10,5, 0.1));" +
                "var anim = new PanZoomAnimation(vp);" + //creating animation
                "anim.setTargetViewport(new Viewport2d(2.0,100,100,new VisibleRegion2d(20,15, 0.1)));" + // panning
                "for(var i=0;i<1000000;i++) Math.pow(i,3);" + // busy loop delay
                "return anim.produceNextVisible(vp);"; //requesting frame
                       
            
            var dict=js.ExecuteScript(requestAnimationFrameInTheMiddleOfAnimation) as Dictionary<string, object>; // requesting a frame in the middle of the animation
            double x = Convert.ToDouble(dict["centerX"]);
            double y = Convert.ToDouble(dict["centerY"]);            
            Assert.IsTrue(x>= 10 && x<=20);
            Assert.IsTrue(y >= 5 && x <= 15);
            Assert.AreEqual(0.1, Convert.ToDouble(dict["scale"]));
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class ViewportAnimationTests_Firefox : ViewportAnimationTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class ViewportAnimationTests_IE : ViewportAnimationTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}

