// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [KnownType(typeof(ExhibitRaw))]
    [DataContract]
    public class Threshold
    {
        public int Id { get; set; }

        [DataMember]
        public string Title { get; set; }

        [NotMapped]
        [DataMember]
        public string ThresholdTimeUnit { get; set; }

        [NotMapped]
        [DataMember]
        public int ThresholdDay { get; set; }

        [NotMapped]
        [DataMember]
        public int ThresholdMonth { get; set; }

        [DataMember]
        public decimal ThresholdYear { get; set; }

        [DataMember]
        public string Description { get; set; }

        [DataMember]
        public string BookmarkRelativePath { get; set; }
    }
}