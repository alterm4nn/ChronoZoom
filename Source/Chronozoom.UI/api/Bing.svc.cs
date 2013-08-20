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

namespace Chronozoom.UI
{
    [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
    public partial class ChronozoomSVC : IBingSearchAPI
    {
        // Azure Datamarket account key
        private string BingAccountKey = null;
        // Default Bing API url.
        private const string BingAPIRootUrl = "https://api.datamarket.azure.com/Bing/Search";
        // Default search results limit.
        private const int BingDefaultSearchLimit = 50;
        // Default offset for starting point of returned search results.
        private const int BingDefaultOffset = 0;

        // Error code descriptions
        private static partial class ErrorDescription
        {
            public const string NullSearchQuery = "Search query cannot be null";
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        BaseJsonResult<IEnumerable<Bing.ImageResult>> IBingSearchAPI.GetImages(string query, string top, string skip)
        {
            return ApiOperation<BaseJsonResult<IEnumerable<Bing.ImageResult>>>(delegate(User user, Storage storage)
            {
                var searchResults = new List<Bing.ImageResult>();

                if (string.IsNullOrEmpty(BingAccountKey) && !string.IsNullOrEmpty(ConfigurationManager.AppSettings["AzureMarketplaceAccountKey"]))
                {
                    BingAccountKey = ConfigurationManager.AppSettings["AzureMarketplaceAccountKey"];
                }

#if RELEASE
                if (user == null)
                {
                    // Setting status code to 403 to prevent redirection to authentication resource if status code is 401.
                    SetStatusCode(HttpStatusCode.Forbidden, ErrorDescription.UnauthorizedUser);
                    return new BaseJsonResult<IEnumerable<Bing.ImageResult>>(searchResults);
                }
#endif

                int resultsCount = int.TryParse(top, out resultsCount) ? resultsCount : BingDefaultSearchLimit;
                int offset = int.TryParse(skip, out offset) ? offset : BingDefaultOffset;

                try
                {
                    var bingContainer = new Bing.BingSearchContainer(new Uri(BingAPIRootUrl));
                    bingContainer.Credentials = new NetworkCredential(BingAccountKey, BingAccountKey);

                    var imageQuery = bingContainer.Image(query, null, null, null, null, null, null);
                    imageQuery = imageQuery.AddQueryOption("$top", resultsCount);
                    imageQuery = imageQuery.AddQueryOption("$skip", offset);

                    var imageResults = imageQuery.Execute();

                    foreach (var result in imageResults)
                    {
                        searchResults.Add(result);
                    }
                }
                catch (ArgumentNullException)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.NullSearchQuery);
                }
                catch (Exception ex)
                {
                    SetStatusCode(HttpStatusCode.InternalServerError, ex.Message);
                }

                return new BaseJsonResult<IEnumerable<Bing.ImageResult>>(searchResults);
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        BaseJsonResult<IEnumerable<Bing.VideoResult>> IBingSearchAPI.GetVideos(string query, string top, string skip)
        {
            return ApiOperation<BaseJsonResult<IEnumerable<Bing.VideoResult>>>(delegate(User user, Storage storage)
            {
                var searchResults = new List<Bing.VideoResult>();

                if (string.IsNullOrEmpty(BingAccountKey) && !string.IsNullOrEmpty(ConfigurationManager.AppSettings["AzureMarketplaceAccountKey"]))
                {
                    BingAccountKey = ConfigurationManager.AppSettings["AzureMarketplaceAccountKey"];
                }

#if RELEASE
                if (user == null)
                {
                    // Setting status code to 403 to prevent redirection to authentication resource if status code is 401.
                    SetStatusCode(HttpStatusCode.Forbidden, ErrorDescription.UnauthorizedUser);
                    return new BaseJsonResult<IEnumerable<Bing.VideoResult>>(searchResults);
                }
#endif

                int resultsCount = int.TryParse(top, out resultsCount) ? resultsCount : BingDefaultSearchLimit;
                int offset = int.TryParse(skip, out offset) ? offset : BingDefaultOffset;

                try
                {
                    var bingContainer = new Bing.BingSearchContainer(new Uri(BingAPIRootUrl));
                    bingContainer.Credentials = new NetworkCredential(BingAccountKey, BingAccountKey);

                    var videoQuery = bingContainer.Video(query, null, null, null, null, null, null, null);
                    videoQuery = videoQuery.AddQueryOption("$top", resultsCount);
                    videoQuery = videoQuery.AddQueryOption("$skip", offset);

                    var videoResults = videoQuery.Execute();

                    foreach (var result in videoResults)
                    {
                        searchResults.Add(result);
                    }                                
                }
                catch (ArgumentNullException)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.NullSearchQuery);
                }
                catch (Exception ex)
                {
                    SetStatusCode(HttpStatusCode.InternalServerError, ex.Message);
                }

                return new BaseJsonResult<IEnumerable<Bing.VideoResult>>(searchResults);
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        BaseJsonResult<IEnumerable<Bing.WebResult>> IBingSearchAPI.GetDocuments(string query, string doctype, string top, string skip)
        {
            return ApiOperation<BaseJsonResult<IEnumerable<Bing.WebResult>>>(delegate(User user, Storage storage)
            {
                var searchResults = new List<Bing.WebResult>();

                if (string.IsNullOrEmpty(BingAccountKey) && !string.IsNullOrEmpty(ConfigurationManager.AppSettings["AzureMarketplaceAccountKey"]))
                {
                    BingAccountKey = ConfigurationManager.AppSettings["AzureMarketplaceAccountKey"];
                }

#if RELEASE
                if (user == null)
                {
                    // Setting status code to 403 to prevent redirection to authentication resource if status code is 401.
                    SetStatusCode(HttpStatusCode.Forbidden, ErrorDescription.UnauthorizedUser);
                    return new BaseJsonResult<IEnumerable<Bing.WebResult>>(searchResults);
                }
#endif

                int resultsCount = int.TryParse(top, out resultsCount) ? resultsCount : BingDefaultSearchLimit;
                int offset = int.TryParse(skip, out offset) ? offset : BingDefaultOffset;

                try
                {
                    var bingContainer = new Bing.BingSearchContainer(new Uri(BingAPIRootUrl));
                    bingContainer.Credentials = new NetworkCredential(BingAccountKey, BingAccountKey);

                    var webQuery = bingContainer.Web(query, null, null, null, null, null, null, doctype);
                    webQuery = webQuery.AddQueryOption("$top", resultsCount);
                    webQuery = webQuery.AddQueryOption("$skip", offset);

                    var webResults = webQuery.Execute();
                
                    foreach (var result in webResults)
                    {
                        searchResults.Add(result);
                    }
                }
                catch (ArgumentNullException)
                {
                    SetStatusCode(HttpStatusCode.BadRequest, ErrorDescription.NullSearchQuery);
                }
                catch (System.Data.Services.Client.DataServiceQueryException ex)
                {
                    if (ex.InnerException != null)
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ex.InnerException.Message);
                    }
                    else
                    {
                        SetStatusCode(HttpStatusCode.NotFound, ex.Message);
                    }
                }
                catch (Exception ex)
                {
                    SetStatusCode(HttpStatusCode.InternalServerError, ex.Message);
                }

                return new BaseJsonResult<IEnumerable<Bing.WebResult>>(searchResults);
            });
        }        
    }
}