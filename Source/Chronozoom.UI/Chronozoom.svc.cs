// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;

using Chronozoom.Entities;

namespace UI
{
    [ServiceContract(Namespace = "")]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ChronozoomSVC
    {
        private readonly Storage storage = new Storage();

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<Timeline> Get()
        {
            var timelines = this.storage.Timelines.ToList();
            foreach (var t in timelines)
            {
                this.storage.Entry(t).Collection(x => x.Exhibits).Load();
                this.storage.Entry(t).Collection(x => x.ChildTimelines).Load();
            }

            return timelines;
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<Threshold> GetThresholds()
        {
            /*
            var Thresholds = DataEnvironmentAccess.AnInstance.GetIThresholdView();
            var tholds = new List<Chronozoom.Entities.Threshold>();
            foreach (var threshold in Thresholds)
            {
                try
                {
                    Chronozoom.Entities.Threshold th = new Chronozoom.Entities.Threshold(threshold.Threshold,
                        threshold.Timeunit,
                        threshold.ThresholdDate.HasValue == true ? threshold.ThresholdDate.Value.Day : 0,
                        threshold.ThresholdDate.HasValue == true ? threshold.ThresholdDate.Value.Month : 0,
                        threshold.ThresholdYear,
                        threshold.ShortDescription,
                        (!string.IsNullOrEmpty(threshold.URL) && threshold.URL.IndexOf('#') >0)  ? threshold.URL.Substring(threshold.URL.IndexOf('#')+1): string.Empty
                        );
                    tholds.Add(th);
                }
                catch
                {
                    //error
                }
            }
            return tholds;
            */
            return this.storage.Thresholds.ToList();
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<SearchResult> Search(string s)
        {
            s = s.ToLower();

            var timelines = this.storage.Timelines.ToList(); // TODO: Search on s

            var searchResults = timelines.Select(
                timeline => new SearchResult(timeline.ID, timeline.Title, ObjectTypeEnum.Timeline, timeline.UniqueID)).ToList();

            var exhibits = this.storage.Exhibits.ToList(); // TODO: Search on s
            searchResults.AddRange(
                exhibits.Select(exhibit => new SearchResult(exhibit.ID, exhibit.Title, ObjectTypeEnum.Exhibit, exhibit.UniqueID)));

            var contentItems = this.storage.ContentItems.ToList(); // TODO: Search on s
            searchResults.AddRange(
                contentItems.Select(contentItem => new SearchResult(contentItem.ID, contentItem.Title, ObjectTypeEnum.ContentItem, contentItem.UniqueID)));
            return searchResults;
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<Reference> GetBibliography(string exhibitID)
        {
            Guid guid;
            return !Guid.TryParse(exhibitID, out guid) ? null : this.storage.References.ToList(); // TODO: filter by exhibitID
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public string GetBibliographyRelay(string exhibitID)
        {
            try
            {
                var req = WebRequest.Create("http://[Your domain]/Chronozoom.svc/GetBibliography?exhibitID=" + exhibitID);
                var resp = req.GetResponse();
                using (var rs = resp.GetResponseStream())
                using (var reader = new System.IO.StreamReader(rs))
                {
                    var result = reader.ReadToEnd();
                    if (result.StartsWith("{\"d\":"))
                    {
                        result = result.Substring(5, result.Length - 5 - 1);
                    }

                    return result;
                }
            }
            catch (Exception ex)
            {
                return "{Error: " + ex.Message + "}";
            }
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public string SearchRelay(string s)
        {
            try
            {
                var req = WebRequest.Create("http://[Your domain]/Chronozoom.svc/search?s=" + s);
                var resp = req.GetResponse();
                using (var rs = resp.GetResponseStream())
                using (var reader = new System.IO.StreamReader(rs))
                {
                    var result = reader.ReadToEnd();
                    if (result.StartsWith("{\"d\":"))
                    {
                        result = result.Substring(5, result.Length - 5 - 1);
                    }

                    return result;
                }
            }
            catch (Exception ex)
            {
                return "{Error: " + ex.Message + "}";
            }
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<Tour> GetTours()
        {
            var tours = this.storage.Tours.ToList();
            foreach (var t in tours)
            {
                this.storage.Entry(t).Collection(x => x.bookmarks).Load();
            }

            return tours;
        }
    }
}