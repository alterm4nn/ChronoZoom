/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.Generic;
using System.Net.Http;
using Newtonsoft.Json.Linq;
using Thinktecture.IdentityModel.Constants;
using Thinktecture.IdentityModel.Tokens.Http;

namespace Thinktecture.IdentityModel.Clients
{
    public class OAuth2Client
    {
        HttpClient _client;

        public OAuth2Client(Uri address)
        {
            _client = new HttpClient { BaseAddress = address };
        }

        public OAuth2Client(Uri address, string clientId, string clientSecret)
            : this(address)
        {
            _client.DefaultRequestHeaders.Authorization = new BasicAuthenticationHeaderValue(clientId, clientSecret);
        }

        public AccessTokenResponse RequestAccessTokenUserName(string userName, string password, string scope)
        {
            var response = _client.PostAsync("", CreateFormUserName(userName, password, scope)).Result;
            response.EnsureSuccessStatusCode();

            var json = JObject.Parse(response.Content.ReadAsStringAsync().Result);
            return CreateResponseFromJson(json);
        }

        public AccessTokenResponse RequestAccessTokenAssertion(string assertion, string assertionType, string scope)
        {
            var response = _client.PostAsync("", CreateFormAssertion(assertion, assertionType, scope)).Result;
            response.EnsureSuccessStatusCode();

            var json = JObject.Parse(response.Content.ReadAsStringAsync().Result);
            return CreateResponseFromJson(json);
        }

        protected virtual FormUrlEncodedContent CreateFormUserName(string userName, string password, string scope)
        {
            var values = new Dictionary<string, string>
            {
                { OAuth2Constants.GrantType, OAuth2Constants.Password },
                { OAuth2Constants.UserName, userName },
                { OAuth2Constants.Password, password },
                { OAuth2Constants.scope, scope }
            };

            return new FormUrlEncodedContent(values);
        }

        protected virtual FormUrlEncodedContent CreateFormAssertion(string assertion, string assertionType, string scope)
        {
            var values = new Dictionary<string, string>
            {
                { OAuth2Constants.GrantType, assertionType },
                { OAuth2Constants.Assertion, assertion },
                { OAuth2Constants.scope, scope }
            };

            return new FormUrlEncodedContent(values);
        }

        private AccessTokenResponse CreateResponseFromJson(JObject json)
        {
            var response = new AccessTokenResponse
            {
                AccessToken = json["access_token"].ToString(),
                TokenType = json["token_type"].ToString(),
                ExpiresIn = int.Parse(json["expires_in"].ToString())
            };

            if (json["refresh_token"] != null)
            {
                response.RefreshToken = json["refresh_token"].ToString();
            }

            return response;
        }
    } 
}
