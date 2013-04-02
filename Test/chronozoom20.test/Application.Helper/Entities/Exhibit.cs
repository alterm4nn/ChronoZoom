using System.Collections.Generic;

namespace Application.Helper.Entities
{
    public class Exhibit
    {
        public double Time { get; set; }
        public string Title  { get; set; }
        public List<ContentItem> ContentItems { get; set; }

        public override string ToString()
        {
            var contentItemsCount = (ContentItems == null) ? "" : ",  ContentItemsCount = " + ContentItems.Count;
            return string.Format("[Exhibit: Title = {0}, Time = {1}{2}]", Title, Time, contentItemsCount);
        }
    }
}