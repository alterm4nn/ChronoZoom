/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IdentityModel.Selectors;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Cryptography;
using System.ServiceModel.Security;
using System.Text;
using System.Web;
using System.Xml;
using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Tokens;
using Thinktecture.IdentityModel.Constants;
using Thinktecture.IdentityModel.Extensions;

namespace Thinktecture.IdentityModel.Tokens
{
    /// <summary>
    /// Handles SWT tokens.
    /// </summary>
    public class SimpleWebTokenHandler : SecurityTokenHandler, IHttpSecurityTokenHandler
    {
        private string[] _identifiers = new string[] { TokenTypes.SimpleWebToken, SwtConstants.SWT };

        public override string[] GetTokenTypeIdentifiers()
        {
            return _identifiers;
        }

        public override Type TokenType
        {
            get { return typeof(SimpleWebToken); }
        }

        public SimpleWebTokenHandler()
        { }

        public SimpleWebTokenHandler(string identifier)
        {
            _identifiers = new string[] { identifier };
        }

        public override bool CanReadToken(XmlReader reader)
        {
            return
                reader.IsStartElement(WSSecurity10Constants.Elements.BinarySecurityToken, WSSecurity10Constants.Namespace) &&
                reader.GetAttribute(WSSecurity10Constants.Attributes.ValueType) == TokenTypes.SimpleWebToken;
        }

        public override SecurityToken ReadToken(XmlReader reader)
        {
            if (!this.CanReadToken(reader))
            {
                throw new InvalidOperationException("Can't read token.");
            }

            var swtBuffer = Convert.FromBase64String(reader.ReadElementContentAsString());
            var swt = Encoding.Default.GetString(swtBuffer);

            return ReadToken(swt);
        }

        /// <summary>
        /// Reads a serialized token and converts it into a <see cref="SecurityToken"/>.
        /// </summary>
        /// <param name="rawToken">The token in serialized form.</param>
        /// <returns>The parsed form of the token.</returns>
        public SecurityToken ReadToken(string rawToken)
        {
            char parameterSeparator = '&';
            Uri audienceUri = null;
            string issuer = null;
            string signature = null;
            string unsignedString = null;
            string expires = null;

            if (string.IsNullOrEmpty(rawToken))
            {
                throw new ArgumentNullException("rawToken");
            }

            //
            // Find the last parameter. The signature must be last per SWT specification.
            //
            int lastSeparator = rawToken.LastIndexOf(parameterSeparator);

            // Check whether the last parameter is an hmac.
            //
            if (lastSeparator > 0)
            {
                string lastParamStart = parameterSeparator + SwtConstants.Digest256 + "=";
                string lastParam = rawToken.Substring(lastSeparator);

                // Strip the trailing hmac to obtain the original unsigned string for later hmac verification.
                // e.g. name1=value1&name2=value2&HMACSHA256=XXX123 -> name1=value1&name2=value2
                //
                if (lastParam.StartsWith(lastParamStart, StringComparison.Ordinal))
                {
                    unsignedString = rawToken.Substring(0, lastSeparator);
                }
            }
            else
            {
                throw new SecurityTokenValidationException("The Simple Web Token must have a signature at the end. The incoming token did not have a signature at the end of the token.");
            }

            // Signature is a mandatory parameter, and it must be the last one.
            // If there's no trailing hmac, Return error.
            //
            if (unsignedString == null)
            {
                throw new SecurityTokenValidationException("The Simple Web Token must have a signature at the end. The incoming token did not have a signature at the end of the token.");
            }

            // Create a collection of SWT claims
            //
            NameValueCollection rawClaims = ParseToken(rawToken);

            audienceUri = new Uri(rawClaims[SwtConstants.Audience]);
            if (audienceUri != null)
            {
                rawClaims.Remove(SwtConstants.Audience);
            }
            else
            {
                throw new SecurityTokenValidationException("Then incoming token does not have an AudienceUri.");
            }

            expires = rawClaims[SwtConstants.ExpiresOn];
            if (expires != null)
            {
                rawClaims.Remove(SwtConstants.ExpiresOn);
            }
            else
            {
                throw new SecurityTokenValidationException("Then incoming token does not have an expiry time.");
            }

            issuer = rawClaims[SwtConstants.Issuer];
            if (issuer != null)
            {
                rawClaims.Remove(SwtConstants.Issuer);
            }
            else
            {
                throw new SecurityTokenValidationException("Then incoming token does not have an Issuer");
            }

            signature = rawClaims[SwtConstants.Digest256];
            if (signature != null)
            {
                rawClaims.Remove(SwtConstants.Digest256);
            }
            else
            {
                throw new SecurityTokenValidationException("Then incoming token does not have a signature");
            }

            List<Claim> claims = DecodeClaims(issuer, rawClaims);

            SimpleWebToken swt = new SimpleWebToken(audienceUri, issuer, DecodeExpiry(expires), claims, signature, unsignedString);
            return swt;
        }


