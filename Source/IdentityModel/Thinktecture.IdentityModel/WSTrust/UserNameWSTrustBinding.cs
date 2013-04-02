/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Channels;

namespace Thinktecture.IdentityModel.WSTrust
{
    public class UserNameWSTrustBinding : WSTrustBinding
    {
        // Fields
        private HttpClientCredentialType _clientCredentialType;

        // Methods
        public UserNameWSTrustBinding()
            : this(SecurityMode.Message, HttpClientCredentialType.None)
        { }

        public UserNameWSTrustBinding(SecurityMode securityMode)
            : base(securityMode)
        {
            if (SecurityMode.Message == securityMode)
            {
                this._clientCredentialType = HttpClientCredentialType.None;
            }
        }

        public UserNameWSTrustBinding(SecurityMode mode, HttpClientCredentialType clientCredentialType)
            : base(mode)
        {
            if (!IsHttpClientCredentialTypeDefined(clientCredentialType))
            {
                throw new ArgumentOutOfRangeException("clientCredentialType");
            }
            
            if (((SecurityMode.Transport == mode) && (HttpClientCredentialType.Digest != clientCredentialType)) && (HttpClientCredentialType.Basic != clientCredentialType))
            {
                throw new InvalidOperationException("ID3225");
            }
            
            this._clientCredentialType = clientCredentialType;
        }

        protected override void ApplyTransportSecurity(HttpTransportBindingElement transport)
        {
            if (this._clientCredentialType == HttpClientCredentialType.Basic)
            {
                transport.AuthenticationScheme = AuthenticationSchemes.Basic;
            }
            else
            {
                transport.AuthenticationScheme = AuthenticationSchemes.Digest;
            }
        }

        protected override SecurityBindingElement CreateSecurityBindingElement()
        {
            if (SecurityMode.Message == base.SecurityMode)
            {
                return SecurityBindingElement.CreateUserNameForCertificateBindingElement();
            }
            
            if (SecurityMode.TransportWithMessageCredential == base.SecurityMode)
            {
                return SecurityBindingElement.CreateUserNameOverTransportBindingElement();
            }
            
            return null;
        }

        private static bool IsHttpClientCredentialTypeDefined(HttpClientCredentialType value)
        {
            if ((((value != HttpClientCredentialType.None) && (value != HttpClientCredentialType.Basic)) && ((value != HttpClientCredentialType.Digest) && (value != HttpClientCredentialType.Ntlm))) && (value != HttpClientCredentialType.Windows))
            {
                return (value == HttpClientCredentialType.Certificate);
            }
            
            return true;
        }

        // Properties
        public HttpClientCredentialType ClientCredentialType
        {
            get
            {
                return this._clientCredentialType;
            }
            set
            {
                if (!IsHttpClientCredentialTypeDefined(value))
                {
                    throw new ArgumentOutOfRangeException("value");
                }
                if (((SecurityMode.Transport == base.SecurityMode) && (HttpClientCredentialType.Digest != value)) && (HttpClientCredentialType.Basic != value))
                {
                    throw new InvalidOperationException("ID3225");
                }
                this._clientCredentialType = value;
            }
        }
    }
}
