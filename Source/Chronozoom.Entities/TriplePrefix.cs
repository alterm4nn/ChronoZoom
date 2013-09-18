using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class TriplePrefix
    {
        [Key]
        [DataMember]
        public string Prefix { get; set; }

        [DataMember]
        public string Namespace { get; set; }
    }
}
