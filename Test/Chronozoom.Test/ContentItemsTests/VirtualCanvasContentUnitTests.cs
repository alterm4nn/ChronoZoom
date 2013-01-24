using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using System.Diagnostics;
using Chronozoom.Test.Components;
using System.Threading;
using System.Text;

namespace Chronozoom.Test.ContentItemsTests
{
    [TestClass]
    [TestPage("testVirtualCanvasPrimitives.htm")]
    public abstract class VirtualCanvasContentUnitTests : CzTestBase
    {
        private ContentItemsComponent ContentItems;

        private const int SleepTime = 1000;

        #region Check content item parameters

        [TestMethod]
        public void TestChangeSettings_ChangeCircleSettings_SettingsSetProperly()
        {
            string id = "testCircle";

            GoToUrl();

            ContentItems.AddCircle(id);
            var settings = (Driver as IJavaScriptExecutor).ExecuteScript("return item.settings;") as Dictionary<string, object>;
            // Check settings set properly.
            CheckSettings(settings, "white", 2, "rgba(240,240,240,0.2)");
            Thread.Sleep(SleepTime);

            // Change settings.
            ContentItems.ChangeSettings(id, "{ strokeStyle: 'red', lineWidth: 5, fillStyle: 'green' }");
            settings = (Driver as IJavaScriptExecutor).ExecuteScript("return item.settings;") as Dictionary<string, object>;
            // Check settings were changed properly.
            CheckSettings(settings, "red", 5, "green");
            Thread.Sleep(SleepTime);   
        }

        [TestMethod]
        public void TestChangeSettings_ChangeRectangleSettings_SettingsSetProperly()
        {
            string id = "testRectangle";

            GoToUrl();

            ContentItems.AddRectangle(id);
            var settings = (Driver as IJavaScriptExecutor).ExecuteScript("return item.settings;") as Dictionary<string, object>;
            // Check settings set properly.
            CheckSettings(settings, "rgb(240,240,240)", 2, "rgba(140,140,140,0.5)");
            Thread.Sleep(SleepTime);

            // Change settings.
            ContentItems.ChangeSettings(id, "{ strokeStyle: 'blue', lineWidth: 5, fillStyle: 'rgba(100, 125, 0, 0.5)' }");
            settings = (Driver as IJavaScriptExecutor).ExecuteScript("return item.settings;") as Dictionary<string, object>;
            // Check settings were changed properly.
            CheckSettings(settings, "blue", 5, "rgba(100, 125, 0, 0.5)");            
            Thread.Sleep(SleepTime);
        }

        [TestMethod]
        public void TestVCContent_GetChild()
        {
            string id = "NoElementWithThatID";

            GoToUrl();

            // Method must fail if no element with given id.
            Assert.IsFalse(ContentItems.GetChild(id));

            // Method must accomplish if there is element with given id.
            ContentItems.AddRectangle(id);
            Assert.IsTrue(ContentItems.GetChild(id));

            // Method must fail if no parent element on the page.
            StringBuilder script = new StringBuilder();
            script.Append(@"try {
                                getChild(NoSuchParentElement, 'NoElementWithThatID');
                            }
                            catch (ex) {
                                return true;
                            }
                            return false;");
            Assert.IsTrue((bool)(Driver as IJavaScriptExecutor).ExecuteScript(script.ToString()));            
        }

