using System;
using System.Collections.ObjectModel;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Timeline = Chronozoom.Entities.Timeline;

namespace Tests.ApiTests
{
    [TestClass]
    public class FavoritesTests : TestBase
    {
        #region Initialize and Cleanup

        [ClassInitialize]
        public static void ClassInitialize(TestContext testContext)
        {}

        [TestInitialize]
        public void TestInitialize()
        {
            BrowserStateManager.RefreshState();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {}

        [TestCleanup]
        public void TestCleanup()
        {
            AuthorizationHelper.LogoutByUrl();
        }

        #endregion

        [TestMethod]
        public void AddTimelinesToFavorites()
        {
            HomePageHelper.OpenPage();
            AuthorizationHelper.OpenLoginPage();
            AuthorizationHelper.AuthenticateAsExistedGoogleUser();
            Collection<Timeline> timelines = ApiHelper.GetCurrentUserTimelines();
            NavigationHelper.OpenHomePage();
            ApiHelper.SetUserTimelinesAsNotFavorite(timelines);
            Guid[] selectedAsFavoriteTimelineGuids = ApiHelper.SelectAllTimelinesAsFavorites(timelines);
            Guid[] currentUserFavoriteTimelineGuids = ApiHelper.GetFavoriteTimelines();
            Assert.IsTrue(selectedAsFavoriteTimelineGuids.OrderBy(a => a).SequenceEqual(currentUserFavoriteTimelineGuids.OrderBy(a => a)));
        }

    }
}