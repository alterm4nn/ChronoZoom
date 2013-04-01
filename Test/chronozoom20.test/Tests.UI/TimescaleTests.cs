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
        const string Label2000Ce = "2000 AD";
        const string Label4000Ma = "4000 Ma";
        const string Label500Ma = "500 Ma";
        const string Label1Bce = "1 BCE";
        const string Label1Ce = "1 AD";

       

        #region Initialize and Cleanup
        public TestContext TestContext { get; set; }

        [ClassInitialize]
        public static void ClassInitialize(TestContext testContext)
        {

        }

        [TestInitialize]
        public void TestInitialize()
        {
            BrowserStateManager.RefreshState();
            NavigationHelper.OpenHomePage();
            WelcomeScreenHelper.CloseWelcomePopup();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
            CreateScreenshotsIfTestFail(TestContext);
            NavigationHelper.NavigateToCosmos();
        }

        #endregion 

        [TestMethod]
        public void Life_TimeLine_Contains_Data()
        {
            HomePageHelper.OpenLifeTimeline();
            List<string> labels = TimescaleHelper.GetLabels();
            CollectionAssert.Contains(labels, Label4000Ma, Label4000Ma + " is not presented");
            CollectionAssert.Contains(labels, Label500Ma, Label500Ma + "is not presented");
        } 
        
        [TestMethod]
        public void Humanity_TimeLine_Contains_Data()
        {
            HomePageHelper.OpenHumanityTimeline();
            List<string> labels = TimescaleHelper.GetLabels();
            CollectionAssert.Contains(labels, Label2000Bce, Label2000Bce + " is not presented");
            CollectionAssert.Contains(labels, Label2000Ce, Label2000Ce + " is not presented");
            CollectionAssert.DoesNotContain(labels, Label2001Bce, Label2001Bce + " is presented");
        }  
        
        [TestMethod]
        public void Transition_BCE_to_CE_should_contain_1BCE_and_1CE_ticks()
        {
            Logger.Log("Bug: https://github.com/alterm4nn/ChronoZoom/issues/87",LogType.Debug);
            HomePageHelper.OpenBceCeArea();
            List<string> labels = TimescaleHelper.GetLabels();
            CollectionAssert.Contains(labels, Label1Bce, Label1Bce + " is not presented");
            CollectionAssert.Contains(labels, Label1Ce, Label1Ce + " is not presented");
        }  
        
        [TestMethod]
        public void Roman_History_TimeLine_Borders()
        {
            HomePageHelper.OpenHumanityTimeline();
            HomePageHelper.OpenRomanHistoryTimeline();
            const double expected = 943;
            double leftBorder = TimescaleHelper.GetLeftBorderDate();
            double rightBorder = TimescaleHelper.GetRightBorderDate();
            Assert.AreEqual(expected, rightBorder - leftBorder);
        }  
        
        [TestMethod]
        public void Roman_History_TimeLine_Borders_Ages()
        {
            HomePageHelper.OpenHumanityTimeline();
            HomePageHelper.OpenRomanHistoryTimeline();
            const string leftBorderAge = "BCE";
            const string righBorderAge = "AD";
            string leftBorder = TimescaleHelper.GetLeftBorderDateAge();
            string rightBorder = TimescaleHelper.GetRightBorderDateAge();
            Assert.AreEqual(leftBorderAge, leftBorder);
            Assert.AreEqual(righBorderAge, rightBorder);
        }  
        
        [TestMethod]
        public void Mouse_Marker()
        {
            HomePageHelper.OpenHumanityTimeline();
            string mouseMarkerText = TimescaleHelper.GetMouseMarkerText();
            HomePageHelper.MoveMouseToCenter();
            string mouseMarkerCenterText = TimescaleHelper.GetMouseMarkerText();
            Assert.AreNotEqual(mouseMarkerText, mouseMarkerCenterText);
            HomePageHelper.MoveMouseToLeft();
            mouseMarkerText = TimescaleHelper.GetMouseMarkerText();
            Assert.AreNotEqual(mouseMarkerText, mouseMarkerCenterText);
        }  
    }
}