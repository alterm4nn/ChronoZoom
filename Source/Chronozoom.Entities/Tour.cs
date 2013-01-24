using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class Tour
    {
        [DataMember]
        public Guid ID { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public int UniqueID { get; set; }

        [DataMember]
        public string AudioBlobUrl { get; set; }

        [DataMember]
        public string Category { get; set; }

        [DataMember]
        public int? Sequence { get; set; }

        [DataMember]
        public List<BookMark> bookmarks;

        public Tour(Guid id, string name, int uniqueID, string audioBlobUrl, string category, int? sequence)
        {
            ID = id;
            Name = name;
            UniqueID = uniqueID;
            AudioBlobUrl = audioBlobUrl;
            Category = category;
            Sequence = sequence;

            bookmarks = new List<BookMark>();
        }
    }
}
