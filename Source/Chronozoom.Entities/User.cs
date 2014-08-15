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
        [MaxLength(50)]
        [Column(TypeName = "nvarchar")]
        public string DisplayName { get; set; }

        /// <summary>
        /// The email address of the user.
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        [MaxLength(100)]
        [Column(TypeName = "varchar")]
        public string Email { get; set; }

        [MaxLength(25)]
        [Column(TypeName = "varchar")]
        public string IdentityProvider { get; set; }

        [MaxLength(150)]
        [Column(TypeName = "varchar")]
        public string NameIdentifier { get; set; }
    }
}
