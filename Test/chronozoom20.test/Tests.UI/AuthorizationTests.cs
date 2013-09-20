using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class AuthorizationTests : TestBase
    {
        //Tests are not working against IE because IE doesnt provide information about httponly cookies
        public TestContext TestContext { get; set; }

        #region Initialize and Cleanup

        [ClassInitialize]
        public static void ClassInitialize(TestContext testContext)
        {
            HomePageHelper.OpenPage();
        }

        [TestInitialize]
        public void TestInitialize()
        {
            BrowserStateManager.RefreshState();
            HomePageHelper.OpenPage();
            AuthorizationHelper.OpenLoginPage();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
            AuthorizationHelper.LogoutByUrl();
            CreateScreenshotsIfTestFail(TestContext);
        }

        #endregion

        [TestMethod]
        public void Test_Login_as_new_Google_user()
        {
            AuthorizationHelper.AuthenticateAsGoogleUser();
            Assert.IsTrue(AuthorizationHelper.IsNewUserAuthenticated(), "User is not authenticated");
            AuthorizationHelper.Logout();
            Assert.IsTrue(AuthorizationHelper.IsUserLogout(), "User is not logout");
            Assert.IsFalse(AuthorizationHelper.IsUserCookieExist(), "Cookies are not deleted");
        }

        [TestMethod]
        public void Test_Login_as_new_Yahoo_user()
        {
            AuthorizationHelper.AuthenticateAsYahooUser();
            Assert.IsTrue(AuthorizationHelper.IsNewUserAuthenticated(), "User is not authenticated");
            AuthorizationHelper.Logout();
            Assert.IsTrue(AuthorizationHelper.IsUserLogout(), "User is not logout");
            Assert.IsFalse(AuthorizationHelper.IsUserCookieExist(), "Cookies are not deleted");
        }

        [TestMethod]
        public void Test_Login_as_existed_Ms_user()
        {
            AuthorizationHelper.AuthenticateAsMicrosoftUser();
            Assert.IsTrue(AuthorizationHelper.IsExistedUserAuthenticated(), "User is not authenticated");
            AuthorizationHelper.Logout();
            Assert.IsTrue(AuthorizationHelper.IsUserLogout(), "User is not logout");
            Assert.IsFalse(AuthorizationHelper.IsUserCookieExist(), "Cookies are not deleted");
        }
    }
}