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
    [DataContract]
    public class User
    {
        [Key]
        [DataMember]
        public Guid Id { get; set; }

        [DataMember]
        public string DisplayName { get; set; }

        [DataMember]
        public string Email { get; set; }

        public string NameIdentifier { get; set; }
        public string IdentityProvider { get; set; }
    }
}
