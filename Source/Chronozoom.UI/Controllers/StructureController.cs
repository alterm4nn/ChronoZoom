using Chronozoom.Api.Models;
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

            return FilterTimelines(tlca, start, end, minspan);
        }

        private static Timeline FindTimeline(Timeline t1, string id)
        {
            if (t1 == null || string.IsNullOrEmpty(id))
                return null;

            if (t1.id == id)
            {
                return t1;
            }
            else
            {
                foreach (var t2 in t1.timelines)
                {
                    var t3 = FindTimeline(t2, id);

                    if (t3 != null)
                        return t3;
                }

                return null;
            }
        }

        private static Timeline FilterTimelines(Timeline t1, double start, double end, double minspan)
        {
            if (t1 == null)
                return null;

            if (!(t1.start < start && t1.end < start || t1.start > end && t1.end > end) && (t1.end - t1.start >= minspan))
            {
                var t2 = t1.Clone();

                foreach (var e1 in t1.exhibits)
                {
                    var e2 = e1.Clone();
                    t2.exhibits.Add(e2);
                }

                foreach (var t3 in t1.timelines)
                {
                    t2.timelines.Add(FilterTimelines(t3, start, end, minspan));
                }

                return t2;
            }
            else
            {
                var t2 = t1.Clone();
                t2.timelines = null;
                t2.exhibits = null;
                return t2;
            }
        }
    }
}