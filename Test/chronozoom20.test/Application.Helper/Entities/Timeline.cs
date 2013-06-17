using System.Runtime.Serialization;

namespace Application.Helper.Entities
{
    public class Timeline : Chronozoom.Entities.TimelineRaw
    {
        public string TimelineId { get; set; }

        public override string ToString()
        {
            string timelineId = (TimelineId == null) ? "" : ", Id = " + TimelineId;
            return string.Format("[Timeline: Title = {0}{1}]", Title, timelineId);
        }
    }
}