/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System;
using System.IdentityModel.Tokens;
using System.Linq;
using Microsoft.IdentityModel.Tokens;

namespace Thinktecture.IdentityModel.Tokens.Http
{
    public class ClientCertificateIssuerNameRegistry : IssuerNameRegistry
    {
        string[] _values;
        bool _checkIssuer;
        ClientCertificateMode _mode;

        public ClientCertificateIssuerNameRegistry(bool checkIssuer, ClientCertificateMode mode, params string[] values)
        {
            _checkIssuer = checkIssuer;
            _mode = mode;
            _values = values;
        }

        public override string GetIssuerName(SecurityToken securityToken)
        {
            var token = securityToken as X509SecurityToken;
            if (token == null)
            {
                throw new ArgumentException("securityToken");
            }

            var cert = token.Certificate;
            string hit = null;

            // no check
            if (!_checkIssuer)
            {
                return cert.Subject;
            }

            // check for subject name
            if (_mode == ClientCertificateMode.ChainValidationWithIssuerSubjectName)
            {
                hit = _values.FirstOrDefault(s => s.Equals(cert.Subject, StringComparison.OrdinalIgnoreCase));
            }

            // check for subject name
            if (_mode == ClientCertificateMode.ChainValidationWithIssuerThumbprint ||
                _mode == ClientCertificateMode.IssuerThumbprint)
            {
                hit = _values.FirstOrDefault(s => s.Equals(cert.Thumbprint, StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrWhiteSpace(hit))
            {
                return cert.Subject;
            }

            return null;
        }
    }
}
