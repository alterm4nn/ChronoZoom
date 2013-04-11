/// <reference path='cz.settings.ts'/>

/// <reference path='typings/jquery/jquery.d.ts'/>

module CZ {
    export module Service {

        module Map {
            export function timeline(t) {
                return {
                    id: t.guid,
                    ParentTimelineId: t.parent.guid,
                    FromYear: t.x,
                    ToYear: t.x + t.width,
                    title: t.title,
                    Regime: t.regime
                };
            }

            export function exhibit(e) {
                return {
                    id: e.guid,
                    ParentTimelineId: e.parent.guid,
                    Year: e.infodotDescription.date,
                    title: e.title,
                    description: undefined,
                    contentItems: e.contentItems.map(function (ci) {
                        return Map.contentItem(ci);
                    })
                };
            }

            export function contentItem(ci) {
                return {
                    id: ci.guid,
                    ParentExhibitId: ci.contentItem ? ci.contentItem.ParentExhibitId : ci.parent,
                    title: ci.contentItem ? ci.contentItem.title : ci.title,
                    description: ci.contentItem ? ci.contentItem.description : ci.description,
                    uri: ci.contentItem ? ci.contentItem.uri : ci.uri,
                    mediaType: ci.contentItem ? ci.contentItem.mediaType : ci.mediaType
                };
            }
        }

        var _serviceUrl = CZ.Settings.serverUrlHost + "/chronozoom.svc/";

        export function Request (urlBase) {
            var _url = urlBase;
            var _hasParameters = false;

            Object.defineProperty(this, "url", {
                configurable: false,
                get: function () {
                    return _url;
                }
            });

            this.addToPath = function (item) {
                if (item) {
                    _url += _url.match(/\/$/) ? item : "/" + item;
                }
            };

            this.addParameter = function (name, value) {
                if (value !== undefined && value !== null) {
                    _url += _hasParameters ? "&" : "?";
                    _url += name + "=" + value;
                    _hasParameters = true;
                }
            };

            this.addParameters = function (params) {
                for (var p in params) {
                    if (params.hasOwnProperty(p)) {
                        this.addParameter(p, params[p]);
                    }
                }
            };
        };

        
        // NOTE: Set to sandbox for debug purposes.
        export var collectionName = "sandbox";
        export var superCollectionName = "sandbox";

        /**
        * Chronozoom.svc Requests.
        */

        // .../get?supercollection=&collection=
        export function get () {
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

        // .../gettimelines?supercollection=&collection=&start=&end=&minspan=&lca=
        export function getTimelines (r) {
            var request = new Request(_serviceUrl);
            request.addToPath("gettimelines");
            request.addParameter("supercollection", superCollectionName);
            request.addParameter("collection", collectionName);
            request.addParameters(r);

            console.log("[GET] " + request.url);

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }

        /**
            * Information Retrieval.
            */

        // .../{supercollection}/collections
        // NOTE: Not implemented in current API.
        export function getCollections () {
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath("collections");

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }

        // .../{supercollection}/{collection}/structure?start=&end=&minspan=&lca=
        // NOTE: Not implemented in current API.
        export function getStructure (r) {
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
            request.addToPath("structure");
            request.addParameters(r);

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }

        // .../{supercollection}/{collection}/data
        // NOTE: Not implemented in current API.
        export function postData (r) {
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        /**
        * Information Modification.
        */

        // .../{supercollection}/{collection}
        export function putCollection (c) {
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
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

        // .../{supercollection}/{collection}
        export function deleteCollection (c) {
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(c.name);

            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(c)
            });
        }

        // .../{supercollection}/{collection}/timeline
        export function putTimeline (t) {
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        // .../{supercollection}/{collection}/timeline
        export function deleteTimeline (t) {
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        // .../{supercollection}/{collection}/exhibit
        // NOTE: Updates content items, but doesn't delete them.
        export function putExhibit (e) {
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        // .../{supercollection}/{collection}/exhibit
        export function deleteExhibit (e) {
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        // .../{supercollection}/{collection}/contentitem
        export function putContentItem (ci) {
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        // .../{supercollection}/{collection}/contentitem
        export function deleteContentItem (ci) {
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        /**
        * Auxiliary Methods.
        */

        export function deleteExhibitContent (e, oldContentItems) {
            var newGuids = e.contentItems.map(function (ci) {
                return ci.guid;
            });

            // Filter deleted content items and send DELETE request for them.
            var promises = oldContentItems.filter(
                function (ci) {
                    return (ci.guid && newGuids.indexOf(ci.guid) === -1);
                }
            ).map(
                function (ci) {
                    return deleteContentItem(ci);
                }
            );

            return $.when.apply($, promises);
        }
    }
}
