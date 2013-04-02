//using System;
//using Microsoft.VisualStudio.TestTools.UnitTesting;
//using Thinktecture.IdentityModel.Tokens;
//using Thinktecture.IdentityModel.Tokens.Http;
//using Thinktecture.IdentityModel.Extensions;
//using System.Web.Security;
//using System.Security.Claims;

//namespace Thinktecture.IdentityModel.Tests.HttpAuthenticationTests
//{
//    [TestClass]
//    public class Configuration
//    {
//        [TestMethod]
//        public void BasicAuthentication()
//        {
//            var config = new AuthenticationConfiguration();

//            config.AddBasicAuthentication((username, password) =>
//                Membership.ValidateUser(username, password));
//        }

//        [TestMethod]
//        public void AuthorizationHeader()
//        {
//            var config = new AuthenticationConfiguration();

//            config.AddJsonWebToken(
//                issuer: "http://issuer.com",
//                audience: "http://rp.com",
//                signingKey: "123",
//                options: AuthenticationOptions.ForAuthorizationHeader("Bearer"));
//        }

//        [TestMethod]
//        public void QueryString()
//        {
//            var apiKeyHandler = new SimpleSecurityTokenHandler("accesskey", null);

//            var config = new AuthenticationConfiguration();

//            config.AddAccessKey(
//                handler: apiKeyHandler,
//                options: AuthenticationOptions.ForQueryString("apikey"));
//        }

//        [TestMethod]
//        [ExpectedException(typeof(InvalidOperationException))]
//        public void DuplicateQueryString()
//        {
//            var apiKeyHandler = new SimpleSecurityTokenHandler("accesskey", null);

//            var config = new AuthenticationConfiguration();

//            config.AddAccessKey(
//                handler: apiKeyHandler,
//                options: AuthenticationOptions.ForQueryString("apikey"));

//            config.AddAccessKey(
//                handler: apiKeyHandler,
//                options: AuthenticationOptions.ForQueryString("apikey"));
//        }

//        [TestMethod]
//        public void Header()
//        {
//            var config = new AuthenticationConfiguration();

//            config.AddJsonWebToken(
//                issuer: "http://issuer.com",
//                audience: "http://rp.com",
//                signingKey: "123",
//                options: AuthenticationOptions.ForHeader("X-CustomAuth"));
//        }

//        //[TestMethod]
//        //public void Authenticate()
//        //{
//        //    var config = new AuthenticationConfiguration();

//        //    config.AddJsonWebToken(
//        //        issuer: "http://issuer.com",
//        //        audience: "http://rp.com",
//        //        signingKey: "123",
//        //        options: AuthenticationOptions.ForHeader("X-CustomAuth"));


//        //    var authN = new HttpAuthentication(config);
//        //    ClaimsPrincipal principal = authN.Authenticate(request);

//        //}

//        public System.Net.Http.HttpRequestMessage request { get; set; }
//    }
//}
