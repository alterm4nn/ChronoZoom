using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class AuthorizationTests : TestBase
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
            HomePageHelper.OpenPage();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
            HomePageHelper.WaitWhileHomePageIsLoaded();
            AuthorizationHelper.Logout();
            HomePageHelper.WaitWhileHomePageIsLoaded();
            CreateScreenshotsIfTestFail(TestContext);
        }

        #endregion

        [TestMethod]
        public void Test_Login_as_Google_user()
        {
            HomePageHelper.OpenLoginPage();
            AuthorizationHelper.AuthenticateAsGoogleUser();
            Assert.IsTrue(AuthorizationHelper.IsUserAuthenticated());
        }

        [TestMethod]
        public void Test_Login_as_Yahoo_user()
        {
            HomePageHelper.OpenLoginPage();
            AuthorizationHelper.AuthenticateAsYahooUser();
            Assert.IsTrue(AuthorizationHelper.IsUserAuthenticated());
        }

        [TestMethod]
        public void Test_Login_as_Ms_user()
        {
            HomePageHelper.OpenLoginPage();
            AuthorizationHelper.AuthenticateAsMicrosoftUser();
            Assert.IsTrue(AuthorizationHelper.IsUserAuthenticated());
        }
    }
}