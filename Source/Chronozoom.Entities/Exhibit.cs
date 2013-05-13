// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    /// <summary>
    /// Contains a set of content items, and is contained by a timeline or a collection.
    /// </summary>
    [KnownType(typeof(ContentItemRaw))]
    [DataContract]
    public class Exhibit
    {
        /// <summary>
        /// The ID of the exhibit.
        /// </summary>
        [Key]
        [DataMember(Name = "id")]
        public Guid Id { get; set; }
        
        /// <summary>
        /// The depth of the exhibit in the timeline tree
        /// </summary>
        public int Depth { get; set; }

        /// <summary>
        /// The title of the exhibit.
        /// </summary>
        [DataMember(Name = "title")]
        public string Title { get; set; }

        /// <summary>
        /// The year in which the exhibit appears.
        /// </summary
        [DataMember(Name = "time")]
        public decimal Year { get; set; }

        /// <summary>
        /// Specifies the collection of content items that is associated with the exhibit.
        /// </summary>
        [DataMember(Name = "contentItems")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification = "Object property needs to be initialized externally")]
        public virtual Collection<ContentItem> ContentItems { get; set; }

        /// <summary>
        /// Specifies the collection that is associated with the exhibit.
        /// </summary>
        public virtual Entities.Collection Collection { get; set; }
    }

    [DataContract]
    [NotMapped]
    public class ExhibitRaw : Exhibit
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1707:IdentifiersShouldNotContainUnderscores", Justification = "Needs to match storage column name")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "ID", Justification = "Needs to match storage column name")]
        [DataMember(Name = "parentTimelineId")]
        public Guid Timeline_ID { get; set; }
    }
}