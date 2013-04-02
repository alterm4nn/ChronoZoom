/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.ObjectModel;
using System.Diagnostics.Contracts;
using System.Security;
using System.Threading;
using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Web;

namespace Thinktecture.IdentityModel.Claims
{
    /// <summary>
    /// Provides direct access methods for evaluating authorization policy
    /// </summary>
    public static class ClaimsAuthorization
    {
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

        /// <summary>
        /// Checks the authorization policy.
        /// </summary>
        /// <param name="resource">The resource.</param>
        /// <param name="action">The action.</param>
        /// <returns>true when authorized, otherwise false</returns>
        public static bool CheckAccess(string resource, string action)
        {
            Contract.Requires(!String.IsNullOrEmpty(resource));
            Contract.Requires(!String.IsNullOrEmpty(action));


            return CheckAccess(resource, action, Thread.CurrentPrincipal as ClaimsPrincipal);
        }

        /// <summary>
        /// Checks the authorization policy.
        /// </summary>
        /// <param name="resource">The resource.</param>
        /// <param name="action">The action.</param>
        /// <param name="principal">The principal.</param>
        /// <returns>true when authorized, otherwise false</returns>
        public static bool CheckAccess(string resource, string action, ClaimsPrincipal principal)
        {
            Contract.Requires(!String.IsNullOrEmpty(resource));
            Contract.Requires(!String.IsNullOrEmpty(action));
            Contract.Requires(principal != null);


            var context = new AuthorizationContext(principal, resource, action);

            return AuthorizationManager.CheckAccess(context);
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


            return AuthorizationManager.CheckAccess(context);
        }

        /// <summary>
        /// Checks the authorization policy. Will throw a SecurityException when check fails.
        /// </summary>
        /// <param name="resource">The resource.</param>
        /// <param name="action">The action.</param>
        public static void DemandAccess(string resource, string action)
        {
            Contract.Requires(!String.IsNullOrEmpty(resource));
            Contract.Requires(!String.IsNullOrEmpty(action));


            if (!CheckAccess(resource, action))
            {
                throw new SecurityException(string.Format("Demand for action: {0} for resource {1} failed", action, resource));
            }
        }

        /// <summary>
        /// Checks the authorization policy. Will throw a SecurityException when check fails.
        /// </summary>
        /// <param name="resource">The resource.</param>
        /// <param name="action">The action.</param>
        /// <param name="principal">The principal.</param>
        public static void DemandAccess(string resource, string action, ClaimsPrincipal principal)
        {
            Contract.Requires(!String.IsNullOrEmpty(resource));
            Contract.Requires(!String.IsNullOrEmpty(action));
            Contract.Requires(principal != null);

            
            if (!CheckAccess(resource, action, principal))
            {
                throw new SecurityException(string.Format("Demand for action: {0} for resource {1} failed", action, resource));
            }
        }

        /// <summary>
        /// Checks the authorization policy. Will throw a SecurityException when check fails.
        /// </summary>
        /// <param name="resources">The resources.</param>
        /// <param name="actions">The actions.</param>
        public static void DemandAccess(Collection<Claim> actions, Collection<Claim> resources)
        {
            Contract.Requires(resources != null);
            Contract.Requires(actions != null);


            if (!CheckAccess(resources, actions))
            {
                throw new SecurityException("Demand for actions on resources failed");
            }
        }

        /// <summary>
        /// Checks the authorization policy. Will throw a SecurityException when check fails.
        /// </summary>
        /// <param name="context">The context.</param>
        public static void DemandAccess(AuthorizationContext context)
        {
            Contract.Requires(context != null);


            if (!CheckAccess(context))
            {
                throw new SecurityException("Demand for claims authorization failed");
            }
        }
    }
}
