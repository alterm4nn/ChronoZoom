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
    public enum ObjectTypeEnum
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
        [DataMember]
        public Guid ID { get; set; }

        [DataMember]
        public string Title { get; set; }

        [DataMember]
        public ObjectTypeEnum ObjectType { get; set; }

        [DataMember]
        public int UniqueID { get; set; }
    }
}