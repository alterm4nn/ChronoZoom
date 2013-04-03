using System.Collections.Generic;

namespace Application.Helper.Entities
{
    public class Timeline : Chronozoom.Entities.Timeline
    {
        public string TimelineId { get; set; }

        public override string ToString()
        {
            string timelineId = (TimelineId == null) ? "" : ", Id = " + TimelineId;
            return string.Format("[Timeline: Title = {0}{1}]", Title, timelineId);
        }
    }
}