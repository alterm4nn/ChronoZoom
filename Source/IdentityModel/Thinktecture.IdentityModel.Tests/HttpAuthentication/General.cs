using System.Net;
using System.Net.Http;
using System.Threading;
using Microsoft.IdentityModel.Claims;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class General
    {
        [TestMethod]
        public void NoCredential()
        {
            var client = new HttpClient(Factory.GetDefaultServer());
            var request = Factory.GetDefaultRequest();

            var response = client.SendAsync(request).Result;
            
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);

            var id = Thread.CurrentPrincipal.Identity as ClaimsIdentity;
            Assert.IsNotNull(id, "Identity is null");

            Assert.IsFalse(id.IsAuthenticated, "Identity is not anonymous");
        }
    }
}
