using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using System.Threading;
using Chronozoom.Test.Components;
using OpenQA.Selenium.Interactions;
using Chronozoom.Test.Auxiliary;
using System.Diagnostics;
using System.Drawing;

namespace Chronozoom.Test.GeneralTests
{
	[TestClass]
	[TestPage("cz.htm")]
	abstract public class BreadCrumbsTests : CzTestBase
	{
        private VirtualCanvasComponent vcPageObj;
		private List<string> timelinesList;
		private Random rnd = new Random();

		/* Arrange
        * Select a random timeline
        */
		private string randomTimelineId
		{
			get
			{
				return timelinesList[rnd.Next(timelinesList.Count)];
			}
		}

		#region get all particular entity types on canvas
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

		#endregion

		[TestInitialize]
		public void TestInitialize()
		{
			GoToUrl();
			vcPageObj = new VirtualCanvasComponent(Driver);
			vcPageObj.WaitContentLoading();
            timelinesList = getEntityIds("timeline");
		}


        [TestMethod]
        public void BreadCrumbsTests_ClickOnTimeline_VisibleBreadCrumbsAreColored()
        {
            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;

            const int ellipticZoomTimeWait = 16500;
            var randomTimelinePath = js.ExecuteScript("return vcelementToNavString(vc.virtualCanvas('findElement', '" + randomTimelineId + "'));");
            var zoomedVisible = js.ExecuteScript("navigateToBookmark('" + randomTimelinePath + "');");
            Thread.Sleep(ellipticZoomTimeWait);

            var result = js.ExecuteScript(@"
                    var result = true;
                    for (var i=0; i<breadCrumbs.length; i++) {
                        var id = breadCrumbs[i].vcElement.id;
                        var regime = breadCrumbs[i].vcElement.regime;
    
                        var breadCrumbId = 'bc_link_' + id;
                        var regimeBarId = '';
                        switch (regime.toLowerCase()) {
                            case 'pre-history':
                                regimeBarId = 'prehuman_rect';
                                break;
                            case 'humanity':
                                regimeBarId = 'human_rect';
                                break;
                            default:
                                regimeBarId = regime.toLowerCase()+ '_rect';
                                break;
                        }

                        var c1 = $('#' + breadCrumbId).css('color'); 
                        var c2 = $('#' + regimeBarId).css('background-color'); 
    
                        if (c1 !== c2) {
                            result = false;
                            break;
                        }
                    }
                    return result;"
                );

            Assert.IsTrue((bool)result, "Invalid breadcrumb color!");
        }

