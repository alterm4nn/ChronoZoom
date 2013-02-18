// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Runtime.Caching;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;

using Chronozoom.Entities;

namespace UI
{
    [ServiceContract(Namespace = "")]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ChronozoomSVC : IDisposable
    {
        private readonly TraceSource _trace = new TraceSource("Service", SourceLevels.All) { Listeners = { Global.SignalRTraceListener }};
        private readonly Storage _storage = new Storage();
        private static readonly MemoryCache Cache = new MemoryCache("Storage");

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<Timeline> Get()
        {
            _trace.TraceInformation("Get Timelines");

            lock (Cache)
            {
                if (!Cache.Contains("Timelines"))
                {
                    _trace.TraceInformation("Get Timelines Cache Miss");
                    var timelines = _storage.Timelines.ToList();
                    foreach (var t in timelines)
                    {
                        _storage.Entry(t).Collection(x => x.Exhibits).Load();
                        _storage.Entry(t).Collection(x => x.ChildTimelines).Load();
                    }
                    Cache.Add("Timelines", timelines, DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"])));
                }

                return (List<Timeline>)Cache["Timelines"];
            }
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<Threshold> GetThresholds()
        {
            _trace.TraceInformation("Get Thresholds");

            lock (Cache)
            {
                if (!Cache.Contains("Thresholds"))
                {
                    _trace.TraceInformation("Get Thresholds Cache Miss");
                    Cache.Add("Thresholds", _storage.Thresholds.ToList(), DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"])));
                }

                return (List<Threshold>)Cache["Thresholds"];
            }
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<SearchResult> Search(string s)
        {
            s = s.ToLower();

            var timelines = _storage.Timelines.Where(_ => _.Title.Contains(s)).ToList();
            var searchResults = timelines.Select(timeline => new SearchResult(timeline.ID, timeline.Title, ObjectTypeEnum.Timeline, timeline.UniqueID)).ToList();

            var exhibits = _storage.Exhibits.Where(_ => _.Title.Contains(s)).ToList();
            searchResults.AddRange(exhibits.Select(exhibit => new SearchResult(exhibit.ID, exhibit.Title, ObjectTypeEnum.Exhibit, exhibit.UniqueID)));

            var contentItems = _storage.ContentItems.Where(_ => _.Title.Contains(s) || _.Caption.Contains(s)).ToList();
            searchResults.AddRange(contentItems.Select(contentItem => new SearchResult(contentItem.ID, contentItem.Title, ObjectTypeEnum.ContentItem, contentItem.UniqueID)));

            return searchResults;
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<Reference> GetBibliography(string exhibitId)
        {
            Guid guid;
            return !Guid.TryParse(exhibitId, out guid) ? null : _storage.Exhibits.First(_ => _.ID == guid).References.ToList();
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<Tour> GetTours()
        {
            _trace.TraceInformation("Get Tours");

            lock (Cache)
            {
                if (!Cache.Contains("Tours"))
                {
                    _trace.TraceInformation("Get Tours Cache Miss");
                    var tours = _storage.Tours.ToList();
                    foreach (var t in tours)
                    {
                        _storage.Entry(t).Collection(x => x.bookmarks).Load();
                    }
                    Cache.Add("Tours", tours, DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"])));
                }

                return (List<Tour>)Cache["Tours"];
            }
        }

        public void Dispose()
        {
            _storage.Dispose();
        }
    }
}