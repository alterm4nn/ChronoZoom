using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class Threshold
    {
        [DataMember]
        public string Title { get; set; }
        [DataMember]
        public string ThresholdTimeUnit { get; set; }
        [DataMember]
        public int ThresholdDay { get; set; }
        [DataMember]
        public int ThresholdMonth { get; set; }
        [DataMember]
        public Decimal? ThresholdYear { get; set; }
        [DataMember]
        public string Description { get; set; }
        [DataMember]
        public string BookmarkRelativePath { get; set; }

        public Threshold(string title, string thresholdTimeUnit, int thresholdDay, int thresholdMonth, Decimal? thresholdYear, string description, string bookmarkRelativePath)
        {
            this.Title = title;
            this.ThresholdTimeUnit = thresholdTimeUnit;
            this.ThresholdDay = thresholdDay;
            this.ThresholdMonth = thresholdMonth;
            this.ThresholdYear = thresholdYear;
            this.Description = description;
            this.BookmarkRelativePath = bookmarkRelativePath;
        }
    }
}
