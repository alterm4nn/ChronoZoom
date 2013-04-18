# ChronoZoom REST API Reference #

The ChronoZoom Representational State Transfer (REST) API makes it possible to programmatically access content within a given ChronoZoom deployment. Content is made available on a read-only basis, and is returned in JavaScript Object Notation (JSON) format. This document describes how to make REST **GET** requests against ChronoZoom.

!!! Todo: Are there defaults if collection/supercollection are not specified? !!!

## Contents ##
- [Request URL Syntax](#request-url-syntax)
- ChronoZoom REST Commands
    - [Get](#get)
    - [GetThresholds](#getthresholds)
    - [Search](#search)
    - [GetBibliography](#getbibliography)
    - [GetTours](#gettours)
    - [GetSuperCollection](#getsupercollection)


## Request URL Syntax ##
All requests utilize the **GET** HTTP verb, and must be structured using the following URL syntax:

    http://[site URL]/chronozoom.svc/[command]?[parameters]

For example:

    http://chronozoomproject.org/chronozoom.svc/Get?start=-1&end=2013.0&timespan=10

## ChronoZoom REST Commands ##

### Get ###
Use the **Get** command to return data within a specified range of years from a collection or a supercollection.

    Get(string supercollection, string collection, string start, string end, string timespan)

**Parameters**

|Parameter|Type|Value|Required|
|:--------|:---|:----|:-------|
|supercollection|string|Name of the supercollection to query.|No|
|collection|string|Name of the collection to query.|No|
|start|float|Year at which to begin the search, between -20000000000 and 9999.|Yes|
|end|float|Year at which to end the search, between -20000000000 and 9999.|Yes|
|timespan|int|Filters the search results to a particular length of time.|Yes|

**Example Result Data**
!!! Todo: Add examples. !!!

[top](#chronozoom-rest-api-reference)

----------
### GetThresholds ###
Use the **GetThresholds** command to return the time thresholds that have been defined for a ChronoZoom instance.

**Syntax**
    GetThresholds()

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

**Syntax**
    Search(string supercollection, string collection, string searchTerm)

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

**Syntax**
    GetBibliography(string exhibitId)

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

**Syntax**
    GetTours(string supercollection, string collection)

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
### GetSuperCollection ###
Use the **GetSuperCollection** command to return the top supercollection for a given ChronoZoom deployment.
!!! Todo: I am just guessing here, what does this really do? !!!

**Syntax**
    GetSuperCollection()

**HTTP**
    http://chronozoomproject.org/chronozoom.svc/GetSuperCollection

**Parameters**
This command has no parameters.

**Example Result Data**

    {
       "d":{
          "__type":"SuperCollection:#Chronozoom.Entities",
          "Collections":[
             {
                "__type":"Collection:#Chronozoom.Entities",
                "Id":"33ab754a-8252-4b98-82c8-bda86c14ac1a",
                "Title":"TestUser",
                "UserId":"TestUser"
             }
          ],
          "Id":"c6689c5d-0ec5-d0d3-2a2f-cf54f63993b6",
          "Title":"TestUser",
          "UserId":"TestUser"
       }
    }


[top](#chronozoom-rest-api-reference)