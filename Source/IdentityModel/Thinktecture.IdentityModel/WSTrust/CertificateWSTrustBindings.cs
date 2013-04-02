/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Net;
using System.ServiceModel;
using System.ServiceModel.Channels;

namespace Thinktecture.IdentityModel.WSTrust
{
    public class CertificateWSTrustBinding : WSTrustBinding
    {
        public CertificateWSTrustBinding()
            : this(SecurityMode.Message)
        { }

        public CertificateWSTrustBinding(SecurityMode securityMode)
            : base(securityMode)
        { }

        protected override void ApplyTransportSecurity(HttpTransportBindingElement transport)
        {
            transport.AuthenticationScheme = AuthenticationSchemes.Anonymous;
            
            var element = transport as HttpsTransportBindingElement;
            if (element != null)
            {
                element.RequireClientCertificate = true;
            }
        }

        protected override SecurityBindingElement CreateSecurityBindingElement()
        {
            if (SecurityMode.Message == base.SecurityMode)
            {
                return SecurityBindingElement.CreateMutualCertificateBindingElement();
            }
            if (SecurityMode.TransportWithMessageCredential == base.SecurityMode)
            {
                return SecurityBindingElement.CreateCertificateOverTransportBindingElement();
            }
            
            return null;
        }
    }
}
