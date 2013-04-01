using System.Collections.Generic;

namespace Application.Helper.Entities
{
    public class Exhibit
    {
        public double Time { get; set; }
        public string Title  { get; set; }
        public string Description  { get; set; }
        public List<ContentItem> ContentItems = new List<ContentItem>();
    }
}