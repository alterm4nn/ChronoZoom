/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.ObjectModel;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Threading;
using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Web;

namespace Thinktecture.IdentityModel.Authorization
{
    /// <summary>
    /// Provides direct access methods for evaluating authorization policy
    /// </summary>
    public static class ClaimsAuthorization
    {
        /// <summary>
        /// Default action claim type.
        /// </summary>
        public const string ActionType = "http://application/claims/authorization/action";

        /// <summary>
        /// Default resource claim type
        /// </summary>
        public const string ResourceType = "http://application/claims/authorization/resource";

        public static bool EnforceAuthorizationManagerImplementation { get; set; }

        /// <summary>
        /// Gets the registered authorization manager.
        /// </summary>
        public static ClaimsAuthorizationManager AuthorizationManager
        {
            get
            {
                return FederatedAuthentication.ServiceConfiguration.ClaimsAuthorizationManager;
            }
        }

        static ClaimsAuthorization()
        {
            EnforceAuthorizationManagerImplementation = true;
        }

        /// <summary>
        /// Checks the authorization policy.
        /// </summary>
        /// <param name="resource">The resource.</param>
        /// <param name="action">The action.</param>
        /// <returns>true when authorized, otherwise false</returns>
        public static bool CheckAccess(string action, params string[] resources)
        {
            Contract.Requires(!String.IsNullOrEmpty(action));


            return CheckAccess(Thread.CurrentPrincipal as ClaimsPrincipal, action, resources);
        }

        public static bool CheckAccess(ClaimsPrincipal principal, string action, params string[] resources)
        {
            var context = CreateAuthorizationContext(
                principal,
                action,
                resources);

            return CheckAccess(context);
        }

        /// <summary>
        /// Checks the authorization policy.
        /// </summary>
        /// <param name="actions">The actions.</param>
        /// <param name="resources">The resources.</param>
        /// <returns>true when authorized, otherwise false</returns>
        public static bool CheckAccess(Collection<Claim> actions, Collection<Claim> resources)
        {
            Contract.Requires(actions != null);
            Contract.Requires(resources != null);


            return CheckAccess(new AuthorizationContext(
                Thread.CurrentPrincipal as ClaimsPrincipal, resources, actions));
        }

        /// <summary>
        /// Checks the authorization policy.
        /// </summary>
        /// <param name="context">The authorization context.</param>
        /// <returns>true when authorized, otherwise false</returns>
        public static bool CheckAccess(AuthorizationContext context)
        {
            Contract.Requires(context != null);


            if (EnforceAuthorizationManagerImplementation)
            {
                var authZtype = AuthorizationManager.GetType().FullName;
                if (authZtype.Equals("System.Security.Claims.ClaimsAuthorizationManager"))
                {
                    throw new InvalidOperationException("No ClaimsAuthorizationManager implementation configured.");
                }
            }

            return AuthorizationManager.CheckAccess(context);
        }

        public static AuthorizationContext CreateAuthorizationContext(ClaimsPrincipal principal, string action, params string[] resources)
        {
            var actionClaims = new Collection<Claim>
            {
                new Claim(ActionType, action)
            };

            var resourceClaims = new Collection<Claim>();

            if (resources != null && resources.Length > 0)
            {
                resources.ToList().ForEach(ar => resourceClaims.Add(new Claim(ResourceType, ar)));
            }

            return new AuthorizationContext(
                principal,
                resourceClaims,
                actionClaims);
        }
    }
}
