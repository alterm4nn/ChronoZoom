using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class Timeline
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
        public string FromTimeUnit { get; set; }
        [DataMember]
        public int? FromDay { get; set; }
        [DataMember]
        public int? FromMonth { get; set; }
        [DataMember]
        public Decimal? FromYear { get; set; }
        [DataMember]
        public string ToTimeUnit { get; set; }
        [DataMember]
        public int? ToDay { get; set; }
        [DataMember]
        public int? ToMonth { get; set; }
        [DataMember]
        public Decimal? ToYear { get; set; }
        [DataMember]
        public int UniqueID { get; set; }
        [DataMember]
        public int? Sequence { get; set; }
        [DataMember]
        public decimal? Height { get; set; }

        [DataMember]
        public List<Timeline> ChildTimelines;
        [DataMember]
        public List<Exhibit> Exhibits;

        public Timeline(Guid id, string title, string threshold, string regime, string fromTimeUnit, int? fromDay, int? fromMonth, Decimal? fromYear, string toTimeUnit, int? toDay, int? toMonth, Decimal? toYear, int uniqueID, int? sequence, decimal? height)
        {
            ID = id;
            Title = title;
            Threshold = threshold;
            Regime = regime;
            FromTimeUnit = fromTimeUnit;
            FromDay = fromDay;
            FromMonth = fromMonth;
            FromYear = fromYear;
            ToTimeUnit = toTimeUnit;
            ToDay = toDay;
            ToMonth = toMonth;
            ToYear = toYear;
            UniqueID = uniqueID;
            Sequence = sequence;
            Height = height;

            ChildTimelines = new List<Timeline>();
            Exhibits = new List<Exhibit>();
        }
    }
}
