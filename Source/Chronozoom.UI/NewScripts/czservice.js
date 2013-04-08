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
    };
    $.extend(Service.Map, {
        timeline: function (t) {
            return {
                id: t.guid,
                ParentTimelineId: t.parent.guid,
                FromYear: t.x,
                ToYear: t.x + t.width,
                title: t.title,
                Regime: t.regime
            };
        },
        exhibit: function (e) {
            return {
                id: e.guid || null,
                ParentTimelineId: e.parent.guid,
                Year: e.infodotDescription.date,
                title: e.title,
                description: undefined,
                contentItems: undefined
            };
        },
        contentItem: function (ci) {
            return {
                id: ci.guid || null,
                ParentExhibitId: ci.parent,
                title: ci.contentItem ? ci.contentItem.title : ci.title,
                description: ci.contentItem ? ci.contentItem.description : ci.description,
                uri: ci.contentItem ? ci.contentItem.uri : ci.uri,
                mediaType: ci.contentItem ? ci.contentItem.mediaType : ci.mediaType
            };
        }
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
        putExhibitContent: function (e, oldContentItems) {
            var newGuids = e.contentItems.map(function (ci) {
                return ci.guid;
            });
            var promises = e.contentItems.map(function (ci) {
                return Service.putContentItem(ci);
            }).concat(oldContentItems.filter(function (ci) {
                return (newGuids.indexOf(ci.guid) === -1);
            }).map(function (ci) {
                return Service.deleteContentItem(ci);
            }));
            return $.when.apply($, promises);
        }
    });
    return CZ;
})(CZ || {
}, jQuery);
