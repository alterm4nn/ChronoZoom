# ChronoZoom REST API Reference #

The ChronoZoom Representational State Transfer (REST) API makes it possible to programmatically access content within a given ChronoZoom deployment. Content is made available on a read-only basis, and is returned in JavaScript Object Notation (JSON) format. This document describes how to make REST **GET** requests against ChronoZoom.

## Contents ##
- Request URL Syntax
- ChronoZoom REST Commands
    - [Get](#get)
    - GetThresholds
    - Search
    - GetBibliography
    - GetTours
    - GetSuperCollection


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
