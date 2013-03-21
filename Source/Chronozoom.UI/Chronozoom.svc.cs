// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
        public IEnumerable<Timeline> Get(string start, string end, string timespan)
        {
            Trace.TraceInformation("Get Filtered Timelines");

            lock (Cache)
            {
                // use the cached data if all data has to be retrieved
                if (AllDataRequested(start, end, timespan) && Cache.Contains("Timelines"))
                {
                    Trace.TraceInformation("Get Timelines Cache Miss");
                    return (IEnumerable<Timeline>) Cache["Timelines"];
                }

                // initialize filters
                decimal startTime = string.IsNullOrWhiteSpace(start) ? -20000000000 : decimal.Parse(start);
                decimal endTime = string.IsNullOrWhiteSpace(end) ? 9999 : decimal.Parse(end);
                decimal span = string.IsNullOrWhiteSpace(timespan) ? 0 : decimal.Parse(timespan);

                Collection<Timeline> timelines = _storage.TimelinesQuery(startTime, endTime, span);

                // cache only when all data is requested
                if (AllDataRequested(start, end, timespan))
                {
                    Timeline t; // only required for caching
                    if (timelines.Any())
                    {
                        t = timelines.Single(timeline => timeline.Id == Guid.Empty); 
                    }
                    else
                    {
                        Trace.TraceInformation("No Timelines found");
                        return null;
                    }

                    Trace.TraceInformation("Add Timelines to cache");
                    Cache.Add("Timelines", new[] {t},
                              DateTime.Now.AddMinutes(int.Parse(ConfigurationManager.AppSettings["CacheDuration"],
                                                                CultureInfo.InvariantCulture)));
                }

                return (IEnumerable<Timeline>)timelines;
            }
        }

        private static bool AllDataRequested(string start, string end, string timespan)
        {
            return string.IsNullOrWhiteSpace(start) && string.IsNullOrWhiteSpace(end) && string.IsNullOrWhiteSpace(timespan);
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
                Trace.TraceEvent(TraceEventType.Warning, 0, "Search called with null search term");
                return null;
            }

            searchTerm = searchTerm.ToUpperInvariant();

            var timelines = _storage.Timelines.Where(_ => _.Title.ToUpper().Contains(searchTerm)).ToList();
            var searchResults = timelines.Select(timeline => new SearchResult { Id = timeline.Id, Title = timeline.Title, ObjectType = ObjectType.Timeline, UniqueId = timeline.UniqueId }).ToList();

            var exhibits = _storage.Exhibits.Where(_ => _.Title.ToUpper().Contains(searchTerm)).ToList();
            searchResults.AddRange(exhibits.Select(exhibit => new SearchResult { Id = exhibit.Id, Title = exhibit.Title, ObjectType = ObjectType.Exhibit, UniqueId = exhibit.UniqueId }));

            var contentItems = _storage.ContentItems.Where(_ => _.Title.ToUpper().Contains(searchTerm) || _.Caption.ToUpper().Contains(searchTerm)).ToList();
            searchResults.AddRange(contentItems.Select(contentItem => new SearchResult { Id = contentItem.Id, Title = contentItem.Title, ObjectType = ObjectType.ContentItem, UniqueId = contentItem.UniqueId }));

            Trace.TraceInformation("Search called for search term {0}", searchTerm);
            return searchResults;
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public IEnumerable<Reference> GetBibliography(string exhibitId)
        {
            Guid guid;
            if (!Guid.TryParse(exhibitId, out guid))
            {
                Trace.TraceEvent(TraceEventType.Warning, 0, "GetBibliography called with invalid Id {0}", exhibitId);
                return null;
            }

            var exhibit = _storage.Exhibits.Find(guid);
            if (exhibit == null)
            {
                Trace.TraceEvent(TraceEventType.Warning, 0, "GetBibliography called, no matching exhibit found with Id {0}", exhibitId);
                return null;
            }

            Trace.TraceInformation("GetBibliography called for Exhibit Id {0}", exhibitId);
            _storage.Entry(exhibit).Collection(_ => _.References).Load();
            return exhibit.References.ToList();
        }

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        [
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
                        _storage.Entry(t).Collection(x => x.Bookmarks).Load();
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