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

namespace Chronozoom.Test.VirtualCanvasTests
{
    [TestClass]
    [TestPage("testVCTree.htm")]
    public abstract class VirtualCanvasTreeTests : CzTestBase
    {
        [TestInitialize]
        public void TestInitialize()
        {
            GoToUrl();
        }

        [TestMethod]
        public void Test_ElementIsRenderedProperty()
        {
            GoToUrl();

            IWebElement vc = Driver.FindElement(By.Id("vc"));

            var v0 = ExecuteScriptGetJson("return $('#vc').virtualCanvas('getViewport').visible;");

            var isR = ExecuteScriptGetJson("return getIsRendered()");
            Assert.IsTrue((bool)isR["r1"]);
            Assert.IsTrue((bool)isR["r11"]);
            Assert.IsTrue((bool)isR["r2"]);
            Assert.IsTrue((bool)isR["r21"]);

            isR = ExecuteScriptGetJson("return getOnIsRendered()");
            Assert.IsTrue((bool)isR["r1"]);
            Assert.IsTrue((bool)isR["r11"]);
            Assert.IsTrue((bool)isR["r2"]);
            Assert.IsTrue((bool)isR["r21"]);



            ExecuteScript("$('#vc').virtualCanvas('setVisible', new VisibleRegion2d(-300 * k, -50 * k, 150.0 * k / 800.0));");
            isR = ExecuteScriptGetJson("return getIsRendered()");
            Assert.IsTrue((bool)isR["r1"]);
            Assert.IsTrue((bool)isR["r11"]);
            Assert.IsFalse((bool)isR["r2"]);
            Assert.IsFalse((bool)isR["r21"]);

            isR = ExecuteScriptGetJson("return getOnIsRendered()");
            Assert.IsFalse((bool)isR["r1"]);
            Assert.IsFalse((bool)isR["r11"]);
            Assert.IsTrue((bool)isR["r2"]);
            Assert.IsTrue((bool)isR["r21"]);





            ExecuteScript("$('#vc').virtualCanvas('setVisible', new VisibleRegion2d(-300 * k, 60 * k, 150.0 * k / 800.0));");
            isR = ExecuteScriptGetJson("return getIsRendered()");
            Assert.IsFalse((bool)isR["r1"]);
            Assert.IsFalse((bool)isR["r11"]);
            Assert.IsTrue((bool)isR["r2"]);
            Assert.IsTrue((bool)isR["r21"]);

            isR = ExecuteScriptGetJson("return getOnIsRendered()");
            Assert.IsTrue((bool)isR["r1"]);
            Assert.IsTrue((bool)isR["r11"]);
            Assert.IsTrue((bool)isR["r2"]);
            Assert.IsTrue((bool)isR["r21"]);






            ExecuteScript("$('#vc').virtualCanvas('setVisible', new VisibleRegion2d(-310 * k, -40 * k, 50.0 * k / 800.0));");
            isR = ExecuteScriptGetJson("return getIsRendered()");
            Assert.IsTrue((bool)isR["r1"]);
            Assert.IsTrue((bool)isR["r11"]);
            Assert.IsFalse((bool)isR["r2"]);
            Assert.IsFalse((bool)isR["r21"]);

            isR = ExecuteScriptGetJson("return getOnIsRendered()");
            Assert.IsTrue((bool)isR["r1"]);
            Assert.IsTrue((bool)isR["r11"]);
            Assert.IsTrue((bool)isR["r2"]);
            Assert.IsTrue((bool)isR["r21"]);




            ExecuteScript("$('#vc').virtualCanvas('setVisible', new VisibleRegion2d(-310 * k, 50 * k, 50.0 * k / 800.0));");
            isR = ExecuteScriptGetJson("return getIsRendered()");
            Assert.IsFalse((bool)isR["r1"]);
            Assert.IsFalse((bool)isR["r11"]);
            Assert.IsTrue((bool)isR["r2"]);
            Assert.IsTrue((bool)isR["r21"]);

            isR = ExecuteScriptGetJson("return getOnIsRendered()");
            Assert.IsTrue((bool)isR["r1"]);
            Assert.IsTrue((bool)isR["r11"]);
            Assert.IsTrue((bool)isR["r2"]);
            Assert.IsTrue((bool)isR["r21"]);
        }     
    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class VirtualCanvasTreeTests_Firefox : VirtualCanvasTreeTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class VirtualCanvasTreeTests_IE : VirtualCanvasTreeTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}

