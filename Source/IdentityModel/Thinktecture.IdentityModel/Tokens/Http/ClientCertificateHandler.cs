/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System;
using System.IdentityModel.Selectors;
using Microsoft.IdentityModel.Tokens;

namespace Thinktecture.IdentityModel.Tokens.Http
{
    public class ClientCertificateHandler : X509SecurityTokenHandler
    {
        public ClientCertificateHandler(ClientCertificateMode mode, params string[] values)
        {
            X509CertificateValidator validator;
            ClientCertificateIssuerNameRegistry registry;

            // set validator and registry
            if (mode == ClientCertificateMode.ChainValidation)
            {
                validator = X509CertificateValidator.ChainTrust;
                registry = new ClientCertificateIssuerNameRegistry(false, mode);
            }
            if (mode == ClientCertificateMode.ChainValidationWithIssuerSubjectName ||
                mode == ClientCertificateMode.ChainValidationWithIssuerThumbprint)
            {
                validator = X509CertificateValidator.ChainTrust;
                registry = new ClientCertificateIssuerNameRegistry(true, mode, values);
            }
            else if (mode == ClientCertificateMode.PeerValidation)
            {
                validator = X509CertificateValidator.PeerTrust;
                registry = new ClientCertificateIssuerNameRegistry(false, mode);
            }
            else if (mode == ClientCertificateMode.IssuerThumbprint)
            {
                validator = X509CertificateValidator.None;
                registry = new ClientCertificateIssuerNameRegistry(true, mode, values);
            }
            else
            {
                throw new ArgumentException("mode");
            }

            Configuration = new SecurityTokenHandlerConfiguration
            {
                //CertificateValidationMode = X509CertificateValidationMode.Custom,
                CertificateValidator = validator,
                IssuerNameRegistry = registry
            };
        }
    }
}
