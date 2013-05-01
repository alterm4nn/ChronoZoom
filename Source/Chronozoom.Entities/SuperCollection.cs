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
    /// Represents a set of collections.
    /// </summary>
    [DataContract]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1711:IdentifiersShouldNotHaveIncorrectSuffix", Justification="SuperCollection in an inherent ChronoZoom concept")]
    public class SuperCollection
    {
        /// <summary>
        /// The ID of the supercollection.
        /// </summary>
        [Key]
        [DataMember]
        public Guid Id { get; set; }

        /// <summary>
        /// The title of the supercollection.
        /// </summary>
        [DataMember]
        public string Title { get; set; }

        [Obsolete("UserId is being replaced with User")]
        [DataMember]
        public string UserId { get; set; }

        /// <summary>
        /// The user who owns the supercollection.
        /// </summary>
        [DataMember]
        public User User { get; set; }

        /// <summary>
        /// A collection of collections that belong to the supercollection.
        /// </summary>
        [DataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification="Need to be able to assemble this objects collection.")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification="Automatically implemented properties must define both get and set accessors.")]
        public virtual Collection<Entities.Collection> Collections { get; set; }
    }
}
