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
    [KnownType(typeof(ContentItemRaw))]
    [KnownType(typeof(ReferenceRaw))]
    [DataContract]
    public class Exhibit
    {
        [Key]
        [DataMember(Name="ID")]
        public Guid Id { get; set; }

        [DataMember]
        public string Title { get; set; }

        [DataMember]
        public string Threshold { get; set; }

        [DataMember]
        public string Regime { get; set; }

        [NotMapped]
        [DataMember]
        public string TimeUnit { get; set; }

        [NotMapped]
        [DataMember]
        public int? Day { get; set; }

        [NotMapped]
        [DataMember]
        public int? Month { get; set; }

        [DataMember]
        public decimal Year { get; set; }

        [DataMember(Name="UniqueID")]
        public int UniqueId { get; set; }

        [DataMember]
        public int? Sequence { get; set; }

        [DataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification="Object property needs to be initialized externally")]
        public virtual Collection<ContentItem> ContentItems { get; set; }

        [DataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification="Object property needs to be initialized externally")]
        public virtual Collection<Reference> References { get; set; }

        public virtual Entities.Collection Collection { get; set; }
    }

    [DataContract]
    [NotMapped]
    public class ExhibitRaw : Exhibit
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1707:IdentifiersShouldNotContainUnderscores", Justification = "Needs to match storage column name")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "ID", Justification = "Needs to match storage column name")]
        public Guid Timeline_ID { get; set; }
    }
}