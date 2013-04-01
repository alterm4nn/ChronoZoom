using System.Collections.Generic;

namespace Application.Helper.Entities
{
    public class Timeline
    {
        public string Parent { get; set; }
        public double Start { get; set; }
        public double End { get; set; }
        public string Title { get; set; }
        public List<Exhibit> Exhibits { get; set; }
        public List<Timeline> Timelines { get; set; }

        public override string ToString()
        {
            return string.Format("[Timeline: Title = {0}]", Title);
        }
    }
}