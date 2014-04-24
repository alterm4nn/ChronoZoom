using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    // A collection can have a list of users other than the collection owner which have edit or other special rights.

    [DataContract]
    public class Member
    {
        [Key]
        [DataMember]
        public Guid Id { get; set; }

        [DataMember]
        public Collection Collection { get; set; }

        [DataMember]
        public User User { get; set; }

        [DataMember]
        public Role Role { get; set; }
    }
}
