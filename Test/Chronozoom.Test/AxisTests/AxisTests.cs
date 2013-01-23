using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using System.Globalization;

namespace Chronozoom.Test.AxisTests
{
    /// <summary>
    /// Class that contains tests of axis.
    /// </summary>
    [TestClass]
    [TestPage("axis.htm")]
    public abstract class AxisTests : CzTestBase
    {
        [TestInitialize]
        public void TestInitialize()
        {
            Browser = BrowserType.InternetExplorer;
            Start();
        }

        /// <summary>
        /// Test method to check different ranges of axis in cosmos mode ('Ga', 'Ma', 'ka').
        /// Uses <see cref="CheckRange"/> method.
        /// </summary>
        [TestMethod]
        public void TestCosmosRange()
        {
            GoToUrl();

            // testing zooming near 0
            double left = -14000000000;
            double right = 1;
            while (left <= -10000)
            {
                CheckRange(Math.Round(left), right);
                left /= 2;
            }

            // testing zooming into billions of years ago
            left = -14000000000;
            right = -1000000000;
            var step = (right - left) / 20;
            while (step > 100000)
            {
                CheckRange(left, right);
                step = Math.Round((right - left) / 10);
                left += step;
                right -= step;
            }

            // testing zooming into millions of years ago
            left = -99000000;
            right = -1000000;
            step = (right - left) / 20;
            while (step > 100)
            {
                CheckRange(left, right);
                step = Math.Round((right - left) / 10);
                left += step;
                right -= step;
            }
        }

        /// <summary>
        /// Passes new range to axis and gets it back.
        /// Then checks that range is the same as passed and all the ticks are inside range and are rendered with the same delta between them.
        /// </summary>
        /// <param name="left">Left value of range.</param>
        /// <param name="right">Right value of range.</param>
        private void CheckRange(double left, double right)
        {
            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setRange\"," + left + "," + right + ");");
            var range = (Driver as IJavaScriptExecutor).
                    ExecuteScript("return $(\"#axis\").axis(\"getRange\");");
            Assert.AreEqual(Convert.ToDouble((range as Dictionary<string, object>)["left"]), left);
            Assert.AreEqual(Convert.ToDouble((range as Dictionary<string, object>)["right"]), right);
            var ticks = ((Driver as IJavaScriptExecutor).
                    ExecuteScript("return $(\"#axis\").axis(\"Ticks\");") as ICollection<object>).ToList();
            var prevTick = ticks.First();
            double prevDelta = 0;
            double delta = 0;
            for (int i = 0; i < ticks.Count; i++)
            {
                Assert.IsTrue(Convert.ToDouble(ticks[i]) <= right);
                Assert.IsTrue(Convert.ToDouble(ticks[i]) >= left);

                if (i != 0)
                {
                    delta = Convert.ToDouble(ticks[i]) - Convert.ToDouble(prevTick);
                    Assert.AreNotEqual(delta, 0);
                    if (i != 1) Assert.AreEqual(delta, prevDelta);
                }
                prevTick = ticks[i];
                prevDelta = delta;
            }
        }

        /// <summary>
        /// Test method to check that time passed between two dates it calculated correctly.
        /// Uses <see cref="CheckConvertion"/> method.
        /// </summary>
        [TestMethod]
        public void TestDateConvertion()
        {
            GoToUrl();
                        
            CheckConvertion(1960, 1, 1, 1961, 11, 31);
            CheckConvertion(1999, 7, 12, 2000, 2, 1);
        }

        /// <summary>
        /// Calculates the gap between two given dates, then calculate the second date from given first and known gap.
        /// Checks that result is correct.
        /// </summary>
        /// <param name="startYear">Year of first date.</param>
        /// <param name="startMonth">Month of first date.</param>
        /// <param name="startDay">Day of first date.</param>
        /// <param name="endYear">Year of second date.</param>
        /// <param name="endMonth">Month of second date.</param>
        /// <param name="endDay">Day of second date.</param>
        private void CheckConvertion(int startYear, int startMonth, int startDay, int endYear, int endMonth, int endDay)
        {
            var n = ExecuteScriptGetNumber
                        ("return getYearsBetweenDates(" + startYear + "," + startMonth + "," + startDay + "," + endYear + "," + endMonth + "," + endDay + ");");

            var date = ExecuteScriptGetJson
                        ("return getDateFrom(" + endYear + "," + endMonth + "," + endDay + "," + n.ToString(CultureInfo.CreateSpecificCulture("en-US")) + ");");

            Assert.AreEqual(Convert.ToDouble(date["year"]), startYear);
            Assert.AreEqual(Convert.ToDouble(date["month"]), startMonth);
            Assert.AreEqual(Convert.ToDouble(date["day"]), startDay);
        }

        /// <summary>
        /// Tests transition between 'cosmos' and 'calendar' modes of axis.
        /// Passes different ranges to axis and checks that axis mode changes.
        /// </summary>
        [TestMethod]
        public void TestRangeTransition()
        {
            GoToUrl();

            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setRange\", -13700000000, 0);");
            var mode = (Driver as IJavaScriptExecutor).ExecuteScript("return $(\"#axis\").axis(\"Mode\");");
            Assert.AreEqual(mode, "cosmos");

            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setRange\", -7000, 0);");
            mode = (Driver as IJavaScriptExecutor).ExecuteScript("return $(\"#axis\").axis(\"Mode\");");
            Assert.AreEqual(mode, "calendar");

            (Driver as IJavaScriptExecutor).ExecuteScript("$(\"#axis\").axis(\"setRange\", -13700000000, 0);");
            mode = (Driver as IJavaScriptExecutor).ExecuteScript("return $(\"#axis\").axis(\"Mode\");");
            Assert.AreEqual(mode, "cosmos");
        }

        /// <summary>
        /// Tests that active mark (representing current position of mouse) is rendered at correct position.
        /// </summary>
        [TestMethod]
        public void TestCurrentTime()
        {
            GoToUrl();

            var active = ExecuteScriptGetNumber("return $(\"#axis\").axis(\"MarkerPosition\");");
            Assert.AreEqual(active, -1);

            ExecuteScript("$(\"#axis\").axis(\"setTimeMarker\", -10500000);");
            active = ExecuteScriptGetNumber("return $(\"#axis\").axis(\"MarkerPosition\");");
            Assert.AreEqual(Convert.ToDouble(active), -10500000.0);
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class AxisTests_Firefox : AxisTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class AxisTests_IE : AxisTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}

