using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Runtime.Remoting.Messaging;
using System.Runtime.Serialization;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using Application.Driver;
using Application.Helper.Constants;
using Application.Helper.UserActions;
using System.IO;
using System.Runtime.Serialization.Json;
using Chronozoom.Entities;
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
        Random _random = new Random();

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
            Logger.Log("<- exhibit: " + exhibit, LogType.MessageWithoutScreenshot);
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

        public Guid[] SelectAllTimelinesAsFavorites(Collection<Chronozoom.Entities.Timeline> timelines)
        {
            Logger.Log("<-");
            List<Guid> list = new List<Guid>();
            foreach (Chronozoom.Entities.Timeline timeline in timelines)
            {
                ExecuteJavaScript("CZ.Service.putUserFavorite('" + timeline.Id + "');");
                Sleep(1);
                list.Add(timeline.Id);
            }
            Logger.Log("-> Selected as favorite timelines: " + string.Join(",", list));
            return list.ToArray();
        }

        public Guid[] GetFavoriteTimelines()
        {
            Logger.Log("<-");
            List<Guid> favoriteTimelinesGuids = new List<Guid>();
            OpenUrl(Configuration.BaseUrl + "/api/userfavorites");
            string userFavoritesJson = StripHtmlText(GetPageSource());
            var javaScriptSerializer = new JavaScriptSerializer();
            var desirealizedFavoriteItems = javaScriptSerializer.Deserialize<List<FavoriteItem>>(userFavoritesJson);
            if (desirealizedFavoriteItems.Count != 0)
            {
                foreach (FavoriteItem favoriteItem in desirealizedFavoriteItems)
                {
                    string favoriteItemGuid = favoriteItem.TimelineUrl.Split('/').Last();
                    favoriteTimelinesGuids.Add(Guid.Parse(favoriteItemGuid.Substring(1, favoriteItemGuid.Length - 1)));
                }
            }
            Logger.Log("-> Favorite timelines guids: " + string.Join(",", favoriteTimelinesGuids));
            return favoriteTimelinesGuids.ToArray();
        }

        public Collection<Chronozoom.Entities.Timeline> GetUserTimelines(string username)
        {
            Logger.Log("<- Username: " + username);
            string requestUrl = Path.Combine(Configuration.BaseUrl, string.Format("api/gettimelines?supercollection={0}&collection={0}", username));
            OpenUrl(requestUrl);
            var userTimelinesJson = StripHtmlText(GetPageSource());
            Collection<Chronozoom.Entities.Timeline> userTimelines;

            using (MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(userTimelinesJson)))
            {
                DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(TimelineRaw));
                TimelineRaw results = (TimelineRaw)serializer.ReadObject(ms);
                userTimelines = results.ChildTimelines;
            }
            Logger.Log("-> User timelines count: " + userTimelines.Count);
            return userTimelines;
        }

        public void SetUserTimelinesAsNotFavorite(Collection<Chronozoom.Entities.Timeline> timelines)
        {
            Logger.Log("<- imput timelines count: " + timelines.Count);
            foreach (var timeline in timelines)
            {
                ExecuteJavaScript("CZ.Service.deleteUserFavorite('" + timeline.Id + "');");
            }
            Logger.Log("->");
        }

        public Collection<Chronozoom.Entities.Timeline> GetCurrentUserTimelines()
        {
            Logger.Log("<-");
            string currentUserName = GetCurrentUsername();
            Logger.Log("->");
            return GetUserTimelines(currentUserName);
        }

        internal string StripHtmlText(string text)
        {
            return Regex.Replace(text, @"<(.|\n)*?>", string.Empty);
        }

        internal string GetCurrentUsername()
        {
            Logger.Log("<-");
            string userInfoApiUrl = Configuration.BaseUrl + "/api/user";
            OpenUrl(userInfoApiUrl);

            string strippedAccountInfoJson = StripHtmlText(GetPageSource());
            var javaScriptSerializer = new JavaScriptSerializer();
            Dictionary<string, string> data = javaScriptSerializer.Deserialize<Dictionary<string, string>>(strippedAccountInfoJson);
            string currentUserName = data["DisplayName"];
            Logger.Log("-> Current user name: " + currentUserName);
            return currentUserName;
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

    internal class FavoriteItem
    {
        public string Author { get; set; }
        public string ImageUrl { get; set; }
        public string TimelineUrl { get; set; }
        public string Title { get; set; }
    }
}