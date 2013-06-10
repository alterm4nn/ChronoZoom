# ChronoZoom REST API Reference #

The ChronoZoom Representational State Transfer (REST) API makes it possible to programmatically access content within a given ChronoZoom deployment. All request data is in JavaScript Object Notation (JSON) format. This document describes how to make REST requests against ChronoZoom.

## Using the REST API ##
ChronoZoom REST requests use standard HTTP verbs (GET, PUT, DELETE). The request URL syntax is as follows:

    http://{URL}/api/{supercollection}/{collection}/{resource}

Use JSON for the request body:
    
    {
        id: "0123456789",
        title: "Aboriginal Folklore"
    }



## Contents ##
- [ChronoZoom Entities](#chronozoom-entities)
- [ChronoZoom REST Commands](#chronozoom-rest-commands)

## ChronoZoom Entities ##
- [BookmarkType](#bookmarktype)
- [Bookmark](#bookmark)
- [Collection](#collection)
- [ContentItem](#contentitem)
- [Exhibit](#exhibit)
- [RemoveBetaFields](#removebetafields)
- [RemoveRITree](#removeritree)
- [AddRITreeWithIndex](#addritreewithindex)
- [Properties.Resources](#properties.resources)
- [ObjectType](#objecttype)
- [SearchResult](#searchresult)
- [Storage](#storage)
- [StorageMigrationsConfiguration](#storagemigrationsconfiguration)
- [SuperCollection](#supercollection)
- [User](#user)

### BookmarkType ###
 
Specifies the type of bookmark.
 
|Enum|Value|
|:--------|:----|
|Timeline|0|
|Exhibit|1|
|ContentItem|2|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### Bookmark ###
 
Specifies a tour stop (can be either a timeline, an exhibit, or a content item).
 
|Property|Value|
|:-------|:----|
|Id|The ID of the bookmark.|
|Name|The name of the bookmark.|
|Url|The URL of the bookmark.|
|ReferenceType|The type of reference for the bookmark.|
|ReferenceId|The ID of the reference that is associated with the bookmark.|
|LapseTime|The lapse time value for the bookmark.|
|Description|A text description of the bookmark.|
|SequenceId|Identifies the ordering of bookmarks within a tour.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### Collection ###
 
Represents a collection of timelines.
 
|Property|Value|
|:-------|:----|
|Id|The ID of the collection.|
|Title|The title of the collection.|
|User|The user ID for the collection owner.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### ContentItem ###
 
A pointer to a piece of content in ChronoZoom. The Content Item entity is contained by an Exhibit, and is only viewable as part of an Exhibit.
 
|Property|Value|
|:-------|:----|
|Id|The ID of the content item.|
|Depth|The depth of the content item in the timeline tree|
|Title|The title of the content item.|
|Caption|The description of the content item.|
|Year|The year in which the content item appears.|
|MediaType|Specifies which type of media the content type is.|
|Uri|The URL for the content item.|
|MediaSource|Identifies the source of the content item.|
|Attribution|The attribution for the content item.|
|Order|Specifies the order in which the content item should appear.|
|Collection|The collection that the content item is associated with.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### Exhibit ###
 
Contains a set of content items, and is contained by a timeline or a collection.
 
|Property|Value|
|:-------|:----|
|Id|The ID of the exhibit.|
|Depth|The depth of the exhibit in the timeline tree|
|Title|The title of the exhibit.|
|ContentItems|Specifies the collection of content items that is associated with the exhibit.|
|Collection|Specifies the collection that is associated with the exhibit.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### RemoveBetaFields ###
 
Migration to remove beta fields.
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### RemoveRITree ###
 
Migration to remove the RI-Tree.
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### AddRITreeWithIndex ###
 
Migration to add RI-Tree with index field.
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### Properties.Resources ###
 
A strongly-typed resource class, for looking up localized strings, etc.
 
|Property|Value|
|:-------|:----|
|ResourceManager|Returns the cached ResourceManager instance used by this class.|
|Culture|Overrides the current thread's CurrentUICulture property for all
              resource lookups using this strongly typed resource class.|
|TimelineSubtreeQuery|Looks up a localized string similar to CREATE PROCEDURE TimelineSubtreeQuery
            	@Collection_Id UNIQUEIDENTIFIER,
            	@LCA UNIQUEIDENTIFIER,
            	@min_span DECIMAL,
            	@startTime DECIMAL,
            	@endTime DECIMAL,
            	@max_elem INT
            AS
            BEGIN
            	DECLARE @return_entire_subtree BIT
            	DECLARE @subtree_size INT
            	DECLARE @current_level_cnt INT
            	DECLARE @cnt INT
            	DECLARE @num_ge_min_span INT
            	DECLARE @current_id UNIQUEIDENTIFIER
            	DECLARE @current_level TABLE (
            		Id UNIQUEIDENTIFIER
            	)
            	DECLARE @next_level TABLE (
            		Id UNIQUEIDENTIFIER
            	)
            	DECLARE @results TABLE (
            		Id UNIQUEIDE [rest of string was truncated]";.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### ObjectType ###
 
Specifies the type of object contained by the search result.
 
|Enum|Value|
|:--------|:----|
|Exhibit|0|
|Timeline|1|
|ContentItem|2|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### SearchResult ###
 
Contains a search result.
 
|Property|Value|
|:-------|:----|
|Id|The ID of the search result.|
|Title|The title of the search result.|
|ObjectType|The type of object contained by the search result.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### Storage ###
 
Storage implementation for ChronoZoom based on Entity Framework.
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### StorageMigrationsConfiguration ###
 
Describes storage migration options. Used when a schema upgrade is required.
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### SuperCollection ###
 
Represents a set of collections.
 
|Property|Value|
|:-------|:----|
|Id|The ID of the supercollection.|
|Title|The title of the supercollection.|
|User|The user who owns the supercollection.|
|Collections|A collection of collections that belong to the supercollection.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### User ###
 
A registered user.
 
|Property|Value|
|:-------|:----|
|Id|The ID of the user.|
|DisplayName|The display name of the user.|
|Email|The email address of the user.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 

## ChronoZoom REST Commands ##
- [GetTimelines](#gettimelines)
- [Search](#search)
- [GetDefaultTours](#getdefaulttours)
- [GetTours](#gettours)
- [PutUser](#putuser)
- [GetServiceInformation](#getserviceinformation)
- [DeleteUser](#deleteuser)
- [GetUser](#getuser)
- [PutCollectionName](#putcollectionname)
- [DeleteCollection](#deletecollection)
- [PutTimeline](#puttimeline)
- [DeleteTimeline](#deletetimeline)
- [PutExhibit](#putexhibit)
- [DeleteExhibit](#deleteexhibit)
- [PutContentItem](#putcontentitem)
- [DeleteContentItem](#deletecontentitem)
- [PostTour](#posttour)
- [PutTour](#puttour)
- [DeleteTour](#deletetour)
- [PutBookmarks](#putbookmarks)
- [DeleteBookmarks](#deletebookmarks)
- [GetContentPath](#getcontentpath)
- [GetCollections](#getcollections)

### GetTimelines ###
 
Returns timeline data within a specified range of years from a collection or a superCollection.
 
**Returns**
Timeline data in JSON format.
 
**Example**
 
    HTTP verb: GET
            
    URL:
    http://{URL}/api/{supercollection}/{collection}/timelines?start={year}&end={year}
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollection|Name of the superCollection to query.|
|collection|Name of the collection to query.|
|start|Year at which to begin the search, between -20000000000 and 9999.|
|end|Year at which to end the search, between -20000000000 and 9999.|
|minspan|Filters the search results to a particular time scale.|
|commonAncestor|Least Common Ancestor, a timeline identifier used to hint the server to retrieve timelines close to this location.|
|maxElements|The maximum number of elements to return.|
|depth|The max depth for children timelines.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### Search ###
 
Performs a search for a specific term within a collection or a superCollection.
 
**Returns**
Search results in JSON format.
 
**Example**
 
    HTTP verb: GET
            
    URL:
    http://{URL}/api/search?searchTerm={term}&supercollection={supercollection}&collection={collection}
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollection|Name of the supercollection to query.|
|collection|Name of the collection to query.|
|searchTerm|The term to search for.|
 
**Remarks**
The syntax for search is different from other requests. The values for supercollection and collection are specified as request parameters rather than as part of the URL.

 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### GetDefaultTours ###
 
Returns a list of tours for the default collection and default superCollection.
 
**Returns**
A list of tours in JSON format.
 
**Example**
 
    HTTP verb: GET
            
    URL: 
    http://{URL}/api/tours
    

 
**Parameters**
None.
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### GetTours ###
 
Returns a list of tours for a given collection or superCollection.
 
**Returns**
A list of tours in JSON format.
 
**Example**
 
    HTTP verb: GET
            
    URL: 
    http://{URL}/api//{supercollection}/{collection}/tours
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollection|Name of the superCollection to query.|
|collection|Name of the collection to query.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### PutUser ###
 
Creates a new user, or updates an existing user's information and associated personal collection.
 
**Returns**
The URL for the new user collection.
 
**Example**
 
    HTTP verb: PUT
            
    URL:
    http://{URL}/api//{supercollection}/{collection}/user
    
    Request body (JSON):
    {
        id: "0123456789",
        displayName: "Joe",
        email: "email@email.com"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|userRequest|JSON containing the request details.|
 
**Remarks**
If the user ID is omitted then a new user is created.
    If there is no ACS the user is treated as anonymous and granted access to the sandbox collection.
    If the anonymous user does not exist in the database then it is created.
    A new superCollection with the user's display name is added.
    A new default collection with the user's display name is added to this superCollection.
    A new user with the specified attributes is created.
            
    If the specified user display name does not exist it is considered an error.
    If the user display name is specified and it exists then the user's attributes are updated.

 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### GetServiceInformation ###
 
Internal. Provides information about the ChronoZoom service to clients.
 
**Returns**
A ServiceInformation object describing parameter from the running service
 
**Parameters**
None.
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### DeleteUser ###
 
Deletes the user with the specified user ID.
 
**Returns**
HTTP response code.
 
**Example**
 
            HTTP verb: DELETE
            
            URL:
            http://{URL}/api//{supercollection}/{collection}/user
            
            Request body (JSON):
            {
       displayName: "Neil"
            }
            

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|userRequest|JSON containing the request details.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### GetUser ###
 
Returns the user by name, if name parameter is empty returns current user.
 
**Returns**
JSON containing data for the current user.
 
**Example**

            HTTP verb: GET
            
            URL:
            http://{URL}/api/user
            

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|name|The name of user to get.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### PutCollectionName ###
 
Creates a new collection using the specified name.
 
**Returns**

 
**Example**
 
    HTTP verb: PUT
            
    URL:
    http://{URL}/api/{supercollection}/{collection}
            
    Request body (JSON):
    {
         id: "{id}",
         title: "{title}"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollectionName|The name of the parent supercollection.|
|collectionName|The name of the collection to create.|
|collectionRequest|[Collection](#collection) data in JSON format.|
 
**Remarks**
If a collection of the specified name does not exist then a new collection is created. 
    If the collection exists and the authenticated user is the author then the collection is modified. 
    If no author is registered then the authenticated user is set as the author. 
    The title field can't be modified because it is part of the URL (the URL can be indexed).

 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### DeleteCollection ###
 
Deletes the specified collection.
 
**Returns**
HTTP response code.
 
**Example**
 
    HTTP verb: DELETE
            
    URL:
    http://{URL}/api/{supercollection}/{collection}
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollectionName|The name of the parent collection.|
|collectionName|The name of the collection to delete.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### PutTimeline ###
 
Creates or updates the timeline in a given collection.
 
**Returns**
HTTP status code.
 
**Example**
 
    HTTP verb: PUT
            
    URL:
    http://{URL}/api//{supercollection}/{collection}/timeline
            
    Request body (JSON):
    {
         id: "0123456789",
         title: "A New Title"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollectionName|The parent collection.|
|collectionName|The name of the collection to update.|
|timelineRequest|[Timeline](#timeline) data in JSON format.|
 
**Remarks**
If an ID is specified but the collection does not exist, the request will fail ("not found" status).
    If an ID is not specified, a new timeline will be added to the collection. 
    For a new timeline, if the parent is not defined the root timeline will be set as the parent.
    If the timeline with the specified identifier exists, then the existing timeline is updated.

 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### DeleteTimeline ###
 
Deletes the timeline with the specified ID.
 
**Example**
 
    HTTP verb: DELETE
            
    URL:
    http://{URL}/api//{supercollection}/{collection}/timeline
            
    Request body (JSON):
    {
         id: "0123456789"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollectionName|The name of the parent collection.|
|collectionName|The name of the collection from which the timeline should be deleted.|
|timelineRequest|The request in JSON format.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### PutExhibit ###
 
Creates or updates the exhibit and its content items in a given collection. If the collection does not exist, then the command will silently fail.
 
**Returns**
[Exhibit](#exhibit) data in JSON format.
 
**Example**
 
    HTTP verb: PUT
            
    URL:
    http://{URL}/api//{supercollection}/{collection}/exhibit
            
    Request body (JSON):
    {
         id: "0123456789",
         title: "Mars Exploration",
         threshold: "{threshold}",
         regime: "{regime}",
         contentItems: "{contentItems}" 
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollectionName|The name of the parent collection.|
|collectionName|The name of the collection to modify.|
|exhibitRequest|[Exhibit](#exhibit) data in JSON format.|
 
**Remarks**
If an exhibit id is not specified, a new exhibit is added to the collection. 
    If the ID for an existing exhibit is specified then the exhibit will be updated. 
    If the exhibit ID to be updated does not exist a "not found" status is returned. 
    If the parent timeline is not specified the exhibit is added to the root timeline. 
    Otherwise, the exhibit is added to the specified parent timeline. 
    If an invalid parent timeline is specified then the request will fail.

 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### DeleteExhibit ###
 
Deletes the specified exhibit from the specified collection.
 
**Example**
 
    HTTP verb: DELETE
            
    URL:
    http://{URL}/api//{supercollection}/{collection}/exhibit
            
    Request body:
    {
         id: "0123456789"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollectionName|The name of the parent collection.|
|collectionName|The name of the collection to modify.|
|exhibitRequest|The exhibit request data in JSON format.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### PutContentItem ###
 
Creates or updates the content item in a given collection. If the collection does not exist the request will fail.
 
**Returns**

 
**Example**
 
    HTTP verb: PUT
            
    URL:
    http://{URL}/api//{supercollection}/{collection}/contentitem
            
    Request body:
    {
        id: "0123456789",
        title: "The Outer Planets",
        uri: "http://www.example.com/images/planets.png"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollectionName|The name of the parent collection.|
|collectionName|The name of the collection to modify.|
|contentItemRequest|[ContentItem](#contentitem) data in JSON format.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### DeleteContentItem ###
 
Delete the specified content item from the specified collection.
 
**Example**
 
    HTTP verb: DELETE
            
    URL:
    http://{URL}/api/{supercollection}/{collection}/contentitem
            
    Request body:
    {
         id: "0123456789"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollectionName|The name of the parent collection.|
|collectionName|The name of the collection to modify.|
|contentItemRequest|The request data in JSON format.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### PostTour ###
 
Creates a new tour with bookmark support.
 
**Returns**
A list of guids of tour guid followed by bookmark guids in JSON format.
 
**Example**
 
    HTTP verb: POST
            
    URL:
    http://{URL}/api/{supercollection}/{collection}/{collectionName}/tour
            
    Request body:
    {
             
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollectionName|The name of the parent collection.|
|collectionName|The name of the collection to modify.|
|tourRequest|The tour data in JSON format.|
 
**Remarks**
Do not specify the tour ID, this value is automatically generated.
    All bookmarks in a tour must belong to the same collection and the user 
    must have permission to modify that collection.
    POST is used to create a new tour.

 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### PutTour ###
 
Creates or updates a tour with bookmark support.
 
**Returns**
A list of guids of tour guid followed by bookmark guids in JSON format.
 
**Example**
 
    HTTP verb: PUT
            
    URL:
    http://{URL}/api/{supercollection}/{collection}/{collectionName}/tour
            
    Request body:
    {
             
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollectionName|The name of the parent collection.|
|collectionName|The name of the collection to modify.|
|tourRequest|The tour data in JSON format.|
 
**Remarks**
All bookmarks in a tour must belong to the same collection and the user 
    must have permission to modify that collection.
    To modify an existing tour, specify the tour ID.
    If the tour ID to be updated does not exist a "not found" status is returned. 
    If an invalid tour ID or bookmark ID (for updates) is specified then the request will fail.

 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### DeleteTour ###
 
Deletes the specified tour.
 
**Example**
 
    HTTP verb: DELETE
            
    URL:
    http://{URL}/api/{supercollection}/{collection}/{collectionName}/tour
            
    Request body:
    {
        id: "5c07b2bf-65e1-45e1-a9cd-792a7767d685"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollectionName|The name of the parent collection.|
|collectionName|The name of the collection to modify.|
|tourRequest|The tour ID in JSON format.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### PutBookmarks ###
 
Adds a list of bookmarks to an existing tour.
 
**Returns**
A list of guids of tour guid followed by new bookmark guids in JSON format.
 
**Example**
 
    HTTP verb: DELETE
            
    URL:
    http://{URL}/api/{supercollection}/{collection}/{collectionName}/bookmark
            
    Request body:
    {
         id: "0123456789"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollectionName|The name of the parent collection.|
|collectionName|The name of the collection to modify.|
|tourRequest|The request in JSON format.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### DeleteBookmarks ###
 
Delete a list of bookmarks belonging to the same tour.
 
**Example**
 
    HTTP verb: DELETE
            
    URL:
    http://{URL}/api/{supercollection}/{collection}/{collectionName}/bookmark
            
    Request body:
    {
         id: "0123456789"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollectionName|The name of the parent collection.|
|collectionName|The name of the collection to modify.|
|tourRequest|The request in JSON format.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### GetContentPath ###
 
Retrieves a path to the given content id.
            
            For t48fbb8a8-7c5d-49c3-83e1-98939ae2ae6, this API retrieves /t00000000-0000-0000-0000-000000000000/t48fbb8a8-7c5d-49c3-83e1-98939ae2ae67
 
**Returns**
The full path to the content.
 
**Example**

            HTTP verb: GET
            
            URL:
            http://{URL}/api/{supercollection}/{collection}/{reference}/contentpath
            

 
**Parameters**
None.
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### GetCollections ###
 
Retrieve the list of all collections.
 
**Example**
 
    HTTP verb: GET
            
    URL:
    http://{URL}/api/collections
    

 
**Parameters**
None.
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 

