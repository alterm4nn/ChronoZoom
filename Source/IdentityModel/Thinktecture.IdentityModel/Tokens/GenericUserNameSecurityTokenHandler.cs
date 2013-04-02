/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Tokens;
using Thinktecture.IdentityModel.Claims;

namespace Thinktecture.IdentityModel.Tokens
{
    /// <summary>
    /// Generic security token handler for username/password type credentials
    /// </summary>
    public class GenericUserNameSecurityTokenHandler : UserNameSecurityTokenHandler
    {
        /// <summary>
        /// Callback type for validating the credential
        /// </summary>
        /// <param name="username">The username.</param>
        /// <param name="password">The password.</param>
        /// <returns>True when the credential could be validated succesfully. Otherwise false.</returns>
        public delegate bool ValidateUserNameCredentialDelegate(string username, string password);

        /// <summary>
        /// Gets or sets the credential validation callback
        /// </summary>
        /// <value>
        /// The credential validation callback.
        /// </value>
        public ValidateUserNameCredentialDelegate ValidateUserNameCredential { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="GenericUserNameSecurityTokenHandler"/> class.
        /// </summary>
        public GenericUserNameSecurityTokenHandler()
        { }

        /// <summary>
        /// Initializes a new instance of the <see cref="GenericUserNameSecurityTokenHandler"/> class.
        /// </summary>
        /// <param name="validateUserNameCredential">The credential validation callback.</param>
        public GenericUserNameSecurityTokenHandler(ValidateUserNameCredentialDelegate validateUserNameCredential)
        {
            if (validateUserNameCredential == null)
            {
                throw new ArgumentNullException("ValidateUserNameCredential");
            }

            ValidateUserNameCredential = validateUserNameCredential;
        }

        /// <summary>
        /// Validates the user name credential core.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <param name="password">The password.</param>
        /// <returns></returns>
        protected virtual bool ValidateUserNameCredentialCore(string userName, string password)
        {
            if (ValidateUserNameCredential == null)
            {
                throw new InvalidOperationException("ValidateUserNameCredentialDelegate not set");
            }

            return ValidateUserNameCredential(userName, password);
        }

        /// <summary>
        /// Validates the username and password.
        /// </summary>
        /// <param name="token">The token.</param>
        /// <returns>A ClaimsIdentityCollection representing the identity in the token</returns>
        public override ClaimsIdentityCollection ValidateToken(SecurityToken token)
        {
            if (token == null)
            {
                throw new ArgumentNullException("token");
            }

            if (Configuration == null)
            {
                throw new InvalidOperationException("No Configuration set");
            }

            UserNameSecurityToken unToken = token as UserNameSecurityToken;
            if (unToken == null)
            {
                throw new ArgumentException("SecurityToken is not a UserNameSecurityToken");
            }

            if (!ValidateUserNameCredentialCore(unToken.UserName, unToken.Password))
            {
                throw new SecurityTokenValidationException(unToken.UserName);
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, unToken.UserName),
                new Claim(ClaimTypes.AuthenticationMethod, AuthenticationMethods.Password),
                AuthenticationInstantClaim.Now
            };

            var identity = new ClaimsIdentity(claims);

            if (Configuration.SaveBootstrapTokens)
            {
                if (RetainPassword)
                {
                    identity.BootstrapToken = unToken;
                }
                else
                {
                    identity.BootstrapToken = new UserNameSecurityToken(unToken.UserName, null);
                }
            }

            return new ClaimsIdentityCollection(new ClaimsIdentity[]{new ClaimsIdentity(claims, "Password") });
        }

        /// <summary>
        /// Gets a value indicating whether this instance can validate a token.
        /// </summary>
        /// <value>
        /// 	<c>true</c> if this instance can validate a token; otherwise, <c>false</c>.
        /// </value>
        public override bool CanValidateToken
        {
            get
            {
                return true;
            }
        }
    }
}
