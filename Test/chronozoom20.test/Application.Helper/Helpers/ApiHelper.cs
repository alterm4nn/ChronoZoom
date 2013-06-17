using System;
using System.Net;
using Application.Driver;
using Application.Helper.Constants;
using Application.Helper.Entities;
using Application.Helper.UserActions;
using System.IO;
using System.Runtime.Serialization.Json;
using Chronozoom.Entities;

namespace Application.Helper.Helpers
{
    public class ApiHelper : DependentActions
    {
        private readonly string _serviceUrl = Configuration.BaseUrl;
        private const string EndpointLocator = ApiConstants.EndpointLocator;
        private const string CosmosGuidTemplate = ApiConstants.CosmosGuidTemplate;
        private const string SuperCollectionUrl = ApiConstants.SuperCollectionUrl;
        private const string TimelineApiServiceUrl = ApiConstants.TimelineApiServiceUrl;
        private const string ExhibitApiServiceUrl = ApiConstants.ExhibitApiServiceUrl;

        public Guid CreateTimelineByApi(TimelineRaw timeline)
        {
            TimelineRaw newTimelineRequest = timeline;
            newTimelineRequest.Timeline_ID = new Guid(CosmosGuidTemplate);

            DataContractJsonSerializer putSerializer = new DataContractJsonSerializer(typeof(TimelineRaw));
            DataContractJsonSerializer guidSerializer = new DataContractJsonSerializer(typeof(Guid));
            
            Stream responseStream = GetResponseStream(putSerializer, TimelineApiServiceUrl, newTimelineRequest);

            Guid timelineId = (Guid)guidSerializer.ReadObject(responseStream);
            return timelineId;
        }

        public NewExhibitApiResponse CreateExhibitByApi(ExhibitRaw exhibit)
        {
            DataContractJsonSerializer putSerializer = new DataContractJsonSerializer(typeof(ExhibitRaw));
            DataContractJsonSerializer guidSerializer = new DataContractJsonSerializer(typeof(NewExhibitApiResponse));

            exhibit.Timeline_ID = new Guid(CosmosGuidTemplate);
            Stream responseStream = GetResponseStream(putSerializer, ExhibitApiServiceUrl, exhibit);

            NewExhibitApiResponse newExhibitApiResponse = (NewExhibitApiResponse)guidSerializer.ReadObject(responseStream);
            return newExhibitApiResponse;
        }

        private HttpWebRequest MakePutRequest(string serviceUrl)
        {
            string endPoint = String.Format(EndpointLocator, _serviceUrl, serviceUrl);
            return CreateRequest(endPoint);
        }

        private Stream GetResponseStream(DataContractJsonSerializer putSerializer, string serviceApi, dynamic element)
        {
            HttpWebRequest request = MakePutRequest(serviceApi);
            Stream requestStream = request.GetRequestStream();
            putSerializer.WriteObject(requestStream, element);
            WebResponse response = request.GetResponse();
            Stream responseStream = response.GetResponseStream();
            if (responseStream == null)
            {
                throw new NullReferenceException("responseStream is null");
            }
            return responseStream;
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