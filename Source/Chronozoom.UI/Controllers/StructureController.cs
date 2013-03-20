using Chronozoom.Api.Models;
using System.Web.Http;

namespace UI.Controllers
{
    public class StructureController : ApiController
    {
        public Timeline Get(string lca, double start, double end, double minspan/*, int depth, int count*/)
        {
            if (string.IsNullOrEmpty(lca) || start > end || minspan < 0)
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);

            Timeline tlca = Globals.Root.FindTimeline(lca);
            if (tlca == null)
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);

            return tlca.FilterTimelines(start, end, minspan);
        }
    }
}