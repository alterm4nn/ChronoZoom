using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class Triple
    {
        [Key]
        [DataMember]
        public Guid Id { get; set; }

        [DataMember]
        public string Subject { get; set; }

        [DataMember]
        public string Predicate { get; set; }

        [DataMember]
        public Collection<TripleObject> Objects { get; set; }
    }
}
