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
    /// <summary>
    /// A narrated tour with an audio track and media events that perform navigations to Timelines or Exhibits. The Tour entity is externally searchable & linkable.
    /// </summary>
    [DataContract]
    public class Tour
    {
        /// <summary>
        /// The ID of the tour.
        /// </summary>
        [Key]
        [DataMember(Name="id")]
        public Guid Id { get; set; }

        /// <summary>
        /// The name of the tour.
        /// </summary>
        [DataMember(Name = "name")]
        public string Name { get; set; }

        /// <summary>
        /// The unique ID of the tour.
        /// </summary>
        public int UniqueId { get; set; }

        /// <summary>
        /// The blob URL for an audio file.
        /// </summary>
        [SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "To be fixed when entities are revisited")]
        [DataMember(Name = "audio")]
        public string AudioBlobUrl { get; set; }

        /// <summary>
        /// The category to which the tour belongs.
        /// </summary>
        [DataMember(Name = "category")]
        public string Category { get; set; }

        /// <summary>
        /// ???
        /// </summary>
        [DataMember(Name = "sequence")]
        public int? Sequence { get; set; }

        /// <summary>
        /// The collection of bookmarks for the tour.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly"), DataMember(Name = "bookmarks")]
        public virtual Collection<Bookmark> Bookmarks { get; set; }
        
        public virtual Entities.Collection Collection { get; set; }
    }
}