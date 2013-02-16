// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class Exhibit
    {
        [DataMember]
        public Guid ID { get; set; }

        [DataMember]
        public string Title { get; set; }

        [DataMember]
        public string Threshold { get; set; }

        [DataMember]
        public string Regime { get; set; }

        [DataMember]
        public string TimeUnit { get; set; }

        [DataMember]
        public int? Day { get; set; }

        [DataMember]
        public int? Month { get; set; }

        [DataMember]
        public decimal? Year { get; set; }

        [DataMember]
        public int UniqueID { get; set; }

        [DataMember]
        public int? Sequence { get; set; }

        [DataMember]
        public virtual List<ContentItem> ContentItems { get; set; }

        [DataMember]
        public virtual List<Reference> References { get; set; }
    }
}