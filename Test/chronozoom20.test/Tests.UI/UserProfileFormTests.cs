using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class UserProfileFormTests : TestBase
    {
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
            HomePageHelper.OpenPage();
            if (AuthorizationHelper.IsUserNamePresented())
            {
                AuthorizationHelper.OpenLoginPage();
                AuthorizationHelper.AuthenticateAsMicrosoftUser();
            }
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
            CreateScreenshotsIfTestFail(TestContext);
            AuthorizationHelper.LogoutByUrl();
        }

        #endregion

        [TestMethod]
        //Bug: https://github.com/alterm4nn/ChronoZoom/issues/548
        public void profile_form_should_be_opened_by_click_on_user_name()
        {
            AuthorizationHelper.ClickOnUserName();
            Assert.IsTrue(AuthorizationHelper.IsEditProfileFormDisplayed(), "Edit profile form is not dispayed");
        }

        [TestMethod]
        //Bug: https://github.com/alterm4nn/ChronoZoom/issues/728
        public void alert_provided_incorrect_email_address_should_be_shown_1_time()
        {
            AuthorizationHelper.ProvideEmail("hfweuihqfuiw");
            Assert.IsFalse(AuthorizationHelper.IsAlertDispalyed(), "second alert is presented");
        }
    }
}