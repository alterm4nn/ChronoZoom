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
            const string originalUrl = "with space";
            const string expectedUrl = "with+space";
            string encodedUrl = FriendlyUrl.FriendlyUrlEncode(originalUrl);

            Assert.AreEqual(expectedUrl, encodedUrl, "Unexpected encoding");
        } 
        
        [TestMethod]
        public void TestUI_FriendlyUrl_Encode_Null_Value_Correctly()
        {
            string encodedUrl = FriendlyUrl.FriendlyUrlEncode(null);
            Assert.IsNull(encodedUrl, "Unexpected encoding");
        }    
        
        [TestMethod]
        public void TestUI_FriendlyUrl_Decode_Null_Value_Correctly()
        {
            string encodedUrl = FriendlyUrl.FriendlyUrlDecode(null);
            Assert.IsNull(encodedUrl, "Unexpected encoding");
        }

        [TestMethod]
        public void TestUI_FriendlyUrl_DecodesCorrectly()
        {
            const string expectedUrl = "100% true";
            const string originalUrl = "100%%20true";
            string encodedUrl = FriendlyUrl.FriendlyUrlDecode(originalUrl);

            Assert.AreEqual(expectedUrl, encodedUrl, "Unexpected encoding");
        } 
    }
}