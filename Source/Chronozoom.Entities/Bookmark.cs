using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class BookMark
    {
        [DataMember]
        public Guid ID { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string URL { get; set; }
        [DataMember]
        public int? LapseTime { get; set; }
        [DataMember]
        public string Description { get; set; }

        public BookMark(Guid id, string name, string url, int? lapseTime, string description)
        {
            ID = id;
            Name = name;
            URL = url;
            LapseTime = lapseTime;
            Description = description;
        }
    }
}
