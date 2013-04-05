var CZ = (function (CZ, $) {
    var Service = CZ.Service = CZ.Service || {
    };
    Service.Map = Service.Map || {
    };
    var _serviceUrl = serverUrlBase + "/chronozoom.svc/";
    Service.Request = function (urlBase) {
        var _url = urlBase;
        var _hasParameters = false;
        Object.defineProperty(this, "url", {
            configurable: false,
            get: function () {
                return _url;
var CZ;
(function (CZ) {
    (function (Service) {
        var Map;
        (function (Map) {
            function timeline(t) {
                return {
                    Id: t.guid,
                    ParentTimelineId: t.parent.guid,
                    FromYear: t.x,
                    ToYear: t.x + t.width,
                    Title: t.title,
                    Regime: t.regime
                };
var CZ = (function (CZ, $) {
    var Service = CZ.Service = CZ.Service || {
    };
    Service.Map = Service.Map || {
    };
    var _serviceUrl = serverUrlHost + "/chronozoom.svc/";
    Service.Request = function (urlBase) {
        var _url = urlBase;
        var _hasParameters = false;
        Object.defineProperty(this, "url", {
            configurable: false,
            get: function () {
                return _url;
            }
            Map.timeline = timeline;
            function exhibit(e) {
                return {
                    Id: e.guid || null,
                    ParentTimelineId: e.parent.guid,
                    Year: e.infodotDescription.date,
                    Title: e.title,
                    description: undefined,
                    contentItems: undefined
                };
            }
            Map.exhibit = exhibit;
            function contentitem(ci) {
                return {
                    Id: ci.guid || null,
                    ParentExhibitId: ci.parent,
                    Title: ci.contentItem ? ci.contentItem.title : ci.title,
                    Caption: ci.contentItem ? ci.contentItem.description : ci.description,
                    Uri: ci.contentItem ? ci.contentItem.uri : ci.uri,
                    MediaType: ci.contentItem ? ci.contentItem.mediaType : ci.mediaType
                };
            }
            Map.contentitem = contentitem;
        })(Map || (Map = {}));
        var Settings = CZ.Settings;
        var _serviceUrl = Settings.serverUrlBase + "/chronozoom.svc/";
        function Request(urlBase) {
            var _url = urlBase;
            var _hasParameters = false;
            Object.defineProperty(this, "url", {
                configurable: false,
                get: function () {
                    return _url;
                }
            });
            this.addToPath = function (item) {
                if(item) {
                    _url += _url.match(/\/$/) ? item : "/" + item;
                }
            };
            this.addParameter = function (name, value) {
                if(value !== "undefined" && value !== null) {
                    _url += _hasParameters ? "&" : "?";
                    _url += name + "=" + value;
                    _hasParameters = true;
                }
            };
            this.addParameters = function (params) {
                for(var p in params) {
                    if(params.hasOwnProperty(p)) {
                        this.addParameter(p, params[p]);
                    }
                }
            };
        }
    });
    $.extend(Service, {
        collectionName: // NOTE: Set to sandbox for debug purposes.
        "sandbox",
        superCollectionName: "sandbox",
        get: /**
        * Chronozoom.svc Requests.
        */
        // .../get?supercollection=&collection=
        function () {
        Service.Request = Request;
        ;
        Service.collectionName = "sandbox";
        Service.superCollectionName = "sandbox";
        function get() {
    });
    $.extend(Service, {
        collectionName: "sandbox",
        superCollectionName: "sandbox",
        get: function () {
            var request = new Service.Request(_serviceUrl);
            request.addToPath("get");
            request.addParameter("supercollection", CZ.Service.superCollectionName);
            request.addParameter("collection", CZ.Service.collectionName);
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        },
        getTimelines: // .../gettimelines?supercollection=&collection=&start=&end=&minspan=&lca=
        function (r) {
            var request = new Service.Request(_serviceUrl);
        }
        Service.get = get;
        function getTimelines(r) {
            var request = new Request(_serviceUrl);
        },
        getTimelines: function (r) {
            var request = new Service.Request(_serviceUrl);
            request.addToPath("gettimelines");
            request.addParameter("supercollection", Service.superCollectionName);
            request.addParameter("collection", Service.collectionName);
            request.addParameters(r);
            console.log("[GET] " + request.url);
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        },
        getCollections: /**
        * Information Retrieval.
        */
        // .../{supercollection}/collections
        // NOTE: Not implemented in current API.
        function () {
            var request = new Service.Request(_serviceUrl);
        }
        Service.getTimelines = getTimelines;
        function getCollections() {
            var request = new Request(_serviceUrl);
        },
        getCollections: function () {
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath("collections");
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        },
        getStructure: // .../{supercollection}/{collection}/structure?start=&end=&minspan=&lca=
        // NOTE: Not implemented in current API.
        function (r) {
            var request = new Service.Request(_serviceUrl);
        }
        Service.getCollections = getCollections;
        function getStructure(r) {
            var request = new Request(_serviceUrl);
        },
        getStructure: function (r) {
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("structure");
            request.addParameters(r);
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        },
        postData: // .../{supercollection}/{collection}/data
        // NOTE: Not implemented in current API.
        function (r) {
            var request = new Service.Request(_serviceUrl);
        }
        Service.getStructure = getStructure;
        function postData(r) {
            var request = new Request(_serviceUrl);
        },
        postData: function (r) {
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("data");
            return $.ajax({
                type: "POST",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(r)
            });
        },
        putCollection: /**
        * Information Modification.
        */
        // .../{supercollection}/{collection}
        function (c) {
            var request = new Service.Request(_serviceUrl);
        }
        Service.postData = postData;
        function putCollection(c) {
            var request = new Request(_serviceUrl);
        },
        putCollection: function (c) {
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(c.name);
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(c)
            });
        },
        deleteCollection: // .../{supercollection}/{collection}
        function (c) {
            var request = new Service.Request(_serviceUrl);
        }
        Service.putCollection = putCollection;
        function deleteCollection(c) {
            var request = new Request(_serviceUrl);
        },
        deleteCollection: function (c) {
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(c.name);
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(c)
            });
        },
        putTimeline: // .../{supercollection}/{collection}/timeline
        function (t) {
            var request = new Service.Request(_serviceUrl);
        }
        Service.deleteCollection = deleteCollection;
        function putTimeline(t) {
            var request = new Request(_serviceUrl);
        },
        putTimeline: function (t) {
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("timeline");
            console.log("[PUT] " + request.url);
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.timeline(t))
            });
        },
        deleteTimeline: // .../{supercollection}/{collection}/timeline
        function (t) {
            var request = new Service.Request(_serviceUrl);
        }
        Service.putTimeline = putTimeline;
        function deleteTimeline(t) {
            var request = new Request(_serviceUrl);
        },
        deleteTimeline: function (t) {
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("timeline");
            console.log("[DELETE] " + request.url);
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(Map.timeline(t))
            });
        },
        putExhibit: // .../{supercollection}/{collection}/exhibit
        function (e) {
            var request = new Service.Request(_serviceUrl);
        }
        Service.deleteTimeline = deleteTimeline;
        function putExhibit(e) {
            var request = new Request(_serviceUrl);
        },
        putExhibit: function (e) {
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("exhibit");
            console.log("[PUT] " + request.url);
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.exhibit(e))
            });
        },
        deleteExhibit: // .../{supercollection}/{collection}/exhibit
        function (e) {
            var request = new Service.Request(_serviceUrl);
        }
        Service.putExhibit = putExhibit;
        function deleteExhibit(e) {
            var request = new Request(_serviceUrl);
        },
        deleteExhibit: function (e) {
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("exhibit");
            console.log("[DELETE] " + request.url);
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(Map.exhibit(e))
            });
        },
        putContentItem: // .../{supercollection}/{collection}/contentitem
        function (ci) {
            var request = new Service.Request(_serviceUrl);
        }
        Service.deleteExhibit = deleteExhibit;
        function putContentItem(ci) {
            var request = new Request(_serviceUrl);
        },
        putContentItem: function (ci) {
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("contentitem");
            console.log("[PUT] " + request.url);
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.contentItem(ci))
            });
        },
        deleteContentItem: // .../{supercollection}/{collection}/contentitem
        function (ci) {
            var request = new Service.Request(_serviceUrl);
        }
        Service.putContentItem = putContentItem;
        function deleteContentItem(ci) {
            var request = new Request(_serviceUrl);
        },
        deleteContentItem: function (ci) {
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("contentitem");
            console.log("[DELETE] " + request.url);
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(Map.contentItem(ci))
            });
        },
        putExhibitContent: /**
        * Auxiliary Methods.
        */
        function (e, oldContentItems) {
        }
        Service.deleteContentItem = deleteContentItem;
        function putExhibitContent(e, oldContentItems) {
        },
        putExhibitContent: function (e, oldContentItems) {
            var newGuids = e.contentItems.map(function (ci) {
                return ci.guid;
            });
            var promises = e.contentItems.map(function (ci) {
                return Service.putContentItem(ci);
            }).concat(// Filter deleted content items and send DELETE request for them.
            oldContentItems.filter(function (ci) {
                return putContentItem(ci);
                return Service.putContentItem(ci);
            }).concat(oldContentItems.filter(function (ci) {
                return (newGuids.indexOf(ci.guid) === -1);
            }).map(function (ci) {
                return deleteContentItem(ci);
            }));
            return $.when.apply($, promises);
        }
        Service.putExhibitContent = putExhibitContent;
    })(CZ.Service || (CZ.Service = {}));
    var Service = CZ.Service;
})(CZ || (CZ = {}));
