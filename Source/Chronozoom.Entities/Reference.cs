// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    /// <summary>
    /// Specifies a bibliography reference.
    /// </summary>
    [DataContract]
    public class Reference
    {
        /// <summary>
        /// The ID of the reference.
        /// </summary>
        [Key]
        [DataMember(Name="ID")]
        public Guid Id { get; set; }

        /// <summary>
        /// The title of the reference.
        /// </summary>
        [DataMember]
        public string Title { get; set; }

        /// <summary>
        /// Lists the authors associated with the reference.
        /// </summary>
        [DataMember]
        public string Authors { get; set; }

        /// <summary>
        /// Specifies the book chapters for the reference.
        /// </summary>
        [DataMember]
        public string BookChapters { get; set; }

        /// <summary>
        /// Indicates the citation type for the reference.
        /// </summary>
        [DataMember]
        public string CitationType { get; set; }
        
        /// <summary>
        /// Lists the page numbers for the reference.
        /// </summary>
        [DataMember]
        public string PageNumbers { get; set; }

        /// <summary>
        /// The publication that the reference refers to.
        /// </summary>
        [DataMember]
        public string Publication { get; set; }

        /// <summary>
        /// The publication dates for the associated publication.
        /// </summary>
        [DataMember]
        public string PublicationDates { get; set; }

        /// <summary>
        /// The source of the reference.
        /// </summary>
        [DataMember]
        public string Source { get; set; }
    }

    [DataContract]
    [NotMapped]
    public class ReferenceRaw : Reference
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1707:IdentifiersShouldNotContainUnderscores", Justification = "Needs to match storage column name")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "ID", Justification = "Needs to match storage column name")]
        public Guid Exhibit_ID { get; set; }
    }
}