        [TestMethod]
        public void TestVCContent_Clear()
        {
            GoToUrl();

            // Add children to root element, then add children to one of the root's child.
            StringBuilder script = new StringBuilder();
            script.Append(@"addRectangle(root, 'layer2', 'rect', -30, -30, 30, 30, { fillStroke: 'white' });
                            item = addImage(root, 'layer2', 'image', -30, -30, 30, 30, 'Images/flower.png', function () { vc.virtualCanvas('invalidate'); });
                            addCircle(item, 'layer2', 'circle', -20, -20, 10, { fillStroke: 'red' });
                            addImage(item, 'layer2', 'image2', -30, -30, 30, 10, 'Images/4.png', function () { vc.virtualCanvas('invalidate'); });
                            addRectangle(item, 'layer2', 'rect2', -30, -30, 30, 15, { fillStroke: 'green' });
                            if (root.children.length != 2 || item.children.length != 3)
                                return false;
                            root.beginEdit();   
                            clear(item);
                            if (root.children.length != 2 || item.children.length != 0)
                                return false;
                            try {
                                if (getChild(item, 'rect2'))
                                    return false;
                            }  
                            catch (ex) { }
                            clear(root);
                            root.endEdit(); 
                            try {
                                if (getChild(root, 'image'))
                                    return false;
                            }  
                            catch (ex) { }                           
                            if (root.children.length != 0 || item.children.length != 0)
                                return false;
                            else 
                                return true;");
            Assert.IsTrue((bool)(Driver as IJavaScriptExecutor).ExecuteScript(script.ToString()));
        }

        [TestMethod]
        public void TestVCContent_RemoveChild()
        {
            GoToUrl();

            // Add children, then remove and check they are deleted.
            StringBuilder script = new StringBuilder();
            script.Append(@"addRectangle(root, 'layer2', 'rect', -30, -30, 30, 30, { fillStroke: 'white' });
                            addImage(root, 'layer2', 'image', -30, -30, 30, 30, 'Images/flower.png', function () { vc.virtualCanvas('invalidate'); });
                            addCircle(root, 'layer2', 'circle', -20, -20, 10, { fillStroke: 'red' });
                            addText(root, 'layer2', 'text', -30, -30, 2, 10, 'Hello!', { lineWidth: 2 });
                            if (root.children.length != 4)
                                return false;

                            root.beginEdit();  
                            
                            try {
                                if (!removeChild(root, 'rect') || getChild(root, 'rect') || root.children.length != 3)
                                    return false;
                            }
                            catch (ex) { }

                            try {
                                if (!removeChild(root, 'circle') || getChild(root, 'circle') || root.children.length != 2)
                                    return false;           
                            }
                            catch (ex) { }

                            try {
                                if (!removeChild(root, 'image') || getChild(root, 'image') || root.children.length != 1)
                                    return false;
                            }
                            catch (ex) { }

                            try {
                                if (!removeChild(root, 'text') || getChild(root, 'text') || root.children.length != 0)
                                    return false;
                            }
                            catch (ex) { }

                            root.endEdit();
                            return true;");
            Assert.IsTrue((bool)(Driver as IJavaScriptExecutor).ExecuteScript(script.ToString()));

            // Test function with wrong parameters.
            script = new StringBuilder();
            script.Append(@"addRectangle(root, 'layer2', 'rect', -30, -30, 30, 30, { fillStroke: 'white' });
                            root.beginEdit();
                            try {
                                if (removeChild(noSuchElement, 'rect'))
                                    return false;
                            }
                            catch (ex) { }
                            try {
                                if (getChild(noSuchElement, 'rect'))
                                    return false;
                            }
                            catch (ex) { }
                            try {
                                if (removeChild(root, 'noSuchID'))
                                    return false;
                            }
                            catch (ex) { }
                            root.endEdit();
                            return true;");
            Assert.IsTrue((bool)(Driver as IJavaScriptExecutor).ExecuteScript(script.ToString()));
        }

        [TestMethod]
        public void TestVCContent_AddChild()
        {
            GoToUrl();

            // Add couple of children and check children count of parent elements.
            StringBuilder script = new StringBuilder();
            script.Append(@"item = addChild(root, new CanvasRectangle(root.vc, 'layer2', 'rect', -30, -30, 30, 30, { fillStroke: 'white' }));
                            if (item.children.length != 0 || root.children.length != 1)
                                return false;
                            addChild(item, new CanvasRectangle(item.vc, 'layer2', 'rect2', -30, -30, 25, 25, { fillStroke: 'blue' }));
                            if (item.children.length != 1)
                                return false;
                            addChild(item, new CanvasCircle(item.vc, 'layer2', 'circle', -15, -15, 10, { fillStroke: 'green' }));
                            if (item.children.length == 2)
                                return true;
                            else
                                return false;");
            Assert.IsTrue((bool)(Driver as IJavaScriptExecutor).ExecuteScript(script.ToString()));

            // Add child with lower or equal size.
            script = new StringBuilder();
            script.Append(@"try {
                                item = addChild(root, new CanvasRectangle(root.vc, 'layer2', 'rect3', -60, -60, 20, 20, { fillStroke: 'white' }));
                                addChild(item, new CanvasRectangle(item.vc, 'layer2', 'rect4', -60, -60, 20, 20, { fillStroke: 'green' })); 
                                addChild(item, new CanvasRectangle(item.vc, 'layer2', 'rect5', -60, -60, 15, 15, { fillStroke: 'green' }));
                            }
                            catch (ex) {
                                return false;
                            }
                            return true;");
            Assert.IsTrue((bool)(Driver as IJavaScriptExecutor).ExecuteScript(script.ToString()));

            // Add child with higher size.
            script = new StringBuilder();
            script.Append(@"try {
                                item = addChild(root, new CanvasRectangle(root.vc, 'layer2', 'rect3', -60, -60, 20, 20, { fillStroke: 'white' }));
                                addChild(item, new CanvasRectangle(item.vc, 'layer2', 'rect6', -60, -60, 20, 21, { fillStroke: 'green' })); 
                            }
                            catch (ex) {
                                return true;
                            }
                            return false;");
            Assert.IsTrue((bool)(Driver as IJavaScriptExecutor).ExecuteScript(script.ToString()));
        }

        #endregion

        [TestInitialize]
        public void TestInitilize()
        {
            ContentItems = new ContentItemsComponent(Driver);
        }

        private void CheckSettings(Dictionary<string, object> settings, string strokeStyle, double lineWidth, string fillStyle)
        {
            Assert.AreEqual(settings["strokeStyle"], strokeStyle);
            Assert.AreEqual(Convert.ToDouble(settings["lineWidth"]), lineWidth);
            Assert.AreEqual(settings["fillStyle"], fillStyle);
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class VirtualCanvasPrimitivesUnitTests_Firefox : VirtualCanvasContentUnitTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class VirtualCanvasPrimitivesUnitTests_IE : VirtualCanvasContentUnitTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}
