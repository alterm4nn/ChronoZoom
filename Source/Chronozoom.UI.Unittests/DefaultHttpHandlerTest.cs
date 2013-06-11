using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using Chronozoom.UI;

namespace Chronozoom.UI.Test
{
    [TestClass]
    public class DefaultHttpHandlerTest
    {
        [TestMethod]
        public void TestUI_DefaultHttpHandler_GeneratesDefaultPage()
        {
            PageInformation pageInformation = new PageInformation();

            PrivateType privateDefaultHttpHandler = new PrivateType(typeof(DefaultHttpHandler));
            privateDefaultHttpHandler.SetStaticField("_hostPath", new Lazy<string>(() =>
            {
                return "";
            }));

            try
            {
                string page = DefaultHttpHandler.GenerateDefaultPage(pageInformation);
                Assert.IsNotNull(page, "Page is expected to generate correctly");
                Assert.IsTrue(page.Length > 0, "Page is expected to contain content");
            }
            catch (Exception)
            {
                Assert.Fail("GenerateDefaultPage should not throw exceptions");
            }
        }
    }
}