/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IdentityModel.Policy;
using System.IdentityModel.Tokens;
using System.ServiceModel.Security.Tokens;
using System.Xml;
using System.Xml.Linq;
using Microsoft.IdentityModel.Protocols.WSTrust;
using Thinktecture.IdentityModel.WSTrust;

namespace Thinktecture.IdentityModel.Extensions
{
    /// <summary>
    /// Extension methods for RequestSecurityTokenResponse
    /// </summary>
    public static class RequestSecurityTokenResponseExtensions
    {
        /// <summary>
        /// Turns a RSTR into a GenericXmlSecurityToken.
        /// </summary>
        /// <param name="rstr">The RSTR.</param>
        /// <returns>A GenericXmlSecurityToken</returns>
        public static GenericXmlSecurityToken ToGenericXmlSecurityToken(this RequestSecurityTokenResponse rstr)
        {
            return rstr.ToGenericXmlSecurityToken((SecurityToken)null);
        }

        /// <summary>
        /// Turns a RST/RSTR pair into a GenericXmlSecurityToken.
        /// </summary>
        /// <param name="rstr">The RSTR.</param>
        /// <param name="rst">The RST.</param>
        /// <returns>A GenericXmlSecurityToken</returns>
        public static GenericXmlSecurityToken ToGenericXmlSecurityToken(this RequestSecurityTokenResponse rstr, RequestSecurityToken rst)
        {
            var proofKey = rstr.GetProofKey(rst);
            return rstr.ToGenericXmlSecurityToken(proofKey);
        }

        /// <summary>
        /// Turns a RST/ProofKey pair into a GenericXmlSecurityToken.
        /// </summary>
        /// <param name="rstr">The RSTR.</param>
        /// <param name="proofKey">The ProofKey.</param>
        /// <returns>A GenericXmlSecurityToken</returns>
        public static GenericXmlSecurityToken ToGenericXmlSecurityToken(this RequestSecurityTokenResponse rstr, SecurityToken proofKey)
        {
            DateTime? created = null;
            DateTime? expires = null;
            if (rstr.Lifetime != null)
            {
                created = rstr.Lifetime.Created;
                expires = rstr.Lifetime.Expires;
                if (!created.HasValue)
                {
                    created = new DateTime?(DateTime.UtcNow);
                }
                if (!expires.HasValue)
                {
                    expires = new DateTime?(DateTime.UtcNow.AddHours(10.0));
                }
            }
            else
            {
                created = new DateTime?(DateTime.UtcNow);
                expires = new DateTime?(DateTime.UtcNow.AddHours(10.0));
            }

            return new GenericXmlSecurityToken(
                ExtractTokenXml(rstr),
                proofKey,
                created.Value,
                expires.Value,
                rstr.RequestedAttachedReference,
                rstr.RequestedUnattachedReference,
                new ReadOnlyCollection<IAuthorizationPolicy>(new List<IAuthorizationPolicy>()));
        }

        /// <summary>
        /// Gets the proof key from an RST/RSTR pair.
        /// </summary>
        /// <param name="rstr">The RSTR.</param>
        /// <param name="rst">The RST.</param>
        /// <returns>The proof key.</returns>
        public static SecurityToken GetProofKey(this RequestSecurityTokenResponse rstr, RequestSecurityToken rst)
        {
            if (rstr.RequestedProofToken != null)
            {
                if (rstr.RequestedProofToken.ProtectedKey != null)
                {
                    return new BinarySecretSecurityToken(rstr.RequestedProofToken.ProtectedKey.GetKeyBytes());
                }
                if (!IsPsha1(rstr.RequestedProofToken.ComputedKeyAlgorithm))
                {
                    throw new NotSupportedException(rstr.RequestedProofToken.ComputedKeyAlgorithm);
                }

                return ComputeProofKey(rst, rstr);
            }

            switch (GetKeyType(rst.KeyType))
            {
                case ProofKeyType.Bearer:
                    return null;

                case ProofKeyType.Symmetric:
                    if (rstr.Entropy != null)
                    {
                        throw new NotSupportedException("RSTR entropy != null");
                    }
                    if (rst.Entropy != null)
                    {
                        return new BinarySecretSecurityToken(rst.Entropy.GetKeyBytes());
                    }
                    return null;

                case ProofKeyType.Asymmetric:
                    return GetUseKeySecurityToken(rst.UseKey, rst.KeyType);
            }

            throw new NotSupportedException("KeyType is not supported");
        }

