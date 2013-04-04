﻿var CZ = (function (CZ, $) {
    var Service = CZ.Service = CZ.Service || {};
    Service.Map = Service.Map || {};

    var _serviceUrl = serverUrlHost + "/chronozoom.svc/"; 

    Service.Request = function (urlBase) {
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
            if (value !== "undefined" && value !== null) {
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

    $.extend(Service.Map, {
        timeline: function (t) {
            return {
                Id: t.guid,
                ParentTimelineId: t.parent.guid,
                FromYear: t.x,
                ToYear: t.x + t.width,
                Title: t.title,
                Regime: t.regime
            };
        },

        exhibit: function (e) {
            return {
                Id: e.guid || null,
                ParentTimelineId: e.parent.guid,
                Year: e.infodotDescription.date,
                Title: e.title,
                description: undefined,
                contentItems: undefined
            };
        },

        contentItem: function (ci) {
            return {
                Id: ci.guid || null,
                ParentExhibitId: ci.parent,
                Title: ci.contentItem ? ci.contentItem.title : ci.title,
                Caption: ci.contentItem ? ci.contentItem.description : ci.description,
                Uri: ci.contentItem ? ci.contentItem.uri : ci.uri,
                MediaType: ci.contentItem ? ci.contentItem.mediaType : ci.mediaType
            };
        }
    });

    $.extend(Service, {
        // NOTE: Set to sandbox for debug purposes.
        collectionName: "sandbox",
        superCollectionName: "sandbox",

        /**
         * Chronozoom.svc Requests.
         */
        
        // .../get?supercollection=&collection=
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

        // .../gettimelines?supercollection=&collection=&start=&end=&minspan=&lca=
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

        /**
         * Information Retrieval.
         */
        
        // .../{supercollection}/collections
        // NOTE: Not implemented in current API.
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

        // .../{supercollection}/{collection}/structure?start=&end=&minspan=&lca=
        // NOTE: Not implemented in current API.
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

        // .../{supercollection}/{collection}/data
        // NOTE: Not implemented in current API.
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

        /**
         * Information Modification.
         */

        // .../{supercollection}/{collection}
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

        // .../{supercollection}/{collection}
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

        // .../{supercollection}/{collection}/timeline
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
                data: JSON.stringify(Service.Map.timeline(t))
            });
        },

        // .../{supercollection}/{collection}/timeline
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
                data: JSON.stringify(Service.Map.timeline(t))
            });
        },

        // .../{supercollection}/{collection}/exhibit
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
                data: JSON.stringify(Service.Map.exhibit(e))
            });
        },

        // .../{supercollection}/{collection}/exhibit
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
                data: JSON.stringify(Service.Map.exhibit(e))
            });
        },

        // .../{supercollection}/{collection}/contentitem
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
                data: JSON.stringify(Service.Map.contentItem(ci))
            });
        },

        // .../{supercollection}/{collection}/contentitem
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
                data: JSON.stringify(Service.Map.contentItem(ci))
            });
        },

        /**
         * Auxiliary Methods.
         */
        
        putExhibitContent: function (e, oldContentItems) {
            var newGuids = e.contentItems.map(function (ci) {
                return ci.guid;
            });

            // Send PUT request for all exhibit's content items.
            var promises = e.contentItems.map(
                function (ci) {
                    return Service.putContentItem(ci);
                }
            ).concat(
                // Filter deleted content items and send DELETE request for them.
                oldContentItems.filter(
                    function (ci) {
                        return (newGuids.indexOf(ci.guid) === -1);
                    }
                ).map(
                    function (ci) {
                        return Service.deleteContentItem(ci);
                    }
                )
            );

            return $.when.apply($, promises);
        }
    });

    return CZ;
})(CZ || {}, jQuery);
