using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;

namespace Chronozoom.Test.VirtualCanvasTests
{
    [TestClass]
    [TestPage("testVirtualCanvasLayout.htm")]
    public abstract class VirtualCanvasLayoutTest : CzTestBase
    {
        [TestMethod]
        public void TestDataConvertion()
        {
            GoToUrl();

            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;
            string script = "var timeline = {};" + "timeline.TimeUnit='Ga';" + "timeline.Year=5;" +
                "GenerateProperty(timeline, 'TimeUnit', 'Year', 'Date', 'x');" + "return timeline;";

            var res = js.ExecuteScript(script);
            Assert.IsTrue(Convert.ToDouble((res as Dictionary<string, object>)["x"]) == -5000000000.0);
        }

        [TestMethod]
        public void TestWCFResponceParsing()
        {
            GoToUrl();
            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;
            string loadResponceDump = "return LoadResponceDump()";

            var res = js.ExecuteScript(loadResponceDump);
            Assert.IsTrue((res as Dictionary<string, object>)["d"] != null);
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class VirtualCanvasLayoutTest_Firefox : VirtualCanvasLayoutTest
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class VirtualCanvasLayoutTest_IE : VirtualCanvasLayoutTest
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}
