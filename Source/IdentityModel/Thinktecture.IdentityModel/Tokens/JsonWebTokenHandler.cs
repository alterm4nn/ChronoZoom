/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IdentityModel.Selectors;
using System.IdentityModel.Tokens;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.ServiceModel.Security;
using System.Text;
using System.Xml;
using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Thinktecture.IdentityModel.Constants;
using Thinktecture.IdentityModel.Extensions;

namespace Thinktecture.IdentityModel.Tokens
{
    public class JsonWebTokenHandler : SecurityTokenHandler, IHttpSecurityTokenHandler
    {
        private string[] _identifier = new string[] { TokenTypes.JsonWebToken, JwtConstants.JWT };

        #region Create
        public override SecurityToken CreateToken(SecurityTokenDescriptor descriptor)
        {
            var jwt = new JsonWebToken();

            if (descriptor.SigningCredentials == null)
            {
                jwt.Header.SignatureAlgorithm = JwtConstants.SignatureAlgorithms.None;
            }
            else
            {
                var algorithm = ParseSigningCredentials(descriptor.SigningCredentials);

                jwt.Header.SigningCredentials = descriptor.SigningCredentials;
                jwt.Header.SignatureAlgorithm = algorithm;
            }

            if (!string.IsNullOrWhiteSpace(descriptor.TokenIssuerName))
            {
                jwt.Issuer = descriptor.TokenIssuerName;
            }

            if (descriptor.Lifetime != null)
            {
                jwt.ExpirationTime = descriptor.Lifetime.Expires.Value.ToEpochTime();
            }

            if (!string.IsNullOrWhiteSpace(descriptor.AppliesToAddress))
            {
                jwt.Audience = new Uri(descriptor.AppliesToAddress);
            }

            if (descriptor.Subject != null)
            {
                foreach (var claim in descriptor.Subject.Claims)
                {
                    jwt.AddClaim(claim.ClaimType, claim.Value);
                }
            }

            return jwt;
        }

        protected virtual string ParseSigningCredentials(SigningCredentials signingCredentials)
        {
            var symmetricSigningCredentials = signingCredentials as HmacSigningCredentials;
            if (symmetricSigningCredentials == null)
            {
                throw new InvalidOperationException("Only symmetric signatures are supported.");
            }

            if (symmetricSigningCredentials.SignatureAlgorithm == Algorithms.HmacSha256Signature)
            {
                return JwtConstants.SignatureAlgorithms.HMACSHA256;
            }
            if (symmetricSigningCredentials.SignatureAlgorithm == Algorithms.HmacSha384Signature)
            {
                return JwtConstants.SignatureAlgorithms.HMACSHA384;
            }
            if (symmetricSigningCredentials.SignatureAlgorithm == Algorithms.HmacSha512Signature)
            {
                return JwtConstants.SignatureAlgorithms.HMACSHA512;
            }

            throw new InvalidOperationException("Only HMACSHA256, 384 and 512 are supported");
        }

        public override SecurityKeyIdentifierClause CreateSecurityTokenReference(SecurityToken token, bool attached)
        {
            var jwt = token as JsonWebToken;
            if (jwt == null)
                throw new SecurityTokenException("Expected JWT token.");

            return new KeyNameIdentifierClause(jwt.Issuer);
        }
        #endregion

        #region Write
        public string WriteToken(SecurityToken token)
        {
            if (token == null)
            {
                throw new ArgumentNullException("token");
            }

            var jwt = token as JsonWebToken;
            if (jwt == null)
            {
                throw new ArgumentException("Token is not a JsonWebToken");
            }

            var header = CreateHeader(jwt);
            var claims = CreateClaimSet(jwt);

            var unsignedToken = string.Format("{0}.{1}", header, claims);

            if (jwt.Header.SignatureAlgorithm != JwtConstants.SignatureAlgorithms.None)
            {
                var signature = Sign(unsignedToken, jwt.Header);
                return string.Format("{0}.{1}", unsignedToken, signature);
            }

            return unsignedToken;
        }

        protected virtual string CreateHeader(JsonWebToken jwt)
        {
            StringBuilder sb = new StringBuilder();
            StringWriter sw = new StringWriter(sb);

            using (JsonWriter jsonWriter = new JsonTextWriter(sw))
            {
                jsonWriter.WriteStartObject();

                jsonWriter.WritePropertyName(JwtConstants.Header.Type);
                jsonWriter.WriteValue(jwt.Header.Type);
                jsonWriter.WritePropertyName(JwtConstants.Header.Algorithm);
                jsonWriter.WriteValue(jwt.Header.SignatureAlgorithm);

                jsonWriter.WriteEndObject();
            }

            var json = sb.ToString();
            Debug.WriteLine(json);

            return Base64Url.Encode(Encoding.UTF8.GetBytes(json));
        }

