using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using Chronozoom.Entities;
using System.Web;
using System.Net;

namespace UI
{
    [ServiceContract(Namespace = "")]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ChronozoomSVC
    {
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<Chronozoom.Entities.Timeline> Get()
        {
            List<Chronozoom.Entities.Timeline> rootLines =
                EDMTimelineBuilder.BuildTimeLine(DataEnvironmentAccess.AnInstance);

            return rootLines;
        }

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<Chronozoom.Entities.Threshold> GetThresholds()
        {
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
        }


        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<Chronozoom.Entities.SearchResult> Search(string s)
        {
            s = s.ToLower();

            var searchResults = new List<Chronozoom.Entities.SearchResult>();
            var timelines = DataEnvironmentAccess.AnInstance.GetITimelineInfo(s);

            foreach (var timeline in timelines)
            {
                Chronozoom.Entities.SearchResult sr = new Chronozoom.Entities.SearchResult(timeline.ID,
                    timeline.Title,
                    ObjectTypeEnum.Timeline,
                    timeline.UniqueID
                    );
                searchResults.Add(sr);
            }

            var exhibits = DataEnvironmentAccess.AnInstance.GetIExhibitView(s);
            foreach (var exhibit in exhibits)
            {
                Chronozoom.Entities.SearchResult sr = new Chronozoom.Entities.SearchResult(exhibit.ID,
                    exhibit.Title,
                    ObjectTypeEnum.Exhibit,
                    exhibit.UniqueID
                    );
                searchResults.Add(sr);
            }


            var contentItems = DataEnvironmentAccess.AnInstance.GetIExhibitContentItemInfo(s);
            foreach (var contentItem in contentItems)
            {
                Chronozoom.Entities.SearchResult sr = new Chronozoom.Entities.SearchResult(contentItem.ID,
                    contentItem.Title,
                    ObjectTypeEnum.ContentItem,
                    contentItem.UniqueID
                    );
                searchResults.Add(sr);
            }

            return searchResults;
        }


        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<Chronozoom.Entities.Reference> GetBibliography(string exhibitID)
        {
            try
            {
                Guid guid;
                if (!Guid.TryParse(exhibitID, out guid))
                {
                    return null;
                }

                var references = new List<Chronozoom.Entities.Reference>();
                var exhibitReferences = DataEnvironmentAccess.AnInstance.GetIBibliographyView(guid);
                foreach (var reference in exhibitReferences)
                {
                    Chronozoom.Entities.Reference sr = new Chronozoom.Entities.Reference(reference.ID,
                        reference.Title,
                        reference.Authors,
                        reference.BookChapters,
                        reference.CitationType,
                        reference.PageNumbers,
                        reference.Publication,
                        reference.PublicationDates,
                        reference.Source
                        );
                    references.Add(sr);
                }

                return references;
            }
            catch 
            {
                //error
                return null;
            }
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
                using(var reader = new System.IO.StreamReader(rs))
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
        public List<Chronozoom.Entities.Tour> GetTours()
        {
            var tours = new List<Chronozoom.Entities.Tour>();
            var trs = DataEnvironmentAccess.AnInstance.GetITourView();
            foreach (var tour in trs)
            {
                Chronozoom.Entities.Tour t = new Chronozoom.Entities.Tour(tour.ID,
                    tour.Name,
                    tour.UniqueID,
                    tour.AudioBlobUrl,
                    tour.Category,
                    tour.Sequence
                    );
                LoadBookmark(t);
                tours.Add(t);
            }
            return tours;
        }

        private void LoadBookmark(Chronozoom.Entities.Tour tour)
        {
            var bookmarks = DataEnvironmentAccess.AnInstance.GetITourBookmarkView(tour.ID);
            var bmarks = new List<Chronozoom.Entities.BookMark>();
            foreach (var bookmark in bookmarks)
            {
                Chronozoom.Entities.BookMark b = new Chronozoom.Entities.BookMark(bookmark.ID,
                    bookmark.Name,
                    (!string.IsNullOrEmpty(bookmark.URL) && bookmark.URL.IndexOf('#') >0)  ? bookmark.URL.Substring(bookmark.URL.IndexOf('#')+1): string.Empty,
                    bookmark.LapseTime,
                    bookmark.Description
                    );
                bmarks.Add(b);
            }
            tour.bookmarks = bmarks;
        }
    }
}
