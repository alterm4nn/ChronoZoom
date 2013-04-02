/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Net;
using System.ServiceModel;
using System.ServiceModel.Channels;

namespace Thinktecture.IdentityModel.WSTrust
{
    public class KerberosWSTrustBinding : WSTrustBinding
    {
        // Methods
        public KerberosWSTrustBinding()
            : this(SecurityMode.TransportWithMessageCredential)
        {
        }

        public KerberosWSTrustBinding(SecurityMode mode)
            : base(mode)
        {
        }

        protected override void ApplyTransportSecurity(HttpTransportBindingElement transport)
        {
            transport.AuthenticationScheme = AuthenticationSchemes.Negotiate;
        }

        protected override SecurityBindingElement CreateSecurityBindingElement()
        {
            if (SecurityMode.Message == base.SecurityMode)
            {
                return SecurityBindingElement.CreateKerberosBindingElement();
            }
            if (SecurityMode.TransportWithMessageCredential == base.SecurityMode)
            {
                return SecurityBindingElement.CreateKerberosOverTransportBindingElement();
            }
            return null;
        }
    }
}