        protected virtual string CreateClaimSet(JsonWebToken jwt)
        {
            StringBuilder sb = new StringBuilder();
            StringWriter sw = new StringWriter(sb);

            using (var jsonWriter = new JsonTextWriter(sw))
            {
                jsonWriter.WriteStartObject();

                AddReservedClaims(jwt, jsonWriter);
                AddUserClaims(jwt, jsonWriter);

                jsonWriter.WriteEndObject();
            }

            var json = sb.ToString();
            Debug.WriteLine(json);

            return Base64Url.Encode(Encoding.UTF8.GetBytes(json));
        }

        protected virtual void AddReservedClaims(JsonWebToken jwt, JsonTextWriter writer)
        {
            // exp
            if (jwt.ExpirationTime.HasValue)
            {
                writer.WritePropertyName(JwtConstants.Claims.ExpirationTime);
                writer.WriteValue(jwt.ExpirationTime.Value);
            }

            // nbf
            if (jwt.NotBefore.HasValue)
            {
                writer.WritePropertyName(JwtConstants.Claims.NotBefore);
                writer.WriteValue(jwt.NotBefore.Value);
            }

            // iat
            if (jwt.IssuedAt.HasValue)
            {
                writer.WritePropertyName(JwtConstants.Claims.IssuedAt);
                writer.WriteValue(jwt.IssuedAt.Value);
            }

            // iss
            if (!string.IsNullOrWhiteSpace(jwt.Issuer))
            {
                writer.WritePropertyName(JwtConstants.Claims.Issuer);
                writer.WriteValue(jwt.Issuer);
            }

            // aud
            if (jwt.Audience != null)
            {
                writer.WritePropertyName(JwtConstants.Claims.Audience);
                writer.WriteValue(jwt.Audience.AbsoluteUri);
            }

            // prn
            if (!string.IsNullOrWhiteSpace(jwt.Principal))
            {
                writer.WritePropertyName(JwtConstants.Claims.Principal);
                writer.WriteValue(jwt.Principal);
            }

            // jti
            if (!string.IsNullOrWhiteSpace(jwt.JwtId))
            {
                writer.WritePropertyName(JwtConstants.Claims.Id);
                writer.WriteValue(jwt.JwtId);
            }
        }

        protected virtual void AddUserClaims(JsonWebToken jwt, JsonTextWriter writer)
        {
            foreach (var claim in jwt.Claims)
            {
                writer.WritePropertyName(claim.Key);
                writer.WriteValue(claim.Value);
            }
        }

        protected virtual string Sign(string unsignedToken, JwtHeader header)
        {
            var algorithm = ParseSigningCredentials(header.SigningCredentials);

            if (header.SignatureAlgorithm != algorithm)
            {
                throw new InvalidOperationException("Mismatch between signature algorithm and signing key");
            }

            HMAC hmac;

            switch (algorithm)
            {
                case JwtConstants.SignatureAlgorithms.HMACSHA256:
                    hmac = new HMACSHA256();
                    break;
                case JwtConstants.SignatureAlgorithms.HMACSHA384:
                    hmac = new HMACSHA384();
                    break;
                case JwtConstants.SignatureAlgorithms.HMACSHA512:
                    hmac = new HMACSHA512();
                    break;
                default:
                    throw new InvalidOperationException("Unsupported signature algorithm");
            }

            hmac.Key = (header.SigningCredentials.SigningKey as InMemorySymmetricSecurityKey).GetSymmetricKey();

            using (hmac)
            {
                var signature = hmac.ComputeHash(Encoding.UTF8.GetBytes(unsignedToken));
                return Base64Url.Encode(signature);
            }
        }
        #endregion

