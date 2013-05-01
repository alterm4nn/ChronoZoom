// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    /// <summary>
    /// Specifies a point in time.
    /// </summary>
    [KnownType(typeof(ExhibitRaw))]
    [DataContract]
    public class Threshold
    {
        /// <summary>
        /// The ID of the threshold.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// The title of the threshold.
        /// </summary>
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

        /// <summary>
        /// The year in which the threshold should occur.
        /// </summary>
        [DataMember]
        public decimal ThresholdYear { get; set; }

        /// <summary>
        /// The description of the threshold.
        /// </summary>
        [DataMember]
        public string Description { get; set; }

        /// <summary>
        /// A relative path for the bookmark that is associated with the threshold.
        /// </summary>
        [DataMember]
        public string BookmarkRelativePath { get; set; }
    }
}