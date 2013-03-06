using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class TimescaleTests : TestBase
    {
        public TestContext TestContext { get; set; }

        #region Initialize and Cleanup

        [ClassInitialize]
        public static void ClassInitialize(TestContext testContext)
        {

        }

        [TestInitialize]
        public void TestInitialize()
        {
            BrowserStateManager.RefreshState();
            NavigationHelper.OpenHomePage();
            //HomePageHelper.CloseWelcomePopup();
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
            CollectionAssert.Contains(TimelineHelper.GetLabels(), "-4000Ma", "-4000Ma is presented");
            CollectionAssert.Contains(TimelineHelper.GetLabels(), "-500Ma", "-500Ma is presented");
        } 
        
        [TestMethod]
        public void Humanity_TimeLine_Contains_Data()
        {
            HomePageHelper.OpenHumanityTimeline();
            CollectionAssert.Contains(TimelineHelper.GetLabels(), "3000BCE", "3000BCE is presented");
            CollectionAssert.Contains(TimelineHelper.GetLabels(), "2000CE", "2000CE is presented");
        }  
        
        [TestMethod]
        public void Transition_BCE_to_CE_should_contain_1BCE_and_1CE_ticks()
        {
            HomePageHelper.OpenBceCeArea();
            CollectionAssert.Contains(TimelineHelper.GetLabels(), "1BCE", "1BCE is presented");
            CollectionAssert.Contains(TimelineHelper.GetLabels(), "1CE", "1CE is presented");
        }  
    }
}