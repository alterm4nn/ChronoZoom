var CZ = (function (CZ, $) {
    var Service = CZ.Service = CZ.Service || {};
    Service.Map = Service.Map || {};

    Service.Request = function (urlBase) {
        var _url = urlBase;
        var _hasParameters = false;

        Object.defineProperty(this, "url", {
            configurable: false,
            get: function () {
                return _url;
            }
        });

        this.addParameter = function (name, value) { 
            if (value !== "undefined") {
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
                id: t.guid,
                parent: t.parent.guid,
                start: t.x,
                end: t.x + t.width,
                title: t.title,
                exhibits: undefined,
                timelines: undefined
            };
        },

        exhibit: function (e) {
            return {
                id: e.guid,
                parent: e.parent.guid,
                time: e.infodotDescription.date,
                title: e.title,
                description: undefined,
                contentItems: e.contentItems
            };
        },

        contentItem: function (ci) {
            return {
                id: ci.id,
                parent: ci.parent.id,
                title: ci.title,
                description: ci.description,
                uri: ci.uri,
                mediaType: ci.mediaType
            };
        }
    });

    $.extend(Service, {
        collectionName: "collection",

        /**
         * Information Retrieval.
         */
        
        getCollections: function () {
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: serverUrlBase + "/api/collections"
            });
        },

        getStructure: function (r) {
            var request = new Service.Request(serverUrlBase + "/ChronoZoom.svc/GetTimelines");
            request.addParameters(r);

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        },

        postData: function (r) {
            return $.ajax({
                type: "POST",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: serverUrlBase + "/api/" + Service.collectionName + "/Data",
                data: JSON.stringify(r)
            });
        },

        /**
         * Information Modification.
         */

        putCollection: function (c) {
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: serverUrlBase + "/api/" + c.name,
                data: JSON.stringify(c)
            });
        },

        deleteCollection: function (c) {
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: serverUrlBase + "/api/" + c.name,
                data: JSON.stringify(c)
            });
        },

        putTimeline: function (t) {
            // NOTE: Consider three cases on the server side:
            //       1. GUID === null => Generate GUID on the server side.
            //       2. GUID !== null && isNew(GUID) => ...?
            //       3. GUID !== null && !isNew(GUID) => Update timeline with this GUID.
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: serverUrlBase + "/api/" + Service.collectionName + "/Timeline",
                data: JSON.stringify(Service.Map.timeline(t))
            });
        },

        // TODO: According to spec the only parameter should be an id.
        deleteTimeline: function (t) {
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: serverUrlBase + "/api/" + Service.collectionName + "/Timeline",
                data: JSON.stringify({
                    id: t.guid,
                    parent: t.parent.guid
                })
            });
        },

        putExhibit: function (e) {
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: serverUrlBase + "/api/" + Service.collectionName + "/Exhibit",
                data: JSON.stringify(Service.Map.exhibit(e))
            });
        },

        deleteExhibit: function (e) {
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: serverUrlBase + "/api/" + Service.collectionName + "/Exhibit",
                data: JSON.stringify({
                    id: e.guid,
                    parent: e.parent.guid
                })
            });
        },

        putContentItem: function (ci) {
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: serverUrlBase + "/api/" + Service.collectionName + "/ContentItem",
                data: JSON.stringify(Service.Map.contentItem(ci))
            });
        },

        deleteContentItem: function (ci) {
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: serverUrlBase + "/api/" + Service.collectionName + "/ContentItem",
                data: JSON.stringify({
                    id: ci.id,
                    parent: ci.parent
                })
            });
        }
    });

    return CZ;
})(CZ || {}, jQuery);