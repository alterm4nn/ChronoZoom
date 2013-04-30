# ChronoZoom REST API Reference #

The ChronoZoom Representational State Transfer (REST) API makes it possible to programmatically access content within a given ChronoZoom deployment. All request data is in JavaScript Object Notation (JSON) format. This document describes how to make REST requests against ChronoZoom.

## Request Syntax ##
ChronoZoom REST requests use standard HTTP verbs (GET, PUT, DELETE). Request URLs point to **chronozoom.svc** for the deployment, followed by the supercollection and collection names, and finally the resource type:

    http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/[resource]

The request body is in JSON format:
    
    {
        id: "0123456789"
    }

## ChronoZoom Resources ##
TBD

## ChronoZoom REST Commands ##
- [GetTimelines](#gettimelines)
- [GetThresholds](#getthresholds)
- [Search](#search)
- [GetBibliography](#getbibliography)
- [GetTours](#gettours)
- [PutUser](#putuser)
- [DeleteUser](#deleteuser)
- [PutCollectionName](#putcollectionname)
- [DeleteCollection](#deletecollection)
- [PutTimeline](#puttimeline)
- [DeleteTimeline](#deletetimeline)
- [PutExhibit](#putexhibit)
- [DeleteExhibit](#deleteexhibit)
- [PutContentItem](#putcontentitem)
- [DeleteContentItem](#deletecontentitem)

## GetTimelines ##
 
Returns timeline data within a specified range of years from a collection or a supercollection.
 
**Returns**
Timeline data in JSON format.
 
**Example**
 
    HTTP verb: GET
            
    URL:
    http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/timelines
            
    Request body (JSON):
    {
       start: 1800
       end: 1920
       minspan: 
       lca: 
       maxElements: 25
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|param|Name of the supercollection to query.|
|param|Name of the collection to query.|
|param|Year at which to begin the search, between -20000000000 and 9999.|
|param|Year at which to end the search, between -20000000000 and 9999.|
|param|Filters the search results to a particular time scale.|
|param|Least Common Ancestor, a timeline identifier used to hint the server to retrieve timelines close to this location.|
|param|The maximum number of elements to return.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
## GetThresholds ##
 
Returns the time thresholds that have been defined for a ChronoZoom instance.
 
**Returns**
Time threshold data in JSON format.
 
**Example**
 
    HTTP verb: GET
            
    URL:
    http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/thresholds
    

 
**Parameters**
None.
 
[top](#chronozoom-rest-api-reference)
 
----------
 
## Search ##
 
Performs a search for a specific term within a collection or a supercollection.
 
**Returns**
Search results in JSON format.
 
**Example**
 
    HTTP verb: GET
            
    URL:
    http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/search
            
    Request body (JSON):
    {
       searchTerm: "Pluto"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|param|Name of the supercollection to query.|
|param|Name of the collection to query.|
|param|The term to search for.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
## GetBibliography ##
 
Returns the bibliography for a given exhibit.
 
**Returns**
The bibliography data in JSON format.
 
**Example**
 
    HTTP verb: GET
            
    URL:
    http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/bibliography
            
    Request body (JSON):
    {
        exhibitId: "0123456789"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|param|ID of the exhibit.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
## GetTours ##
 
Returns a list of tours for a given collection or supercollection.
 
**Returns**
A list of tours in JSON format.
 
**Example**
 
    HTTP verb: GET
            
    URL: 
    http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/tours
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|param|Name of the supercollection to query.|
|param|Name of the collection to query.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
## PutUser ##
 
Creates a new user, or updates an existing user's information and associated personal collection.
 
**Returns**
The URL for the new user collection.
 
**Example**
 
    HTTP verb: PUT
            
    URL:
    http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/user
    
    Request body (JSON):
    {
        id: "0123456789",
        displayName: "Joe",
        email: "email@email.com"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|param|JSON containing the request details.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
## DeleteUser ##
 
Deletes the user with the specified user ID.
 
**Returns**
HTTP response code.
 
**Example**
 
            HTTP verb: DELETE
            URL:
            http://{site URL}/chronozoom.svc/{supercollection}/{collection}/user
            
            Request body (JSON):
            {
       id: "0123456789"
            }
            

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|param|JSON containing the request details.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
## PutCollectionName ##
 
Creates a new collection using the specified name.
 
**Returns**

 
**Example**
 
    HTTP verb: PUT
            
    URL:
    http://{site URL}/chronozoom.svc/{superCollectionName}/{collectionName}
            
    Request body (JSON):
    {
         name: "My Collection"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|param|The name of the parent supercollection for the collection.|
|param|The name of the collection to create.|
|param|The markup for the collection to create in JSON format.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
## DeleteCollection ##
 
Deletes the specified collection.
 
**Returns**
HTTP response code.
 
**Example**
 
    HTTP verb: DELETE
            
    URL:
    http://{site URL}/chronozoom.svc/{superCollectionName}/{collectionName}
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|param|The name of the parent collection.|
|param|The name of the collection to delete.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
## PutTimeline ##
 
Creates or updates the timeline in a given collection.
 
**Returns**
HTTP status code.
 
**Example**
 
    HTTP verb: PUT
            
    URL:
    http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/timeline
            
    Request body (JSON):
    {
         id: "0123456789"
         title: "A New Title"
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|param|The parent collection.|
|param|The name of the collection to update.|
|param|Timeline data in JSON format.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
## DeleteTimeline ##
 
Deletes the timeline with the specified ID.
 
**Example**
 
    HTTP verb: DELETE
            
    URL:
    http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/timelines
            
    Request body (JSON):
    {
         timelineRequest: Need request body format.
    }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|param|The name of the parent collection.|
|param|The name of the collection from which the timeline should be deleted.|
|param|The request in JSON format.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
## PutExhibit ##
 
Creates or updates the exhibit and its content items in a given collection. If the collection does not exist, then the command will silently fail.
 
**Returns**
An exhibit in JSON format.
 
**Example**
 
    **HTTP verb:** PUT
            
    **URL:**
        http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/exhibit
            
    **Request body:**
        {
             
        }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|param|The name of the parent collection.|
|param|The name of the collection to modify.|
|param|The exhibit data in JSON format.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
## DeleteExhibit ##
 
Deletes the specified exhibit from the specified collection.
 
**Example**
 
    **HTTP verb:** DELETE
            
    **URL:**
        http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/exhibit
            
    **Request body:**
        {
             id: "0123456789"
        }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|param|The name of the parent collection.|
|param|The name of the collection to modify.|
|param|The exhibit ID in JSON format.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
## PutContentItem ##
 
Creates or updates the content item in a given collection. If the collection does not exist the request will fail.
 
**Returns**

 
**Example**
 
    **HTTP verb:** PUT
            
    **URL:**
        http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/contentitem
            
    **Request body:**
        {
             
        }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|param|The name of the parent collection.|
|param|The name of the collection to modify.|
|param|The content item data in JSON format.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
## DeleteContentItem ##
 
Delete the specified content item from the specified collection.
 
**Example**
 
    **HTTP verb:** DELETE
            
    **URL:**
        http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/contentitem
            
    **Request body:**
        {
             id: "0123456789"
        }
    

 
**Parameters**
 
|Parameter|Value|
|:--------|:----|
|param|The name of the parent collection.|
|param|The name of the collection to modify.|
|param|The request in JSON format.|
 
[top](#chronozoom-rest-api-reference)
 
----------
 