        public override bool CanValidateToken
        {
            get { return true; }
        }

        public override bool CanWriteToken
        {
            get { return true; }
        }

        public override void WriteToken(XmlWriter writer, SecurityToken token)
        {
            var swt = token as SimpleWebToken;

            if (swt == null)
                throw new SecurityTokenException();

            // Wrap the token into a binary token for XML transport.
            writer.WriteStartElement(WSSecurity10Constants.Elements.BinarySecurityToken, WSSecurity10Constants.Namespace);
            writer.WriteAttributeString(WSSecurity10Constants.Attributes.ValueType, "http://schemas.xmlsoap.org/ws/2009/11/swt-token-profile-1.0");
            writer.WriteAttributeString(WSSecurity10Constants.Attributes.EncodingType, WSSecurity10Constants.EncodingTypes.Base64);
            writer.WriteValue(Convert.ToBase64String(Encoding.Default.GetBytes(WriteToken(token))));
            writer.WriteEndElement();
        }

        public string WriteToken(SecurityToken token)
        {
            var swt = token as SimpleWebToken;

            if (swt == null)
            {
                throw new InvalidOperationException("token");
            }

            var unsignedToken = CreateUnsignedToken(swt);

            var hmac = new HMACSHA256((swt.SecurityKeys.First() as InMemorySymmetricSecurityKey).GetSymmetricKey());
            var sig = hmac.ComputeHash(Encoding.ASCII.GetBytes(unsignedToken));

            var signedToken = String.Format("{0}&HMACSHA256={1}",
                unsignedToken,
                HttpUtility.UrlEncode(Convert.ToBase64String(sig)));

            return signedToken;
        }

        private static string CreateUnsignedToken(SimpleWebToken swt)
        {
            var sb = new StringBuilder();
            var claims = new Dictionary<string, string>();

            foreach (var claim in swt.Claims)
            {
                claims.Add(claim.ClaimType, claim.Value);
            }

            foreach (var kv in claims)
            {
                sb.AppendFormat("{0}={1}&", HttpUtility.UrlEncode(kv.Key), HttpUtility.UrlEncode(kv.Value));
            }

            sb.AppendFormat("Issuer={0}&", HttpUtility.UrlEncode(swt.Issuer));
            sb.AppendFormat("Audience={0}&", HttpUtility.UrlEncode(swt.AudienceUri.AbsoluteUri));
            sb.AppendFormat("ExpiresOn={0:0}", swt.ValidTo.ToEpochTime());

            return sb.ToString();
        }

        public override SecurityToken CreateToken(SecurityTokenDescriptor tokenDescriptor)
        {
            var claims = tokenDescriptor.Subject.Claims;
            var issuer = tokenDescriptor.TokenIssuerName;
            var audience = tokenDescriptor.AppliesToAddress;
            var key = (InMemorySymmetricSecurityKey)tokenDescriptor.SigningCredentials.SigningKey;

            var token = new SimpleWebToken(
                new Uri(audience), 
                issuer, 
                tokenDescriptor.Lifetime.Expires.Value, 
                claims.ToList(), 
                key);

            return token;
        }

        public override ClaimsIdentityCollection ValidateToken(SecurityToken token)
        {
            SimpleWebToken swt = token as SimpleWebToken;
            if (swt == null)
            {
                throw new SecurityTokenValidationException("The received token is of incorrect token type.Expected SimpleWebToken");
            }

            // check issuer name registry for allowed issuers
            string issuerName = null;
            if (base.Configuration.IssuerNameRegistry != null)
            {
                issuerName = base.Configuration.IssuerNameRegistry.GetIssuerName(token);
                if (string.IsNullOrEmpty(issuerName))
                {
                    throw new SecurityTokenValidationException("Invalid issuer");
                }
            }

            // check expiration
            if (DateTime.Compare(swt.ValidTo, DateTime.UtcNow) <= 0)
            {
                throw new SecurityTokenExpiredException("The incoming token has expired. Get a new access token from the Authorization Server.");
            }

            // check audience
            if (base.Configuration.AudienceRestriction.AudienceMode != AudienceUriMode.Never)
            {
                var allowedAudiences = base.Configuration.AudienceRestriction.AllowedAudienceUris;

                if (!allowedAudiences.Any(uri => uri == swt.AudienceUri))
                {
                    throw new AudienceUriValidationFailedException();
                }
            }

            // retrieve signing key
            var clause = new WebTokenSecurityKeyClause(swt.Issuer);
            var securityKey = Configuration.IssuerTokenResolver.ResolveSecurityKey(clause) as InMemorySymmetricSecurityKey;

            if (securityKey == null)
            {
                throw new SecurityTokenValidationException("No signing key found");
            }


            // TODO
            // check signature
            if (!swt.VerifySignature(securityKey.GetSymmetricKey()))
            {
                throw new SecurityTokenValidationException("Signature verification of the incoming token failed.");
            }

            

            var id = new ClaimsIdentity("SWT");

            foreach (var claim in swt.Claims)
            {
                claim.Value.Split(',').ToList().ForEach(v => id.Claims.Add(new Claim(claim.ClaimType, v, ClaimValueTypes.String, issuerName)));
            }

            return new ClaimsIdentityCollection(new ClaimsIdentity[] { id });
        }



