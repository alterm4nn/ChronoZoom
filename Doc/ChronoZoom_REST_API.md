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
- [Member](#member)
- [ContentItem](#contentitem)
- [Exhibit](#exhibit)
- [ObjectType](#objecttype)
- [SearchResult](#searchresult)
- [StorageCorruptedException](#storagecorruptedexception)
- [Storage](#storage)
- [SuperCollection](#supercollection)
- [Timeline](#timeline)
- [TripleName](#triplename)
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
|Theme|The theme (i.e. space, blue, etc) associated to this collection.|
|SuperCollection|SuperCollection for this collection|
|MembersAllowed|On/Off switch for permitting a list of members to edit this collection.|
|Members|A list of users who have special rights to the collection, other than the collection owner.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### Member ###
 
A collection can have a list of members, users other than the collection owner which have edit or other special rights.
 
 
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
|Year|The year in which the exhibit appears.|
|UpdatedBy|The user who last updated this exhibit.
            Can be null if there have been no updates.|
|UpdatedTime|Date/Time is UTC/GMT, is never null, and is not displayed to the user.|
|ContentItems|Specifies the collection of content items that is associated with the exhibit.|
|Collection|Specifies the collection that is associated with the exhibit.|
 
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
 
### StorageCorruptedException ###
 
Thrown whenever a query detects that the storage is corrupted.
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### Storage ###
 
Storage implementation for ChronoZoom based on Entity Framework.
 
 
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
 
### Timeline ###
 
A visual representation of a time period that contains a set of Exhibits, child Timelines, and Time Series Data, and is contained by another Timeline or a Collection. The Timeline entity is externally searchable and linkable.
 
|Property|Value|
|:-------|:----|
|Id|The ID of the timeline (GUID).|
|Depth|The depth of the timeline in the timeline tree.|
|SubtreeSize|The number of content items contained in subtree under current timeline.|
|Title|The title of the timeline.|
|Regime|The regime in which the timeline should occur.|
|FromYear|The year the timeline begins.|
|FromIsCirca|If true, the timeline start date is circa/approximate.
            Default is false.|
|ToYear|The year the timeline ends.|
|ToIsCirca|If true, the timeline end date is circa/approximate.
            Default is false.|
|ForkNode|???|
|ChildTimelines|The collection of child timelines belonging to the timeline.|
|Exhibits|The collection of exhibits belonging to the timeline.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### TripleName ###
 
Describes triple full name with name, namespace and prefix.
            Namespace or prefix may be absent
 
 
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
- [ExportTimelines](#exporttimelines)
- [ImportTimelines](#importtimelines)
- [GetTimelines](#gettimelines)
- [Search](#search)
- [GetDefaultTours](#getdefaulttours)
- [GetTours](#gettours)
- [PutUser](#putuser)
- [GetServiceInformation](#getserviceinformation)
- [DeleteUser](#deleteuser)
- [GetUser](#getuser)
- [PostCollection](#postcollection)
- [PutCollection](#putcollection)
- [DeleteCollection](#deletecollection)
- [PutTimeline](#puttimeline)
- [DeleteTimeline](#deletetimeline)
- [PutExhibit](#putexhibit)
- [DeleteExhibit](#deleteexhibit)
- [PutContentItem](#putcontentitem)
- [DeleteContentItem](#deletecontentitem)
- [PutTour2](#puttour2)
- [DeleteTour](#deletetour)
- [PutBookmarks](#putbookmarks)
- [DeleteBookmarks](#deletebookmarks)
- [GetContentPath](#getcontentpath)
- [GetSuperCollections](#getsupercollections)
- [GetCollections](#getcollections)
- [GetCollection](#getcollection)
- [FindUsers](#findusers)
- [GetExhibitLastUpdate](#getexhibitlastupdate)
- [UserIsMember](#userismember)
- [UserCanEdit](#usercanedit)
- [GetMembers](#getmembers)
- [PutMembers](#putmembers)
- [GetMimeTypeByUrl](#getmimetypebyurl)
- [GetUserTimelines](#getusertimelines)
- [GetEditableTimelines](#geteditabletimelines)

### ExportTimelines ###
 
For exporting a timeline and it's descendant sub-timelines to temporary storage so can be imported later
            as a copy under a different timeline or collection.
 
**Returns**
A flattened list of timelines in JSON format, starting with the timeline indicated via the topmostTimelineId,
            and including each descendant timeline. (Timelines can contain child timelines.)
            Each flattened timeline entry includes all of it's exhibits and their content items.
 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|topmostTimelineId|Must be a GUID, provided as a string.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### ImportTimelines ###
 
For importing a timeline and it's descendant sub-timelines into an existing timeline.
            Typically this is a timeline from a different collection that is being copied.
            It should be noted that the supplied new timeline tree to import must fit within the
            date bounds of the target destination timeline's start and end dates.
 
**Returns**
A success, warning about date bounds exceeded, or general error message.
 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|intoTimelineId|Must be a GUID, provided as a string.|
|newTimelineTree|Must be a structure created by an IChronozoomSVC.ExportTimelines implementation, provided as a JSON.stringify string.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### GetTimelines ###
 
Returns timeline data within a specified range of years from a collection or a superCollection.
 
**Returns**
Timeline data in JSON format.
 
**Example**
    HTTP verb: GET
    URL:
    http://{URL}/api/gettimelines?supercollection={supercollection}&collection={collection}&start={year}&end={year}
    

 
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
    http://{URL}/api/{supercollection}/{collection}/tours
    

 
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
    http://{URL}/api/{supercollection}/{collection}/user
    
    Request body:
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
    http://{URL}/api/{supercollection}/{collection}/user
    
    Request body:
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
 
### PostCollection ###
 
Creates a new collection using the specified name.
 
**Returns**

 
**Example**
    HTTP verb: POST
    URL:
    http://{URL}/api/{supercollection}/{collection}
    
    Request body:
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
    The title field can't be modified because it is part of the URL (the URL can be indexed).

 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### PutCollection ###
 
Modifies an existing collection.
 
**Returns**

 
**Example**
    HTTP verb: PUT
    URL:
    http://{URL}/api/{supercollection}/{collection}
    
    Request body:
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
    http://{URL}/api/{supercollection}/{collection}/timeline
    
    Request body:
    {
         ParentTimelineId: "ff5214e1-1bf4-4af5-8835-96cff2ce2cfd",
         Regime: null - optional,
         end: -377.945205,
         start: -597.542466,
         title: "Timeline Title"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollectionName|The parent collection.|
|collectionName|The name of the collection to update.|
|timelineRequest|[Timeline](#timeline) data in JSON format.|
 
**Remarks**
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
    http://{URL}/api/{supercollection}/{collection}/timeline
    
    Request body:
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
 
Creates or updates the exhibit and its content items in a given collection. If the collection does not exist, then the command will fail. Prior to running this command, you will need to create the associated content items.
 
**Returns**
[Exhibit](#exhibit) data in JSON format.
 
**Example**
    HTTP verb: PUT
    URL:
    http://{URL}/api/{supercollection}/{collection}/exhibit
    
    Request body:
    {
        ParentTimelineId: "123456"
        id: "0123456789",
        title: "Mars Exploration",
        contentItems: "{contentItems}" 
        time: 565
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollectionName|The name of the parent collection.|
|collectionName|The name of the collection to modify.|
|exhibitRequest|[Exhibit](#exhibit) data in JSON format.|
 
**Remarks**
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
    http://{URL}/api/{supercollection}/{collection}/exhibit
    
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
    http://{URL}/api/{supercollection}/{collection}/contentitem
                
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
 
### PutTour2 ###
 
Creates or updates a tour with bookmark support.
 
**Returns**
A list of guids of the tour guid followed by bookmark guids in JSON format.
 
**Example**
    HTTP verb: PUT
    URL:
    http://{URL}/api/{supercollection}/{collection}/tour2
    
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
    to modify that collection. Supported operations include:
    To Create a new tour, do not specify a tour id or bookmark ids for the new entities to be created.
    To modify an existing tour, specify the tour id and any of the tour fields (id, description, audio) that need to be modified.
    If a tour id is specified and it does not exist, a "not found" status is returned.
    If a tour id is specified and it exists, any specified fields are updated. 
    Delete all existing bookmarks and add bookmarks defined in the bookmarks JSON object to the tour.
    The sequence ids of the bookmarks are automatically generated based on the order they are received.
    If an invalid tour Id, bookmark Id or bookmark sequence Id is specified then the request will fail.

 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### DeleteTour ###
 
Deletes the specified tour.
 
**Example**
    HTTP verb: DELETE
    URL:
    http://{URL}/api/{supercollection}/{collection}/tour2
    
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
    HTTP verb: PUT
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
    http://{URL}/api/{supercollection}/{collection}/bookmark
    
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
 
Retrieves a path to the given content id. For t48fbb8a8-7c5d-49c3-83e1-98939ae2ae6, this API retrieves /t00000000-0000-0000-0000-000000000000/t48fbb8a8-7c5d-49c3-83e1-98939ae2ae67
 
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
 
### GetSuperCollections ###
 
Retrieve the list of all supercollections.
 
**Example**
    HTTP verb: GET
    URL:
    http://{URL}/api/supercollections
    

 
**Parameters**
None.
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### GetCollections ###
 
Retrieve the list of all collections.
 
**Example**
    HTTP verb: GET
    URL:
    http://{URL}/api/{superCollection}/collections
    

 
**Parameters**
None.
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### GetCollection ###
 
Returns core data for a single collection, including owner and theme. Members and timelines are not included.
 
**Returns**

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollection|Name of the super collection.|
|collection|Name of the collection.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### FindUsers ###
 
Returns a list of users whose display names match the partial display name provided as a parameter.
 
**Returns**

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|partialName|Part of a User's DisplayName.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### GetExhibitLastUpdate ###
 
Returns a string that can be used later to see when an exhibit was last changed, and who by.
 
**Returns**
A string consisting of date/time last change made and who made change, separated by a pipe.
 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|exhibitId||
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### UserIsMember ###
 
Returns true/false depending on if the currently logged in user has a membership to the specified collection or is the collection owner.
            i.e. Does the user have editing rights to the collection, even if not the owner. Anon user will always return false.
 
**Returns**

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|collectionId|GUID of the collection. (Not of the super-collection.)|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### UserCanEdit ###
 
Returns true/false depending on if the currently logged in user has a membership to the specified collection or is the collection owner.
            i.e. Does the user have editing rights to the collection, even if not the owner. Anon user will always return false.
            An overload to the more efficient UserIsMember(string collectionId) for when the collectionId GUID is not already known.
 
**Returns**

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollection|Name of the super collection.|
|collection|Name of the collection.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### GetMembers ###
 
Returns a list of members and their user records who have editing rights to the specified collection.
            Does not necesssarily include owner in list.
 
**Returns**

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollection|Name of the super collection.|
|collection|Name of the collection.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### PutMembers ###
 
Sets the entire list of users who have editing rights to the specified collection.
            Note that this list is not an append list but the entire list, which replaces any existing list.
 
**Returns**
Success or failure Boolean. Will fail if submitting user is not the owner or not in the pre-existing editors' list.
 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollection|Name of the super collection.|
|collection|Name of the collection.|
|userIds|A list of all of the user ids which are to be given editing rights.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### GetMimeTypeByUrl ###
 
Retrieve file mime type by url
 
**Example**
    HTTP verb: GET
    URL:
    http://{URL}/api/mimetypebyurl
    

 
**Parameters**
None.
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### GetUserTimelines ###
 
Returns timelines belonging to a particular collection.
            Ostensibly used to obtain the current users' timelines but could be used to obtain other users' timelines.
 
**Returns**

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|superCollection||
|Collection||
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 
### GetEditableTimelines ###
 
Returns timelines that the current user can edit, usually excluding those owned by the current user.
            i.e. Can provide a list of other people's timelines that the current user has edit rights on.
            Has option to also include those owned by current user in addition to edit rights on others.
 
**Returns**
A list of timeline shortcuts. Each shortcut includes the author, image URL, timeline URL and title.
 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|includeMine|Boolean. Defaults to false. Whether or not to include current user's timelines.|
 
 
[top](#chronozoom-rest-api-reference)
 
----------
 

