using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Chronozoom.Test.Components;
using Chronozoom.Test.Auxiliary;
using System.IO;
using System.Threading;
using System.Drawing;
using System.Drawing.Imaging;
using System.Text.RegularExpressions;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium.Interactions;

namespace Chronozoom.Test.GeneralTests
{
    [TestClass]
    [TestPage("cz.htm")]
    public abstract class Testtest : CzTestBase
    {
        private VirtualCanvasComponent vcPageObj;
        private ActionsExtension action;
        [TestInitialize]
        public void TestInitialize()
        {
            GoToUrl();
            vcPageObj = new VirtualCanvasComponent(Driver);
            vcPageObj.WaitContentLoading();
        }
        [TestCleanup]
        public void TestCleanup()
        {
            if (action != null)
            {
                action.SetDefault();
            }
        }
        [TestMethod]
        public void TestTest()
        {
            action = new ActionsExtension(Driver);
            var element = Driver.FindElement(By.Id("search_button"));
            action.MoveToElement(element, 0, 0);
            action.Click();
            action.Perform();
            Thread.Sleep(1000);
            var searchTextBox = Driver.FindElement(By.Id("searchTextBox"));
            searchTextBox.SendKeys("Humanity");
            Thread.Sleep(300);

            var res = (Driver as IJavaScriptExecutor).ExecuteScript(@"return $('#loadingImage:visible').length;");
            var resInt = Convert.ToInt32(res);
            Assert.AreEqual<bool>(true, resInt > 0, "Expected loading hasn't appeared");
        }
    }
    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class Testtest_Firefox : Testtest
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class Testtest_IE : Testtest
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}
