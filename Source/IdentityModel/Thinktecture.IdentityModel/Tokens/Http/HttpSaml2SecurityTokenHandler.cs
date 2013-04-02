/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.IdentityModel.Tokens;
using System.IO;
using System.Xml;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Tokens.Saml2;
using Thinktecture.IdentityModel.Constants;

namespace Thinktecture.IdentityModel.Tokens.Http
{
    class HttpSaml2SecurityTokenHandler : Saml2SecurityTokenHandler, IHttpSecurityTokenHandler
    {
        private string[] _identifier = new string[] 
            { 
                "Saml2",
                TokenTypes.OasisWssSaml2TokenProfile11,
                TokenTypes.Saml2TokenProfile11
            };

        public HttpSaml2SecurityTokenHandler()
            : base()
        { }

        public HttpSaml2SecurityTokenHandler(string identifier)
            : base()
        {
            _identifier = new string[] { identifier };
        }

        public HttpSaml2SecurityTokenHandler(SamlSecurityTokenRequirement requirement, string identifier)
            : base(requirement)
        {
            _identifier = new string[] { identifier };
        }

        public SecurityToken ReadToken(string tokenString)
        {
            return ReadToken(new XmlTextReader(new StringReader(tokenString)));
        }

        public override string[] GetTokenTypeIdentifiers()
        {
            return _identifier;
        }

        public bool CanReadToken(string tokenString)
        {
            return base.CanReadToken(new XmlTextReader(new StringReader(tokenString)));
        }
    }
}
