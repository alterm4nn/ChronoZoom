/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IdentityModel.Tokens;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Security;
using System.ServiceModel.Security.Tokens;
using System.Xml;

namespace Thinktecture.IdentityModel.WSTrust
{
    public class IssuedTokenWSTrustBinding : WSTrustBinding
    {
        private SecurityAlgorithmSuite _algorithmSuite;
        private Collection<ClaimTypeRequirement> _claimTypeRequirements;
        private EndpointAddress _issuerAddress;
        private Binding _issuerBinding;
        private EndpointAddress _issuerMetadataAddress;
        private SecurityKeyType _keyType;
        private string _tokenType;

     
        public IssuedTokenWSTrustBinding()
            : this(null, null)
        { }

        public IssuedTokenWSTrustBinding(Binding issuerBinding, EndpointAddress issuerAddress)
            : this(issuerBinding, issuerAddress, SecurityMode.Message, TrustVersion.WSTrust13, null)
        { }

        public IssuedTokenWSTrustBinding(Binding issuerBinding, EndpointAddress issuerAddress, EndpointAddress issuerMetadataAddress)
            : this(issuerBinding, issuerAddress, SecurityMode.Message, TrustVersion.WSTrust13, issuerMetadataAddress)
        { }

        public IssuedTokenWSTrustBinding(Binding issuerBinding, EndpointAddress issuerAddress, string tokenType, IEnumerable<ClaimTypeRequirement> claimTypeRequirements)
            : this(issuerBinding, issuerAddress, SecurityKeyType.SymmetricKey, SecurityAlgorithmSuite.Basic256, tokenType, claimTypeRequirements)
        { }

        public IssuedTokenWSTrustBinding(Binding issuerBinding, EndpointAddress issuerAddress, SecurityMode mode, TrustVersion trustVersion, EndpointAddress issuerMetadataAddress)
            : this(issuerBinding, issuerAddress, mode, trustVersion, SecurityKeyType.SymmetricKey, SecurityAlgorithmSuite.Basic256, null, null, issuerMetadataAddress)
        { }

        public IssuedTokenWSTrustBinding(Binding issuerBinding, EndpointAddress issuerAddress, SecurityKeyType keyType, SecurityAlgorithmSuite algorithmSuite, string tokenType, IEnumerable<ClaimTypeRequirement> claimTypeRequirements)
            : this(issuerBinding, issuerAddress, SecurityMode.Message, TrustVersion.WSTrust13, keyType, algorithmSuite, tokenType, claimTypeRequirements, null)
        { }

        public IssuedTokenWSTrustBinding(Binding issuerBinding, EndpointAddress issuerAddress, SecurityMode mode, TrustVersion version, SecurityKeyType keyType, SecurityAlgorithmSuite algorithmSuite, string tokenType, IEnumerable<ClaimTypeRequirement> claimTypeRequirements, EndpointAddress issuerMetadataAddress)
            : base(mode, version)
        {
            this._claimTypeRequirements = new Collection<ClaimTypeRequirement>();
          
            if ((SecurityMode.Message != mode) && (SecurityMode.TransportWithMessageCredential != mode))
            {
                throw new InvalidOperationException("ID3226");
            }
            if ((this._keyType == SecurityKeyType.BearerKey) && (version == TrustVersion.WSTrustFeb2005))
            {
                throw new InvalidOperationException("ID3267");
            }
            
            this._keyType = keyType;
            this._algorithmSuite = algorithmSuite;
            this._tokenType = tokenType;
            this._issuerBinding = issuerBinding;
            this._issuerAddress = issuerAddress;
            this._issuerMetadataAddress = issuerMetadataAddress;
            
            if (claimTypeRequirements != null)
            {
                foreach (ClaimTypeRequirement requirement in claimTypeRequirements)
                {
                    this._claimTypeRequirements.Add(requirement);
                }
            }
        }

