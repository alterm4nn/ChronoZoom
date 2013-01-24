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
using System.Diagnostics;

namespace Chronozoom.Test.GeneralTests
{
    [TestClass]
    [TestPage("cz.htm")]
    public abstract class SearchLengthTest : CzTestBase
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


        private static Random random = new Random((int)DateTime.Now.Ticks);
        private string RandomString(int size)
        {
            StringBuilder builder = new StringBuilder();
            char ch;
            for (int i = 0; i < size; i++)
            {
                ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                builder.Append(ch);
            }

            return builder.ToString();
        }
        
        private string RussianSymbolString(int size)
        {
            StringBuilder builder = new StringBuilder();
            char ch;
            for (int i = 0; i < size; i++)
            {
                ch = Convert.ToChar(Convert.ToInt32(Math.Floor(32 * random.NextDouble() + 1072)));
                builder.Append(ch);
            }

            return builder.ToString();
        }

        [TestMethod]
        public void SearchLengthTest1()
        {
            //maximum length of the inbox string
            int max_length = 700;
            //offset number of literals for test
            int offset = 10;
            string short_string = "";
            string big_string = "";
            string large_string = "";
            bool b1, b2, b3;
            //click on searchbox and get ready to type in it
            action = new ActionsExtension(Driver);
            var element = Driver.FindElement(By.Id("search_button"));
            action.MoveToElement(element, 0, 0);
            action.Click();
            action.Perform();
            var searchTextBox = Driver.FindElement(By.Id("searchTextBox"));
            //define random strings
            short_string = RussianSymbolString(10);
            big_string = RandomString(max_length);
            large_string = RandomString(max_length + offset);
            //Test1.regular size random english symbol string
            searchTextBox.SendKeys(short_string);
           // var searchbox_string = (Driver as IJavaScriptExecutor).ExecuteScript("return  $('#searchTextBox').val();");
            var searchbox_string = (Driver as IJavaScriptExecutor).ExecuteScript("return searchString;");
            b1 = searchbox_string.Equals(short_string);
            vcPageObj.ClearSearchTextBox();
            Trace.Write(b1);        //must be true
                //Test2.boundary maxsize size english random symbol string
            char[] c = new char[1]; 
            for (int i = 0; i <= max_length - 1; i++)
            {
                c[0] = big_string[i];
                string s = new string(c);
                searchTextBox.SendKeys(s);
            }
            //searchbox_string = (Driver as IJavaScriptExecutor).ExecuteScript("return  $('#searchTextBox').val();");
            searchbox_string = (Driver as IJavaScriptExecutor).ExecuteScript("return searchString;");
            b2 = searchbox_string.Equals(big_string);
            vcPageObj.ClearSearchTextBox();
            Trace.Write(b2);        //must be true
                //Test3.large maxsize+offset size english random symbol string(doesn't fit in searchbox)

            for (int i = 0; i <= max_length + offset - 1; i++)
            {
                c[0] = large_string[i];
                string s = new string(c);
                searchTextBox.SendKeys(s);
            }
            searchbox_string = (Driver as IJavaScriptExecutor).ExecuteScript("return searchString;");
            bool b31 = searchbox_string.Equals(large_string);       //false
            string cut_string = large_string.Remove(max_length);
            bool b32 = searchbox_string.Equals(cut_string);         //true
            vcPageObj.ClearSearchTextBox();
            b3 = (!b31) && b32;
            Trace.Write(b31);
            Trace.Write(b32);
            Trace.Write(b3);        //must be true
            //Test4.large maxsize+offset size random symbol string(doesn't fit in searchbox)
            bool b = b1 & b2 & b3;
            Assert.IsTrue(b);
            return;
        }
   }
    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class SearchLengthTest_Firefox : SearchLengthTest
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class SearchLengthTest_IE : SearchLengthTest
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}