/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.IdentityModel.Tokens;
using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Tokens;

namespace Thinktecture.IdentityModel.Tokens
{
    public class SimpleSecurityTokenHandler : SecurityTokenHandler, IHttpSecurityTokenHandler
    {
        private string[] _identifier;
        public delegate ClaimsPrincipal ValidateTokenDelegate(string tokenString);

        public ValidateTokenDelegate Validator { get; set; }

        public SimpleSecurityTokenHandler(string identifier)
            : this(identifier, null)
        { }

        public SimpleSecurityTokenHandler(ValidateTokenDelegate validator) 
            : this(Guid.NewGuid().ToString(), validator)
        { }

        public SimpleSecurityTokenHandler(string identifier, ValidateTokenDelegate validator)
        {
            _identifier = new string[] { identifier };
            Validator = validator;
        }

        public SecurityToken ReadToken(string tokenString)
        {
            return new SimpleSecurityToken(tokenString);
        }

        public override ClaimsIdentityCollection ValidateToken(SecurityToken token)
        {
            var simpleToken = token as SimpleSecurityToken;
            if (simpleToken == null)
            {
                throw new ArgumentException("SecurityToken is not a SimpleSecurityToken");
            }

            var identity = Validator(simpleToken.Value).Identity as ClaimsIdentity;

            if (identity != null)
            {
                if (Configuration != null && Configuration.SaveBootstrapTokens)
                {
                    identity.BootstrapToken = simpleToken;
                }

                return new ClaimsIdentityCollection(new ClaimsIdentity[] { identity });
            }
            else
            {
                throw new SecurityTokenValidationException("No identity");
            }
        }

        public string WriteToken(SecurityToken token)
        {
            var simpleToken = token as SimpleSecurityToken;
            if (simpleToken == null)
            {
                throw new ArgumentException("SecurityToken is not a SimpleSecurityToken");
            }

            return simpleToken.Value;
        }

        public override string[] GetTokenTypeIdentifiers()
        {
            return _identifier;
        }

        public override Type TokenType
        {
            get { return typeof(SimpleSecurityToken); }
        }

        public bool CanReadToken(string tokenString)
        {
            return true;
        }
    }
}
