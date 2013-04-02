/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.IdentityModel.Tokens;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Description;
using System.ServiceModel.Security;
using Microsoft.IdentityModel.Protocols.WSTrust;
using Microsoft.IdentityModel.SecurityTokenService;

namespace Thinktecture.IdentityModel.WSTrust
{
    /// <summary>
    /// Wrapper for the WIF WSTrustChannelFactory/WSTrustChannel plumbing.
    /// This code is mainly for convience and does not provide any optimizations like caching of the channel factory.
    /// </summary>
    public static class WSTrustClient
    {
        /// <summary>
        /// Requests a bearer token.
        /// </summary>
        /// <param name="stsAddress">The STS address.</param>
        /// <param name="appliesTo">The realm address.</param>
        /// <param name="binding">The binding.</param>
        /// <param name="credentials">The credentials.</param>
        /// <returns>A SecurityToken</returns>
        public static SecurityToken Issue(EndpointAddress stsAddress, EndpointAddress appliesTo, Binding binding, ClientCredentials credentials)
        {
            RequestSecurityTokenResponse rstr;
            var rst = CreateBearerRst(appliesTo);
            return Issue(stsAddress, binding, credentials, rst, out rstr);
        }

        /// <summary>
        /// Requests a token desribed by an RST.
        /// </summary>
        /// <param name="stsAddress">The STS address.</param>
        /// <param name="binding">The binding.</param>
        /// <param name="credentials">The credentials.</param>
        /// <param name="rst">The RST.</param>
        /// <param name="rstr">The RSTR.</param>
        /// <returns>A SecurityToken</returns>
        public static SecurityToken Issue(EndpointAddress stsAddress, Binding binding, ClientCredentials credentials, RequestSecurityToken rst, out RequestSecurityTokenResponse rstr)
        {
            var channel = CreateWSTrustChannel(
                stsAddress,
                binding,
                credentials);

            var token = channel.Issue(rst, out rstr);
            return token;
        }

        private static IWSTrustChannelContract CreateWSTrustChannel(EndpointAddress stsAddress, Binding binding, ClientCredentials credentials)
        {
            var factory = new WSTrustChannelFactory(
                binding,
                stsAddress);
            factory.TrustVersion = TrustVersion.WSTrust13;

            var creds = factory.Endpoint.Behaviors.Find<ClientCredentials>();
            factory.Endpoint.Behaviors.Remove(creds);
            factory.Endpoint.Behaviors.Add(credentials);

            return factory.CreateChannel();
        }

        private static RequestSecurityToken CreateBearerRst(EndpointAddress appliesTo)
        {
            var rst = new RequestSecurityToken
            {
                RequestType = RequestTypes.Issue,
                AppliesTo = new EndpointAddress(appliesTo.Uri.AbsoluteUri),
                KeyType = KeyTypes.Bearer
            };

            return rst;
        }
    }
}
