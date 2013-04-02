using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Protocols.WSTrust;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Thinktecture.IdentityModel.Tests.Helper;
using Thinktecture.IdentityModel.Tokens;

namespace Thinktecture.IdentityModel.Tests.Jwt
{
    [TestClass]
    public class HandlerCreate
    {
        [TestMethod]
        public void HandlerCreateRoundtripSingleClaimTypes()
        {
            var signinKey = SymmetricKeyGenerator.Create(32);

            var identity = new ClaimsIdentity(new List<Claim>
                {
                    new Claim(ClaimTypes.Name, "dominick"),
                    new Claim(ClaimTypes.Email, "dominick.baier@thinktecture.com"),
                }, "Custom");

            var descriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                SigningCredentials = new HmacSigningCredentials(signinKey),
                TokenIssuerName = "dominick",
                Lifetime = new Lifetime(DateTime.UtcNow, DateTime.UtcNow.AddHours(8)),
                AppliesToAddress = "http://foo.com"
            };

            var handler = new JsonWebTokenHandler();
            var token = handler.CreateToken(descriptor);


            var tokenString = handler.WriteToken(token);
            Trace.WriteLine(tokenString);

            // token should not be empty
            Assert.IsTrue(!string.IsNullOrWhiteSpace(tokenString));

            // token with signature needs to be 3 parts
            var parts = tokenString.Split('.');
            Assert.IsTrue(parts.Length == 3, "JWT should have excactly 3 parts");

            // signature must be 256 bits
            var sig = Base64Url.Decode(parts[2]);
            Assert.IsTrue(sig.Length == 32, "Signature is not 32 bits");

            var jwtToken = handler.ReadToken(tokenString);


            var config = new SecurityTokenHandlerConfiguration();
            var registry = new WebTokenIssuerNameRegistry();
            registry.AddTrustedIssuer("dominick", "dominick");
            config.IssuerNameRegistry = registry;

            var issuerResolver = new WebTokenIssuerTokenResolver();
            issuerResolver.AddSigningKey("dominick", Convert.ToBase64String(signinKey));
            config.IssuerTokenResolver = issuerResolver;

            config.AudienceRestriction.AllowedAudienceUris.Add(new Uri("http://foo.com"));

            handler.Configuration = config;
            var identity2 = handler.ValidateToken(jwtToken).First();

            Assert.IsTrue(identity.Claims.Count() == 2);
            //Assert.IsTrue(identity.Claims.First().Issuer == "dominick");
        }

        [TestMethod]
        public void HandlerCreateRoundtripDuplicateClaimTypes()
        {
            var signinKey = SymmetricKeyGenerator.Create(32);

            var identity = new ClaimsIdentity(new List<Claim>
                {
                    new Claim(ClaimTypes.Name, "dominick"),
                    new Claim(ClaimTypes.Name, "dominick2"),
                    new Claim(ClaimTypes.Email, "dominick.baier@thinktecture.com"),
                    new Claim(ClaimTypes.Role, "bar"),
                    new Claim(ClaimTypes.Role, "foo")
                }, "Custom");

            var descriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                SigningCredentials = new HmacSigningCredentials(signinKey),
                TokenIssuerName = "dominick",
                Lifetime = new Lifetime(DateTime.UtcNow, DateTime.UtcNow.AddHours(8)),
                AppliesToAddress = "http://foo.com"
            };

            var handler = new JsonWebTokenHandler();
            var token = handler.CreateToken(descriptor);


            var tokenString = handler.WriteToken(token);
            Trace.WriteLine(tokenString);

            // token should not be empty
            Assert.IsTrue(!string.IsNullOrWhiteSpace(tokenString));

            // token with signature needs to be 3 parts
            var parts = tokenString.Split('.');
            Assert.IsTrue(parts.Length == 3, "JWT should have excactly 3 parts");

            // signature must be 256 bits
            var sig = Base64Url.Decode(parts[2]);
            Assert.IsTrue(sig.Length == 32, "Signature is not 32 bits");

            var jwtToken = handler.ReadToken(tokenString);


            var config = new SecurityTokenHandlerConfiguration();
            var registry = new WebTokenIssuerNameRegistry();
            registry.AddTrustedIssuer("dominick", "dominick");
            config.IssuerNameRegistry = registry;

            var issuerResolver = new WebTokenIssuerTokenResolver();
            issuerResolver.AddSigningKey("dominick", Convert.ToBase64String(signinKey));
            config.IssuerTokenResolver = issuerResolver;

            config.AudienceRestriction.AllowedAudienceUris.Add(new Uri("http://foo.com"));

            handler.Configuration = config;
            var identity2 = handler.ValidateToken(jwtToken).First();

            Assert.IsTrue(identity.Claims.Count() == 5);
            //Assert.IsTrue(identity.Claims.First().Issuer == "dominick");
        }
    }
}
