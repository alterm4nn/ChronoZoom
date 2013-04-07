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
        public long b1 { get; set; }

        [DataMember]
        public long b2 { get; set; }

        [DataMember]
        public long b3 { get; set; }

    }

}
