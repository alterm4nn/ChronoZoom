using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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
        [MaxLength(4000)]
        [Column(TypeName = "nvarchar")]
        public string Title { get; set; }

        /// <summary>
        /// The user ID for the collection owner.
        /// </summary>
        [DataMember]
        public User User { get; set; }

        /// <summary>
        /// The theme (i.e. space, blue, etc) associated to this collection.
        /// </summary>
        [DataMember(Name="theme")]
        public string Theme { get; set; }

        /// <summary>SuperCollection for this collection</summary>
        public SuperCollection SuperCollection { get; set; }

        /// <summary>
        /// A list of users who have special rights to the collection, other than the collection owner.
        /// </summary>
        [DataMember]
        public virtual Collection<Member> Members { get; set; }
    }
}
