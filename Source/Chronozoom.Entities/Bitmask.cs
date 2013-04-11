using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class Bitmask
    {
        [Key]
        [DataMember]
        public long B1 { get; set; }

        [DataMember]
        public long B2 { get; set; }

        [DataMember]
        public long B3 { get; set; }

    }

}
