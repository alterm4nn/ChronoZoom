// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract(Name = "ObjectType")]
    public enum ObjectType
    {
        [EnumMember]
        Exhibit = 0,
        [EnumMember]
        Timeline = 1,
        [EnumMember]
        ContentItem = 2
   }

    [DataContract]
    public class SearchResult
    {
        [DataMember(Name="ID")]
        public Guid Id { get; set; }

        [DataMember]
        public string Title { get; set; }

        [DataMember]
        public ObjectType ObjectType { get; set; }

        [DataMember(Name="UniqueID")]
        public int UniqueId { get; set; }
    }
}