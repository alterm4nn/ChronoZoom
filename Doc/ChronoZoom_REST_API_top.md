# ChronoZoom REST API Reference #

The ChronoZoom Representational State Transfer (REST) API makes it possible to programmatically access content within a given ChronoZoom deployment. All request data is in JavaScript Object Notation (JSON) format. This document describes how to make REST requests against ChronoZoom.

## Request Syntax ##
ChronoZoom REST requests use standard HTTP verbs (GET, PUT, DELETE). Request URLs point to **chronozoom.svc** for the deployment, followed by the supercollection and collection names, and finally the resource type:

    http://[site URL]/chronozoom.svc/[superCollectionName]/[collectionName]/[resource]

The request body is in JSON format:
    
    {
        id: "0123456789"
    }

## Contents ##
- [ChronoZoom Entities](#chronozoom-entities)
- [ChronoZoom REST Commands](#chronozoom-rest-commands)
