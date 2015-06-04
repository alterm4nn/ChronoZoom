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
    [DataContract]
    public class User
    {
        /// <summary>
        /// Constructor used to set default values.
        /// </summary>
        public User()
        {
            this.Id = Guid.NewGuid();   // Don't use [DatabaseGenerated(DatabaseGeneratedOption.Identity)] on Id
        }

        [Key]
        [DataMember(EmitDefaultValue=false)]
        public Guid Id { get; set; }

        [DataMember(EmitDefaultValue = false)]
        [Required]
        [MaxLength(50)]
        [Column(TypeName = "nvarchar")]
        public string DisplayName { get; set; }

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

        [MaxLength(150)]
        [Column(TypeName = "varchar")]
        public string Subject { get; set; }
    }
}
