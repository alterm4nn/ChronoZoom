/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System.Runtime.Serialization;


namespace Thinktecture.IdentityModel.Clients.AccessControlService
{
    [DataContract]
    public class IdentityProviderInformation
    {
        /// <summary>
        /// The display name for the identity provider.
        /// </summary>
        [DataMember]
        public string Name { get; set; }

        /// <summary>
        /// The url used for Login to the identity provider.
        /// </summary>
        [DataMember]
        public string LoginUrl { get; set; }

        /// <summary>
        /// The url that is used to retrieve the image for the identity provider
        /// </summary>
        [DataMember]
        public string ImageUrl { get; set; }

        /// <summary>
        /// A list fo email address suffixes configured for the identity provider.
        /// </summary>
        [DataMember]
        public string[] EmailAddressSuffixes { get; set; }
    }
}
