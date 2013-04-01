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
            return string.Format("[Exhibit: Title = {0}, Description = {1}, Time = {2}, ContentItems = {3}]", Title, Description, Time, ContentItems.ToString());
        }
    }
}