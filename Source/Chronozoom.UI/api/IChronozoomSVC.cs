using Chronozoom.Entities;
using System;
using System.Collections.Generic;
// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Web;

namespace Chronozoom.UI
{
    [SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "SVC")]
    [SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Chronozoom")]
    [ServiceContract(Namespace = "")]
    public interface IChronozoomSVC
    {
        /// <summary>
        /// Returns timeline data within a specified range of years from a collection or a superCollection.
        /// </summary>
        /// <param name="superCollection">Name of the superCollection to query.</param>
        /// <param name="collection">Name of the collection to query.</param>
        /// <param name="start">Year at which to begin the search, between -20000000000 and 9999.</param>
        /// <param name="end">Year at which to end the search, between -20000000000 and 9999.</param>
        /// <param name="minspan">Filters the search results to a particular time scale.</param>
        /// <param name="commonAncestor">Least Common Ancestor, a timeline identifier used to hint the server to retrieve timelines close to this location.</param>
        /// <param name="maxElements">The maximum number of elements to return.</param>
        /// <param name="depth">The max depth for children timelines.</param>
        /// <returns>Timeline data in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL:
        /// http://[site URL]/api/[superCollectionName]/[collectionName]/timelines
        ///
        /// Request body (JSON):
        /// {
        ///    start: 1800
        ///    end: 1920
        ///    minspan: 
        ///    lca: 
        ///    maxElements: 25
        /// }
        /// ]]>
        /// </example>
        [SuppressMessage("Microsoft.Naming", "CA1716:IdentifiersShouldNotMatchKeywords", MessageId = "End")]
        [SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "minspan")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        Timeline GetTimelines(string superCollection, string collection, string start, string end, string minspan, string commonAncestor, string maxElements, string depth);

        /// <summary>
        /// Performs a search for a specific term within a collection or a superCollection.
        /// </summary>
        /// <param name="superCollection">Name of the superCollection to query.</param>
        /// <param name="collection">Name of the collection to query.</param>
        /// <param name="searchTerm">The term to search for.</param>
        /// <returns>Search results in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL:
        /// http://[site URL]/api/[superCollectionName]/[collectionName]/search
        ///
        /// Request body (JSON):
        /// {
        ///    searchTerm: "Pluto"
        /// }
        /// ]]>
        /// </example>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        BaseJsonResult<IEnumerable<SearchResult>> Search(string superCollection, string collection, string searchTerm);

        /// <summary>
        /// Returns a list of tours for the default collection and default superCollection.
        /// </summary>
        /// <returns>A list of tours in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL: 
        /// http://[site URL]/api/tours
        /// ]]>
        /// </example>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/tours")]
        BaseJsonResult<IEnumerable<Tour>> GetDefaultTours();

        /// <summary>
        /// Returns a list of tours for a given collection or superCollection.
        /// </summary>
        /// <param name="superCollection">Name of the superCollection to query.</param>
        /// <param name="collection">Name of the collection to query.</param>
        /// <returns>A list of tours in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL: 
        /// http://[site URL]/api/[superCollectionName]/[collectionName]/tours
        /// ]]>
        /// </example>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/{supercollection}/{collection}/tours")]
        BaseJsonResult<IEnumerable<Tour>> GetTours(string superCollection, string collection);

        /// <summary>
        /// Creates a new user, or updates an existing user's information and associated personal collection.
        /// </summary>
        /// <remarks>
        /// If the user ID is omitted then a new user is created.
        /// If there is no ACS the user is treated as anonymous and granted access to the sandbox collection.
        /// If the anonymous user does not exist in the database then it is created.
        /// A new superCollection with the user's display name is added.
        /// A new default collection with the user's display name is added to this superCollection.
        /// A new user with the specified attributes is created.
        ///
        /// If the specified user display name does not exist it is considered an error.
        /// If the user display name is specified and it exists then the user's attributes are updated.
        /// </remarks>
        /// <param name="userRequest">JSON containing the request details.</param>
        /// <returns>The URL for the new user collection.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: PUT
        ///
        /// URL:
        /// http://[site URL]/api/[superCollectionName]/[collectionName]/user
        /// 
        /// Request body (JSON):
        /// {
        ///     id: "0123456789",
        ///     displayName: "Joe",
        ///     email: "email@email.com"
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/user", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        String PutUser(User userRequest);

        /// <summary>
        /// Provides information about the ChronoZoom service to the clients. Used internally by the ChronoZoom client.
        /// </summary>
        /// <returns>A ServiceInformation object describing parameter from the running service</returns>
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/info", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        ServiceInformation GetServiceInformation();

        /// <summary>
        /// Deletes the user with the specified user ID.
        /// </summary>
        /// <param name="userRequest">JSON containing the request details.</param>
        /// <returns>HTTP response code.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: DELETE
        /// URL:
        /// http://{site URL}/chronozoom.svc/{supercollection}/{collection}/user
        /// 
        /// Request body (JSON):
        /// {
        ///     id: "0123456789"
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/user", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteUser(User userRequest);

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/user", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        User GetUser();

        /// <summary>
        /// Creates a new collection using the specified name.
        /// </summary>
        /// <remarks>
        /// If a collection of the specified name does not exist then a new collection is created. 
        /// If the collection exists and the authenticated user is the author then the collection is modified. 
        /// If no author is registered then the authenticated user is set as the author. 
        /// The title field can't be modified because it is part of the URL (the URL can be indexed).
        /// </remarks>
        /// <param name="superCollectionName">The name of the parent superCollection for the collection.</param>
        /// <param name="collectionName">The name of the collection to create.</param>
        /// <param name="collectionRequest">The markup for the collection to create in JSON format.</param>
        /// <returns></returns>
        /// <example><![CDATA[ 
        /// HTTP verb: PUT
        ///
        /// URL:
        /// http://{site URL}/chronozoom.svc/{superCollectionName}/{collectionName}
        ///
        /// Request body (JSON):
        /// {
        ///      name: "My Collection"
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Guid PutCollectionName(string superCollectionName, string collectionName, Collection collectionRequest);

        /// <summary>
        /// Deletes the specified collection.
        /// </summary>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to delete.</param>
        /// <returns>HTTP response code.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: DELETE
        ///
        /// URL:
        /// http://{site URL}/chronozoom.svc/{superCollectionName}/{collectionName}
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteCollection(string superCollectionName, string collectionName);

        /// <summary>
        /// Creates or updates the timeline in a given collection. 
        /// </summary>
        /// <remarks>
        /// If an ID is specified but the collection does not exist, the request will fail ("not found" status).
        /// If an ID is not specified, a new timeline will be added to the collection. 
        /// For a new timeline, if the parent is not defined the root timeline will be set as the parent.
        /// If the timeline with the specified identifier exists, then the existing timeline is updated.
        /// </remarks>
        /// <param name="superCollectionName">The parent collection.</param>
        /// <param name="collectionName">The name of the collection to update.</param>
        /// <param name="timelineRequest">Timeline data in JSON format.</param>
        /// <returns>HTTP status code.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: PUT
        ///
        /// URL:
        /// http://[site URL]/api/[superCollectionName]/[collectionName]/timeline
        ///
        /// Request body (JSON):
        /// {
        ///      id: "0123456789"
        ///      title: "A New Title"
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}/timeline", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Guid PutTimeline(string superCollectionName, string collectionName, TimelineRaw timelineRequest);

        /// <summary>
        /// Deletes the timeline with the specified ID.
        /// </summary>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection from which the timeline should be deleted.</param>
        /// <param name="timelineRequest">The request in JSON format.</param>
        /// <example><![CDATA[ 
        /// HTTP verb: DELETE
        ///
        /// URL:
        /// http://[site URL]/api/[superCollectionName]/[collectionName]/timeline
        ///
        /// Request body (JSON):
        /// {
        ///      timelineRequest: Need request body format.
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}/timeline", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteTimeline(string superCollectionName, string collectionName, Timeline timelineRequest);
        
        /// <summary>
        /// Creates or updates the exhibit and its content items in a given collection. If the collection does not exist, then the command will silently fail.
        /// </summary>
        /// <remarks>
        /// If an exhibit id is not specified, a new exhibit is added to the collection. 
        /// If the ID for an existing exhibit is specified then the exhibit will be updated. 
        /// If the exhibit ID to be updated does not exist a "not found" status is returned. 
        /// If the parent timeline is not specified the exhibit is added to the root timeline. 
        /// Otherwise, the exhibit is added to the specified parent timeline. 
        /// If an invalid parent timeline is specified then the request will fail. 
        /// </remarks>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="exhibitRequest">The exhibit data in JSON format.</param>
        /// <returns>An exhibit in JSON format.</returns>
        /// <example><![CDATA[ 
        /// **HTTP verb:** PUT
        ///
        /// **URL:**
        ///     http://[site URL]/api/[superCollectionName]/[collectionName]/exhibit
        ///
        /// **Request body:**
        ///     {
        ///          
        ///     }
        /// ]]>
        /// </example>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}/exhibit", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        PutExhibitResult PutExhibit(string superCollectionName, string collectionName, ExhibitRaw exhibitRequest);

        /// <summary>
        /// Deletes the specified exhibit from the specified collection.
        /// </summary>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="exhibitRequest">The exhibit ID in JSON format.</param>
        /// <example><![CDATA[ 
        /// **HTTP verb:** DELETE
        ///
        /// **URL:**
        ///     http://[site URL]/api/[superCollectionName]/[collectionName]/exhibit
        ///
        /// **Request body:**
        ///     {
        ///          id: "0123456789"
        ///     }
        /// ]]></example>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}/exhibit", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteExhibit(string superCollectionName, string collectionName, Exhibit exhibitRequest);

        /// <summary>
        /// Creates or updates the content item in a given collection. If the collection does not exist the request will fail.
        /// </summary>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="contentItemRequest">The content item data in JSON format.</param>
        /// <returns></returns>
        /// <example><![CDATA[ 
        /// **HTTP verb:** PUT
        ///
        /// **URL:**
        ///     http://[site URL]/api/[superCollectionName]/[collectionName]/contentitem
        ///
        /// **Request body:**
        ///     {
        ///          
        ///     }
        /// ]]></example>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}/contentitem", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Guid PutContentItem(string superCollectionName, string collectionName, ContentItemRaw contentItemRequest);

        /// <summary>
        /// Delete the specified content item from the specified collection.
        /// </summary>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="contentItemRequest">The request in JSON format.</param>
        /// <example><![CDATA[ 
        /// **HTTP verb:** DELETE
        ///
        /// **URL:**
        ///     http://[site URL]/api/[superCollectionName]/[collectionName]/contentitem
        ///
        /// **Request body:**
        ///     {
        ///          id: "0123456789"
        ///     }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}/contentitem", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteContentItem(string superCollectionName, string collectionName, ContentItem contentItemRequest);

        /// <summary>
        /// Retrieves a path to the given content id.
        /// 
        /// For t48fbb8a8-7c5d-49c3-83e1-98939ae2ae6, this API retrieves /t00000000-0000-0000-0000-000000000000/t48fbb8a8-7c5d-49c3-83e1-98939ae2ae67
        /// </summary>
        /// <returns>The full path to the content</returns>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "{supercollection}/{collection}/{reference}/contentpath")]
        string GetContentPath(string superCollection, string collection, string reference);
        
        /// <summary>
        /// Retrieve the list of all collections.
        /// </summary>
        /// <example><![CDATA[ 
        /// **HTTP verb:** GET
        ///
        /// **URL:**
        ///     http://[site URL]/api/collections
        ///                                /// **Request body:**
        ///     {
        ///          name: "Super Collection",
        ///          collection: [
        ///             { name: "Collection 1" },
        ///             { name: "Collection 2" },
        ///          ]
        ///     }
        /// ]]>
        /// </example>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebGet(UriTemplate = "/collections", ResponseFormat = WebMessageFormat.Json)]
        IEnumerable<SuperCollection> GetCollections();
    }
}