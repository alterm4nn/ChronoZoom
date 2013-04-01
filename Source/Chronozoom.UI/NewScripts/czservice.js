var CZ = (function (CZ, $) {
    var Service = CZ.Service = CZ.Service || {};
    Service.Map = Service.Map || {};

    var _serviceUrl = serverUrlBase + "/Chronozoom.svc/"; 

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
        collectionName: null,
        superCollectionName: null,

        /**
         * Chronozoom.svc Requests.
         */

        getTimelines: function (r) {
            var request = new Service.Request(_serviceUrl + "GetTimelines");
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
        
        getCollections: function () {
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: _serviceUrl + "collections"
            });
        },

        getStructure: function (r) {
            var request = new Service.Request(_serviceUrl + "Structure");
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
                url: _serviceUrl + Service.collectionName + "/Data",
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
                url: _serviceUrl + c.name,
                data: JSON.stringify(c)
            });
        },

        deleteCollection: function (c) {
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: _serviceUrl + c.name,
                data: JSON.stringify(c)
            });
        },

        putTimeline: function (t) {
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: _serviceUrl + Service.collectionName + "/Timeline",
                data: JSON.stringify(Service.Map.timeline(t))
            });
        },

        deleteTimeline: function (t) {
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: _serviceUrl + Service.collectionName + "/Timeline",
                data: JSON.stringify(Service.Map.timeline(t))
            });
        },

        putExhibit: function (e) {
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: _serviceUrl + Service.collectionName + "/Exhibit",
                data: JSON.stringify(Service.Map.exhibit(e))
            });
        },

        putExhibitWithContent: function (e, oldContentItems) {
            var newIds = e.contentItems.map(function (ci) {
                return ci.id;
            });

            // Send PUT request for exhibit.
            var promises = [ Service.putExhibit(e) ].concat(
                // Send PUT request for all its content items.
                e.contentItems.map(
                    function (ci) {
                        return Service.putContentItem(ci);
                    }
                )
            ).concat(
                // Filter deleted content items and send DELETE request for them.
                oldContentItems.filter(
                    function (ci) {
                        return (newIds.indexOf(ci.id) === -1);
                    }
                ).map(
                    function (ci) {
                        return Service.deleteContentItem(ci);
                    }
                )
            );

            return $.when.apply($, promises);
        },

        deleteExhibit: function (e) {
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: _serviceUrl + Service.collectionName + "/Exhibit",
                data: JSON.stringify(Service.Map.exhibit(e))
            });
        },

        putContentItem: function (ci) {
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: _serviceUrl + Service.collectionName + "/ContentItem",
                data: JSON.stringify(Service.Map.contentItem(ci))
            });
        },

        deleteContentItem: function (ci) {
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: _serviceUrl + Service.collectionName + "/ContentItem",
                data: JSON.stringify(Service.Map.contentItem(ci))
            });
        }
    });

    return CZ;
})(CZ || {}, jQuery);