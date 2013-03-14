using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using System.Net;
using System.IO;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text.RegularExpressions;



namespace Chronozoom.Test.GeneralTests
{
    [DataContract]
    public class TimelineQueryResult
    {
        [DataMember]
        public List<Chronozoom.Entities.Timeline> d;
    }

    [DataContract]
    public class ThesholdsQueryResult
    {
        [DataMember]
        public List<Chronozoom.Entities.Threshold> d;
    }

    [DataContract]
    public class ToursQueryResult
    {
        [DataMember]
        public List<Chronozoom.Entities.Tour> d;
    }

    [DataContract]
    public class SearchQueryResult
    {
        [DataMember]
        public List<Chronozoom.Entities.SearchResult> d;
    }

    [TestClass]
    public class ServiceTests
    {
        static string endpointVerb = "http://{0}/chronozoom.svc/{1}";
        static string endpointSearch = "http://{0}/chronozoom.svc/search?s={1}";

        static string serviceUrl = "chronozoomui.cloudapp.net";

        static string verbDefault = "get";
        static string verbThresholds = "getThresholds";
        static string verbTours = "getTours";

        [TestMethod]
        public void TestFirstTimelineRequest()
        {
            string endPoint = String.Format(endpointVerb, serviceUrl, verbDefault);
            HttpWebRequest request = CreateRequest(endPoint);

            WebResponse response = request.GetResponse();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(TimelineQueryResult));
            TimelineQueryResult timelines = (TimelineQueryResult)serializer.ReadObject(response.GetResponseStream());

            Assert.AreNotEqual<int>(0, timelines.d.Count, "No timelines returned");

            Assert.AreEqual<int>(1, timelines.d.Count, "Expecting one root timeline");
        }

        [TestMethod]
        public void TestTimelineUniqueId()
        {
            string endPoint = String.Format(endpointVerb, serviceUrl, verbDefault);
            HttpWebRequest request = CreateRequest(endPoint);

            WebResponse response = request.GetResponse();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(TimelineQueryResult));
            TimelineQueryResult timelines = (TimelineQueryResult)serializer.ReadObject(response.GetResponseStream());

            foreach (Chronozoom.Entities.Timeline timeline in timelines.d)
            {
                Assert.AreNotEqual<int>(0, timeline.UniqueId, "Timeline ID should not be 0");
            }
        }

        [TestMethod]
        public void TestContentItemReferences()
        {
            string endPoint = String.Format(endpointVerb, serviceUrl, verbDefault);
            HttpWebRequest request = CreateRequest(endPoint);

            WebResponse response = request.GetResponse();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(TimelineQueryResult));
            TimelineQueryResult timelines = (TimelineQueryResult)serializer.ReadObject(response.GetResponseStream());

            foreach (Chronozoom.Entities.Timeline timeline in timelines.d)
            {
                foreach (Chronozoom.Entities.Exhibit exhibit in timeline.Exhibits)
                {
                    if (exhibit.UniqueId == 118)
                    {
                        Assert.AreNotEqual<int>(0, exhibit.References.Count, "Expecting references");
                    }
                }
            }
        }

        [TestMethod]
        public void TestThresholdsRequest()
        {
            string endPoint = String.Format(endpointVerb, serviceUrl, verbThresholds);
            HttpWebRequest request = CreateRequest(endPoint);

            WebResponse response = request.GetResponse();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(ThesholdsQueryResult));
            ThesholdsQueryResult thresholds = (ThesholdsQueryResult)serializer.ReadObject(response.GetResponseStream());

            Assert.AreEqual<int>(8, thresholds.d.Count, "Expected 8 thresholds");
        }

        [TestMethod]
        public void TestToursRequest()
        {
            string endPoint = String.Format(endpointVerb, serviceUrl, verbTours);
            HttpWebRequest request = CreateRequest(endPoint);

            WebResponse response = request.GetResponse();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(ToursQueryResult));
            ToursQueryResult tours = (ToursQueryResult)serializer.ReadObject(response.GetResponseStream());

            Assert.AreNotEqual<int>(0, tours.d.Count, "No tours returned");
        }

        [TestMethod]
        public void TestToursBookmarkUrl()
        {
            string endPoint = String.Format(endpointVerb, serviceUrl, verbTours);
            HttpWebRequest request = CreateRequest(endPoint);

            WebResponse response = request.GetResponse();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(ToursQueryResult));
            ToursQueryResult tours = (ToursQueryResult)serializer.ReadObject(response.GetResponseStream());

            string bookmarkUrl = tours.d[0].Bookmarks[0].Url.ToString();

            // Relative URLs only
            Regex bookmarkTemplate = new Regex(@"^(/t\d+)+(/e\d+)?(/c\d+)?@?");

            Assert.IsTrue(bookmarkTemplate.IsMatch(bookmarkUrl), "Bad bookmark format: {0}", bookmarkUrl);
        }

        [TestMethod]
        public void TestValidSearchRequest()
        {
            string endPoint = String.Format(endpointSearch, serviceUrl, "Britain");
            HttpWebRequest request = CreateRequest(endPoint);

            WebResponse response = request.GetResponse();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(SearchQueryResult));
            SearchQueryResult results = (SearchQueryResult)serializer.ReadObject(response.GetResponseStream());

            Assert.AreNotEqual<int>(0, results.d.Count, "No results returned");
        }

        [TestMethod]
        public void TestEmptySearchRequest()
        {
            string endPoint = String.Format(endpointSearch, serviceUrl, "abracadabra");
            HttpWebRequest request = CreateRequest(endPoint);

            WebResponse response = request.GetResponse();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(SearchQueryResult));
            SearchQueryResult results = (SearchQueryResult)serializer.ReadObject(response.GetResponseStream());

            Assert.AreEqual<int>(0, results.d.Count, "Unexpected results returned");
        }

        private static HttpWebRequest CreateRequest(string endPoint)
        {
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(endPoint);
            request.ContentType = "application/json; charset=utf-8";
            request.Accept = "application/json, text/javascript, */*";
            request.Method = "GET";
            return request;
        }
    }
}
