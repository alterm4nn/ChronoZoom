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

        // Error code descriptions
        private static partial class ErrorDescription
        {
            public const string NullSearchQuery = "Search query cannot be null";
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        BaseJsonResult<IEnumerable<BingSearchImageResult>> IBingSearchAPI.GetImages(string query)
        {
            return ApiOperation<BaseJsonResult<IEnumerable<BingSearchImageResult>>>(delegate(User user, Storage storage)
            {
                var searchResults = new List<BingSearchImageResult>();

                if (string.IsNullOrEmpty(BingAccountKey) && !string.IsNullOrEmpty(ConfigurationManager.AppSettings["AzureMarketplaceAccountKey"]))
                {
                    BingAccountKey = ConfigurationManager.AppSettings["AzureMarketplaceAccountKey"];
                }

                //if (user == null)
                //{
                //    // Setting status code to 403 to prevent redirection to authentication resource if status code is 401.
                //    SetStatusCode(HttpStatusCode.Forbidden, ErrorDescription.UnauthorizedUser);
                //    return new BaseJsonResult<IEnumerable<BingSearchImageResult>>(searchResults);
                //}

                try
                {
                    var bingContainer = new Bing.BingSearchContainer(new Uri(BingAPIRootUrl));
                    bingContainer.Credentials = new NetworkCredential(BingAccountKey, BingAccountKey);

                    var imageQuery = bingContainer.Image(query, null, null, null, null, null, null);
                    imageQuery = imageQuery.AddQueryOption("$top", BingDefaultSearchLimit);

                    var webResults = imageQuery.Execute();

                    foreach (var result in webResults)
                    {
                        searchResults.Add(new BingSearchImageResult(result.MediaUrl, result.Title));
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

                return new BaseJsonResult<IEnumerable<BingSearchImageResult>>(searchResults);
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        BaseJsonResult<IEnumerable<BingSearchVideoResult>> IBingSearchAPI.GetVideos(string query)
        {
            return ApiOperation<BaseJsonResult<IEnumerable<BingSearchVideoResult>>>(delegate(User user, Storage storage)
            {
                var searchResults = new List<BingSearchVideoResult>();

                if (string.IsNullOrEmpty(BingAccountKey) && !string.IsNullOrEmpty(ConfigurationManager.AppSettings["AzureMarketplaceAccountKey"]))
                {
                    BingAccountKey = ConfigurationManager.AppSettings["AzureMarketplaceAccountKey"];
                }

                //if (user == null)
                //{
                //    // Setting status code to 403 to prevent redirection to authentication resource if status code is 401.
                //    SetStatusCode(HttpStatusCode.Forbidden, ErrorDescription.UnauthorizedUser);
                //    return new BaseJsonResult<IEnumerable<BingSearchVideoResult>>(searchResults);
                //}

                try
                {
                    var bingContainer = new Bing.BingSearchContainer(new Uri(BingAPIRootUrl));
                    bingContainer.Credentials = new NetworkCredential(BingAccountKey, BingAccountKey);

                    var videoQuery = bingContainer.Video(query, null, null, null, null, null, null, null);
                    videoQuery = videoQuery.AddQueryOption("$top", BingDefaultSearchLimit);

                    var webResults = videoQuery.Execute();

                    foreach (var result in webResults)
                    {
                        searchResults.Add(new BingSearchVideoResult(result.MediaUrl, result.Title));
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

                return new BaseJsonResult<IEnumerable<BingSearchVideoResult>>(searchResults);
            });
        }

        /// <summary>
        /// Documentation under IChronozoomSVC
        /// </summary>
        BaseJsonResult<IEnumerable<BingSearchDocumentResult>> IBingSearchAPI.GetDocuments(string query, string doctype)
        {
            return ApiOperation<BaseJsonResult<IEnumerable<BingSearchDocumentResult>>>(delegate(User user, Storage storage)
            {
                var searchResults = new List<BingSearchDocumentResult>();

                if (string.IsNullOrEmpty(BingAccountKey) && !string.IsNullOrEmpty(ConfigurationManager.AppSettings["AzureMarketplaceAccountKey"]))
                {
                    BingAccountKey = ConfigurationManager.AppSettings["AzureMarketplaceAccountKey"];
                }

                //if (user == null)
                //{
                //    // Setting status code to 403 to prevent redirection to authentication resource if status code is 401.
                //    SetStatusCode(HttpStatusCode.Forbidden, ErrorDescription.UnauthorizedUser);
                //    return new BaseJsonResult<IEnumerable<BingSearchDocumentResult>>(searchResults);
                //}

                try
                {
                    var bingContainer = new Bing.BingSearchContainer(new Uri(BingAPIRootUrl));
                    bingContainer.Credentials = new NetworkCredential(BingAccountKey, BingAccountKey);

                    var webQuery = bingContainer.Web(query, null, null, null, null, null, null, doctype);
                    webQuery = webQuery.AddQueryOption("$top", BingDefaultSearchLimit);

                    var webResults = webQuery.Execute();
                
                    foreach (var result in webResults)
                    {
                        searchResults.Add(new BingSearchDocumentResult(result.Url, result.Title));
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

                return new BaseJsonResult<IEnumerable<BingSearchDocumentResult>>(searchResults);
            });
        }        
    }
}