using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class Bitmask
    {
        /*
         * TODO: B1 cannot be a key
         * need to apply migration that adds a dummy key member and
         * removes "[key]" attribute of B1 to ensure correctness of
         * the RI tree index
         */
        [Key]
        [DataMember]
        public long B1 { get; set; }

        [DataMember]
        public long B2 { get; set; }

        [DataMember]
        public long B3 { get; set; }
    }

}