        #region Read
        public SecurityToken ReadToken(string tokenString)
        {
            if (string.IsNullOrWhiteSpace(tokenString))
            {
                throw new ArgumentNullException("tokenString");
            }

            var jwt = new JsonWebToken();

            var parts = tokenString.Split('.');
            if (parts.Length < 2)
            {
                throw new SecurityTokenException("Malformed token");
            }

            var encodedHeader = parts[0];
            var encodedClaims = parts[1];

            ReadHeader(Encoding.UTF8.GetString(Base64Url.Decode(encodedHeader)), jwt);

            string signature = string.Empty;
            if (jwt.Header.SignatureAlgorithm != JwtConstants.SignatureAlgorithms.None)
            {
                if (parts.Length != 3)
                {
                    throw new SecurityTokenException("Signature is missing");
                }

                signature = parts[2];
            }

            jwt.UnsignedToken = string.Format("{0}.{1}", encodedHeader, encodedClaims);
            jwt.Signature = signature;

            ReadClaims(Encoding.UTF8.GetString(Base64Url.Decode(encodedClaims)), jwt);

            return jwt;
        }

        protected virtual void ReadClaims(string claims, JsonWebToken jwt)
        {
            var json = JObject.Load(new JsonTextReader(new StringReader(claims)));

            foreach (var item in json)
            {
                switch (item.Key)
                {
                    case JwtConstants.Claims.Audience:
                        jwt.Audience = new Uri(item.Value.ToString());
                        break;
                    case JwtConstants.Claims.ExpirationTime:
                        jwt.ExpirationTime = long.Parse(item.Value.ToString());
                        break;
                    case JwtConstants.Claims.IssuedAt:
                        jwt.IssuedAt = long.Parse(item.Value.ToString());
                        break;
                    case JwtConstants.Claims.Issuer:
                        jwt.Issuer = item.Value.ToString();
                        break;
                    case JwtConstants.Claims.NotBefore:
                        jwt.NotBefore = long.Parse(item.Value.ToString());
                        break;
                    case JwtConstants.Claims.Principal:
                        jwt.Principal = item.Value.ToString();
                        break;
                    default:
                        jwt.Claims.Add(item.Key, item.Value.ToString());
                        break;
                }
            }
        }

        protected virtual void ReadHeader(string header, JsonWebToken jwt)
        {
            var json = JObject.Load(new JsonTextReader(new StringReader(header)));

            var typ = json[JwtConstants.Header.Type];
            if (typ != null && !string.IsNullOrWhiteSpace(typ.ToString()))
            {
                jwt.Header.Type = typ.ToString();
            }

            var alg = json[JwtConstants.Header.Algorithm];
            if (alg == null || string.IsNullOrEmpty(alg.ToString()))
            {
                throw new SecurityTokenException("Algorithm header is missing.");
            }
            jwt.Header.SignatureAlgorithm = alg.ToString();
        }
        #endregion

        #region Validate
        public override ClaimsIdentityCollection ValidateToken(SecurityToken token)
        {
            if (token == null)
            {
                throw new ArgumentNullException("token");
            }

            var jwt = token as JsonWebToken;
            if (jwt == null)
            {
                throw new ArgumentException("Token is not a JsonWebToken");
            }

            // check if configuration is properly set
            if (base.Configuration == null)
            {
                throw new InvalidOperationException("No configuration set for token handler");
            }

            // check issuer name registry for allowed issuers
            var issuerName = base.Configuration.IssuerNameRegistry.GetIssuerName(token);
            if (string.IsNullOrEmpty(issuerName))
            {
                throw new SecurityTokenValidationException("Invalid issuer");
            }

            // check expiration
            if (jwt.ExpirationTime.HasValue)
            {
                if (DateTime.Compare(jwt.ValidTo, DateTime.UtcNow) <= 0)
                {
                    throw new SecurityTokenExpiredException("The token has expired");
                }
            }

            // check audience
            if (base.Configuration.AudienceRestriction.AudienceMode != AudienceUriMode.Never)
            {
                var allowedAudiences = base.Configuration.AudienceRestriction.AllowedAudienceUris;

                if (!allowedAudiences.Any(uri => uri == jwt.Audience))
                {
                    throw new AudienceUriValidationFailedException();
                }
            }

            if (jwt.Header.SignatureAlgorithm != JwtConstants.SignatureAlgorithms.None)
            {
                // retrieve signing key
                var clause = new WebTokenSecurityKeyClause(jwt.Issuer);
                var signingKey = Configuration.IssuerTokenResolver.ResolveSecurityKey(clause);

                if (signingKey == null)
                {
                    throw new SecurityTokenValidationException("No signing key found");
                }

                VerifySignature(jwt, signingKey);
            }

            var identity = CreateClaimsIdentity(jwt);
            return new ClaimsIdentityCollection(new ClaimsIdentity[] { identity });
        }

