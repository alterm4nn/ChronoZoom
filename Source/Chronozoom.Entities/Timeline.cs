// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
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

        [DataMember]
        public string FromTimeUnit { get; set; }

        [DataMember]
        public int? FromDay { get; set; }

        [DataMember]
        public int? FromMonth { get; set; }

        [DataMember]
        public decimal? FromYear { get; set; }

        [DataMember]
        public string ToTimeUnit { get; set; }

        [DataMember]
        public int? ToDay { get; set; }

        [DataMember]
        public int? ToMonth { get; set; }

        [DataMember]
        public decimal? ToYear { get; set; }
        
        [DataMember]
        public int UniqueID { get; set; }
        
        [DataMember]
        public int? Sequence { get; set; }
        
        [DataMember]
        public decimal? Height { get; set; }

        [DataMember]
        public virtual Timeline ParentTimeline { get; private set; }

        [DataMember]
        public virtual Collection<Timeline> ChildTimelines { get; private set; }

        [DataMember]
        public virtual Collection<Exhibit> Exhibits { get; private set; }

        public Timeline()
        {
            ChildTimelines = new Collection<Timeline>();
            Exhibits = new Collection<Exhibit>();
        }
    }
}