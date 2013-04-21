using System;
using System.Collections.Generic;
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
        [DataMember]
        public Guid Id { get; set; }

        [DataMember]
        public string DisplayName { get; set; }

        [DataMember]
        public string Email { get; set; }

        [DataMember]
        [NotMapped]
        public string NameIdentifier { get; set; }

        [DataMember]
        [NotMapped]
        public string IdentityProvider { get; set; }
    }
}
