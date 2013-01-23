using Chronozoom.Test.Auxiliary;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using Chronozoom.Test.Components;
using System;
using System.Collections.Generic;
using Chronozoom.Test.JsTypes;
using System.Text.RegularExpressions;
using System.Threading;
using System.Diagnostics;

namespace Chronozoom.Test.GeneralTests
{
    [TestClass]
    [TestPage("cz.htm")]
    public abstract class UrlNavTests : CzTestBase
    {
        private Random rnd = new Random();
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

        #region Obsolete Tests

        //Obselete. Url nav spec have chageded.F Cannot specify scale 's'.
        [Ignore]
        [TestMethod]
        // Sets page URL to 1920CE and checks if page objects are updated correctly
        public void TestCENav()
        {
            GoToUrl(StartPage + "#x=1920CE&y=1992964308.1211352&s=0.15795106421934546");

            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;
            var visible = ExecuteScriptGetJson("return $('#vc').virtualCanvas('getViewport').visible");

            // Subtract 2011 (presentYear defined in page) - 1 to get virtual coords from CE
            Assert.IsTrue(visible["centerX"].Equals(1920L - 2011 - 1));
        }

        //Obselete. Url nav spec have chageded. Cannot specify scale 's'.
        //Replaced by TestUrlNavigation_Pan_UrlChanges.
        [Ignore]
        [TestMethod]
        public void TestUrlNavigation_SetNewVisible_UrlUpdatedCorrectly()
        {
            JsVisible visibleBefore = vcPageObj.GetViewport();
            JsVisible visibleAfter = new JsVisible(-6000000000, 2000000000, 6000000);
            JsVisible urlVisible = new JsVisible();

            // Get the query string and extract number values from it.
            // It looks like this: #x=7Ga&y=2500000000&s=7000000.
            string query = new Uri(Driver.Url).Fragment;
            MatchCollection match = Regex.Matches(query, @"[\d]+");

            // It stores in Ga units here, so multiply by one billion. Also, it's negative value.
            urlVisible.CenterX = Convert.ToDouble(match[0].Value) * (-1000000000);
            urlVisible.CenterY = Convert.ToDouble(match[1].Value);
            urlVisible.Scale = Convert.ToDouble(match[2].Value);

            Assert.AreEqual(visibleBefore, urlVisible);

            // Change visible and check that url changed also.
            vcPageObj.MoveToVisible(visibleAfter, false);
            vcPageObj.WaitAnimation();

            ExecuteScript("updateLayout();");

            // Get the query string and extract number values from it.
            query = new Uri(Driver.Url).Fragment;
            match = Regex.Matches(query, @"[\d]+");

            // It stores in Ga units here, so multiply by one billion. Also, it's negative value.
            urlVisible.CenterX = Convert.ToDouble(match[0].Value) * (-1000000000);
            urlVisible.CenterY = Convert.ToDouble(match[1].Value);
            urlVisible.Scale = Convert.ToDouble(match[2].Value);

            Assert.AreEqual(visibleAfter, urlVisible);
        }

        #endregion

        [TestMethod]
        public void TestUrlNavigation_Pan_UrlChanges()
        {
            IWebElement vcElem = Driver.FindElement(By.Id("vc"));
            Assert.IsNotNull(vcElem, "err: cannot find canvas element");
            var vc = new VirtualCanvasComponent(Driver);
            double widthInSc = vcElem.Size.Width;

            // pan to get absolute url from relative initial url
            action = new ActionsExtension(Driver);
            action.MoveToElement(vcElem, 1, 1);
            action.ClickAndHold();
            action.MoveByOffset((int)widthInSc / 8, 0);
            action.Release();
            action.Perform();
            vc.WaitAnimation();

            string urlBefore = new Uri(Driver.Url).ToString();

            // pan to get update absolute url
            action = new ActionsExtension(Driver);
            action.MoveToElement(vcElem, 1, 1);
            action.ClickAndHold();
            action.MoveByOffset((int)widthInSc / 8, 0);
            action.Release();
            action.Perform();
            vc.WaitAnimation();

            string urlAfter = new Uri(Driver.Url).ToString();

            Assert.AreNotEqual(urlBefore, urlAfter);
        }

