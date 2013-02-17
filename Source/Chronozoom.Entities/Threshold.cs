// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class Threshold
    {
        public int Id { get; set; }

        [DataMember]
        public string Title { get; set; }

        [DataMember]
        public string ThresholdTimeUnit { get; set; }

        [DataMember]
        public int ThresholdDay { get; set; }

        [DataMember]
        public int ThresholdMonth { get; set; }

        [DataMember]
        public decimal? ThresholdYear { get; set; }

        [DataMember]
        public string Description { get; set; }

        [DataMember]
        public string BookmarkRelativePath { get; set; }
    }
}