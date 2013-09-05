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
            return GetUrl(searchPattern, MediaType.Image);
        }

        public static string GetRandomVideoUrl()
        {
            string searchPattern = GetRandomWord();
            return GetUrl(searchPattern, MediaType.Video);
        }

        private static string GetUrl(string pattern, string mediaType)
        {
            var response = SendRequest(pattern, mediaType);
            if (response == null) throw new ArgumentNullException("pattern");
            if (mediaType == MediaType.Image)
            {
                ResponseImage objects = JsonConvert.DeserializeObject<ResponseImage>(response);
                if (objects != null && objects.ResponseData != null)
                {
                    ImageResult[] results = objects.ResponseData.Results;
                    if (results != null) return results[Random.Next(results.Length - 1)].UnescapedUrl;
                }
            }
            ResponseVideo objectsVideo = JsonConvert.DeserializeObject<ResponseVideo>(response);
            if (objectsVideo != null && objectsVideo.ResponseData != null)
            {
                VideoResult[] videoResults = objectsVideo.ResponseData.Results;
                if (videoResults != null) return videoResults[Random.Next(videoResults.Length - 1)].Url;
            }
            throw new NullReferenceException("objectsVideo");
        }

        private static string SendRequest(string pattern, string type)
        {
            int page = Random.Next(60);
            var client = new WebClient();
            string url = String.Format(@"http://ajax.googleapis.com/ajax/services/search/{0}?v=1.0&q={1}&start={2}", type, pattern, page);
            var response = client.DownloadString(url);
            return response;
        }

        private static string GetRandomWord()
        {
            string[] words = Dictionaries.Words;
            return words[Random.Next(words.Length - 1)];
        }
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

    internal class ResponseImage
    {
        public ImageResultsData ResponseData { get; set; }
    }

    internal class ResponseVideo
    {
        public VideoResultsData ResponseData { get; set; }
    }

    internal class MediaType
    {
        public const string Image = "images";
        public const string Video = "video";
    }
}