        private void AddAlgorithmParameters(SecurityAlgorithmSuite algorithmSuite, TrustVersion trustVersion, SecurityKeyType keyType, ref IssuedSecurityTokenParameters issuedParameters)
        {
            issuedParameters.AdditionalRequestParameters.Insert(0, this.CreateEncryptionAlgorithmElement(algorithmSuite.DefaultEncryptionAlgorithm));
            issuedParameters.AdditionalRequestParameters.Insert(0, this.CreateCanonicalizationAlgorithmElement(algorithmSuite.DefaultCanonicalizationAlgorithm));
            string signatureAlgorithm = null;
            string encryptionAlgorithm = null;
            
            switch (keyType)
            {
                case SecurityKeyType.SymmetricKey:
                    signatureAlgorithm = algorithmSuite.DefaultSymmetricSignatureAlgorithm;
                    encryptionAlgorithm = algorithmSuite.DefaultEncryptionAlgorithm;
                    break;

                case SecurityKeyType.AsymmetricKey:
                    signatureAlgorithm = algorithmSuite.DefaultAsymmetricSignatureAlgorithm;
                    encryptionAlgorithm = algorithmSuite.DefaultAsymmetricKeyWrapAlgorithm;
                    break;

                case SecurityKeyType.BearerKey:
                    return;

                default:
                    throw new ArgumentOutOfRangeException("keyType");
            }
            
            issuedParameters.AdditionalRequestParameters.Insert(0, this.CreateSignWithElement(signatureAlgorithm));
            issuedParameters.AdditionalRequestParameters.Insert(0, this.CreateEncryptWithElement(encryptionAlgorithm));
            
            if (trustVersion != TrustVersion.WSTrustFeb2005)
            {
                issuedParameters.AdditionalRequestParameters.Insert(0, CreateKeyWrapAlgorithmElement(algorithmSuite.DefaultAsymmetricKeyWrapAlgorithm));
            }
        }

        protected override void ApplyTransportSecurity(HttpTransportBindingElement transport)
        {
            throw new NotSupportedException();
        }

        private XmlElement CreateCanonicalizationAlgorithmElement(string canonicalizationAlgorithm)
        {
            if (canonicalizationAlgorithm == null)
            {
                throw new ArgumentNullException("canonicalizationAlgorithm");
            }
            
            var document = new XmlDocument();
            XmlElement element = null;
            
            if (base.TrustVersion == TrustVersion.WSTrust13)
            {
                element = document.CreateElement("trust", "CanonicalizationAlgorithm", "http://docs.oasis-open.org/ws-sx/ws-trust/200512");
            }
            else if (base.TrustVersion == TrustVersion.WSTrustFeb2005)
            {
                element = document.CreateElement("t", "CanonicalizationAlgorithm", "http://schemas.xmlsoap.org/ws/2005/02/trust");
            }

            if (element != null)
            {
                element.AppendChild(document.CreateTextNode(canonicalizationAlgorithm));
            }
            
            return element;
        }

        private XmlElement CreateEncryptionAlgorithmElement(string encryptionAlgorithm)
        {
            if (encryptionAlgorithm == null)
            {
                throw new ArgumentNullException("encryptionAlgorithm");
            }
            
            XmlDocument document = new XmlDocument();
            XmlElement element = null;
            
            if (base.TrustVersion == TrustVersion.WSTrust13)
            {
                element = document.CreateElement("trust", "EncryptionAlgorithm", "http://docs.oasis-open.org/ws-sx/ws-trust/200512");
            }
            else if (base.TrustVersion == TrustVersion.WSTrustFeb2005)
            {
                element = document.CreateElement("t", "EncryptionAlgorithm", "http://schemas.xmlsoap.org/ws/2005/02/trust");
            }
            
            if (element != null)
            {
                element.AppendChild(document.CreateTextNode(encryptionAlgorithm));
            }
            
            return element;
        }

        private XmlElement CreateEncryptWithElement(string encryptionAlgorithm)
        {
            if (encryptionAlgorithm == null)
            {
                throw new ArgumentNullException("encryptionAlgorithm");
            }
            
            XmlDocument document = new XmlDocument();
            XmlElement element = null;
            
            if (base.TrustVersion == TrustVersion.WSTrust13)
            {
                element = document.CreateElement("trust", "EncryptWith", "http://docs.oasis-open.org/ws-sx/ws-trust/200512");
            }
            else if (base.TrustVersion == TrustVersion.WSTrustFeb2005)
            {
                element = document.CreateElement("t", "EncryptWith", "http://schemas.xmlsoap.org/ws/2005/02/trust");
            }
            
            if (element != null)
            {
                element.AppendChild(document.CreateTextNode(encryptionAlgorithm));
            }
            
            return element;
        }

