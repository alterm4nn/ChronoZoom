using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Net;
using System.Runtime.Serialization;
using System.Text;
using Application.Driver;
using Application.Helper.Constants;
using Application.Helper.UserActions;
using System.IO;
using System.Runtime.Serialization.Json;
using Exhibit = Application.Helper.Entities.Exhibit;
using Timeline = Application.Helper.Entities.Timeline;
using Tour = Application.Helper.Entities.Tour;

namespace Application.Helper.Helpers
{
    public class ApiHelper : DependentActions
    {
        private readonly string _baseUrl = Configuration.BaseUrl;
        private const string EndpointLocator = ApiConstants.EndpointLocator;
        private const string CosmosGuidTemplate = ApiConstants.CosmosGuidTemplate;
        private const string TimelineApiServiceUrl = ApiConstants.TimelineApiServiceUrl;
        private const string ExhibitApiServiceUrl = ApiConstants.ExhibitApiServiceUrl;
        private const string TourApiServiceUrl = ApiConstants.TourApiServiceUrl;

        public void CreateTimelineByApi(Timeline timeline)
        {
            timeline.Timeline_ID = new Guid(CosmosGuidTemplate);

            DataContractJsonSerializer timelineSerializer = new DataContractJsonSerializer(typeof(Timeline));
            DataContractJsonSerializer guidSerializer = new DataContractJsonSerializer(typeof(Guid));


            HttpWebRequest request = MakePutRequest(TimelineApiServiceUrl);
            Stream requestStream = request.GetRequestStream();
            timelineSerializer.WriteObject(requestStream, timeline);
            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();
            if (responseStream == null)
            {
                throw new NullReferenceException("responseStream is null");
            }

            timeline.Id = (Guid)guidSerializer.ReadObject(responseStream);
        }

        public void DeleteTimelineByApi(Timeline timeline)
        {
            timeline.Timeline_ID = new Guid(CosmosGuidTemplate);
            DataContractJsonSerializer timelineSerializer = new DataContractJsonSerializer(typeof(Timeline));

            HttpWebRequest request = MakeDeleteRequest(TimelineApiServiceUrl);
            Stream requestStream = request.GetRequestStream();
            timelineSerializer.WriteObject(requestStream, timeline);
            request.GetResponse();
        }

        public void CreateExhibitByApi(Exhibit exhibit)
        {
            Logger.Log("<- exhibit: " + exhibit,LogType.MessageWithoutScreenshot);
            DataContractJsonSerializer exhibitSerializer = new DataContractJsonSerializer(typeof(Exhibit));
            DataContractJsonSerializer guidSerializer = new DataContractJsonSerializer(typeof(NewExhibitApiResponse));

            exhibit.Timeline_ID = new Guid(CosmosGuidTemplate);

            HttpWebRequest request = MakePutRequest(ExhibitApiServiceUrl);
            Stream requestStream = request.GetRequestStream();
            exhibitSerializer.WriteObject(requestStream, exhibit);
            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();

            if (responseStream == null)
            {
                throw new NullReferenceException("responseStream is null");
            }

            NewExhibitApiResponse newExhibitApiResponse = (NewExhibitApiResponse)guidSerializer.ReadObject(responseStream);
            exhibit.Id = new Guid(newExhibitApiResponse.ExhibitId);
            Logger.Log("->");
        }

        public void DeleteExhibitByApi(Exhibit exhibit)
        {
            DataContractJsonSerializer exhibitSerializer = new DataContractJsonSerializer(typeof(Exhibit));

            HttpWebRequest request = MakeDeleteRequest(ExhibitApiServiceUrl);
            Stream requestStream = request.GetRequestStream();
            exhibitSerializer.WriteObject(requestStream, exhibit);
            request.GetResponse();
        }

