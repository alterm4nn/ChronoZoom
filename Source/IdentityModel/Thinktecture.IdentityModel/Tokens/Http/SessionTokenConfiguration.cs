using System;
using Microsoft.IdentityModel.Tokens;

namespace Thinktecture.IdentityModel.Tokens.Http
{
    public class SessionTokenConfiguration
    {
        JsonWebTokenHandler _handler;
        object _handlerLock = new object();

        public TimeSpan DefaultTokenLifetime { get; set; }
        public string EndpointAddress { get; set; }
        public string Scheme { get; set; }
        public Uri Audience { get; set; }
        public string SigningKey { get; set; }
        public string IssuerName { get; set; }

        public JsonWebTokenHandler SecurityTokenHandler
        {
            get
            {
                if (_handler == null)
                {
                    lock (_handlerLock)
                    {
                        if (_handler == null)
                        {
                            var config = new SecurityTokenHandlerConfiguration();
                            var registry = new WebTokenIssuerNameRegistry();
                            registry.AddTrustedIssuer(IssuerName, IssuerName);
                            config.IssuerNameRegistry = registry;

                            var issuerResolver = new WebTokenIssuerTokenResolver();
                            issuerResolver.AddSigningKey(IssuerName, SigningKey);
                            config.IssuerTokenResolver = issuerResolver;

                            config.AudienceRestriction.AllowedAudienceUris.Add(Audience);

                            var handler = new JsonWebTokenHandler();
                            handler.Configuration = config;

                            _handler = handler;
                        }
                    }
                }

                return _handler;
            }
        }

        public SessionTokenConfiguration()
        {
            DefaultTokenLifetime = TimeSpan.FromHours(10);
            EndpointAddress = "/token";
            Scheme = "Session";
            Audience = new Uri("http://session.tt");
            IssuerName = "session issuer";
            SigningKey = Convert.ToBase64String(CryptoRandom.CreateRandomKey(32));
        }
    }
}
