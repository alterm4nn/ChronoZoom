# ChronoZoom REST API Reference #

The ChronoZoom Representational State Transfer (REST) API makes it possible to programmatically access content within a given ChronoZoom deployment. Content is made available on a read-only basis, and is returned in JavaScript Object Notation (JSON) format. This document describes how to make REST **GET** requests against ChronoZoom.

## Contents ##
- [Request URL Syntax](#request-url-syntax)
- ChronoZoom REST Commands
    - [GetTimelines](#gettimelines)
    - [GetThresholds](#getthresholds)
    - [Search](#search)
    - [GetBibliography](#getbibliography)
    - [GetTours](#gettours)
    - [PutUser](#putuser)
    - [PutCollectionName](#putcollectionname)
    - [DeleteCollection](#deletecollection)
    - [PutTimeline](#puttimeline)
    - [DeleteTimeline](#deletetimeline)
    - [PutExhibit](#putexhibit)
    - [DeleteExhibit](#deleteexhibit)
    - [PutContentItem](#putcontentitem)
    - [DeleteContentItem](#deletecontentitem)


## Request URL Syntax ##
All requests utilize the **GET**, **PUT** and **DELETE** HTTP verbs, and must be structured using the following URL syntax:

    http://[site URL]/chronozoom.svc/[command]?[parameter]=[value]&[parameter]=[value]

For example:

    http://chronozoomproject.org/chronozoom.svc/Get?start=-1&end=2013.0&timespan=10

## ChronoZoom REST Commands ##

### GetTimelines ###

**HTTP**
    http://chronozoomproject.org/chronozoom.svc/GetTimelines?collection=myCollection&start=1974&end=2013

**Parameters**

|Parameter|Type|Value|Required|
|:--------|:---|:----|:-------|
|supercollection|string|Name of the supercollection to query.|No|
|collection|string|Name of the collection to query.|No|
|start|float|Year at which to begin the search, between -20000000000 and 9999.|Yes|
|end|float|Year at which to end the search, between -20000000000 and 9999.|Yes|
|minspan|string|Filters the search results to a particular time scale.|Yes|
|lca|string|Least Common Ancestor, a timeline identifier used to hint the server to retrieve timelines close to this location.|No|
|maxElements|int|The maximum number of elements to return|Yes|

**Example Result Data**
!!! Todo: Add examples. !!!

[top](#chronozoom-rest-api-reference)
----------
### GetThresholds ###
Use the **GetThresholds** command to return the time thresholds that have been defined for a ChronoZoom instance.

**HTTP**
    http://chronozoomproject.org/chronozoom.svc/GetThresholds

**Parameters**

This command has no parameters.

**Example Result Data**

    {
       "d":[
          {
             "__type":"Threshold:#Chronozoom.Entities",
             "BookmarkRelativePath":"\/t55\/e33@x=0&y=0&w=1.6270949720670398&h=1.0558659217877098",
             "Description":"The beginning of everything: What happened during the Big Bang and the early stages of the Universe. ",
             "ThresholdDay":0,
             "ThresholdMonth":0,
             "ThresholdTimeUnit":"Ga",
             "ThresholdYear":13.7000,
             "Title":"1. Origins of the Universe"
          },
          {
             "__type":"Threshold:#Chronozoom.Entities",
             "BookmarkRelativePath":"\/t55\/e118@x=0&y=-4.3507039982036953e-16&w=1.6270949720670396&h=1.0558659217877095",
             "Description":"Threshold 2: The Stars Light Up: Stars became the first stable, complex entities to exist in the Universe. This threshold examines the conditions that led up to the first stars lighting up.",
             "ThresholdDay":0,
             "ThresholdMonth":0,
             "ThresholdTimeUnit":"Ga",
             "ThresholdYear":13.5000,
             "Title":"2. Origins of the First Stars"
          },
          {
             "__type":"Threshold:#Chronozoom.Entities",
             "BookmarkRelativePath":"\/t55\/e134@x=3.828619518419252e-14&y=0&w=1.627094972067061&h=1.0558659217877238",
             "Description":"Threshold 3: Dying stars generate temperatures high enough to create entirely new elements. Only very big stars create temperatures high enough to create the rest of the elements.",
             "ThresholdDay":0,
             "ThresholdMonth":0,
             "ThresholdTimeUnit":"Ga",
             "ThresholdYear":12.0000,
             "Title":"3. Origins of Chemical Complexity"
          },
          {
             "__type":"Threshold:#Chronozoom.Entities",
             "BookmarkRelativePath":"\/t55\/t174\/e135@x=-3.7948725260060514e-11&y=-6.713022027547824e-12&w=1.6270949720655796&h=1.0558659217867623",
             "Description":"Threshold 4: Elements link up to form more complex molecules. These new materials were necessary for creating our solar system.  ",
             "ThresholdDay":0,
             "ThresholdMonth":0,
             "ThresholdTimeUnit":"Ga",
             "ThresholdYear":4.5600,
             "Title":"4. Origins of the Earth and Solar System"
          },
          {
             "__type":"Threshold:#Chronozoom.Entities",
             "BookmarkRelativePath":"\/t55\/t174\/t66\/e136@x=2.1278858184814453e-12&y=-3.324449062347412e-12&w=1.627094972067812&h=1.055865921788211",
             "Description":"Threshold 5 introduces DNA and Charles Darwin's work on the theory of evolution, as well as the Goldilocks Conditions necessary for life to form and prosper.",
             "ThresholdDay":0,
             "ThresholdMonth":0,
             "ThresholdTimeUnit":"Ga",
             "ThresholdYear":3.8000,
             "Title":"5. Origins of life"
          },
          {
             "__type":"Threshold:#Chronozoom.Entities",
             "BookmarkRelativePath":"\/t55\/t174\/t66\/t46\/e137@x=2.8049244600183825e-12&y=-7.012311150045956e-13&w=1.370418848167538&h=1.0523560209424072",
             "Description":"Threshold 6: A mass extinction 65 million years ago was followed by an increase in biodiversity. Mammals flourished, including our ancestors. ",
             "ThresholdDay":0,
             "ThresholdMonth":0,
             "ThresholdTimeUnit":"Ma",
             "ThresholdYear":7.0000,
             "Title":"6. Origins of human beings"
          },
          {
             "__type":"Threshold:#Chronozoom.Entities",
             "BookmarkRelativePath":"\/t55\/t174\/t66\/t46\/e138@x=5.609848920036765e-12&y=-2.1036933450137866e-12&w=1.3704188481675372&h=1.0523560209424068",
             "Description":"Threshold 7: Agriculture, the cultivation of animals, plants for products used to sustain life is a key component in the rise of sedentary human civilization. ",
             "ThresholdDay":0,
             "ThresholdMonth":0,
             "ThresholdTimeUnit":"ka",
             "ThresholdYear":11.0000,
             "Title":"7. Origins of agriculture"
          },
          {
             "__type":"Threshold:#Chronozoom.Entities",
             "BookmarkRelativePath":"\/t55\/t174\/t66\/t46\/t361\/t364\/t377\/t161\/e139",
             "Description":"Threshold 8: The birth of global exchange networks, competitive markets, and increasing use of energy have accelerated the pace of change.",
             "ThresholdDay":0,
             "ThresholdMonth":0,
             "ThresholdTimeUnit":"CE",
             "ThresholdYear":1000.0000,
             "Title":"8. Origins of modern world"
          }
       ]
    }


[top](#chronozoom-rest-api-reference)

----------
### Search ###
Use the **Search** command to search for a specific term within a collection or a supercollection.

**HTTP**
    http://chronozoomproject.org/chronozoom.svc/Search?searchTerm=Pluto

**Parameters**

|Parameter|Type|Value|Required|
|:--------|:---|:----|:-------|
|supercollection|string|Name of the supercollection to query.|No|
|collection|string|Name of the collection to query.|No|
|searchTerm|string|The term to search for.|Yes|

**Example Result Data**

!!! Todo: Need example data. !!!

[top](#chronozoom-rest-api-reference)

----------
### GetBibliography ###
Use the **GetBibliography** command to return the bibliography for a given exhibit.

**HTTP**
    http://chronozoomproject.org/chronozoom.svc/GetBibliography?exhibitId=[id]

**Parameters**

|Parameter|Type|Value|Required|
|:--------|:---|:----|:-------|
|exhibitId|string|ID of the exhibit.|Yes|

**Example Result Data**

!!! Todo: Need example data. !!!

[top](#chronozoom-rest-api-reference)

----------
### GetTours ###
Use the **GetTours** command to return a list of tours for a given collection or supercollection.
!!! Todo: The parameter doesn't seem to have an effect on this command. Why? !!!

**HTTP**
    http://chronozoomproject.org/chronozoom.svc/GetTours?collection=Chronozoom.Entities

**Parameters**

|Parameter|Type|Value|Required|
|:--------|:---|:----|:-------|
|supercollection|string|Name of the supercollection to query.|No|
|collection|string|Name of the collection to query.|No|

**Example Result Data**
!!! Todo: Add examples. !!!

[top](#chronozoom-rest-api-reference)

----------
### PutUser ###
Updates user information and associated personal collection.

**HTTP**
    http://chronozoomproject.org/chronozoom.svc/PutUser?User=aUser

**Parameters**

|Parameter|Type|Value|Required|
|:--------|:---|:----|:-------|
|User|string|User information to update.|Yes|

**Returns**
The URL for the new user collection.

[top](#chronozoom-rest-api-reference)

----------
### PutCollectionName ###
Creates a new collection on behalf of the authenticated user.

If a collection of the specified name does not exist then a new collection is created. If the collection exists and the authenticated user is the author then the collection is modified. If no author is registered then the authenticated user is set as the author. The title field can't be modified because it is part of the URL (the URL can be indexed).

**HTTP**
    http://chronozoomproject.org/chronozoom.svc/PutCollectionName?collectionName=myCollection

**Parameters**

|Parameter|Type|Value|Required|
|:--------|:---|:----|:-------|
|collectionName|The markup for the collection to create, in JSON format.|string|Yes|
|superCollectionName|Name of the supercollection beneath which to create the specified collection.|string|Yes|
|collectionRequest|The changes that will be applied to the specified collection.|string|Yes|

**Returns**
A GUID representing the ID for the newly created collection.

**Example Result Data**
!!! Todo: Add examples. !!!

[top](#chronozoom-rest-api-reference)

----------
### DeleteCollection ###
Deletes the specified collection.

**HTTP**
    http://chronozoomproject.org/chronozoom.svc/DeleteCollection?collectionName=myOldCollection

**Parameters**

|Parameter|Type|Value|Required|
|:--------|:---|:----|:-------|
|collectionName|The name of the collection to delete.|string|Yes|
|superCollectionName|The name of the supercollection to which the specified collection belongs.|string|No|

**Returns**
This command does not return a value.

**Example Result Data**
!!! Todo: Add examples. !!!

[top](#chronozoom-rest-api-reference)

----------
### PutTimeline ###
Creates or updates the timeline in a given collection. If the collection does not exist, the command will silently fail.

If a timeline id is not specified, then a new timeline is added to the collection. For a new timeline, if the parent is not defined it will be set to the root timeline. If the specified timeline identifier does not exist a "not found" status is returned. If the timeline with the specified identifier exists, then the existing timeline is updated.

**HTTP**
    http://chronozoomproject.org/chronozoom.svc/PutTimeline?collectionName=aCollection&timelineRequest=myTLdata

**Parameters**

|Parameter|Type|Value|Required|
|:--------|:---|:----|:-------|
|collectionName|The name of the collection to add or update a timeline.|string|Yes|
|superCollectionName|The name of the supercollection to which the specified collection belongs.|string|No|
|timelineRequest|Raw timeline data in JSON format.|string|Yes|

**Returns**
A GUID representing the ID for the timeline that was updated/created.

**Example Result Data**
!!! Todo: Add examples. !!!

[top](#chronozoom-rest-api-reference)

----------
### DeleteTimeline ###
Deletes the timeline with the specified ID.

**HTTP**
    http://chronozoomproject.org/chronozoom.svc/DeleteTimeline?collectionName=aCollection&timelineRequest=myTLdata

**Parameters**

|Parameter|Type|Value|Required|
|:--------|:---|:----|:-------|
|collectionName|The name of the collection containing the timeline to delete.|string|Yes|
|superCollectionName|The name of the supercollection to which the specified collection belongs.|string|No|
|timelineRequest|Raw timeline data in JSON format.|string|Yes|

**Returns**
A GUID representing the ID for the timeline that was deleted.

**Example Result Data**
!!! Todo: Add examples. !!!

[top](#chronozoom-rest-api-reference)

----------
### PutExhibit ###
Creates or updates the exhibit and its content items in a given collection. If the collection does not exist, then the command will silently fail.

If an exhibit id is not specified, a new exhibit is added to the collection. If the ID for an existing exhibit is specified then the exhibit will be updated. If the exhibit ID to be updated does not exist a "not found" status is returned. If the parent timeline is not specified the exhibit is added to the root timeline.
Otherwise, the exhibit is added to the specified parent timeline. If an invalid parent timeline is specified then the request will fail. 

**HTTP**
    http://chronozoomproject.org/chronozoom.svc/PutExhibit?collectionName=myColl&exhibitRequest=myExhibitData

**Parameters**

|Parameter|Type|Value|Required|
|:--------|:---|:----|:-------|
|collectionName|The name of the collection that contains the exhibit to update, or to which a new exhibit should be added.|string|Yes|
|superCollectionName|The name of the supercollection to which the specified collection belongs.|string|No|
|exhibitRequest|Raw exhibit data in JSON format.|string|Yes|

**Returns**
The exhibit object resulting from the requested modification.

**Example Result Data**
!!! Todo: Add examples. !!!

[top](#chronozoom-rest-api-reference)

----------
### DeleteExhibit ###
Deletes the specified exhibit from the specified collection.

**HTTP**
    http://chronozoomproject.org/chronozoom.svc/DeleteExhibit?collectionName=myColl&exhibitRequest=myExhibitData

**Parameters**

|Parameter|Type|Value|Required|
|:--------|:---|:----|:-------|
|collectionName|The name of the collection containing the exhibit to be deleted.|string|Yes|
|superCollectionName|The name of the supercollection to which the specified collection belongs.|string|No|
|exhibitRequest|Raw exhibit data in JSON format.|string|Yes|

**Returns**
None.

[top](#chronozoom-rest-api-reference)

----------
### PutContentItem ###
Creates or updates the content item in a given collection. If the collection does not exist the request will silently fail.

If a content item ID is not specified then a new content item is added to the parent exhibit. 
If a valid ID is specified and the content item exists, then the existing content item is updated. 
For a new content item, if the parent exhibit is not specified then the request will fail.  
If the parent exhibit ID is invalid then the request will fail. If the content item ID does not exist a "not found" status is returned.
<!-- Todo: Perhaps instead of explaining this logic for each request type we can summarize it neatly at the top. -->

**HTTP**
    http://chronozoomproject.org/chronozoom.svc/PutContentItem?collectionName=myColl&exhibitRequest=myContentItem

**Parameters**

|Parameter|Type|Value|Required|
|:--------|:---|:----|:-------|
|collectionName|The name of the collection to which a content item will be added.|string|Yes|
|superCollectionName|The name of the supercollection to which the specified collection belongs.|string|No|
|exhibitRequest|Request body.|string|Yes|

**Returns**
The GUID of the modified content item.

[top](#chronozoom-rest-api-reference)

----------
### DeleteContentItem ###
Delete the specified content item from the specified collection.

**HTTP**
    http://chronozoomproject.org/chronozoom.svc/DeleteContentItem?collectionName=myColl&exhibitRequest=myContentItem

**Parameters**

|Parameter|Type|Value|Required|
|:--------|:---|:----|:-------|
|collectionName|The name of the collection from which a content item will be deleted.|string|Yes|
|superCollectionName|The name of the supercollection to which the specified collection belongs.|string|No|
|exhibitRequest|Request body.|string|Yes|

**Returns**
None.

[top](#chronozoom-rest-api-reference)

----------