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
            if (operation == null || timeline == null) return;

            operation(timeline);
            if (timeline.ChildTimelines == null) return;

            foreach (Timeline childTimeline in timeline.ChildTimelines)
            {
                Traverse(childTimeline, operation);
            }
        }

        public static List<Guid> Ancestors(this Timeline descendant)
        {
            List<Guid> rv = new List<Guid>();

            Timeline timeline = descendant;
            Guid[] searchTerm;

            using (Storage storage = new Storage())
            {
                while (timeline != null)
                {
                    rv.Add(timeline.Id);
                    searchTerm = new Guid[] { timeline.Id };
                    timeline = storage.Timelines.Where(t => t.ChildTimelines.Any(ct => searchTerm.Contains(ct.Id))).FirstOrDefault(); // get parent if exists
                }
            }

            return rv;
        }
    }
}