        [TestMethod]
        public void TestUrlNavigation_OpenRelativeBookmark_NavigatesToBookmark()
        {
            /* Arrange
             * Select a random timeline or exhibit.
             * Generate relative bookmark url.
             */
            string entityType = (rnd.Next() % 2 == 0) ? "timeline" : "infodot";
            var l = getEntityIds(entityType);
            string id = l[rnd.Next(l.Count)];

            var js = Driver as IJavaScriptExecutor;
            var bookmarkUrl = js.ExecuteScript("return vcelementToNavString(vc.virtualCanvas('findElement', '" + id + "'));");

            /* Act
             * Go to bookmark url.
             */
            GoToUrl(this.StartPage + "#" + bookmarkUrl);
            vcPageObj = new VirtualCanvasComponent(Driver);
            vcPageObj.WaitContentLoading();

            var bookmarkItem = new
            {
                x = Convert.ToDouble(js.ExecuteScript("return vc.virtualCanvas('findElement','" + id + "').x;")),
                y = Convert.ToDouble(js.ExecuteScript("return vc.virtualCanvas('findElement','" + id + "').y;")),
                width = Convert.ToDouble(js.ExecuteScript("return vc.virtualCanvas('findElement','" + id + "').width;")),
                height = Convert.ToDouble(js.ExecuteScript("return vc.virtualCanvas('findElement','" + id + "').height;"))
            };

            var bookmarkItemCenterX = bookmarkItem.x + bookmarkItem.width / 2;
            var bookmarkItemCenterY = bookmarkItem.y + bookmarkItem.height / 2;

            js = Driver as IJavaScriptExecutor;
            var viewportCenterX = Convert.ToDouble(js.ExecuteScript("return vc.virtualCanvas('getViewport').visible.centerX;"));
            var viewportCenterY = Convert.ToDouble(js.ExecuteScript("return vc.virtualCanvas('getViewport').visible.centerY;"));

            /* Assert
             * Verify that the timeline/exhibit specified
             * in the relative bookmark url is visible.
             */
            Assert.AreEqual(viewportCenterX, bookmarkItemCenterX, 1);
            Assert.AreEqual(viewportCenterY, bookmarkItemCenterY, 1);
        }

        [TestMethod]
        public void TestUrlNavigation_OpenAbsoluteBookmark_NavigatesToBookmark()
        {
            /* Arrange
             * Select a random timeline or exhibit.
             * Generate absolute bookmark url.
             */
            string entityType = (rnd.Next() % 2 == 0) ? "timeline" : "infodot";
            var l = getEntityIds(entityType);
            string id = l[rnd.Next(l.Count)];

            // get relative bookmark url of the timeline/exhibit
            var js = Driver as IJavaScriptExecutor;
            var bookmarkUrl = js.ExecuteScript("return vcelementToNavString(vc.virtualCanvas('findElement', '" + id + "'));");

            // update viewport according to the choosen timeline/exhibit 
            GoToUrl(this.StartPage + "#" + bookmarkUrl);
            vcPageObj = new VirtualCanvasComponent(Driver);
            vcPageObj.WaitContentLoading();

            //get absolute bookmark url of the timeline/exhibit
            js = Driver as IJavaScriptExecutor;
            bookmarkUrl = js.ExecuteScript("var el = vc.virtualCanvas('findElement','" + id + "'); var vp = vc.virtualCanvas('getViewport'); return vcelementToNavString(el, vp);");

            /* Act
             * Go to bookmark url.
             */
            GoToUrl(this.StartPage + "#" + bookmarkUrl);
            vcPageObj = new VirtualCanvasComponent(Driver);
            vcPageObj.WaitContentLoading();

            var bookmarkItem = new
            {
                x = Convert.ToDouble(js.ExecuteScript("return vc.virtualCanvas('findElement','" + id + "').x;")),
                y = Convert.ToDouble(js.ExecuteScript("return vc.virtualCanvas('findElement','" + id + "').y;")),
                width = Convert.ToDouble(js.ExecuteScript("return vc.virtualCanvas('findElement','" + id + "').width;")),
                height = Convert.ToDouble(js.ExecuteScript("return vc.virtualCanvas('findElement','" + id + "').height;"))
            };

            var bookmarkItemCenterX = bookmarkItem.x + bookmarkItem.width / 2;
            var bookmarkItemCenterY = bookmarkItem.y + bookmarkItem.height / 2;

            js = Driver as IJavaScriptExecutor;
            var viewportCenterX = Convert.ToDouble(js.ExecuteScript("return vc.virtualCanvas('getViewport').visible.centerX;"));
            var viewportCenterY = Convert.ToDouble(js.ExecuteScript("return vc.virtualCanvas('getViewport').visible.centerY;"));

            /* Assert
             * Verify that the timeline/exhibit specified
             * in the absolute bookmark url is visible.
             */
            Assert.AreEqual(viewportCenterX, bookmarkItemCenterX, 1);
            Assert.AreEqual(viewportCenterY, bookmarkItemCenterY, 1);
        }

