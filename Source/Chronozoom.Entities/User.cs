using System;
using System.Collections.Generic;
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
        [DataMember]
        public Guid Id { get; set; }

        /// <summary>
        /// The display name of the user.
        /// </summary>
        [DataMember]
        public string DisplayName { get; set; }

        /// <summary>
        /// The email address of the user.
        /// </summary>
        [DataMember]
        public string Email { get; set; }

        public string NameIdentifier { get; set; }
        public string IdentityProvider { get; set; }
    }
}
