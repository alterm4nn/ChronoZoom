using System;
using System.IdentityModel.Selectors;
using System.IdentityModel.Tokens;
using System.Net.Http;
using System.Security.Cryptography.X509Certificates;
using System.Web.Http;
using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.SecurityTokenService;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Tokens.Saml2;
using Thinktecture.IdentityModel.Extensions;
using Thinktecture.IdentityModel.Tokens.Http;

namespace Tests
{
    internal static class Factory
    {
        public static HttpRequestMessage GetDefaultRequest()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "http://test/");
            return request;
        }

        public static HttpConfiguration GetDefaultConfiguration()
        {
            var authHandler = GetDefaultAuthenticationHandler();

            var httpConfig = new HttpConfiguration();
            httpConfig.MessageHandlers.Add(authHandler);

            return httpConfig;
        }

        private static AuthenticationHandler GetDefaultAuthenticationHandler()
        {
            var authConfig = new AuthenticationConfiguration();

            #region Basic Authentication
            authConfig.AddBasicAuthentication((userName, password) => { return userName == password; });
            #endregion

            //#region SWT
            //authConfig.Handler.AddSimpleWebToken(
            //    "SWT", 
            //    Constants.Issuer,
            //    Constants.Realm,
            //    "Dc9Mpi3jbooUpBQpB/4R7XtUsa3D/ALSjTVvK8IUZbg=");
            //#endregion

            #region SAML2 tokens
            var registry = new ConfigurationBasedIssuerNameRegistry();
            registry.AddTrustedIssuer("D263DDCF598E716F0037380796A4A62DF017ADB8", "TEST");

            var saml2Config = new SecurityTokenHandlerConfiguration();
            saml2Config.AudienceRestriction.AllowedAudienceUris.Add(new Uri("https://test"));
            saml2Config.IssuerNameRegistry = registry;
            saml2Config.CertificateValidator = X509CertificateValidator.None;

            authConfig.AddSaml2(saml2Config, AuthenticationOptions.ForAuthorizationHeader("Saml2"));
            #endregion

            var authHandler = new AuthenticationHandler(authConfig);
            return authHandler;
        }

        public static HttpServer GetDefaultServer()
        {
            return new HttpServer(GetDefaultConfiguration(), new LoopBackHandler(req => new HttpResponseMessage()));
        }

        public static string CreateSaml2Token(string name)
        {
            var id = new ClaimsIdentity(new Claim[] { new Claim(ClaimTypes.Name, name) }, "SAML");

            var descriptor = new SecurityTokenDescriptor
            {
                Subject = id,
                AppliesToAddress = "https://test",
                TokenIssuerName = "http://issuer",
                SigningCredentials = GetSamlSigningCredential(),
            };

            var handler = new Saml2SecurityTokenHandler();
            handler.Configuration = new SecurityTokenHandlerConfiguration();

            var token = handler.CreateToken(descriptor);
            return token.ToTokenXmlString();
        }

        private static SigningCredentials GetSamlSigningCredential()
        {
            var cert = new X509Certificate2("test.pfx", "abc!123");
            return new X509SigningCredentials(cert);
        }
    }
}
