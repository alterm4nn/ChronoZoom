using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Net;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using System.Collections.Generic;

using Chronozoom.Entities;

namespace WebServiceApiTest
{
    [TestClass]
    public class AuthoringApiTest
    {
        static string serviceUrl = "test.chronozoomproject.org";
        static string endpointLocator = "http://{0}/api/{1}";

        [TestMethod]
        public void TestSuperCollectionGet()
        {
            string endPoint = String.Format(endpointLocator, serviceUrl, "collections");
            HttpWebRequest request = CreateRequest(endPoint);

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(IEnumerable<SuperCollection>));
            IEnumerable<SuperCollection> superCollection = (IEnumerable<SuperCollection>)serializer.ReadObject(responseStream);
        }

        [TestMethod]
        public void TestCollectionPutDelete()
        {
            string endPoint = String.Format(endpointLocator, serviceUrl, "sandbox/apitest");
            HttpWebRequest request = CreateRequest(endPoint, "PUT");

            Stream requestStream = request.GetRequestStream();
            DataContractJsonSerializer requestSerializer = new DataContractJsonSerializer(typeof(Chronozoom.Entities.Collection));

            Chronozoom.Entities.Collection newCollection = new Chronozoom.Entities.Collection()
            {
                Title = "API Test Collection"
            };

            requestSerializer.WriteObject(requestStream, newCollection);

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            //string responseText = new StreamReader(response.GetResponseStream()).ReadToEnd();
            DataContractJsonSerializer guidSerializer = new DataContractJsonSerializer(typeof(Guid));
            Guid collectionId = (Guid)guidSerializer.ReadObject(responseStream);

            Assert.IsNotNull(collectionId);

            request = CreateRequest(endPoint, "DELETE");
            request.GetResponse();
        }


        [TestMethod]
        public void TestTimelinePutDelete()
        {
            string endPoint = String.Format(endpointLocator, serviceUrl, "sandbox/sandbox/timeline");
            HttpWebRequest request = CreateRequest(endPoint, "PUT");

            var newTimelineRequest = new TimelineRaw
            {
                Timeline_ID = new Guid("bdc1ceff-76f8-4df4-ba72-96b353991314"),
                Title = "Test Timeline",
                FromYear = -11000000000m,
                ToYear = -5000000000m,
                Regime = "Cosmos"
            };
            DataContractJsonSerializer putSerializer = new DataContractJsonSerializer(typeof(TimelineRaw));

            Stream requestStream = request.GetRequestStream();
            putSerializer.WriteObject(requestStream, newTimelineRequest);

            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            //string responseText = new StreamReader(response.GetResponseStream()).ReadToEnd();
            DataContractJsonSerializer guidSerializer = new DataContractJsonSerializer(typeof(Guid));
            Guid timelineId = (Guid)guidSerializer.ReadObject(responseStream);

            Assert.IsNotNull(timelineId);

            var deleteTimelineRequest = new Timeline

            {
                Id = timelineId
            };

            request = CreateRequest(endPoint, "DELETE");

            DataContractJsonSerializer deleteSerializer = new DataContractJsonSerializer(typeof(Timeline));

            requestStream = request.GetRequestStream();
            deleteSerializer.WriteObject(requestStream, deleteTimelineRequest);

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
