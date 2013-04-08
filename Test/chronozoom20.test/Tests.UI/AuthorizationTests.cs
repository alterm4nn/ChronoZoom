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
            NavigationHelper.OpenHomePage();
            WelcomeScreenHelper.CloseWelcomePopup();
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
            AuthorizationHelper.AuthenticateAsMsUser();
            Assert.IsTrue(AuthorizationHelper.IsUserAuthenticated());
        }
    }
}