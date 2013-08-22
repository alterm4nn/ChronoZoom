using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using Chronozoom.UI;

namespace Chronozoom.UI.Test
{
    [TestClass]
    public class FriendlyUrlTest
    {
        [TestMethod]
        public void TestUI_FriendlyUrl_EncodesCorrectly()
        {
            string originalUrl = "with space";
            string expectedUrl = "with+space";
            string encodedUrl = FriendlyUrl.FriendlyUrlEncode(originalUrl);

            Assert.AreEqual(expectedUrl, encodedUrl, "Unexpected encoding");
        }
    }
}