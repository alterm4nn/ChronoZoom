using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Chronozoom.Test.Auxiliary;
using Chronozoom.Test.Components;
using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;
using System.Threading;
using System.IO;
using System.Diagnostics;
using OpenQA.Selenium.Interactions.Internal;
using OpenQA.Selenium.Interactions;
using System.Drawing.Imaging;

namespace Chronozoom.Test.AxisTests
{
    [TestClass]
    [TestPage("cz.htm")]
    public abstract class AxisPanAndZoomTest : CzTestBase
    {
        private ActionsExtension action;
        private VirtualCanvasComponent vcPageObj;

        [TestCleanup]
        public void TestCleanup()
        {
            if (action != null)
            {
                action.SetDefault();
            }
        }

        // Test is obsolete. It is dulpicated by manual test cases.
        [Ignore]
        [TestMethod]
        public void TestMinZoom()
        {
            GoToUrl();

            vcPageObj = new VirtualCanvasComponent(Driver);

            MinZoom(4, 2, 27, 4, 2, 29, 7, 4.4);
            MinZoom(2000, 2, 27, 2000, 3, 1, 32, 2000.3843);
            MinZoom(1439, 7, 3, 1439, 7, 5, 1, 234.123);
            MinZoom(24, 4, 5, 24, 3, 8, 2, 34.0);
            MinZoom(1439, 7, 3, 1439, 7, 5, 1, 234.123);

        }

        public void MinZoom(int sYear, int sMonth, int sDay, int eYear, int eMonth, int eDay, int zoom, double l)
        {

            action = new ActionsExtension(Driver);
            IWebElement vc = Driver.FindElement(By.Id("vc"));
            const int offsetX = 100;
            const int offsetY = 100;

            var d = (Driver as IJavaScriptExecutor).ExecuteScript
                        ("return $(\"#axis\").axis(\"getYearsBetweenDates\"," +
                        sYear + "," + sMonth + "," + sDay + "," + eYear + "," + eMonth + "," + eDay + ");");

            double n = Convert.ToDouble(d);
            double r = n + l;

            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setRange\"," + l + "," + r + ");");

            action.MoveToElement(vcPageObj.VirtualCanvas, offsetX, offsetY).Perform();
            //action.MoveByOffset(offsetX, offsetY);
            for (int k = 0; k < zoom; k++)
            {
                action.DoubleClick();
            }
            action.Perform();


            var afterZoom = (Driver as IJavaScriptExecutor).
                    ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var azl = Convert.ToDouble((afterZoom as Dictionary<string, object>)["left"]);
            var azr = Convert.ToDouble((afterZoom as Dictionary<string, object>)["right"]);
            double z = azr - azl;

            int a1 = 123, a2 = 2, a3 = 3, b3 = 4;
            var v = (Driver as IJavaScriptExecutor).ExecuteScript
            ("return $(\"#axis\").axis(\"getYearsBetweenDates\"," +
            a1 + "," + a2 + "," + a3 + "," + a1 + "," + a2 + "," + b3 + ");");
            double w = Convert.ToDouble(v);

            Assert.IsTrue(z > w);

        }


        public void MouseActiveLeft(double left, double right, int shift)
        {
            Actions action = new Actions(Driver);

            IWebElement axi = Driver.FindElement(By.Id("axis"));
            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setRange\"," + left + "," + right + ");");
            var before = (Driver as IJavaScriptExecutor).ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var bL = Convert.ToDouble((before as Dictionary<string, object>)["left"]);
            var bR = Convert.ToDouble((before as Dictionary<string, object>)["right"]);

            action.Build();
            action.DragAndDropToOffset(axi, -shift, 0);
            action.Perform();

            var after = (Driver as IJavaScriptExecutor).ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var aL = Convert.ToDouble((after as Dictionary<string, object>)["left"]);
            var aR = Convert.ToDouble((after as Dictionary<string, object>)["right"]);
            Assert.IsTrue(aL > bL && aR > bR);
        }

        public void MouseActiveRight(double left, double right, int shift)
        {
            Actions action = new Actions(Driver);

            IWebElement axi = Driver.FindElement(By.Id("axis"));
            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setRange\"," + left + "," + right + ");");
            var before = (Driver as IJavaScriptExecutor).ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var bL = Convert.ToDouble((before as Dictionary<string, object>)["left"]);
            var bR = Convert.ToDouble((before as Dictionary<string, object>)["right"]);

            action.Build();
            action.DragAndDropToOffset(axi, shift, 0);
            action.Perform();

            var after = (Driver as IJavaScriptExecutor).ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var aL = Convert.ToDouble((after as Dictionary<string, object>)["left"]);
            var aR = Convert.ToDouble((after as Dictionary<string, object>)["right"]);
            Assert.IsTrue(aL < bL && aR < bR);
        }

        // Test is obsolete. It is dulpicated by tests in CanvasAxisInteractionTests.cs and manual test cases.
        [Ignore]
        [TestMethod]
        public void TestDifActives()
        {
            GoToUrl();

            MouseActiveLeft(-13700000000, -400, 456);
            MouseActiveLeft(-2, -1, 1);
            MouseActiveLeft(-4075698749, -24155128, 45645);
            MouseActiveLeft(-34525, -34524, 563);
            MouseActiveLeft(-0.9, -0.1, 34);
            MouseActiveRight(-345, 0, 100);
            MouseActiveRight(-2, -1, 100);
            MouseActiveRight(-407569874, -24155128, 334);
            MouseActiveRight(-34525, -34524, 200);
            MouseActiveRight(-0.9, -0.1, 80);

        }

    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class AxisPanAndZoomTest_Firefox : AxisPanAndZoomTest
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class AxisPanAndZoomTest_IE : AxisPanAndZoomTest
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}
