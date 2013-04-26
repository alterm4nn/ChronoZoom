// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class Tour
    {
        [Key]
        [DataMember(Name="id")]
        public Guid Id { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        public int UniqueId { get; set; }

        [SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "To be fixed when entities are revisited")]
        [DataMember(Name = "audio")]
        public string AudioBlobUrl { get; set; }

        [DataMember(Name = "category")]
        public string Category { get; set; }

        [DataMember(Name = "sequence")]
        public int? Sequence { get; set; }

        [DataMember(Name = "bookmarks")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification="Automatically implemented properties must define both get and set accessors.")]
        public virtual Collection<Bookmark> Bookmarks { get; private set; }

        public virtual Entities.Collection Collection { get; set; }
    }
}