        private static XmlElement CreateKeyWrapAlgorithmElement(string keyWrapAlgorithm)
        {
            if (keyWrapAlgorithm == null)
            {
                throw new ArgumentNullException("keyWrapAlgorithm");
            }
            
            XmlDocument document = new XmlDocument();
            XmlElement element = document.CreateElement("trust", "KeyWrapAlgorithm", "http://docs.oasis-open.org/ws-sx/ws-trust/200512");
            element.AppendChild(document.CreateTextNode(keyWrapAlgorithm));
            
            return element;
        }

        protected override SecurityBindingElement CreateSecurityBindingElement()
        {
            SecurityBindingElement element;
            
            IssuedSecurityTokenParameters issuedParameters = new IssuedSecurityTokenParameters(this._tokenType, this._issuerAddress, this._issuerBinding)
            {
                KeyType = this._keyType,
                IssuerMetadataAddress = this._issuerMetadataAddress
            };
            
            if (this._keyType == SecurityKeyType.SymmetricKey)
            {
                issuedParameters.KeySize = this._algorithmSuite.DefaultSymmetricKeyLength;
            }
            else
            {
                issuedParameters.KeySize = 0;
            }
            
            if (this._claimTypeRequirements != null)
            {
                foreach (ClaimTypeRequirement requirement in this._claimTypeRequirements)
                {
                    issuedParameters.ClaimTypeRequirements.Add(requirement);
                }
            }
            
            this.AddAlgorithmParameters(this._algorithmSuite, base.TrustVersion, this._keyType, ref issuedParameters);
            if (SecurityMode.Message == base.SecurityMode)
            {
                element = SecurityBindingElement.CreateIssuedTokenForCertificateBindingElement(issuedParameters);
            }
            else
            {
                if (SecurityMode.TransportWithMessageCredential != base.SecurityMode)
                {
                    throw new InvalidOperationException("ID3226");
                }
                element = SecurityBindingElement.CreateIssuedTokenOverTransportBindingElement(issuedParameters);
            }
            
            element.DefaultAlgorithmSuite = this._algorithmSuite;
            element.IncludeTimestamp = true;
            
            return element;
        }

        private XmlElement CreateSignWithElement(string signatureAlgorithm)
        {
            if (signatureAlgorithm == null)
            {
                throw new ArgumentNullException("signatureAlgorithm");
            }
            
            XmlDocument document = new XmlDocument();
            XmlElement element = null;
            
            if (base.TrustVersion == TrustVersion.WSTrust13)
            {
                element = document.CreateElement("trust", "SignatureAlgorithm", "http://docs.oasis-open.org/ws-sx/ws-trust/200512");
            }
            else if (base.TrustVersion == TrustVersion.WSTrustFeb2005)
            {
                element = document.CreateElement("t", "SignatureAlgorithm", "http://schemas.xmlsoap.org/ws/2005/02/trust");
            }
            
            if (element != null)
            {
                element.AppendChild(document.CreateTextNode(signatureAlgorithm));
            }
            
            return element;
        }

        public SecurityAlgorithmSuite AlgorithmSuite
        {
            get
            {
                return this._algorithmSuite;
            }
            set
            {
                this._algorithmSuite = value;
            }
        }

        public Collection<ClaimTypeRequirement> ClaimTypeRequirement
        {
            get
            {
                return this._claimTypeRequirements;
            }
        }

        public EndpointAddress IssuerAddress
        {
            get
            {
                return this._issuerAddress;
            }
            set
            {
                this._issuerAddress = value;
            }
        }

        public Binding IssuerBinding
        {
            get
            {
                return this._issuerBinding;
            }
            set
            {
                this._issuerBinding = value;
            }
        }

        public EndpointAddress IssuerMetadataAddress
        {
            get
            {
                return this._issuerMetadataAddress;
            }
            set
            {
                this._issuerMetadataAddress = value;
            }
        }

        public SecurityKeyType KeyType
        {
            get
            {
                return this._keyType;
            }
            set
            {
                this._keyType = value;
            }
        }

        public string TokenType
        {
            get
            {
                return this._tokenType;
            }
            set
            {
                this._tokenType = value;
            }
        }
    }
}