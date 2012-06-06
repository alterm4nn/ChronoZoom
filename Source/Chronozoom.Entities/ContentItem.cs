using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class ContentItem
    {
        [DataMember]
        public Guid ID { get; set; }
        
        [DataMember]
        public string Title { get; set; }
        
        [DataMember]
        public string Caption { get; set; }
        
        [DataMember]
        public string Threshold { get; set; }
        
        [DataMember]
        public string Regime { get; set; }
        
        [DataMember]
        public string TimeUnit { get; set; }
        
        [DataMember]
        public DateTimeOffset? Date { get; set; }
        
        [DataMember]
        public Decimal? Year { get; set; }
        
        [DataMember]
        public string MediaType { get; set; }
        
        [DataMember]
        public string Uri { get; set; }
        
        [DataMember]
        public string MediaSource { get; set; }
        
        [DataMember]
        public string Attribution { get; set; }

        [DataMember]
        public int UniqueID { get; set; }

        [DataMember]
        public short? Order { get; set; }

        [DataMember]
        public bool HasBibliography { get; set; }

        public ContentItem(Guid id, string title, string caption, string threshold, string regime, string timeUnit, DateTimeOffset? date, Decimal? year, string mediaType, string uri, string mediaSource, string attribution, int uniqueID, short? order)
        {
            ID = id;
            Title = title;
            Caption = caption;
            Threshold = threshold;
            Regime = regime;
            TimeUnit = timeUnit;
            Date = date;
            Year = year;
            MediaType = mediaType;
            Uri = uri;
            MediaSource = mediaSource;
            Attribution = attribution;
            UniqueID = uniqueID;
            Order = order;
        }
    }
}
