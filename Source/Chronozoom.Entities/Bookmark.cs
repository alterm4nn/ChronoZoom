// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    public enum BookmarkType
    {
        Timeline = 0,
        Exhibit = 1,
        ContentItem = 2,
    }

    [DataContract(Name="BookMark")]
    public class Bookmark
    {
        [DataMember(Name="id")]
        public Guid Id { get; set; }

        [DataMember(Name="name")]
        public string Name { get; set; }

        [DataMember(Name="url")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification="Uri not supported in entity framework.")]
        public string Url { get; set; }

        [DataMember(Name = "referenceType")]
        public BookmarkType ReferenceType { get; set; }

        [DataMember(Name = "referenceId")]
        public Guid ReferenceId { get; set; }

        [DataMember(Name = "lapseTime")]
        public int? LapseTime { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }
    }
}