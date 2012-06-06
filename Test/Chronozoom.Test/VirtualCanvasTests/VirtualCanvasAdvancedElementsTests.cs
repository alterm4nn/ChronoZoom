using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using System.Collections.ObjectModel;


namespace Chronozoom.Test.VirtualCanvasTests
{
    [TestClass]
    [TestPage("testVirtualCanvasAdvancedElements.htm")]
    public abstract class VirtualCanvasAdvancedElementsTests : CzTestBase
    {
        [TestMethod]
        public void TestAdvancedElements_arrangeContentItemsInField()
        {
            GoToUrl();
            double dx = 1;
            var res = ExecuteScriptGetArray("return arrangeContentItemsInField(0," + dx + ");");
            Assert.IsNull(res);

            for (int i = 1; i <= 4; i++)
            {
                res = ExecuteScriptGetArray("return arrangeContentItemsInField(" + i + "," + dx + ");");
                CheckArrangement(res, dx);
            }
        }

        private static void CheckArrangement(ReadOnlyCollection<object> arrangement, double dx)
        {
            Assert.IsNotNull(arrangement);
            if (arrangement.Count == 1)
            {
                Assert.IsTrue(Convert.ToDouble(arrangement[0]) < 0);
                Assert.IsTrue(Convert.ToDouble(arrangement[0]) > -dx);
            }
            for (int i = 1; i < arrangement.Count; i++)
            {
                Assert.IsTrue(Convert.ToDouble(arrangement[i]) > Convert.ToDouble(arrangement[i - 1]));
                Assert.IsTrue(Convert.ToDouble(arrangement[i]) - Convert.ToDouble(arrangement[i - 1]) > dx);
            }
        }

        [TestMethod]
        public void TestAdvancedElements_InfodotThumbnail()
        {
            GoToUrl();
            var res = ExecuteScriptGetNumber("return checkInfodot1Thumbnail();");
            Assert.AreEqual(1.0, res);

            var visible = ExecuteScriptGetJson("return $('#vc').virtualCanvas('getViewport').visible");
            ExecuteScript("$('#vc').virtualCanvas('setVisible', new VisibleRegion2d(-10 * k, 2.0 * k, k / 1024.0))");

            res = ExecuteScriptGetNumber("return checkInfodot1HasContent();");
            Assert.AreEqual(1.0, res);

            ExecuteScript(String.Format("$('#vc').virtualCanvas('setVisible', new VisibleRegion2d({0}, {1}, {2}))",
                visible["centerX"], visible["centerY"], visible["scale"]));
        }

        [TestMethod]
        public void TestAdvancedElements_Timelines()
        {
            GoToUrl();
            var res = ExecuteScriptGetNumber("return checkTimelines();");
            Assert.AreEqual(1.0, res);
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class VirtualCanvasAdvancedElementsTests_Firefox : VirtualCanvasAdvancedElementsTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class VirtualCanvasAdvancedElementsTests_IE : VirtualCanvasAdvancedElementsTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}

