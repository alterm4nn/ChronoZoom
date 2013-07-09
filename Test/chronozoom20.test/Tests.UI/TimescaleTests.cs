using System.Collections.Generic;
using Application.Driver;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class TimescaleTests : TestBase
    {
        const string Label2000Bce = "2000 BCE";
        const string Label2001Bce = "2001 BCE";
        const string Label2000Ce = "2000 CE";
        const string Label3500Ma = "3500 Ma";
        const string Label500Ma = "500 Ma";
        const string Label1Bce = "1 BCE";
        const string Label1Ce = "1 CE";



        #region Initialize and Cleanup
        public TestContext TestContext { get; set; }

        [ClassInitialize]
        public static void ClassInitialize(TestContext testContext)
        {
            HomePageHelper.OpenPage();
        }

        [TestInitialize]
        public void TestInitialize()
        {
            BrowserStateManager.RefreshState();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
            CreateScreenshotsIfTestFail(TestContext);
            if (TestContext.CurrentTestOutcome != UnitTestOutcome.Passed && TestContext.CurrentTestOutcome != UnitTestOutcome.Inconclusive)
            {
                HomePageHelper.OpenPage();
            }
        }

        #endregion

        [TestMethod]
        public void Life_TimeLine_Contains_Data()
        {
            TimelineHelper.OpenCosmosTimeline();
            TimelineHelper.OpenLifeTimeline();
            List<string> labels = TimescaleHelper.GetLabels();
            CollectionAssert.Contains(labels, Label3500Ma, Label3500Ma + " is not presented");
            CollectionAssert.Contains(labels, Label500Ma, Label500Ma + "is not presented");
        }

        [TestMethod]
        public void Humanity_TimeLine_Contains_Data()
        {
            TimelineHelper.OpenHumanityTimeline();
            List<string> labels = TimescaleHelper.GetLabels();
            CollectionAssert.Contains(labels, Label2000Bce, Label2000Bce + " is not presented");
            CollectionAssert.Contains(labels, Label2000Ce, Label2000Ce + " is not presented");
            CollectionAssert.DoesNotContain(labels, Label2001Bce, Label2001Bce + " is presented");
        }

        [TestMethod]
        [Ignore]
        public void Transition_BCE_to_CE_should_contain_1BCE_and_1CE_ticks()
        {
            Logger.Log("Bug: @https://github.com/alterm4nn/ChronoZoom/issues/87", LogType.Debug);
            TimelineHelper.OpenBceCeArea();
            List<string> labels = TimescaleHelper.GetLabels();
            CollectionAssert.Contains(labels, Label1Bce, Label1Bce + " is not presented");
            CollectionAssert.Contains(labels, Label1Ce, Label1Ce + " is not presented");
        }

        [TestMethod]
        public void Mouse_Marker()
        {
            TimelineHelper.OpenHumanityTimeline();
            HomePageHelper.MoveMouseToCenter();
            string mouseMarkerText = TimescaleHelper.GetMouseMarkerText();
            HomePageHelper.MoveMouseToLeft();
            string mouseMarkerLeftText = TimescaleHelper.GetMouseMarkerText();
            Assert.AreNotEqual(mouseMarkerText, mouseMarkerLeftText);
            HomePageHelper.MoveMouseToCenter();
            string mouseMarkerCenterText = TimescaleHelper.GetMouseMarkerText();
            Assert.AreNotEqual(mouseMarkerLeftText, mouseMarkerCenterText);
        }
    }
}