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
        [DataMember]
        public Guid ID { get; set; }
        
        [DataMember]
        public string Title { get; set; }
        
        [DataMember]
        public string Caption { get; set; }
        
        [DataMember]
        public string Threshold { get; set; }
        
        [DataMember]
        public string Regime { get; set; }
        
        [DataMember]
        public string TimeUnit { get; set; }
        
        [DataMember]
        public decimal? Year { get; set; }
        
        [DataMember]
        public string MediaType { get; set; }

        // TODO: Fix up this string Uri
        [SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "To be fixed when entities are revisited")]
        [DataMember]
        public string Uri { get; set; }
        
        [DataMember]
        public string MediaSource { get; set; }
        
        [DataMember]
        public string Attribution { get; set; }

        [DataMember]
        public int UniqueID { get; set; }

        [DataMember]
        public short? Order { get; set; }

        [DataMember]
        public bool HasBibliography { get; set; }
    }

    [DataContract]
    [NotMapped]
    public class ContentItemRaw : ContentItem
    {
        public Guid Exhibit_ID { get; set; }
    }
}