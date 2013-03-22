# ChronoZoom REST API Reference #

The ChronoZoom Representational State Transfer (REST) API makes it possible to programmatically access content within a given ChronoZoom deployment. Content is made available on a read-only basis, and is returned in JavaScript Object Notation (JSON) format. This document describes how to make REST **GET** requests against ChronoZoom.

## Contents ##
- Request URL Syntax
- ChronoZoom REST Commands
    - Get
    - GetThresholds
    - Search
    - GetBibliography
    - GetTours
    - GetSuperCollection


## Request URL Syntax ##
All requests utilize the **GET** HTTP verb, and must be structured using the following URL syntax:

    http://[site URL]/chronozoom.svc/[command]

## ChronoZoom REST Commands ##

### Get ###


    public IEnumerable<Timeline> Get(string supercollection, string collection, string start, string end, string timespan)