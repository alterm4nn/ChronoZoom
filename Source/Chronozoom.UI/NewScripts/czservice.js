/// <reference path='cz.settings.ts'/>
/// <reference path='typings/jquery/jquery.d.ts'/>
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
        Service.Request = Request;
        ;
        // NOTE: Set to sandbox for debug purposes.
        Service.collectionName = "sandbox";
        Service.superCollectionName = "sandbox";
        /**
        * Chronozoom.svc Requests.
        */
        // .../get?supercollection=&collection=
        function get() {
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
        }
        Service.get = get;
        // .../gettimelines?supercollection=&collection=&start=&end=&minspan=&lca=
        function getTimelines(r) {
            var request = new Request(_serviceUrl);
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
        }
        Service.getTimelines = getTimelines;
        /**
        * Information Retrieval.
        */
        // .../{supercollection}/collections
        // NOTE: Not implemented in current API.
        function getCollections() {
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath("collections");
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getCollections = getCollections;
        // .../{supercollection}/{collection}/structure?start=&end=&minspan=&lca=
        // NOTE: Not implemented in current API.
        function getStructure(r) {
            var request = new Request(_serviceUrl);
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
        }
        Service.getStructure = getStructure;
        // .../{supercollection}/{collection}/data
        // NOTE: Not implemented in current API.
        function postData(r) {
            var request = new Request(_serviceUrl);
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
        }
        Service.postData = postData;
        /**
        * Information Modification.
        */
        // .../{supercollection}/{collection}
        function putCollection(c) {
            var request = new Request(_serviceUrl);
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
        }
        Service.putCollection = putCollection;
        // .../{supercollection}/{collection}
        function deleteCollection(c) {
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(c.name);
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(c)
            });
        }
        Service.deleteCollection = deleteCollection;
        // .../{supercollection}/{collection}/timeline
        function putTimeline(t) {
            var request = new Request(_serviceUrl);
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
        }
        Service.putTimeline = putTimeline;
        // .../{supercollection}/{collection}/timeline
        function deleteTimeline(t) {
            var request = new Request(_serviceUrl);
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
        }
        Service.deleteTimeline = deleteTimeline;
        // .../{supercollection}/{collection}/exhibit
        function putExhibit(e) {
            var request = new Request(_serviceUrl);
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
        }
        Service.putExhibit = putExhibit;
        // .../{supercollection}/{collection}/exhibit
        function deleteExhibit(e) {
            var request = new Request(_serviceUrl);
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
        }
        Service.deleteExhibit = deleteExhibit;
        // .../{supercollection}/{collection}/contentitem
        function putContentItem(ci) {
            var request = new Request(_serviceUrl);
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
        }
        Service.putContentItem = putContentItem;
        // .../{supercollection}/{collection}/contentitem
        function deleteContentItem(ci) {
            var request = new Request(_serviceUrl);
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
        }
        Service.deleteContentItem = deleteContentItem;
        /**
        * Auxiliary Methods.
        */
        function putExhibitContent(e, oldContentItems) {
            var newGuids = e.contentItems.map(function (ci) {
                return ci.guid;
            });
            // Send PUT request for all exhibit's content items.
            var promises = e.contentItems.map(function (ci) {
                return putContentItem(ci);
            }).concat(// Filter deleted content items and send DELETE request for them.
            oldContentItems.filter(function (ci) {
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
