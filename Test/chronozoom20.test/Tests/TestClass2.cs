using Framework;
using Framework.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class TestClass2 : TestBase
    {

        #region Initialize and Cleanup

        [ClassInitialize]
        public static void ClassInitialize(TestContext testContext)
        {
        }

        [TestInitialize]
        public void TestInitialize()
        {
            BrowserStateManager.RefreshState();
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
        }

        #endregion

        [Ignore]
        [TestMethod]
        public void Test_2_1()
        {
            NavigationHelper.OpenHomePage();
            Assert.AreEqual(true, true);
        }

        [Ignore]
        [TestMethod]
        public void Test_2_2()
        {
            NavigationHelper.OpenHomePage();
            Assert.AreEqual(true, true);
        }

        [Ignore]
        [TestMethod]
        public void Test_2_3()
        {
            NavigationHelper.OpenHomePage();
            Assert.AreEqual(true, true);
        } 
    }
}