using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chronozoom.Entities
{
    public delegate void TraverseOperation(Timeline timeline);
    public static class TimelineExtensions
    {
        public static void Traverse(this Timeline timeline, TraverseOperation operation)
        {
            if (operation ==null || timeline == null)
                return;

            operation(timeline);
            if (timeline.ChildTimelines == null) return;
            foreach (Timeline childTimeline in timeline.ChildTimelines)
            {
                Traverse(childTimeline, operation);
            }
        }
    }
}
