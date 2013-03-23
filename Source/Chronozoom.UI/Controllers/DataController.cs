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
                var dictIds = new Dictionary<string, bool>();
                foreach (var id in request.ids) dictIds.Add(id, true);
                var dictTimelines = new Dictionary<string, TimelineWithChildTimelineIds>();
                var dictExhibits = new Dictionary<string, Exhibit>();
                var dictContentItems = new Dictionary<string, ContentItem>();
                FindElements(Globals.Root, dictIds, dictTimelines, dictExhibits, dictContentItems);

                TimelineWithChildTimelineIds timeline;
                Exhibit exhibit;
                ContentItem contentItem;

                var response = new PostDataResponse();
                foreach (var id in request.ids)
                {
                    if (dictTimelines.TryGetValue(id, out timeline))
                        response.timelines.Add(timeline);
                    else if (dictExhibits.TryGetValue(id, out exhibit))
                        response.exhibits.Add(exhibit);
                    else if (dictContentItems.TryGetValue(id, out contentItem))
                        response.contentItems.Add(contentItem);
                }
                return response;
            }
            else
            {
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
            }
        }
     
        private void FindElements(
            Timeline timeline, 
            Dictionary<string, bool> ids, 
            Dictionary<string, TimelineWithChildTimelineIds> dictTimelines, 
            Dictionary<string, Exhibit> dictExhibits, 
            Dictionary<string, ContentItem> dictContentItems)
        {
            if (ids.ContainsKey(timeline.id))
                dictTimelines.Add(timeline.id, timeline.CloneData());

            foreach (var exhibit in timeline.exhibits)
            {
                if (ids.ContainsKey(exhibit.id))
                    dictExhibits.Add(exhibit.id, exhibit.CloneData());

                foreach (var contentItem in exhibit.contentItems)
                    if (ids.ContainsKey(contentItem.id))
                        dictContentItems.Add(contentItem.id, contentItem.CloneData());
            }

            foreach (var childTimeline in timeline.timelines)
                FindElements(childTimeline, ids, dictTimelines, dictExhibits, dictContentItems);
        }
    }
}