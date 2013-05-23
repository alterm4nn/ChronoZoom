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
            HomePageHelper.OpenSandboxPage();
            AuthorizationHelper.OpenLoginPage();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
            AuthorizationHelper.Logout();
            CreateScreenshotsIfTestFail(TestContext);
        }

        #endregion

        [TestMethod]
        public void Test_Login_as_Google_user()
        {

            AuthorizationHelper.AuthenticateAsGoogleUser();
            Assert.IsTrue(AuthorizationHelper.IsUserAuthenticated());
        }

        [TestMethod]
        public void Test_Login_as_Yahoo_user()
        {
            AuthorizationHelper.AuthenticateAsYahooUser();
            Assert.IsTrue(AuthorizationHelper.IsUserAuthenticated());
        }

        [TestMethod]
        public void Test_Login_as_Ms_user()
        {
            AuthorizationHelper.AuthenticateAsMicrosoftUser();
            Assert.IsTrue(AuthorizationHelper.IsUserAuthenticated());
        }
    }
}