		#region Old BreadCrumbs Tests
        /*
        /// <summary>
		/// Zooming to timeline and check breadcrumbs
		/// </summary>
		[TestMethod]
		public void BreadCrumbsTests_Timelines_ZoomAndCheck()
		{
			int ellipticZoomTimeWait = 16500;
			IJavaScriptExecutor js = Driver as IJavaScriptExecutor;

			var randomTimelinePath = js.ExecuteScript("return vcelementToNavString(vc.virtualCanvas('findElement', '" + randomTimelineId + "'));");

			var zoomedVisible = js.ExecuteScript("navigateToBookmark('" + randomTimelinePath + "');");

			Thread.Sleep(ellipticZoomTimeWait);
			var strBreadCrumbs = js.ExecuteScript("var i,str; str = ''; for (i = 0; i < breadCrumbs.length; i++) { str = str + '/'+breadCrumbs[i].vcElement.id;} return str;");

			Assert.AreEqual(randomTimelinePath, strBreadCrumbs);
		}



		/// <summary>
		/// Clicking on one of the bread crumbs
		/// </summary>
		[TestMethod]
		public void BreadCrumbsTests_BreadCrumbsClick()
		{
			int ellipticZoomTimeWait = 6200;
			IJavaScriptExecutor js = Driver as IJavaScriptExecutor;
			var timelineId = randomTimelineId;

			var randomTimelinePath = js.ExecuteScript("return vcelementToNavString(vc.virtualCanvas('findElement', '" + timelineId + "'));");

			js.ExecuteScript("var region=navStringToVisible('" + randomTimelinePath + "', vc); setVisible(region);");

			Thread.Sleep(ellipticZoomTimeWait);

			var zoomedVisible = (Driver as IJavaScriptExecutor).ExecuteScript("return $('#vc').virtualCanvas('getViewport').visible;") as Dictionary<string, object>; //saving visible region after zoom

			//get updated hidden breadcrumbs
			js.ExecuteScript("updateHiddenBreadCrumbs();");

			//script, which find first visible element on breadCrumbs
			var findFirstVisibleBreadCrumb = @"var i,j, visibleBookmark,str, firstID=''; 
				for (i = 0; i < breadCrumbs.length; i++) 
				{
 					visibleBookmark=true; 
					str = 'bc_'+i;	
					for (j=0; j< hiddenFromLeft.length; j++)
					 {
		
						 if (hiddenFromLeft[j].id==str) 
						{
							visibleBookmark=false; 
							break;
						} 
					}
	
					 if (visibleBookmark==true) 
					{
						firstID = breadCrumbs[i].vcElement.id;
						break;
					}
				 }
				 return firstID;";

			//find first visible element
			var firstVisibleBreadCrumbID = js.ExecuteScript(findFirstVisibleBreadCrumb) as string;

			IWebElement crumb = Driver.FindElement(By.Id(firstVisibleBreadCrumbID)); //finding second bread crumb to test a link of it
			Point crumbPosition = crumb.Location;

			ActionsExtension crumbClick = new ActionsExtension(Driver);
			crumbClick.MoveByOffset(crumbPosition.X + 2, crumbPosition.Y + 2)
				.Click()
				.Perform(); //clicking on the bread crumb
			crumbClick.SetDefault(); // return mouse position to default
			Thread.Sleep(ellipticZoomTimeWait);

			var breadCrumbVisible = (Driver as IJavaScriptExecutor).ExecuteScript("return $('#vc').virtualCanvas('getViewport').visible;") as Dictionary<string, object>; //saving visible region after clicking bread crumb

			Assert.IsTrue(Convert.ToDouble(zoomedVisible["scale"]) < Convert.ToDouble(breadCrumbVisible["scale"])); //scale must ascend
		}

		/// <summary>
		/// Clicking on one of the timelines
		/// </summary>
		[TestMethod]
		public void BreadCrumbsTests_Timelines_ClickAndCheck()
		{
			int ellipticZoomTimeWait = 6200;
			IJavaScriptExecutor js = Driver as IJavaScriptExecutor;
			var timelineId = randomTimelineId;

			var crdVirtual = js.ExecuteScript("var elem = vc.virtualCanvas('findElement', '" + timelineId + "'); return ({x: elem.x, y: elem.y});") as Dictionary<string, object>;

			var timelinePath = js.ExecuteScript("var elem = vc.virtualCanvas('findElement', '" + timelineId + "'); return vcelementToNavString(elem);");

			var crdReal = js.ExecuteScript("var vp = vc.virtualCanvas('getViewport'); return vp.pointVirtualToScreen(" + Convert.ToInt32(crdVirtual["x"]) + ", " + Convert.ToInt32(crdVirtual["y"]) + ");") as Dictionary<string, object>;

			GoToUrl(this.StartPage + "#" + timelinePath);

			Thread.Sleep(ellipticZoomTimeWait);

			var strBreadCrumbs = js.ExecuteScript("var i,str; str = ''; for (i = 0; i < breadCrumbs.length; i++) { str = str + '/'+breadCrumbs[i].vcElement.id;} return str;");
			Assert.AreEqual(timelinePath, strBreadCrumbs);
		}
        */

