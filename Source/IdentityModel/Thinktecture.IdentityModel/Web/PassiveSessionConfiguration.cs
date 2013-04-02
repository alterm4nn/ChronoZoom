using System;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Web;

namespace Thinktecture.IdentityModel.Web
{
    public static class PassiveSessionConfiguration
    {
        public static void ConfigureMackineKeyProtectionForSessionTokens()
        {
            var handler = (SessionSecurityTokenHandler)FederatedAuthentication.ServiceConfiguration.SecurityTokenHandlers[typeof(SessionSecurityToken)];
            if (!(handler is MachineKeySessionSecurityTokenHandler))
            {
                var mkssth = new MachineKeySessionSecurityTokenHandler();
                if (handler != null)
                {
                    mkssth.TokenLifetime = handler.TokenLifetime;
                    mkssth.TokenCache = handler.TokenCache;
                }
                FederatedAuthentication.ServiceConfiguration.SecurityTokenHandlers.AddOrReplace(mkssth);
            }
        }

        public static void ConfigureSessionCache(ITokenCacheRepository tokenCacheRepository)
        {
            var handler = FederatedAuthentication.ServiceConfiguration.SecurityTokenHandlers[typeof(SessionSecurityToken)] as SessionSecurityTokenHandler;
            if (handler == null) throw new Exception("SessionSecurityTokenHandler not registered.");
            if (!(handler.TokenCache is PassiveRepositorySessionSecurityTokenCache))
            {
                handler.TokenCache = new PassiveRepositorySessionSecurityTokenCache(tokenCacheRepository, handler.TokenCache);
            }
        }

        public static void ConfigureDefaultSessionDuration(TimeSpan sessionDuration)
        {
            var handler = (SessionSecurityTokenHandler)FederatedAuthentication.ServiceConfiguration.SecurityTokenHandlers[typeof(SessionSecurityToken)];
            if (handler != null)
            {
                handler.TokenLifetime = sessionDuration;
            }
        }
    }
}