        protected virtual ClaimsIdentity CreateClaimsIdentity(JsonWebToken jwt)
        {
            var claims = new List<Claim>();

            foreach (var item in jwt.Claims)
            {
                if (item.Value.Contains(','))
                {
                    var items = item.Value.Split(',');
                    foreach (var part in items)
                    {
                        claims.Add(new Claim(item.Key, part, ClaimValueTypes.String, jwt.Issuer));
                    }
                }
                else
                {
                    claims.Add(new Claim(item.Key, item.Value, ClaimValueTypes.String, jwt.Issuer));
                }
            }

            //var claims = new List<Claim>(
            //    from c in jwt.Claims
            //    select new Claim(c.Type, c.Value, c.ValueType, jwt.Issuer));

            if (!string.IsNullOrWhiteSpace(jwt.Principal))
            {
                claims.Add(new Claim("prn", jwt.Principal, ClaimValueTypes.String, jwt.Issuer));
            }

            if (jwt.IssuedAt.HasValue)
            {
                claims.Add(new Claim("iat", jwt.IssuedAt.Value.ToString(), ClaimValueTypes.String, jwt.Issuer));
            }

            return new ClaimsIdentity(claims, "JWT");
        }

        protected virtual void VerifySignature(JsonWebToken jwt, SecurityKey signingKey)
        {
            var key = signingKey as InMemorySymmetricSecurityKey;
            if (key == null)
            {
                throw new SecurityTokenValidationException("Unsupported signing key.");
            }

            string verifySignature;
            using (var algorithm = key.GetKeyedHashAlgorithm(ValidateHmacAlgorithm(key.KeySize, jwt.Header.SignatureAlgorithm)))
            {
                verifySignature = Base64Url.Encode(algorithm.ComputeHash(Encoding.UTF8.GetBytes(jwt.UnsignedToken)));
            }

            if (!(ObfuscatingComparer.IsEqual(verifySignature, jwt.Signature)))
            {
                throw new SecurityTokenValidationException("Invalid signature.");
            }
        }

        protected virtual string ValidateHmacAlgorithm(int keySize, string expectedAlgorithm)
        {
            if (expectedAlgorithm == JwtConstants.SignatureAlgorithms.HMACSHA256 && keySize == 256)
            {
                return Algorithms.HmacSha256Signature;
            }
            if (expectedAlgorithm == JwtConstants.SignatureAlgorithms.HMACSHA384 && keySize == 384)
            {
                return Algorithms.HmacSha384Signature;
            }
            if (expectedAlgorithm == JwtConstants.SignatureAlgorithms.HMACSHA512 && keySize == 512)
            {
                return Algorithms.HmacSha512Signature;
            }

            throw new SecurityTokenValidationException("Signature algorithm and signing key mismatch");
        }
        #endregion

        #region SecurityTokenHandler
        public override string[] GetTokenTypeIdentifiers()
        {
            return _identifier;
        }

        public override Type TokenType
        {
            get { return typeof(JsonWebToken); }
        }

        public override bool CanValidateToken
        {
            get
            {
                return true;
            }
        }

        public override bool CanWriteToken
        {
            get
            {
                return true;
            }
        }
        #endregion

        #region WS* support
        public override bool CanReadToken(XmlReader reader)
        {
            return
                reader.IsStartElement(WSSecurity10Constants.Elements.BinarySecurityToken, WSSecurity10Constants.Namespace) &&
                reader.GetAttribute(WSSecurity10Constants.Attributes.ValueType) == TokenTypes.JsonWebToken;
        }

        public override SecurityToken ReadToken(XmlReader reader)
        {
            if (!this.CanReadToken(reader))
            {
                throw new InvalidOperationException("Can't read token.");
            }

            var tokenString = reader.ReadElementContentAsString();
            return ReadToken(tokenString);
        }

        public override void WriteToken(XmlWriter writer, SecurityToken token)
        {
            var jwt = token as JsonWebToken;

            if (jwt == null)
            {
                throw new SecurityTokenException("Token is not a Json Web Token");
            }

            // Wrap the token into a binary token for XML transport.
            writer.WriteStartElement(WSSecurity10Constants.Elements.BinarySecurityToken, WSSecurity10Constants.Namespace);
            writer.WriteAttributeString(WSSecurity10Constants.Attributes.ValueType, TokenTypes.JsonWebToken);
            writer.WriteAttributeString(WSSecurity10Constants.Attributes.EncodingType, WSSecurity10Constants.EncodingTypes.Base64);
            writer.WriteValue(WriteToken(token));
            writer.WriteEndElement();
        }
        #endregion

        public bool CanReadToken(string tokenString)
        {
            return true;
        }
    }
}