        private static XmlElement ExtractTokenXml(RequestSecurityTokenResponse rstr)
        {
            if (rstr.RequestedSecurityToken.SecurityToken != null)
            {
                var xmlString = rstr.RequestedSecurityToken.SecurityToken.ToTokenXmlString();
                return XElement.Parse(xmlString).ToXmlElement();
            }
            if (rstr.RequestedSecurityToken.SecurityTokenXml != null)
            {
                return rstr.RequestedSecurityToken.SecurityTokenXml;
            }

            return null;
        }

        internal static bool IsPsha1(string algorithm)
        {
            if (!(algorithm == "http://docs.oasis-open.org/ws-sx/ws-trust/200512/CK/PSHA1") && !(algorithm == "http://schemas.xmlsoap.org/ws/2005/02/trust/CK/PSHA1"))
            {
                return (algorithm == "http://schemas.microsoft.com/idfx/computedkeyalgorithm/psha1");
            }

            return true;
        }

        internal static SecurityToken ComputeProofKey(RequestSecurityToken rst, RequestSecurityTokenResponse rstr)
        {
            if (rstr.Entropy == null)
            {
                throw new NotSupportedException("RSTR entropy is null");
            }
            if (rst.Entropy == null)
            {
                throw new NotSupportedException("RST entropy is null");
            }

            int? keySizeInBits = rst.KeySizeInBits;
            int num = keySizeInBits.HasValue ? keySizeInBits.GetValueOrDefault() : 0x400;
            if (rstr.KeySizeInBits.HasValue)
            {
                num = rstr.KeySizeInBits.Value;
            }

            return new BinarySecretSecurityToken(
                KeyGenerator.ComputeCombinedKey(
                    rst.Entropy.GetKeyBytes(),
                    rstr.Entropy.GetKeyBytes(),
                    num));
        }

        internal static ProofKeyType GetKeyType(string keyType)
        {
            if (((keyType == "http://docs.oasis-open.org/ws-sx/ws-trust/200512/SymmetricKey") || (keyType == "http://schemas.xmlsoap.org/ws/2005/02/trust/SymmetricKey")) || ((keyType == "http://schemas.microsoft.com/idfx/keytype/symmetric") || string.IsNullOrEmpty(keyType)))
            {
                return ProofKeyType.Symmetric;
            }
            if (((keyType == "http://docs.oasis-open.org/ws-sx/ws-trust/200512/PublicKey") || (keyType == "http://schemas.xmlsoap.org/ws/2005/02/trust/PublicKey")) || (keyType == "http://schemas.microsoft.com/idfx/keytype/asymmetric"))
            {
                return ProofKeyType.Asymmetric;
            }
            if ((!(keyType == "http://docs.oasis-open.org/ws-sx/ws-trust/200512/Bearer") && !(keyType == "http://schemas.xmlsoap.org/ws/2005/05/identity/NoProofKey")) && !(keyType == "http://schemas.microsoft.com/idfx/keytype/bearer"))
            {
                return ProofKeyType.Unknown;
            }
            return ProofKeyType.Bearer;
        }

        internal static SecurityToken GetUseKeySecurityToken(UseKey useKey, string requestKeyType)
        {
            if ((useKey == null) || (useKey.Token == null))
            {
                throw new NotSupportedException("UseKey is null");
            }

            return useKey.Token;
        }

        internal enum ProofKeyType
        {
            Unknown,
            Bearer,
            Symmetric,
            Asymmetric
        }
    }
}
