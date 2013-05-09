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
        /// The title of the timeline.
        /// </summary>
        [DataMember(Name = "title")]
        public string Title { get; set; }

        /// <summary>
        /// The threshold that is associated with the timeline.
        /// </summary>
        [Obsolete("Beta Only")]
        public string Threshold { get; set; }

        /// <summary>
        /// The regime in which the timeline should occur.
        /// </summary>
        [DataMember]
        public string Regime { get; set; }

        [NotMapped]
        [Obsolete("Beta Only")]
        public string FromTimeUnit { get; set; }

        [NotMapped]
        [Obsolete("Beta Only")]
        public int? FromDay { get; set; }

        [NotMapped]
        [Obsolete("Beta Only")]
        public int? FromMonth { get; set; }

        /// <summary>
        /// The year the timeline begins.
        /// </summary>
        [DataMember(Name = "start")]
        public decimal FromYear { get; set; }

        [NotMapped]
        [Obsolete("Beta Only")]
        public string ToTimeUnit { get; set; }

        [NotMapped]
        [Obsolete("Beta Only")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "ToDay", Justification = "This property will be removed soon")]
        public int? ToDay { get; set; }

        [NotMapped]
        [Obsolete("Beta Only")]
        public int? ToMonth { get; set; }

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
        /// The unique ID of the timeline.
        /// </summary>
        [Obsolete("Beta Only")]
        public int UniqueId { get; set; }

        /// <summary>
        /// ???
        /// </summary>
        [Obsolete("Beta Only")]
        public int? Sequence { get; set; }

        /// <summary>
        /// The height of the timeline.
        /// </summary>
        [DataMember]
        public decimal? Height { get; set; }

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
