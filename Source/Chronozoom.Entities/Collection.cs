// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    /// <summary>
    /// Represents a collection of timelines.
    /// </summary>
    [DataContract]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1711:IdentifiersShouldNotHaveIncorrectSuffix")]
    public class Collection
    {
        /// <summary>
        /// The ID of the collection.
        /// </summary>
        [Key]
        [DataMember]
        public Guid Id { get; set; }

        /// <summary>
        /// The title of the collection.
        /// </summary>
        [DataMember]
        public string Title { get; set; }

        [Obsolete("UserId is being replaced with User")]
        [DataMember]
        public string UserId { get; set; }

        /// <summary>
        /// The user ID for the collection owner.
        /// </summary>
        [DataMember]
        public User User { get; set; }
    }
}
