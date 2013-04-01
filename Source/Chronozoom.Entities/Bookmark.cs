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
    [DataContract(Name="BookMark")]
    public class Bookmark
    {
        [DataMember(Name="id")]
        public Guid Id { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember(Name="URL")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification="Uri not supported in entity framework.")]
        public string Url { get; set; }

        [DataMember]
        public int? LapseTime { get; set; }

        [DataMember]
        public string Description { get; set; }
    }
}