        public void DeleteTourByApi(Tour tour)
        {
            DataContractJsonSerializer tourSerializer = new DataContractJsonSerializer(typeof(Tour));
            HttpWebRequest request = MakeDeleteRequest(TourApiServiceUrl);
            Stream requestStream = request.GetRequestStream();
            tourSerializer.WriteObject(requestStream, tour);
            request.GetResponse();
        }

        public IEnumerable<Tour> GetToursByApi()
        {

            HttpWebRequest request = MakeGetRequest(TourApiServiceUrl);
            WebResponse response = request.GetResponse();


            var serializer = new DataContractJsonSerializer(typeof(Tour[]), "d");
            var bar = "\"d\":[{\"audio\":\"\",\"bookmarks\":[{\"description\":\"descr\",\"id\":\"0a4b0ab6-38bb-4cd5-896d-2a7ecd768651\",\"lapseTime\":0,\"name\":\"MyTimeline\",\"referencId\":\"00000000-0000-0000-0000-000000000000\",\"referenceType\":0,\"url\":\"url.jog\"}],\"category\":null,\"description\":\"test1\",\"id\":\"00000000-0000-0000-0000-000000000000\",\"name\":\"test1\",\"sequence\":null},{\"audio\":\"\",\"bookmarks\":[{\"description\":\"descr\",\"id\":\"0a4b0ab6-38bb-4cd5-896d-2a7ecd768651\",\"lapseTime\":0,\"name\":\"MyTimeline\",\"referencId\":\"00000000-0000-0000-0000-000000000000\",\"referenceType\":0,\"url\":\"url.jog\"}],\"category\":null,\"description\":\"test1\",\"id\":\"00000000-0000-0000-0000-000000000000\",\"name\":\"test1\",\"sequence\":null},{\"audio\":\"\",\"bookmarks\":[{\"description\":\"descr\",\"id\":\"0a4b0ab6-38bb-4cd5-896d-2a7ecd768651\",\"lapseTime\":0,\"name\":\"MyTimeline\",\"referencId\":\"00000000-0000-0000-0000-000000000000\",\"referenceType\":0,\"url\":\"url.jog\"}],\"category\":null,\"description\":\"test1\",\"id\":\"00000000-0000-0000-0000-000000000000\",\"name\":\"test1\",\"sequence\":null}]";
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(bar));
            var foo = serializer.ReadObject(stream);
            stream.Close();


            DataContractJsonSerializer tourSerializer = new DataContractJsonSerializer(typeof(Tour[]));
            Stream responseStream = response.GetResponseStream();
            //MemoryStream ms = new MemoryStream();
            //responseStream.CopyTo(ms);
            //var test = Encoding.Default.GetString(ms.ToArray());

            Tour[] toursCollection = (Tour[])tourSerializer.ReadObject(responseStream);

            return null;
        }

        private HttpWebRequest MakePutRequest(string serviceUrl)
        {
            string endPoint = String.Format(EndpointLocator, _baseUrl, serviceUrl);
            return CreateRequest(endPoint, "PUT");
        }

        private HttpWebRequest MakeDeleteRequest(string serviceUrl)
        {
            string endPoint = String.Format(EndpointLocator, _baseUrl, serviceUrl);
            return CreateRequest(endPoint, "DELETE");
        }

        private HttpWebRequest MakeGetRequest(string serviceUrl)
        {
            string endPoint = String.Format(EndpointLocator, _baseUrl, serviceUrl);
            return CreateRequest(endPoint, "GET");
        }

        private static HttpWebRequest CreateRequest(string endPoint, string method)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(endPoint);
            request.ContentType = "application/json; charset=utf-8";
            request.Accept = "application/json, text/javascript, */*";
            request.Method = method;
            return request;
        }
    }

    [DataContract]
    internal class NewExhibitApiResponse
    {
        [DataMember(Name = "ContentItemId")]
        public Collection<string> ContentItemId { get; set; }
        [DataMember(Name = "ExhibitId")]
        public string ExhibitId { get; set; }

    }
}