        private static void CreateClaims(SimpleWebToken swt, StringBuilder sb)
        {
            var claims = new Dictionary<string, string>();

            foreach (var claim in swt.Claims)
            {
                claims.Add(claim.ClaimType, claim.Value);
            }

            foreach (var kv in claims)
            {
                sb.AppendFormat("{0}={1}&", HttpUtility.UrlEncode(kv.Key), HttpUtility.UrlEncode(kv.Value));
            }
        }

        public override SecurityKeyIdentifierClause CreateSecurityTokenReference(SecurityToken token, bool attached)
        {
            var swt = token as SimpleWebToken;
            if (swt == null)
                throw new SecurityTokenException("Expected SWT token.");

            return new KeyNameIdentifierClause(swt.Issuer);
        }


        /// <summary>
        /// Parses the token into a collection.
        /// </summary>
        /// <param name="encodedToken">The serialized token.</param>
        /// <returns>A colleciton of all name-value pairs from the token.</returns>
        NameValueCollection ParseToken(string encodedToken)
        {
            NameValueCollection claimCollection = new NameValueCollection();
            foreach (string nameValue in encodedToken.Split('&'))
            {
                string[] keyValueArray = nameValue.Split('=');

                if ((keyValueArray.Length != 2)
                   && !String.IsNullOrEmpty(keyValueArray[0]))
                {
                    // the signature may have multiple '=' in the end
                    throw new SecurityTokenException("The received token is not correctly formed");
                }

                if (String.IsNullOrEmpty(keyValueArray[1]))
                {
                    // ignore parameter with empty values
                    continue;
                }

                string key = HttpUtility.UrlDecode(keyValueArray[0].Trim());               // Names must be decoded for the claim type case
                string value = HttpUtility.UrlDecode(keyValueArray[1].Trim().Trim('"')); // remove any unwanted "
                claimCollection.Add(key, value);
            }

            return claimCollection;
        }

        /// <summary>Create <see cref="Claim"/> from the incoming token.
        /// </summary>
        /// <param name="issuer">The issuer of the token.</param>
        /// <param name="rawClaims">The name value pairs from the token.</param>        
        /// <returns>A list of Claims created from the token.</returns>
        protected List<Claim> DecodeClaims(string issuer, NameValueCollection rawClaims)
        {
            if (rawClaims == null)
            {
                throw new ArgumentNullException("rawClaims");
            }

            List<Claim> decodedClaims = new List<Claim>();

            foreach (string key in rawClaims.Keys)
            {
                if (string.IsNullOrEmpty(rawClaims[key]))
                {
                    throw new SecurityTokenValidationException("Claim value cannot be empty");
                }

                decodedClaims.Add(new Claim(key, rawClaims[key], ClaimValueTypes.String, issuer));
            }

            return decodedClaims;
        }

        /// <summary>
        /// Convert the expiryTime to the <see cref="DateTime"/> format.
        /// </summary>
        /// <param name="expiry">The expiry time from the token.</param>
        /// <returns>The local expiry time of the token.</returns>
        protected DateTime DecodeExpiry(string expiry)
        {
            long totalSeconds = 0;
            if (!long.TryParse(expiry, out totalSeconds))
            {
                throw new SecurityTokenValidationException("The incoming token has an unexpected expiration time format");
            }

            return new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc).AddSeconds(totalSeconds);
        }

        /// <summary>
        /// Verifies the signature of the incoming token.
        /// </summary>
        /// <param name="key">The key used for signing.</param>
        /// <returns>true if the signatures match, false otherwise.</returns>
        public bool SignVerify(SimpleWebToken token, byte[] key)
        {
            if (token == null)
            {
                throw new ArgumentNullException("token");
            }

            if (key == null)
            {
                throw new ArgumentNullException("key");
            }

            var unsignedToken = CreateUnsignedToken(token);

            string verifySignature;
            using (HMACSHA256 signatureAlgorithm = new HMACSHA256(key))
            {
                verifySignature = Convert.ToBase64String(signatureAlgorithm.ComputeHash(Encoding.ASCII.GetBytes(unsignedToken)));
            }

            if (string.CompareOrdinal(verifySignature, token.Signature) == 0)
            {
                return true;
            }

            return false;
        }

        public bool CanReadToken(string tokenString)
        {
            return true;
        }
    }
}