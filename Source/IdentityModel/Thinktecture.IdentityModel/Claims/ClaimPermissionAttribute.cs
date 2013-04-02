/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Security;
using System.Security.Permissions;

namespace Thinktecture.IdentityModel.Claims
{
    /// <summary>
    /// Permission Attribute for calling ClaimsAuthorizationManager with custom claim types
    /// </summary>
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
    public class ClaimPermissionAttribute : CodeAccessSecurityAttribute
    {
        /// <summary>
        /// Gets or sets the claim type of the resource.
        /// </summary>
        /// <value>
        /// The claim type of the resource.
        /// </value>
        public string ResourceType { get; set; }

        /// <summary>
        /// Gets or sets the resource name.
        /// </summary>
        /// <value>
        /// The resource name.
        /// </value>
        public string Resource { get; set; }

        /// <summary>
        /// Gets or sets the claim type of the operation.
        /// </summary>
        /// <value>
        /// The claim type of the operation.
        /// </value>
        public string OperationType { get; set; }

        /// <summary>
        /// Gets or sets the operation name .
        /// </summary>
        /// <value>
        /// The operation name.
        /// </value>
        public string Operation { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ClaimPermissionAttribute"/> class.
        /// </summary>
        /// <param name="action">One of the <see cref="T:System.Security.Permissions.SecurityAction"/> values.</param>
        public ClaimPermissionAttribute(SecurityAction action)
            : base(action)
        {
            ResourceType = ClaimPermission.ResourceType;
            OperationType = ClaimPermission.ActionType;
        }

        /// <summary>
        /// When overridden in a derived class, creates a permission object that can then be serialized into binary form and persistently stored along with the <see cref="T:System.Security.Permissions.SecurityAction"/> in an assembly's metadata.
        /// </summary>
        /// <returns>
        /// A serializable permission object.
        /// </returns>
        public override IPermission CreatePermission()
        {
            return new ClaimPermission(ResourceType, Resource, OperationType, Operation);
        }
    }
}