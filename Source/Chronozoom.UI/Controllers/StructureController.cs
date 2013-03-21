using Chronozoom.Api.Models;
using System.Collections.Generic;
using System.Web.Http;

namespace Chronozoom.Api.Controllers
{
    public class StructureController : ApiController
    {
        public Timeline Get(string lca, double start, double end, double minspan/*, int depth, int count*/)
        {
            if (string.IsNullOrEmpty(lca) || start > end || minspan < 0)
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);

            Timeline tlca =  FindTimeline(Globals.Root, lca);
            if (tlca == null)
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);

            var r = FilterTimelines(tlca, start, end, minspan);
            return r;
        }

        private static Timeline FindTimeline(Timeline timeline, string id)
        {
            if (timeline == null || string.IsNullOrEmpty(id))
                return null;

            if (timeline.id == id)
            {
                return timeline;
            }
            else
            {
                foreach (var childTimeline in timeline.timelines)
                {
                    var timelineResult = FindTimeline(childTimeline, id);
                    if (timelineResult != null)
                        return timelineResult;
                }
                return null;
            }
        }

        private static Timeline FilterTimelines(Timeline timeline, double start, double end, double minspan)
        {
            if (timeline == null)
                return null;

            if (!(timeline.start < start && timeline.end < start || timeline.start > end && timeline.end > end) 
                && (timeline.end - timeline.start >= minspan))
            {
                var timelineResult = timeline.CloneStructure();
                foreach (var exhibit in timeline.exhibits)
                    timelineResult.exhibits.Add(exhibit.CloneStructure());
                foreach (var childTimeline in timeline.timelines)
                    timelineResult.timelines.Add(FilterTimelines(childTimeline, start, end, minspan));
                return timelineResult;
            }
            else
            {
                var timelineResult = timeline.CloneStructure();
                timelineResult.exhibits = null;
                timelineResult.timelines = null;
                return timelineResult;
            }
        }
    }
}