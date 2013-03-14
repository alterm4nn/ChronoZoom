// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.ObjectModel;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class Tour
    {
        [DataMember(Name="ID")]
        public Guid Id { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember(Name="UniqueID")]
        public int UniqueId { get; set; }

        // TODO: Fix up this string Uri
        [SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "To be fixed when entities are revisited")]
        [DataMember]
        public string AudioBlobUrl { get; set; }

        [DataMember]
        public string Category { get; set; }

        [DataMember]
        public int? Sequence { get; set; }

        [DataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification="Automatically implemented properties must define both get and set accessors.")]
        public virtual Collection<Bookmark> Bookmarks { get; private set; }
    }
}