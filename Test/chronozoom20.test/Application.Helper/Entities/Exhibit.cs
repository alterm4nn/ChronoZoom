using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using Chronozoom.Entities;

namespace Application.Helper.Entities
{
    [DataContract]
    [NotMapped]
    public class Exhibit : ExhibitRaw
    {
        public string TimeMode { get; set; }
        public string Month { get; set; }
        public string Day { get; set; }

        public override string ToString()
        {
            var contentItemsCount = (ContentItems == null) ? "" : ",  ContentItemsCount = " + ContentItems.Count;
            var month = (Month == null) ? "" : ",  month = " + Month;
            var day = (Day == null) ? "" : ",  day = " + Day;
            return string.Format("[Exhibit: Title = {0}, Year = {1}{2}{3}{4}]", Title, Year, month, day, contentItemsCount);
        }
    }
}