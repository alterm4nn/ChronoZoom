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
        public int ID { get; set; }

        [DataMember]
        public Int64 B1 { get; set; }

        [DataMember]
        public Int64 B2 { get; set; }

        [DataMember]
        public Int64 B3 { get; set; }
    }

}
