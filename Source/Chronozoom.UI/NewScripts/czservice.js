var CZ;
(function (CZ) {
    (function (Service) {
        var Map;
        (function (Map) {
            function timeline(t) {
                return {
                    id: t.guid,
                    ParentTimelineId: t.parent.guid,
                    FromYear: t.x,
                    ToYear: typeof t.endDate !== 'undefined' ? t.endDate : (t.x + t.width),
                    title: t.title,
                    Regime: t.regime
                };
            }
            Map.timeline = timeline;
            function exhibit(e) {
                return {
                    id: e.guid,
                    ParentTimelineId: e.parent.guid,
                    Year: e.infodotDescription.date,
                    title: e.title,
                    description: undefined,
                    contentItems: undefined
                };
            }
            Map.exhibit = exhibit;
            function contentItem(ci) {
                return {
                    id: ci.guid,
                    ParentExhibitId: ci.contentItem ? ci.contentItem.ParentExhibitId : ci.parent,
                    title: ci.contentItem ? ci.contentItem.title : ci.title,
                    description: ci.contentItem ? ci.contentItem.description : ci.description,
                    uri: ci.contentItem ? ci.contentItem.uri : ci.uri,
                    mediaType: ci.contentItem ? ci.contentItem.mediaType : ci.mediaType,
                    attribution: ci.contentItem ? ci.contentItem.attribution : ci.attribution,
                    mediaSource: ci.contentItem ? ci.contentItem.mediaSource : ci.mediaSource
                };
            }
            Map.contentItem = contentItem;
        })(Map || (Map = {}));
        var _serviceUrl = CZ.Settings.serverUrlHost + "/chronozoom.svc/";
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
                if(value !== undefined && value !== null) {
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
        Service.collectionName = "sandbox";
        Service.superCollectionName = "sandbox";
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
        function putExhibitContent(e, oldContentItems) {
            var newGuids = e.contentItems.map(function (ci) {
                return ci.guid;
            });
            var promises = e.contentItems.map(function (ci) {
                return putContentItem(ci);
            }).concat(oldContentItems.filter(function (ci) {
                return (ci.guid && newGuids.indexOf(ci.guid) === -1);
            }).map(function (ci) {
                return deleteContentItem(ci);
            }));
            return $.when.apply($, promises);
        }
        Service.putExhibitContent = putExhibitContent;
        function putProfile(username, display_name, email) {
            var request = new Service.Request(_serviceUrl);
            request.addToPath("profile");
            return $.ajax({
                type: "PUT",
                cache: false,
                dataType: "json",
                url: request.url,
                data: JSON.stringify({
                })
            });
        }
        Service.putProfile = putProfile;
        function deleteProfile(username) {
            var request = new Service.Request(_serviceUrl);
            request.addToPath("profile");
            return $.ajax({
                type: "DELETE",
                cache: false,
                dataType: "json",
                url: request.url,
                data: JSON.stringify({
                })
            });
        }
        Service.deleteProfile = deleteProfile;
    })(CZ.Service || (CZ.Service = {}));
    var Service = CZ.Service;
})(CZ || (CZ = {}));
