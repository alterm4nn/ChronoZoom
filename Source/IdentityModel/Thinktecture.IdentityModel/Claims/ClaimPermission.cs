/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Security;
using System.Security.Permissions;
using System.Security.Policy;
using System.Text;
using System.Threading;
using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Web;

namespace Thinktecture.IdentityModel.Claims
{
    /// <summary>
    /// Encapsulates calls to ClaimsAuthorizationManager with custom claim types in a CLR permission
    /// </summary>
    [Serializable]
    public sealed class ClaimPermission : IPermission, ISecurityEncodable, IUnrestrictedPermission
    {
        /// <summary>
        /// Default action claim type.
        /// </summary>
        public const string ActionType = "http://application/claims/authorization/action";
        
        /// <summary>
        /// Default resource claim type
        /// </summary>
        public const string ResourceType = "http://application/claims/authorization/resource";

        private List<ResourceAction> _resourceActions;

        private ClaimPermission(IEnumerable<ResourceAction> resourceActions)
        {
            this._resourceActions = new List<ResourceAction>();

            foreach (ResourceAction action in resourceActions)
            {
                this._resourceActions.Add(new ResourceAction(action.ResourceType, action.Resource, action.ActionType, action.Action));
            }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ClaimPermission"/> class.
        /// </summary>
        /// <param name="resource">The resource.</param>
        /// <param name="action">The action.</param>
        public ClaimPermission(string resource, string action)
            : this(ResourceType, resource, ActionType, action)
        { }

        /// <summary>
        /// Initializes a new instance of the <see cref="ClaimPermission"/> class.
        /// </summary>
        /// <param name="resourceType">Type of the resource.</param>
        /// <param name="resource">The resource.</param>
        /// <param name="actionType">Type of the action.</param>
        /// <param name="action">The action.</param>
        public ClaimPermission(string resourceType, string resource, string actionType, string action)
        {
            this._resourceActions = new List<ResourceAction>();
            this._resourceActions.Add(new ResourceAction(resourceType, resource, actionType, action));
        }

        /// <summary>
        /// Creates and returns an identical copy of the current permission.
        /// </summary>
        /// <returns>
        /// A copy of the current permission.
        /// </returns>
        public IPermission Copy()
        {
            return new ClaimPermission(_resourceActions);
        }

        /// <summary>
        /// Throws a <see cref="T:System.Security.SecurityException"/> at run time if the security requirement is not met.
        /// </summary>
        public void Demand()
        {
            var claimsAuthorizationManager = FederatedAuthentication.ServiceConfiguration.ClaimsAuthorizationManager;

            var currentPrincipal = Thread.CurrentPrincipal as ClaimsPrincipal;

            foreach (var resourceAction in _resourceActions)
            {
                var context = CreateAuthorizationContext(currentPrincipal, resourceAction);

                if (!claimsAuthorizationManager.CheckAccess(context))
                {
                    ThrowSecurityException();
                }
            }
        }

        /// <summary>
        /// Calls ClaimsAuthorizationManager.
        /// </summary>
        /// <param name="action">The action.</param>
        /// <param name="resource">The resource.</param>
        /// <param name="additionalResources">Additional resources.</param>
        /// <returns>True when access is granted. Otherwise false.</returns>
        public static bool CheckAccess(string action, string resource, params Claim[] additionalResources)
        {
            var resourceAction = new ResourceAction(
                ResourceType,
                resource,
                ActionType,
                action);

            var context = CreateAuthorizationContext(Thread.CurrentPrincipal as ClaimsPrincipal, resourceAction);
            additionalResources.ToList().ForEach(claim => context.Resource.Add(claim));

            var claimsAuthorizationManager = FederatedAuthentication.ServiceConfiguration.ClaimsAuthorizationManager;
            return claimsAuthorizationManager.CheckAccess(context);
        }

        private static AuthorizationContext CreateAuthorizationContext(ClaimsPrincipal currentPrincipal, ResourceAction resourceAction)
        {
            var resourceClaim = new Claim(resourceAction.ResourceType, resourceAction.Resource);
            var actionClaim = new Claim(resourceAction.ActionType, resourceAction.Action);
            
            return new AuthorizationContext(
                currentPrincipal, 
                new Collection<Claim> { resourceClaim }, 
                new Collection<Claim> { actionClaim });
        }

        #region CLR Permission Implementation
        /// <summary>
        /// Reconstructs a security object with a specified state from an XML encoding.
        /// </summary>
        /// <param name="e">The XML encoding to use to reconstruct the security object.</param>
        public void FromXml(SecurityElement e)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Creates and returns a permission that is the intersection of the current permission and the specified permission.
        /// </summary>
        /// <param name="target">A permission to intersect with the current permission. It must be of the same type as the current permission.</param>
        /// <returns>
        /// A new permission that represents the intersection of the current permission and the specified permission. This new permission is null if the intersection is empty.
        /// </returns>
        /// <exception cref="T:System.ArgumentException">The <paramref name="target"/> parameter is not null and is not an instance of the same class as the current permission. </exception>
        public IPermission Intersect(IPermission target)
        {
            if (target == null)
            {
                return null;
            }

            var permission = target as ClaimPermission;
            if (permission == null)
            {
                return null;
            }

            var resourceActions = new List<ResourceAction>();
            foreach (ResourceAction action in permission._resourceActions)
            {
                if (this._resourceActions.Contains(action))
                {
                    resourceActions.Add(action);
                }
            }

            return new ClaimPermission(resourceActions);
        }

        /// <summary>
        /// Determines whether the current permission is a subset of the specified permission.
        /// </summary>
        /// <param name="target">A permission that is to be tested for the subset relationship. This permission must be of the same type as the current permission.</param>
        /// <returns>
        /// true if the current permission is a subset of the specified permission; otherwise, false.
        /// </returns>
        /// <exception cref="T:System.ArgumentException">The <paramref name="target"/> parameter is not null and is not of the same type as the current permission. </exception>
        public bool IsSubsetOf(IPermission target)
        {
            if (target == null)
            {
                return false;
            }
            
            var permission = target as ClaimPermission;
            if (permission == null)
            {
                return false;
            }
            
            foreach (ResourceAction action in this._resourceActions)
            {
                if (!permission._resourceActions.Contains(action))
                {
                    return false;
                }
            }
            return true;
        }

        /// <summary>
        /// Returns a value indicating whether unrestricted access to the resource protected by the permission is allowed.
        /// </summary>
        /// <returns>
        /// true if unrestricted use of the resource protected by the permission is allowed; otherwise, false.
        /// </returns>
        public bool IsUnrestricted()
        {
            return true;
        }

        private void ThrowSecurityException()
        {
            AssemblyName assemblyName = null;
            Evidence evidence = null;
            new PermissionSet(PermissionState.Unrestricted).Assert();
            
            try
            {
                Assembly callingAssembly = Assembly.GetCallingAssembly();
                assemblyName = callingAssembly.GetName();
                if (callingAssembly != Assembly.GetExecutingAssembly())
                {
                    evidence = callingAssembly.Evidence;
                }
            }
            catch
            {
            }
         
            PermissionSet.RevertAssert();
            throw new SecurityException("Access Denied", assemblyName, null, null, null, SecurityAction.Demand, this, this, evidence);
        }

        /// <summary>
        /// Creates an XML encoding of the security object and its current state.
        /// </summary>
        /// <returns>
        /// An XML encoding of the security object, including any state information.
        /// </returns>
        public SecurityElement ToXml()
        {
            SecurityElement element = new SecurityElement("IPermission");
            Type type = base.GetType();
            StringBuilder builder = new StringBuilder(type.Assembly.ToString());
            builder.Replace('"', '\'');
            element.AddAttribute("class", type.FullName + ", " + builder);
            element.AddAttribute("version", "1");
            foreach (ResourceAction action in this._resourceActions)
            {
                SecurityElement child = new SecurityElement("ResourceAction");
                child.AddAttribute("resource", action.Resource);
                child.AddAttribute("action", action.Action);
                element.AddChild(child);
            }
            return element;
        }

        /// <summary>
        /// Creates a permission that is the union of the current permission and the specified permission.
        /// </summary>
        /// <param name="target">A permission to combine with the current permission. It must be of the same type as the current permission.</param>
        /// <returns>
        /// A new permission that represents the union of the current permission and the specified permission.
        /// </returns>
        /// <exception cref="T:System.ArgumentException">The <paramref name="target"/> parameter is not null and is not of the same type as the current permission. </exception>
        public IPermission Union(IPermission target)
        {
            if (target == null)
            {
                return null;
            }

            var permission = target as ClaimPermission;
            if (permission == null)
            {
                return null;
            }

            var resourceActions = new List<ResourceAction>();
            resourceActions.AddRange(permission._resourceActions);
            
            foreach (ResourceAction action in this._resourceActions)
            {
                if (!resourceActions.Contains(action))
                {
                    resourceActions.Add(action);
                }
            }
            
            return new ClaimPermission(resourceActions);
        }

        private class ResourceAction
        {
            public string Action;
            public string ActionType;

            public string Resource;
            public string ResourceType;

            public ResourceAction(string resourceType, string resource, string actionType, string action)
            {
                if (string.IsNullOrEmpty(resourceType))
                {
                    throw new ArgumentNullException("resourceType");
                }

                if (string.IsNullOrEmpty(resource))
                {
                    throw new ArgumentNullException("resource");
                }

                if (string.IsNullOrEmpty(actionType))
                {
                    throw new ArgumentNullException("actionType");
                }

                if (string.IsNullOrEmpty(action))
                {
                    throw new ArgumentNullException("action");
                }

                ResourceType = resourceType;
                Resource = resource;
                ActionType = actionType;
                Action = action;
            }

            public override bool Equals(object obj)
            {
                var other = obj as ClaimPermission.ResourceAction;
     
                if (other == null)
                {
                    return base.Equals(obj);
                }

                return ((string.CompareOrdinal(other.ResourceType, this.ResourceType) == 0) &&
                        (string.CompareOrdinal(other.Resource, this.Resource) == 0) &&
                        (string.CompareOrdinal(other.ActionType, this.ActionType) == 0) &&
                        (string.CompareOrdinal(other.Action, this.Action) == 0));
            }

            public override int GetHashCode()
            {
                return (ResourceType.GetHashCode() ^ 
                        Resource.GetHashCode() ^ 
                        ActionType.GetHashCode() ^
                        Action.GetHashCode());
            }
        }
    }   
    #endregion
}