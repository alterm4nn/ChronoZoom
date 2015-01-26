using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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
        /// Constructor used to set default values.
        /// </summary>
        public SuperCollection()
        {
            this.Id = Guid.NewGuid();   // Don't use [DatabaseGenerated(DatabaseGeneratedOption.Identity)] on Id
        }

        /// <summary>
        /// The ID of the supercollection.
        /// </summary>
        [Key]
        [DataMember]
        public Guid Id { get; set; }

        /// <summary>
        /// The path from the web root to the the supercollection.  Title must therefore have a globally unique value.
        /// Is programmatically derived as a URL-sanitized version of user's display name using a-z, 0-9 and hyphen only.
        /// </summary>
        [DataMember]
        [Required]
        [MaxLength(50)]
        [Column(TypeName = "varchar")]
        public string Title { get; set; }

        /// <summary>
        /// The user who owns the supercollection.
        /// </summary>
        [DataMember]
        [Required]
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
