using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using System.Threading;

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
            string script = "var timeline = {};" + "timeline.FromTimeUnit='Ga';" + "timeline.FromYear=5;" +
                "GenerateProperty(timeline, 'FromTimeUnit', 'FromYear', 'FromMonth', 'FromDay', 'left');" + "return timeline;";

            var res = js.ExecuteScript(script);
            Assert.IsTrue(Convert.ToDouble((res as Dictionary<string, object>)["left"]) == -5000000000.0);
        }

        [TestMethod]
        public void TestWCFResponceParsing()
        {
            GoToUrl();
            Thread.Sleep(3000);
            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;
            string isContentLoaded = "return contentLoadedFromService;";

            bool res = (bool)js.ExecuteScript(isContentLoaded);
            Assert.IsTrue(res);
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
