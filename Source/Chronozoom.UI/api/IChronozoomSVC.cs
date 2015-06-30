using Chronozoom.Entities;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Web;

namespace Chronozoom.UI
{
    [SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "SVC")]
    [SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Chronozoom")]
    [ServiceContract(Namespace = "Chronozoom.UI.IChronozoomSVC")]
    public interface IChronozoomSVC
    {
        /// <summary>
        /// For exporting a timeline and it's descendant sub-timelines to temporary storage so can be imported later
        /// as a copy under a different timeline or collection.
        /// </summary>
        /// <param name="topmostTimelineId">Must be a GUID, provided as a string.</param>
        /// <returns>
        /// A flattened list of timelines in JSON format, starting with the timeline indicated via the topmostTimelineId,
        /// and including each descendant timeline. (Timelines can contain child timelines.)
        /// Each flattened timeline entry includes all of it's exhibits and their content items.
        /// </returns>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/export/timeline/{topmostTimelineId}")]
        List<Utils.ExportImport.FlatTimeline> ExportTimelines(string topmostTimelineId);

        /// <summary>
        /// For exporting an exhibit to temporary storage so can be imported later
        /// as a copy.
        /// </summary>
        /// <param name="exhibitId">Must be a GUID, provided as a string.</param>
        /// <returns>
        /// A json formatted Exhibit
        /// </returns>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/export/exhibit/{exhibitId}")]
        Exhibit ExportExhibit(string exhibitId);

        /// <summary>
        /// For importing a timeline and it's descendant sub-timelines into an existing timeline.
        /// Typically this is a timeline from a different collection that is being copied.
        /// It should be noted that the supplied new timeline tree to import must fit within the
        /// date bounds of the target destination timeline's start and end dates.
        /// </summary>
        /// <param name="intoTimelineId">Must be a GUID, provided as a string.</param>
        /// <param name="newTimelineTree">Must be a structure created by an IChronozoomSVC.ExportTimelines implementation, provided as a JSON.stringify string.</param>
        /// <returns>A success, warning about date bounds exceeded, or general error message.</returns>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/import/timeline/{intoTimelineId}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        String ImportTimelines(string intoTimelineId, List<Utils.ExportImport.FlatTimeline> newTimelineTree);

        /// <summary>
        /// For importing an exhibit into an existing timeline.
        /// It should be noted that the supplied exhibit to import must fit within the
        /// date bounds of the target destination timeline's start and end dates.
        /// </summary>
        /// <param name="intoTimelineId">Must be a GUID, provided as a string.</param>
        /// <param name="newExhibit">Must be a structure created by an IChronozoomSVC.ExportExhibit implementation, provided as a JSON.stringify string.</param>
        /// <returns>A success, warning about date bounds exceeded, or general error message.</returns>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/import/exhibit/{intoTimelineId}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        String ImportExhibit(string intoTimelineId, Exhibit newExhibit);


        /// <summary>
        /// For importing a collection from a file provided by the user as a new collection under the existing user, with new GUIDs.
        /// If the user is not logged in as a valid user then the import will not proceed.
        /// If the collection title already exists for the current user then the import still goes ahead but with a new collection title.
        /// Permissions and creatorship history are not imported, just content, so the new collection will default to being unpublished.
        /// Currently provided tours are ignored. Only the collection customization, it's timelines, exhibits and content items are imported.
        /// </summary>
        /// <param name="collectionTree">Must be a structure created by CZ.Menus.ExportCollection, provided as a JSON.stringify string.</param>
        /// <returns>A success or general error message.</returns>
        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/import/collection", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        String ImportCollection(Utils.ExportImport.FlatCollection collectionTree);

        /// <summary>Not directly used by JavaScript client so not exposed as an OperationContract method.</summary>
        /// <param name="storage"></param>
        /// <param name="superCollectionName">The title of the desired supercollection. Leaving blank returns the default supercollection's default collection id.</param>
        /// <param name="collectionPath">
        /// The path of the desired collection belonging the the aforementioned supercollection.
        /// If the supercollection title is provided, but the collection title is left blank, then the id of the default collection belonging to the desired supercollection is returned.
        /// </param>
        /// <returns>The GUID id of the desired collection if it exists in the db, or an empty GUID if it can't be found.</returns>
        Guid CollectionIdOrDefault(Storage storage, string superCollectionName, string collectionPath);

        /// <summary>Returns the root timeline id for the given collection.</summary>
        /// <param name="superCollection">The supercollection's name.</param>
        /// <param name="collection">The collection's path.</param>
        /// <returns>
        /// The GUID of the root timeline if it can be found else an empty GUID.
        /// ChronoZoom's Cosmos collection's root timeline equals an empty GUID too.
        /// </returns>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        Guid GetRoot(string superCollection, string collection);

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
        /// URL:
        /// http://{URL}/api/gettimelines?supercollection={supercollection}&collection={collection}&start={year}&end={year}
        /// ]]></example>
        [SuppressMessage("Microsoft.Naming", "CA1716:IdentifiersShouldNotMatchKeywords", MessageId = "End")]
        [SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "minspan")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        Timeline GetTimelines(string superCollection, string collection, string start, string end, string minspan, string commonAncestor, string maxElements, string depth);

        /// <summary>
        /// Use to populate a drop-down list box of search scope options. Returns a select element friendly version of the SearchScope enum.
        /// </summary>
        /// <returns>A descriptive list of all of the search scope options, along with the value to pass (which is the dictionary key.)</returns>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/search/scope/options")]
        Dictionary<byte, string> SearchScopeOptions();

        /// <summary>
        /// Searches for timeline titles, exhibit titles or content item titles containing the provided search term.
        /// Note that at least two searchTerm characters are required in order to get a result.
        /// Should an excessive number of results be found, the results are limited to the first 25 per type. (75 max.)
        /// </summary>
        /// <example><![CDATA[  
        /// HTTP verb: GET
        /// URL: 
        /// http://{domain}/api/search?superCollection={superCollection}&collection={collection}&searchTerm={searchTerm}&searchScope={searchScope}
        /// ]]></example>
        /// <param name="superCollection">The currently loaded supercollection.</param>
        /// <param name="collection">The currently loaded collection.</param>
        /// <param name="searchTerm">The words or part of a word or words to look for.</param>
        /// <param name="searchScope">
        /// Specify where to search using a choice from the SearchScope enumuration list.
        /// Choices include the current collection and all publicly viewable collections.
        /// Use GET SearchScopeOptions to obtain a copy of the enumeration list.
        /// </param>
        /// <returns>
        /// A list of search results in JSON format, including the type of result (timeline, exhibit or content item,) it's title, what collection it belongs to,
        /// and sufficient data to navigate to each result. Results are sorted alphabetically within each type of result, with the current collection's results
        /// appearing first when there are multiple results with the same title.
        /// </returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        IEnumerable<SearchResult> Search(string superCollection, string collection, string searchTerm, byte searchScope = 1);

        /// <summary>
        /// Provides a specified tour based on the provided GUID rather than a tour sequence or result ordinal,
        /// since a tour sequence or ordinal for the same tour can vary in future if the tours are rearranged.
        /// Consumed by cz.js which uses the results to automatically start a tour on page load.
        /// </summary>
        /// <param name="guid">Must be a tour id that belongs to the default super-collection's default collection.</param>
        /// <returns>A single tour in JSON format, or null if the parameter/request is incorrect.</returns>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        [OperationContract(Name = "GetTourDefaultSuperCollection")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/tour?guid={guid}")]
        Tour GetTour(Guid guid);

        /// <summary>
        /// Provides a specified tour based on the provided GUID rather than a tour sequence or result ordinal,
        /// since a tour sequence or ordinal for the same tour can vary in future if the tours are rearranged.
        /// Consumed by cz.js which uses the results to automatically start a tour on page load.
        /// </summary>
        /// <param name="superCollection"></param>
        /// <param name="guid">Must be a tour id that belongs to the specified super-collection's default collection.</param>
        /// <returns>A single tour in JSON format, or null if the parameter/request is incorrect.</returns>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        [OperationContract(Name = "GetTourDefaultCollection")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/{supercollection}/tour?guid={guid}")]
        Tour GetTour(string superCollection, Guid guid);

        /// <summary>
        /// Provides a specified tour based on the provided GUID rather than a tour sequence or result ordinal,
        /// since a tour sequence or ordinal for the same tour can vary in future if the tours are rearranged.
        /// Consumed by cz.js which uses the results to automatically start a tour on page load.
        /// </summary>
        /// <param name="superCollection"></param>
        /// <param name="collection"></param>
        /// <param name="guid">Must be a tour id that belongs to the collection.</param>
        /// <returns>A single tour in JSON format, or null if the parameter/request is incorrect.</returns>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        [OperationContract(Name = "GetTourSpecificCollection")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/{supercollection}/{collection}/tour?guid={guid}")]
        Tour GetTour(string superCollection, string collection, Guid guid);

        /// <summary>
        /// Returns a list of tours for the default collection and default superCollection.
        /// </summary>
        /// <returns>A list of tours in JSON format.</returns>
        /// <example><![CDATA[  
        /// HTTP verb: GET
        /// URL: 
        /// http://{URL}/api/tours
        /// ]]></example>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/tours")]
        BaseJsonResult<IEnumerable<Tour>> GetDefaultTours();

        /// <summary>
        /// Returns a list of tours for a specified supercollection's default collection.
        /// </summary>
        /// <param name="superCollection">Name of the superCollection to query.</param>
        /// <returns>A list of tours in JSON format.</returns>
        /// <example><![CDATA[  
        /// HTTP verb: GET
        /// URL: 
        /// http://{URL}/api/{supercollection}/{collection}/tours
        /// ]]></example>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        [OperationContract(Name = "GetToursDefaultCollection")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/{supercollection}/tours")]
        BaseJsonResult<IEnumerable<Tour>> GetTours(string superCollection);

        /// <summary>
        /// Returns a list of tours for a specified collection.
        /// </summary>
        /// <param name="superCollection">Name of the superCollection to query.</param>
        /// <param name="collection">Name of the collection to query.</param>
        /// <returns>A list of tours in JSON format.</returns>
        /// <example><![CDATA[  
        /// HTTP verb: GET
        /// URL: 
        /// http://{URL}/api/{supercollection}/{collection}/tours
        /// ]]></example>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures")]
        [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Not appropriate")]
        [OperationContract(Name = "GetToursSpecificCollection")]
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
        /// If the specified user display name does not exist it is considered an error.
        /// If the user display name is specified and it exists then the user's attributes are updated.
        /// </remarks>
        /// <param name="userRequest">JSON containing the request details.</param>
        /// <returns>The URL for the new user collection.</returns>
        /// <example><![CDATA[  
        /// HTTP verb: PUT
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/user
        /// 
        /// Request body:
        /// {
        ///     id: "0123456789",
        ///     displayName: "Joe",
        ///     email: "email@email.com"
        /// }
        /// ]]></example>
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
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/user
        ///
        /// Request body:
        /// {
        ///     displayName: "Neil"
        /// }
        /// ]]></example>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/user", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteUser(User userRequest);

        /// <summary>
        /// Returns the user by name, if name parameter is empty returns current user.
        /// </summary>
        /// <param name="name">The name of user to get.</param>
        /// <returns>JSON containing data for the current user.</returns>
        /// <example><![CDATA[ 
        /// HTTP verb: GET
        /// URL:
        /// http://{URL}/api/user
        /// ]]></example>      
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/user?name={name}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        User GetUser(string name);

        /// <summary>
        /// Creates a new collection with the provided data for an existing supercollection.
        /// </summary>
        /// <remarks>
        /// User (owner) should not to be provided. The supercollection's owner will be used, which must be the currently logged in user.
        /// The collection's SuperCollection field in the request body also need not be provided since this will be derived from the URL.
        /// The collection's Path            field in the request body also need not be provided since this will be derived from the URL.
        /// Various request body fields that have default values need not be provided unless one wishes to override them.
        /// </remarks>
        /// <param name="superCollectionPath">The title of the parent supercollection.</param>
        /// <param name="newCollectionPath">The path for the new collection, which must be unique.</param>
        /// <param name="newCollectionData">All of the other necessary collection object data needed to create the new collection.</param>
        /// <returns>True/False based on if the collection was successfully created or not.</returns>
        /// <example><![CDATA[  
        /// HTTP verb: POST
        /// URL:
        /// http://{URL}/api/{superCollectionPath}/{newCollectionPath}
        ///
        /// Request body:
        /// {
        ///      Title: "{title}"
        /// }
        /// ]]></example>
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/{superCollectionPath}/{newCollectionPath}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Boolean PostCollection(string superCollectionPath, string newCollectionPath, Collection newCollectionData);

        /// <summary>
        /// Modifies an existing collection.
        /// </summary>
        /// <remarks>
        /// If the collection exists and the user is authorized then the collection is modified. 
        /// If no author is registered then the authenticated user is set as the author. 
        /// </remarks>
        /// <param name="superCollectionName">The name of the parent supercollection whose default collection will be modified.</param>
        /// <param name="collectionRequest">[Collection](#collection) data in JSON format.</param>
        /// <returns></returns>
        /// <example><![CDATA[  
        /// HTTP verb: PUT
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}
        ///
        /// Request body:
        /// {
        ///      id: "{id}",
        ///      title: "{title}"
        /// }
        /// ]]></example>
        [OperationContract(Name = "PutCollection_DefaultCollection")]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Guid PutCollection(string superCollectionName, Collection collectionRequest);

        /// <summary>
        /// Modifies an existing collection.
        /// </summary>
        /// <remarks>
        /// If the collection exists and the user is authorized then the collection is modified. 
        /// If no author is registered then the authenticated user is set as the author. 
        /// </remarks>
        /// <param name="superCollectionName">The name of the parent supercollection.</param>
        /// <param name="collectionName">The current path name of the collection.</param>
        /// <param name="collectionRequest">[Collection](#collection) data in JSON format.</param>
        /// <returns></returns>
        /// <example><![CDATA[  
        /// HTTP verb: PUT
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}
        ///
        /// Request body:
        /// {
        ///      id: "{id}",
        ///      title: "{title}"
        /// }
        /// ]]></example>
        [OperationContract(Name = "PutCollection_NamedCollection")]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Guid PutCollection(string superCollectionName, string collectionName, Collection collectionRequest);


        /// <summary>
        /// Deletes the specified collection only if
        /// 1) that collection is not the default collection within its supercollection, and
        /// 2) the user has rights to edit the collection (is owner or has editor membership.)
        /// Deletion includes deletion of related collateral entities such as tours and favorites.
        /// </summary>
        /// <param name="superCollectionPath">The collection's supercollection path (part of the URL.)</param>
        /// <param name="collectionPath">The collection's path (part of the URL.)</param>
        /// <returns>True if successfully deleted or collection specified does not exist, and false for all other circumstances.</returns>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionPath}/{collectionPath}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Boolean DeleteCollection(string superCollectionPath, string collectionPath);

        /// <summary>
        /// Creates or updates the timeline in a given supercollection's default collection. 
        /// </summary>
        /// <remarks>
        /// If an ID is specified but the collection does not exist, the request will fail ("not found" status).
        /// If an ID is not specified, a new timeline will be added to the collection. 
        /// For a new timeline, if the parent is not defined the root timeline will be set as the parent.
        /// If the timeline with the specified identifier exists, then the existing timeline is updated.
        /// </remarks>
        /// <param name="superCollectionName">The supercollection.</param>
        /// <param name="timelineRequest">[Timeline](#timeline) data in JSON format.</param>
        /// <returns>HTTP status code.</returns>
        /// <example><![CDATA[  
        /// HTTP verb: PUT
        /// URL:
        /// http://{URL}/api/{supercollection}/timeline
        ///
        /// Request body:
        /// {
        ///      ParentTimelineId: "ff5214e1-1bf4-4af5-8835-96cff2ce2cfd",
        ///      Regime: null - optional,
        ///      end: -377.945205,
        ///      start: -597.542466,
        ///      title: "Timeline Title"
        /// }
        /// ]]></example>
        [OperationContract(Name = "PutTimeline_DefaultCollection")]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/timeline", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Guid PutTimeline(string superCollectionName, TimelineRaw timelineRequest);

        /// <summary>
        /// Creates or updates the timeline in a given collection. 
        /// </summary>
        /// <remarks>
        /// If an ID is specified but the collection does not exist, the request will fail ("not found" status).
        /// If an ID is not specified, a new timeline will be added to the collection. 
        /// For a new timeline, if the parent is not defined the root timeline will be set as the parent.
        /// If the timeline with the specified identifier exists, then the existing timeline is updated.
        /// </remarks>
        /// <param name="superCollectionName">The supcollection.</param>
        /// <param name="collectionName">The name of the collection to update.</param>
        /// <param name="timelineRequest">[Timeline](#timeline) data in JSON format.</param>
        /// <returns>HTTP status code.</returns>
        /// <example><![CDATA[  
        /// HTTP verb: PUT
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/timeline
        ///
        /// Request body:
        /// {
        ///      ParentTimelineId: "ff5214e1-1bf4-4af5-8835-96cff2ce2cfd",
        ///      Regime: null - optional,
        ///      end: -377.945205,
        ///      start: -597.542466,
        ///      title: "Timeline Title"
        /// }
        /// ]]></example>
        [OperationContract(Name = "PutTimeline_NamedCollection")]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}/timeline", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Guid PutTimeline(string superCollectionName, string collectionName, TimelineRaw timelineRequest);

        /// <summary>
        /// Deletes the timeline with the specified ID.
        /// </summary>
        /// <param name="superCollectionName">The name of the supercollection whose default collection will be used.</param>
        /// <param name="timelineRequest">The request in JSON format.</param>
        /// <example><![CDATA[  
        /// HTTP verb: DELETE
        /// URL:
        /// http://{URL}/api/{supercollection}/timeline
        ///
        /// Request body:
        /// {
        ///      id: "0123456789"
        /// }
        /// ]]></example>
        [OperationContract(Name = "DeleteTimeline_DefaultCollection")]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/timeline", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteTimeline(string superCollectionName, Timeline timelineRequest);

        /// <summary>
        /// Deletes the timeline with the specified ID.
        /// </summary>
        /// <param name="superCollectionName">The name of the supercollection to which the collection belongs.</param>
        /// <param name="collectionName">The name of the collection from which the timeline should be deleted.</param>
        /// <param name="timelineRequest">The request in JSON format.</param>
        /// <example><![CDATA[  
        /// HTTP verb: DELETE
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/timeline
        ///
        /// Request body:
        /// {
        ///      id: "0123456789"
        /// }
        /// ]]></example>
        [OperationContract(Name = "DeleteTimeline_NamedCollection")]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}/timeline", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteTimeline(string superCollectionName, string collectionName, Timeline timelineRequest);

        /// <summary>
        /// Creates or updates the exhibit and its content items in a given collection.
        /// If the collection does not exist, then the command will fail.
        /// Prior to running this command, you will need to create the associated content items.
        /// </summary>
        /// <remarks>
        /// If an exhibit id is not specified, a new exhibit is added to the collection. 
        /// If the ID for an existing exhibit is specified then the exhibit will be updated. 
        /// If the exhibit ID to be updated does not exist a "not found" status is returned. 
        /// If the parent timeline is not specified the exhibit is added to the root timeline. 
        /// Otherwise, the exhibit is added to the specified parent timeline. 
        /// If an invalid parent timeline is specified then the request will fail. 
        /// </remarks>
        /// <param name="superCollectionName">The name of the supercollection, whose default collection will be used.</param>
        /// <param name="exhibitRequest">[Exhibit](#exhibit) data in JSON format.</param>
        /// <returns>[Exhibit](#exhibit) data in JSON format.</returns>
        /// <example><![CDATA[  
        /// HTTP verb: PUT
        /// URL:
        /// http://{URL}/api/{supercollection}/exhibit
        ///
        /// Request body:
        /// {
        ///     ParentTimelineId: "123456"
        ///     id: "0123456789",
        ///     title: "Mars Exploration",
        ///     contentItems: "{contentItems}" 
        ///     time: 565
        /// }
        /// ]]></example>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [OperationContract(Name = "PutExhibit_DefaultCollection")]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/exhibit", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        PutExhibitResult PutExhibit(string superCollectionName, ExhibitRaw exhibitRequest);
        
        /// <summary>
        /// Creates or updates the exhibit and its content items in a given collection.
        /// If the collection does not exist, then the command will fail.
        /// Prior to running this command, you will need to create the associated content items.
        /// </summary>
        /// <remarks>
        /// If an exhibit id is not specified, a new exhibit is added to the collection. 
        /// If the ID for an existing exhibit is specified then the exhibit will be updated. 
        /// If the exhibit ID to be updated does not exist a "not found" status is returned. 
        /// If the parent timeline is not specified the exhibit is added to the root timeline. 
        /// Otherwise, the exhibit is added to the specified parent timeline. 
        /// If an invalid parent timeline is specified then the request will fail. 
        /// </remarks>
        /// <param name="superCollectionName">The name of the supercollection to which the collection belongs.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="exhibitRequest">[Exhibit](#exhibit) data in JSON format.</param>
        /// <returns>[Exhibit](#exhibit) data in JSON format.</returns>
        /// <example><![CDATA[  
        /// HTTP verb: PUT
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/exhibit
        ///
        /// Request body:
        /// {
        ///     ParentTimelineId: "123456"
        ///     id: "0123456789",
        ///     title: "Mars Exploration",
        ///     contentItems: "{contentItems}" 
        ///     time: 565
        /// }
        /// ]]></example>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
        [OperationContract(Name = "PutExhibit_NamedCollection")]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}/exhibit", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        PutExhibitResult PutExhibit(string superCollectionName, string collectionName, ExhibitRaw exhibitRequest);

        /// <summary>
        /// Deletes the specified exhibit from the specified collection.
        /// </summary>
        /// <param name="superCollectionName">The name of the supercollection whose default collection will be modified.</param>
        /// <param name="exhibitRequest">The exhibit request data in JSON format.</param>
        /// <example><![CDATA[  
        /// HTTP verb: DELETE
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/exhibit
        ///
        /// Request body:
        /// {
        ///      id: "0123456789"
        /// }
        /// ]]></example>
        [OperationContract(Name = "DeleteExhibit_DefaultCollection")]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/exhibit", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteExhibit(string superCollectionName, Exhibit exhibitRequest);

        /// <summary>
        /// Deletes the specified exhibit from the specified collection.
        /// </summary>
        /// <param name="superCollectionName">The name of the supercollection to which the collection belongs.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="exhibitRequest">The exhibit request data in JSON format.</param>
        /// <example><![CDATA[  
        /// HTTP verb: DELETE
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/exhibit
        ///
        /// Request body:
        /// {
        ///      id: "0123456789"
        /// }
        /// ]]></example>
        [OperationContract(Name = "DeleteExhibit_NamedCollection")]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}/exhibit", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteExhibit(string superCollectionName, string collectionName, Exhibit exhibitRequest);

        /// <summary>
        /// Creates or updates the content item in a given collection. If the collection does not exist the request will fail.
        /// </summary>
        /// <param name="superCollectionName">The name of the supercollection whose default collection will be used.</param>
        /// <param name="contentItemRequest">[ContentItem](#contentitem) data in JSON format.</param>
        /// <returns></returns>
        /// <example><![CDATA[  
        /// HTTP verb: PUT
        /// URL:
        /// http://{URL}/api/{supercollection}/contentitem
        ///              
        /// Request body:
        /// {
        ///     id: "0123456789",
        ///     title: "The Outer Planets",
        ///     uri: "http://www.example.com/images/planets.png"
        /// }
        /// ]]></example>
        [OperationContract(Name = "PutContentItem_DefaultCollection")]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/contentitem", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Guid PutContentItem(string superCollectionName, ContentItemRaw contentItemRequest);

        /// <summary>
        /// Creates or updates the content item in a given collection. If the collection does not exist the request will fail.
        /// </summary>
        /// <param name="superCollectionName">The name of the supercollection to which the collection belongs.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="contentItemRequest">[ContentItem](#contentitem) data in JSON format.</param>
        /// <returns></returns>
        /// <example><![CDATA[  
        /// HTTP verb: PUT
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
        [OperationContract(Name = "PutContentItem_NamedCollection")]
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
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/contentitem
        ///
        /// Request body:
        /// {
        ///      id: "0123456789"
        /// }
        /// ]]></example>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}/contentitem", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteContentItem(string superCollectionName, string collectionName, ContentItem contentItemRequest);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/{superCollectionName}/{collectionName}/tour", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        TourResult PostTour(string superCollectionName, string collectionName, Tour tourRequest);

        [OperationContract(Name = "PutTour_DefaultCollection")]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/tour", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        TourResult PutTour(string superCollectionName, Tour tourRequest);

        [OperationContract(Name = "PutTour_NamedCollection")]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}/tour", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        TourResult PutTour(string superCollectionName, string collectionName, Tour tourRequest);

        /// <summary>
        /// Creates or updates a tour with bookmark support.
        /// </summary>
        /// <remarks>
        /// All bookmarks in a tour must belong to the same collection and the user must have permission
        /// to modify that collection. Supported operations include:
        /// To Create a new tour, do not specify a tour id or bookmark ids for the new entities to be created.
        /// To modify an existing tour, specify the tour id and any of the tour fields (id, description, audio) that need to be modified.
        /// If a tour id is specified and it does not exist, a "not found" status is returned.
        /// If a tour id is specified and it exists, any specified fields are updated. 
        /// Delete all existing bookmarks and add bookmarks defined in the bookmarks JSON object to the tour.
        /// The sequence ids of the bookmarks are automatically generated based on the order they are received.
        /// If an invalid tour Id, bookmark Id or bookmark sequence Id is specified then the request will fail. 
        /// </remarks>
        /// <param name="superCollectionName">The name of the supercollection whose default collection will be used.</param>
        /// <param name="tourRequest">The tour data in JSON format.</param>
        /// <returns>A list of guids of the tour guid followed by bookmark guids in JSON format.</returns>
        /// <example><![CDATA[  
        /// HTTP verb: PUT
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/tour2
        ///
        /// Request body:
        /// {
        ///          
        /// }
        /// ]]></example>
        [OperationContract(Name = "PutTour2_DefaultCollection")]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/tour2", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        TourResult PutTour2(string superCollectionName, Tour tourRequest);

        /// <summary>
        /// Creates or updates a tour with bookmark support.
        /// </summary>
        /// <remarks>
        /// All bookmarks in a tour must belong to the same collection and the user must have permission
        /// to modify that collection. Supported operations include:
        /// To Create a new tour, do not specify a tour id or bookmark ids for the new entities to be created.
        /// To modify an existing tour, specify the tour id and any of the tour fields (id, description, audio) that need to be modified.
        /// If a tour id is specified and it does not exist, a "not found" status is returned.
        /// If a tour id is specified and it exists, any specified fields are updated. 
        /// Delete all existing bookmarks and add bookmarks defined in the bookmarks JSON object to the tour.
        /// The sequence ids of the bookmarks are automatically generated based on the order they are received.
        /// If an invalid tour Id, bookmark Id or bookmark sequence Id is specified then the request will fail. 
        /// </remarks>
        /// <param name="superCollectionName">The name of the supercollection to which the collection belongs.</param>
        /// <param name="collectionName">The name of the collection to modify.</param>
        /// <param name="tourRequest">The tour data in JSON format.</param>
        /// <returns>A list of guids of the tour guid followed by bookmark guids in JSON format.</returns>
        /// <example><![CDATA[  
        /// HTTP verb: PUT
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/tour2
        ///
        /// Request body:
        /// {
        ///          
        /// }
        /// ]]></example>
        [OperationContract(Name = "PutTour2_NamedCollection")]
        [WebInvoke(Method = "PUT", UriTemplate = "/{superCollectionName}/{collectionName}/tour2", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        TourResult PutTour2(string superCollectionName, string collectionName, Tour tourRequest);

        /// <summary>
        /// Deletes the specified tour.
        /// </summary>
        /// <param name="superCollectionName">The name of the supercollection. Its default collection will be the one that is modified</param>
        /// <param name="tourRequest">The tour ID as an integer (in JSON format.)</param>
        /// <example><![CDATA[  
        /// HTTP verb: DELETE
        /// URL:
        /// http://{URL}/api/{supercollection}/tour
        ///
        /// Request body:
        /// {
        ///     id: "5c07b2bf-65e1-45e1-a9cd-792a7767d685"
        /// }
        /// ]]></example>
        [OperationContract(Name = "DeleteTour_DefaultCollection")]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/tour", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteTour(string superCollectionName, Tour tourRequest);

        /// <summary>
        /// Deletes the specified tour.
        /// </summary>
        /// <param name="superCollectionName">The name of the supercollection.</param>
        /// <param name="collectionName">The path name of the collection to modify.</param>
        /// <param name="tourRequest">The tour ID as an integer (in JSON format.)</param>
        /// <example><![CDATA[  
        /// HTTP verb: DELETE
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/tour
        ///
        /// Request body:
        /// {
        ///     id: "5c07b2bf-65e1-45e1-a9cd-792a7767d685"
        /// }
        /// ]]></example>
        [OperationContract(Name = "DeleteTour_NamedCollection")]
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
        /// HTTP verb: PUT
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/{collectionName}/bookmark
        ///
        /// Request body:
        /// {
        ///      id: "0123456789"
        /// }
        /// ]]></example>
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
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/bookmark
        ///
        /// Request body:
        /// {
        ///      id: "0123456789"
        /// }
        /// ]]></example>
        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/{superCollectionName}/{collectionName}/bookmark", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteBookmarks(string superCollectionName, string collectionName, Tour tourRequest);

        /// <summary>
        /// Retrieves a path to the given content id. For t48fbb8a8-7c5d-49c3-83e1-98939ae2ae6, this API retrieves /t00000000-0000-0000-0000-000000000000/t48fbb8a8-7c5d-49c3-83e1-98939ae2ae67
        /// </summary>
        /// <returns>The full path to the content.</returns>
        /// <example><![CDATA[
        /// HTTP verb: GET
        /// URL:
        /// http://{URL}/api/{supercollection}/{collection}/{reference}/contentpath
        /// ]]></example>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "{supercollection}/{collection}/{reference}/contentpath")]
        string GetContentPath(string superCollection, string collection, string reference);
        
        /// <summary>
        /// Retrieve the list of all supercollections apart from the sandbox.
        /// </summary>
        /// <example><![CDATA[  
        /// HTTP verb: GET
        /// URL:
        /// http://{URL}/api/supercollections
        /// ]]></example>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebGet(UriTemplate = "/supercollections", ResponseFormat = WebMessageFormat.Json)]
        IEnumerable<SuperCollection> GetSuperCollections();

        /// <summary>
        /// Retrieve the list of all collections.
        /// </summary>
        /// <example><![CDATA[  
        /// HTTP verb: GET
        /// URL:
        /// http://{URL}/api/{superCollection}/collections
        /// ]]></example>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate")]
        [OperationContract]
        [WebGet(UriTemplate = "/{superCollectionName}/collections", ResponseFormat = WebMessageFormat.Json)]
        IEnumerable<Collection> GetCollections(string superCollectionName);

        /// <summary>
        /// Returns core data for a single collection, including owner and theme. Members and timelines are not included.
        /// </summary>
        /// <param name="superCollection">Name of the super collection. The super collection's default collection will be used.</param>
        /// <returns></returns>
        [OperationContract(Name = "GetCollection_DefaultCollection")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/{supercollection}/data")]
        Collection GetCollection(string superCollection);

        /// <summary>
        /// Returns core data for a single collection, including owner and theme. Members and timelines are not included.
        /// </summary>
        /// <param name="superCollection">Name of the super collection.</param>
        /// <param name="collection">Name of the collection.</param>
        /// <returns></returns>
        [OperationContract(Name = "GetCollection_NamedCollection")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/{supercollection}/{collection}/data")]
        Collection GetCollection(string superCollection, string collection);

        /// <summary>
        /// Checks if a proposed collection name and path are unique within the specified supercollection.
        /// The existing collection name (which is specified here) is not included in the uniqueness check.
        /// </summary>
        /// <param name="superCollection">Part of the URL. Can be left blank, which indicates to use the default supercollection.</param>
        /// <param name="existingCollectionPath">Part of the URL. Can be left blank, which indicates to exclude the default collection from the comparison.</param>
        /// <param name="proposedCollectionName">The proposed displayable name, a human friendly title including spaces and other non-URL friendly characters.</param>
        /// <returns>
        /// Returns true or false depending on if the proposed collection name and the resultant proposed collection path
        /// (which is derived from collection name) are both unique within the specified supercollection.
        /// Also returns false (as an override) if resultant collection path will be empty.
        /// </returns>
        [OperationContract(Name = "IsUniqueCollectionName_NamedCollection")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/{supercollection}/{existingCollectionPath}/isuniquecollectionname?new={proposedCollectionName}")]
        Boolean IsUniqueCollectionName(string superCollection, string existingCollectionPath, string proposedCollectionName);

        [OperationContract(Name = "IsUniqueCollectionName_DefaultCollection")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/{supercollection}/isuniquecollectionname?new={proposedCollectionName}")]
        Boolean IsUniqueCollectionName(string superCollection, string proposedCollectionName);

        [OperationContract(Name = "IsUniqueCollectionName_DefaultEverything")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/isuniquecollectionname?new={proposedCollectionName}")]
        Boolean IsUniqueCollectionName(string proposedCollectionName);

        /// <summary>
        /// Returns a list of users whose display names match the partial display name provided as a parameter.
        /// </summary>
        /// <param name="partialName">Part of a User's DisplayName.</param>
        /// <returns></returns>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/find/users?partial={partialName}")]
        IEnumerable<User> FindUsers(string partialName);

        /// <summary>
        /// Returns a string that can be used later to see when an exhibit was last changed, and who by.
        /// </summary>
        /// <param name="exhibitId"></param>
        /// <returns>A string consisting of date/time last change made and who made change, separated by a pipe.</returns>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/exhibit/{exhibitId}/lastupdate")]
        string GetExhibitLastUpdate(string exhibitId);

        /// <summary>
        /// Returns true/false depending on if the currently logged in user has a membership to the specified collection or is the collection owner.
        /// i.e. Does the user have editing rights to the collection, even if not the owner. Anon user will always return false.
        /// </summary>
        /// <param name="collectionId">GUID of the collection. (Not of the super-collection.)</param>
        /// <returns></returns>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/user/ismember/{collectionId}")]
        bool UserIsMember(string collectionId);

        /// <summary>
        /// Returns true/false depending on if the currently logged in user has a membership to the specified supercollection's default collection, or is the collection owner.
        /// i.e. Does the user have editing rights to the collection, even if not the owner. Anon user will always return false.
        /// An overload to the more efficient UserIsMember(string collectionId) for when the collectionId GUID is not already known.
        /// </summary>
        /// <param name="superCollection">Name of the super collection.</param>
        /// <returns></returns>
        [OperationContract(Name = "UserCanEdit_DefaultCollection")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/{supercollection}/canedit")]
        bool UserCanEdit(string superCollection);

        /// <summary>
        /// Returns true/false depending on if the currently logged in user has a membership to the specified collection or is the collection owner.
        /// i.e. Does the user have editing rights to the collection, even if not the owner. Anon user will always return false.
        /// An overload to the more efficient UserIsMember(string collectionId) for when the collectionId GUID is not already known.
        /// </summary>
        /// <param name="superCollection">Name of the super collection.</param>
        /// <param name="collection">Name of the collection.</param>
        /// <returns></returns>
        [OperationContract(Name = "UserCanEdit_NamedCollection")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/{supercollection}/{collection}/canedit")]
        bool UserCanEdit(string superCollection, string collection);

        /// <summary>
        /// Returns a list of members and their user records who have editing rights to the specified collection.
        /// Does not necesssarily include owner in list.
        /// </summary>
        /// <param name="superCollection">Name of the super collection whose default collection will be examined.</param>
        /// <returns></returns>
        [OperationContract(Name = "GetMembers_DefaultCollection")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/{supercollection}/members")]
        IEnumerable<User> GetMembers(string superCollection);

        /// <summary>
        /// Returns a list of members and their user records who have editing rights to the specified collection.
        /// Does not necesssarily include owner in list.
        /// </summary>
        /// <param name="superCollection">Name of the super collection.</param>
        /// <param name="collection">Name of the collection.</param>
        /// <returns></returns>
        [OperationContract(Name = "GetMembers_NamedCollection")]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/{supercollection}/{collection}/members")]
        IEnumerable<User> GetMembers(string superCollection, string collection);

        /// <summary>
        /// Sets the entire list of users who have editing rights to the specified collection.
        /// Note that this list is not an append list but the entire list, which replaces any existing list.
        /// </summary>
        /// <param name="superCollection">Name of the super collection whose default collection will be used.</param>
        /// <param name="userIds">A list of all of the user ids which are to be given editing rights.</param>
        /// <returns>Success or failure Boolean. Will fail if submitting user is not the owner or not in the pre-existing editors' list.</returns>
        [OperationContract(Name = "PutMembers_DefaultCollection")]
        [WebInvoke(Method = "PUT", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, UriTemplate = "/{supercollection}/members")]
        bool PutMembers(string superCollection, IEnumerable<Guid> userIds);

        /// <summary>
        /// Sets the entire list of users who have editing rights to the specified collection.
        /// Note that this list is not an append list but the entire list, which replaces any existing list.
        /// </summary>
        /// <param name="superCollection">Name of the super collection.</param>
        /// <param name="collection">Name of the collection.</param>
        /// <param name="userIds">A list of all of the user ids which are to be given editing rights.</param>
        /// <returns>Success or failure Boolean. Will fail if submitting user is not the owner or not in the pre-existing editors' list.</returns>
        [OperationContract(Name = "PutMembers_NamedCollection")]
        [WebInvoke(Method = "PUT", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, UriTemplate = "/{supercollection}/{collection}/members")]
        bool PutMembers(string superCollection, string collection, IEnumerable<Guid> userIds);

        /// <summary>
        /// Retrieve file mime type by url
        /// </summary>
        /// <example><![CDATA[  
        /// HTTP verb: GET
        /// URL:
        /// http://{URL}/api/mimetypebyurl
        /// ]]></example>
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/mimetypebyurl?url={url}", ResponseFormat = WebMessageFormat.Json)]
        string GetMimeTypeByUrl(string url);

        #region Favorites
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/userfavorites?currentSuperCollection={currentSuperCollection}&currentCollection={currentCollection}")]
        IEnumerable<Tile> GetUserFavorites(string currentSuperCollection = "", string currentCollection = "");

        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/userfavorites/{favoriteGUID}", ResponseFormat = WebMessageFormat.Json)]
        bool PutUserFavorite(string favoriteGUID);

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/userfavorites/{favoriteGUID}", ResponseFormat = WebMessageFormat.Json)]
        bool DeleteUserFavorite(string favoriteGUID);
        #endregion

        #region Triples

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "/triples?subject={subject}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //IEnumerable<Triple> GetTripletsForSubject(string subject);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "/triples?subject={subject}&predicate={predicate}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //IEnumerable<Triple> GetTripletsForPredicate(string subject, string predicate);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/triples?subject={subject}&predicate={predicate}&object={object}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        IEnumerable<Triple> GetTriplets(string subject, string predicate, string @object);

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/triples", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeleteTriplet(SingleTriple triple);

        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/triples", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void PutTriplet(SingleTriple triple);

        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/triples/prefixes/{prefix}/{namespace}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void SetPrefix(string prefix, string @namespace);

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/triples/prefixes/{prefix}/{namespace}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void DeletePrefix(string prefix, string @namespace);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/triples/prefixes", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Dictionary<string, string> GetPrefixes();

        #endregion

        #region MyTimelines

        /// <summary>
        /// Returns timelines belonging to a particular collection.
        /// Ostensibly used to obtain the current users' timelines but could be used to obtain other users' timelines.
        /// </summary>
        /// <param name="superCollection"></param>
        /// <param name="Collection"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/usertimelines?superCollection={superCollection}&Collection={Collection}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Collection<TimelineShortcut> GetUserTimelines(string superCollection, string Collection);

        /// <summary>
        /// Returns timelines that the current user can edit, usually excluding those owned by the current user.
        /// i.e. Can provide a list of other people's timelines that the current user has edit rights on.
        /// Has option to also include those owned by current user in addition to edit rights on others.
        /// </summary>
        /// <param name="includeMine">Boolean. Defaults to false. Whether or not to include current user's timelines.</param>
        /// <returns>A list of timeline shortcuts. Each shortcut includes the author, image URL, timeline URL and title.</returns>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/editabletimelines?includeMine={includeMine}")]
        Collection<TimelineShortcut> GetEditableTimelines(bool includeMine = false);

        /// <summary>
        /// Returns collections that the current user can edit, usually excluding those owned by the current user.
        /// i.e. Can provide a list of other people's collections that the current user has edit rights on.
        /// Has option to also include those owned by current user in addition to edit rights on others.
        /// </summary>
        /// <param name="includeMine">Boolean. Defaults to false. Whether or not to include current user's collections.</param>
        /// <param name="currentSuperCollection">The current supercollection's name. Used to help identify if returned timeline is in current collection.</param>
        /// <param name="currentCollection">The current collection's name. Used to help identify if returned timeline is in current collection.</param>
        /// <returns>A list of timeline shortcuts. Each shortcut includes the title, author, image URL, collection URL and a boolean flag indicating if the timeline is in the current collection.</returns>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/editablecollections?currentSuperCollection={currentSuperCollection}&currentCollection={currentCollection}&includeMine={includeMine}")]
        List<TimelineShortcut> GetEditableCollections(string currentSuperCollection = "", string currentCollection = "", bool includeMine = false);

        /// <summary>
        /// Provides a list of the exhibits that have been updated most recently.
        /// Only includes exhibits that belongs to a publicly searchable collection.
        /// Only includes exhibits that have an image as their main content item.
        /// TODO: When there are more public collections, limit results to no more than one per collection.
        /// </summary>
        /// <param name="quantity">Maximum number of records to return.</param>
        /// <returns>List of exhibits in a tile format.</returns>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/recentlyupdatedexhibits?quantity={quantity}")]
        IEnumerable<Tile> GetRecentlyUpdatedExhibits(int quantity = 6);

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
        /// URL:
        /// http://{URL}/api/bing/getImages?query={query}&top={top}&skip={skip}
        /// 
        /// ]]></example>
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
        /// URL:
        /// http://{URL}/api/bing/getVideos?query={query}&top={top}&skip={skip}
        /// 
        /// ]]></example>
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
        /// URL:
        /// http://{URL}/api/bing/getDocuments?query={query}&doctype={doctype}&top={top}&skip={skip}
        /// 
        /// ]]></example>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        BaseJsonResult<IEnumerable<Bing.WebResult>> GetDocuments(string query, string doctype, string top, string skip);
    }
}
