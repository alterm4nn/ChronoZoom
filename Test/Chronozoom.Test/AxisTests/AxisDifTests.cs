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
    [TestPage("axis.htm")]
    public abstract class AxisDifTests : CzTestBase
    {
        [TestInitialize]
        public void TestInitialize()
        {
            Browser = BrowserType.InternetExplorer;
            Start();
        }

 // if left>right then left=-13700000000, right=0 	
        public void IfLeftMoreThenRight(double l, double r)
        {
            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setRange\"," + l + "," + r + ");");
            var range = (Driver as IJavaScriptExecutor).
                    ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var l2 = Convert.ToDouble((range as Dictionary<string, object>)["left"]);
            var r2 = Convert.ToDouble((range as Dictionary<string, object>)["right"]);
            Assert.IsTrue(l2 == -13700000000.0 && r2 == 0.0);
        }
        
        [TestMethod]
        public void TestIfLeftMoreThenRight()
        {
            GoToUrl();

            IfLeftMoreThenRight(-20.0, -111.1);
            IfLeftMoreThenRight(-0.0, -12700000000.0);
            IfLeftMoreThenRight(-1242.234, -3463.1);
        }

        /* set the range,change the range -> range changes */
        public void SetGet(double change1, double change2)
        {
            var rangeBefore = (Driver as IJavaScriptExecutor).
            ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var lB = Convert.ToDouble((rangeBefore as Dictionary<string, object>)["left"]);
            var rB = Convert.ToDouble((rangeBefore as Dictionary<string, object>)["right"]);

            double lA = lB - change1;
            double rA = rB - change2;
            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setRange\"," + lA + "," + rA + ");");
            var rangeAfter = (Driver as IJavaScriptExecutor).
            ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var lAA = Convert.ToDouble((rangeAfter as Dictionary<string, object>)["left"]);
            var rAA = Convert.ToDouble((rangeAfter as Dictionary<string, object>)["right"]);

            Assert.IsTrue(lB == lA + change1 && rB == rA + change2);
        }

        [TestMethod]
        public void TestSetGet()
        {
            GoToUrl();
            SetGet(300.0, 100.0);
            SetGet(123435.0, 23.0);
        }

        //Must be no more than four decimal places.
        public void Rounding(double lx, double rx)
        {
            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setRange\"," + lx + "," + rx + ");");
            var range = (Driver as IJavaScriptExecutor).
            ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            var lr = Convert.ToDouble((range as Dictionary<string, object>)["left"]);
            var rr = Convert.ToDouble((range as Dictionary<string, object>)["right"]);

            Assert.IsTrue(Math.Round(lx, 4) == lr & Math.Round(rx, 4) == rr);
            
        }

        // Test is obsolete. It is duplicated by other tests and manual test cases.
        [Ignore]
        [TestMethod]
        public void TestRounding()
        {
            GoToUrl();

            Rounding(-145827349327.2347352836, -3.234222);
            Rounding(-5.2347352836, -0.0876087654757);
            Rounding(-234.15643764103412, -4.0);
        }

    }
    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class AxisDifTests_Firefox : AxisDifTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class AxisDifTests_IE : AxisDifTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}

