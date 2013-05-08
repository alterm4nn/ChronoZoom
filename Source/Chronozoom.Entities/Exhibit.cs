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
    [KnownType(typeof(ReferenceRaw))]
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
        /// The threshold for the exhibit.
        /// </summary>
        [DataMember]
        public string Threshold { get; set; }

        /// <summary>
        /// The regime in which the threshold should appear.
        /// </summary>
        [DataMember]
        public string Regime { get; set; }

        [NotMapped]
        [DataMember]
        public string TimeUnit { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [NotMapped]
        [DataMember]
        public int? Day { get; set; }

        [NotMapped]
        [DataMember]
        public int? Month { get; set; }

        /// <summary>
        /// The year in which the exhibit appears.
        /// </summary>
        [DataMember]
        public decimal Year { get; set; }

        [NotMapped]
        [DataMember(Name = "time")]
        public decimal Time { get; set; }

        /// <summary>
        /// The unique ID of the exhibit.
        /// </summary>
        [DataMember(Name = "UniqueID")]
        public int UniqueId { get; set; }

        /// <summary>
        /// Specifies the point of the exhibit within the sequence.
        /// </summary>
        [DataMember]
        public int? Sequence { get; set; }

        /// <summary>
        /// Specifies the collection of content items that is associated with the exhibit.
        /// </summary>
        [DataMember(Name = "contentItems")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification = "Object property needs to be initialized externally")]
        public virtual Collection<ContentItem> ContentItems { get; set; }

        /// <summary>
        /// Specifies the collection of references for the exhibit.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification = "Object property needs to be initialized externally")]
        public virtual Collection<Reference> References { get; set; }

        /// <summary>
        /// Specifies the collection that is associated with the exhibit.
        /// </summary>
        [DataMember(Name = "collection")]
        public virtual Entities.Collection Collection { get; set; }
    }

    [DataContract]
    [NotMapped]
    public class ExhibitRaw : Exhibit
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1707:IdentifiersShouldNotContainUnderscores", Justification = "Needs to match storage column name")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "ID", Justification = "Needs to match storage column name")]
        [DataMember(Name = "ParentTimelineId")]
        public Guid Timeline_ID { get; set; }
    }
}