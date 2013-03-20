using Chronozoom.Api.Models;
using System.Collections.Generic;

namespace Chronozoom.Api.Wrappers
{
    public class PostDataRequest
    {
        public List<string> ids;
        public string searchString;
        public string entityType;
    }

    public class PostDataResponse
    {
        public List<Timeline> timelines;
        public List<Exhibit> exhibits;
        public List<ContentItem> contentItems;
    }   
}