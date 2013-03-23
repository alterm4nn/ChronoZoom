﻿using Chronozoom.Api.Models;
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
        public List<TimelineWithChildTimelineIds> timelines = new List<TimelineWithChildTimelineIds>();
        public List<Exhibit> exhibits = new List<Exhibit>();
        public List<ContentItem> contentItems = new List<ContentItem>();
    }   
}