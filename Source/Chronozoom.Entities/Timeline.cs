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
using System.Data.SqlTypes;

namespace Chronozoom.Entities
{
    /// <summary>
    /// A visual representation of a time period that contains a set of Exhibits, child Timelines, and Time Series Data, and is contained by another Timeline or a Collection. The Timeline entity is externally searchable & linkable.
    /// </summary>
    [KnownType(typeof(TimelineRaw))]
    [KnownType(typeof(ExhibitRaw))]
    [DataContract]
    public class Timeline
    {
        /// <summary>
        /// The ID of the timeline (GUID).
        /// </summary>
        [Key]
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        /// <summary>
        /// The depth of the timeline in the timeline tree
        /// </summary>
        public int Depth { get; set; }

        /// <summary>
        /// The number of content items contained in subtree under current timeline
        /// </summary>
        public int SubtreeSize { get; set; }

        /// <summary>
        /// The title of the timeline.
        /// </summary>
        [DataMember(Name = "title")]
        [MaxLength(200)]
        [Column(TypeName = "nvarchar")]
        public string Title { get; set; }

        /// <summary>
        /// The regime in which the timeline should occur.
        /// </summary>
        [DataMember]
        [MaxLength(4000)]
        [Column(TypeName = "nvarchar")]
        public string Regime { get; set; }

        /// <summary>
        /// The year the timeline begins.
        /// </summary>
        [DataMember(Name = "start")]
        public decimal FromYear { get; set; }

        /// <summary>
        /// The year the timeline ends.
        /// </summary>
        [DataMember(Name = "end")]
        public decimal ToYear { get; set; }

        /// <summary>
        /// ???
        /// </summary>
        public decimal ForkNode { get; set; }

        /// <summary>
        /// The height of the timeline.
        /// </summary>
        [DataMember]
        public decimal? Height { get; set; }

        /// <summary>
        /// The number of timelines within subtree of this timeline
        /// </summary>
        public Guid FirstNodeInSubtree { get; set; }

        /// <summary>
        /// Reference to predecessor (when traversed in post-order) 
        /// </summary>
        public Guid Predecessor { get; set; }

        /// <summary>
        /// Reference to sucessor (when traversed in post-order) 
        /// </summary>
        public Guid Successor { get; set; }

        /// <summary>
        /// The collection of child timelines belonging to the timeline.
        /// </summary>
        [DataMember(Name = "timelines")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification = "Object property needs to be initialized externally")]
        public virtual Collection<Timeline> ChildTimelines { get; set; }

        /// <summary>
        /// The collection of exhibits belonging to the timeline.
        /// </summary>
        [DataMember(Name = "exhibits")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification = "Object property needs to be initialized externally")]
        public virtual Collection<Exhibit> Exhibits { get; set; }

        public virtual Entities.Collection Collection { get; set; }
    }

    [DataContract]
    [NotMapped]
    public class TimelineRaw : Timeline
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1707:IdentifiersShouldNotContainUnderscores", Justification = "Needs to match storage column name")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "ID", Justification = "Needs to match storage column name")]
        [DataMember(Name = "ParentTimelineId", EmitDefaultValue = false)]
        public Guid? Timeline_ID { get; set; }
    }
}
