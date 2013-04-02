/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Claims;

namespace Thinktecture.IdentityModel.Tokens
{
    /// <summary>
    /// This class represents the token format for the SimpleWebToken.
    /// </summary>
    public class SimpleWebToken : SecurityToken
    {
        string _id;
        Uri _audienceUri;
        List<Claim> _claims;
        string _issuer;
        DateTime _expiresOn;
        string _signature;
        DateTime _validFrom;
        InMemorySymmetricSecurityKey _signingKey;
        string _unsignedString;

        public SimpleWebToken(Uri audienceUri, string issuer, DateTime expiresOn, List<Claim> claims, string signature, string unsignedString)
        {
            _audienceUri = audienceUri;
            _issuer = issuer;
            _expiresOn = expiresOn;
            _claims = claims;
            _signature = signature;
            _unsignedString = unsignedString;
        }

        public SimpleWebToken(Uri audienceUri, string issuer, DateTime expiresOn, List<Claim> claims, InMemorySymmetricSecurityKey signingKey)
        {
            _audienceUri = audienceUri;
            _issuer = issuer;
            _expiresOn = expiresOn;
            _claims = claims;
            _signingKey = signingKey;
        }

        public override string Id
        {
            get { return _id; }
        }

        public override ReadOnlyCollection<SecurityKey> SecurityKeys
        {
            get 
            {
                if (_signingKey != null)
                {
                    return new ReadOnlyCollection<SecurityKey>(new List<SecurityKey> { _signingKey });
                }
                else
                {
                    return new ReadOnlyCollection<SecurityKey>(new List<SecurityKey>());
                }
            }
        }

        public override DateTime ValidFrom
        {
            get { return _validFrom; }
        }

        public override DateTime ValidTo
        {
            get { return _expiresOn; }
        }

        public Uri AudienceUri
        {
            get { return _audienceUri; }
        }

        public string Issuer
        {
            get { return _issuer; }
        }

        public string Signature
        {
            get { return _signature; }
        }

        public List<Claim> Claims
        {
            get { return _claims; }
        }

        /// <summary>
        /// Verifies the signature of the token.
        /// </summary>
        /// <param name="key">The key used for signing.</param>
        /// <returns>true if the signatures match, false otherwise.</returns>
        public bool VerifySignature(byte[] key)
        {
            if (key == null)
            {
                throw new ArgumentNullException("key");
            }

            if (_signature == null || _unsignedString == null)
            {
                throw new InvalidOperationException("Token has never been signed");
            }

            string verifySignature;

            using (HMACSHA256 signatureAlgorithm = new HMACSHA256(key))
            {
                verifySignature = Convert.ToBase64String(signatureAlgorithm.ComputeHash(Encoding.ASCII.GetBytes(_unsignedString)));
            }

            return (ObfuscatingComparer.IsEqual(verifySignature, _signature));
        }
    }    
}