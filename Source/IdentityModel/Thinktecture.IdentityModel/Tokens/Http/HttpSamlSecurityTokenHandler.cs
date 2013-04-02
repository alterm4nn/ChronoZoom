/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.IdentityModel.Tokens;
using System.IO;
using System.Xml;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Tokens.Saml11;
using Thinktecture.IdentityModel.Constants;

namespace Thinktecture.IdentityModel.Tokens.Http
{
    class HttpSamlSecurityTokenHandler : Saml11SecurityTokenHandler, IHttpSecurityTokenHandler
    {
        private string[] _identifier = new string[] 
            { 
                "Saml",
                TokenTypes.OasisWssSaml11TokenProfile11,
                TokenTypes.Saml11TokenProfile11
            };


        public HttpSamlSecurityTokenHandler()
            : base()
        { }

        public HttpSamlSecurityTokenHandler(string identifier)
            : base()
        {
            _identifier = new string[] { identifier };
        }

        public HttpSamlSecurityTokenHandler(SamlSecurityTokenRequirement requirement)
            : base(requirement)
        { }

        public HttpSamlSecurityTokenHandler(SamlSecurityTokenRequirement requirement, string identifier)
            : base(requirement)
        {
            _identifier = new string[] { identifier };
        }

        public SecurityToken ReadToken(string tokenString)
        {
            return ContainingCollection.ReadToken(new XmlTextReader(new StringReader(tokenString)));
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
