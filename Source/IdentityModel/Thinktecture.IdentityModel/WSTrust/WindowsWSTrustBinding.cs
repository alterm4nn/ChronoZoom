/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Net;
using System.ServiceModel;
using System.ServiceModel.Channels;

namespace Thinktecture.IdentityModel.WSTrust
{
    public class WindowsWSTrustBinding : WSTrustBinding
    {
        // Methods
        public WindowsWSTrustBinding()
            : this(SecurityMode.Message)
        { }

        public WindowsWSTrustBinding(SecurityMode securityMode)
            : base(securityMode)
        { }

        protected override void ApplyTransportSecurity(HttpTransportBindingElement transport)
        {
            transport.AuthenticationScheme = AuthenticationSchemes.Negotiate;
        }

        protected override SecurityBindingElement CreateSecurityBindingElement()
        {
            if (SecurityMode.Message == base.SecurityMode)
            {
                return SecurityBindingElement.CreateSspiNegotiationBindingElement(true);
            }
          
            if (SecurityMode.TransportWithMessageCredential == base.SecurityMode)
            {
                return SecurityBindingElement.CreateSspiNegotiationOverTransportBindingElement(true);
            }
            
            return null;
        }
    }
}