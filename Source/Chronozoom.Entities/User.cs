using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Chronozoom.Entities
{
    /// <summary>
    /// A registered user.
    /// </summary>
    [DataContract]
    public class User
    {
        /// <summary>
        /// The ID of the user.
        /// </summary>
        [Key]
        [DataMember(EmitDefaultValue=false)]
        public Guid Id { get; set; }

        /// <summary>
        /// The display name of the user.
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        [MaxLength(4000)]
        [Column(TypeName = "nvarchar")]
        public string DisplayName { get; set; }

        /// <summary>
        /// The email address of the user.
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        [MaxLength(4000)]
        [Column(TypeName = "nvarchar")]
        public string Email { get; set; }

        [MaxLength(4000)]
        [Column(TypeName = "nvarchar")]
        public string NameIdentifier { get; set; }

        [MaxLength(4000)]
        [Column(TypeName = "nvarchar")]
        public string IdentityProvider { get; set; }

        /// <summary>
        /// A list of collections where this user has special rights, other than being the collection owner.
        /// </summary>
        [DataMember]
        public virtual Collection<Member> Memberships { get; set; }
    }
}
