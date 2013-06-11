using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using System.Collections.Generic;
using System.Net;
using System.IO;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text.RegularExpressions;
using System.Text;

using Chronozoom.Entities;

namespace WebServiceApiTest
{
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
    public class WebServiceApiTest
    {
        static string endpointLocator = "http://{0}/api/{1}";
        static string endpointSearch = "http://{0}/api/search?searchTerm={1}";

        static string serviceUrl = "test.chronozoomproject.org";

        static string verbTimelines = "getTimelines";
        static string verbTours = "tours";

        [TestMethod]
        public void TestFirstTimelineRequest()
        {
            string endPoint = String.Format(endpointLocator, serviceUrl, verbTimelines);
            HttpWebRequest request = CreateRequest(endPoint);

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(TimelineRaw));
            TimelineRaw timelines = (TimelineRaw)serializer.ReadObject(responseStream);

            Assert.IsNotNull(timelines, "No timelines returned");
        }

        [TestMethod]
        public void TestTimelineUniqueId()
        {
            string endPoint = String.Format(endpointLocator, serviceUrl, verbTimelines);
            HttpWebRequest request = CreateRequest(endPoint);

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(TimelineRaw));
            TimelineRaw timelines = (TimelineRaw)serializer.ReadObject(responseStream);

            foreach (Timeline timeline in timelines.ChildTimelines)
            {
                Assert.IsNotNull(timeline.Id, "Timeline ID should not be null");
                Assert.AreNotEqual<Guid>(Guid.Empty, timeline.Id, "Timeline ID should not be empty");
            }
        }

        [TestMethod]
        public void TestFilterValidStartDate()
        {
            HttpWebRequest request = CreateGetRequest(null, null, "-1000");

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(TimelineRaw));
            TimelineRaw timelines = (TimelineRaw)serializer.ReadObject(responseStream);

            Assert.IsNotNull(timelines, "No timelines returned");
        }

        [TestMethod]
        [ExpectedException(typeof(WebException))]
        public void TestFilterMalformedStartDate()
        {
            HttpWebRequest request = CreateGetRequest(null, null, "1000ASDF");

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(TimelineRaw));
            TimelineRaw timelines = (TimelineRaw)serializer.ReadObject(responseStream);
        }

        [TestMethod]
        public void TestFilterValidEndDate()
        {
            HttpWebRequest request = CreateGetRequest(null, null, null, "1000");

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(TimelineRaw));
            TimelineRaw timelines = (TimelineRaw)serializer.ReadObject(responseStream);

            Assert.IsNotNull(timelines, "No timelines returned");
        }

        [TestMethod]
        [ExpectedException(typeof(WebException))]
        public void TestFilterMalformedEndDate()
        {
            HttpWebRequest request = CreateGetRequest(null, null, null, "1000ASDF");

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(TimelineRaw));
            TimelineRaw timelines = (TimelineRaw)serializer.ReadObject(responseStream);
        }

        [TestMethod]
        public void TestFilterValidTimeSpan()
        {
            HttpWebRequest request = CreateGetRequest(null, null, null, null, "1000");

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(TimelineRaw));
            TimelineRaw timelines = (TimelineRaw)serializer.ReadObject(responseStream);

            Assert.IsNotNull(timelines, "No timelines returned");
        }

        [TestMethod]
        public void TestFilterMalformedTimeSpan()
        {
            HttpWebRequest request = CreateGetRequest(null, null, null, null, "1000ASDF");

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(TimelineRaw));
            TimelineRaw timelines = (TimelineRaw)serializer.ReadObject(responseStream);
        }

        //[TestMethod]
        //public void TestContentItemReferences()
        //{
        //    string endPoint = String.Format(endpointLocator, serviceUrl, verbDefault);
        //    HttpWebRequest request = CreateRequest(endPoint);

        //    WebResponse response = request.GetResponse();
        //    Stream responseStream = response.GetResponseStream();

        //    DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(TimelineRaw));
        //    TimelineRaw timelines = (TimelineRaw)serializer.ReadObject(responseStream);

        //    foreach (Chronozoom.Entities.Timeline timeline in timelines.d)
        //    {
        //        foreach (Chronozoom.Entities.Exhibit exhibit in timeline.Exhibits)
        //        {
        //            if (exhibit.UniqueId == 118)
        //            {
        //                Assert.AreNotEqual<int>(0, exhibit.References.Count, "Expecting references");
        //            }
        //        }
        //    }
        //}

        [TestMethod]
        public void TestToursRequest()
        {
            string endPoint = String.Format(endpointLocator, serviceUrl, verbTours);
            HttpWebRequest request = CreateRequest(endPoint);

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(ToursQueryResult));
            ToursQueryResult tours = (ToursQueryResult)serializer.ReadObject(responseStream);

            Assert.AreNotEqual<int>(0, tours.d.Count, "No tours returned");
        }

        [TestMethod]
        public void TestToursBookmarkUrl()
        {
            string endPoint = String.Format(endpointLocator, serviceUrl, verbTours);
            HttpWebRequest request = CreateRequest(endPoint);

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(ToursQueryResult));
            ToursQueryResult tours = (ToursQueryResult)serializer.ReadObject(responseStream);

            string bookmarkUrl = tours.d[0].Bookmarks[0].Url;

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
            Stream responseStream = response.GetResponseStream();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(SearchQueryResult));
            SearchQueryResult results = (SearchQueryResult)serializer.ReadObject(responseStream);

            Assert.AreNotEqual<int>(0, results.d.Count, "No results returned");
        }

        [TestMethod]
        public void TestEmptySearchRequest()
        {
            string endPoint = String.Format(endpointSearch, serviceUrl, "abracadabra");
            HttpWebRequest request = CreateRequest(endPoint);

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(SearchQueryResult));
            SearchQueryResult results = (SearchQueryResult)serializer.ReadObject(responseStream);

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

        private static HttpWebRequest CreateGetRequest(params string[] args)
        {
            string[] argNames = {
                                      "supercollection",
                                      "collection",
                                      "start",
                                      "end",
                                      "timespan"
                                  };

            StringBuilder sb = new StringBuilder(verbTimelines);

            bool firstParam = true;

            for (int i = 0; i < argNames.Length && i < args.Length; i++)
            {
                if (args[i] != null)
                {
                    sb.Append(firstParam ? '?' : '&');
                    sb.AppendFormat("{0}={1}", argNames[i], args[i]);
                    firstParam = false;
                }
            }

            string endPoint = String.Format(endpointLocator, serviceUrl, sb.ToString());

            return CreateRequest(endPoint);
        }

    }
}