        /* Opens bibliography window for random exhibit and shares it to another window.
         * Checks that share was sucessful.
         */
        [TestMethod]
        public void TestUrlNavigation_SharingOfBibliographyWindow_BibliographyWindowOpened()
        {
            /* Arrange
             * Select a random exhibit.
             * Generate absolute bookmark url.
             */
            string entityType = "infodot";
            var l = getEntityIds(entityType);
            string id = l[rnd.Next(l.Count)];

            // get relative bookmark url of the exhibit
            var js = Driver as IJavaScriptExecutor;
            // TODO: Remove '@' at the end of this string aftre it will be fixed in scripts of cz
            var bookmarkUrl = js.ExecuteScript("return vcelementToNavString(vc.virtualCanvas('findElement', '" + id + "'));");

            // update viewport according to the choosen exhibit 
            GoToUrl(this.StartPage + "#" + bookmarkUrl);
            vcPageObj = new VirtualCanvasComponent(Driver);
            vcPageObj.WaitContentLoading();

            var bibliography = id + "__bibliography";

            // get screen coordinates of 
            var visible = GetVisibleForCanvasElement(js, bibliography);
            var canvasElement = Driver.FindElement(By.Id("vc"));
            var biblWindowElement = Driver.FindElement(By.Id("bibliographyBack"));

            // check that bibliography window is hidden at this moment
            string windowDisplay = biblWindowElement.GetCssValue("display");
            Assert.AreEqual(windowDisplay, "none", "ERROR: Bibliography window is visible but it shouldn't.");

            var action = new ActionsExtension(Driver);
            action.MoveToElement(canvasElement, Convert.ToInt32(visible["x"]) + 5, Convert.ToInt32(visible["y"]) + 5)
                .Click()
                .Perform();

            // check that bibliography window is visible now
            windowDisplay = canvasElement.GetCssValue("display");
            Assert.AreNotEqual(windowDisplay, "none", "ERROR: Bibliography window is not visible but it should.");
            var URL = Driver.Url;

            // change URL to reload page
            GoToUrl(this.StartPage);
            vcPageObj.WaitContentLoading();

            // open shared bibliography link
            GoToUrl(URL);
            vcPageObj.WaitContentLoading();

            // check that bibliography window is visible now
            biblWindowElement = Driver.FindElement(By.Id("bibliographyBack"));
            windowDisplay = biblWindowElement.GetCssValue("display");
            Assert.AreNotEqual(windowDisplay, "none", "ERROR: Share failed. Bibliography window is not visible but it should.");
        }


        private List<string> getEntityIds(string entityType)
        {
            string script =
                String.Format(
                    @"var lst = []; 
                    var root = vc.virtualCanvas('getLayerContent'); 
                    function getItem(node, entityType) {{ 
                        if (node.type === entityType) 
                            lst.push(node.id); 
                        for (var i = 0; i < node.children.length; i++) 
                            getItem(node.children[i], entityType); 
                    }}; 
                    getItem(root, '{0}'); 
                    return lst;"
                , entityType);

            var js = Driver as IJavaScriptExecutor;
            dynamic ids = js.ExecuteScript(script);

            var lst = new List<string>();
            for (int i = 0; i < ids.Count; i++)
                lst.Add(ids[i]);
            return lst;
        }

        private Dictionary<string, object> GetVisibleForCanvasElement(IJavaScriptExecutor js, string id)
        {
            return js.ExecuteScript(@"
                var elem = vc.virtualCanvas('findElement', '" + id + @"'); 
                var vp = vc.virtualCanvas('getViewport');
                return vp.pointVirtualToScreen(elem.x, elem.y);") as Dictionary<string, object>;
        }

        /*
        private void getItem(dynamic node, List<int> l, string entityType)
        {
            string nodeType = Convert.ToString(node.__type);
            if (nodeType == entityType)
                l.Add(Convert.ToInt32(Convert.ToString(node.UniqueID)));

            switch (nodeType)
            {
                case "Timeline:#Chronozoom.Entities":
                    foreach (var child in node.Exhibits)
                        getItem(child, l, entityType);
                    foreach (var child in node.ChildTimelines)
                        getItem(child, l, entityType);
                    break;
                case "Exhibit:#Chronozoom.Entities":
                    foreach (var child in node.ContentItems)
                        getItem(child, l, entityType);
                    break;
                case "ContentItem:#Chronozoom.Entities":
                case "Reference:#Chronozoom.Entities":
                    break;
            }
        }
        */
    }

    [TestClass]
    [WebDriverSettings(BrowserType.Firefox)]
    public class UrlNavTests_Firefox : UrlNavTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }

    [TestClass]
    [WebDriverSettings(BrowserType.InternetExplorer)]
    public class UrlNavTestsTests_IE : UrlNavTests
    {
        [ClassCleanup]
        public static void ClassCleanup()
        {
            Stop();
        }
    }
}
