using Application.Helper.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class TimelineTests : TestBase
    {
        #region Initialize and Cleanup
        public TestContext TestContext { get; set; }
        private static Timeline _newTimeline;
        private static Timeline _timeline;

        [ClassInitialize]
        public static void ClassInitialize(TestContext testContext)
        {
            BrowserStateManager.RefreshState();
            HomePageHelper.OpenSandboxPage();
            
            _timeline = new Timeline { Title = "WebdriverTitle" };
            HomePageHelper.DeleteAllElementsLocally();
            TimelineHelper.AddTimeline(_timeline);
            _newTimeline = TimelineHelper.GetLastTimeline();
        }

        [TestInitialize]
        public void TestInitialize()
        {
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
            if (TimelineHelper.IsTimelineFound(_newTimeline))
            {
                TimelineHelper.DeleteTimelineByJavaScript(_newTimeline);
            }
        }

        [TestCleanup]
        public void TestCleanup()
        {
            CreateScreenshotsIfTestFail(TestContext);
        }

        #endregion

        [TestMethod]
        public void new_timeline_should_have_a_title()
        {
            Assert.AreEqual(_timeline.Title, _newTimeline.Title);
        }

        [TestMethod]
        public void new_timline_should_not_have_null_id()
        {
            Assert.IsNotNull(_newTimeline.TimelineId);
        }

        [TestMethod]
        public void new_timline_should_be_deleted()
        {
            TimelineHelper.DeleteTimeline(_newTimeline);
            Assert.IsFalse(TimelineHelper.IsTimelineFound(_newTimeline));
        }
    }
}