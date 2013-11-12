using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class TripleObject
    {
        [Key]
        [DataMember]
        public Guid TripleObject_Id { get; set; }

        [DataMember]
        public string @Object { get; set; }
    }
}
