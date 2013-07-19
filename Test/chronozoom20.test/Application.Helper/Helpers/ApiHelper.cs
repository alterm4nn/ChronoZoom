using System;
using System.Net;
using Application.Driver;
using Application.Helper.Constants;
using Application.Helper.Entities;
using Application.Helper.UserActions;
using System.IO;
using System.Runtime.Serialization.Json;
using Exhibit = Application.Helper.Entities.Exhibit;
using Timeline = Application.Helper.Entities.Timeline;

namespace Application.Helper.Helpers
{
    public class ApiHelper : DependentActions
    {
        private readonly string _baseUrl = Configuration.BaseUrl;
        private const string EndpointLocator = ApiConstants.EndpointLocator;
        private const string CosmosGuidTemplate = ApiConstants.CosmosGuidTemplate;
        private const string TimelineApiServiceUrl = ApiConstants.TimelineApiServiceUrl;
        private const string ExhibitApiServiceUrl = ApiConstants.ExhibitApiServiceUrl;

        public Guid CreateTimelineByApi(Timeline timeline)
        {
            timeline.Timeline_ID = new Guid(CosmosGuidTemplate);

            DataContractJsonSerializer putSerializer = new DataContractJsonSerializer(typeof(Timeline));
            DataContractJsonSerializer guidSerializer = new DataContractJsonSerializer(typeof(Guid));


            HttpWebRequest request = MakePutRequest(TimelineApiServiceUrl);
            Stream requestStream = request.GetRequestStream();
            putSerializer.WriteObject(requestStream, timeline);
            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();
            if (responseStream == null)
            {
                throw new NullReferenceException("responseStream is null");
            }
            
            Guid timelineId = (Guid)guidSerializer.ReadObject(responseStream);
            return timelineId;
        }

        public NewExhibitApiResponse CreateExhibitByApi(Exhibit exhibit)
        {
            DataContractJsonSerializer putSerializer = new DataContractJsonSerializer(typeof(Exhibit));
            DataContractJsonSerializer guidSerializer = new DataContractJsonSerializer(typeof(NewExhibitApiResponse));

            exhibit.Timeline_ID = new Guid(CosmosGuidTemplate);

            HttpWebRequest request = MakePutRequest(ExhibitApiServiceUrl);
            Stream requestStream = request.GetRequestStream();
            putSerializer.WriteObject(requestStream, exhibit);
            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();
            if (responseStream == null)
            {
                throw new NullReferenceException("responseStream is null");
            }

            NewExhibitApiResponse newExhibitApiResponse = (NewExhibitApiResponse)guidSerializer.ReadObject(responseStream);
            return newExhibitApiResponse;
        }

        private HttpWebRequest MakePutRequest(string serviceUrl)
        {
            string endPoint = String.Format(EndpointLocator, _baseUrl, serviceUrl);
            return CreateRequest(endPoint);
        }

        private static HttpWebRequest CreateRequest(string endPoint)
        {
            return CreateRequest(endPoint, "PUT");
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
}