// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Runtime.Caching;
using System.Runtime.Serialization;
using System.Security.Cryptography;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using System.Web;
using Chronozoom.Entities;

using Chronozoom.UI.Utils;
using System.ServiceModel.Description;
using TweetSharp;

namespace Chronozoom.UI
{
    public partial class ChronozoomSVC : ITwitterAPI
    {
        private string TwitterConsumerKey = ConfigurationManager.AppSettings["TwitterConsumerKey"];
        private string TwitterConsumerSecret = ConfigurationManager.AppSettings["TwitterConsumerSecret"];
        private string TwitterAccessToken = ConfigurationManager.AppSettings["TwitterAccessToken"];
        private string TwitterAccessTokenSecret = ConfigurationManager.AppSettings["TwitterAccessTokenSecret"];

        // Minimal time interval between Twitter API request to get new tweets
        private int tweetTimelineUpdateTime = 10;
        // Time of last get tweet timeline request
        private DateTime recentTweetTimelineUpdateTime;
        // Cached recent timeline tweets
        private List<TweetSharp.TwitterStatus> recentTimelineTweets = new List<TweetSharp.TwitterStatus>();

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        BaseJsonResult<IEnumerable<TweetSharp.TwitterStatus>> ITwitterAPI.GetRecentTweets()
        {
            // Update cached tweets for the first request or if time interval is passed
            if (recentTweetTimelineUpdateTime == null ||
                recentTweetTimelineUpdateTime.AddMinutes(tweetTimelineUpdateTime) < DateTime.UtcNow)
            {
                var recentTweets = UpdateTweetTimeline();
                recentTimelineTweets = recentTweets.Count != 0 ? recentTweets : recentTimelineTweets;
            }

            return new BaseJsonResult<IEnumerable<TweetSharp.TwitterStatus>>(recentTimelineTweets);
        }

        private List<TweetSharp.TwitterStatus> UpdateTweetTimeline() {
            var result = new List<TweetSharp.TwitterStatus>();
            
            recentTweetTimelineUpdateTime = DateTime.UtcNow;

            // Some of oAuth parameters is not set up
            if (String.IsNullOrEmpty(TwitterConsumerKey) || String.IsNullOrEmpty(TwitterConsumerSecret) ||
                String.IsNullOrEmpty(TwitterAccessToken) || String.IsNullOrEmpty(TwitterAccessTokenSecret))
            {
                return result;
            }

            var service = new TwitterService(TwitterConsumerKey, TwitterConsumerSecret);
            service.AuthenticateWith(TwitterAccessToken, TwitterAccessTokenSecret);

            var options = new ListTweetsOnUserTimelineOptions
            {
                Count = 10
            };

            var recentTweets = service.ListTweetsOnUserTimeline(options);
            if (recentTweets != null)
            {
                foreach (TwitterStatus s in recentTweets)
                {
                    result.Add(s);
                }
            }

            return result;
        }
    }
}