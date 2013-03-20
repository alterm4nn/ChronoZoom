using Chronozoom.Api.Models;
using Chronozoom.Api.Wrappers;
using System.Collections.Generic;
using System.Web.Http;

namespace Chronozoom.Api.Controllers
{
    public class DataController : ApiController
    {
        // todo: implement filtering using searchString and entityType
        public PostDataResponse Post(PostDataRequest request)
        {
            if (request.ids != null && request.ids.Count > 0)
            {
                var response = new PostDataResponse();
                FindElements(Globals.Root, request.ids, ref response);
                return response;
            }
            else
            {
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
            }
        }
     
        private void FindElements(Timeline timeline, List<string> ids, ref PostDataResponse response)
        {
            if (ids.Contains(timeline.id))
                response.timelines.Add(timeline.Clone());

            foreach (var exhibit in timeline.exhibits)
            {
                if (ids.Contains(exhibit.id))
                    response.exhibits.Add(exhibit.Clone());

                foreach (var contentItem in exhibit.contentItems)
                    if (ids.Contains(contentItem.id))
                        response.contentItems.Add(contentItem.Clone());
            }

            foreach (var childTimeline in timeline.timelines)
                FindElements(childTimeline, ids, ref response);
        }
    }
}