using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using Microsoft.IdentityModel.Claims;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Thinktecture.IdentityModel.Tokens.Http;

namespace Tests
{
    [TestClass]
    public class BasicAuthentication
    {
        [TestMethod]
        public void ValidCredentials()
        {
            var client = new HttpClient(Factory.GetDefaultServer());
            var request = Factory.GetDefaultRequest();
            request.Headers.Authorization = new BasicAuthenticationHeaderValue("test", "test");

            var response = client.SendAsync(request).Result;
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);  
        }

        [TestMethod]
        public void ValidCredentialsCheckIdentity()
        {
            var client = new HttpClient(Factory.GetDefaultServer());
            var request = Factory.GetDefaultRequest();
            request.Headers.Authorization = new BasicAuthenticationHeaderValue("test", "test");

            var response = client.SendAsync(request).Result;

            var id = Thread.CurrentPrincipal.Identity as ClaimsIdentity;
            Assert.IsNotNull(id, "Identity is null");

            Assert.IsTrue(id.IsAuthenticated, "Identity is anonymous");
            Assert.AreEqual("test", id.Name);
        }

        [TestMethod]
        public void InvalidCredentials()
        {
            var client = new HttpClient(Factory.GetDefaultServer());
            var request = Factory.GetDefaultRequest();
            request.Headers.Authorization = new BasicAuthenticationHeaderValue("test", "test!");

            var response = client.SendAsync(request).Result;
            Assert.AreEqual(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [TestMethod]
        public void EmptyCredentials()
        {
            var client = new HttpClient(Factory.GetDefaultServer());
            var request = Factory.GetDefaultRequest();
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic");

            var response = client.SendAsync(request).Result;
            Assert.AreEqual(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [TestMethod]
        public void MalformedCredentials()
        {
            var client = new HttpClient(Factory.GetDefaultServer());
            var request = Factory.GetDefaultRequest();
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", "invalid");

            var response = client.SendAsync(request).Result;
            Assert.AreEqual(HttpStatusCode.Unauthorized, response.StatusCode);
        }
    }
}
