using System;
using System.Net;
using Newtonsoft.Json;

namespace RandomDataGenerator
{
    public class RandomUrl
    {
        private static readonly Random Random;

        static RandomUrl()
        {
            Random = new Random();
        }

        public static string GetRandomImageUrl()
        {
            string searchPattern = GetRandomWord();
            return GetUrl(searchPattern, ServiceType.Image);
        }

        public static string GetRandomVideoUrl()
        {
            string searchPattern = GetRandomWord();
            return GetUrl(searchPattern, ServiceType.Video);
        }

        public static string GetRandomWebUrl()
        {
            string searchPattern = GetRandomWord();
            return GetUrl(searchPattern, ServiceType.Web);
        }

        public static string GetRandomPdfUrl()
        {
            string searchPattern = GetRandomWord();
            return GetUrl(String.Format("{0}+filetype:pdf", searchPattern), ServiceType.Web);
        }

        private static string GetUrl(string pattern, string serviceType)
        {

            string response = SendRequest(pattern, serviceType);
            if (response == null)
                return GetDefaultUrl(serviceType);
            switch (serviceType)
            {
                case ServiceType.Image:
                    ResponseImage objects = JsonConvert.DeserializeObject<ResponseImage>(response);
                    if (objects == null || objects.ResponseData == null)
                    {
                        return GetDefaultUrl(serviceType);
                    }
                    ImageResult[] results = objects.ResponseData.Results;
                    return results == null ? GetDefaultUrl(serviceType) : results[Random.Next(results.Length - 1)].UnescapedUrl;
                case ServiceType.Video:
                    ResponseVideo objectsVideo = JsonConvert.DeserializeObject<ResponseVideo>(response);
                    if (objectsVideo == null || objectsVideo.ResponseData == null)
                    {
                        return GetDefaultUrl(serviceType);
                    }
                    VideoResult[] videoResults = objectsVideo.ResponseData.Results;
                    return videoResults == null ? GetDefaultUrl(serviceType) : videoResults[Random.Next(videoResults.Length - 1)].Url;
                case ServiceType.Web:
                    ResponseWeb objectsWeb = JsonConvert.DeserializeObject<ResponseWeb>(response);
                    if (objectsWeb == null || objectsWeb.ResponseData == null)
                    {
                        return GetDefaultUrl(serviceType);
                    }
                    WebResult[] webResults = objectsWeb.ResponseData.Results;
                    return webResults == null ? GetDefaultUrl(serviceType) : webResults[Random.Next(webResults.Length - 1)].UnescapedUrl;
            }
            return GetDefaultUrl(serviceType);
        }

        private static string GetDefaultUrl(string serviceType)
        {
            const string defaultImageUrl = "http://education.oge.gov/training/module_files/ogegovctr_wbt_07/exception.jpg";
            const string defaultVideoUrl = "https://www.youtube.com/watch?v=HiSQzK7sCvM";
            const string defaultWebUrl = "http://en.wikipedia.org/wiki/Exception_handling";
            switch (serviceType)
            {
                case ServiceType.Image:
                    return defaultImageUrl;
                case ServiceType.Video:
                    return defaultVideoUrl;
                case ServiceType.Web:
                    return defaultWebUrl;
                default:
                    return defaultWebUrl;
            }
        }

        private static string SendRequest(string pattern, string type)
        {
            int page = Random.Next(60);
            var client = new WebClient();
            string url = String.Format(@"http://ajax.googleapis.com/ajax/services/search/{0}?v=1.0&q={1}&start={2}", type, pattern, page);
            string response = client.DownloadString(url);
            return response;
        }

        private static string GetRandomWord()
        {
            string[] words = Dictionaries.Words;
            return words[Random.Next(words.Length - 1)];
        }
    }

    internal class ResponseImage
    {
        public ImageResultsData ResponseData { get; set; }
    }

    internal class ResponseVideo
    {
        public VideoResultsData ResponseData { get; set; }
    }

    internal class ResponseWeb
    {
        public WebResultsData ResponseData { get; set; }
    }

    internal class WebResultsData
    {
        public WebResult[] Results { get; set; }
    }

    internal class ImageResultsData
    {
        public ImageResult[] Results { get; set; }
    }

    internal class VideoResultsData
    {
        public VideoResult[] Results { get; set; }
    }

    internal class ImageResult
    {
        public string UnescapedUrl { get; set; }
    }

    internal class VideoResult
    {
        public string Url { get; set; }
    }


    internal class WebResult
    {
        public string UnescapedUrl { get; set; }
    }


    internal class ServiceType
    {
        public const string Image = "images";
        public const string Video = "video";
        public const string Web = "web";
    }
}