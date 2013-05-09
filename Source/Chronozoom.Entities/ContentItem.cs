// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    /// <summary>
    /// A pointer to a piece of content in ChronoZoom. The Content Item entity is contained by an Exhibit, and is only viewable as part of an Exhibit.
    /// </summary>
    [DataContract]
    public class ContentItem
    {
        /// <summary>
        /// The ID of the content item.
        /// </summary>
        [Key]
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        /// <summary>
        /// The depth of the content item in the timeline tree
        /// </summary>
        public int Depth { get; set; }

        /// <summary>
        /// The title of the content item.
        /// </summary>
        [DataMember(Name = "title")]
        public string Title { get; set; }

        /// <summary>
        /// The description of the content item.
        /// </summary>
        [DataMember(Name = "description")]
        public string Caption { get; set; }

        /// <summary>
        /// The threshold for the content item.
        /// </summary>
        [Obsolete("Beta Only")]
        public string Threshold { get; set; }

        /// <summary>
        /// The regime in which the content item appears.
        /// </summary>
        [Obsolete("Beta Only")]
        public string Regime { get; set; }

        /// <summary>
        /// The time unit for the content item.
        /// </summary>
        [Obsolete("Beta Only")]
        public string TimeUnit { get; set; }

        /// <summary>
        /// The year in which the content item appears.
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public decimal? Year { get; set; }

        /// <summary>
        /// Specifies which type of media the content type is.
        /// </summary>
        [DataMember(Name = "mediaType")]
        public string MediaType { get; set; }

        /// <summary>
        /// The URL for the content item.
        /// </summary>
        [DataMember(Name = "uri")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification="Uri not supported in entity framework.")]
        public string Uri { get; set; }

        /// <summary>
        /// Identifies the source of the content item.
        /// </summary>
        [DataMember(Name = "mediaSource", EmitDefaultValue = false)]
        public string MediaSource { get; set; }

        /// <summary>
        /// The attribution for the content item.
        /// </summary>
        [DataMember(Name = "attribution", EmitDefaultValue = false)]
        public string Attribution { get; set; }

        /// <summary>
        /// The unique ID for the content item.
        /// </summary>
        [Obsolete("Beta Only")]
        public int UniqueId { get; set; }

        /// <summary>
        /// Specifies the order in which the content item should appear.
        /// </summary>
        [DataMember]
        public short? Order { get; set; }

        /// <summary>
        /// Indicates whether the content item has a bibliography (true or false).
        /// </summary>
        [Obsolete("Beta Only")]
        public bool HasBibliography { get; set; }

        /// <summary>
        /// The collection that the content item is associated with.
        /// </summary>
        public virtual Entities.Collection Collection { get; set; }
    }

    [DataContract]
    [NotMapped]
    public class ContentItemRaw : ContentItem
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1707:IdentifiersShouldNotContainUnderscores", Justification = "Needs to match storage column name")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "ID", Justification = "Needs to match storage column name")]
        [DataMember(Name = "parentExhibitId")]
        public Guid Exhibit_ID { get; set; }
    }
}