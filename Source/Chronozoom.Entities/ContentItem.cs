// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class ContentItem
    {
        [Key]
        [DataMember(Name="id")]
        public Guid Id { get; set; }

        [DataMember(Name = "title")]
        public string Title { get; set; }

        [DataMember(Name = "description")]
        public string Caption { get; set; }
        
        [DataMember]
        public string Threshold { get; set; }
        
        [DataMember]
        public string Regime { get; set; }
        
        [DataMember]
        public string TimeUnit { get; set; }
        
        [DataMember]
        public decimal? Year { get; set; }

        [DataMember(Name = "mediaType")]
        public string MediaType { get; set; }

        [DataMember(Name="uri")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification="Uri not supported in entity framework.")]
        public string Uri { get; set; }
        
        [DataMember]
        public string MediaSource { get; set; }
        
        [DataMember]
        public string Attribution { get; set; }

        [DataMember(Name="UniqueID")]
        public int UniqueId { get; set; }

        [DataMember]
        public short? Order { get; set; }

        [DataMember]
        public bool HasBibliography { get; set; }

        public virtual Entities.Collection Collection { get; set; }
    }

    [DataContract]
    [NotMapped]
    public class ContentItemRaw : ContentItem
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1707:IdentifiersShouldNotContainUnderscores", Justification = "Needs to match storage column name")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "ID", Justification = "Needs to match storage column name")]
        [DataMember(Name="ParentExhibitId")]
        public Guid Exhibit_ID { get; set; }
    }
}