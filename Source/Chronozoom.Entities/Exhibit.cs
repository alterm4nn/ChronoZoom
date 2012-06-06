using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class Exhibit
    {
        [DataMember]
        public Guid ID { get; set; }
        
        [DataMember]
        public string Title { get; set; }

        [DataMember]
        public string Threshold { get; set; }

        [DataMember]
        public string Regime { get; set; }

        [DataMember]
        public string TimeUnit { get; set; }

        [DataMember]
        public int? Day { get; set; }

        [DataMember]
        public int? Month { get; set; }

        [DataMember]
        public Decimal? Year { get; set; }


        [DataMember]
        public int UniqueID { get; set; }
        
        [DataMember]
        public int? Sequence { get; set; }

        [DataMember]
        public List<ContentItem> ContentItems;

        [DataMember]
        public List<Reference> References;


        public Exhibit(Guid id, string title, string threshold, string regime, string timeUnit, int? day, int? month, Decimal? year, int uniqueID, int? sequence)
        {
            ID = id;
            Title = title;
            Threshold = threshold;
            Regime = regime;
            TimeUnit = timeUnit;
            Day = day;
            Month = month;
            Year = year;
            UniqueID = uniqueID;
            Sequence = Sequence;

            ContentItems = new List<ContentItem>();
            References = new List<Reference>();
        }
    }
}
