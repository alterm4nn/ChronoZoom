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
    [DataContract]
    public class Timeline
    {
        [Key]
        [DataMember]
        public Guid ID { get; set; }

        [DataMember]
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
        public int? FromDay { get; set; }

        [NotMapped]
        [DataMember]
        public int? FromMonth { get; set; }

        [DataMember]
        public decimal FromYear { get; set; }

        [NotMapped]
        [DataMember]
        public string ToTimeUnit { get; set; }

        [NotMapped]
        [DataMember]
        public int? ToDay { get; set; }

        [NotMapped]
        [DataMember]
        public int? ToMonth { get; set; }

        [DataMember]
        public decimal ToYear { get; set; }
        
        [DataMember]
        public int UniqueID { get; set; }
        
        [DataMember]
        public int? Sequence { get; set; }
        
        [DataMember]
        public decimal? Height { get; set; }

        [DataMember]
        public virtual Collection<Timeline> ChildTimelines { get; private set; }

        [DataMember]
        public virtual Collection<Exhibit> Exhibits { get; private set; }

        [DataMember]
        public virtual Entities.Collection Collection { get; set; }
    }
}