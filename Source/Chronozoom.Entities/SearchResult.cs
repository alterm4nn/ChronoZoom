// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    /// <summary>
    /// Specifies the type of object contained by the search result.
    /// </summary>
    /// <param name="Exhibit">0</param>
    /// <param name="Timeline">1</param>
    /// <param name="ContentItem">2</param>
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

    /// <summary>
    /// Contains a search result.
    /// </summary>
    [DataContract]
    public class SearchResult
    {
        /// <summary>
        /// The ID of the search result.
        /// </summary>
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        /// <summary>
        /// The title of the search result.
        /// </summary>
        [DataMember(Name = "title")]
        public string Title { get; set; }

        /// <summary>
        /// The type of object contained by the search result.
        /// </summary>
        [DataMember(Name = "objectType")]
        public ObjectType ObjectType { get; set; }

        /// <summary>
        /// Id of the timeline enclosing the search result.
        /// </summary>
        /// <remarks>
        /// If the search result is a timeline then 
        /// the enclosing timeline is same as the searched timeline.
        /// Else If seach result is an exhibit or a content item then 
        /// the enclosing timeline is a timeline containing the 
        /// searched exhibit or content item.
        /// </remarks>
        [DataMember(Name = "enclosingTimelineId")]
        public Guid EnclosingTimelineId { get; set; }

        /// <summary>
        /// Start time of the timeline enclosing the search result.
        /// </summary>
        [DataMember(Name = "enclosingTimelineStart")]
        public decimal EnclosingTimelineStart { get; set; }

        /// <summary>
        /// End time of the timeline enclosing the search result.
        /// </summary>
        [DataMember(Name = "enclosingTimelineEnd")]
        public decimal EnclosingTimelineEnd { get; set; }
    }
}