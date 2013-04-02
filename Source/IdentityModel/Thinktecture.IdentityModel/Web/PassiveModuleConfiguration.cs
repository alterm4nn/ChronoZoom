using System;
using System.IdentityModel.Tokens;
using System.Web;
using System.Web.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Web;

namespace Thinktecture.IdentityModel.Web
{
    public class PassiveModuleConfiguration
    {
        public static void SuppressSecurityTokenExceptions(
                    string redirectPath = "~/",
                    Action<SecurityTokenException> logger = null)
        {
            HttpContext.Current.ApplicationInstance.Error +=
                delegate(object sender, EventArgs e)
                {
                    var ctx = HttpContext.Current;
                    var ex = ctx.Error;

                    SecurityTokenException ste = ex as SecurityTokenException;
                    if (ste != null)
                    {
                        var sam = FederatedAuthentication.SessionAuthenticationModule;
                        if (sam != null) sam.SignOut();

                        ctx.ClearError();

                        if (logger != null) logger(ste);

                        ctx.Response.Redirect(redirectPath);
                    }
                };
        }

        public static void CacheSessionsOnServer(bool checkForSessionSecurityTokenCache = true)
        {
            if (checkForSessionSecurityTokenCache)
            {
                var handler = FederatedAuthentication.ServiceConfiguration.SecurityTokenHandlers[typeof(SessionSecurityToken)] as SessionSecurityTokenHandler;
                if (handler == null) throw new Exception("SessionSecurityTokenHandler not registered.");
                if (!(handler.TokenCache is PassiveRepositorySessionSecurityTokenCache))
                {
                    throw new Exception("SessionSecurityTokenCache not configured.");
                }
            }

            SessionAuthenticationModule sam = FederatedAuthentication.SessionAuthenticationModule;
            if (sam == null) throw new ArgumentException("SessionAuthenticationModule is null");

            sam.IsSessionMode = true;
        }

        public static void EnableSlidingSessionExpirations()
        {
            SessionAuthenticationModule sam = FederatedAuthentication.SessionAuthenticationModule;
            if (sam == null) throw new ArgumentException("SessionAuthenticationModule is null");

            sam.SessionSecurityTokenReceived +=
                delegate(object sender, SessionSecurityTokenReceivedEventArgs e)
                {
                    var token = e.SessionToken;

                    var duration = token.ValidTo.Subtract(token.ValidFrom);
                    if (duration <= TimeSpan.Zero) return;

                    var diff = token.ValidTo.Add(sam.ServiceConfiguration.MaxClockSkew).Subtract(DateTime.UtcNow);
                    if (diff <= TimeSpan.Zero) return;

                    var halfWay = duration.Add(sam.ServiceConfiguration.MaxClockSkew).TotalMinutes / 2;
                    var timeLeft = diff.TotalMinutes;
                    if (timeLeft <= halfWay)
                    {
                        // set duration not from original token, but from current app configuration
                        var handler = sam.ServiceConfiguration.SecurityTokenHandlers[typeof(SessionSecurityToken)] as SessionSecurityTokenHandler;
                        duration = handler.TokenLifetime;
                        
                        e.ReissueCookie = true;
                        e.SessionToken =
                            new SessionSecurityToken(
                                token.ClaimsPrincipal,
                                token.Context,
                                DateTime.UtcNow,
                                DateTime.UtcNow.Add(duration))
                            {
                                IsPersistent = token.IsPersistent,
                                IsSessionMode = token.IsSessionMode
                            };
                    }
                };
        }

        private static string WebApiControllerName = "System.Web.Http.WebHost.HttpControllerHandler";

        public static void SuppressLoginRedirectsForApiCalls()
        {
            var sam = FederatedAuthentication.WSFederationAuthenticationModule;
            if (sam != null)
            {
                sam.AuthorizationFailed +=
                    delegate(object sender, AuthorizationFailedEventArgs e)
                    {
                        var ctx = HttpContext.Current;
                        var req = new HttpRequestWrapper(ctx.Request);
                        var isApi = (req.IsAjaxRequest() ||
                                     ctx.Handler.GetType().FullName == WebApiControllerName);
                        e.RedirectToIdentityProvider = !isApi;
                    };
            }
        }

        public static void OverrideWSFedTokenLifetime()
        {
            var fam = FederatedAuthentication.WSFederationAuthenticationModule;
            if (fam == null)
            {
                throw new Exception("WSFederationAuthenticationModule not configured.");
            }

            fam.SessionSecurityTokenCreated +=
                delegate(object sender, SessionSecurityTokenCreatedEventArgs e)
                {
                    var handler = (SessionSecurityTokenHandler)FederatedAuthentication.ServiceConfiguration.SecurityTokenHandlers[typeof(SessionSecurityToken)];
                    var duration = handler.TokenLifetime;

                    var token = e.SessionToken;
                    e.SessionToken =
                        new SessionSecurityToken(
                            token.ClaimsPrincipal,
                            token.Context,
                            token.ValidFrom,
                            token.ValidFrom.Add(duration))
                        {
                            IsPersistent = token.IsPersistent,
                            IsSessionMode = token.IsSessionMode
                        };
                };
        }

        public static void EnablePersistentSessions()
        {
            var fam = FederatedAuthentication.WSFederationAuthenticationModule;
            if (fam == null)
            {
                throw new Exception("WSFederationAuthenticationModule not configured.");
            }
            fam.PersistentCookiesOnPassiveRedirects = true;

            var handler = (SessionSecurityTokenHandler)FederatedAuthentication.ServiceConfiguration.SecurityTokenHandlers[typeof(SessionSecurityToken)];
            var skew = FederatedAuthentication.ServiceConfiguration.MaxClockSkew;
            var duration = handler.TokenLifetime + skew;

            var sam = FederatedAuthentication.SessionAuthenticationModule;
            sam.CookieHandler.PersistentSessionLifetime = duration;
        }
    }
}
