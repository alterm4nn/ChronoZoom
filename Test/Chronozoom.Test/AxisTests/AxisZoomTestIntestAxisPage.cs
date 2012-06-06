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
    [TestPage("testAxis.htm")]
    public abstract class AxisZoomTestIntestAxisPage : CzTestBase
    {
        // private ActionsExtension action;

        [TestInitialize]
        public void TestInitialize()
        {
            Browser = BrowserType.InternetExplorer;
            Start();
        }
        /*
        [TestCleanup]
        public void TestCleanup()
        {
            if (action != null)
            {
                action.SetDefault();
            }
        }
        */

        // zoom in  
        public void ZoomIn(double l, double r)
        {
            IWebElement buttonZoomIn = Driver.FindElement(By.Id("buttonZoomIn"));
            Actions actions = new Actions(Driver);

            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setRange\"," + l + "," + r + ");");
            var beforeZoomIn = (Driver as IJavaScriptExecutor).
            ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var bzl = Convert.ToDouble((beforeZoomIn as Dictionary<string, object>)["left"]);
            var bzr = Convert.ToDouble((beforeZoomIn as Dictionary<string, object>)["right"]);
            double z1 = bzr - bzl;

            actions.Build();
            actions.MoveToElement(buttonZoomIn, 0, 0);
            actions.Click();
            actions.Release();
            actions.Perform();

            var afterZoomIn = (Driver as IJavaScriptExecutor).
            ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var azl = Convert.ToDouble((afterZoomIn as Dictionary<string, object>)["left"]);
            var azr = Convert.ToDouble((afterZoomIn as Dictionary<string, object>)["right"]);
            double z2 = azr - azl;

            if (bzl == -13700000000.0 && bzr == 0.0)
            {
                Assert.IsTrue(z1 == z2);
            }
            else
            {
                Assert.IsTrue(z1 > z2);
            }
        }

        [TestMethod]
        public void TestZoomIn()
        {

            GoToUrl();

            ZoomIn(-13700000000.0, -13600840236.0);
            ZoomIn(-45.234, -23.3452);
            ZoomIn(-2323.3, -2321.2); ;
            ZoomIn(-2342.0, 0.0);
        }

        // zoom out  
        public void ZoomOut(double l, double r)
        {
            IWebElement buttonZoomOut = Driver.FindElement(By.Id("buttonZoomOut"));
            Actions actions = new Actions(Driver);

            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setRange\"," + l + "," + r + ");");
            var beforeZoomOut = (Driver as IJavaScriptExecutor).
            ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var bzl = Convert.ToDouble((beforeZoomOut as Dictionary<string, object>)["left"]);
            var bzr = Convert.ToDouble((beforeZoomOut as Dictionary<string, object>)["right"]);
            double z1 = bzr - bzl;

            actions.Build();
            actions.MoveToElement(buttonZoomOut, 0, 0);
            actions.Click();
            actions.Release();
            actions.Perform();

            var afterZoomOut = (Driver as IJavaScriptExecutor).
            ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var azl = Convert.ToDouble((afterZoomOut as Dictionary<string, object>)["left"]);
            var azr = Convert.ToDouble((afterZoomOut as Dictionary<string, object>)["right"]);
            double z2 = azr - azl;

            if (z1 <= OneDay(134, 5, 2, 4))
            {
                Assert.IsTrue(z1 <= z2);
            }
            else
            {
                Assert.IsTrue(z1 < z2);
            }
        }

        [TestMethod]
        public void TestZoomOut()
        {
            GoToUrl();

            ZoomOut(-13700000000.0, -13600828436.0);
            ZoomOut(-52.214, -21.3452);
            ZoomOut(-1578.3, -15.2);
            ZoomOut(-2342.0, 0.0);
        }

        [TestMethod]
        public void TestZoomInMarker()
        {
            GoToUrl();

            IWebElement buttonHelper = Driver.FindElement(By.Id("buttonHelper"));
            IWebElement buttonZoomMarkerIn = Driver.FindElement(By.Id("buttonZoomMarkerIn"));
            Actions actions = new Actions(Driver);

            actions.Build();
            actions.MoveToElement(buttonHelper, 0, 0);
            actions.Click();

            var afterHelper = (Driver as IJavaScriptExecutor).
            ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var ahl = Convert.ToDouble((afterHelper as Dictionary<string, object>)["left"]);
            var ahr = Convert.ToDouble((afterHelper as Dictionary<string, object>)["right"]);
            double z1 = ahr - ahl;

            actions.MoveToElement(buttonZoomMarkerIn, 0, 0);
            actions.Click();
            actions.Release();
            actions.Perform();

            var afterZoomInMarker = (Driver as IJavaScriptExecutor).
            ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var azml = Convert.ToDouble((afterZoomInMarker as Dictionary<string, object>)["left"]);
            var azmr = Convert.ToDouble((afterZoomInMarker as Dictionary<string, object>)["right"]);
            double z2 = azmr - azml;

            Assert.IsTrue(ahl < azml && ahr > azmr && z1 > z2);
        }

        [TestMethod]
        public void TestZoomOutMarker()
        {
            GoToUrl();

            IWebElement buttonHelper = Driver.FindElement(By.Id("buttonHelper"));
            IWebElement buttonZoomMarkerOut = Driver.FindElement(By.Id("buttonZoomMarkerOut"));
            Actions actions = new Actions(Driver);

            actions.Build();
            actions.MoveToElement(buttonHelper, 0, 0);
            actions.Click();

            var afterHelper = (Driver as IJavaScriptExecutor).
            ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var ahl = Convert.ToDouble((afterHelper as Dictionary<string, object>)["left"]);
            var ahr = Convert.ToDouble((afterHelper as Dictionary<string, object>)["right"]);
            double z1 = ahr - ahl;

            actions.MoveToElement(buttonZoomMarkerOut, 0, 0);
            actions.Click();
            actions.Release();
            actions.Perform();

            var afterZoomOutMarker = (Driver as IJavaScriptExecutor).
            ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var azml = Convert.ToDouble((afterZoomOutMarker as Dictionary<string, object>)["left"]);
            var azmr = Convert.ToDouble((afterZoomOutMarker as Dictionary<string, object>)["right"]);
            double z2 = azmr - azml;

            Assert.IsTrue(ahl > azml && ahr < azmr && z1 < z2);
        }

        public double OneDay(int a1, int a2, int a3, int a4)
        {
            //int a1 = 123, a2 = 2, a3 = 3, a4 = 4;

            var v = (Driver as IJavaScriptExecutor).ExecuteScript
            ("return $(\"#axis\").axis(\"getYearsBetweenDates\"," +
            a1 + "," + a2 + "," + a3 + "," + a1 + "," + a2 + "," + a4 + ");");

            double w = Convert.ToDouble(v);

            return w;
        }

        ////inner zoom not deeper 1 day
        public void MinZoomDay(int sYear, int sMonth, int sDay, int eYear, int eMonth, int eDay, double l, int zoom)
        {
            IWebElement buttonZoomIn = Driver.FindElement(By.Id("buttonZoomIn"));
            Actions actions = new Actions(Driver);

            var d = (Driver as IJavaScriptExecutor).ExecuteScript
                        ("return $(\"#axis\").axis(\"getYearsBetweenDates\"," +
                        sYear + "," + sMonth + "," + sDay + "," + eYear + "," + eMonth + "," + eDay + ");");

            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setPresent\"," + sYear + "," + sMonth + "," + sDay + ");");


            double betwenDays = Convert.ToDouble(d);
            double r = betwenDays + l;
            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setRange\"," + l + "," + r + ");");

            actions.Build();
            actions.MoveToElement(buttonZoomIn, 0, 0);
            for (int k = 0; k < zoom; k++)
            {
                actions.Click();
            }
            actions.Release();
            actions.Perform();

            var afterZoom = (Driver as IJavaScriptExecutor).
            ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var azl = Convert.ToDouble((afterZoom as Dictionary<string, object>)["left"]);
            var azr = Convert.ToDouble((afterZoom as Dictionary<string, object>)["right"]);
            double z = azr - azl;

            double d1 = OneDay(1233, 3, 4, 5);
            double d2 = OneDay(23, 8, 17, 18);
            double d3 = OneDay(2005, 11, 1, 2);
            Assert.IsTrue(z >= d1);
            Assert.IsTrue(z >= d2);
            Assert.IsTrue(z >= d3);
        }

        [TestMethod]
        public void TestMinZoomDay()
        {
            GoToUrl();

            MinZoomDay(234, 12, 5, 453, 11, 2, -1777.9, 13);
            MinZoomDay(1478, 3, 6, 1478, 3, 8, -532.0, 4);
            MinZoomDay(2004, 2, 28, 2004, 3, 1, -7.3, 1);
        }

        public int Counter(double a)
        {
            int whole = (int)a;
            double fract = a - whole;
            int count = 0;
            double f;
            while (fract != 0.0)
            {
                count++;
                f = fract * 10.0;
                int w = (int)f;
                fract = f - w;
            }
            return count;
        }

        //inner zoom not deeper 4 decimal fraction digits
        public void MinZoomNoMoreFourSigns(double x1, double x2, int zoom)
        {

            IWebElement buttonZoomIn = Driver.FindElement(By.Id("buttonZoomIn"));
            Actions actions = new Actions(Driver);

            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setRange\"," + x1 + "," + x2 + ");");

            actions.Build();
            actions.MoveToElement(buttonZoomIn, 0, 0);
            for (int k = 0; k < zoom; k++)
            {
                actions.Click();
            }
            actions.Release();
            actions.Perform();

            var afterZoom = (Driver as IJavaScriptExecutor).
            ExecuteScript("return $(\"#axis\").axis(\"getRange\");");

            var afterzooml = Convert.ToDouble((afterZoom as Dictionary<string, object>)["left"]);
            var afterzoomr = Convert.ToDouble((afterZoom as Dictionary<string, object>)["right"]);
            double aftern = afterzoomr - afterzooml;

            int decimaldigitsl = Counter(afterzooml);
            int decimaldigitsr = Counter(afterzoomr);
            int decimaldigitsn = Counter(aftern);

            Assert.IsTrue(decimaldigitsl <= 4 && decimaldigitsr <= 4);
            Assert.IsTrue(decimaldigitsn <= 4);
        }

        [TestMethod]
        public void TestMinZoomNoMoreFourSigns()
        {
            GoToUrl();

            MinZoomNoMoreFourSigns(-3456.31, -3456.29, 2);
            MinZoomNoMoreFourSigns(-236.0, -235.0, 5);
            MinZoomNoMoreFourSigns(-1234.4, -1200.0, 4);
            MinZoomNoMoreFourSigns(-3.435, -3.501, 7);

        }

        //an boundary constraint (to prevent the user from observing the future and the past(e.g. before 13.7Ga BC) )
        public void MaxZoom(double lt, double rt, int zoom)
        {
            IWebElement buttonZoomOut = Driver.FindElement(By.Id("buttonZoomOut"));
            Actions actions = new Actions(Driver);

            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setRange\"," + lt + "," + rt + ");");

            actions.Build();
            actions.MoveToElement(buttonZoomOut, 0, 0);
            for (int k = 0; k < zoom; k++)
            {
                actions.Click();
            }
            actions.Release();
            actions.Perform();

            var afterZoom = (Driver as IJavaScriptExecutor).
            ExecuteScript("return $(\"#axis\").axis(\"getRange\");");

            var afterzooml = Convert.ToDouble((afterZoom as Dictionary<string, object>)["left"]);
            var afterzoomr = Convert.ToDouble((afterZoom as Dictionary<string, object>)["right"]);

            Assert.IsTrue(afterzooml >= -13700000000.0);
            Assert.IsTrue(afterzoomr <= 0.0);
        }

        [TestMethod]
        public void TestMaxZoom()
        {
            GoToUrl();

            MaxZoom(-13700000000.0, 0.0, 2);
            MaxZoom(-12600000000.45, -1.9, 12);
            MaxZoom(-13699999999.0, 0.0, 5);
            MaxZoom(-45245.0, -30.0, 5);
        }

    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class AxisZoomTestIntestAxisPage_Firefox : AxisZoomTestIntestAxisPage
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class AxisZoomTestIntestAxisPage_IE : AxisZoomTestIntestAxisPage
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}