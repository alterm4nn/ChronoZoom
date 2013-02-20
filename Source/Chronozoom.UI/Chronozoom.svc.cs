// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using System.Runtime.Caching;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;

using Chronozoom.Entities;

namespace UI
{
    [SuppressMessage("Microsoft.Design", "CA1063:ImplementIDisposableCorrectly", Justification = "No unmanaged handles")]
    [ServiceContract(Namespace = "")]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ChronozoomSVC : IDisposable
    {
        private static readonly MemoryCache Cache = new MemoryCache("Storage");

        private static readonly TraceSource Trace = new TraceSource("Service", SourceLevels.All) { Listeners = { Global.SignalRTraceListener } };
        private readonly Storage _storage = new Storage();

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public IEnumerable<Timeline> Get()
        {
            Trace.TraceInformation("Get Timelines");

            lock (Cache)
            {
                if (!Cache.Contains("Timelines"))
                {
                    Trace.TraceInformation("Get Timelines Cache Miss");
                    var t = _storage.Timelines.Find(new Guid("468A8005-36E3-4676-9F52-312D8B6EB7B7")); // Hardcoded 'root' timeline :-(
                    LoadChildren(t);

                    Cache.Add("Timelines", new [] { t }, DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"], CultureInfo.InvariantCulture)));
                }

                return (IEnumerable<Timeline>)Cache["Timelines"];
            }
        }

        private void LoadChildren(Timeline t)
        {
            _storage.Entry(t).Collection(_ => _.Exhibits).Load();

            foreach (var e in t.Exhibits)
            {
                _storage.Entry(e).Collection(_ => _.ContentItems).Load();
            }

            _storage.Entry(t).Collection(_ => _.ChildTimelines).Load();

            foreach (var c in t.ChildTimelines)
            {
                LoadChildren(c);
            }
        }

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public IEnumerable<Threshold> GetThresholds()
        {
            Trace.TraceInformation("Get Thresholds");

            lock (Cache)
            {
                if (!Cache.Contains("Thresholds"))
                {
                    Trace.TraceInformation("Get Thresholds Cache Miss");
                    Cache.Add("Thresholds", _storage.Thresholds.ToList(), DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"], CultureInfo.InvariantCulture)));
                }

                return (List<Threshold>)Cache["Thresholds"];
            }
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public IEnumerable<SearchResult> Search(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return null;
            }

            searchTerm = searchTerm.ToUpperInvariant();

            var timelines = _storage.Timelines.Where(_ => _.Title.ToUpperInvariant().Contains(searchTerm)).ToList();
            var searchResults = timelines.Select(timeline => new SearchResult { ID = timeline.ID, Title = timeline.Title, ObjectType = ObjectTypeEnum.Timeline, UniqueID = timeline.UniqueID }).ToList();

            var exhibits = _storage.Exhibits.Where(_ => _.Title.ToUpperInvariant().Contains(searchTerm)).ToList();
            searchResults.AddRange(exhibits.Select(exhibit => new SearchResult { ID = exhibit.ID, Title = exhibit.Title, ObjectType = ObjectTypeEnum.Exhibit, UniqueID = exhibit.UniqueID }));

            var contentItems = _storage.ContentItems.Where(_ => _.Title.ToUpperInvariant().Contains(searchTerm) || _.Caption.ToUpperInvariant().Contains(searchTerm)).ToList();
            searchResults.AddRange(contentItems.Select(contentItem => new SearchResult { ID = contentItem.ID, Title = contentItem.Title, ObjectType = ObjectTypeEnum.ContentItem, UniqueID = contentItem.UniqueID }));

            return searchResults;
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public IEnumerable<Reference> GetBibliography(string exhibitId)
        {
            Guid guid;
            return !Guid.TryParse(exhibitId, out guid) ? null : _storage.Exhibits.First(_ => _.ID == guid).References.ToList();
        }

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")][
        OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public IEnumerable<Tour> GetTours()
        {
            Trace.TraceInformation("Get Tours");

            lock (Cache)
            {
                if (!Cache.Contains("Tours"))
                {
                    Trace.TraceInformation("Get Tours Cache Miss");
                    var tours = _storage.Tours.ToList();
                    foreach (var t in tours)
                    {
                        _storage.Entry(t).Collection(x => x.bookmarks).Load();
                    }

                    Cache.Add("Tours", tours, DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"], CultureInfo.InvariantCulture)));
                }

                return (List<Tour>)Cache["Tours"];
            }
        }

        [SuppressMessage("Microsoft.Design", "CA1063:ImplementIDisposableCorrectly", Justification = "No unmanaged handles")]
        public void Dispose()
        {
            _storage.Dispose();

            GC.SuppressFinalize(this);
        }
    }
}