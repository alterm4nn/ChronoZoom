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
    [KnownType(typeof(TimelineRaw))]
    [KnownType(typeof(ExhibitRaw))]
    [DataContract]
    public class Timeline
    {
        [Key]
        [DataMember(Name="id")]
        public Guid Id { get; set; }

        [DataMember(Name = "title")]
        public string Title { get; set; }

        [DataMember]
        public string Threshold { get; set; }

        [DataMember]
        public string Regime { get; set; }

        [NotMapped]
        [DataMember]
        public string FromTimeUnit { get; set; }

        [NotMapped]
        [DataMember]
        [Obsolete("Only available in Beta")]
        public int? FromDay { get; set; }

        [NotMapped]
        [DataMember]
        public int? FromMonth { get; set; }

        [DataMember]
        public decimal FromYear { get; set; }

        [NotMapped]
        [DataMember(Name="start")]
        public decimal Start { get; set; }

        [NotMapped]
        [DataMember(Name = "end")]
        public decimal End { get; set; }

        [NotMapped]
        [DataMember]
        public string ToTimeUnit { get; set; }

        [NotMapped]
        [DataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "ToDay", Justification="This property will be removed soon")]
        public int? ToDay { get; set; }

        [NotMapped]
        [DataMember]
        public int? ToMonth { get; set; }

        [DataMember]
        public decimal ToYear { get; set; }
        
        [DataMember(Name="UniqueID")]
        public int UniqueId { get; set; }
        
        [DataMember]
        public int? Sequence { get; set; }
        
        [DataMember]
        public decimal? Height { get; set; }

        [DataMember(Name="timelines")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification = "Object property needs to be initialized externally")]
        public virtual Collection<Timeline> ChildTimelines { get; set; }

        [DataMember(Name = "ChildTimelines")]
        [NotMapped]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification = "Object property needs to be initialized externally")]
        public virtual Collection<Timeline> ChildTimelinesBeta { get; set; }

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
        [DataMember(Name = "ParentTimelineId")]
        public Guid? Timeline_ID { get; set; }
    }
}