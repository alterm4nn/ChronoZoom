using System.Collections.Generic;

namespace Application.Helper.Entities
{
    public class Exhibit
    {
        public double Time { get; set; }
        public string Title  { get; set; }
        public string Description  { get; set; }
        public List<ContentItem> ContentItems { get; set; }

        public override string ToString()
        {

            string description = (Description == null) ? "" : ", Description = " + Description;
            var contentItems = (ContentItems == null) ? "" : ",  ContentItems = " + ContentItems;
            return string.Format("[Exhibit: Title = {0}{1}, Time = {2}{3}]", Title, description, Time, contentItems);
        }
    }
}