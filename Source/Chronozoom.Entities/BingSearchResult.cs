// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    /// <summary>
    /// Contains base information about Bing search result.
    /// </summary>
    [DataContract]
    public class BaseBingSearchResult
    {
        /// <summary>
        /// The url of search result.
        /// </summary>
        [DataMember(Name = "url")]
        public string Url { get; set; }

        /// <summary>
        /// The title of search result.
        /// </summary>
        [DataMember(Name = "title")]
        public string Title { get; set; }

        /// <summary>
        /// Initializes a new instance of BaseBingSearchResult.
        /// </summary>
        /// <param name="url">The url of search result.</param>
        /// <param name="title">The title of search result.</param>
        public BaseBingSearchResult(string url, string title)
        {
            this.Url = url;
            this.Title = title;
        }
    }

    /// <summary>
    /// Contains information about Bing images search result.
    /// </summary>
    [DataContract]
    public class BingSearchImageResult: BaseBingSearchResult
    {
        /// <summary>
        /// Initializes a new instance of BingSearchImageResult.
        /// </summary>
        /// <param name="url">The url of search result.</param>
        /// <param name="title">The title of search result.</param>
        public BingSearchImageResult(string url, string title)
            : base(url, title)
        {
        
        }
    }

    /// <summary>
    /// Contains information about Bing videos search result.
    /// </summary>
    [DataContract]
    public class BingSearchVideoResult: BaseBingSearchResult
    {
        /// <summary>
        /// Initializes a new instance of BingSearchVideoResult.
        /// </summary>
        /// <param name="url">The url of search result.</param>
        /// <param name="title">The title of search result.</param>
        public BingSearchVideoResult(string url, string title)
            : base(url, title)
        {
        
        }
    }

    /// <summary>
    /// Contains information about Bing web search result.
    /// </summary>
    [DataContract]
    public class BingSearchDocumentResult : BaseBingSearchResult 
    {
        /// <summary>
        /// Initializes a new instance of BingSearchDocumentResult.
        /// </summary>
        /// <param name="url">The url of search result.</param>
        /// <param name="title">The title of search result.</param>
        public BingSearchDocumentResult(string url, string title)
            : base(url, title)
        {

        }
    }
}
