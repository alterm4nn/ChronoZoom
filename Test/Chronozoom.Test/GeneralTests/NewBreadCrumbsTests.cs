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
	abstract public class NewBreadCrumbsTests : CzTestBase
	{
		[TestInitialize]
		public void TestInitialize()
		{
			GoToUrl();
			var vcPageObj = new VirtualCanvasComponent(Driver);
			vcPageObj.WaitContentLoading();
		}

		[TestMethod]
		public void TestBreadCrumbClick()
		{
			int ellipticZoomTimeWait = 16500;
			IJavaScriptExecutor js = Driver as IJavaScriptExecutor;

			var getHumanityPathJsStr = "return humanityVisible;";

			var fullPathHumanity = js.ExecuteScript(getHumanityPathJsStr);
			var zoomedVisible = js.ExecuteScript("navigateToBookmark(humanityVisible);");
		//    Thread.Sleep(0);
		////	js.ExecuteScript("alert(1);");
		//     var a = js.ExecuteScript("return breadCrumbs[0].vcElement;") as Dictionary<string, object>;

			Thread.Sleep(ellipticZoomTimeWait);
			var strBreadCrumbs = js.ExecuteScript("var i,str; str = ''; for (i = 0; i < breadCrumbs.length; i++) { str = str + '/'+breadCrumbs[i].vcElement.id;} return str;");

			Assert.AreEqual(fullPathHumanity, strBreadCrumbs);
		}

		

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
			IWebElement crumb = Driver.FindElement(By.Id("bc_0")); //finding second bread crumb to test a link of it
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
		public void TestBreadCrumbTimelineClick()
		{
			int ellipticZoomTimeWait = 6200;
			IJavaScriptExecutor js = Driver as IJavaScriptExecutor;

			var setVis = (Driver as IJavaScriptExecutor).ExecuteScript(
				"setVisible(new VisibleRegion2d(-6850000000,3388966248.683534,8124234.157802994));" //going into Canvas timeline (coordinates snapshot)
				);
			Thread.Sleep(ellipticZoomTimeWait);

			Point crumbPosition = new Point(688, 198); //timeline

			ActionsExtension crumbClick = new ActionsExtension(Driver);
			crumbClick.MoveByOffset(crumbPosition.X, crumbPosition.Y)
				.Click()
				.Perform(); //clicking on the bread crumb
			crumbClick.SetDefault(); // return mouse position to default
			Thread.Sleep(ellipticZoomTimeWait);

			var idResTimeline = js.ExecuteScript("return breadCrumbs[1].vcElement.id");
			Assert.AreEqual("t91", idResTimeline); //"Stelliferous (Starry) Epoch" id timeline
		}

	}

	[TestClass]
	[WebDriverSettings(BrowserType.Firefox)]
	public class NewBreadCrumbsTests_Firefox : NewBreadCrumbsTests
	{
		[ClassCleanup]
		public static void ClassCleanup()
		{
			Stop();
		}
	}

	[TestClass]
	[WebDriverSettings(BrowserType.InternetExplorer)]
	public class NewBreadCrumbsTests_IE : NewBreadCrumbsTests
	{
		[ClassCleanup]
		public static void ClassCleanup()
		{
			Stop();
		}
	}
}
