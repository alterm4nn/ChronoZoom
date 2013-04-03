using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Net;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using System.Collections.Generic;

namespace WebServiceApiTest
{
    [DataContract]
    public class SuperCollectionResult
    {
        [DataMember]
        public List<Chronozoom.Entities.SuperCollection> d;
    }

    [DataContract]
    public class TimelineRequest
    {
        [DataMember]
        public string Id { get; set; }
        [DataMember]
        public string Title { get; set; }
        [DataMember]
        public string Regime { get; set; }
        [DataMember]
        public string FromYear { get; set; }
        [DataMember]
        public string ToYear { get; set; }
        [DataMember]
        public string ParentTimelineId { get; set; }
    }

    [TestClass]
    public class AuthoringApiTest
    {
        static string serviceUrl = "test.chronozoomproject.org";
        static string endpointLocator = "http://{0}/chronozoom.svc/{1}";

        [TestMethod]
        public void TestSuperCollectionGet()
        {
            string endPoint = String.Format(endpointLocator, serviceUrl, "getSuperCollection");
            HttpWebRequest request = CreateRequest(endPoint);

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(SuperCollectionResult));
            SuperCollectionResult superCollection = (SuperCollectionResult)serializer.ReadObject(responseStream);
        }

        [TestMethod]
        public void TestCollectionPut()
        {
            string endPoint = String.Format(endpointLocator, serviceUrl, "sandbox/sandbox");
            HttpWebRequest request = CreateRequest(endPoint, "PUT");

            Stream requestStream = request.GetRequestStream();
            DataContractJsonSerializer requestSerializer = new DataContractJsonSerializer(typeof(Chronozoom.Entities.Collection));

            Chronozoom.Entities.Collection newCollection = new Chronozoom.Entities.Collection()
            {
                Title = "Test Collection"
            };

            requestSerializer.WriteObject(requestStream, newCollection);

            WebResponse response = request.GetResponse();

            string responseText = new StreamReader(response.GetResponseStream()).ReadToEnd();
        }


        [TestMethod]
        public void TestTimelinePutDelete()
        {
            string endPoint = String.Format(endpointLocator, serviceUrl, "sandbox/sandbox/timeline");
            HttpWebRequest request = CreateRequest(endPoint, "PUT");

            var newTimelineRequest = new TimelineRequest
            {
                ParentTimelineId = "e308001d-8e6d-437a-96ba-48b9ffb5894a",
                Title = "Test Timeline",
                FromYear = "-11000000000",
                ToYear = "-5000000000",
                Regime = "Cosmos"
            };
            DataContractJsonSerializer requestSerializer = new DataContractJsonSerializer(typeof(TimelineRequest));

            Stream requestStream = request.GetRequestStream();
            requestSerializer.WriteObject(requestStream, newTimelineRequest);

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            //string responseText = new StreamReader(response.GetResponseStream()).ReadToEnd();
            DataContractJsonSerializer guidSerializer = new DataContractJsonSerializer(typeof(Guid));
            Guid timelineId = (Guid)guidSerializer.ReadObject(responseStream);

            Assert.IsNotNull(timelineId);

            var deleteTimelineRequest = new TimelineRequest

            {
                Id = timelineId.ToString()
            };

            request = CreateRequest(endPoint, "DELETE");

            requestStream = request.GetRequestStream();
            requestSerializer.WriteObject(requestStream, deleteTimelineRequest);

            request.GetResponse();
        }

        private static HttpWebRequest CreateRequest(string endPoint)
        {
            return CreateRequest(endPoint, "GET");
        }

        private static HttpWebRequest CreateRequest(string endPoint, string method)
        {
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(endPoint);
            request.ContentType = "application/json; charset=utf-8";
            request.Accept = "application/json, text/javascript, */*";
            request.Method = method;
            return request;
        }
    }
}
