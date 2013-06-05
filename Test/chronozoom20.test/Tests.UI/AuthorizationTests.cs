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
            HomePageHelper.OpenPage();
            WelcomeScreenHelper.CloseWelcomePopup();
        }

        [TestInitialize]
        public void TestInitialize()
        {
            BrowserStateManager.RefreshState();
            HomePageHelper.OpenPage();
            WelcomeScreenHelper.CloseWelcomePopup();
            AuthorizationHelper.OpenLoginPage();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
            AuthorizationHelper.DeleteAuthenticatedCookies();
            CreateScreenshotsIfTestFail(TestContext);
        }

        #endregion

        [TestMethod]
        public void Test_Login_as_new_Google_user()
        {
            AuthorizationHelper.AuthenticateAsGoogleUser();
            Assert.IsTrue(AuthorizationHelper.IsNewUserAuthenticated());
            AuthorizationHelper.Logout();
            Assert.IsTrue(AuthorizationHelper.IsUserLogout());
            Assert.IsFalse(AuthorizationHelper.IsUserCookieExist(), "Cookies are not deleted");
        }

        [TestMethod]
        public void Test_Login_as_new_Yahoo_user()
        {
            AuthorizationHelper.AuthenticateAsYahooUser();
            Assert.IsTrue(AuthorizationHelper.IsNewUserAuthenticated());
            AuthorizationHelper.Logout();
            Assert.IsTrue(AuthorizationHelper.IsUserLogout());
            Assert.IsFalse(AuthorizationHelper.IsUserCookieExist(), "Cookies are not deleted");
        }

        [TestMethod]
        public void Test_Login_as_existed_Ms_user()
        {
            AuthorizationHelper.AuthenticateAsMicrosoftUser();
            Assert.IsTrue(AuthorizationHelper.IsExistedUserAuthenticated());
            AuthorizationHelper.Logout();
            Assert.IsTrue(AuthorizationHelper.IsUserLogout());
            Assert.IsFalse(AuthorizationHelper.IsUserCookieExist(), "Cookies are not deleted");
        }
    }
}