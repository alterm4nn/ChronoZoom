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
