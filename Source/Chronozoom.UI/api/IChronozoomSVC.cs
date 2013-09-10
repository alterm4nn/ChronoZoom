using Chronozoom.Entities;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
        /// http://{URL}/api/gettimelines?supercollection={supercollection}&collection={collection}&start={year}&end={year}
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
        /// <remarks>
        /// The syntax for search is different from other requests. The values for supercollection and collection are specified as request parameters rather than as part of the URL.
        /// </remarks>
        /// <param name="superCollection">Name of the supercollection to query.</param>
        /// <param name="collection">Name of the collection to query.</param>
        /// <param name="searchTerm">The term to search for.</param>
        /// <returns>Search results in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL:
        /// http://{URL}/api/search?searchTerm={term}&supercollection={supercollection}&collection={collection}
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
        /// http://{URL}/api/tours
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
        /// http://{URL}/api/{supercollection}/{collection}/tours
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
        /// http://{URL}/api/{supercollection}/{collection}/user
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
        /// Internal. Provides information about the ChronoZoom service to clients.
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
        /// 
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/user
        /// 
        /// Request body (JSON):
        /// {
        ///     displayName: "Neil"
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/user", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteUser(User userRequest);

        /// <summary>
        /// Returns the user by name, if name parameter is empty returns current user.
        /// </summary>
        /// <example>
        /// <![CDATA[
        /// HTTP verb: GET
        /// 
        /// URL:
        /// http://{URL}/api/user
        /// ]]>
        /// </example>
        /// <param name="name">The name of user to get.</param>
        /// <returns>JSON containing data for the current user.</returns>
        /// 
      
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/user?name={name}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        User GetUser(string name);


        /// <summary>
        /// Creates a new collection using the specified name.
        /// </summary>
        /// <remarks>
        /// If a collection of the specified name does not exist then a new collection is created. 
        /// The title field can't be modified because it is part of the URL (the URL can be indexed).
        /// </remarks>
        /// <param name="superCollectionName">The name of the parent supercollection.</param>
        /// <param name="collectionName">The name of the collection to create.</param>
        /// <param name="collectionRequest">[Collection](#collection) data in JSON format.</param>
        /// <returns></returns>
        /// <example><![CDATA[ 
        /// HTTP verb: PUT
        ///
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}
        ///
        /// Request body (JSON):
        /// {
        ///      id: "{id}",
        ///      title: "{title}"
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/{superCollectionName}/{collectionName}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Guid PostCollection(string superCollectionName, string collectionName, Collection collectionRequest);

        /// <summary>
        /// Modifies an existing collection.
        /// </summary>
        /// <remarks>
        /// If the collection exists and the authenticated user is the author then the collection is modified. 
        /// If no author is registered then the authenticated user is set as the author. 
        /// The title field can't be modified because it is part of the URL (the URL can be indexed).
        /// </remarks>
        /// <param name="superCollectionName">The name of the parent supercollection.</param>
        /// <param name="collectionName">The name of the collection to create.</param>
        /// <param name="collectionRequest">[Collection](#collection) data in JSON format.</param>
        /// <returns></returns>
        /// <example><![CDATA[ 
        /// HTTP verb: PUT
        ///
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}
        ///
        /// Request body (JSON):
        /// {
        ///      id: "{id}",
        ///      title: "{title}"
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Guid PutCollection(string superCollectionName, string collectionName, Collection collectionRequest);

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
        /// http://{URL}/api/{supercollection}/{collection}
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
        /// <param name="timelineRequest">[Timeline](#timeline) data in JSON format.</param>
        /// <returns>HTTP status code.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: PUT
        ///
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/timeline
        ///
        /// Request body (JSON):
        /// {
        ///      ParentTimelineId: "ff5214e1-1bf4-4af5-8835-96cff2ce2cfd",
        ///      Regime: null - optional,
        ///      end: -377.945205,
        ///      start: -597.542466,
        ///      title: "Timeline Title"
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
        /// http://{URL}/api/{supercollection}/{collection}/timeline
        ///
        /// Request body (JSON):
        /// {
        ///      id: "0123456789"
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}/timeline", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteTimeline(string superCollectionName, string collectionName, Timeline timelineRequest);
        
        /// <summary>
        /// Creates or updates the exhibit and its content items in a given collection. If the collection does not exist, then the command will fail. Prior to running this command, you will need to create the associated content items.
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
        /// <param name="exhibitRequest">[Exhibit](#exhibit) data in JSON format.</param>
        /// <returns>[Exhibit](#exhibit) data in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: PUT
        ///
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/exhibit
        ///
        /// Request body (JSON):
        /// {
        ///     ParentTimelineId: "123456"
        ///     id: "0123456789",
        ///     title: "Mars Exploration",
        ///     contentItems: "{contentItems}" 
        ///     time: 565
        /// }
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
        /// <param name="exhibitRequest">The exhibit request data in JSON format.</param>
        /// <example><![CDATA[ 
        /// HTTP verb: DELETE
        ///
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/exhibit
        ///
        /// Request body:
        /// {
        ///      id: "0123456789"
        /// }
        /// ]]></example>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}/exhibit", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteExhibit(string superCollectionName, string collectionName, Exhibit exhibitRequest);

        /// <summary>
        /// Creates or updates the content item in a given collection. If the collection does not exist the request will fail.
        /// </summary>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="contentItemRequest">[ContentItem](#contentitem) data in JSON format.</param>
        /// <returns></returns>
        /// <example><![CDATA[ 
        /// HTTP verb: PUT
        ///
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/contentitem
        ///
        /// Request body:
        /// {
        ///     id: "0123456789",
        ///     title: "The Outer Planets",
        ///     uri: "http://www.example.com/images/planets.png"
        /// }
        /// ]]></example>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}/contentitem", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Guid PutContentItem(string superCollectionName, string collectionName, ContentItemRaw contentItemRequest);

        /// <summary>
        /// Delete the specified content item from the specified collection.
        /// </summary>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="contentItemRequest">The request data in JSON format.</param>
        /// <example><![CDATA[ 
        /// HTTP verb: DELETE
        ///
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/contentitem
        ///
        /// Request body:
        /// {
        ///      id: "0123456789"
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}/contentitem", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteContentItem(string superCollectionName, string collectionName, ContentItem contentItemRequest);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/{superCollectionName}/{collectionName}/tour", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        TourResult PostTour(string superCollectionName, string collectionName, Tour tourRequest);

        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}/tour", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        TourResult PutTour(string superCollectionName, string collectionName, Tour tourRequest);

        /// <summary>
        /// Creates or updates a tour with bookmark support.
        /// </summary>
        /// <remarks>
        /// All bookmarks in a tour must belong to the same collection and the user 
        /// must have permission to modify that collection.
        /// Supported operations include:
        /// To Create a new tour, do not specify a tour id or bookmark ids for the new entities to be created.
        /// To modify an existing tour, specify the tour id and any of the tour fields (id, description, audio) that need to be modified.
        /// If a tour id is specified and it does not exist, a "not found" status is returned.
        /// If a tour id is specified and it exists, any specified fields are updated. 
        /// Delete all existing bookmarks and add bookmarks defined in the bookmarks JSON object to the tour.
        /// The sequence ids of the bookmarks are automatically generated based on the order they are received.
        ///     
        /// If an invalid tour Id, bookmark Id or bookmark sequence Id is specified then the request will fail. 
        /// </remarks>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="tourRequest">The tour data in JSON format.</param>
        /// <returns>A list of guids of the tour guid followed by bookmark guids in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: PUT
        ///
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/tour2
        ///
        /// Request body:
        /// {
        ///          
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}/tour2", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        TourResult PutTour2(string superCollectionName, string collectionName, Tour tourRequest);

        /// <summary>
        /// Deletes the specified tour.
        /// </summary>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="tourRequest">The tour ID in JSON format.</param>
        /// <example><![CDATA[ 
        /// HTTP verb: DELETE
        ///
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/tour2
        ///
        /// Request body:
        /// {
        ///     id: "5c07b2bf-65e1-45e1-a9cd-792a7767d685"
        /// }
        /// ]]></example>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}/tour", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteTour(string superCollectionName, string collectionName, Tour tourRequest);

        /// <summary>
        /// Adds a list of bookmarks to an existing tour.
        /// </summary>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="tourRequest">The request in JSON format.</param>
        /// <returns>A list of guids of tour guid followed by new bookmark guids in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: DELETE
        ///
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/{collectionName}/bookmark
        ///
        /// Request body:
        /// {
        ///      id: "0123456789"
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}/bookmark", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        TourResult PutBookmarks(string superCollectionName, string collectionName, Tour tourRequest);

        /// <summary>
        /// Delete a list of bookmarks belonging to the same tour.
        /// </summary>
        /// <param name="superCollectionName">The name of the parent collection.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="tourRequest">The request in JSON format.</param>
        /// <example><![CDATA[ 
        /// HTTP verb: DELETE
        ///
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/bookmark
        ///
        /// Request body:
        /// {
        ///      id: "0123456789"
        /// }
        /// ]]>
        /// </example>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}/bookmark", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteBookmarks(string superCollectionName, string collectionName, Tour tourRequest);

        /// <summary>
        /// Retrieves a path to the given content id.
        /// 
        /// For t48fbb8a8-7c5d-49c3-83e1-98939ae2ae6, this API retrieves /t00000000-0000-0000-0000-000000000000/t48fbb8a8-7c5d-49c3-83e1-98939ae2ae67
        /// </summary>
        /// <returns>The full path to the content.</returns>
        /// <example><![CDATA[
        /// HTTP verb: GET
        /// 
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/{reference}/contentpath
        /// ]]>
        /// </example>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "{supercollection}/{collection}/{reference}/contentpath")]
        string GetContentPath(string superCollection, string collection, string reference);
        
        /// <summary>
        /// Retrieve the list of all supercollections.
        /// </summary>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL:
        /// http://{URL}/api/supercollections
        /// ]]>
        /// </example>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebGet(UriTemplate = "/supercollections", ResponseFormat = WebMessageFormat.Json)]
        IEnumerable<SuperCollection> GetSuperCollections();

        /// <summary>
        /// Retrieve the list of all collections.
        /// </summary>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL:
        /// http://{URL}/api/{superCollection}/collections
        /// ]]>
        /// </example>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebGet(UriTemplate = "/{superCollectionName}/collections", ResponseFormat = WebMessageFormat.Json)]
        IEnumerable<Collection> GetCollections(string superCollectionName);

        /// <summary>
        /// Retrieve file mime type by url
        /// </summary>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL:
        /// http://{URL}/api/getmimetypebyurl
        /// ]]>
        /// </example>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/getmimetypebyurl?url={url}", ResponseFormat = WebMessageFormat.Json)]
        string GetMemiTypeByUrl(string url);


        #region FavoriteTimelines

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/getuserfavorites", ResponseFormat = WebMessageFormat.Json)]
        Collection<TimelineShortcut> GetUserFavorites();

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/putuserfavorite?guid={favoriteGUID}", ResponseFormat = WebMessageFormat.Json)]
        bool PutUserFavorite(string favoriteGUID);

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/deleteuserfavorite?guid={favoriteGUID}", ResponseFormat = WebMessageFormat.Json)]
        bool DeleteUserFavorite(string favoriteGUID);

        #endregion

        #region FeaturedTimelines

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/getuserfeatured?guid={featuredGUID}", ResponseFormat = WebMessageFormat.Json)]
        Collection<TimelineShortcut> GetUserFeatured(string featuredGUID);

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/putuserfeatured?guid={featuredGUID}", ResponseFormat = WebMessageFormat.Json)]
        bool PutUserFeatured(string featuredGUID);

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/deleteuserfeatured?guid={featuredGUID}", ResponseFormat = WebMessageFormat.Json)]
        bool DeleteUserFeatured(string featuredGUID);

        #endregion
    }

    [ServiceContract(Namespace = "")]
    public interface IBingSearchAPI
    {
        /// <summary>
        /// Performs images search for a search query via Bing Search API.
        /// </summary>
        /// <param name="query">The query to search for.</param>
        /// <param name="top">The number of the results to return.</param>
        /// <param name="skip">The offset requested for the srarting point of returned results.</param>
        /// <returns>Search results (images) in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL:
        /// http://{URL}/api/bing/getImages?query={query}&top={top}&skip={skip}
        /// ]]>
        /// </example>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        BaseJsonResult<IEnumerable<Bing.ImageResult>> GetImages(string query, string top, string skip);

        /// <summary>
        /// Performs videos search for a search query via Bing Search API.
        /// </summary>
        /// <param name="query">The query to search for.</param>
        /// <param name="top">The number of the results to return.</param>
        /// <param name="skip">The offset requested for the srarting point of returned results.</param>
        /// <returns>Search results (videos) in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL:
        /// http://{URL}/api/bing/getVideos?query={query}&top={top}&skip={skip}
        /// ]]>
        /// </example>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        BaseJsonResult<IEnumerable<Bing.VideoResult>> GetVideos(string query, string top, string skip);

        /// <summary>
        /// Performs documents web search for a search query via Bing Search API.
        /// </summary>
        /// <param name="query">The query to search for.</param>
        /// <param name="doctype">The filetype to search for.</param>
        /// <param name="top">The number of the results to return.</param>
        /// <param name="skip">The offset requested for the srarting point of returned results.</param>
        /// <returns>Search results (documents) in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL:
        /// http://{URL}/api/bing/getDocuments?query={query}&doctype={doctype}&top={top}&skip={skip}
        /// ]]>
        /// </example>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        BaseJsonResult<IEnumerable<Bing.WebResult>> GetDocuments(string query, string doctype, string top, string skip);
    }

    [ServiceContract(Namespace = "")]
    public interface ITwitterAPI
    {   
        /// <summary>
        /// Returns recent N timeline tweets of ChronoZoom Twitter account.
        /// </summary>
        /// <returns>Recent N timeline tweets of ChronoZoom Twitter account in JSON format.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        ///
        /// URL:
        /// http://{URL}/api/twitter/getRecentTweets
        /// ]]>
        /// </example>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        BaseJsonResult<IEnumerable<TweetSharp.TwitterStatus>> GetRecentTweets();
    }
}