        /*
        /// <summary>
        /// Clicking on one of the bread crumbs
        /// </summary>
        [TestMethod]        
        public void TestBreadCrumbLink()
        {
            int ellipticZoomTimeWait = 6200;  
            IJavaScriptExecutor js = Driver as IJavaScriptExecutor;

            var setVis = (Driver as IJavaScriptExecutor).ExecuteScript(
                "setVisible(new VisibleRegion2d(-692.4270728052991,222750361.2049456,0.35779500398729397));" //going into Humanity timline (coordinates snapshot)
                );
            Thread.Sleep(ellipticZoomTimeWait);

            var zoomedVisible = (Driver as IJavaScriptExecutor).ExecuteScript("return $('#vc').virtualCanvas('getViewport').visible;") as Dictionary<string, object>; //saving visible region after zoom
            IWebElement crumb = Driver.FindElement(By.Id("bread_crumb_0")); //finding second bread crumb to test a link of it
            Point crumbPosition = crumb.Location;

            ActionsExtension crumbClick = new ActionsExtension(Driver);
            crumbClick.MoveByOffset(crumbPosition.X + 2, crumbPosition.Y + 2)
                .Click()
                .Perform(); //clicking on the bread crumb
            crumbClick.SetDefault(); // return mouse position to default
            Thread.Sleep(ellipticZoomTimeWait);

            var breadCrumbVisible = (Driver as IJavaScriptExecutor).ExecuteScript("return $('#vc').virtualCanvas('getViewport').visible;") as Dictionary<string, object>; //saving visible region after clicking bread crumb
            
            Assert.IsTrue(Convert.ToDouble(zoomedVisible["scale"]) < Convert.ToDouble(breadCrumbVisible["scale"])); //scale must ascend
        }

        /// <summary>
        /// calculate 3 breadcrumbs for dummy timeline
        /// </summary>
        [TestMethod]
        public void TestBreadCrumbCalculation()
        {            
            var breadCrumbsArray=(Driver as IJavaScriptExecutor).ExecuteScript(
                "k = 200;"+
            "var root = vc.virtualCanvas('getLayerContent');"+
            "root.beginEdit();"+

            "t1 = addTimeline(root, 'layerTimelines', 't1',{" + //adding nested dummy timelines
                     "timeStart: -5.7 * k, timeEnd: 0,"+
                     "top: 0.1 * k, height: 2 * k,"+
                     "header: 't1',"+
                     "fillStyle: 'rgba(30, 100, 30, 0.5)'"+
                 "});"+

                 "t2 = addTimeline(t1, 'layerTimelines', 't2',{" +
                     "timeStart: -4.7 * k, timeEnd: 0," +
                     "top: 0.1 * k, height: 2 * k," +
                     "header: 't2'," +
                     "fillStyle: 'rgba(30, 100, 30, 0.5)'" +
                 "});" +

                 "t3 = addTimeline(t2, 'layerTimelines', 't3',{" +
                     "timeStart: -3.7 * k, timeEnd: 0," +
                     "top: 0.1 * k, height: 2 * k," +
                     "header: 't3'," +
                     "fillStyle: 'rgba(30, 100, 30, 0.5)'" +
                 "});" +

            "root.endEdit(true);" +
            "var innerVisible = new VisibleRegion2d(-2.7 * k,0.5 * k,k*0.00001);" +
            "controller.moveToVisible(innerVisible, true);" +//moving into deepest timeline;
            "return {len:breadCrumbs.length, first:breadCrumbs[breadCrumbs.length-3].vcElement.title,last:breadCrumbs[breadCrumbs.length-1].vcElement.title};"            //returning breadcrumbs values for check
            ) as Dictionary<string, object>;

            Assert.IsTrue(3 <= Convert.ToInt32(breadCrumbsArray["len"]));
            Assert.AreEqual("t1", (string)breadCrumbsArray["first"]);
            Assert.AreEqual("t3", (string)breadCrumbsArray["last"]);
        }

        // Move mouse in lower left corner when running this test.
        [TestMethod]
        public void TestBreadCrumbs_HoverMouseOverBreadCrumb_BreadCrumbHighlighted()
        {
            GoToUrl("http://localhost:4949/cz.htm#/t55/e165/c477");            

            IWebElement breadCrumb = Driver.FindElement(By.Id("bread_crumb_0"));
            Point breadCrumbPosition = breadCrumb.Location;

            ActionsExtension action = new ActionsExtension(Driver);
            
            // Hover mouse over breadcrumb link.
            action.MoveByOffset(breadCrumbPosition.X + 2, breadCrumbPosition.Y + 2).Perform();

            var res = (bool)(Driver as IJavaScriptExecutor).ExecuteScript(
            "var currentColor = $('#bread_crumb_0').css('color');" + // Get the color of breadcrumb link.
            "return currentColor == 'rgb(255, 255, 255)';"); // Check that this color is rgb(255,255,255). Return result.
            action.SetDefault();
            
            // Check that color is corret.
            Assert.IsTrue(res);
        }

        // Move mouse in lower left corner when running this test.
        [TestMethod]
        public void TestBreadCrumbs_HoverMouseOutFromBreadCrumb_BreadCrumbNotHighlighted()
        {
            GoToUrl("http://localhost:4949/cz.htm#/t55/e165/c477");

            IWebElement breadCrumb = Driver.FindElement(By.Id("bread_crumb_0"));
            Point breadCrumbPosition = breadCrumb.Location;

            ActionsExtension action = new ActionsExtension(Driver);

            // Hover mouse over breadcrumb link.
            action.MoveByOffset(breadCrumbPosition.X + 2, breadCrumbPosition.Y + 2).Perform();

            var res = (bool)(Driver as IJavaScriptExecutor).ExecuteScript(
            "var currentColor = $('#bread_crumb_0').css('color');" + // Get the color of breadcrumb link.
            "return currentColor == 'rgb(255, 255, 255)';"); // Check that this color is rgb(255, 255, 255). Return result.
            
            // Check that highlight color is corret.
            Assert.IsTrue(res);

            // Hover mouse out from breadcrumb link.
            action.SetDefault();

            res = (bool)(Driver as IJavaScriptExecutor).ExecuteScript(
            "var currentColor = $('#bread_crumb_0').css('color');" + // Get the color of breadcrumb link.
            "return currentColor == 'rgb(191, 191, 191)';"); // Check that this color is rgb(191, 191, 191). Return result.
            
            // Check that color is corret.
            Assert.IsTrue(res);
        }

        // Move mouse in lower left corner, when running this test.
        [TestMethod]
        public void TestBreadCrumbs_BreadCrumbLinkColorIsCorrect()
        {
            GoToUrl("http://localhost:4949/cz.htm#/t55/e165/c477");

            IWebElement breadCrumb = Driver.FindElement(By.Id("bread_crumb_0"));
            Point breadCrumbPosition = breadCrumb.Location;

            ActionsExtension action = new ActionsExtension(Driver);
                 
            var colorBefore = (string)(Driver as IJavaScriptExecutor).ExecuteScript(
            "var currentColor = $('#bread_crumb_0').css('color');" + // Get the color of breadcrumb link.
            "return currentColor;"); // Return the color.

            // Hover mouse over breadcrumb link.
            action.MoveByOffset(breadCrumbPosition.X + 2, breadCrumbPosition.Y + 2).Perform();
            
            // Hover mouse out from breadcrumb link.
            action.SetDefault();

            var colorAfter = (string)(Driver as IJavaScriptExecutor).ExecuteScript(
            "var currentColor = $('#bread_crumb_0').css('color');" + // Get the color of breadcrumb link after it was hover by mouse.
            "return currentColor;"); // Return the color.
            
            // Check that initial and current color are the same.
            Assert.AreEqual(colorBefore, colorAfter);
        }

        [TestMethod]
        public void TestBreadCrumbs_TooManyBreadCrumbLinks_SomeBreadCrumbsClipped()
        {
            // Only Cosmos breadcrumb link must be visible.
            GoToUrl("http://localhost:4949/cz.htm#/t55/e129");

            var firstLink = (string)(Driver as IJavaScriptExecutor).ExecuteScript("return $('#bread_crumb_0').text();");
            // Check that there is only 1 breadcrumb link.
            Assert.AreEqual(firstLink, "Cosmos");

            // Full path - Cosmos > Earth & Solar System > Life > Human Prehistory > Humanity > Industrial Revolution > 
            // Wave 3: Russia and Japan > Japanese Industrialization > Emperor Meiji (1868-1912) 
            // It is too long text, probably it will be clipped.
           
            GoToUrl("http://localhost:4949/cz.htm#/t55/t174/t66/t46/t361/t364/t377/t161/t9/t110/t302/t303/e61");
            // Get the first breadcrumb link text.
            firstLink = (string)(Driver as IJavaScriptExecutor).ExecuteScript("return $('#bread_crumb_0').text();");
            // Probably first breadcrumb link wouldn't be 'Cosmos' but '. . .', because of clipping.
            Assert.AreNotEqual(firstLink, "Cosmos");
        }        
    */
		#endregion
	}

	[TestClass]
	[WebDriverSettings(BrowserType.Firefox)]
	public class BreadCrumbsTests_Firefox : BreadCrumbsTests
	{
		[ClassCleanup]
		public static void ClassCleanup()
		{
			Stop();
		}
	}

	[TestClass]
	[WebDriverSettings(BrowserType.InternetExplorer)]
	public class BreadCrumbsTests_IE : BreadCrumbsTests
	{
		[ClassCleanup]
		public static void ClassCleanup()
		{
			Stop();
		}
	}
}
